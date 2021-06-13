
// Initialize Firebase
let firebaseConfig = {
  apiKey: "AIzaSyAaAx6HT1qq_mZIZLggvj8EzL5ctI0mQfA",
  authDomain: "pageone-c741e.firebaseapp.com",
  projectId: "pageone-c741e",
  storageBucket: "pageone-c741e.appspot.com",
  messagingSenderId: "752294608481",
  appId: "1:752294608481:web:2bad0f544ed9d91584b420",
  databaseURL: "https://pageone-c741e-default-rtdb.firebaseio.com/",
};
firebase.initializeApp(firebaseConfig);

import { router } from './router.js'
const setState = router.setState;

let userId = "";
// Add a new comment.
let tempArray = new Map();   // hashmap to store notes locally
let taskMap = new Map();   // map to store tasks locally
let currId = "";


let filterArr = {}; // arr to filter for specific notes

let eventArr = {};

// *********************************************
// Instantiate a Quill editor
// *********************************************
let toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']                                         // remove formatting button
];
let editor = new Quill('#editor', {
  modules: {
    toolbar: toolbarOptions
  },
  theme: 'snow'
});

// *********************************************
// state changes
// *********************************************
window.addEventListener('popstate', (e) => {
  setState(e.state, true);
});

let calendarLogo = document.querySelector('#calendar')


let calendar = document.querySelector('calendar-elem');
calendarLogo.addEventListener('click', function () {
  setState({ state: 'calendar' }, false);
  calendar.render(tempArray);
});


let homeLogo = document.getElementById('home');
homeLogo.addEventListener('click', function () {
  setState({ state: 'notes' }, false);
});

let logoutLogo = document.querySelector('#logout');

logoutLogo.addEventListener('click', function () {
  firebase.auth().signOut().then(() => {
    console.log('user signed out');
  })
  window.location.href = "login.html";
});


// *********************************************
// 'New Note' onclick
// *********************************************
let newNote = document.querySelector('button[type="new_note"]');
newNote.addEventListener('click', function () {

  // shows input form when pressing 'New Note' button, sets elements to be blank
  let form = document.getElementById("noteinput");
  form.style.display = "block";
  document.getElementById("title").value = "";
  editor.setContents('');
  document.getElementById('tag').selectedIndex = 0;

  if (document.getElementById('tagDiv') != null) {
    let tagDiv = document.getElementById('tagDiv');
    tagDiv.remove();
  }

  // get the entry and the new button to add to tempArray
  let [entry, newButton] = createNoteObject();
  tempArray.set(newButton.id, entry);

  // new note, currId should be empty
  currId = newButton.id;
});


// *********************************************
// 'Save" onclick
// *********************************************
let saveButton = document.querySelector('button[class="save"]');
saveButton.addEventListener('click', function () {
  let title = document.getElementById('title').value ? document.getElementById('title').value : "Untitled";
  let notes_list = document.getElementById('noteslist');
  let content = editor.getContents();
  let tag = document.getElementById('tag').value;

  // entry already exists, update contents only
  let entry = tempArray.get(String(currId));
  entry.title = title;
  entry.content = content;
  entry.tag = tag;

  if (tag == 'Event') {
    let eventStartDate = document.getElementById('date1').value;
    let eventStartTime = document.getElementById('time1').value;
    let eventStart = (eventStartTime == '') ? eventStartDate : eventStartDate + 'T' + eventStartTime;
    entry.eventStart = eventStart;

    let eventEndDate = document.getElementById('date2').value;
    eventEndDate = (eventEndDate == '') ? eventStartDate : eventEndDate;
    let eventEndTime = document.getElementById('time2').value;
    let eventEnd = (eventEndTime == '') ? eventEndDate : eventEndDate + 'T' + eventEndTime;
    entry.eventEnd = eventEnd;
  }

  let currButton = document.querySelector(`button[id="${currId}"]`);
  currButton.innerHTML = title;

  // save to Firebase
  firebase.database().ref().child("users/" + userId + "/entries/" + entry.firebaseID).set(entry);

  updateReminders();


});

