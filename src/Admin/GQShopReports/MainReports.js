/** @format */

import React from "react";
import styled from "styled-components";
// import { isAuthenticated } from "../../auth";
import AdminMenu from "../AdminMenu/AdminMenu";
import Navbar from "../AdminNavMenu/Navbar";

const MainReports = () => {
	// const { user, token } = isAuthenticated();

	return (
		<MainReportsWrapper>
			<div className='grid-container'>
				<div className=''>
					<AdminMenu fromPage='MainReports' />
				</div>
				<div className='mainContent'>
					<Navbar fromPage='MainReports' />
					<h3 className='mx-auto text-center mb-5'>Work In Progress</h3>

					<h5 style={{ textAlign: "center" }}>
						Working With Mr. Muhammad Abdelrazak to finalize the most relevant
						reports for the owner
					</h5>
				</div>
			</div>
		</MainReportsWrapper>
	);
};

export default MainReports;

const MainReportsWrapper = styled.div`
	min-height: 880px;
	overflow-x: hidden;
	/* background: #ededed; */

	.grid-container {
		display: grid;
		grid-template-columns: 15.5% 84.5%;
		margin: auto;
		/* border: 1px solid red; */
		/* grid-auto-rows: minmax(60px, auto); */
	}

	.card-body {
		font-weight: bolder;
	}

	.card-body span {
		font-size: 1.5rem;
	}

	.tableData {
		overflow-x: auto;
		margin-top: auto;
		margin-bottom: auto;
		margin-right: 50px;
		margin-left: 50px;
		.table > tbody > tr > td {
			vertical-align: middle !important;
		}
		@media (max-width: 1100px) {
			font-size: 0.5rem;
			/* margin-right: 5px;
		margin-left: 5px; */
		}
	}
`;
