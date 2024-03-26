// ！尝试改成ts但是似乎react用不了？哦哦是tsx哈哈
// !改了tsx又忘记tailwindcss的配置…………
// td加入刷新功能
import React from 'react';

import { useState } from "react"
// import More from "../../Asset/three-dots.svg"
const ipcRenderer = window.require("electron").ipcRenderer;
// var AppStateFile = JSON.parse(require("./AppState.json"));

function AppRunning(props) {
	return (
		<div className="relative w-12 h-12 p-2 mx-1 transition-all bg-blue-300 shadow-2xl dark:bg-blue-700 sm:w-16 sm:h-16 rounded-2xl hover:bg-blue-400 group" > <img className="w-full h-full" src={props.img} alt="More" /> <span className='absolute bottom-0 hidden p-1 text-xs text-center -translate-x-1/2 bg-white rounded-md opacity-75 left-1/2 w-fit group-hover:block'>{props.appName}</span></div>
	);
	// ！艹艹艹啊啊啊啊啊又是props的问题！！！！！！！！！！！！！
}
// function ShowMore() {
// 	return (
// 		<div className="w-16 h-16 p-2 mx-1 transition-all bg-blue-300 shadow-2xl rounded-2xl hover:bg-blue-400" > <img className="w-full h-full" src={More} alt="More" /> </div>
// 	)
// }
export default function AppRunnningBar() {
	// const [AppIcons, UpdateAppIcons] = useState([])
	// !艹…………还要分别传过来然后比较再合并………………在main处理完再传过来吧…………
	// ！本来也应该按照“渲染”进程的叫法分开操作的呀…………
	const [RunningAppInfo, UpdateRunningAppInfo] = useState([])
	// !艹又来…………反复调用………………
	// ipcRenderer.on("GetAppIcons", (event, arg) => {
	// 	UpdateAppIcons(arg);
	// })
	ipcRenderer.on("UpdateRunningAppInfo", (event, arg) => {
		UpdateRunningAppInfo(arg);
	})
	// RunningApp.map((item, index) => {
	// 	AppIcons.forEach(icon => {
	// 		if (item[0] == RunningApp[0]) {
	// 		}
	// 	})
	// })
	// ！require会默认解析为json对象
	return (
		<div className="w-full max-w-[770px] h-fit px-1 py-2 sm:px-2 relative transition-all RoundAndShadow bg-blue-200 dark:bg-blue-800 flex items-center" >
			<span className="absolute sm:text-xl -top-4 left-4" > 运行中应用 </span>
			{RunningAppInfo.length === 0 ? <span className="w-full h-full p-5 text-xl text-center text-gray-500">暂无</span> : RunningAppInfo.map((item, index) => {
				return (
					<AppRunning key={index} appName={item[0]} img={item[1]} />
				)
			})}
			{/* < ShowMore /> */}
			<span className="absolute px-2 text-sm transition-all bg-white shadow-2xl -top-4 right-4 rounded-2xl hover:bg-gray-100 dark:bg-gray-500" > 已监视应用 </span>
		</div>
	)
}
// ！sent的这种都应该放在最后面
// ipcRenderer.send("GetAppIcons");
