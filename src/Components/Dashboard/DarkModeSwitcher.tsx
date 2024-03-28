import * as React from 'react';
import { useState } from 'react';
import { Switch, Transition } from '@headlessui/react';
// import { ipcRenderer } from 'electron';
// !woq久不用又忘记了………………
const ipcRenderer = window.require('electron').ipcRenderer;
export default function DarkModeSwitcher({ isDarkMode, setIsDarkMode }) {
	// ipcRenderer.on('DarkModeChange', arg => setIsDarkMode(arg))
	//!额…………类型“IpcRendererEvent”的参数不能赋给类型“SetStateAction<boolean>”的参数。
	return (
		// ！？？？为什么一定要as div才能显示？？？
		<Switch
			as='div'
			// ！发现问题了…………看控制台注意到编译出来的，当前版本的tailwindcss对button有默认样式背景透明…………https://www.cnblogs.com/alpiny/p/18096722
			checked={isDarkMode}
			onChange={setIsDarkMode}
			className={`absolute w-20 h-9 top-5 right-5 rounded-full transition-colors duration-500 focus:ring-[2px] p-1 focus:ring-white dark:focus:ring-black ${isDarkMode ? 'bg-gray-700' : 'bg-blue-300'}`}>
			{/* //！border和ring的一个大区别是ring不会挤占内部元素位置！ */}
			<span className="sr-only">Dark Mode</span>
			{isDarkMode ? (
				<span className="absolute overflow-hidden duration-500 bg-gray-400 rounded-full translate-x-11 w-7 h-7" style={{ transitionProperty: 'color, transform' }}>
					<span className={'absolute -translate-x-1 -translate-y-[2px] w-6 h-6 transition-all duration-700 bg-gray-700 rounded-full'}></span>
				</span>

			) : (
				<span className="absolute bg-yellow-200 border-[4px] border-yellow-100 duration-500 translate-x-0 rounded-full w-7 h-7 " style={{ transitionProperty: 'color, transform' }}>
					<span className={'bg-yellow-200 -translate-x-8 w-8 h-8 -translate-y-8 transition-all duration-700'}></span>
				</span>

			)}
		</Switch>
	)
}