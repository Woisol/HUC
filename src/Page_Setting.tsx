import * as React from 'react';
import { useState } from 'react';
import SettingSection from './Components/Setting/SettingSection.tsx';
import SettingSwtich from './Components/Setting/SettingSwitch.tsx';
import { Disclosure } from '@headlessui/react';
import SettingInput from './Components/Setting/SettingInput.tsx';
const ipcRenderer = window.require('electron').ipcRenderer;
var history: string[] = new Array(4).fill('');
var current: string[] = new Array(4).fill('');
// ！！！！！啊啊啊啊这个必须放外面不然每次渲染都要重置！！！
export default function PageSetting() {
	const [StartBoot, setStartBoot] = useState(true);
	const [FollowSystemDarkMode, setFollowSystemDarkMode] = useState(true);
	const [DATABASE_NAME, setDATABASE_NAME] = useState('');
	const [SQLUser, setSQLUser] = useState('');
	const [SQLPassword, setSQLPassword] = useState('');
	const [SQLPort, setSQLPort] = useState('');
	// var history = [DATABASE_NAME, SQLUser, SQLPassword, SQLPort];
	// var current = history.concat();
	//！不能再这里赋值…………不然state刷新一样白搭


	ipcRenderer.on('get_app_config', (event, arg) => {
		setStartBoot(arg.StartBoot);
		setFollowSystemDarkMode(arg.FollowSystemDarkMode);
		setDATABASE_NAME(arg.DATABASE_NAME);
		setSQLUser(arg.SQLUser);
		setSQLPassword(arg.SQLPassword);
		setSQLPort(arg.SQLPort);
		history = [arg.DATABASE_NAME, arg.SQLUser, arg.SQLPassword, arg.SQLPort].slice();
		current = [arg.DATABASE_NAME, arg.SQLUser, arg.SQLPassword, arg.SQLPort].slice();
	})
	ipcRenderer.on("setting_startboot_change", (event, arg) => setStartBoot(arg))
	ipcRenderer.on("setting_follow_system_dark_mode_change", (event, arg) => setFollowSystemDarkMode(arg))
	return (
		<div id="Page_Setting" className="relative flex flex-col items-center w-screen h-screen p-4 bg-gray-300 border-black dark:bg-gray-900 md:pl-20 md:py-6 border-y-2 snap-start ">
			{/* //!？？？？？为什么一定要再设一个div z才能生效？？？ */}
			{/* //!为什么和上一页一样的属性到这页Gear久上来了？？？ */}
			{/* //~~目前解决方案…………不知道为什么上面一定要有flex那三个才能实现…………不知道为什么必须要新稿一个div而且必须要z-10…………………… */}
			{/* //！！！！！关于z-index失效的问题：https://zhuanlan.zhihu.com/p/340371083！！！！！ */}
			{/* //！层叠上下文！！！ */}
			<b className="z-10 w-full p-2 text-2xl h-fit">Setting</b>
			<div className="flex flex-col w-full h-full overflow-y-scroll hideScollBar">
				{/* //!还不会用grid………… */}
				<SettingSection title={'系统'}>
					<SettingSwtich title="StartBoot" value={StartBoot} handleChange={handleStartBoot} />
					<SettingSwtich title="Follow System Dark Mode" value={FollowSystemDarkMode} handleChange={handleFollowSystemDarkMode} />
				</SettingSection>
				<SettingSection title={'数据库'}>
					<SettingInput title={'数据库名称:'} value={DATABASE_NAME} handleChange={(e) => { setDATABASE_NAME(e.target.value); current[0] = e.target.value }} type={'text'}></SettingInput>
					<SettingInput title={'数据库用户名:'} value={SQLUser} handleChange={(e) => { setSQLUser(e.target.value); current[1] = e.target.value }} type={'text'}></SettingInput>
					<SettingInput title={'数据库密码:'} value={SQLPassword} handleChange={(e) => { setSQLPassword(e.target.value); current[2] = e.target.value }} type={'password'}></SettingInput>
					<SettingInput title={'数据库端口:'} value={SQLPort} handleChange={(e) => { setSQLPort(e.target.value); current[3] = e.target.value }} type={'text'}></SettingInput>
					<div className={`flex transition-all overflow-hidden w-full justify-around h-10 `}>
						<button className='h-6 w-32 px-4 mt-4 transition-all bg-gray-300 hover:h-7 text-nowrap dark:bg-gray-600 RoundAndShadow hover:bg-gray-400 hover:text-xl hover:mt-3' onClick={handleConfirmClick}>保存</button>
						<button className='h-6 w-32 px-4 mt-4 transition-all bg-gray-300 hover:h-7 text-nowrap dark:bg-gray-600 RoundAndShadow hover:bg-gray-400 hover:text-xl hover:mt-3' onClick={handleCancelClick}>取消</button>
					</div>

				</SettingSection>
			</div>
		</div>
	)
	function handleStartBoot(value) {
		ipcRenderer.send("setting_startboot_change", value)
	}
	function handleFollowSystemDarkMode(value) {
		ipcRenderer.send("setting_follow_system_dark_mode_change", value)
	}
	function handleConfirmClick() {

	}
	function handleCancelClick() {
		// !好像不能用解构…………
		// if (history.length === 0 || history === undefined) return;
		setDATABASE_NAME(history[0]);
		setSQLUser(history[1]);
		setSQLPassword(history[2]);
		setSQLPort(history[3]);
	}
}