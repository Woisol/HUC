import { useState } from "react";

export default function Console(props) {
	const content = "2024-03-07 20:56 STAT APP Started";
	// const
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div className="absolute right-0 rounded-2xl z-10 bg-gradient-to-t from-black to-gray-500 text-wrap text-xs text-white" style={isOpen ? { width: "300px", height: "600px", top: "50%", padding: "20px", transform: "translateY(-50%)", transition: "0.5s" } : { width: "20px", height: "120px", top: "50%", transform: "translateY(-50%)", transition: "0.5s" }} onClick={toggleIsOpen}>{isOpen ? content : ""}</div>
	);
	function toggleIsOpen() {
		setIsOpen(!isOpen);
	}
}