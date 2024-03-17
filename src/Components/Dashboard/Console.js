import React, { useEffect, useState } from "react";
import close from "../../Asset/x-lg.svg"
import $, { event } from "jquery";
// import $ from "jquery";
// import { ipcRenderer } from 'electron';
const { ipcRenderer } = window.require("electron");
// ！艹又忘记了要先有preload.js………………
// ！！！！！！！！！大难题！！！
// ！注意在react里面要调用Electron必须要用window.require！
// ！原因见下面两篇博客
//https://blog.csdn.net/weixin_42728767/article/details/129499927
// https://segmentfault.com/a/1190000021898410
//！搜的electron react fs才出来这么多精品文章！！！
// ！用不了，addEventListener不是函数，本质就就是用不了
// $("#console").addEventListener("click", () => { $("#ContextMenu").hide() })
// $("#console").addEventListener('contextmenu', function (event) {
// 	event.preventDefault();
// 	$("#ContextMenu").css({
// 		"top": event.clientY + "px",
// 		"left": event.clientX + "px"
// 	})

// 	$("#ContextMenu").fadeIn();
// })
//**----------------------------MonitorInputLisener-----------------------------------------------------

export default function Console(props) {
	// const runtimeLogFileStream = require("fs").createReadStream("../../Monitor/runtimeLog.rlf");
	//！ wok注意渲染进程没有权限！！！
	let [content, UpdateContent] = useState(["Monitor Started"]);
	useEffect(() => {
		// $("#console").scrollTop = $("#console").scrollHeight;
		if (!isOpen) return;
		const console = document.getElementById("console");
		console.scrollTop = console.scrollHeight;
		// 芜湖实现
		// ！注意jQuery的语法和js的不完全一样…………注意区分…………
	})
	// ipcRenderer.send("GetRuntimeLog");//！似乎每次更新属性都会重新运行一遍函数，导致反复刷新了…………
	ipcRenderer.on("ContentUpdate", function (event, newContents) {
		// function Line(item) {
		// 	return (
		// 		<p>${item}</p>
		// 	)
		// }
		// let content = <Line item="" key={-1} />;
		// // !难以返回一个元素…………
		// arg.map((item, index) => {
		// 	content += <Line item={item} key={index} />;
		// })
		// let content = React.createElement("p");
		// content = [];
		// arg.map((item, index) => {
		// 	const line = document.createElement("p");
		// 	line.innerText = item;
		// 	content.push(line);
		// })
		// if (arg == content[content.length - 1]) return;
		// ！人傻了被迫补牢…………
		// content.push(arg)
		// UpdateContent();
		// !人傻了加了这句content就不是数组了？？？
		// $("#console").append(`<p>${arg}</p>`)
		// ！而且这样useEffect会失效…………

		if (Array.isArray(newContents))
			//！啊啊官网的教程！！！！！！！就是针对数组的！
			UpdateContent([...content, ...newContents]);
		else
			UpdateContent([...content, newContents]);
		// ！艹完美解决！！！！！之前重复输入的问题果然是Update导致的！！！！
	})
	ipcRenderer.on("ConsoleClear", () => {
		UpdateContent([]);
	})
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div className="absolute right-0 top-0 z-10 rounded-2xl bg-gradient-to-t from-black to-gray-500"
			style={isOpen ? { width: "300px", height: "600px", top: "50%", padding: "20px", transform: "translateY(-50%)", transition: "0.5s" } : { width: "20px", height: "120px", top: "50%", transform: "translateY(-50%)", transition: "0.5s" }}
			onClick={() => setIsOpen(true)} onContextMenu={(event) => { ipcRenderer.send("ContextMenu_Console"); }}>
			<div className={isOpen ? "w-8 h-8 absolute right-4 top-2 rounded-lg transition-all hover:bg-gray-400" : "hidden"} onClick={(event) => { event.stopPropagation(); setIsOpen(false) }}><img className="w-8 h-8 bg-transparent" src={close} alt="" /></div>
			<div id="console" className="console hideScollBar w-full h-full overflow-scroll text-white text-nowrap"
			>
				{/* //!woq真的神奇…………下面设置完false以后上面再次设回了true导致看似没有效果 */}
				{/* //！解决方法：使用下面的event.stopPropagation() */}
				{isOpen ? content.map((item, index) => {
					return <p key={index}>{item}</p>
				}) : ""}
				{/* //！艹啊啊啊啊啊啊其实巨简单啊啊啊为什么一定要拘泥于那个变量啊啊啊啊啊啊！！！ */}
				{/* //！electron添加右键菜单不太一样……暂放 */}
				{/* {$("#console").scrollTop = $("#console").height; } */}
				{/* //！TY：无法在jsx模板内使用js，且最佳实践应该是用react的状态 */}
			</div >
			<input className={`w-full relative bottom-2 rounded-2xl transition-all hover:bg-gray-300 focus:bg-gray-300 ${isOpen ? "" : "hidden"}`} type="text" onKeyDown={handleInputEnter} />
		</div>
	);
}
function handleInputEnter(event) {
	if (event.key === 'Enter' || event.keyCode === 13) {
		ipcRenderer.send("MonitorPcsStdinWrite", event.target.value)
		event.target.value = "";
	}
}