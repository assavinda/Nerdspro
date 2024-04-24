import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js'
import { getFirestore,collection,addDoc,doc,setDoc } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js'

import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword , signOut , onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js'

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


  var app = initializeApp(firebaseConfig);
  var db = getFirestore(app)
  const auth = getAuth();

//Sign Out


const logOutBtn = document.getElementById('logout-btn');


function logOut() {
  signOut(auth)
  .then(() => {
    window.location.href = '../index.html';
    console.log("sign out success")
  })
  .catch((error) => {
    console.log(error);
  });
}

logOutBtn.addEventListener('click' , logOut);