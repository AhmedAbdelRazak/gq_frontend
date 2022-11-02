/** @format */

import React from "react";

const DarkBackground2 = ({ setClick, setClickMenu }) => {
	return (
		<div
			className='DarkbackgroundForSidebar2'
			onClick={() => {
				setClick(false);
				setClickMenu(false);
			}}></div>
	);
};

export default DarkBackground2;