// *********************************************
// Filter
// *********************************************
let dropMenu = document.getElementById('Notes');
dropMenu.addEventListener('change', function () {
  let buttons = document.getElementsByClassName("notes");
  for (let button of buttons) {
    let entry = tempArray.get(button.id);
    if (dropMenu.value == 'All') {
      button.style.display = "block"
    } else if (entry.tag != dropMenu.value) {
      button.style.display = "none";
    } else if (entry.tag == dropMenu.value) {
      button.style.display = "block";
    }
  }

});

// *********************************************
// 'Delete" onclick
// *********************************************
let deleteButton = document.querySelector('button[class="delete"]');
deleteButton.addEventListener('click', function () {
  // delete from Firebase
  let entry = tempArray.get(currId);
  firebase.database().ref().child("users/" + userId + "/entries/" + entry.firebaseID).remove();

  tempArray.delete(currId);
  let button = document.querySelector(`button[id="${currId}"]`);
  button.remove();
  document.getElementById("noteinput").style.display = "none";
  updateReminders();
});

// *********************************************
// Search bar
// *********************************************
let search = document.getElementById('search');
search.addEventListener('input', function () {

  let searchStr = search.value;

  let buttons = document.getElementsByClassName("notes");
  for (let button of buttons) {
    let entry = tempArray.get(button.id);
    if (entry.title.includes(searchStr)) {
      button.style.display = "block";
    }
    else {
      button.style.display = "none";
    }
  }

});


// *********************************************
// Firebase
// *********************************************

// Sets the main page with firebase properties
// Loads the notes
firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    let notes_list = document.getElementById('noteslist');
    let greeting = document.getElementsByClassName("greeting")[0].children[0];
    let tasklist = document.getElementById("tasks");

    greeting.innerHTML = "Hi, " + firebaseUser.displayName;
    userId = firebaseUser.uid;
    firebase.database().ref().child("users/" + userId + "/entries/").once("value").then(function (e) {
      for (let key in e.val()) {
        let entry = e.val()[key];
        let newButton = document.createElement("button");
        newButton.className = "notes";
        newButton.innerHTML = entry.title;
        newButton.id = entry.id;
        tempArray.set(entry.id, entry);
        notes_list.appendChild(newButton);

        newButton.addEventListener('click', function () {
          handleNoteButtonClick(newButton);
        });
      }

    });

    firebase.database().ref().child("users/" + userId + "/tasks/").once("value").then(function (e) {
      for (let key in e.val()) {
        let task = e.val()[key];
        //BUILD HTML
        let taskLi = document.createElement("li");
        if (task.check == true)
          taskLi.className = "taskcomplete";
        else
          taskLi.className = "taskincomplete";

        //CHECKBOX
        let taskChkbx = document.createElement("input");
        taskChkbx.setAttribute("type", "checkbox");
        taskChkbx.checked = task.check;

        //USER TASK
        let taskVal = document.createTextNode(task.title);

        //DELETE BUTTON
        let taskBtn = document.createElement("button");
        taskBtn.innerHTML = "x";

        //APPEND ELEMENTS TO TASKLI
        taskLi.appendChild(taskChkbx);
        taskLi.appendChild(taskVal);
        taskLi.appendChild(taskBtn);

        //ADD TASK TO TASK LIST
        tasklist.appendChild(taskLi);

        // task on click
        taskChkbx.addEventListener('click', () => {
          task.check = taskChkbx.checked;
          if (task.check == true) {
            taskLi.className = "taskcomplete";
          }
          else {
            taskLi.className = "taskincomplete";
          }
          taskMap.set(task.id, task);
          firebase.database().ref().child("users/" + userId + "/tasks/" + task.firebaseID).update({ 'check': task.check });
        });

        // delete task
        taskBtn.addEventListener('click', () => {
          taskMap.delete(task.id, task);
          taskLi.remove();
          firebase.database().ref().child("users/" + userId + "/tasks/" + task.firebaseID).remove();
        });

        taskMap.set(task.id, task);
      }

    });
  } else {
    console.log('Not logged in');
  }
});



