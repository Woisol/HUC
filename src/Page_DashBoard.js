import "./MainView.css"
import Gear from "./Components/BG_Gear";
// ！记得react导入外部文件要通过这种方式！直接输路径localhost上面没有！
function PageDashBoard() {
	return (
		<div className="w-full h-screen bg-red-500" style={{ scrollSnapAlign: "start" }}>
			<div className="w-full h-fit bg-gray-400">
				{/* <Gear size="200px" top="30px" right="319px" /> */}
				<Gear size={200} top={30} right={319} isRotate={true} />
				<Gear size={250} top={102} right={123} isRotate={true} />
				<Gear size={250} top={106} right={470} isRotate={true} />
				{/* <img className="absolute" style={{ width: "200px", height: "200px", top: "30px", right: "319px" }} src={setting} alt="" />
				<img className="absolute" style={{ width: "250px", height: "250px", top: "102px", right: "123px" }} src={setting} alt="" />
				<img className="absolute" style={{ width: "250px", height: "250px", top: "106px", right: "470px" }} src={setting} alt="" /> */}
				{/* ！记得{} */}
			</div>
		</div>
	)
}
export default PageDashBoard;