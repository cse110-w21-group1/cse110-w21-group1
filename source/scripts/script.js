
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

var index = 0;

var userId = "";

var tempArray = new Map();   // hashmap to store notes locally
var currId = "";
console.log(tempArray.size);

var searchArr = {}; // arr to search for a specific note

var filterArr = {}; // arr to filter for specific notes

// temp arr for storing notes until Firebase is fully implemented

var eventArr = {};



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
  calendar.render();

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
var text = document.getElementById("info");
let bold = document.querySelector('img[class="bold"]');
bold.addEventListener('click', function () {
  text.style.fontWeight = text.style.fontWeight == 'bold' ? 'normal' : 'bold';
});

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
  document.getElementById("info").value = "";
  title = undefined;

  // create new entry
  var title = document.getElementById('title').value ? document.getElementById('title').value : "Untitled"; // title of the note
  var content = document.getElementById('info').value;  // main text; the body of the note
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
  //newPost.entry = { "title": title, "content": content, "date": date, "tag": tag };
  let entry = { "title": title, "content": content, "date": date, "id": String(id), "tag": tag };

  // Saves the new Note obj in tempArray, then empties the form
  tempArray.set(newButton.id, entry);

  // new note, currId should be empty
  currId = newButton.id;
  newButton.addEventListener('click', function () {
    let entry = tempArray.get(newButton.id);
    form.style.display = "block";
    document.getElementById('title').value = entry.title;
    document.getElementById('info').value = entry.content;
    console.log(newButton.id);
    currId = newButton.id;
  });

  // save to Firebase
  var pushID = firebase.database().ref().child("users/" + userId + "/entries").push(entry).getKey();
  console.log(entry.id + " saved");
  console.log(pushID);
  firebase.database().ref().child("users/" + userId + "/entries/" + pushID).update({ 'firebaseID': pushID });

  entry = { "title": title, "content": content, "date": date, "id": String(id), "tag": tag, "firebaseID": pushID };
  tempArray.set(newButton.id, entry);
});


// *********************************************
// 'Save" onclick
// *********************************************
let saveButton = document.querySelector('button[class="save"]');
saveButton.addEventListener('click', function () {
  var title = document.getElementById('title').value ? document.getElementById('title').value : "Untitled";
  var notes_list = document.getElementById('noteslist');
  var content = document.getElementById('info').value;  // main text; the body of the note
  var tag = document.getElementById('tag').value;      // note tag

  // entry already exists, update contents only
  let entry = tempArray.get(String(currId));
  console.log(tempArray);
  entry.title = title;
  entry.content = content;
  entry.tag = tag;


  let currButton = document.querySelector(`button[id="${currId}"]`);
  currButton.innerHTML = title;

  // save to Firebase
  firebase.database().ref().child("users/" + userId + "/entries/" + entry.firebaseID).set(entry);



  if (!(title in tempArray) && title != '' && tag == 'Event') {
    let eventDate = document.getElementById('date').value;
    eventArr[title] = eventDate;
    console.log(eventArr);
  }

  // Saves the title, main content, and a date into the the Notes obj, and also addes it to the tempArray
  // Also resets the forms to be empty
  if (!(title in tempArray) && title != '') { // it will only save if title is unique or not empty
    // let newPost = { "title": title, "content": content, "date": "10/10/10", "tag": tag }
    // tempArray[title] = newPost;
    document.getElementsByName('title')[0].value = ''; // did this to fix a strange bug
    document.getElementById("info").value = '';
    document.getElementById('tag').selectedIndex = 0;
    // filterArr[title] = tag;
    //console.log(document.getElementsByName('title')[0]); // did this to fix a strange bug
    title = undefined;
  }

  var buttons = document.getElementsByClassName("notes");
  for (let button of buttons) {
    button.addEventListener('click', function () {
      var temp = tempArray.get(button.id);
      document.getElementById('title').value = temp.title;
      document.getElementById('info').value = temp.content;
      document.getElementById('tag').value = temp.tag;
    });
  }

  if (document.getElementById('date') != null) {
    let dateElem = document.getElementById('date');
    dateElem.remove();
  }

  updateReminders();

  // what index is the entry located at?
  searchArr[index] = title;
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
  console.log(tempArray);
  console.log(entry);
  console.log(currId);
  firebase.database().ref().child("users/" + userId + "/entries/" + entry.firebaseID).remove();

  tempArray.delete(currId);
  let button = document.querySelector(`button[id="${currId}"]`);
  button.remove();
  document.getElementById("noteinput").style.display = "none";
});

// *********************************************
// Search bar
// *********************************************
var search = document.getElementById('search');
search.addEventListener('input', function () {

  console.log(searchArr);


  //Delete current note list to make room for filtered search
  let currList = document.getElementById('noteslist');
  currList.remove();
  //Create new list which we will append searched values to
  let newList = document.createElement('ul');
  newList.setAttribute('class', 'notes_arr');
  newList.setAttribute('id', 'noteslist');
  let searchDiv = document.querySelector('.left-half');

  let searchStr = search.value;
  for (let i = 0; i < index; i++) {

    console.log(searchArr[i]);

    if (searchArr[i].includes(searchStr)) {
      let currButton = document.createElement('button');
      let currTitle = searchArr[i];
      currButton.innerHTML = currTitle;
      currButton.id = currTitle;
      currButton.className = "notes";
      newList.appendChild(currButton);
    }
  }
  searchDiv.appendChild(newList);


  let buttons2 = document.getElementsByClassName("notes");

  for (let button of buttons2) {
    button.addEventListener('click', function () {
      var temp = tempArray[button.id];
      document.getElementById('title').value = temp.entry.title;
      document.getElementById('info').value = temp.entry.content;
      document.getElementById('tag').value = temp.entry.tag;

    });
  }


});