let tagSelect = document.getElementById('tag');

tagSelect.addEventListener('input', function () {
  if (tagSelect.value == 'Event') {
    eventInput();
  }
  else {
    if (document.getElementById('tagDiv') != null) {
      let eventSelect = document.getElementById('tagDiv');
      eventSelect.remove();
    }
  }
});

// *********************************************
// Reminders Tab
// *********************************************
// 
/**
 * Checks if an event is within the next week and will display the event in the weekly reminders section if it is.
 * 
 */
function updateReminders() {
  if (document.getElementById('eventsList') != null) {
    let reminders = document.getElementById('eventsList');
    reminders.remove()
  }
  let container = document.querySelector('.reminders');
  let remindersUl = document.createElement('ul');
  remindersUl.setAttribute('id', 'eventsList');

  for (const [key, value] of tempArray.entries()) {
    if (value.tag == 'Event') {
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      let maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 7);
      maxDate.setHours(0, 0, 0, 0);

      let eventDate = String(value.eventStart).substring(0, 10);
      let compEvent = new Date(eventDate);
      compEvent.setHours(0, 0, 0, 0);
      if (compEvent <= maxDate && compEvent >= today) {
        let item = document.createElement('li');
        item.innerHTML = value.title;
        remindersUl.appendChild(item);
      }
    }
  }

  container.appendChild(remindersUl);
}

// *********************************************
// To-Do Tasks
// *********************************************

// *********************************************
// New Task
// *********************************************
let taskbutton = document.getElementById("add-task-btn");
taskbutton.addEventListener('click', () => {
  let tasklist = document.getElementById("tasks");

  let title = document.getElementById('input-task').value ? document.getElementById('input-task').value : "Untitled";
  let id = Math.floor(Math.random() * 1000000000);

  //BUILD HTML
  let taskLi = document.createElement("li");
  taskLi.setAttribute("class", "taskincomplete");

  //CHECKBOX
  let taskChkbx = document.createElement("input");
  taskChkbx.setAttribute("type", "checkbox");

  //USER TASK
  let taskVal = document.createTextNode(title);

  //DELETE BUTTON
  let taskBtn = document.createElement("button");
  taskBtn.innerHTML = "x";

  //APPEND ELEMENTS TO TASKLI
  taskLi.appendChild(taskChkbx);
  taskLi.appendChild(taskVal);
  taskLi.appendChild(taskBtn);

  //ADD TASK TO TASK LIST
  tasklist.appendChild(taskLi);

  let task = { "title": taskVal, "id": id, "check": taskChkbx.checked };

  // task on click
  taskChkbx.addEventListener('click', () => {
    task.check = taskChkbx.checked;
    if (task.check == true) {
      taskLi.className = "taskcomplete";
    }
    else {
      taskLi.className = "taskincomplete";
    }
    taskMap.set(id, task);
    firebase.database().ref().child("users/" + userId + "/tasks/" + pushID).update({ 'check': task.check });
  });

  // delete task
  taskBtn.addEventListener('click', () => {
    taskMap.delete(id, task);
    taskLi.remove();
    firebase.database().ref().child("users/" + userId + "/tasks/" + task.firebaseID).remove();
  });

  task = { "title": title, "id": id, "check": taskChkbx.checked };

  // clear input data
  document.getElementById('input-task').value = "";

  // save to Firebase
  let pushID = firebase.database().ref().child("users/" + userId + "/tasks").push(task).getKey();
  firebase.database().ref().child("users/" + userId + "/tasks/" + pushID).update({ 'firebaseID': pushID });

  task = { "title": title, "id": id, "check": taskChkbx.checked, "firebaseID": pushID };
  taskMap.set(id, task);
});

/**
 * Creates all the event inputs that are needed for the events tag
 *
 */
