import { isClassPrivateMethod } from '@babel/types';
import { data, event } from 'jquery';
import React, { useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import $ from 'jquery';
import { transform } from '@babel/core';
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
	var [pxPerMin, UpdatePxPerMin] = useState(0);
	today = new Date();
	ipcRenderer.on("UpdateRunTime", (event, data) => {
		UpdateRunTimeData(data[0]);
		$("#DateSelector").val(data[1].getFullYear() + "-" + String(data[1].getMonth() + 1).padStart(2, '0') + "-" + String(data[1].getDate()).padStart(2, '0'));
		// !艹老是忘记这个语法…………
	})
	ipcRenderer.on("UpdateLastSeven", (event, data) => {
		UpdateLastSeven(data);
	})
	function TimeCard({ data }) {
		// !艹…………又是渲染先后的问题…………这个计算必须放在Showcase外面…………
		return (
			<div className="w-full absolute bg-gray-400 text-xs text-center text-transparent transition-all hover:text-black flex flex-col justify-center" style={{ height: `${(data[1] - data[0]) * pxPerMin}px`, bottom: `${data[0] * pxPerMin}px` }} >
				<span className='absolute right-5 z-10 ' style={{ transform: "rotate(270deg)" }}>{data[2][0].toLocaleTimeString()}<br />{data[2][1].toLocaleTimeString()}</span>
			</div >

		);
	}
	function AppRunTimeShowcase({ data }) {
		setInterval(() => UpdatePxPerMin($('.AppRunTimeShowcase').height() / 1440), 1000);
		//！艹…………jQuery的方法…………直接用height就自动返回第一个元素的不用[0]
		return (
			<div className='w-32 h-full p-2 mx-2 flex flex-col items-center rounded-2xl shadow-xl transition-all hover:shadow-2xl' style={{ backgroundColor: `${data[2]}` }}>
				<div className="AppRunTimeShowcase w-7 h-full relative right-2 bg-gray-300 shadow-lg rounded-lg transition-all hover:shadow-2xl">
					{data[4].map((item, index) => {
						let tmpStarMin = item[0].getHours() * 60 + item[0].getMinutes() + item[0].getSeconds() / 60 - 240;
						let tmpEndmin = item[1].getHours() * 60 + item[1].getMinutes() + item[1].getSeconds() / 60 - 240;

						return (
							<TimeCard key={index} data={[tmpStarMin > 0 ? tmpStarMin : tmpStarMin + 1440, tmpEndmin > 0 ? tmpEndmin : tmpEndmin + 1440, item]} />
						)
					})}
					{/* //~~傻………………明明可以在return的时候用js的……………… */}
					{/* //!并不能在return里面用传统js…………必须有返回值………… */}
					{new Array(4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3).map((cur, index) => (
						<small className='w-8 left-7 absolute border-b-2 text-gray-500 text-right align-text-bottom'
							style={{
								bottom: `${index * 60 * pxPerMin}px`,
								height: `${60 * pxPerMin}px`,
							}} key={index - 3}>{`${cur}:00`}</small>
					))}

				</div>
				<div className="w-20 h-20 mx-1 p-2 relative rounded-2xl bg-blue-300 hover:shadow-2xl transition-all hover:bg-blue-400 text-transparent hover:text-black" > <img className="w-full h-full" src={data === undefined ? null : data[3]} alt="AppName" /> <span className='w-12 absolute bottom-0 text-center'>{data === undefined ? null : data[0]}</span></div>
			</div>
		)
	}
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
				<div className="w-10/12 h-44 mb-5 relative bg-white shadow-lg transition-all hover:shadow-xl rounded-2xl transition-all hover:bg-gray-100" onContextMenu={(event) => { ipcRenderer.send("ContextMenu_LastSeven",); }}>
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
