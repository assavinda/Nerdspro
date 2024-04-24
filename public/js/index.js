import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js'
import { getFirestore,collection,addDoc,doc,setDoc,getDoc } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js'

import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword , signOut , onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js'
import { Module } from './module.js'


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

  const module = new Module(firebaseConfig);
  const auth = getAuth();


// Auth State Check
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      //change profile pic
      module.getSomeData('users', user.uid , 'profile')
      .then((value) => {
        console.log(value)
        const storage = getStorage(app);
        const storageRef = ref(storage, `profileImages/${value}`);
        getDownloadURL(storageRef)
        .then((url) => {
          const navProfile = document.getElementById('nav-profile');
          navProfile.src = url;
          console.log(url)
        })
        .catch((error) => {
          console.error('Error getting download URL: ', error);
        });

        const nav = document.getElementById('navbar')
        nav.setAttribute('style' , 'visibility: visible;');
      })
      
    } else {
      console.log('nonono')
    }
  });

  








