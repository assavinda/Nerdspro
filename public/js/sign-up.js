import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js'
import { getFirestore,collection,addDoc,doc,setDoc } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js'

import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword , signOut , onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js'
import { Module } from './module.js';

// Config
const firebaseConfig = {
  apiKey: "AIzaSyAAgxoujcyXEF5QiCPn4ji9nqwsdd11D0A",
  authDomain: "nerdspro.firebaseapp.com",
  projectId: "nerdspro",
  storageBucket: "nerdspro.appspot.com",
  messagingSenderId: "741050823850",
  appId: "1:741050823850:web:4ccf734fe753322201ccd3",
  measurementId: "G-KVR1HXWBZD"
};

const module = new Module(firebaseConfig);

// Event listener for signup button
let signupBtn = document.getElementById('signup-btn');


signupBtn.addEventListener("click", () => {
  const spinner = document.getElementById('spinner-container')
  let username = document.getElementById('InputUsername').value;
  let email = document.getElementById('InputEmail').value;
  let password = document.getElementById('InputPassword').value;
  let repassword = document.getElementById('InputRePassword').value;
  let country = document.getElementById('country').value
  let fileInput = document.getElementById('fileInput');
  let file = fileInput.files[0];
  if (file == null || username == null || email == null || password == null || repassword == null || country == null) {
    console.log(username,email,password,repassword,country)
    alert('please input all')
  }
  else if (repassword != password) {
    alert('Password Not Match')
  }
  else {
    spinner.setAttribute('style' , 'position:sticky ; top: 50%; left: 50%; transform: translate(-50%,-50%); display: block;')
    module.signUp(username, email, password ,file)
  }
});
