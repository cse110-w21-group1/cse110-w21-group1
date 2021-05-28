// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyAaAx6HT1qq_mZIZLggvj8EzL5ctI0mQfA",
    authDomain: "pageone-c741e.firebaseapp.com",
    projectId: "pageone-c741e",
    storageBucket: "pageone-c741e.appspot.com",
    messagingSenderId: "752294608481",
    appId: "1:752294608481:web:2bad0f544ed9d91584b420"
};
firebase.initializeApp(firebaseConfig);

// Get elements
const loginForm = document.getElementById('loginform');
const signupForm = document.getElementById('signupform');

// Add login event
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get username and password
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Sign in
    firebase.auth().signInWithEmailAndPassword(username, password).then((e) => {
        // if correct credentials, goes to main page
        console.log('Successfully signed in');
        window.location.href = "index.html";
    })
    .catch((e) => {
        // output error message 
        const output = document.querySelectorAll('.error')[0];
        output.textContent = e.message;
        console.log(e.message);
    })
    ;

    loginForm.reset();
});

// Add signup event
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get username and password
    const username = document.getElementById('username2').value;
    const password = document.getElementById('password2').value;

    // Create account
    firebase.auth().createUserWithEmailAndPassword(username, password).then((e) => {
        // if account succesfully created, goes to main page
        console.log('Account successfully created');
        window.location.href = "index.html";
    })
    .catch((e) => {
        // output error message 
        const output = document.querySelectorAll('.error')[1];
        output.textContent = e.message;
        console.log(e.message);
    });

    signupForm.reset();
});

// ***************************
// logout for testing purposes
// ***************************
const logout = document.getElementsByClassName('logout')[0];
logout.addEventListener('click', (e) => {
    e.preventDefault();
    firebase.auth().signOut().then(() => {
        console.log('user signed out');
    })
});

// Add a realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log(firebaseUser);
    } else {
        console.log('Not logged in');
    }
});