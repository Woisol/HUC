import React, { useEffect, useState, useSyncExternalStore } from 'react';
import ReactEcharts from 'echarts-for-react';
import $ from 'jquery';
import AppRunTimeShowcase from './Components/AppRunTime/AppRunTimeShowcase.tsx';
import Dialog from './Components/Layout/Dialog.tsx';
import EChartsReact from 'echarts-for-react';
import { RadioGroup } from '@headlessui/react';
import { DragDropContext, Droppable } from "react-beautiful-dnd";
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
		<div className='w-full h-10 p-2 text-center transition-all border-b-2 border-black shadow-2xl hover:text-xl hover:p-1 hover:bg-gray-300 dark:hover:bg-gray-600' onClick={OnClickFunc}>{Title}</div>
	);
}
//**----------------------------AppRunTimeShowcase-----------------------------------------------------
// !这个数据做不到跟随窗口变化即时改变…………考虑用state
//**----------------------------Page-----------------------------------------------------
var runTimeHistory = [];
export default function PageAppRunTime() {
	const [RunTimeData, setRunTimeData] = useState([]);
	const [LastSeven, setLastSeven] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
	const [SingleRunTimeData, setSingleRunTimeData] = useState([]);
	const [singleAppInfoOpen, setSingleAppInfoOpen] = useState(false);
	const [addAppsOpen, setAddAppsOpen] = useState(false);
	const [addAppInfo, setAddAppInfo] = useState(['newApp', 'None', '#BFDBFE', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwLjAwMDAwMCIgaGVpZ2h0PSI0MDAuMDAwMDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+Cgk8ZGVzYz4KCQkJQ3JlYXRlZCB3aXRoIFBpeHNvLgoJPC9kZXNjPgoJPGRlZnM+CgkJPGZpbHRlciBpZD0iZmlsdGVyXzcwXzE4NF9kZCIgeD0iMjIuNzk0OTIyIiB5PSIzNy4wMDAwMDAiIHdpZHRoPSIzNTQuNDEwMTU2IiBoZWlnaHQ9IjI5Ni43NTAwMDAiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KCQkJPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KCQkJPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiIHJlc3VsdD0iaGFyZEFscGhhIi8+CgkJCTxmZU9mZnNldCBkeD0iMCIgZHk9IjQiLz4KCQkJPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMS4zMzMzMyIvPgoJCQk8ZmVDb21wb3NpdGUgaW4yPSJoYXJkQWxwaGEiIG9wZXJhdG9yPSJvdXQiIGsyPSItMSIgazM9IjEiLz4KCQkJPGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMjUgMCIvPgoJCQk8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdF9kcm9wU2hhZG93XzEiLz4KCQkJPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3RfZHJvcFNoYWRvd18xIiByZXN1bHQ9InNoYXBlIi8+CgkJPC9maWx0ZXI+CgkJPGZpbHRlciBpZD0iZmlsdGVyXzcwXzE4OF9kZCIgeD0iMjE2LjAwMDAwMCIgeT0iMjcwLjAwMDAwMCIgd2lkdGg9IjE4OC4wMDAwMDAiIGhlaWdodD0iODguMDAwMDAwIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CgkJCTxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+CgkJCTxmZUNvbG9yTWF0cml4IGluPSJTb3VyY2VBbHBoYSIgdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIiByZXN1bHQ9ImhhcmRBbHBoYSIvPgoJCQk8ZmVPZmZzZXQgZHg9IjAiIGR5PSI0Ii8+CgkJCTxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEuMzMzMzMiLz4KCQkJPGZlQ29tcG9zaXRlIGluMj0iaGFyZEFscGhhIiBvcGVyYXRvcj0ib3V0IiBrMj0iLTEiIGszPSIxIi8+CgkJCTxmZUNvbG9yTWF0cml4IHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjI1IDAiLz4KCQkJPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJlZmZlY3RfZHJvcFNoYWRvd18xIi8+CgkJCTxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iZWZmZWN0X2Ryb3BTaGFkb3dfMSIgcmVzdWx0PSJzaGFwZSIvPgoJCTwvZmlsdGVyPgoJCTxjbGlwUGF0aCBpZD0iY2xpcDcwXzE4NiI+CgkJCTxyZWN0IGlkPSLnlLvmnb8gMTgiIHdpZHRoPSI0MDAuMDAwMDAwIiBoZWlnaHQ9IjQwMC4wMDAwMDAiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAiLz4KCQk8L2NsaXBQYXRoPgoJPC9kZWZzPgoJPHJlY3QgaWQ9IueUu+advyAxOCIgd2lkdGg9IjQwMC4wMDAwMDAiIGhlaWdodD0iNDAwLjAwMDAwMCIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1vcGFjaXR5PSIwIi8+Cgk8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDcwXzE4NikiPgoJCTxnIGZpbHRlcj0idXJsKCNmaWx0ZXJfNzBfMTg0X2RkKSI+CgkJCTxwYXRoIGlkPSLlt67pm4YiIGQ9Ik0yNi43OTQ5IDMyNS43NUwyMDAgMzdMMzczLjIwNSAzMjUuNzVMMjYuNzk0OSAzMjUuNzVaTTIwMCAxODBDMTYxLjM0IDE4MCAxMzAgMTk3LjkwOSAxMzAgMjIwQzEzMCAyNDIuMDkxIDE2MS4zNCAyNjAgMjAwIDI2MEMyMzguNjYgMjYwIDI3MCAyNDIuMDkxIDI3MCAyMjBDMjcwIDE5Ny45MDkgMjM4LjY2IDE4MCAyMDAgMTgwWiIgY2xpcC1ydWxlPSJldmVub2RkIiBmaWxsPSIjNDQ0NDQ0IiBmaWxsLW9wYWNpdHk9IjEuMDAwMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KCQk8L2c+CgkJPGVsbGlwc2UgaWQ9IuakreWchiAyIiBjeD0iMjAwLjAwMDAwMCIgY3k9IjIxOS40Mjg1NzQiIHJ4PSIyMC4wMDAwMDAiIHJ5PSIxMS40Mjg1NzIiIGZpbGw9IiM0NDQ0NDQiIGZpbGwtb3BhY2l0eT0iMS4wMDAwMDAiLz4KCQk8ZyBmaWx0ZXI9InVybCgjZmlsdGVyXzcwXzE4OF9kZCkiPgoJCQk8cmVjdCBpZD0i55+p5b2iIDI3IiB4PSIyMjAuMDAwMDAwIiB5PSIyNzAuMDAwMDAwIiByeD0iMjAuMDAwMDAwIiB3aWR0aD0iMTgwLjAwMDAwMCIgaGVpZ2h0PSI4MC4wMDAwMDAiIGZpbGw9IiNEREREREQiIGZpbGwtb3BhY2l0eT0iMS4wMDAwMDAiLz4KCQk8L2c+CgkJPHJlY3QgaWQ9IuefqeW9oiAyNyIgeD0iMjIwLjUwMDAwMCIgeT0iMjcwLjUwMDAwMCIgcng9IjIwLjAwMDAwMCIgd2lkdGg9IjE3OS4wMDAwMDAiIGhlaWdodD0iNzkuMDAwMDAwIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1vcGFjaXR5PSIxLjAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIxLjAwMDAwMCIvPgoJCTxwYXRoIGlkPSJBcHAiIGQ9Ik0yNTcuMDk5IDMyOEwyNTEuMDgzIDMyOEwyNjcuMDIxIDI4MS4wMzFMMjczLjYxNSAyODEuMDMxTDI4OS41NTIgMzI4TDI4My4yODcgMzI4TDI3OC44MDIgMzEzLjY1NkwyNjEuNjQ2IDMxMy42NTZMMjU3LjA5OSAzMjhaTTI3MC4wOTkgMjg1Ljg5MUMyNjguNjMgMjkxLjM5MSAyNjcuMDgzIDI5Ni40NTMgMjY1LjQyNyAzMDEuNzY2TDI2My4xMTUgMzA4LjkyMkwyNzcuMzMzIDMwOC45MjJMMjc1LjA4MyAzMDEuNzY2QzI3My4zNjUgMjk2LjQ1MyAyNzEuODggMjkxLjMyOCAyNzAuMzQ5IDI4NS44OTFMMjcwLjA5OSAyODUuODkxWk0zMDEuNDYzIDM0Mi42NTZMMjk1LjYzNSAzNDIuNjU2TDI5NS42MzUgMjkzLjI1TDMwMC40MzIgMjkzLjI1TDMwMC45NDcgMjk3LjIxOUwzMDEuMTM1IDI5Ny4yMTlDMzA0LjI3NSAyOTQuNjU2IDMwOC4xODIgMjkyLjM1OSAzMTIuMjEzIDI5Mi4zNTlDMzIxLjE2NiAyOTIuMzU5IDMyNi4wMjUgMjk5LjM5MSAzMjYuMDI1IDMxMC4wNzhDMzI2LjAyNSAzMjEuOTg0IDMxOC45MzIgMzI4LjgyOCAzMTAuOTMyIDMyOC44MjhDMzA3Ljc5MSAzMjguODI4IDMwNC40NjMgMzI3LjM1OSAzMDEuMzIyIDMyNC43OTdMMzAxLjQ2MyAzMzAuODc1TDMwMS40NjMgMzQyLjY1NlpNMzQxLjE0MyAzNDIuNjU2TDMzNS4zMTUgMzQyLjY1NkwzMzUuMzE1IDI5My4yNUwzNDAuMTEyIDI5My4yNUwzNDAuNjI3IDI5Ny4yMTlMMzQwLjgxNSAyOTcuMjE5QzM0My45NTUgMjk0LjY1NiAzNDcuODYyIDI5Mi4zNTkgMzUxLjg5MyAyOTIuMzU5QzM2MC44NDYgMjkyLjM1OSAzNjUuNzA1IDI5OS4zOTEgMzY1LjcwNSAzMTAuMDc4QzM2NS43MDUgMzIxLjk4NCAzNTguNjEyIDMyOC44MjggMzUwLjYxMiAzMjguODI4QzM0Ny40NzEgMzI4LjgyOCAzNDQuMTQzIDMyNy4zNTkgMzQxLjAwMiAzMjQuNzk3TDM0MS4xNDMgMzMwLjg3NUwzNDEuMTQzIDM0Mi42NTZaTTMwMS40NjMgMzIwLjMxMkMzMDQuNTg4IDMyMy4wMTYgMzA3LjY2NiAzMjMuOTY5IDMwOS45NjMgMzIzLjk2OUMzMTUuNzI4IDMyMy45NjkgMzE5Ljk0NyAzMTguNzgxIDMxOS45NDcgMzEwLjE0MUMzMTkuOTQ3IDMwMi40NjkgMzE3LjM4NSAyOTcuMjgxIDMxMC44MDcgMjk3LjI4MUMzMDcuODUzIDI5Ny4yODEgMzA0Ljg1MyAyOTguOTM4IDMwMS40NjMgMzAyLjA3OEwzMDEuNDYzIDMyMC4zMTJaTTM0MS4xNDMgMzIwLjMxMkMzNDQuMjY4IDMyMy4wMTYgMzQ3LjM0NiAzMjMuOTY5IDM0OS42NDMgMzIzLjk2OUMzNTUuNDA4IDMyMy45NjkgMzU5LjYyNyAzMTguNzgxIDM1OS42MjcgMzEwLjE0MUMzNTkuNjI3IDMwMi40NjkgMzU3LjA2NSAyOTcuMjgxIDM1MC40ODcgMjk3LjI4MUMzNDcuNTMzIDI5Ny4yODEgMzQ0LjUzMyAyOTguOTM4IDM0MS4xNDMgMzAyLjA3OEwzNDEuMTQzIDMyMC4zMTJaIiBmaWxsPSIjMDAwMDAwIiBmaWxsLW9wYWNpdHk9IjEuMDAwMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KCTwvZz4KPC9zdmc+Cg==']);
	// const [event, setEvent] = useState(null);
	const [id, setId] = useState(0);
	const [isEdit, setIsEdit] = useState(false);
	const [appInfoWeek, setAppInfoWeek] = useState(0);
	// const [history, setHistory] = useState([...RunTimeData.slice()]);
	// var id = event === null ? 0 : event.target.id;
	// var event, arg;
	today = new Date();
	useEffect(() => {
		let tmpAppsOrder = [];
		RunTimeData.forEach(value => tmpAppsOrder.push(value[0]))
		ipcRenderer.send('update_app_order', tmpAppsOrder);
	});


	ipcRenderer.on("update_run_time", (event, data) => {
		setRunTimeData(data[0]);

		// ！以为修改复制的数组不会导致原数组变化………………
		// ！但是其实本质是slice会创建新的数组但是里面的引用元素会同步更改………………
		// runTimeHistory = data[0]
		// setRunTimeData(runTimeHistory.slice());

		// runTimeHistory = new Array(...data[0]);
		// runTimeHistory = data[0].slice(0)
		// runTimeHistory = [...data[0].slice()]
		$("#DateSelector").val(data[1].getFullYear() + "-" + String(data[1].getMonth() + 1).padStart(2, '0') + "-" + String(data[1].getDate()).padStart(2, '0'));
		// !艹老是忘记这个语法…………
	})
	ipcRenderer.on("UpdateLastSeven", (event, data) => {
		setLastSeven(data);
	})
	ipcRenderer.on('set_edit', (event, arg) => setIsEdit(true))
	ipcRenderer.on('update_single_app_info', (event, arg) => {
		setSingleRunTimeData(arg);
	})
	const todayDateString = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, '0') + "-" + String(today.getDate()).padStart(2, '0');
	//！ From TY，这格式要求也太严格吧……………………估计是差了0就不得…………………
	//**----------------------------LastSeven-----------------------------------------------------
	var lastSevenOption = {
		xAxis: {
			data: [6, 5, 4, 3, 2, 1, 0].map((day) => {
				let theDay = new Date(today.getTime() - 24 * 60 * 60 * 1000 * day);
				return `${theDay.getMonth() + 1}-${theDay.getDate()}`
			})
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
	let singleAppInfoDay = new Date(today.getTime() - 24 * 60 * 60 * 1000 * 7 * appInfoWeek)
	var singleInfoOption = {
		xAxis: {
			data: [6, 5, 4, 3, 2, 1, 0].map((day) => {
				let today = new Date(singleAppInfoDay.getTime() - 24 * 60 * 60 * 1000 * day);
				return `${today.getMonth() + 1}-${today.getDate()}`
			})
			// data: [`${(new Date(singleAppInfoDay.getTime() - (arg[1] * 7 + value) * 24 * 60 * 60 * 1000)).getMonth() + 1}-${sing.getDate() - 6}`, `${sing.getMonth() + 1}-${sing.getDate() - 5}`, `${sing.getMonth() + 1}-${sing.getDate() - 4}`, `${sing.getMonth() + 1}-${sing.getDate() - 3}`, `${sing.getMonth() + 1}-${sing.getDate() - 2}`, `${sing.getMonth() + 1}-${sing.getDate() - 1}`, `${sing.getMonth() + 1}-${sing.getDate()}`]
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
				data: [...SingleRunTimeData]
			}
		],
		tooltip: {
			trigger: 'item',
			formatter: '{a}:{c}h'
		},
	};

	// ！注意光有个数字还不够还要有字符！………………额az…………
	// ！每个对象又有自己id反而不是要点…………
	// !额其实用name作为id也可以的…………
	// ~~不过没有这个也会导致Drag完后React渲染错误…………
	//!并不是这个的问题…………去掉Droppable的transition就行了

	// var RunTimeDataWithId = [...RunTimeData.map((item, index) => {
	// 	return {
	// 		...item,
	// 		id: `Drag${index}`
	// 	}
	// })]
	return (
		<div id="Page_AppDetail" className="relative flex w-screen h-screen px-1 bg-gray-100 border-black dark:bg-gray-800 md:pl-20 md:py-6 border-y-2 snap-start">
			<div className="absolute top-0 left-0 z-20 hidden w-full h-full pointer-events-none bg-black/30 dark:block"></div>
			{/* //！！！刚刚看不久的！！pointer-events-none！！就实现穿透了！！！ */}
			{/* //**SideBar */}
			<div className='hidden w-40 h-full py-8 bg-gray-100 md:block rounded-2xl dark:bg-gray-700'>
				<input title='DateSelector' id='DateSelector' className='w-full h-10 text-center transition-all bg-transparent border-b-2 border-black hover:shadow-2xl hover:bg-gray-300 dark:hover:bg-gray-600' type={"Date"} defaultValue={todayDateString} max={todayDateString} onChange={(event) => {
					ipcRenderer.send("UpdateRunTime", new Date(event.target.value))
				}} />
				<SideBarTemplate />
				<SideBarSpace />
				{/* <SideBarOption Title="日视图" OnClickFunc={{}} /> */}
				<SideBarOption Title="添加应用" OnClickFunc={() => {
					setAddAppsOpen(true);
				}} />
			</div>
			{/* //**Chart */}
			<div className="relative flex flex-col items-center justify-center w-full h-full p-5" >
				<div className="relative w-5/6 mb-5 transition-all bg-white shadow-lg dark:bg-gray-700 h-44 rounded-2xl hover:shadow-xl hover:bg-gray-100" onContextMenu={(event) => { ipcRenderer.send("ContextMenu_LastSeven",); }}>
					<span className='absolute -top-3 left-4'>近7天使用情况</span>
					<ReactEcharts option={lastSevenOption} style={{ width: "110%", height: "150%", position: "absolute", left: "-15px", top: "-30px" }} />
					{/* //!艹分不清楚………………这个是{}不是{{}}………… */}
				</div>
				{/* //td此处为什么full会超出屏幕？？？ */}
				<DragDropContext onDragEnd={onDragEnd}>
					{/* //！注意这个direction是指定交换的方向…………不是效果不要怕用！…………元素乱跳就是没有设置这个 */}
					<Droppable droppableId='default' direction='horizontal'>
						{/* //！同时艹注意报错的是Droppable…………这个key是必有的！！！ */}
						{/* //!额艹…………随机事件…………不管有没有key都必须在打开窗口后修改一下才能防止出现Cannot find droppable entry with id [default] */}
						{/* //！来自https://github.com/atlassian/react-beautiful-dnd/issues/2396的解决方案！！去掉React.StrictMode！！！ */}
						{(provided, snapshot) => (
							<div className="flex h-full w-full p-3 overflow-x-scroll overflow-y-hidden transition-all bg-white shadow-xl dark:bg-gray-700 hover:shadow-2xl rounded-2xl"
								ref={provided.innerRef} {...provided.droppableProps} onContextMenu={(event) => { ipcRenderer.send("ContextMenu_RunTime"); }}>
								{/* <AppRunTimeShowcase key={1} data={["Test", "Test", "#87CEFA", "", [[0, 60]]]} /> */}
								{/* <AppRunTimeShowcase key={1} data={["Test", "Test", "#87CEFA", "", [[0, 1440]]]} /> */}
								{RunTimeData.map((data, index) => {
									return (
										<AppRunTimeShowcase index={index} data={data} handleClick={handleAppClick} />
										// ！艹一样的传进去的变量是副本修改无效…………
										// ！woq我说这个key属性怎么都传不进去…………应该是和react本身的冲突了/汗，注意！！！
										// ~~~这个data同名好像可以隐藏？并不行
									)
								})}
								{provided.placeholder}
							</div>

						)}
					</Droppable>
				</DragDropContext>
				{/* //！这个地方还是要判断………… */}
				{/* <React.StrictMode> */}
				{/* //~~woq哈哈哈哈哈哈艹奇技淫巧哈哈哈哈哈 */}
				{/* //!难搞…………生产环境是会失效的…………看来只能丢动画了………… */}
				{RunTimeData.length !== 0 && <Dialog open={singleAppInfoOpen} setOpen={(value) => { setSingleAppInfoOpen(value); setIsEdit(value); setAppInfoWeek(0) }}>
					<div className="absolute flex w-4/5 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 dark:text-white h-4/5 RoundAndShadow top-1/2 left-1/2">
						<div className="relative flex flex-col items-center justify-center w-40 h-full p-2 border-r-2 border-gray-300 RoundAndShadow transition-all duration-500" style={{ backgroundColor: RunTimeData[id][2] }} >
							<img className={`w-2/3 p-2 my-1 bg-white border-gray-500 transition-all duration-700 RoundAndShadow ${isEdit ? 'opacity-75' : ''}`} src={RunTimeData[id][3]} alt={RunTimeData[id][0]} />
							<b className='rounded-md w-full text-xl text-center bg-white  dark:bg-gray-600 text-wrap' onContextMenu={() => { if (!isEdit) sendContextRequest() }}  >{RunTimeData[id][0]}</b>
							{/* //td太长会超………… */}
							<span className="w-full h-4"></span>
							<div className='flex w-full p-1 mx-1 mt-4 bg-gray-100 rounded-lg dark:bg-gray-600' onContextMenu={() => { if (!isEdit) sendContextRequest() }}>Class:<input disabled={isEdit ? false : true} title='Class' className='rounded-md w-full ml-1 text-sm bg-transparent' value={RunTimeData[id][1]} onChange={(e) => handleInputChange(e.target.value, 1)} /></div>
							<div className='flex w-full p-1 mx-1 bg-gray-100 rounded-lg dark:bg-gray-600' onContextMenu={() => { if (!isEdit) sendContextRequest() }}>Color:<input disabled={isEdit ? false : true} type='color' title='Color' className='rounded-md w-full ml-1 text-sm bg-transparent' value={RunTimeData[id][2]} onChange={(e) => handleInputChange(e.target.value, 2)} /></div>
							<div className='flex w-full p-1 mx-1 bg-gray-100 rounded-lg dark:bg-gray-600' onContextMenu={() => { if (!isEdit) sendContextRequest() }}>IconBase64:<input disabled={isEdit ? false : true} title='IconBase64' className='rounded-md w-full ml-1 text-sm bg-transparent' value={RunTimeData[id][3]} onChange={(e) => handleInputChange(e.target.value, 3)} onFocus={(event) => { event.target.select() }} /></div>
							{RunTimeData[id][1] === 'Game' ? <div className='flex w-full p-1 mx-1 bg-gray-100 rounded-lg dark:bg-gray-600' onContextMenu={() => { if (!isEdit) sendContextRequest() }}>Path:<input disabled={isEdit ? false : true} title='Path' className='rounded-md w-full ml-1 text-sm bg-transparent' value={RunTimeData[id][4]} onChange={(e) => handleInputChange(e.target.value, 4)} onFocus={(event) => { event.target.select() }} /></div> : ''}
							{/* //！网上看到的this用不了…………必须用evet.target */}
							<div className={`flex transition-all overflow-hidden ${isEdit ? 'h-10' : 'w-0 h-0'}`}>
								<button className='h-6 px-4 mt-4 transition-all bg-gray-200 hover:h-7 text-nowrap dark:bg-gray-600 RoundAndShadow hover:bg-gray-300 hover:text-xl hover:mt-3' onClick={handleConfirmClick}>确认</button>
								<button className='h-6 px-4 mt-4 transition-all bg-gray-200 hover:h-7 text-nowrap dark:bg-gray-600 RoundAndShadow hover:bg-gray-300 hover:text-xl hover:mt-3' onClick={handleCancelClick}>取消</button>
							</div>
						</div>
						<div className="w-full relative">
							<div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-5/6 transition-all bg-white shadow-lg dark:bg-gray-700 h-fit rounded-2xl hover:shadow-xl hover:bg-gray-100" onContextMenu={(event) => { ipcRenderer.send("ContextMenu_SingleAppInfo"); }}>
								<RadioGroup as='div' className='flex w-full' value={appInfoWeek} onChange={handleRadioChange}>
									{[5, 4, 3, 2, 1].map((value) => {
										return (
											<RadioGroup.Option value={value} className='flex-1'>
												{({ checked }) =>
													<div className={`hover:bg-gray-300 dark:hover:bg-gray-400  rounded-lg ${checked ? 'bg-gray-300 dark:bg-gray-400' : 'bg-gray-200 dark:bg-gray-500'}`}>上{value}周</div>
												}
											</RadioGroup.Option>

										)
									})}
									<RadioGroup.Option value={0} className='flex-1'>
										{({ checked }) =>
											<div className={`hover:bg-gray-300 dark:hover:bg-gray-400  rounded-lg ${checked ? 'bg-gray-300 dark:bg-gray-400' : 'bg-gray-200 dark:bg-gray-500'}`}>本周</div>
										}
									</RadioGroup.Option>
								</RadioGroup>
								<div className="relative mt-5 w-full h-full">
									<span className='absolute -top-3 left-4'>使用情况</span>
									<ReactEcharts option={singleInfoOption} onChartReady={(instance) => { setTimeout(() => { instance.resize(); instance.clear(); instance.setOption(singleInfoOption); }, 1) }} />
									{/* <ReactEcharts option={{}} ref={ref_SingleAppCharts} showLoading loadingOption={{ text: '加载中' }} onChartReady={(instance) => { setTimeout(() => { instance.resize(); instance.setOption(singleInfoOption); }, 1000) }} /> */}
									{/* //!艹误打误撞修好了………………这个setOption在控制台是找不到的………… */}
									{/* //!但是这样页中切换的时候又无法更新数据…………option必须设置成state，但是这样有没有动画了 */}
									{/* //!woq！！！！！！完美解决！！！感谢TY，用clear就行了！！！还是要setTimeOut哈哈 */}
									{/* {setTimeout(() => {
										return (
											<ReactEcharts option={singleInfoOption} />
										)
									}, 100)} */}
									{/* //！onChartReady={(chart) => { setInterval(() => { chart.resize() }, 1) }}加补丁😭傻了而且必须要延迟哪怕1ms都行，而且这样把动画都丢了………… */}
									{/* //!艹分不清楚………………这个是{}不是{{}}………… */}
								</div>
							</div>
						</div>
						<button className={`absolute overflow-hidden -left-8 top-1/2 size-16 -translate-y-1/2 rounded-full shadow-2xl text-5xl transition-all bg-gray-300 opacity-50 hover:bg-gray-500 ${id < 1 ? 'w-0 h-0' : ''}`}
							onClick={() => { setId(id - 1); ipcRenderer.send('update_single_app_info', [RunTimeData[id - 1][0], appInfoWeek]); }}>&lt;</button>
						<button className={`absolute overflow-hidden -right-8 top-1/2 size-16 -translate-y-1/2 rounded-full shadow-2xl text-5xl transition-all bg-gray-300 opacity-50 hover:bg-gray-500 ${id > RunTimeData.length - 2 ? 'w-0 h-0' : ''}`}
							onClick={() => { setId(id + 1); ipcRenderer.send('update_single_app_info', [RunTimeData[id + 1][0], appInfoWeek]); }}>&gt;</button>
					</div>
					{/* //！woq要显示<的转义是这样的……………额为什么是l和g………… */}
				</Dialog >}
				<Dialog open={addAppsOpen} setOpen={setAddAppsOpen}>
					<div className="absolute flex flex-col items-center p-5 justify-center w-72 h-4/5 border-r-2 top-1/2 left-20 -translate-y-1/2 border-gray-300 RoundAndShadow transition-all duration-500" style={{ backgroundColor: addAppInfo[2] }}  >
						<img className="w-32 p-2 my-1 bg-white border-gray-500 transition-all duration-700 RoundAndShadow opacity-75" src={addAppInfo[3]} />
						<input className='rounded-md w-full text-xl text-center bg-white  dark:bg-gray-600 text-wrap' value={addAppInfo[0]} onChange={(e) => { handleAddAppInputChange(e.target.value, 0) }} onFocus={(event) => { event.target.select() }} />
						{/* //td太长会超………… */}
						<span className="w-full h-4"></span>
						<div className='flex w-full p-1 mx-1 mt-4 bg-gray-100 rounded-lg dark:bg-gray-600' >Class:<input title='Class' className='rounded-md w-full ml-1 text-sm bg-transparent' value={addAppInfo[1]} onChange={(e) => { handleAddAppInputChange(e.target.value, 1) }} onFocus={(event) => { event.target.select() }} /></div>
						<div className='flex w-full p-1 mx-1 bg-gray-100 rounded-lg dark:bg-gray-600' >Color:<input type='color' title='Color' className='rounded-md w-full ml-1 text-sm bg-transparent' value={addAppInfo[2]} onChange={(e) => { handleAddAppInputChange(e.target.value, 2) }} /></div>
						<div className='flex w-full p-1 mx-1 bg-gray-100 rounded-lg dark:bg-gray-600' >IconBase64:<input title='IconBase64' className='rounded-md w-full ml-1 text-sm bg-transparent' value={addAppInfo[3]} onChange={(e) => { handleAddAppInputChange(e.target.value, 3) }} onFocus={(event) => { event.target.select() }} /></div>
						{/* //！网上看到的this用不了…………必须用evet.target */}
						<div className={`flex transition-all overflow-hidden h-10 `}>
							<button className='h-6 px-4 mt-4 transition-all bg-gray-200 hover:h-7 text-nowrap dark:bg-gray-600 RoundAndShadow hover:bg-gray-300 hover:text-xl hover:mt-3' onClick={handleAddAppConfirmClick}>确认</button>
							<button className='h-6 px-4 mt-4 transition-all bg-gray-200 hover:h-7 text-nowrap dark:bg-gray-600 RoundAndShadow hover:bg-gray-300 hover:text-xl hover:mt-3' onClick={handleAddAppCancelClick}>取消</button>
						</div>
					</div>
				</Dialog>
				{/* </React.StrictMode> */}
			</div>
			{/* //！崩溃的关键就在这里…………！！！main那边传过来的时候会导致数据不全但这里又没有判断………… */}
		</div >
	)
	// function setEvent(e) {event = e; }
	//！也无法通过自定的函数传递值…………
	function sendContextRequest() { runTimeHistory = []; ipcRenderer.send('ContextMenu_EditAppInfo'); }
	function handleConfirmClick() {
		ipcRenderer.send('update_app_info', RunTimeData)
		setIsEdit(false);
	}
	function handleCancelClick() {
		var copy = RunTimeData.slice();
		if (runTimeHistory.length > 0)
			copy[id] = runTimeHistory;

		setRunTimeData(copy);
		setIsEdit(false);
	}
	function handleInputChange(value, valueIndex) {
		// const newValue = ;
		// console.log(ow);
		// const id = event.target.id;
		// const ow = [RunTimeData[id].splice(id - 1, 1, e.target.value)]
		// const newValue = [
		// 	...RunTimeData.slice(0, id),
		// 	[
		// 		...RunTimeData[id].slice(0, valueIndex),
		// 		e.target.value,
		// 		...RunTimeData[id].slice(valueIndex + 1)
		// 	],
		// 	...RunTimeData.slice(id + 1)
		// 	// ！这个数据就是死都读不出来…………………………………………………………
		// ]
		// ！对不起…………我做不到……………………………………………………………………
		// td为什么啊啊啊啊啊啊啊啊啊啊啊啊啊？？？？？这个slice(valueIndex + 1)放在里外放在前后都读不出来……………………

		// RunTimeData[id][valueIndex] = e.target.value;


		var copy = RunTimeData.slice();
		if (runTimeHistory.length === 0) runTimeHistory = copy[id].slice();

		copy[id][valueIndex] = value;
		// ！md你要说这个方法还清晰多了…………………………
		setRunTimeData(copy)
		// UpdateRunTimeData(() => {RunTimeData[event.target.id][valueIndex] = e.target.value})
	}
	function handleAddAppInputChange(value, valueIndex) {
		setAddAppInfo([
			...addAppInfo.slice(0, valueIndex),
			value,
			...addAppInfo.slice(valueIndex + 1)
		])
		addAppInfo[valueIndex] = value;
		// ！md你要说这个方法还清晰多了…………………………
		// UpdateRunTimeData(() => {RunTimeData[event.target.id][valueIndex] = e.target.value})
	}
	function handleAddAppConfirmClick() {
		ipcRenderer.send('add_app', addAppInfo);
		setIsEdit(false);
	}
	function handleAddAppCancelClick() {
		setAddAppInfo(['newApp', 'None', '#BFDBFE', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwLjAwMDAwMCIgaGVpZ2h0PSI0MDAuMDAwMDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+Cgk8ZGVzYz4KCQkJQ3JlYXRlZCB3aXRoIFBpeHNvLgoJPC9kZXNjPgoJPGRlZnM+CgkJPGZpbHRlciBpZD0iZmlsdGVyXzcwXzE4NF9kZCIgeD0iMjIuNzk0OTIyIiB5PSIzNy4wMDAwMDAiIHdpZHRoPSIzNTQuNDEwMTU2IiBoZWlnaHQ9IjI5Ni43NTAwMDAiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KCQkJPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KCQkJPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiIHJlc3VsdD0iaGFyZEFscGhhIi8+CgkJCTxmZU9mZnNldCBkeD0iMCIgZHk9IjQiLz4KCQkJPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMS4zMzMzMyIvPgoJCQk8ZmVDb21wb3NpdGUgaW4yPSJoYXJkQWxwaGEiIG9wZXJhdG9yPSJvdXQiIGsyPSItMSIgazM9IjEiLz4KCQkJPGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMjUgMCIvPgoJCQk8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdF9kcm9wU2hhZG93XzEiLz4KCQkJPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3RfZHJvcFNoYWRvd18xIiByZXN1bHQ9InNoYXBlIi8+CgkJPC9maWx0ZXI+CgkJPGZpbHRlciBpZD0iZmlsdGVyXzcwXzE4OF9kZCIgeD0iMjE2LjAwMDAwMCIgeT0iMjcwLjAwMDAwMCIgd2lkdGg9IjE4OC4wMDAwMDAiIGhlaWdodD0iODguMDAwMDAwIiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CgkJCTxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+CgkJCTxmZUNvbG9yTWF0cml4IGluPSJTb3VyY2VBbHBoYSIgdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIiByZXN1bHQ9ImhhcmRBbHBoYSIvPgoJCQk8ZmVPZmZzZXQgZHg9IjAiIGR5PSI0Ii8+CgkJCTxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEuMzMzMzMiLz4KCQkJPGZlQ29tcG9zaXRlIGluMj0iaGFyZEFscGhhIiBvcGVyYXRvcj0ib3V0IiBrMj0iLTEiIGszPSIxIi8+CgkJCTxmZUNvbG9yTWF0cml4IHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjI1IDAiLz4KCQkJPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJlZmZlY3RfZHJvcFNoYWRvd18xIi8+CgkJCTxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iZWZmZWN0X2Ryb3BTaGFkb3dfMSIgcmVzdWx0PSJzaGFwZSIvPgoJCTwvZmlsdGVyPgoJCTxjbGlwUGF0aCBpZD0iY2xpcDcwXzE4NiI+CgkJCTxyZWN0IGlkPSLnlLvmnb8gMTgiIHdpZHRoPSI0MDAuMDAwMDAwIiBoZWlnaHQ9IjQwMC4wMDAwMDAiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAiLz4KCQk8L2NsaXBQYXRoPgoJPC9kZWZzPgoJPHJlY3QgaWQ9IueUu+advyAxOCIgd2lkdGg9IjQwMC4wMDAwMDAiIGhlaWdodD0iNDAwLjAwMDAwMCIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1vcGFjaXR5PSIwIi8+Cgk8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDcwXzE4NikiPgoJCTxnIGZpbHRlcj0idXJsKCNmaWx0ZXJfNzBfMTg0X2RkKSI+CgkJCTxwYXRoIGlkPSLlt67pm4YiIGQ9Ik0yNi43OTQ5IDMyNS43NUwyMDAgMzdMMzczLjIwNSAzMjUuNzVMMjYuNzk0OSAzMjUuNzVaTTIwMCAxODBDMTYxLjM0IDE4MCAxMzAgMTk3LjkwOSAxMzAgMjIwQzEzMCAyNDIuMDkxIDE2MS4zNCAyNjAgMjAwIDI2MEMyMzguNjYgMjYwIDI3MCAyNDIuMDkxIDI3MCAyMjBDMjcwIDE5Ny45MDkgMjM4LjY2IDE4MCAyMDAgMTgwWiIgY2xpcC1ydWxlPSJldmVub2RkIiBmaWxsPSIjNDQ0NDQ0IiBmaWxsLW9wYWNpdHk9IjEuMDAwMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KCQk8L2c+CgkJPGVsbGlwc2UgaWQ9IuakreWchiAyIiBjeD0iMjAwLjAwMDAwMCIgY3k9IjIxOS40Mjg1NzQiIHJ4PSIyMC4wMDAwMDAiIHJ5PSIxMS40Mjg1NzIiIGZpbGw9IiM0NDQ0NDQiIGZpbGwtb3BhY2l0eT0iMS4wMDAwMDAiLz4KCQk8ZyBmaWx0ZXI9InVybCgjZmlsdGVyXzcwXzE4OF9kZCkiPgoJCQk8cmVjdCBpZD0i55+p5b2iIDI3IiB4PSIyMjAuMDAwMDAwIiB5PSIyNzAuMDAwMDAwIiByeD0iMjAuMDAwMDAwIiB3aWR0aD0iMTgwLjAwMDAwMCIgaGVpZ2h0PSI4MC4wMDAwMDAiIGZpbGw9IiNEREREREQiIGZpbGwtb3BhY2l0eT0iMS4wMDAwMDAiLz4KCQk8L2c+CgkJPHJlY3QgaWQ9IuefqeW9oiAyNyIgeD0iMjIwLjUwMDAwMCIgeT0iMjcwLjUwMDAwMCIgcng9IjIwLjAwMDAwMCIgd2lkdGg9IjE3OS4wMDAwMDAiIGhlaWdodD0iNzkuMDAwMDAwIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1vcGFjaXR5PSIxLjAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIxLjAwMDAwMCIvPgoJCTxwYXRoIGlkPSJBcHAiIGQ9Ik0yNTcuMDk5IDMyOEwyNTEuMDgzIDMyOEwyNjcuMDIxIDI4MS4wMzFMMjczLjYxNSAyODEuMDMxTDI4OS41NTIgMzI4TDI4My4yODcgMzI4TDI3OC44MDIgMzEzLjY1NkwyNjEuNjQ2IDMxMy42NTZMMjU3LjA5OSAzMjhaTTI3MC4wOTkgMjg1Ljg5MUMyNjguNjMgMjkxLjM5MSAyNjcuMDgzIDI5Ni40NTMgMjY1LjQyNyAzMDEuNzY2TDI2My4xMTUgMzA4LjkyMkwyNzcuMzMzIDMwOC45MjJMMjc1LjA4MyAzMDEuNzY2QzI3My4zNjUgMjk2LjQ1MyAyNzEuODggMjkxLjMyOCAyNzAuMzQ5IDI4NS44OTFMMjcwLjA5OSAyODUuODkxWk0zMDEuNDYzIDM0Mi42NTZMMjk1LjYzNSAzNDIuNjU2TDI5NS42MzUgMjkzLjI1TDMwMC40MzIgMjkzLjI1TDMwMC45NDcgMjk3LjIxOUwzMDEuMTM1IDI5Ny4yMTlDMzA0LjI3NSAyOTQuNjU2IDMwOC4xODIgMjkyLjM1OSAzMTIuMjEzIDI5Mi4zNTlDMzIxLjE2NiAyOTIuMzU5IDMyNi4wMjUgMjk5LjM5MSAzMjYuMDI1IDMxMC4wNzhDMzI2LjAyNSAzMjEuOTg0IDMxOC45MzIgMzI4LjgyOCAzMTAuOTMyIDMyOC44MjhDMzA3Ljc5MSAzMjguODI4IDMwNC40NjMgMzI3LjM1OSAzMDEuMzIyIDMyNC43OTdMMzAxLjQ2MyAzMzAuODc1TDMwMS40NjMgMzQyLjY1NlpNMzQxLjE0MyAzNDIuNjU2TDMzNS4zMTUgMzQyLjY1NkwzMzUuMzE1IDI5My4yNUwzNDAuMTEyIDI5My4yNUwzNDAuNjI3IDI5Ny4yMTlMMzQwLjgxNSAyOTcuMjE5QzM0My45NTUgMjk0LjY1NiAzNDcuODYyIDI5Mi4zNTkgMzUxLjg5MyAyOTIuMzU5QzM2MC44NDYgMjkyLjM1OSAzNjUuNzA1IDI5OS4zOTEgMzY1LjcwNSAzMTAuMDc4QzM2NS43MDUgMzIxLjk4NCAzNTguNjEyIDMyOC44MjggMzUwLjYxMiAzMjguODI4QzM0Ny40NzEgMzI4LjgyOCAzNDQuMTQzIDMyNy4zNTkgMzQxLjAwMiAzMjQuNzk3TDM0MS4xNDMgMzMwLjg3NUwzNDEuMTQzIDM0Mi42NTZaTTMwMS40NjMgMzIwLjMxMkMzMDQuNTg4IDMyMy4wMTYgMzA3LjY2NiAzMjMuOTY5IDMwOS45NjMgMzIzLjk2OUMzMTUuNzI4IDMyMy45NjkgMzE5Ljk0NyAzMTguNzgxIDMxOS45NDcgMzEwLjE0MUMzMTkuOTQ3IDMwMi40NjkgMzE3LjM4NSAyOTcuMjgxIDMxMC44MDcgMjk3LjI4MUMzMDcuODUzIDI5Ny4yODEgMzA0Ljg1MyAyOTguOTM4IDMwMS40NjMgMzAyLjA3OEwzMDEuNDYzIDMyMC4zMTJaTTM0MS4xNDMgMzIwLjMxMkMzNDQuMjY4IDMyMy4wMTYgMzQ3LjM0NiAzMjMuOTY5IDM0OS42NDMgMzIzLjk2OUMzNTUuNDA4IDMyMy45NjkgMzU5LjYyNyAzMTguNzgxIDM1OS42MjcgMzEwLjE0MUMzNTkuNjI3IDMwMi40NjkgMzU3LjA2NSAyOTcuMjgxIDM1MC40ODcgMjk3LjI4MUMzNDcuNTMzIDI5Ny4yODEgMzQ0LjUzMyAyOTguOTM4IDM0MS4xNDMgMzAyLjA3OEwzNDEuMTQzIDMyMC4zMTJaIiBmaWxsPSIjMDAwMDAwIiBmaWxsLW9wYWNpdHk9IjEuMDAwMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KCTwvZz4KPC9zdmc+Cg=='])
		setAddAppsOpen(false);
	}

	// ！！！！！！关于嵌套对象的修改：
	// ！1.注意如果是数组不能用下面的方法………………只能用slice复制一个新的！！！！
	// ！2.分清{ }和[]………………上面被TY多次误导老是要用{ }导致怎么搞都不对…………………………………………
	// ！不对React官方也用的是{ }，不过注意官方那个确实是一个对象而不是数组…………
	// {...RunTimeData,
	// [event.target.id]: [{ ...RunTimeData[event.target.id], [RunTimeData[event.target.id][valueIndex]]: e.target.value }]}
	function handleAppClick(id: number) {
		setId(Number(id)); setSingleAppInfoOpen(true);
		// ！真神奇…………传过来的id居然是string…………
		// !此时id还没有做更新…………必须在这里手动更新一次
		ipcRenderer.send('update_single_app_info', [RunTimeData[id][0], appInfoWeek]);
	}
	function handleRadioChange(value) {
		setAppInfoWeek(value);
		ipcRenderer.send('update_single_app_info', [RunTimeData[id][0], value]);
	}
	function onDragEnd(result) {
		const { source, destination, reason } = result;
		if (!destination) return
		const sourceIndex = source.index;
		const destIndex = destination.index;

		var tmpRunTimeData = [...RunTimeData];
		const tmpData = tmpRunTimeData.splice(sourceIndex, 1);
		tmpRunTimeData.splice(destIndex, 0, tmpData[0]);

		setRunTimeData(tmpRunTimeData);

	}

}
