import { isClassPrivateMethod } from '@babel/types';
import { data, event } from 'jquery';
import React, { useState } from 'react';
const ipcRenderer = window.require("electron").ipcRenderer;
// ipcRenderer.send("UpdateRunTime");
export default function PageAppDetail() {
	var [RunTimeData, UpdateRunTimeData] = useState([]);
	ipcRenderer.on("UpdateRunTime", (event, data) => {
		UpdateRunTimeData(data);
	})
	return (
		<div id="Page_AppDetail" className="w-screen h-screen px-20 py-6 bg-gray-300 border-y-2 border-black flex" style={{ scrollSnapAlign: "start" }}>
			<div className='w-20 h-full bg-gray-400 rounded-2xl'>

			</div>
			<div></div>

		</div>
	)
}