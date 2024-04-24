import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js'
import { getFirestore,collection,addDoc,doc,setDoc,getDoc,getDocs } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js'
import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword , signOut , onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js'
import { Module } from "./module.js";

//Blog
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
var app = initializeApp(firebaseConfig);
var db = getFirestore(app)
const auth = getAuth();


const title = document.getElementById('news-title');
const image = document.getElementById('news-img');
const content = document.getElementById('news-content');

module.getNewsData()
.then((newsData) => {
    console.log(newsData.data())
    const storage = getStorage(app)
        const storageRef = ref(storage, `newsImages/${newsData.data().image}`);
        getDownloadURL(storageRef)
        .then((url) => {
            image.src = url
            title.innerHTML = newsData.data().title
            content.innerHTML += newsData.data().content
        })
})

let docId = sessionStorage.getItem("docId");
console.log(docId)