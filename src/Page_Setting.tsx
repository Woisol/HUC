import * as React from 'react';
import { useState } from 'react';
import SettingSection from './Components/Setting/SettingSection.tsx';
import SettingSwtich from './Components/Setting/SettingSwitch.tsx';
import { event } from 'jquery';
const ipcRenderer = window.require('electron').ipcRenderer;
export default function PageSetting() {
	const [StartBoot, setStartBoot] = useState(true);
	const [FollowSystemDarkMode, setFollowSystemDarkMode] = useState(true);
	ipcRenderer.on('get_app_config', (event, arg) => {
		setStartBoot(arg.StartBoot);
		setFollowSystemDarkMode(arg.FollowSystemDarkMode);
	})
	ipcRenderer.on("setting_startboot_change", (event, arg) => setStartBoot(arg))
	ipcRenderer.on("setting_follow_system_dark_mode_change", (event, arg) => setFollowSystemDarkMode(arg))
	function handleStartBoot(value) {
		ipcRenderer.send("setting_startboot_change", value)
	}
	function handleFollowSystemDarkMode(value) {
		ipcRenderer.send("setting_follow_system_dark_mode_change", value)
	}
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
				<SettingSection title={'System'}>
					<SettingSwtich title="StartBoot" value={StartBoot} setValue={handleStartBoot} />
					<SettingSwtich title="Follow System Dark Mode" value={FollowSystemDarkMode} setValue={handleFollowSystemDarkMode} />
				</SettingSection>
			</div>
		</div>
	)
}