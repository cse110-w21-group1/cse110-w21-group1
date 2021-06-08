
// Initialize Firebase
var firebaseConfig = {
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

var userId = "";

var tempArray = new Map();   // hashmap to store notes locally
var taskMap = new Map();   // map to store tasks locally
var currId = "";
//console.log(tempArray.size);


var filterArr = {}; // arr to filter for specific notes

var eventArr = {};

// *********************************************
// Instantiate a Quill editor
// *********************************************
var toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']                                         // remove formatting button
];
var editor = new Quill('#editor', {
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
// Enable/Disable 'bold' for notes
// *********************************************
// var text = document.getElementById("info");
// let bold = document.querySelector('img[class="bold"]');
// bold.addEventListener('click', function () {
//   text.style.fontWeight = text.style.fontWeight == 'bold' ? 'normal' : 'bold';
// });

// Enable/Disable 'italics' for notes
// let italics = document.querySelector('img[class="italics"]');
// italics.addEventListener('click', function() {
//   text.value.italics();
// });




// *********************************************
// 'New Note' onclick
// *********************************************
let newNote = document.querySelector('button[type="new_note"]');
newNote.addEventListener('click', function () {
  // shows input form when pressing 'New Note' button
  var form = document.getElementById("noteinput");
  form.style.display = "block";
  document.getElementById("title").value = "";
  // document.querySelector("p").innerHTML = "";
  editor.setContents('');
  document.getElementById('tag').selectedIndex = 0;
  title = undefined;
  if(document.getElementById('tagDiv') != null){
    let tagDiv = document.getElementById('tagDiv');
    tagDiv.remove();
  }

  // create new entry
  var title = document.getElementById('title').value ? document.getElementById('title').value : "Untitled"; // title of the note
  var content = editor.getContents();  // main text; the body of the note
  var tag = document.getElementById('tag').value;       // note tag
  // let newPost = document.createElement('note-elem');    // new Notes obj as defined in notes.js
  var newButton = document.createElement("button");                                                         // button for the new note
  var notes_list = document.getElementById('noteslist');                                                    // list of note buttons

  // sets the text inside the button to the note's title, then appends it to the list
  newButton.innerHTML = title;

  // hashing for unique entry id
  let id = Math.floor(Math.random() * 1000000000);
  newButton.id = id;
  newButton.className = "notes";


  // add to notelist
  notes_list.appendChild(newButton);

  // Saves the title, main content, and a date into the the Notes obj, and also addes it to the tempArray
  var today = new Date();
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

  let eventStart = '';
  let eventEnd = '';
  //newPost.entry = { "title": title, "content": content, "date": date, "tag": tag };
  let entry = { "title": title, "content": content, "date": date, "id": String(id), "tag": tag, "eventStart": eventStart, "eventEnd": eventEnd };

  // Saves the new Note obj in tempArray, then empties the form
  tempArray.set(newButton.id, entry);

  // new note, currId should be empty
  currId = newButton.id;
  newButton.addEventListener('click', function () {
    let entry = tempArray.get(newButton.id);
    form.style.display = "block";
    document.getElementById('title').value = entry.title;
    editor.setContents(entry.content);
    document.getElementById('tag').value = entry.tag;
    if(entry.tag == 'Event'){
      if(document.getElementById('tagDiv') == null){
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
      let startDate = entry.eventStart;
      let endDate = entry.eventEnd;
      if(startDate != ''){
        document.getElementById('date1').value = startDate.substring(0,10);
        document.getElementById('time1').value = startDate.substring(11,startDate.length);
      }
      if(endDate != ''){
        document.getElementById('date2').value = endDate.substring(0,10);
        document.getElementById('time2').value = endDate.substring(11,startDate.length);
      }
    }
    else{
      if(document.getElementById('tagDiv') != null){
        let eventSelect = document.getElementById('tagDiv');
        eventSelect.remove();
      }
    }
    console.log(newButton.id);
    currId = newButton.id;
  });

  // save to Firebase
  var pushID = firebase.database().ref().child("users/" + userId + "/entries").push(entry).getKey();
  //console.log(entry.id + " saved");
  //console.log(pushID);
  firebase.database().ref().child("users/" + userId + "/entries/" + pushID).update({ 'firebaseID': pushID });

  entry = { "title": title, "content": content, "date": date, "id": String(id), "tag": tag, "eventStart": eventStart, "eventEnd": eventEnd, "firebaseID": pushID };
  tempArray.set(newButton.id, entry);
});


// *********************************************
// 'Save" onclick
// *********************************************
let saveButton = document.querySelector('button[class="save"]');
saveButton.addEventListener('click', function () {
  var title = document.getElementById('title').value ? document.getElementById('title').value : "Untitled";
  var notes_list = document.getElementById('noteslist');
  var content = editor.getContents();  // main text; the body of the note
  var tag = document.getElementById('tag').value;      // note tag

  // entry already exists, update contents only
  let entry = tempArray.get(String(currId));
  console.log(tempArray);
  entry.title = title;
  entry.content = content;
  entry.tag = tag;

  if(tag == 'Event'){
    let eventStartDate = document.getElementById('date1').value;
    let eventStartTime = document.getElementById('time1').value;
    let eventStart = eventStartDate + 'T' + eventStartTime;
    entry.eventStart = eventStart;

    let eventEndDate = document.getElementById('date2').value;
    let eventEndTime = document.getElementById('time2').value;
    let eventEnd = eventEndDate + 'T' + eventEndTime;
    entry.eventEnd = eventEnd;


  }



  let currButton = document.querySelector(`button[id="${currId}"]`);
  currButton.innerHTML = title;


  // save to Firebase
  firebase.database().ref().child("users/" + userId + "/entries/" + entry.firebaseID).set(entry);

  var tag = document.getElementById('tag').value;      // note tag
  entry.tag = tag;


  updateReminders();



  // save to Firebase
  firebase.database().ref().child("users/" + userId + "/entries/" + entry.firebaseID).set(entry);

});

// *********************************************
// Filter
// *********************************************
var dropMenu = document.getElementById('Notes');
dropMenu.addEventListener('change', function () {
  //console.log('test');
  var buttons = document.getElementsByClassName("notes");
  for (let button of buttons) {
    let entry = tempArray.get(button.id);
    if (dropMenu.value == 'All') {
      //console.log('All')
      button.style.display = "block"
    } else if (entry.tag != dropMenu.value) {
      //console.log('hide')
      button.style.display = "none";
    } else if (entry.tag == dropMenu.value) {
      //console.log('none')
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
  // console.log(tempArray);
  // console.log(entry);
  // console.log(currId);
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
var search = document.getElementById('search');
search.addEventListener('input', function () {

  //console.log(searchArr);


  //Delete current note list to make room for filtered search
  let currList = document.getElementById('noteslist');
  currList.remove();
  //Create new list which we will append searched values to
  let newList = document.createElement('ul');
  newList.setAttribute('class', 'notes_arr');
  newList.setAttribute('id', 'noteslist');
  let searchDiv = document.querySelector('.left-half');

  let searchStr = search.value;
  for (const [key, value] of tempArray.entries()) {

    let currTitle = value.title;

    if (currTitle.includes(searchStr)) {
      let currButton = document.createElement('button');
      currButton.innerHTML = currTitle;
      currButton.className = "notes";

      currButton.addEventListener('click', function () {

        document.getElementById('title').value = value.title;
        editor.setContents(value.content);
        document.getElementById('tag').value = value.tag;

      });

      newList.appendChild(currButton);
    }
  }
  searchDiv.appendChild(newList);

});


// *********************************************
// Firebase
// *********************************************

// Sets the main page with firebase properties
// Loads the notes
firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    //console.log(firebaseUser);
    var notes_list = document.getElementById('noteslist');
    var greeting = document.getElementsByClassName("greeting")[0].children[0];
    let tasklist = document.getElementById("tasks");

    greeting.innerHTML = "Hi, " + firebaseUser.displayName;
    userId = firebaseUser.uid;
    firebase.database().ref().child("users/" + userId + "/entries/").once("value").then(function (e) {
      for (var key in e.val()) {
        let entry = e.val()[key];
        let newButton = document.createElement("button");
        newButton.className = "notes";
        newButton.innerHTML = entry.title;
        newButton.id = entry.id;
        tempArray.set(entry.id, entry);
        notes_list.appendChild(newButton);

        newButton.addEventListener('click', function () {
          document.getElementById("noteinput").style.display = "block";
          document.getElementById('title').value = entry.title;
          editor.setContents(entry.content);
          currId = newButton.id;
        });
      }

    });

    firebase.database().ref().child("users/" + userId + "/tasks/").once("value").then(function (e) {
      for (var key in e.val()) {
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
          console.log(taskMap);
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



var tagSelect = document.getElementById('tag');

tagSelect.addEventListener('input', function(){
  if(tagSelect.value == 'Event'){
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
  else{
    if(document.getElementById('tagDiv') != null){
      let eventSelect = document.getElementById('tagDiv');
      eventSelect.remove();


    }
  }
});

// *********************************************
// Reminders Tab
// *********************************************
// Checks if an event is within the next week and will display the event in the case that it is.
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

      let eventDate = String(value.eventStart).substring(0,10);
      let compEvent = new Date(eventDate);
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
var taskbutton = document.getElementById("add-task-btn");
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
    console.log(taskMap);
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
