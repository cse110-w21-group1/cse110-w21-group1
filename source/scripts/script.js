import { router } from './router.js'
const setState = router.setState;

window.addEventListener('popstate', (e) => {
  setState(e.state, true);
});

let calendarLogo = document.querySelector('#calendar');
calendarLogo.addEventListener('click', function(){
    setState({state: 'calendar'}, false);
    
})

let homeLogo = document.getElementById('home');
homeLogo.addEventListener('click', function() {
  setState({state: 'notes'}, false);
});

let logoutLogo = document.querySelector('#logout');
logoutLogo.addEventListener('click', function(){
    window.location.href = "login.html";
})

// let title = document.getElementById('title_box');
// title.addEventListener ('input', function() {
//     console.log(title.value);
//     document.getElementsByClassName('title').value = title.value;
//     console.log(document.getElementsByClassName('title').value)

//     title.style.display = 'none';
// })

let text = document.getElementById("info");
let bold = document.querySelector('img[class="bold"]');

    bold.addEventListener('click', function () {
      //console.log(text.style);
      text.style.fontWeight = text.style.fontWeight == 'bold' ? 'normal' : 'bold';
    })
