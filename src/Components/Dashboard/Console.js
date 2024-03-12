import React, { useState } from "react";
import close from "../../Asset/x-lg.svg"
import $ from "jquery";
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
export default function Console(props) {
	// const runtimeLogFileStream = require("fs").createReadStream("../../Monitor/runtimeLog.rlf");
	//！ wok注意渲染进程没有权限！！！
	let [content, UpdateContent] = useState(["2024-03-07 20:56 STAT APP Started"]);
	ipcRenderer.send("GetRuntimeLog");//！似乎每次更新属性都会重新运行一遍函数，导致反复刷新了…………
	ipcRenderer.on("ContentUpdate", function (event, arg) {
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
		UpdateContent(arg);
	})
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div id="console" className="console absolute right-0 z-10 overflow-scroll rounded-2xl bg-gradient-to-t from-black to-gray-500 text-xs text-white text-nowrap"
			style={isOpen ? { width: "300px", height: "600px", top: "50%", padding: "20px", transform: "translateY(-50%)", transition: "0.5s" } : { width: "20px", height: "120px", top: "50%", transform: "translateY(-50%)", transition: "0.5s" }}
			onClick={() => setIsOpen(true)}>
			{/* //!woq真的神奇…………下面设置完false以后上面再次设回了true导致看似没有效果 */}
			{/* //！解决方法：使用下面的event.stopPropagation() */}
			<div className={isOpen ? "w-8 h-8 absolute right-4 top-2 rounded-lg transition-all hover:bg-gray-400" : "hidden"} onClick={(event) => { event.stopPropagation(); setIsOpen(false) }}><img className="w-8 h-8 bg-transparent" src={close} alt="" /></div>
			{isOpen ? content.map((item, index) => {
				return <p key={index}>{item}</p>
			}) : ""}
			{/* //！艹啊啊啊啊啊啊其实巨简单啊啊啊为什么一定要拘泥于那个变量啊啊啊啊啊啊！！！ */}
			{/* //！electron添加右键菜单不太一样……暂放 */}
		</div >
	);
}