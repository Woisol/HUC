import "./MainView.css"
import BGGear from "./Components/BG_Gear";
import MainSwitch from "./Components/MainSwitch";
import { useState } from "react";
// ！记得react导入外部文件要通过这种方式！直接输路径localhost上面没有！
export default function PageDashBoard(props) {
	// td暂时放下状态变量的传递先…………
	const [isMonitorRunning, setIsMonitorRunning] = useState(true);
	// ！实现！函数类组件可以使用useState实现状态！
	// !同时也可以传递给子组件
	// console.log(isMonitorRunning);
	// let isMonitorRunnin = true, isOverseersRunning = true;
	function toggleState(props) {
		setIsMonitorRunning(!isMonitorRunning)
	}
	return (
		<div id="Page_DashBoard" className="w-full h-screen bg-blue-300 bg-opacity-40" style={{ scrollSnapAlign: "start" }}>
			<BGGear isMonitorRunning={isMonitorRunning} />
			<div className="w-full h-3/4 absolute bottom-0 bg-gray-300 rounded-t-2xl border-t-2 border-black ">
				<MainSwitch toggleState={toggleState} isMonitorRunning={isMonitorRunning} />
			</div>
		</div>
	)
}