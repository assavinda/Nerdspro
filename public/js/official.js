
import { Module } from "./module.js";


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
const officialBox = document.getElementById('officialBox');

module.getOfficialBlogs(officialBox)
window.onclick = e => {
    if (e.target.tagName == 'H3') {
      sessionStorage.setItem("Id", e.target.id);
      window.location.href = './official-blog-content.html';
    }
    else {
      console.log(e.target.tagName)
    }
}