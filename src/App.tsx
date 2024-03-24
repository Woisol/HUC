import React from 'react';
import "./MainView.css";
import PageDashBoard from './Page_DashBoard.tsx';
import PageAppDetail from './Page_AppRunTime.tsx';
import SlideBar from './Components/Layout/SideBar.tsx';
const ipcRenderer = window.require('electron').ipcRenderer;
const useState = React.useState;

// ！一定不要再设置在function里面了………………反复调用又22出错…………
export default function App() {
  const [isMonitorRunning, setIsMonitorRunning] = useState(true);
  ipcRenderer.on('MonitorStateChange', (event, arg) => {
    setIsMonitorRunning(arg);
  });

  return (
    <>
      <SlideBar />
      <div className='absolute w-screen h-screen overflow-auto overflow-x-hidden scroll-smooth snap-y snap-mandatory -z-50 hideScollBar'>
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