import { Switch } from '@headlessui/react';
import * as React from 'react';
export default function SettingSwtich({ title, value, handleChange }) {
	return (
		<div className={'flex relative'}>
			<span className="">{title}</span>
			<Switch.Group as='div' className='absolute right-0'>
				{/* <Switch.Label className={'text-lg mx-4'}>{title}</Switch.Label> */}
				<Switch
					as='div'
					checked={value}
					onChange={handleChange}
					className={`p-1 w-16 h-8 relative rounded-full transition-colors duration-500 hover:focus:ring-[2px] focus:ring-white dark:focus:ring-black ${value ? 'bg-blue-300' : 'bg-gray-400'}`}>
					{/* //！border和ring的一个大区别是ring不会挤占内部元素位置！ */}
					<span className="sr-only">{title}</span>
					<span className={`absolute transition-all duration-500 bg-white rounded-full ${value ? 'translate-x-8' : 'translate-x-0'} w-6 h-6`}></span>
				</Switch>
			</Switch.Group>
		</div>
	);
}