import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import PageDashBoard from './Page_DashBoard';
import PageAppDetail from './Page_AppDetail';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className='w-scree h-screen overflow-auto overflow-x-hidden' style={{ scrollSnapType: 'y mandatory' }}>
      {/* ！wok！！！！才知道这个overflow-auto是必须的！！！！！！！ */}
      <PageDashBoard />
      <PageAppDetail />
    </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
