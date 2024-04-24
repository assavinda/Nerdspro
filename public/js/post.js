// require title,content,image,uid
import { Module } from "./module.js";
import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword , signOut , onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js'


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

  const auth = getAuth();
  const module = new Module(firebaseConfig);
  const postBtn = document.getElementById('post-btn');

  onAuthStateChanged(auth, (user) => {
    if (user) {
        postBtn.addEventListener('click', () => {

            const spinner = document.getElementById('spinner-container')
            spinner.setAttribute('style' , 'position:sticky ; top: 50%; left: 50%; transform: translate(-50%,-50%); display: block;')

            let title = document.getElementById('title').value;
            let content = document.getElementById('content').value;
            let imgInput = document.getElementById('imgInput');
            let img = imgInput.files[0];
            const uid = user.uid
            module.addPost( title, content, img , uid)
            .then(() => {
                console.log('posted!')
            })
          });
    }
    else {
        alert('please login first')
    }
});
