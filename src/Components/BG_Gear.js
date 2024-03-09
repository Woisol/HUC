import { Component } from "react";
import setting from "../Asset/setting.svg";


class Gear extends Component {
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
		const { size, top, right, isRotate } = this.props;
		// ！！！！！Via TY，类组件必须这样才能读取props！下面三个都不行
		return (
			// ！两种方式都不对…………<img className="absolute" style={{ width: `${props.size}px`, height: `${props.size}px`, top: `${props.top}px`, right: `${props.right}px`, transition: "0.1s", transformt: `rotate(${this.state.rotate}}deg)` }} src={setting} alt="" />
			// <img className="absolute" style={{ width: `${this.state.size}px`, height: `${this.state.size}px`, top: `${this.state.top}px`, right: `${this.state.right}px`, transition: "0.1s", transformt: `rotate(${this.state.rotate}}deg)` }} src={setting} alt="" />
			// <img className="absolute" style={{ width: `${this.props.size}px`, height: `${this.props.size}px`, top: `${this.props.top}px`, right: `${this.props.right}px`, transition: "0.1s", transformt: `rotate(${this.state.rotate}}deg)` }} src={setting} alt="" />
			<img className={`absolute ${isRotate ? 'rotate' : ''}`} style={{ width: `${size}px`, height: `${size}px`, top: `${top}px`, right: `${right}px`, transition: "0.1s" }
			} src={setting} alt="" />

		)

	}
}
export default Gear;