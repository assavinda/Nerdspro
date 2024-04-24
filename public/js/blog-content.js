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

module.getBlogData()
.then((blogData) => {
    console.log(blogData.data().title)
    const authurProfile = document.getElementById('authur-profile');
    const authurName = document.getElementById('authur-name');
    const title = document.getElementById('blog-title');
    const image = document.getElementById('blog-img');
    const content = document.getElementById('blog-content');

    module.getSomeData('users',blogData.data().uid , 'profile')
    .then((profile) => {
        const storage = getStorage(app)
        const storageRef1 = ref(storage, `profileImages/${profile}`);
        getDownloadURL(storageRef1)
        .then((url1) => {
            const storageRef2 = ref(storage, `postImages/${blogData.data().image}`);
            getDownloadURL(storageRef2)
            .then((url2) => {
                module.getSomeData('users',blogData.data().uid, 'username')
                .then((username) => {
                    authurProfile.src = url1
                    image.src = url2
                    authurName.innerHTML = username
                    title.innerHTML = blogData.data().title
                    content.innerHTML += blogData.data().content
                })
            })
        })
    })
});

const commentBtn = document.getElementById('comment-button');
const commentText = document.getElementById('comment-text');
const commentsDiv = document.getElementById('comments-div');
const count = document.getElementById('comments-count');
module.showComment(commentsDiv,count);

commentBtn.addEventListener('click', () => {
    module.addCommentToPost(commentText.value)
    module.showNewComment(commentsDiv,commentText.value);
    commentText.value = ""
})

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
          const profile = document.getElementById('profile-below');
          profile.src = url;
          console.log(url)
        })
        .catch((error) => {
          console.error('Error getting download URL: ', error);
        });
      })
      
    } else {
      console.log('nonono')
    }
  });