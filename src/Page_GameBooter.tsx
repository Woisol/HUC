import * as React from 'react';
import { useState } from 'react';
import Dialog from './Components/Layout/Dialog.tsx';
import { ftruncateSync } from 'fs';
import SettingSwtich from './Components/Setting/SettingSwitch.tsx';
const ipcRenderer = window.require('electron').ipcRenderer;
export default function PageGameBooter() {
	const [gameInfo, setGameInfo] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [id, setId] = useState(0);
	const [canDelay, setCanDelay] = useState(false);
	ipcRenderer.on('update_game_info', (event, arg) => {
		setGameInfo(arg);
	})
	return (
		<div id="Page_GameBooter" className=" relative flex items-center w-screen h-screen p-4 bg-gray-100 border-black dark:bg-gray-900 md:pl-20 md:py-6 border-y-2 snap-start " >
			{gameInfo.map((item, index) => (
				<div className="overflow-hidden relative h-full flex flex-col items-center flex-1 hover:flex-[3] hover:text-2xl transition-all duration-300 bg-white RoundAndShadow" id={`${index}`} onClick={(event) => { handleClick(event) }}>
					{item[2] === '' ? <div className='absolute top-1/2 -translate-y-1/2 flex flex-col items-center w-full'>
						<img src={item[1]} alt={item[0]} className='object-cover w-full h-full' id={`${index}`} />
						<span className=' bg-white RoundAndShadow p-2'>{item[0]}</span>
					</div> : <div className='overflow-hidden w-full flex flex-col items-center'>
						<img src={item[2]} alt={item[0]} className='absolute object-cover w-full h-full top-1/2 -translate-y-1/2' id={`${index}`} />
						<div className="absolute bottom-5 flex flex-col items-center">
							<img src={item[1]} alt={item[0]} className='items-center w-full h-full' />
							<span className=' bg-white RoundAndShadow p-2'>{item[0]}</span>
						</div>
					</div>}
				</div>
			))}
			{gameInfo.length !== 0 && <Dialog open={isOpen} setOpen={setIsOpen} >
				<div className="absolute flex flex-col items-center p-14 justify-center bg-white w-72 h-4/5 border-r-2 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 border-gray-300 RoundAndShadow transition-all duration-500" >
					<img className="w-32 p-2 my-1 bg-white border-gray-500 transition-all duration-700 RoundAndShadow opacity-75" src={gameInfo[id][1]} alt={gameInfo[id][0]} />
					{gameInfo[id][3] === '' ? <>
						<span className='text-center'>缺少文件路径，<br />请在应用配置中完善</span>
					</> : <>
						<span className='absolute top-5 text-xm text-gray-500 text-center'>即将打开文件：{gameInfo[id][3]}</span>
						<span className='text-xl'>预计使用时间</span>
						<input type="time" defaultValue={'00:20'} className='text-xl' />
						<SettingSwtich title='允许中途延长？' value={canDelay} handleChange={setCanDelay}	></SettingSwtich>
						<div className={`flex transition-all overflow-hidden h-10 `}>
							<button className='h-6 px-4 mt-4 transition-all bg-gray-200 hover:h-7 text-nowrap dark:bg-gray-600 RoundAndShadow hover:bg-gray-300 hover:text-xl hover:mt-3' onClick={handleConfirmClick}>确认</button>
							<button className='h-6 px-4 mt-4 transition-all bg-gray-200 hover:h-7 text-nowrap dark:bg-gray-600 RoundAndShadow hover:bg-gray-300 hover:text-xl hover:mt-3' onClick={handleCancelClick}>取消</button>
						</div>
					</>}
				</div>
			</Dialog>}
		</div>
	);
	function handleClick(e) {
		setId(Number(e.target.id));
		setIsOpen(true);
	}
	function handleConfirmClick() {
		setIsOpen(false);
	}
	function handleCancelClick() {
		setIsOpen(false);
	}
}