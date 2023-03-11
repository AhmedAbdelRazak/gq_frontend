/** @format */

import React, { useState } from "react";
import styled from "styled-components";

const Clock = () => {
	let time = new Date().toLocaleTimeString();
	let date = new Date().toDateString();
	const [currentTime, setCurrentTime] = useState(time);
	const [currentDate, setCurrentDate] = useState(date);

	const updateTime = () => {
		let time = new Date().toLocaleTimeString();
		setCurrentTime(time);
	};

	const updateDate = () => {
		let date = new Date().toDateString();
		setCurrentDate(date);
	};

	setInterval(updateTime, 1000);
	setInterval(updateDate, 1000000);

	return (
		<ClockWrapper>
			<div>
				{currentDate} | {currentTime}
			</div>
		</ClockWrapper>
	);
};

export default Clock;

const ClockWrapper = styled.div`
	div {
		font-size: 14.5px;
		color: #00b3b3;
	}
`;
