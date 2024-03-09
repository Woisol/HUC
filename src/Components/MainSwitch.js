import Logo from "../Asset/Logo.svg"
function MainSwitch(props) {// isMonitorRunning, setState
	return (
		<div className="h-48 w-fit absolute -top-32 left-10 flex items-center">
			<img onClick={props.toggleState} className={props.isMonitorRunning ? "h-48 w-48 p-3 bg-green-600 rounded-2xl" : "h-48 w-48 p-3 bg-red-600 rounded-2xl"} src={Logo} alt={props.isMonitorRunning ? "Running" : "Stopped"} />
			<div className={props.isMonitorRunning ? "ml-5" : "ml-5 text-red-600"}>Monitor:Running<br />Overseers:Running</div>
			{/* //！无法使用""+props....的形式来搞………… */}
		</div>
	);
}
export default MainSwitch;