import React, { createContext, useRef } from 'react';
import "./MainView.css";
import PageDashBoard from './Page_DashBoard.tsx';
import PageAppDetail from './Page_AppRunTime.tsx';
import PageSetting from './Page_Setting.tsx';
import SlideBar from './Components/Layout/SideBar.tsx';
import { Tab } from '@headlessui/react';
const ipcRenderer = window.require('electron').ipcRenderer;
const useState = React.useState;

// ！一定不要再设置在function里面了………………反复调用又22出错…………
export default function App() {
  const [isMonitorRunning, setIsMonitorRunning] = useState(true);
  //**----------------------------ScollBarPosition-----------------------------------------------------
  const [selectedIndex, setSelectedIndex] = useState(0);
  const ScollRef = useRef(null);
  // window.addEventListener("scroll", () => {
  //   setSelectedIndex(document.documentElement.scrollTop / window.innerHeight);
  // })
  //**----------------------------DarkMode-----------------------------------------------------
  const [isDarkMode, setIsDarkMode] = useState(false);
  //~~----------------------------Setting-----------------------------------------------------

  ipcRenderer.on('MonitorStateChange', (event, arg) => {
    setIsMonitorRunning(arg);
  });
  // document.getElementById("View").addEventListener('scroll', (event) => {

  // })
  ipcRenderer.on('DarkModeChange_fromSystem', (event, arg) => {
    // ！注意一定要写完event和arg不然错误…………………………
    setIsDarkMode(arg);
    // !初次启动可能无法设置…………
  })
  return (
    <div className={`dark:text-gray-200 ${isDarkMode ? 'dark' : ''}`}>
      <Tab.Group selectedIndex={selectedIndex}>
        {/* //！！用了as div才能使用view！ */}
        <SlideBar />
        <Tab.Panels ref={ScollRef} as='div' id='View' onScroll={handleScoll} className='absolute w-screen h-screen overflow-auto overflow-x-hidden scroll-smooth snap-y snap-mandatory -z-50 hideScollBar'>
          {/* ！wok！！！！才知道这个overflow-auto是必须的！！！！！！！ */}
          {/* ！同时这里加absolute可以防止子元素相对root定位而超过滚动条……………… */}
          {/* ！！！！必须用absolute！！用relative可能导致鼠标在子元素上时无法滚动 */}
          <PageDashBoard isMonitorRunning={isMonitorRunning} toggleState={toggleState} isDarkMode={isDarkMode} setIsDarkMode={handleDarkModeChange} />
          <PageAppDetail />
          <PageSetting />
        </Tab.Panels>
      </Tab.Group>
    </div>
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
  function handleScoll() {
    // td性能优化
    // e.target document.documentElement.scrollTop || document.body.scrollTop;
    // ！！！终于实现！！注意scollTop必须获取正确对象才能得到！！用上面那几个都不行！！！！！！！
    if (ScollRef.current === null) return;
    setSelectedIndex(Math.floor((ScollRef.current.scrollTop + window.innerHeight / 2) / window.innerHeight))
    // ！加入第三页后突然出现在第三页却显示第一页的bug，原来是/并不是整除……………………………………
  }
  function handleDarkModeChange(arg: boolean) {
    setIsDarkMode(arg);
    ipcRenderer.send('DarkModeChange', arg);
  }
}
