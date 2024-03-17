import React, { useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import $ from 'jquery';
import AppRunTimeShowcase from './Components/AppRunTime/AppRunTimeShowcase.tsx';
const ipcRenderer = window.require("electron").ipcRenderer;
// ipcRenderer.send("UpdateRunTime");
var today = new Date();
//**----------------------------SideBar-----------------------------------------------------
function SideBarSpace() {
	return (
		<div className="w-full h-8 border-b-2 border-black"></div>
	);
}
function SideBarTemplate(props) {
	// ！区别就在于…………react组件传进来都是props的
	// ！不过也可以用{}预先解构
	return (
		<div className="w-full h-8 border-b-2 border-black"></div>
	);
}
function SideBarOption({ OnClickFunc, Title }) {
	return (
		<div className='w-full h-10 p-2 border-b-2 border-black text-center shadow-2xl transition-all hover:text-xl hover:p-1 hover:bg-gray-300' onClick={OnClickFunc}>{Title}</div>
	);
}
//**----------------------------AppRunTimeShowcase-----------------------------------------------------
// !这个数据做不到跟随窗口变化即时改变…………考虑用state
//**----------------------------Page-----------------------------------------------------
export default function PageAppRunTime() {
	var [LastSeven, UpdateLastSeven] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
	var [RunTimeData, UpdateRunTimeData] = useState([]);
	today = new Date();
	ipcRenderer.on("UpdateRunTime", (event, data) => {
		UpdateRunTimeData(data[0]);
		$("#DateSelector").val(data[1].getFullYear() + "-" + String(data[1].getMonth() + 1).padStart(2, '0') + "-" + String(data[1].getDate()).padStart(2, '0'));
		// !艹老是忘记这个语法…………
	})
	ipcRenderer.on("UpdateLastSeven", (event, data) => {
		UpdateLastSeven(data);
	})
	const todayDateString = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, '0') + "-" + String(today.getDate()).padStart(2, '0');
	//！ From TY，这格式要求也太严格吧……………………估计是差了0就不得…………………
	//**----------------------------LastSeven-----------------------------------------------------
	var option = {
		xAxis: {
			data: [`${today.getMonth() + 1}-${today.getDate() - 6}`, `${today.getMonth() + 1}-${today.getDate() - 5}`, `${today.getMonth() + 1}-${today.getDate() - 4}`, `${today.getMonth() + 1}-${today.getDate() - 3}`, `${today.getMonth() + 1}-${today.getDate() - 2}`, `${today.getMonth() + 1}-${today.getDate() - 1}`, `${today.getMonth() + 1}-${today.getDate()}`]
		},
		yAxis: {},
		series: [
			{
				name: '小时数',
				type: 'bar',
				"areaStyle": {
					color: "#87CEFA",
					opacity: 0.5
				},
				data: [...LastSeven]
			}
		],
		tooltip: {
			trigger: 'item',
			formatter: '{a}:{c}h'
		},
	};

	return (
		<div id="Page_AppDetail" className="w-screen h-screen pl-20 pr-1 py-6 bg-gray-300 border-y-2 border-black flex" style={{ scrollSnapAlign: "start" }}>
			<div className='w-40 h-full py-8 bg-gray-100 rounded-2xl'>
				<input id='DateSelector' className='w-full h-10 border-b-2 border-black text-center bg-transparent hover:shadow-2xl transition-all hover:bg-gray-300' type={"Date"} defaultValue={todayDateString} max={todayDateString} onChange={(event) => {
					ipcRenderer.send("UpdateRunTime", new Date(event.target.value))
				}} />
				<SideBarTemplate />
				<SideBarSpace />
				<SideBarOption Title="日视图" OnClickFunc={{}} />
				<SideBarOption Title="周视图" OnClickFunc={{}} />
			</div>
			<div className="w-11/12 h-full p-5 relative flex flex-col justify-center items-center" >
				<div className="w-10/12 h-44 mb-5 relative bg-white shadow-lg rounded-2xl transition-all hover:shadow-xl hover:bg-gray-100" onContextMenu={(event) => { ipcRenderer.send("ContextMenu_LastSeven",); }}>
					<span className='absolute -top-3 left-4'>近7天使用情况</span>
					<ReactEcharts option={option} style={{ width: "110%", height: "150%", position: "absolute", left: "-15px", top: "-30px" }} />
					{/* //!艹分不清楚………………这个是{}不是{{}}………… */}
				</div>
				<div className="hideScollBar w-full h-full p-3 flex bg-white shadow-xl transition-all hover:shadow-2xl rounded-2xl overflow-x-scroll " onContextMenu={(event) => { ipcRenderer.send("ContextMenu_RunTime"); }}>
					{/* <AppRunTimeShowcase key={1} data={["Test", "Test", "#87CEFA", "", [[0, 60]]]} /> */}
					{/* <AppRunTimeShowcase key={1} data={["Test", "Test", "#87CEFA", "", [[0, 1440]]]} /> */}
					{RunTimeData.map((data, index) => {
						return (
							<AppRunTimeShowcase key={index} data={data} />
							// ~~~这个data同名好像可以隐藏？并不行
						)
					})}
				</div>
			</div>
		</div>
	)
}
