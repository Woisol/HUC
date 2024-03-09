import SlideBarIcon1 from "../../Asset/dashboard.svg";
import SlideBarIcon2 from "../../Asset/AppManagement.svg";
import SlideBarIcon3 from "../../Asset/setting_SlideBar.svg";

const SlideBarOpProps = [
	{ icon: SlideBarIcon1, title: "DashBoard" },
	{ icon: SlideBarIcon2, title: "AppManagement" },
	{ icon: SlideBarIcon3, title: "Setting" }
]
// ！啊啊注意分清[]和{}！！
function SlideBarOption(props) {
	return (
		<div className="w-full overflow-hidden flex items-center"> <img className="w-14 h-14 m-1" src={props.icon} alt={props.title} />{props.title}</div>
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