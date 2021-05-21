import { router } from './router.js'
const setState = router.setState;
var tempArray = [];

window.addEventListener('popstate', (e) => {
  setState(e.state, true);
});

let calendarLogo = document.querySelector('#calendar');
calendarLogo.addEventListener('click', function () {
  setState({ state: 'calendar' }, false);

})

let homeLogo = document.getElementById('home');
homeLogo.addEventListener('click', function () {
  setState({ state: 'notes' }, false);
});

let logoutLogo = document.querySelector('#logout');
logoutLogo.addEventListener('click', function () {
  window.location.href = "login.html";
});

// let title = document.getElementById('title_box');
// title.addEventListener ('input', function() {
//     console.log(title.value);
//     document.getElementsByClassName('title').value = title.value;
//     console.log(document.getElementsByClassName('title').value)

//     title.style.display = 'none';
// })

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
  var title = document.getElementById('title').value;
  var newButton = document.createElement("button");
  var notes_list = document.getElementById('noteslist');
  newButton.innerHTML = title;
  newButton.id = title;
  newButton.className = "notes";
  notes_list.appendChild(newButton);


  var content = document.getElementById('info').value
  let newPost = document.createElement('note-elem');
  // var shadow = newPost.shadowRoot;
  // shadow.querySelector(".entry-title") = title;
  // shadow.querySelector(".entry-content") = content;
  newPost.entry = { "title": title, "content": content, "date": "10/10/10" }
  tempArray.push(newPost);
  document.getElementById("title").value = "";
  title = undefined;
  document.getElementById("info").value = "";
  console.log(tempArray[0])

  var buttons = document.getElementsByClassName("notes");
  var buttonsCount = buttons.length;
  //console.log(buttonsCount);
  //for (var i = 0; i <= buttonsCount; i += 1) {
  for (var i = 0; i < buttonsCount; i++) {
    buttons[i].addEventListener('click', function () {
      console.log(i);
      console.log(tempArray[i-1])
      var temp = tempArray[i-1];
      document.getElementById('title').value = temp.entry.title;
      document.getElementById('info').value = temp.entry.content;
    });
  }
  
  //}
});