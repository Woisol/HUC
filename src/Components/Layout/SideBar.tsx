import * as React from 'react';
import { useState } from 'react';
import SlideBarIcon1 from "../../Asset/dashboard.svg";
import SlideBarIcon2 from "../../Asset/AppDetail.svg";
import SlideBarIcon3 from "../../Asset/setting_SlideBar.svg";
import { Tab } from '@headlessui/react';
import { event } from 'jquery';
// import $ from "jquery";

// function pageScoll(props) {
// 	$("#" + props.PageID).scrollTop(0);
// }
const SlideBarOpProps = [
	{ icon: SlideBarIcon1, title: "DashBoard", PageID: "Page_DashBoard" },
	{ icon: SlideBarIcon2, title: "AppDetail", PageID: "Page_AppDetail" },
	{ icon: SlideBarIcon3, title: "Setting", PageID: "Page_Setting" }
]
// ！啊啊注意分清[]和{}！！
function SlideBarOption(props, index) {
	// ！是的可以这样多搞几个参数的，解决没有key的问题
	return (
		<Tab>
			{/* underline-offset-4//!不知道是干什么的 */}
			{({ selected }) =>
				<a key={index} href={"#" + props.PageID} className={`flex items-center w-full overflow-hidden transition-all rounded-2xl hover:text-xl ${selected ? 'bg-blue-300 border-l-4 rounded-l-none border-blue-500 underline opacity-100' : 'hover:bg-blue-300 opacity-75'} `}>
					<img className={`m-1 w-14 h-14 ${selected ? 'scale-100' : 'scale-75'}`} src={props.icon} alt={props.title} />
					{props.title}
				</a>
			}
			{/* // ！额这里img必须w和h都设定了才能真正设定……………… */}
		</Tab>
	)
}
export default function SlideBar() {
	return (
		// <div className="fixed left-0 flex flex-col justify-center w-0 w-16 h-0 py-2 transition-all -translate-y-1/2 bg-blue-200 shadow-2xl sm:h-fit rounded-2xl items-cente hover:w-48 hover:px-3 top-1/2">
		// <>
		<Tab.List className="fixed left-0 flex flex-col hover:pl-2 justify-center w-0 py-1 transition-all -translate-y-1/2 bg-blue-200 rounded-md shadow-2xl h-fit sm:w-16 sm:h-fit sm:rounded-2xl items-cente hover:w-[72px] sm:hover:w-48 top-1/2 group:">
			{SlideBarOpProps.map((item, index) => { return SlideBarOption(item, index) })}
		</Tab.List>
		// </>
	);
}