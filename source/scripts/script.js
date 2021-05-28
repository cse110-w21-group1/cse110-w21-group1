import { router } from './router.js'
const setState = router.setState;

var tempArray = {};

var index = 0;
var searchArr = {}; // arr to search for a specific note

var filterArr = {}; // arr to filter for specific notes

var tempArray = {};   // temp arr for storing notes until Firebase is fully implemented

var eventArr = {};


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

  if (!(title in tempArray) && title != '') { // it will only save if title is unique or not empty
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

  if (!(title in tempArray) && title != '' && tag == 'Event'){
    let eventDate = document.getElementById('date').value;
    eventArr[title] = eventDate;
    console.log(eventArr);
  }

  // Saves the title, main content, and a date into the the Notes obj, and also addes it to the tempArray
  // Also resets the forms to be empty
  if (!(title in tempArray) && title != '') { // it will only save if title is unique or not empty
    newPost.entry = { "title": title, "content": content, "date": "10/10/10", "tag": tag }
    tempArray[title] = newPost;
    document.getElementsByName('title')[0].value = ''; // did this to fix a strange bug
    document.getElementById("info").value = '';
    document.getElementById('tag').selectedIndex = 0;
    filterArr[title] = tag;
    //console.log(document.getElementsByName('title')[0]); // did this to fix a strange bug
    title = undefined;
  }

  var buttons = document.getElementsByClassName("notes");

  for (let button of buttons) {
    button.addEventListener('click', function () {
      var temp = tempArray[button.id];
      document.getElementById('title').value = temp.entry.title;
      document.getElementById('info').value = temp.entry.content;
      document.getElementById('tag').value = temp.entry.tag;
    });
  }

  if(document.getElementById('date') != null){
    let dateElem = document.getElementById('date');
    dateElem.remove();
  }

  updateReminders();



  //}
});

var search = document.getElementById('search');
search.addEventListener('input', function () {

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

// works very similarly to the search method
var dropMenu = document.getElementById('Notes');
dropMenu.addEventListener('change', function () {
  //console.log('test');
  //console.log(filterArr);
  //Delete current note list to make room for filtered search
  let currList = document.getElementById('noteslist');
  currList.remove();
  //Create new list which we will append searched values to
  let newList = document.createElement('ul');
  newList.setAttribute('class', 'notes_arr');
  newList.setAttribute('id', 'noteslist');
  let searchDiv = document.querySelector('.left-half');

  let filterStr = dropMenu.value;
  if (filterStr == 'All') {
    for (let title in filterArr) {
      let currButton = document.createElement('button');
      currButton.innerHTML = title;
      currButton.id = title;
      currButton.className = "notes";
      newList.appendChild(currButton);
    }
  } else {
    for (let title in filterArr) {
      if (filterArr[title] == filterStr) {
        let currButton = document.createElement('button');
        currButton.innerHTML = title;
        currButton.id = title;
        currButton.className = "notes";
        newList.appendChild(currButton);
      }
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


var tagSelect = document.getElementById('tag');
tagSelect.addEventListener('change', function(){
  if(tagSelect.value == 'Event'){
    let tagDiv = document.querySelector('.float-child-three');
    let dateSelect = document.createElement('input');
    dateSelect.setAttribute('type', 'date');
    dateSelect.setAttribute('id', 'date');
    tagDiv.appendChild(dateSelect);
  }
  else{
    if(document.getElementById('date') != null){
      let dateSelect = document.getElementById('date');
      dateSelect.remove();
    }
  }
});


function updateReminders(){
  if(document.getElementById('eventsList') != null){
    let reminders = document.getElementById('eventsList');
    reminders.remove()
  }
  let container = document.querySelector('.reminders');
  let remindersUl = document.createElement('ul');
  remindersUl.setAttribute('id', 'eventsList');
  for(let title in eventArr){
    let today = new Date();
    today.setHours(0,0,0,0)
    let day = String(today.getDate()).padStart(2, '0');
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let year = today.getFullYear();

    let eventDate = String(eventArr[title]);
    if(month == '02'){
      if(Number(day) > 21){
        let maxDay = 7 - 28 + Number(day);
        let maxDate = year + '-03-' + String(maxDay);
        let compDate = new Date(maxDate);
        compDate.setHours(0,0,0,0);
        let compEvent = new Date(eventDate);
        compEvent.setHours(0,0,0,0);
        if(compEvent <= compDate && compEvent >= today){
          let item = document.createElement('li');
          item.innerHTML = title;
          remindersUl.appendChild(item);
        }
      }
      else{
        let maxDay = 7 + Number(day);
        let maxDate = year + '-02-' + String(maxDay);
        let compDate = new Date(maxDate);
        compDate.setHours(0,0,0,0);
        let compEvent = new Date(eventDate);
        compEvent.setHours(0,0,0,0);
        if(compEvent <= compDate && compEvent >= today){
          let item = document.createElement('li');
          item.innerHTML = title;
          remindersUl.appendChild(item);
        }
      }
    }
    else if(month == '01' || month == '03' || month == '05' || month == '07' || month == '08' || month == '10' || month == '12'){
      if(Number(day) > 24){
        let maxDate;
        let maxDay = 7 - 31 + Number(day);
        if(month == '12'){
          maxDate = year + '-01-' + String(maxDay);
        }
        else{
          let newMonth = Number(month) + 1;
          maxDate = year + '-' + String(newMonth).padStart(2,0) + '-' + String(maxDay);
        }
        let compDate = new Date(maxDate);
        compDate.setHours(0,0,0,0);
        let compEvent = new Date(eventDate);
        compEvent.setHours(0,0,0,0);
        if(compEvent <= compDate && compEvent >= today){
          let item = document.createElement('li');
          item.innerHTML = title;
          remindersUl.appendChild(item);
        }
      }
      else{
        let maxDay = 7 + Number(day);
        let maxDate = year + '-' + month + '-' + String(maxDay);
        let compDate = new Date(maxDate);
        compDate.setHours(0,0,0,0);
        let compEvent = new Date(eventDate);
        compEvent.setHours(0,0,0,0);
        if(compEvent <= compDate && compEvent >= today){
          let item = document.createElement('li');
          item.innerHTML = title;
          remindersUl.appendChild(item);
        }
      }
    }
    else{
      if(Number(day) > 24){
        let maxDay = 7 - 31 + Number(day);
        let newMonth = Number(month) + 1;
        let maxDate = year + '-' + String(newMonth).padStart(2,0) + '-' + String(maxDay);
        let compDate = new Date(maxDate);
        compDate.setHours(0,0,0,0);
        let compEvent = new Date(eventDate);
        compEvent.setHours(0,0,0,0);
        if(compEvent <= compDate && compEvent >= today){
          let item = document.createElement('li');
          item.innerHTML = title;
          remindersUl.appendChild(item);
        }
      }
      else{
        let maxDay = 7 + Number(day);
        let maxDate = year + '-' + month + '-' + String(maxDay);
        let compDate = new Date(maxDate);
        compDate.setHours(0,0,0,0);
        let compEvent = new Date(eventDate);
        compEvent.setHours(0,0,0,0);
        if(compEvent <= compDate && compEvent >= today){
          let item = document.createElement('li');
          item.innerHTML = title;
          remindersUl.appendChild(item);
        }
      }
    }
  }

  container.appendChild(remindersUl);
}
