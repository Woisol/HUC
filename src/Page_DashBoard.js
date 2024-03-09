import "./MainView.css"
import BGGear from "./Components/BG_Gear";
import MainSwitch from "./Components/MainSwitch";
// ！记得react导入外部文件要通过这种方式！直接输路径localhost上面没有！
function PageDashBoard(props) {
	// td暂时放下状态变量的传递先…………
	const isMonitorRunning = props.isMonitorRunning;
	console.log(isMonitorRunning);
	let isMonitorRunnin = true, isOverseersRunning = true;
	return (
		<div className="w-full h-screen" style={{ scrollSnapAlign: "start" }}>
			<BGGear isMonitorRunning={isMonitorRunning} />
			<div className="w-full h-3/4 absolute bottom-0 bg-gray-300 rounded-t-2xl border-t-2 border-black ">
				<MainSwitch toggleState={props.toggleState} isMonitorRunning={isMonitorRunning} />
			</div>
		</div>
	)
}
export default PageDashBoard;