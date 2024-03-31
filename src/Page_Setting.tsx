import * as React from 'react';
import { useState } from 'react';
import SettingSection from './Components/Setting/SettingSection.tsx';
import SettingSwtich from './Components/Setting/SettingSwitch.tsx';
import { Disclosure } from '@headlessui/react';
import SettingInput from './Components/Setting/SettingInput.tsx';
// import { VERSION } from '../main.js';
const VERSION = '2.0';
// const dialog = window.require('electron').dialog;
const ipcRenderer = window.require('electron').ipcRenderer;
const defaultConfig = {
	"ProcessListFileDir": "pcsMntBlackList.plf",
	"RuntimeLogFileDir": "runtimeLog.rlf",
	"DATABASE_NAME": "HUC_AppUsageLog",
	"SQLUser": "root",
	"SQLPassword": "60017089",
	"SQLPort": "3306",
	"FollowSystemDarkMode": true,
	"StartBoot": false
}
var history;
// var hasChange_DATABASE = false;
// var current: string[] = new Array(4).fill('');
// ！！！！！啊啊啊啊这个必须放外面不然每次渲染都要重置！！！
export default function PageSetting() {
	const [config, setConfig] = useState({});
	const [hasChange_DATABASE, setHasChange_DATABASE] = useState(false);
	// const [StartBoot, setStartBoot] = useState(true);
	// const [FollowSystemDarkMode, setFollowSystemDarkMode] = useState(true);
	// const [DATABASE_NAME, setDATABASE_NAME] = useState('');
	// const [SQLUser, setSQLUser] = useState('');
	// const [SQLPassword, setSQLPassword] = useState('');
	// const [SQLPort, setSQLPort] = useState('');
	// var history = [DATABASE_NAME, SQLUser, SQLPassword, SQLPort];
	// var current = history.concat();
	//！不能再这里赋值…………不然state刷新一样白搭


	ipcRenderer.on('get_app_config', (event, arg) => {
		setConfig(arg)
		// setStartBoot(arg.StartBoot);
		// setFollowSystemDarkMode(arg.FollowSystemDarkMode);
		// setDATABASE_NAME(arg.DATABASE_NAME);
		// setSQLUser(arg.SQLUser);
		// setSQLPassword(arg.SQLPassword);
		// setSQLPort(arg.SQLPort);
		// history = [arg.DATABASE_NAME, arg.SQLUser, arg.SQLPassword, arg.SQLPort].slice();
		// current = [arg.DATABASE_NAME, arg.SQLUser, arg.SQLPassword, arg.SQLPort].slice();

		history = { ...arg }
		// ！复制对象的方法！同样是浅拷贝只能分开修改第一层
	})
	// ！！判断对象是否有元素的方法！！
	if (Object.keys(config).length === 0) return (
		<div id="Page_Setting" className="relative flex items-center justify-center	 w-screen h-screen p-4 bg-gray-300 border-black dark:bg-gray-900 md:pl-20 md:py-6 border-y-2 snap-start ">
			<div className="bg-white text-4xl p-4 RoundAndShadow">😥似乎加载出错了...重新加载试试？</div>
		</div>
	);
	ipcRenderer.on("setting_startboot_change", (event, arg) => setConfig({ ...config, StartBoot: arg }))
	ipcRenderer.on("setting_follow_system_dark_mode_change", (event, arg) => setConfig({ ...config, FollowSystemDarkMode: arg }))
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
					<SettingSwtich title="StartBoot" value={config.StartBoot} handleChange={handleStartBoot} />
					<SettingSwtich title="Follow System Dark Mode" value={config.FollowSystemDarkMode} handleChange={handleFollowSystemDarkMode} />
				</SettingSection>
				<SettingSection title={'数据库'}>
					<SettingInput title={'数据库名称:'} value={config.DATABASE_NAME} handleChange={(e) => { setConfig({ ...config, DATABASE_NAME: e.target.value }); setHasChange_DATABASE(true); }}></SettingInput>
					<SettingInput title={'数据库用户名:'} value={config.SQLUser} handleChange={(e) => { setConfig({ ...config, SQLUser: e.target.value }); setHasChange_DATABASE(true); }}></SettingInput>
					<SettingInput title={'数据库密码:'} value={config.SQLPassword} handleChange={(e) => { setConfig({ ...config, SQLPassword: e.target.value }); setHasChange_DATABASE(true); }} type={'password'}></SettingInput>
					<SettingInput title={'数据库端口:'} value={config.SQLPort} handleChange={(e) => { setConfig({ ...config, SQLPort: e.target.value }); setHasChange_DATABASE(true); }}></SettingInput>
					<div className={`flex transition-all overflow-hidden w-full justify-around h-10 `}>
						<button className={`${hasChange_DATABASE ? 'w-32 hover:h-7 flex-1 h-6 ' : 'w-0 h-0 absolute'} overflow-hidden px-4 mt-4 transition-all bg-gray-300 text-nowrap dark:bg-gray-600 RoundAndShadow hover:bg-gray-400 hover:text-xl hover:mt-3`} onClick={handleApplyClick}>应用</button>
						<button className='h-6 w-32 px-4 mt-4 transition-all bg-gray-300 hover:h-7 flex-1 text-nowrap dark:bg-gray-600 RoundAndShadow hover:bg-gray-400 hover:text-xl hover:mt-3' onClick={handleConfirmClick}>保存</button>
						<button className='h-6 w-32 px-4 mt-4 transition-all bg-gray-300 hover:h-7 flex-1 text-nowrap dark:bg-gray-600 RoundAndShadow hover:bg-gray-400 hover:text-xl hover:mt-3' onClick={handleCancelClick}>{hasChange_DATABASE ? '取消' : '恢复默认'}</button>
					</div>

				</SettingSection>
			</div>
			<div className='absolute right-4 bottom-4' ><small>V{VERSION} ©2024 Woisol-G </small></div>
		</div>
	)
	function handleStartBoot(value) {
		ipcRenderer.send("setting_startboot_change", value)
	}
	function handleFollowSystemDarkMode(value) {
		ipcRenderer.send("setting_follow_system_dark_mode_change", value)
	}
	function handleConfirmClick() {
		history = { ...config };
		ipcRenderer.send('update_config', config);
		setHasChange_DATABASE(false);
	}
	function handleCancelClick() {
		// !好像不能用解构…………
		// if (history.length === 0 || history === undefined) return;
		// setDATABASE_NAME(history[0]);
		// setSQLUser(history[1]);
		// setSQLPassword(history[2]);
		// setSQLPort(history[3]);

		if (hasChange_DATABASE) {
			setConfig(history);
			setHasChange_DATABASE(false);
		}
		else {
			ipcRenderer.send('update_config', defaultConfig);
			setConfig(defaultConfig);
			history = { ...defaultConfig };
		}
	}
	function handleApplyClick() {
		// if (dialog.showMessageBoxSync({
		// 	type: 'warning',
		// 	buttons: ['取消', '确认'],
		// 	title: '提示',
		// 	message: '是否重启应用？'
		// }) === 1)
		handleConfirmClick();
		// ！不像notification，dialog不能在渲染进程里用
		ipcRenderer.send('setting_apply_relauch');
	}
}