import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js'
import { getFirestore,collection,addDoc,doc,setDoc,getDoc,getDocs } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js'
import { getAuth, createUserWithEmailAndPassword , signInWithEmailAndPassword , signOut , onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js'

export class Module {
    constructor(firebaseConfig) {
      this.app = initializeApp(firebaseConfig);
      this.db = getFirestore(this.app);
      this.auth = getAuth();
      this.storage = getStorage(this.app);
    }

    //Sign Up
  
    async signUp(username, email, password, file) {
      try {
        const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
        const user = userCredential.user;
        if (file) {
          const storageRef = ref(this.storage, `profileImages/${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);
          
  
          uploadTask.on('state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
            },
            (error) => {
              console.error('Upload failed:', error);
            },
            async () => {
              console.log('Upload successful!');
              const uid = user.uid;
              const data = {
                username: username,
                email: email,
                password: password,
                uid: user.uid,
                profile: file.name
              };
  
              try {
                await setDoc(doc(this.db, 'users', uid), data);
                console.log('Document added successfully with custom ID:', uid);
                await signOut(this.auth)
                .then(() => {
                    console.log("sign out success")
                    window.location.href = '../index.html';
                })
                .catch((error) => {
                    console.log(error);
                })
              } catch (error) {
                console.error('Error adding document:', error);
              }
            }
          )
        }
  
        console.log('Sign up success')

        
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Sign up error:', errorCode, errorMessage);
      }
    }

    // getData

        async getSomeData(collectionName, documentId, fieldName) {
            const documentRef = doc(this.db, collectionName, documentId);

            try {
            const docSnapshot = await getDoc(documentRef);

            if (docSnapshot.exists()) {
                const fieldData = docSnapshot.data()[fieldName];
                console.log(fieldData)

                if (fieldData !== undefined) {
                return fieldData;
                } else {
                console.log(`Field "${fieldName}" does not exist in the document`);
                }
            } else {
                console.log('Document does not exist');
            }
            } catch (error) {
            console.error('Error getting field data:', error);
            }
        }


    // addData

    async addPost(title,content,image,uid) {

        const storageRef = ref(this.storage, `postImages/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
  
          uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          },
          (error) => {
            console.error('Upload failed:', error);
          },
          async () => {
            console.log('Upload successful!');
            window.location.href = './space.html'
          });
          const date = new Date()
          const day = date.getDate()
          const month = date.getMonth()
          const year = date.getFullYear()
          const hour = date.getHours()
          const minute = date.getMinutes()
          const second = date.getSeconds()

          let time = ""

          if (minute < 10) {
            time = `${day}/${month}/${year} at ${hour}:0${minute}`
          }
          else {
            time = `${day}/${month}/${year} at ${hour}:${minute}`
          }

          const data = {
              content: content,
              image: image.name,
              title: title,
              uid: uid,
              time: time,
              day: day,
              month: month,
              year: year,
              hour: hour,
              minute: minute,
              second: second
          }
        try {
          await setDoc(doc(this.db, 'blogs', title), data);
          await setDoc(doc(this.db, 'users', uid , 'blogs' , title), data);
        } catch (error) {
          console.error('Error adding document:', error);
        }


      }


      //

        async addCommentToPost(text) {

          onAuthStateChanged(this.auth, (user) => {
            if (user) {
              const date = new Date()
              const day = date.getDate()
              const month = date.getMonth()
              const year = date.getFullYear()
              const hour = date.getHours()
              const minute = date.getMinutes()
              const second = date.getSeconds()

              let time = ""

              if (minute < 10) {
              time = `${day}/${month}/${year} at ${hour}:0${minute}`
              }
              else {
              time = `${day}/${month}/${year} at ${hour}:${minute}`
              }
              console.log(time)
              let postTitle = sessionStorage.getItem("docId");
              const comments = {
                  text: text,
                  uid: user.uid,
                  time: time,
                  day: day,
                  month: month,
                  year: year,
                  hour: hour,
                  minute: minute,
                  second: second
              }
              try {
                  setDoc(doc(this.db, 'blogs', postTitle , 'comments' , text), comments)
                } catch (error) {
                  console.error('Error adding comment:', error);
                }
            } else {
              console.log("not logged in")
            }
          });
        }

        async showComment(div,count) {
          let postTitle = sessionStorage.getItem("docId");
          const commentsCol = collection(this.db,"blogs",postTitle,"comments")
          const colSnap = await getDocs(commentsCol)
          let array = []
          await colSnap.forEach(element => {
              array.push(element.data())
          });
          array.sort((a, b) => {
            if (a.day < b.day) {
              return -1;
            }
            if (a.day > b.day) {
              return 1;
            }
            else {
              if (a.month < b.month) {
                return -1;
              }
              if (a.month > b.month) {
                return 1;
              }
              else {
                if (a.year < b.year) {
                  return -1;
                }
                if (a.year > b.year) {
                  return 1;
                }
                else {
                  if (a.hour < b.hour) {
                    return -1;
                  }
                  if (a.hour > b.hour) {
                    return 1;
                  }
                  else {
                    if (a.minute < b.minute) {
                      return -1;
                    }
                    if (a.minute > b.minute) {
                      return 1;
                    }
                    else {
                      if (a.second < b.second) {
                        return -1;
                      }
                      if (a.second > b.second) {
                        return 1;
                      }
                      else {
                        return 0;
                      }
                    }
                  }
                }
              }
            }
          });
          count.innerHTML =  `Comments (${array.length})`
          if (array.length == 0) {
            const spinner = document.getElementById('spinner-container')
            spinner.setAttribute('style','display: none;')
          }
          else {
            for(let i = 0; i < array.length; i++) {
              console.log(array[i])
              const docRef = doc(this.db,'users',array[i].uid)
              const docSnapshot = await getDoc(docRef)
              .then((user) => {
                const storageRef = ref(this.storage, `profileImages/${user.data().profile}`);
                getDownloadURL(storageRef)
                .then((url) => {
                  setTimeout(function() {
                    div.innerHTML += `<div class="be-comment">
                  <div class="be-img-comment row">	
                    <a href="#">
                      <img id="user-comment-profile" src="${url}" alt="" class="be-ava-comment">
                    </a>
                  </div>
                  <div class="be-comment-content">
                    
                      <span class="be-comment-name">
                        <a id="user-comment-name" href="#" class="clickwhite"><p>${user.data().username}</p></a>
                        </span>
                      <span class="be-comment-time">
                        <i class="fa fa-clock-o"></i>
                        <p id="comment-date">${array[i].time}</p>
                      </span>
                      
                    <p id="comment-box" class="be-comment-text rounded">
                      ${array[i].text}
                    </p>
                  </div>
                </div>`
                console.log(array[i])
                  }, 2000);
                  const spinner = document.getElementById('spinner-container')
                  spinner.setAttribute('style','display: none;')
                })
              })
            }
          }
        }
        
        async showNewComment(div,text) {
          let docId = sessionStorage.getItem("docId");
          let commentRef = doc(this.db,"blogs",docId,"comments",text)
          let commentSnapshot = await getDoc(commentRef)
          .then((comment) => {
            const docRef = doc(this.db,'users',comment.data().uid)
            const docSnapshot = getDoc(docRef)
              .then((user) => {
                const storageRef = ref(this.storage, `profileImages/${user.data().profile}`);
                getDownloadURL(storageRef)
                .then((url) => {
                  div.innerHTML += `<div class="be-comment">
                  <div class="be-img-comment row">	
                    <a href="#">
                      <img id="user-comment-profile" src="${url}" alt="" class="be-ava-comment">
                    </a>
                  </div>
                  <div class="be-comment-content">
                    
                      <span class="be-comment-name">
                        <a id="user-comment-name" href="#" class="clickwhite"><p>${user.data().username}</p></a>
                        </span>
                      <span class="be-comment-time">
                        <i class="fa fa-clock-o"></i>
                        <p id="comment-date">${comment.data().time}</p>
                      </span>
                      
                    <p id="comment-box" class="be-comment-text rounded">
                      ${comment.data().text}
                    </p>
                  </div>
                </div>`
                })
              })
          })
        }


        async getPost(box) {
            const blogsCol = collection(this.db , 'blogs')
            const blogsSnapshot = await getDocs(blogsCol)
            let array = []
            const data = blogsSnapshot
            data.forEach(element => {
                array.push(element.data())
            });
            array.sort((a, b) => {
              if (a.day < b.day) {
                return -1;
              }
              if (a.day > b.day) {
                return 1;
              }
              else {
                if (a.month < b.month) {
                  return -1;
                }
                if (a.month > b.month) {
                  return 1;
                }
                else {
                  if (a.year < b.year) {
                    return -1;
                  }
                  if (a.year > b.year) {
                    return 1;
                  }
                  else {
                    if (a.hour < b.hour) {
                      return -1;
                    }
                    if (a.hour > b.hour) {
                      return 1;
                    }
                    else {
                      if (a.minute < b.minute) {
                        return -1;
                      }
                      if (a.minute > b.minute) {
                        return 1;
                      }
                      else {
                        if (a.second < b.second) {
                          return -1;
                        }
                        if (a.second > b.second) {
                          return 1;
                        }
                        else {
                          return 0;
                        }
                      }
                    }
                  }
                }
              }
            })    
            for (let i=0 ; i < array.length ; i++) {
                const storageRef = ref(this.storage, `postImages/${array[i].image}`);
                await getDownloadURL(storageRef)
                .then((url) => {
                    this.getSomeData('users' , array[i].uid , 'username')
                    .then((username) => {
                        this.getSomeData('users' , array[i].uid , 'profile')
                        .then((profileName) => {
                            const storageRef2 = ref(this.storage, `profileImages/${profileName}`);
                            getDownloadURL(storageRef2)
                            .then((profileImg) => {
                                box.innerHTML += `
                                <div class="card" style="width: 75rem; margin-top: 10px; margin-bottom: 10px; ">
                                    <div class="row">
                                        <div class="col-md-4">
                                            <img class="img-fluid rounded-start rounded-end" src="${url}" style="margin-top: 10px; margin-bottom: 10px; width: 500px; height: 12rem; object-fit:cover; box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.25);">
                                        </div>
                                    <div class="col-md-8">
                                        <div class="card-body">
                                            <a href="#" class="click">
                                                <h3 class="card-title" style="font-family: Krona One;" id="${array[i].title}">${array[i].title}<h3>
                                            </a>
                                            <p class="card-text truncate-overflow" style="font-size: 18px; color: #a3a3a3">${array[i].content}</p>
                                        </div>
                                    </div>
                                    <div class="row" style="color: rgb(145, 145, 145); font-family: Krona One; margin-left:10px; margin-bottom: 10px;">
                                    <hr/>
                                        <div class="col text-start">
                                            <div class="col text-start " style="margin-bottom:1px">
                                            <p style="font-size: 12px"> Posted on ${array[i].time}</p>                                         
                                            </div>
                                        </div>
                                        <div class="col text-end">
                                            <div class="col text-end " style="margin-bottom:1px">
                                            ${username}
                                            <img src="${profileImg}" style="width:30px; height:30px; object-fit:cover; border-radius:100px; border: #CC0062 2px solid" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                `
                            })
                        })
                    })
                })
                .catch((error) => {
                    console.log('error')
                })
            }
        }

        async getPostAccount(box , uid) {
          const blogsCol = collection(this.db , 'users' , uid , 'blogs')
          const blogsSnapshot = await getDocs(blogsCol)
          let array = []
          const data = blogsSnapshot
          data.forEach(element => {
              array.push(element.data())
          });
          array.sort((a, b) => {
            if (a.day < b.day) {
              return -1;
            }
            if (a.day > b.day) {
              return 1;
            }
            else {
              if (a.month < b.month) {
                return -1;
              }
              if (a.month > b.month) {
                return 1;
              }
              else {
                if (a.year < b.year) {
                  return -1;
                }
                if (a.year > b.year) {
                  return 1;
                }
                else {
                  if (a.hour < b.hour) {
                    return -1;
                  }
                  if (a.hour > b.hour) {
                    return 1;
                  }
                  else {
                    if (a.minute < b.minute) {
                      return -1;
                    }
                    if (a.minute > b.minute) {
                      return 1;
                    }
                    else {
                      if (a.second < b.second) {
                        return -1;
                      }
                      if (a.second > b.second) {
                        return 1;
                      }
                      else {
                        return 0;
                      }
                    }
                  }
                }
              }
            }
          })    
          for (let i=0 ; i < array.length ; i++) {
              const storageRef = ref(this.storage, `postImages/${array[i].image}`);
              await getDownloadURL(storageRef)
              .then((url) => {
                  this.getSomeData('users' , array[i].uid , 'username')
                  .then((username) => {
                      this.getSomeData('users' , array[i].uid , 'profile')
                      .then((profileName) => {
                          const storageRef2 = ref(this.storage, `profileImages/${profileName}`);
                          getDownloadURL(storageRef2)
                          .then((profileImg) => {
                              box.innerHTML += `
                              <div class="card" style="width: 75rem; margin-top: 10px; margin-bottom: 10px; ">
                                  <div class="row">
                                      <div class="col-md-4">
                                          <img class="img-fluid rounded-start rounded-end" src="${url}" style="margin-top: 10px; margin-bottom: 10px; width: 500px; height: 12rem; object-fit:cover; box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.25);">
                                      </div>
                                  <div class="col-md-8">
                                      <div class="card-body">
                                          <a href="#" class="click">
                                              <h3 class="card-title" style="font-family: Krona One;" id="${array[i].title}">${array[i].title}<h3>
                                          </a>
                                          <p class="card-text truncate-overflow" style="font-size: 18px; color: #a3a3a3">${array[i].content}</p>
                                      </div>
                                  </div>
                                  <div class="row" style="color: rgb(145, 145, 145); font-family: Krona One; margin-left:10px; margin-bottom: 10px;">
                                  <hr/>
                                      <div class="col text-start">
                                          <div class="col text-start " style="margin-bottom:1px">
                                          <p style="font-size: 12px"> Posted on ${array[i].time}</p>                                         
                                          </div>
                                      </div>
                                      <div class="col text-end">
                                          <div class="col text-end " style="margin-bottom:1px">
                                          ${username}
                                          <img src="${profileImg}" style="width:30px; height:30px; object-fit:cover; border-radius:100px; border: #CC0062 2px solid" />
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              `
                          })
                      })
                  })
              })
              .catch((error) => {
                  console.log('error')
              })
          }
      }

        async getBlogData() {
          let docId = sessionStorage.getItem("docId");
          console.log(docId)

          const documentRef = doc(this.db, 'blogs', docId);
            try {
            const docSnapshot = await getDoc(documentRef);
            return docSnapshot
            } catch (error) {
            console.error('Error getting data:', error);
            }
        }

        async getPostHome(box) {
          const blogsCol = collection(this.db , 'blogs')
          const blogsSnapshot = await getDocs(blogsCol)
          let array = []
          const data = blogsSnapshot
          data.forEach(element => {
              array.push(element.data())
          });
          array.sort((a, b) => {
            if (a.day < b.day) {
              return -1;
            }
            if (a.day > b.day) {
              return 1;
            }
            else {
              if (a.month < b.month) {
                return -1;
              }
              if (a.month > b.month) {
                return 1;
              }
              else {
                if (a.year < b.year) {
                  return -1;
                }
                if (a.year > b.year) {
                  return 1;
                }
                else {
                  if (a.hour < b.hour) {
                    return -1;
                  }
                  if (a.hour > b.hour) {
                    return 1;
                  }
                  else {
                    if (a.minute < b.minute) {
                      return -1;
                    }
                    if (a.minute > b.minute) {
                      return 1;
                    }
                    else {
                      if (a.second < b.second) {
                        return -1;
                      }
                      if (a.second > b.second) {
                        return 1;
                      }
                      else {
                        return 0;
                      }
                    }
                  }
                }
              }
            }
          })    
          for (let i=0 ; i < 3 ; i++) {
              const storageRef = ref(this.storage, `OfficialPostImages/${array[i].image}`);
              await getDownloadURL(storageRef)
              .then((url) => {
                  this.getSomeData('users' , array[i].uid , 'username')
                  .then((username) => {
                      this.getSomeData('users' , array[i].uid , 'profile')
                      .then((profileName) => {
                          const storageRef2 = ref(this.storage, `profileImages/${profileName}`);
                          getDownloadURL(storageRef2)
                          .then((profileImg) => {
                              box.innerHTML += `
                              <div class="card" style="width: 75rem; margin-top: 10px; margin-bottom: 10px; ">
                                  <div class="row">
                                      <div class="col-md-4">
                                          <img class="img-fluid rounded-start rounded-end" src="${url}" style="margin-top: 10px; margin-bottom: 10px; width: 500px; height: 12rem; object-fit:cover; box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.25);">
                                      </div>
                                  <div class="col-md-8">
                                      <div class="card-body">
                                          <a href="#" class="click">
                                              <h3 class="card-title" style="font-family: Krona One;" id="${array[i].title}">${array[i].title}<h3>
                                          </a>
                                          <p class="card-text truncate-overflow" style="font-size: 18px; color: #a3a3a3">${array[i].content}</p>
                                      </div>
                                  </div>
                                  <div class="row" style="color: rgb(145, 145, 145); font-family: Krona One; margin-left:10px; margin-bottom: 10px;">
                                  <hr/>
                                      </div>
                                  </div>
                              </div>
                              `
                          })
                      })
                  })
              })
              .catch((error) => {
                  console.log('error ja')
              })
          }
      }

      async getBlogData() {
        let docId = sessionStorage.getItem("docId");
        console.log(docId)

        const documentRef = doc(this.db, 'blogs', docId);
          try {
          const docSnapshot = await getDoc(documentRef);
          return docSnapshot
          } catch (error) {
          console.error('Error getting data:', error);
          }
      }

      async getOfficialBlogs(box) {
          const blogsCol = collection(this.db , 'officialBlogs')
          const blogsSnapshot = await getDocs(blogsCol)
          let array = []
          const data = blogsSnapshot
          data.forEach(element => {
              array.push(element.data())
          });   
          for (let i=0 ; i < array.length ; i++) {
              const storageRef = ref(this.storage, `officialBlogsImages/${array[i].image}`);
              await getDownloadURL(storageRef)
              .then((url) => {
                              box.innerHTML += `
                              <div class="card" style="width: 75rem; margin-top: 10px; margin-bottom: 10px; ">
                                  <div class="row">
                                      <div class="col-md-4">
                                          <img class="img-fluid rounded-start rounded-end" src="${url}" style="margin-top: 10px; margin-bottom: 10px; width: 500px; height: 12rem; object-fit:cover; box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.25);">
                                      </div>
                                  <div class="col-md-8">
                                      <div class="card-body">
                                          <a href="#" class="click">
                                              <h3 class="card-title" style="font-family: Krona One;" id="${array[i].title}">${array[i].title}<h3>
                                          </a>
                                          <p class="card-text truncate-overflow" style="font-size: 18px; color: #a3a3a3">${array[i].content}</p>
                                      </div>
                                  </div>
                                  <div class="row" style="color: rgb(145, 145, 145); font-family: Krona One; margin-left:10px; margin-bottom: 10px;">
                                  <hr/>
                                      </div>
                                      <div class="col text-end">
                                          <div class="col text-end " style="margin-bottom:1px">
                                          Official Blogs
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              `
                          })
              .catch((error) => {
                  console.log('error')
              })
          }
      }

      async getNews(box) {
        const newsCol = collection(this.db , 'news')
        const newsSnapshot = await getDocs(newsCol)
        let array = []
        newsSnapshot.forEach(element => {
            array.push(element.data())
            console.log(array)
        });   
        for (let i=0 ; i < array.length ; i++) {
            const storageRef = ref(this.storage, `newsImages/${array[i].image}`);
            await getDownloadURL(storageRef)
            .then((url) => {
                            box.innerHTML += `
                            <div class="col-lg-4 col-md-6 col-sm-12" style="display: flex; margin-top: 10px; margin-bottom: 10px; justify-content: center;">
                            <div class="card" style="width: 18rem;">
                              <img src="${url}" class="card-img-top" style=" object-fit: cover; height: 170px;">
                              <div class="card-body" style="height: 180px;">
                                <a href="#" class="click">
                                  <h5 id="${array[i].title}" class="card-title truncate-overflow" >${array[i].title}</h5>
                                </a>
                                <p class="card-text truncate-overflow">${array[i].content}</p>
                              </div>
                            </div>
                          </div>
                          `
                        })
            .catch((error) => {
                console.log('error')
            })
        }
    }

    async getNewsData() {
      let docId = sessionStorage.getItem("docId");
        console.log(docId)

        const documentRef = doc(this.db, 'news', docId);
          try {
          const docSnapshot = await getDoc(documentRef);
          return docSnapshot
          } catch (error) {
          console.error('Error getting data:', error);
          }
    }

    async getOfficialBlogData() {
      let Id = sessionStorage.getItem("Id");
        console.log(Id)
  
        const documentRef = doc(this.db, 'officialBlogs', Id);
          try {
          const docSnapshot = await getDoc(documentRef);
          return docSnapshot
          } catch (error) {
          console.error('Error getting data:', error);
          }
    }
  }