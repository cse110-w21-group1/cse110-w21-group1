import { router } from './router.js'
const setState = router.setState;
var tempArray = {};   // temp arr for storing notes until Firebase is fully implemented

window.addEventListener('popstate', (e) => {
  setState(e.state, true);
});

let calendarLogo = document.querySelector('#calendar')


let calendar = document.querySelector('calendar-elem');
calendarLogo.addEventListener('click', function(){
    setState({state: 'calendar'}, false);
    calendar.render(); 
})


let homeLogo = document.getElementById('home');
homeLogo.addEventListener('click', function () {
  setState({ state: 'notes' }, false);
});

let logoutLogo = document.querySelector('#logout');


logoutLogo.addEventListener('click', function () {
  window.location.href = "login.html";
});


// Enable/Disable 'bold' for notes
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

// Saves the current input and creates a button for the corresponding note
// Also appends the button to the list on the left hand side
let new_note = document.querySelector('button[type="new_note"]');
new_note.addEventListener('click', function () {
  var title = document.getElementById('title').value;     // title of the note
  var newButton = document.createElement("button");       // button for the new note
  var notes_list = document.getElementById('noteslist');  // list of note buttons

  // sets the text inside the button to the note's title, then appends it to the list
  newButton.innerHTML = title;
  newButton.id = title;
  newButton.className = "notes";
  notes_list.appendChild(newButton);


  var content = document.getElementById('info').value      // main text; the body of the note
  let newPost = document.createElement('note-elem');       // new Notes obj as defined in notes.js

  // Saves the title, main content, and a date into the the Notes obj, and also addes it to the tempArray
  // Also resets the forms to be empty
  newPost.entry = { "title": title, "content": content, "date": "10/10/10" }
  tempArray[title] = newPost;
  document.getElementById("title").value = "";
  title = undefined;
  document.getElementById("info").value = "";

  var buttons = document.getElementsByClassName("notes");   // var that retrieves all the note buttons

  // Scans if any of the buttons are clicked, and if one does get clicked, load the title and contents
  for (let button of buttons) {
    button.addEventListener('click', function () {
      //console.log(button.id);
      //console.log(tempArray[button.id].entry)
      //console.log(buttons[i].id)
      var temp = tempArray[button.id];
      document.getElementById('title').value = temp.entry.title;
      document.getElementById('info').value = temp.entry.content;
    });
  }

});