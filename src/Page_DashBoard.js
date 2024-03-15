// td 用headlessUI重构
import "./MainView.css"
import BGGear from "./Components/Dashboard/BG_Gear.js";
import MainSwitch from "./Components/Dashboard/MainSwitch.js";
import Console from "./Components/Dashboard/Console.js";
import AppRunnningBar from "./Components/Dashboard/AppRunningBar.tsx";
// ！记得react导入外部文件要通过这种方式！直接输路径localhost上面没有！
export default function PageDashBoard(props) {
	// td暂时放下状态变量的传递先…………
	// ！实现！函数类组件可以使用useState实现状态！
	// !同时也可以传递给子组件
	// console.log(isMonitorRunning);
	// let isMonitorRunnin = true, isOverseersRunning = true;
	return (
		<div id="Page_DashBoard" className="w-full h-screen bg-blue-300 bg-opacity-40" style={{ scrollSnapAlign: "start" }}>
			<BGGear isMonitorRunning={props.isMonitorRunning} />
			<div className="w-full h-3/4 p-20 absolute bottom-0 bg-gray-300 rounded-t-2xl border-t-2 border-black ">
				<MainSwitch isMonitorRunning={props.isMonitorRunning} />
				<Console />
				<div className="w-full h-full flex flex-col items-center">
					<AppRunnningBar />
				</div>
			</div>
		</div>
	)
}