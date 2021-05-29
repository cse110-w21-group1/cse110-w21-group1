
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
var searchArr = {};

var tempArray = new Map();   // temp arr for storing notes until Firebase is fully implemented
var currId = "";
console.log(tempArray.size);

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
  //console.log(text.style);
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
  let entry = { "title": title, "content": content, "date": date, "id": id, "tag": tag};

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
});


// *********************************************
// 'Save" onclick
// *********************************************
let saveButton = document.querySelector('button[class="save"]');
saveButton.addEventListener('click', function () {
  var title = document.getElementById('title').value ? document.getElementById('title').value : "Untitled";
  var notes_list = document.getElementById('noteslist');
  var content = document.getElementById('info').value;  // main text; the body of the note


  // entry already exists, update contents only
  let entry = tempArray.get(currId);
  console.log(entry);
  entry.title = title;
  entry.content = content;

  let currButton = document.querySelector(`button[id="${currId}"]`); 
  currButton.innerHTML = title;

  // what index is the entry located at?
  searchArr[index] = title;
});

// *********************************************
// 'Delete" onclick
// *********************************************
let deleteButton = document.querySelector('button[class="delete"]');
deleteButton.addEventListener('click', function () {
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
firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    console.log(firebaseUser);
    var greeting = document.getElementsByClassName("greeting")[0].children[0];
    greeting.innerHTML = "Hi, " + firebaseUser.displayName;
  } else {
    console.log('Not logged in');
  }
});

// writes to the database
function writeUserData(userId) {
  firebase.database().ref('users/' + userId + '/entries').set({

  });
}






