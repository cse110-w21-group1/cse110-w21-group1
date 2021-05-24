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
const btnLogin = document.getElementsByClassName('loginbtn')[0];
const btnSignup = document.getElementsByClassName('signupbtn2')[0];

// Add login event
btnLogin.addEventListener('click', (e) => {
    // Get username and password
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Sign in
    firebase.auth().signInWithEmailAndPassword(username, password).catch((e) => {
        console.log(e.message);
    });
});

// Add signup event
btnSignup.addEventListener('click', (e) => {
    // Get username and password
    const username = document.getElementById('username2').value;
    const password = document.getElementById('password2').value;
    console.log(username);

    // Create account
    firebase.auth().createUserWithEmailAndPassword(username, password).catch((e) => {
        console.log(e.message);
    });
});

// Add a realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log(firebaseUser);
    } else {
        console.log('Not logged in');
    }
});