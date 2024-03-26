import * as React from 'react';
import $ from 'jquery';
const useState = React.useState;
function TimeCard({ data, pxPerMin }) {
	// !艹…………又是渲染先后的问题…………这个计算必须放在Showcase外面…………
	return (
		<div className="absolute flex flex-col justify-center w-full text-xs text-center text-transparent transition-all bg-gray-400 hover:text-black dark:bg-gray-400" style={{ height: `${(data[1] - data[0]) * pxPerMin}px`, bottom: `${data[0] * pxPerMin}px` }} >
			<span className='absolute z-10 -rotate-90 right-5'>{data[2][0].toLocaleTimeString()}<br />{data[2][1].toLocaleTimeString()}</span>
		</div >

	);
}

export default function AppRunTimeShowcase({ data }) {
	var [pxPerMin, UpdatePxPerMin] = useState(0);
	setInterval(() => UpdatePxPerMin($('.AppRunTimeShowcase').height() / 1440), 1000);
	//！艹…………jQuery的方法…………直接用height就自动返回第一个元素的不用[0]
	return (
		<div className='flex flex-col items-center w-16 h-full p-2 mx-2 transition-all shadow-xl sm:w-20 md:w-28 rounded-2xl hover:shadow-2xl' style={{ backgroundColor: `${data[2]}` }}>
			<div className="relative w-3 h-full transition-all bg-gray-300 rounded-lg shadow-lg dark:bg-gray-600 AppRunTimeShowcase sm:w-5 md:w-7 right-2 hover:shadow-2xl">
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
					<small className='absolute w-8 text-xs text-right text-gray-500 align-text-bottom border-b-2 md:text-base left-3 sm:left-5 md:left-7'
						style={{
							bottom: `${index * 60 * pxPerMin}px`,
							height: `${60 * pxPerMin}px`,
						}} key={index - 3}>{`${cur}:00`}</small>
				))}

			</div>
			{/* //！芜湖实现用group搞父类悬浮！ */}
			<div className="relative w-10 h-10 p-0 mx-1 transition-all bg-blue-300 sm:p-2 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl hover:shadow-2xl hover:bg-blue-400 group" >
				<img className="w-full h-full rounded-2xl" src={data === undefined ? null : data[3]} alt="AppName" />
				<span className='absolute bottom-0 hidden p-1 text-xs text-center text-black -translate-x-1/2 bg-white rounded-md opacity-75 left-1/2 w-fit group-hover:block'>{data === undefined ? null : data[0]}</span>
			</div>
		</div>
	)
}
