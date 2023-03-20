/** @format */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { isAuthenticated } from "../../../auth";
import AdminMenu from "../../AdminMenu/AdminMenu";
import DarkBG from "../../AdminMenu/DarkBG";
import { getFinances } from "../../apiAdmin";
import Expenses from "./Expenses";

const FinanceMainReport = ({ match }) => {
	const [collapsed, setCollapsed] = useState(false);
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [reportName, setReportName] = useState("");
	const [allAddedAccounts, setAllAddedAccounts] = useState("");

	// eslint-disable-next-line
	const { user, token } = isAuthenticated();

	useEffect(() => {
		var requiredReport = match.params.report;

		setReportName(requiredReport);
		// eslint-disable-next-line
	}, []);

	const gettingAllAccounts = () => {
		function sortByDate(a, b) {
			const TotalAppointmentsA = a.logDate;
			const TotalAppointmentsB = b.logDate;
			let comparison = 0;
			if (TotalAppointmentsA < TotalAppointmentsB) {
				comparison = 1;
			} else if (TotalAppointmentsA > TotalAppointmentsB) {
				comparison = -1;
			}
			return comparison;
		}
		getFinances(token).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllAddedAccounts(data.sort(sortByDate));
			}
		});
	};

	useEffect(() => {
		gettingAllAccounts();
		// eslint-disable-next-line
	}, []);

	return (
		<FinanceMainReportWrapper show={collapsed}>
			{!collapsed ? (
				<DarkBG collapsed={collapsed} setCollapsed={setCollapsed} />
			) : null}
			<div className='grid-container'>
				<div className=''>
					<AdminMenu
						fromPage='AccountsTree'
						AdminMenuStatus={AdminMenuStatus}
						setAdminMenuStatus={setAdminMenuStatus}
						collapsed={collapsed}
						setCollapsed={setCollapsed}
					/>
				</div>
				<div className='mainContent'>
					<div className='mt-5'>
						<div
							className='mb-3'
							style={{
								fontSize: "1.3rem",
								fontWeight: "bold",
								textAlign: "center",
							}}>
							<Link to='/admin/account-tree'> Back To Accounts' Tree</Link>
						</div>
						<h3
							style={{
								fontSize: "2rem",
								fontWeight: "bold",
								textAlign: "center",
							}}>
							{reportName}
						</h3>
						<div className='col-md-9 mx-auto'>
							<Expenses
								allAddedAccounts={allAddedAccounts}
								reportName={reportName}
							/>
						</div>
					</div>
				</div>
			</div>
		</FinanceMainReportWrapper>
	);
};

export default FinanceMainReport;

const FinanceMainReportWrapper = styled.div`
	min-height: 880px;

	.grid-container {
		display: grid;
		/* grid-template-columns: 16% 84%; */
		grid-template-columns: ${(props) =>
			props.show ? "4.5% 95.5%" : "15% 85%"};

		margin: auto;
		/* border: 1px solid red; */
		/* grid-auto-rows: minmax(60px, auto); */
	}
`;
