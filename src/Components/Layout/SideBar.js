import SlideBarIcon1 from "../../Asset/dashboard.svg";
import SlideBarIcon2 from "../../Asset/AppDetail.svg";
import SlideBarIcon3 from "../../Asset/setting_SlideBar.svg";
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
function SlideBarOption(props) {
	return (
		<a href={"#" + props.PageID} className="w-full overflow-hidden flex items-center rounded-2xl transition-all hover:bg-blue-300 hover:text-xl"> <img className="w-14 h-14 m-1" src={props.icon} alt={props.title} />{props.title}</a>
		// ！额这里img必须w和h都设定了才能真正设定………………
	)
}
function SlideBar(props) {
	return (
		<div className="w-16 h-fit py-2 fixed shadow-2xl bg-blue-200 rounded-2xl flex flex-col items-cente justify-center transition-all hover:w-48 hover:px-3" style={{ top: "50%", transform: "translateY(-50%)", left: "0" }}>
			{SlideBarOpProps.map((item, index) => { return SlideBarOption(item) })}
		</div>
	);
}
export default SlideBar;