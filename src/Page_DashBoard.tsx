// td 用headlessUI重构
import React from 'react';
import BGGear from "./Components/Dashboard/BG_Gear.tsx";
import MainSwitch from "./Components/Dashboard/MainSwitch.tsx";
import Console from "./Components/Dashboard/Console.tsx";
import AppRunnningBar from "./Components/Dashboard/AppRunningBar.tsx";
// ！记得react导入外部文件要通过这种方式！直接输路径localhost上面没有！
export default function PageDashBoard(props) {
	// td暂时放下状态变量的传递先…………
	// ！实现！函数类组件可以使用useState实现状态！
	// !同时也可以传递给子组件
	// console.log(isMonitorRunning);
	// let isMonitorRunnin = true, isOverseersRunning = true;
	return (
		<div id="Page_DashBoard" className="w-full h-screen transition-all bg-blue-300 border-black bg-opacity-40 border-y-2 snap-start" >
			<BGGear isMonitorRunning={props.isMonitorRunning} />
			<div className="absolute bottom-0 w-full py-20 bg-gray-300 border-t-2 border-black h-3/4 rounded-t-2xl ">
				<MainSwitch isMonitorRunning={props.isMonitorRunning} />
				<Console />
				<div className="flex flex-col items-center w-full h-full">
					<AppRunnningBar />
				</div>
			</div>
		</div>
	)
}