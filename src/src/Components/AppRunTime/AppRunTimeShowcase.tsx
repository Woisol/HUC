import * as React from 'react';
import $ from 'jquery';
const useState = React.useState;
function TimeCard({ data, pxPerMin }) {
	// !艹…………又是渲染先后的问题…………这个计算必须放在Showcase外面…………
	return (
		<div className="w-full absolute bg-gray-400 text-xs text-center text-transparent transition-all hover:text-black flex flex-col justify-center" style={{ height: `${(data[1] - data[0]) * pxPerMin}px`, bottom: `${data[0] * pxPerMin}px` }} >
			<span className='absolute right-5 z-10 ' style={{ transform: "rotate(270deg)" }}>{data[2][0].toLocaleTimeString()}<br />{data[2][1].toLocaleTimeString()}</span>
		</div >

	);
}

export default function AppRunTimeShowcase({ data }) {
	var [pxPerMin, UpdatePxPerMin] = useState(0);
	setInterval(() => UpdatePxPerMin($('.AppRunTimeShowcase').height() / 1440), 1000);
	//！艹…………jQuery的方法…………直接用height就自动返回第一个元素的不用[0]
	return (
		<div className='w-32 h-full p-2 mx-2 flex flex-col items-center rounded-2xl shadow-xl transition-all hover:shadow-2xl' style={{ backgroundColor: `${data[2]}` }}>
			<div className="AppRunTimeShowcase w-7 h-full relative right-2 bg-gray-300 shadow-lg rounded-lg transition-all hover:shadow-2xl">
				{data[4].map((item, index) => {
					let tmpStarMin = item[0].getHours() * 60 + item[0].getMinutes() + item[0].getSeconds() / 60 - 240;
					let tmpEndmin = item[1].getHours() * 60 + item[1].getMinutes() + item[1].getSeconds() / 60 - 240;

					return (
						<TimeCard key={index} data={[tmpStarMin > 0 ? tmpStarMin : tmpStarMin + 1440, tmpEndmin > 0 ? tmpEndmin : tmpEndmin + 1440, item]} pxPerMin={pxPerMin} />
					)
				})}
				{/* //~~傻………………明明可以在return的时候用js的……………… */}
				{/* //!并不能在return里面用传统js…………必须有返回值………… */}
				{[4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3].map((cur, index) => (
					<small className='w-8 left-7 absolute border-b-2 text-gray-500 text-right align-text-bottom'
						style={{
							bottom: `${index * 60 * pxPerMin}px`,
							height: `${60 * pxPerMin}px`,
						}} key={index - 3}>{`${cur}:00`}</small>
				))}

			</div>
			<div className="w-20 h-20 mx-1 p-2 relative rounded-2xl bg-blue-300 hover:shadow-2xl transition-all hover:bg-blue-400 text-transparent hover:text-black" > <img className="w-full h-full" src={data === undefined ? null : data[3]} alt="AppName" /> <span className='w-12 absolute bottom-0 text-center'>{data === undefined ? null : data[0]}</span></div>
		</div>
	)
}
