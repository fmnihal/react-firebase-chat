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






import React, { useRef, useState, useEffect } from 'react'; // Added useEffect to be safe, but useState/useRef are needed
import './App.css';

// Import the specific functions you need from the new modular SDK
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, orderBy, query, limit } from 'firebase/firestore';

// You will still use these hooks
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

// Initialize Firebase app at the top level
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

// Get the services using the new modular functions
const auth = getAuth(app);
const firestore = getFirestore(app);

// Your main App component
function App() {
  // CORRECT: Call the hook inside the component
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
        {/* Pass the user object to SignOut, as it will be available here */}
        <SignOut user={user} />
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

// Accept the user as a prop
function SignOut({ user }){
  return user && (
    <button onClick={() => signOut(auth)}>Sign Out</button>
  )
}

function ChatRoom(){
  // All hooks must be inside the component
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
        <button type='submit'>fly</button>
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