function eventInput() {
  let mainDiv = document.querySelector('.float-child-three');
  let tagDiv = document.createElement('div');
  tagDiv.setAttribute('id', 'tagDiv');
  let dateInfo = document.createElement('p');
  dateInfo.innerHTML = 'Select Start And End Date:';

  let dateSelectStart = document.createElement('input');
  dateSelectStart.setAttribute('type', 'date');
  dateSelectStart.setAttribute('id', 'date1');
  let dateSelectEnd = document.createElement('input');
  dateSelectEnd.setAttribute('type', 'date');
  dateSelectEnd.setAttribute('id', 'date2');

  tagDiv.appendChild(dateInfo);
  tagDiv.appendChild(dateSelectStart);
  tagDiv.appendChild(dateSelectEnd);

  let timeInfo = document.createElement('p');
  timeInfo.innerHTML = 'Select Start And End Time:';
  let timeStart = document.createElement('input');
  timeStart.setAttribute('type', 'time')
  timeStart.setAttribute('id', 'time1');
  let timeEnd = document.createElement('input');
  timeEnd.setAttribute('type', 'time');
  timeEnd.setAttribute('id', 'time2');

  tagDiv.appendChild(timeInfo);
  tagDiv.appendChild(timeStart);
  tagDiv.appendChild(timeEnd);
  mainDiv.appendChild(tagDiv);
}

/** 
 * Fills in the HTML elements with the notes' saved contents
 * 
 * @param {Element} newButton - The button that corresponds to the note used to fill in HTLE
 */
function handleNoteButtonClick(newButton) {
  let entry = tempArray.get(newButton.id);
  document.getElementById("noteinput").style.display = "block";
  document.getElementById('title').value = entry.title;
  editor.setContents(entry.content);
  document.getElementById('tag').value = entry.tag;
  if (entry.tag == 'Event') {
    if (document.getElementById('tagDiv') == null) {
      eventInput();
    }
    let startDate = entry.eventStart;
    let endDate = entry.eventEnd;
    if (startDate != '') {
      document.getElementById('date1').value = startDate.substring(0, 10);
      document.getElementById('time1').value = startDate.substring(11, startDate.length);
    }
    if (endDate != '') {
      document.getElementById('date2').value = endDate.substring(0, 10);
      document.getElementById('time2').value = endDate.substring(11, startDate.length);
    }
  }
  else {
    if (document.getElementById('tagDiv') != null) {
      let eventSelect = document.getElementById('tagDiv');
      eventSelect.remove();
    }
  }
  currId = newButton.id;
}

/** 
 * Function that creates a note object and button given the contents of the note page. 
 * 
 * @return {*} An array containing the note object and the element corresponding to the new button
 */
function createNoteObject() {
  // create new entry
  let title = document.getElementById('title').value ? document.getElementById('title').value : "Untitled"; // title of the note
  let content = editor.getContents();                                                                       // main text; the body of the note
  let tag = document.getElementById('tag').value;                                                           // note tag
  let newButton = document.createElement("button");                                                         // button for the new note
  let notes_list = document.getElementById('noteslist');                                                    // list of note buttons

  // sets the text inside the button to the note's title, then appends it to the list
  newButton.innerHTML = title;

  // hashing for unique entry id
  let id = Math.floor(Math.random() * 1000000000);
  newButton.id = id;
  newButton.className = "notes";

  // add event listener to the button
  newButton.addEventListener('click', function () {
    handleNoteButtonClick(newButton);
  });


  // add to notelist
  notes_list.appendChild(newButton);

  // Saves the title, main content, and a date into the the Notes obj, and also addes it to the tempArray
  let today = new Date();
  let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

  let eventStart = '';
  let eventEnd = '';
  let entry = { "title": title, "content": content, "date": date, "id": String(id), "tag": tag, "eventStart": eventStart, "eventEnd": eventEnd }; 

  // save to Firebase
  let pushID = firebase.database().ref().child("users/" + userId + "/entries").push(entry).getKey();


  firebase.database().ref().child("users/" + userId + "/entries/" + pushID).update({ 'firebaseID': pushID });

  // update entry with firebase key
  entry = {...entry, "firebaseID": pushID };
  return [entry,newButton];
}
