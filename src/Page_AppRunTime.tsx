import React, { useEffect, useState } from 'react';
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
	const [open, setOpen] = useState(false);
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


	ipcRenderer.on("UpdateRunTime", (event, data) => {
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
		<div id="Page_AppDetail" className="relative flex w-screen h-screen px-1 bg-gray-300 border-black dark:bg-gray-800 md:pl-20 md:py-6 border-y-2 snap-start">
			<div className="absolute top-0 left-0 z-20 hidden w-full h-full pointer-events-none bg-black/30 dark:block"></div>
			{/* //！！！刚刚看不久的！！pointer-events-none！！就实现穿透了！！！ */}
			{/* //**SideBar */}
			<div className='hidden w-40 h-full py-8 bg-gray-100 md:block rounded-2xl dark:bg-gray-700'>
				<input title='DateSelector' id='DateSelector' className='w-full h-10 text-center transition-all bg-transparent border-b-2 border-black hover:shadow-2xl hover:bg-gray-300 dark:hover:bg-gray-600' type={"Date"} defaultValue={todayDateString} max={todayDateString} onChange={(event) => {
					ipcRenderer.send("UpdateRunTime", new Date(event.target.value))
				}} />
				<SideBarTemplate />
				<SideBarSpace />
				<SideBarOption Title="日视图" OnClickFunc={{}} />
				<SideBarOption Title="周视图" OnClickFunc={{}} />
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
				{RunTimeData.length !== 0 && <Dialog open={open} setOpen={(value) => { setOpen(value); setIsEdit(value); setAppInfoWeek(0) }}>
					<div className="absolute flex w-4/5 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 dark:text-white h-4/5 RoundAndShadow top-1/2 left-1/2">
						<div className="relative flex flex-col items-center justify-center w-40 h-full p-2 border-r-2 border-gray-300 RoundAndShadow transition-all duration-500" style={{ backgroundColor: RunTimeData[id][2] }} >
							<img className={`w-2/3 p-2 my-1 bg-white border-gray-500 transition-all duration-700 RoundAndShadow ${isEdit ? 'opacity-75' : ''}`} src={RunTimeData[id][3]} alt={RunTimeData[id][0]} />
							<input className='rounded-md w-full text-xl text-center bg-white  dark:bg-gray-600 text-wrap' disabled={isEdit ? false : true} onContextMenu={() => { if (!isEdit) sendContextRequest() }} value={RunTimeData[id][0]} onChange={(e) => { handleInputChange(e.target.value, 0) }} />
							{/* //td太长会超………… */}
							<span className="w-full h-4"></span>
							<div className='flex w-full p-1 mx-1 mt-4 bg-gray-300 rounded-lg dark:bg-gray-600' onContextMenu={() => { if (!isEdit) sendContextRequest() }}>Class:<input disabled={isEdit ? false : true} title='Class' className='rounded-md w-full ml-1 text-sm bg-transparent' value={RunTimeData[id][1]} onChange={(e) => handleInputChange(e.target.value, 1)} /></div>
							<div className='flex w-full p-1 mx-1 bg-gray-300 rounded-lg dark:bg-gray-600' onContextMenu={() => { if (!isEdit) sendContextRequest() }}>Color:<input disabled={isEdit ? false : true} type='color' title='Color' className='rounded-md w-full ml-1 text-sm bg-transparent' value={RunTimeData[id][2]} onChange={(e) => handleInputChange(e.target.value, 2)} /></div>
							<div className='flex w-full p-1 mx-1 bg-gray-300 rounded-lg dark:bg-gray-600' onContextMenu={() => { if (!isEdit) sendContextRequest() }}>IconBase64:<input disabled={isEdit ? false : true} title='IconBase64' className='rounded-md w-full ml-1 text-sm bg-transparent' value={RunTimeData[id][3]} onChange={(e) => handleInputChange(e.target.value, 3)} onFocus={(event) => { event.target.select() }} /></div>
							{/* //！网上看到的this用不了…………必须用evet.target */}
							<div className={`flex transition-all overflow-hidden ${isEdit ? 'h-10' : 'w-0 h-0'}`}>
								<button className='h-6 px-4 mt-4 transition-all bg-gray-300 hover:h-7 text-nowrap dark:bg-gray-600 RoundAndShadow hover:bg-gray-400 hover:text-xl hover:mt-3' onClick={handleConfirmClick}>确认</button>
								<button className='h-6 px-4 mt-4 transition-all bg-gray-300 hover:h-7 text-nowrap dark:bg-gray-600 RoundAndShadow hover:bg-gray-400 hover:text-xl hover:mt-3' onClick={handleCancelClick}>取消</button>
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
	// ！！！！！！关于嵌套对象的修改：
	// ！1.注意如果是数组不能用下面的方法………………只能用slice复制一个新的！！！！
	// ！2.分清{ }和[]………………上面被TY多次误导老是要用{ }导致怎么搞都不对…………………………………………
	// ！不对React官方也用的是{ }，不过注意官方那个确实是一个对象而不是数组…………
	// {...RunTimeData,
	// [event.target.id]: [{ ...RunTimeData[event.target.id], [RunTimeData[event.target.id][valueIndex]]: e.target.value }]}
	function handleAppClick(id: number) {
		setId(Number(id)); setOpen(true);
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
