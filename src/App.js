import { React, useState } from 'react';
import PageDashBoard from './Page_DashBoard';
import PageAppDetail from './Page_AppDetail';
import SlideBar from './Components/Layout/SideBar';
const ipcRenderer = window.require('electron').ipcRenderer;

export default function App() {
  const [isMonitorRunning, setIsMonitorRunning] = useState(true);
  return (
    <>
      <SlideBar />
      <div className='Page w-screen h-screen absolute overflow-auto overflow-x-hidden -z-50' style={{ scrollSnapType: 'y mandatory' }}>
        {/* ！wok！！！！才知道这个overflow-auto是必须的！！！！！！！ */}
        {/* ！同时这里加absolute可以防止子元素相对root定位而超过滚动条……………… */}
        {/* ！！！！必须用absolute！！用relative可能导致鼠标在子元素上时无法滚动 */}
        <PageDashBoard isMonitorRunning={isMonitorRunning} toggleState={toggleState} />
        <PageAppDetail />
      </div>
    </>
  );
  function toggleState() {
    setIsMonitorRunning(!isMonitorRunning);
    if (isMonitorRunning) {
      ipcRenderer.send("MonitorStateChange", false);
    }
    else {
      ipcRenderer.send("MonitorStateChange", true);
    }
  }
  // console.log(isMonitorRunning);
}