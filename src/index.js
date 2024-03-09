import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import PageDashBoard from './Page_DashBoard';
import PageAppDetail from './Page_AppDetail';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className='w-screen h-screen absolute overflow-auto overflow-x-hidden -z-50' style={{ scrollSnapType: 'y mandatory' }}>
      {/* ！wok！！！！才知道这个overflow-auto是必须的！！！！！！！ */}
      {/* ！同时这里加absolute可以防止子元素相对root定位而超过滚动条……………… */}
      {/* ！！！！必须用absolute！！用relative可能导致鼠标在子元素上时无法滚动 */}
      <PageDashBoard />
      <PageAppDetail />
    </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
