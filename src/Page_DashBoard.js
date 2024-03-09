import "./MainView.css"
import BG_Gear from "./Components/BG_Gear";
import BGGear from "./Components/BG_Gear";
// ！记得react导入外部文件要通过这种方式！直接输路径localhost上面没有！
function PageDashBoard() {
	return (
		<div className="w-full h-screen bg-red-500" style={{ scrollSnapAlign: "start" }}>
			<BGGear isRotate={true} />
		</div>
	)
}
export default PageDashBoard;