// *********************************************
// Firebase
// *********************************************

// Sets the main page with firebase properties
// Loads the notes
firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    console.log(firebaseUser);
    var notes_list = document.getElementById('noteslist');
    var greeting = document.getElementsByClassName("greeting")[0].children[0];
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
          document.getElementById('info').value = entry.content;
          currId = newButton.id;
        });
      }

    });
  } else {
    console.log('Not logged in');
  }

});



var tagSelect = document.getElementById('tag');
tagSelect.addEventListener('change', function () {
  if (tagSelect.value == 'Event') {
    let tagDiv = document.querySelector('.float-child-three');
    let dateSelect = document.createElement('input');
    dateSelect.setAttribute('type', 'date');
    dateSelect.setAttribute('id', 'date');
    tagDiv.appendChild(dateSelect);
  }
  else {
    if (document.getElementById('date') != null) {
      let dateSelect = document.getElementById('date');
      dateSelect.remove();
    }
  }
});


function updateReminders() {
  if (document.getElementById('eventsList') != null) {
    let reminders = document.getElementById('eventsList');
    reminders.remove()
  }
  let container = document.querySelector('.reminders');
  let remindersUl = document.createElement('ul');
  remindersUl.setAttribute('id', 'eventsList');
  for (let title in eventArr) {
    let today = new Date();
    today.setHours(0, 0, 0, 0)
    let day = String(today.getDate()).padStart(2, '0');
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let year = today.getFullYear();

    let eventDate = String(eventArr[title]);
    if (month == '02') {
      if (Number(day) > 21) {
        let maxDay = 7 - 28 + Number(day);
        let maxDate = year + '-03-' + String(maxDay);
        let compDate = new Date(maxDate);
        compDate.setHours(0, 0, 0, 0);
        let compEvent = new Date(eventDate);
        compEvent.setHours(0, 0, 0, 0);
        if (compEvent <= compDate && compEvent >= today) {
          let item = document.createElement('li');
          item.innerHTML = title;
          remindersUl.appendChild(item);
        }
      }
      else {
        let maxDay = 7 + Number(day);
        let maxDate = year + '-02-' + String(maxDay);
        let compDate = new Date(maxDate);
        compDate.setHours(0, 0, 0, 0);
        let compEvent = new Date(eventDate);
        compEvent.setHours(0, 0, 0, 0);
        if (compEvent <= compDate && compEvent >= today) {
          let item = document.createElement('li');
          item.innerHTML = title;
          remindersUl.appendChild(item);
        }
      }
    }
    else if (month == '01' || month == '03' || month == '05' || month == '07' || month == '08' || month == '10' || month == '12') {
      if (Number(day) > 24) {
        let maxDate;
        let maxDay = 7 - 31 + Number(day);
        if (month == '12') {
          maxDate = year + '-01-' + String(maxDay);
        }
        else {
          let newMonth = Number(month) + 1;
          maxDate = year + '-' + String(newMonth).padStart(2, 0) + '-' + String(maxDay);
        }
        let compDate = new Date(maxDate);
        compDate.setHours(0, 0, 0, 0);
        let compEvent = new Date(eventDate);
        compEvent.setHours(0, 0, 0, 0);
        if (compEvent <= compDate && compEvent >= today) {
          let item = document.createElement('li');
          item.innerHTML = title;
          remindersUl.appendChild(item);
        }
      }
      else {
        let maxDay = 7 + Number(day);
        let maxDate = year + '-' + month + '-' + String(maxDay);
        let compDate = new Date(maxDate);
        compDate.setHours(0, 0, 0, 0);
        let compEvent = new Date(eventDate);
        compEvent.setHours(0, 0, 0, 0);
        if (compEvent <= compDate && compEvent >= today) {
          let item = document.createElement('li');
          item.innerHTML = title;
          remindersUl.appendChild(item);
        }
      }
    }
    else {
      if (Number(day) > 24) {
        let maxDay = 7 - 30 + Number(day);
        let newMonth = Number(month) + 1;
        let maxDate = year + '-' + String(newMonth).padStart(2, 0) + '-' + String(maxDay);
        let compDate = new Date(maxDate);
        compDate.setHours(0, 0, 0, 0);
        let compEvent = new Date(eventDate);
        compEvent.setHours(0, 0, 0, 0);
        if (compEvent <= compDate && compEvent >= today) {
          let item = document.createElement('li');
          item.innerHTML = title;
          remindersUl.appendChild(item);
        }
      }
      else {
        let maxDay = 7 + Number(day);
        let maxDate = year + '-' + month + '-' + String(maxDay);
        let compDate = new Date(maxDate);
        compDate.setHours(0, 0, 0, 0);
        let compEvent = new Date(eventDate);
        compEvent.setHours(0, 0, 0, 0);
        if (compEvent <= compDate && compEvent >= today) {
          let item = document.createElement('li');
          item.innerHTML = title;
          remindersUl.appendChild(item);
        }
      }
    }
  }

  container.appendChild(remindersUl);
}

