import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

//Connect app to firebase
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC20DLtti8UsFP7TK7uk1sQjK-Sr_GIlSM",
  authDomain: "choplink-c4ea6.firebaseapp.com",
  databaseURL: "https://choplink-c4ea6-default-rtdb.firebaseio.com",
  projectId: "choplink-c4ea6",
  storageBucket: "choplink-c4ea6.appspot.com",
  messagingSenderId: "170883469382",
  appId: "1:170883469382:web:f3d62b0b0523db33c4fa47",
  measurementId: "G-VKLQVRYXPB"
};

initializeApp(firebaseConfig);
ReactDOM.render(
  <BrowserRouter>
      <App />
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
