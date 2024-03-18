import * as React from 'react';
import $ from "jquery";
import Logo_Open from "../../Asset/Logo_Open.svg";
import Logo_Close from "../../Asset/Logo_Close.svg";
const ipcRenderer = window.require("electron").ipcRenderer;
var isMonitorRunning = true;
export default function MainSwitch({ isMonitorRunning }) {// isMonitorRunning, setState
	// const [isMonitorRunning, toggleState] = useState(isMonitorRunning)
	return (
		<div onContextMenu={(event) => { ipcRenderer.send("ContextMenu_MainSwitch"); }} className="h-48 w-fit absolute -top-32 left-10 flex items-center " style={{ transition: "0.8s" }}>
			<img id="MainSwitchImg" onClick={RequestMonitorStateChange} className={`h-48 w-48 p-3 shadow-2xl rounded-2xl border-black hover:p-0 hover:border-2  ${isMonitorRunning ? "bg-green-300" : "bg-red-300"}`} style={{ transitionProperty: "background-Color,padding", transition: "0.8s" }} src={isMonitorRunning ? Logo_Open : Logo_Close} alt={isMonitorRunning ? "Running" : "Stopped"} />
			{/* //！芜湖手动设定多个要用动画的属性！ */}
			<div className={isMonitorRunning ? "ml-5" : "ml-5 text-red-300 "} style={{ transition: "0.8s" }}>Monitor:{isMonitorRunning ? "Running" : "Stoped"}<br />Overseers:Running</div>
			{/* //！无法使用""+props...的形式来搞………… */}
		</div>
	);
}
function RequestMonitorStateChange() {
	$("#MainSwitchImg").removeClass("bg-green-300").removeClass("bg-red-300").addClass("bg-gray-500");
	isMonitorRunning = !isMonitorRunning;
	ipcRenderer.send("MonitorStateChange", isMonitorRunning);
	// td考虑超时无反应的问题
}