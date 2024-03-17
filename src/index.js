// npx tailwindcss -i ./src/input.css -o ./src/MainView.css --watch
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import reportWebVitals from './reportWebVitals';
const ipcRenderer = window.require('electron').ipcRenderer;

// let runningState = true;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode >
);
ipcRenderer.send("UIInited");
// ！对啦！应该在这里sent嘛而不是在App里面…………export那个函数必须在前面…………


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
