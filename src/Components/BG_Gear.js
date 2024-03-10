import { Component } from "react";
import setting from "../Asset/setting.svg";


class BGGear extends Component {
	// constructor(props) {
	// 	super(props);
	// 	// this.state = { rotate: 0 }
	// 	//!删掉state后Useless Constructor
	// }
	// componentDidMount() {
	// 	this.interval = setInterval(() => {
	// 		this.setState({ rotate: this.state.rotate + 1 })
	// 	}, 100)
	// }
	// componentWillUnmount() {
	// 	clearInterval(this.interval)
	// }
	// ！最佳实践的旋转并不是用state实现的…………

	render() {
		const { isMonitorRunning } = this.props;
		// ！！！！！Via TY，类组件必须这样才能读取props！下面三个都不行
		return (
			<div className="w-full h-fit fixed bg-blue-300 -z-10">
				{/* ！莫名奇妙无法设置背景…………只能在外面用opacity替代了 */}
				{/* // ！两种方式都不对…………<img className="absolute" style={{ width: `${props.size}px`, height: `${props.size}px`, top: `${props.top}px`, right: `${props.right}px`, transition: "0.1s", transformt: `rotate(${this.state.rotate}}deg)` }} src={setting} alt="" /> */}
				{/* <img className="absolute" style={{ width: `${this.state.size}px`, height: `${this.state.size}px`, top: `${this.state.top}px`, right: `${this.state.right}px`, transition: "0.1s", transformt: `rotate(${this.state.rotate}}deg)` }} src={setting} alt="" /> */}
				{/* <img className="absolute" style={{ width: `${this.props.size}px`, height: `${this.props.size}px`, top: `${this.props.top}px`, right: `${this.props.right}px`, transition: "0.1s", transformt: `rotate(${this.state.rotate}}deg)` }} src={setting} alt="" /> */}
				{/* <Gear size="200px" top="30px" right="319px" /> */}
				{/* <img className="absolute" style={{ width: "200px", height: "200px", top: "30px", right: "319px" }} src={setting} alt="" />
				<img className="absolute" style={{ width: "250px", height: "250px", top: "102px", right: "123px" }} src={setting} alt="" />
				<img className="absolute" style={{ width: "250px", height: "250px", top: "106px", right: "470px" }} src={setting} alt="" /> */}
				{/* ！记得{} */}

				<img className={`absolute ${isMonitorRunning ? 'rotate-reverse' : ''}`} style={{ width: "200px", height: "200px", top: "30px", right: "319px", transition: "0.1s" }} src={setting} alt="" />
				<img className={`absolute ${isMonitorRunning ? 'rotate' : ''}`} style={{ width: "250px", height: "250px", top: "102px", right: "123px", transition: "0.1s" }} src={setting} alt="" />
				<img className={`absolute ${isMonitorRunning ? 'rotate' : ''}`} style={{ width: "250px", height: "250px", top: "106px", right: "470px", transition: "0.1s" }} src={setting} alt="" />
			</div>

		)

	}
}
export default BGGear;