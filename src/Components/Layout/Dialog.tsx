import * as React from 'react';
import { Fragment } from 'react';
import { Dialog as DialogHeadlessui, Transition } from '@headlessui/react';
export default function Dialog({ children, open, setOpen }) {
	return (
		<Transition
			appear
			as={Fragment}
			show={open}
		>
			<DialogHeadlessui
				as='div'
				open={open}
				onClose={() => setOpen(false)}
			>
				{/* //！这个不能设置成fragment！ */}
				{/* //！注意<></>无法传参数！必须显式使用Fragment才能！这里可能是这个原因 */}
				<Transition.Child
					as={Fragment}
					enter="transition ease-out"
					enterFrom="transform opacity-0"
					enterTo="transform opacity-50"
					leave="transition ease-out"
					leaveFrom="transform opacity-50"
					leaveTo="transform opacity-0"
				>
					<div className="fixed w-screen h-screen bg-gray-400 opacity-50"></div>
				</Transition.Child>
				<Transition.Child
					as={Fragment}
					enter="duration-500 ease-out"
					enterFrom="scale-50 opacity-0"
					enterTo="scale-100 opacity-100"
					leave="duration-500 ease-out"
					leaveFrom="scale-100 opacity-100"
					leaveTo="scale-50 opacity-0"
				>
					<DialogHeadlessui.Panel as={Fragment}>
						{/* //！Panel不能设置个w-screen，没必要且导致点击外面无法关闭 */}
						{children}
					</DialogHeadlessui.Panel>
				</Transition.Child>

			</DialogHeadlessui>
		</Transition>
	);
}