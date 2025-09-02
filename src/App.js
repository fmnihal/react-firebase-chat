// import React from 'react';
// import './App.css';
// // import firebase from 'firebase/app';
// import * as firebase from 'firebase/app';
// // import { initializeApp } from "firebase/app";
// // import { getAuth } from "firebase/auth";
// // import { getFirestore } from "firebase/firestore";
// import 'firebase/firestore';
// import 'firebase/auth';
// import {useAuthState} from 'react-firebase-hooks/auth';
// import {useCollectionData} from 'react-firebase-hooks/firestore';

// firebase.initializeApp({
//   apiKey: "AIzaSyCi5HGn3QUL-Zi_DJKD5AfddXNPnhvdjyg",
//   authDomain: "react-firebase-chat-6d4de.firebaseapp.com",
//   projectId: "react-firebase-chat-6d4de",
//   storageBucket: "react-firebase-chat-6d4de.firebasestorage.app",
//   messagingSenderId: "770688392434",
//   appId: "1:770688392434:web:41be289d65262fa8e6c46b",
//   measurementId: "G-FZ5599E3M2"
// });

// const auth= firebase.auth();
// const firestore= firebase.firestore();
// const [user]= useAuthState(auth);


// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
        
//       </header>
//       <section>
//         {user ? <Chatroom /> : <SignIn />}
//       </section>
//     </div>
//   );
// }

// function SignIn(){
//   const signInWithGoogle=()=>{
//     const provider= new firebase.auth.GoogleAuthProvider();
//     auth.signInWithPopup(provider);
//   }
//   return(
//     <button onClick={signInWithGoogle}>Sign in with Google</button>
//   )
// }

// function SignOut(){
//   return auth.currentUser && (
//     <button onClick={()=> auth.signOut()}>Sign Out</button>
//   )
// }

// function ChatRoom(){
//   const dummy= useRef();
//   const messagesRef= firestore.collection('messages');
//   const query= messagesRef.orderBy('createdAt').limit(25);
//   const [messages]= useCollectionData(query, {idField: 'id'});
//   const [formValue, setFormValue]= useState('');
//   const sendMessage= async(e)=>{
//     e.preventDefault();
//     const {uid, photoURL}= auth.currentUser;
//     await messagesRef.add({
//       text: formValue,
//       createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//       uid,
//       photoURL
//     })
//     setFormValue('');
//     dummy.current.scrollIntoView({behavior: 'smooth'});
//   }
//   return(
//     <>
//       <main>
//         {messages && messages.map(msg=> <ChatMessage key={msg.id} message={msg} />)}
//         <div ref={dummy}></div>
//       </main>
//       <form onSubmit={sendMessage}>
//         <input value={formValue} onChange={(e)=> setFormValue(e.target.value)} />
//         <button type='submit'>fly</button>
//       </form>
//     </>
//   )
// }

// function ChatMessage(props){
//   const {text, uid}= props.message;
//   const messageClass= uid===auth.currentUser.uid ? 'sent' : 'received';
//   return(
//     <div className={`message ${messageClass}`}>
//       <img src={photoURL} />
//       <p>{text}</p>
//     </div>
//   )
// }

// export default App;






import React, { useRef, useState, useEffect } from 'react';
import './App.css';

import { Send, LogOut, Moon, Sun } from 'lucide-react';

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, orderBy, query, limit } from 'firebase/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyCi5HGn3QUL-Zi_DJKD5AfddXNPnhvdjyg",
  authDomain: "react-firebase-chat-6d4de.firebaseapp.com",
  projectId: "react-firebase-chat-6d4de",
  storageBucket: "react-firebase-chat-6d4de.firebasestorage.app",
  messagingSenderId: "770688392434",
  appId: "1:770688392434:web:41be289d65262fa8e6c46b",
  measurementId: "G-FZ5599E3M2"
};
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);


function App() {
  const [user] = useAuthState(auth);
  const [theme, setTheme]= useState('light');
  const toggleTheme=()=>{
    setTheme(currentTheme=>(currentTheme==='light' ? 'dark':'light'));
  }

  return (
    <div className={`App ${theme}`}>
      <header className="App-header">
        <SignOut user={user} />
        <button onClick={toggleTheme} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          {theme === 'light' ? <Moon /> : <Sun />}
          {theme === 'light' ? 'Night Mode' : 'Day Mode'}
        </button>
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn(){
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  }
  return(
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}


function SignOut({ user }){
  return user && (
    <button onClick={() => signOut(auth)} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>Sign Out <LogOut /></button>
  )
}

function ChatRoom(){
  
  const dummy = useRef();
  const [formValue, setFormValue] = useState('');

  const messagesRef = collection(firestore, 'messages');
  const messagesQuery = query(messagesRef, orderBy('createdAt'), limit(25));
  const [messages] = useCollectionData(messagesQuery, { idField: 'id' });

  const sendMessage = async(e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;

    await addDoc(collection(firestore, 'messages'), {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  };

  return(
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        {/* <button type='submit' style={display: 'flex'; alignItems: 'center'; gap: '5px';}><Send /> Send</button> */}
        <button type='submit' style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Send /> Send</button>
      </form>
    </>
  )
}

function ChatMessage(props){
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return(
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="User Avatar" />
      <p>{text}</p>
    </div>
  )
}

export default App;