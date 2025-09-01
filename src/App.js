import React from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCi5HGn3QUL-Zi_DJKD5AfddXNPnhvdjyg",
  authDomain: "react-firebase-chat-6d4de.firebaseapp.com",
  projectId: "react-firebase-chat-6d4de",
  storageBucket: "react-firebase-chat-6d4de.firebasestorage.app",
  messagingSenderId: "770688392434",
  appId: "1:770688392434:web:41be289d65262fa8e6c46b",
  measurementId: "G-FZ5599E3M2"
});

const auth= firebase.auth();
const firestore= firebase.firestore();
const [user]= useAuthState(auth);


function App() {
  return (
    <div className="App">
      <header className="App-header">
        
      </header>
      <section>
        {user ? <Chatroom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn(){
  const signInWithGoogle=()=>{
    const provider= new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={()=> auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom(){
  const messagesRef= firestore.collection('messages');
  const query= messagesRef.orderBy('createdAt').limit(25);
  const [messages]= useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue]= useState('');
  const sendMessage= async(e)=>{
    e.preventDefault();
    const {uid, photoURL}= auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('');
  }
  return(
    <>
      <div>
        {messages && messages.map(msg=> <ChatMessage key={msg.id} message={msg} />)}
      </div>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e)=> setFormValue(e.target.value)} />
        <button type='submit'>fly</button>
      </form>
    </>
  )
}

function ChatMessage(props){
  const {text, uid}= props.message;
  const messageClass= uid===auth.currentUser.uid ? 'sent' : 'received';
  return(
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )
}

export default App;
