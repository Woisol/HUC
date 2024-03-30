import * as React from 'react';
export default function SettingInput({ title, value, handleChange, type }) {
	return (
		<div className={'flex relative'}>
			<span className="">{title}</span>
			<input className='absolute right-0' type={type} value={value} onChange={handleChange} />
		</div>
	);
}