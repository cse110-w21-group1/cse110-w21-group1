import { router } from './router.js'
const setState = router.setState;

var tempArray = {};

var index = 0;
var searchArr = {};

var tempArray = {};   // temp arr for storing notes until Firebase is fully implemented


window.addEventListener('popstate', (e) => {
  setState(e.state, true);
});

let calendarLogo = document.querySelector('#calendar')


let calendar = document.querySelector('calendar-elem');
calendarLogo.addEventListener('click', function () {
  setState({ state: 'calendar' }, false);
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

  var title = document.getElementById('title').value;     // title of the note
  var newButton = document.createElement("button");       // button for the new note
  var notes_list = document.getElementById('noteslist');  // list of note buttons

  if (!(title in tempArray) && title != '') {
    console.log("test");
    newButton.innerHTML = title;
    newButton.id = title;
    newButton.className = "notes";
    notes_list.appendChild(newButton);


    searchArr[index] = title;
    index++;
  }



  var content = document.getElementById('info').value;  // main text; the body of the note
  let newPost = document.createElement('note-elem');      // new Notes obj as defined in notes.js
  var tag = document.getElementById('tag').value;      // note tag
  // Saves the title, main content, and a date into the the Notes obj, and also addes it to the tempArray
  // Also resets the forms to be empty
  if (!(title in tempArray) && title != '') {
    newPost.entry = { "title": title, "content": content, "date": "10/10/10", "tag": tag }

    tempArray[title] = newPost;
    document.getElementById("title").value = "";
    title = undefined;
    document.getElementById("info").value = "";
  }



  var buttons = document.getElementsByClassName("notes");

  for (let button of buttons) {
    button.addEventListener('click', function () {
      var temp = tempArray[button.id];
      document.getElementById('title').value = temp.entry.title;
      document.getElementById('info').value = temp.entry.content;
    });
  }





  //}
});

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