import * as React from 'react';
import { useState } from 'react';
import Dialog from './Components/Layout/Dialog.tsx';
import { ftruncateSync } from 'fs';
import SettingSwtich from './Components/Setting/SettingSwitch.tsx';
import { isValidDateValue } from '@testing-library/user-event/dist/utils/index';
const ipcRenderer = window.require('electron').ipcRenderer;
export default function PageGameBooter() {
	const [gameInfo, setGameInfo] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [id, setId] = useState(0);
	const [canDelay, setCanDelay] = useState(false);
	let estimateTime = '00:20';
	ipcRenderer.on('update_game_info', (event, arg) => {
		setGameInfo(arg);
	})
	return (
		<div id="Page_GameBooter" className=" relative flex flex-col sm:flex-row items-center w-screen h-screen p-4 bg-gray-100 border-black dark:bg-gray-900 md:pl-20 md:py-6 border-y-2 snap-start " onContextMenu={() => ipcRenderer.send('open_config_appsorder')}>
			{gameInfo.length === 0 ?
				<div className="bg-white text-4xl p-4 RoundAndShadow">😥这里还没有游戏呢，右键去配置文件中添加吧~</div>
				: gameInfo.map((item, index) => (
					<div className="overflow-hidden relative w-full h-full flex flex-col items-center flex-1 hover:flex-[2] hover:text-2xl transition-all duration-300 bg-white RoundAndShadow" id={`${index}`} onClick={(event) => { handleClick(event) }}>
						{item[2] === '' ? <div className='pointer-events-none absolute top-1/2 -translate-y-1/2 flex flex-col items-center w-full' id={`${index}`} >
							<img src={item[1]} alt={item[0]} className='max-w-72 object-cover w-full h-full RoundAndShadow' id={`${index}`} />
							<span className=' bg-white RoundAndShadow p-2'>{item[0]}</span>
						</div> : <div className='pointer-events-none overflow-hidden w-full flex flex-col items-center' id={`${index}`} >
							<img src={item[2]} alt={item[0]} className='absolute object-cover w-full h-full top-1/2 -translate-y-1/2' id={`${index}`} />
							<div className="absolute bottom-0 flex w-full h-fit flex-row sm:flex-col items-center">
								{/* //！？？？这个必须要有个absolute高度才不为0？？？ */}
								{/* bg-gradient-to-t from-black to-white bg-opacity-20 */}
								<div className="w-full h-[150%] absolute bottom-0 bg-gradient-to-t from-black to-transparent "></div>
								{/* //!芜湖to-transparent！ */}
								<img src={item[1]} alt={item[0]} className='z-10 w-20 sm:w-28 md:w-32 RoundAndShadow transition-all duration-300' />
								<span className=' bg-white RoundAndShadow p-2 opacity-80'>{item[0]}</span>
							</div>
						</div>}
					</div>
				))}
			{gameInfo.length !== 0 && <Dialog open={isOpen} setOpen={handleCancel} >
				<div className="absolute flex flex-col items-center p-14 justify-center bg-white w-72 h-4/5 border-r-2 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 border-gray-300 RoundAndShadow transition-all duration-500" >
					<img className="w-32 p-2 my-1 bg-white border-gray-500 transition-all duration-700 RoundAndShadow opacity-75" src={gameInfo[id][1]} alt={gameInfo[id][0]} />
					{(gameInfo[id][3] === '' || gameInfo[id][3] === undefined) ? <>
						<span className='text-center'>缺少文件路径，<br />请在应用配置中完善</span>
					</> : <>
						<span className='absolute top-5 text-xm text-gray-500 text-center text-wrap select-text pointer-events-none'>即将打开文件：{gameInfo[id][3]}</span>
						<span className='text-xl'>预计使用时间</span>
						<input type="time" defaultValue={'00:20'} className='text-xl' onChange={(e) => { estimateTime = e.target.value }} />
						<SettingSwtich title='允许中途延长？' value={canDelay} handleChange={setCanDelay}	></SettingSwtich>
						<button className='h-12 px-4 mt-4 transition-all bg-gray-200 hover:h-13 text-nowrap text-xl dark:bg-gray-600 RoundAndShadow hover:bg-gray-300 hover:text-xl hover:mt-3' onClick={handleConfirmClick}>启动！</button>
						{gameInfo[id][2] === '' && <span className='absolute bottom-4 text-gray-400 p-3 select-text'>可以将软件同名的jpg背景在本程序根目录/Asset/GameBGImage下展示哦~</span>}
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
		let estimateTimeMin = Number(estimateTime.split(':')[0]) * 60 + Number(estimateTime.split(':')[1]);
		ipcRenderer.send('launch_game', [gameInfo[id][0], gameInfo[id][3], estimateTimeMin, canDelay])
		setIsOpen(false);
		setCanDelay(false);
		estimateTime = '0:20';
	}
	function handleCancel() {
		setIsOpen(false);
		setCanDelay(false);
		estimateTime = '0:20';
	}
}
