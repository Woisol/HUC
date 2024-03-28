import * as React from 'react';
const SettingSection = ({ children, title }) => {
	return (
		<div className="relative flex flex-col w-full gap-4 p-4 my-4 bg-white sm:w-80 RoundAndShadow dark:bg-gray-800 h-fit">
			<span className='absolute text-lg text-gray-500 -top-4'>{title}</span>
			{children}
		</div>
	)
}
export default SettingSection;