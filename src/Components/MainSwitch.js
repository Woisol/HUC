import { useState } from "react";
import Logo from "../Asset/Logo.svg"
export default function MainSwitch(props) {// isMonitorRunning, setState
	// const [isMonitorRunning, toggleState] = useState(props.isMonitorRunning)
	return (
		<div className="h-48 w-fit absolute -top-32 left-10 flex items-center">
			<img onClick={props.toggleState} className={props.isMonitorRunning ? "h-48 w-48 p-3 shadow-2xl bg-green-300 rounded-2xl" : "h-48 w-48 p-3 shadow-2xl bg-red-300 rounded-2xl"} src={Logo} alt={props.isMonitorRunning ? "Running" : "Stopped"} />
			<div className={props.isMonitorRunning ? "ml-5" : "ml-5 text-red-300"}>Monitor:{props.isMonitorRunning ? "Running" : "Stoped"}<br />Overseers:Running</div>
			{/* //！无法使用""+props....的形式来搞………… */}
		</div>
	);
}