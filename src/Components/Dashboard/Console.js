import { useState } from "react";
// import { ipcRenderer } from 'electron';
const { ipcRenderer } = window.require("electron");
// ！艹又忘记了要先有preload.js………………
// ！！！！！！！！！大难题！！！
// ！注意在react里面要调用Electron必须要用window.require！
// ！原因见下面两篇博客
//https://blog.csdn.net/weixin_42728767/article/details/129499927
// https://segmentfault.com/a/1190000021898410
//！搜的electron react fs才出来这么多精品文章！！！

export default function Console(props) {
	// const runtimeLogFileStream = require("fs").createReadStream("../../Monitor/runtimeLog.rlf");
	//！ wok注意渲染进程没有权限！！！
	const [content, UpdateContent] = useState("2024-03-07 20:56 STAT APP Started");
	ipcRenderer.send("GetRuntimeLog");//！似乎每次更新属性都会重新运行一遍函数，导致反复刷新了…………
	ipcRenderer.on("ContentUpdate", function (event, arg) {
		UpdateContent(arg);
	})
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div className="absolute right-0 z-10 overflow-hidden rounded-2xl bg-gradient-to-t from-black to-gray-500 text-wrap text-xs text-white" style={isOpen ? { width: "300px", height: "600px", top: "50%", padding: "20px", transform: "translateY(-50%)", transition: "0.5s" } : { width: "20px", height: "120px", top: "50%", transform: "translateY(-50%)", transition: "0.5s" }} onClick={toggleIsOpen}>{isOpen ? content : ""}</div>
	);
	function toggleIsOpen() {
		setIsOpen(!isOpen);
	}
}