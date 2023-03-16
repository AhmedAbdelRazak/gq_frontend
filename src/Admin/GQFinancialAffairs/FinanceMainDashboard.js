/** @format */
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { isAuthenticated } from "../../auth";
import AdminMenu from "../AdminMenu/AdminMenu";
import DarkBG from "../AdminMenu/DarkBG";
import { getNewAccounts } from "../apiAdmin";

const FinanceMainDashboard = () => {
	const [collapsed, setCollapsed] = useState(false);
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [allAccountsData, setAllAccountsData] = useState("");

	// eslint-disable-next-line
	const { user, token } = isAuthenticated();

	const gettingAllAccounts = () => {
		getNewAccounts(token).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllAccountsData(data);
			}
		});
	};

	useEffect(() => {
		gettingAllAccounts();
		// eslint-disable-next-line
	}, []);

	return (
		<FinanceMainDashboardWrapper show={collapsed}>
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
						<h3
							style={{
								fontSize: "2rem",
								fontWeight: "bold",
								textAlign: "center",
							}}>
							Accounts' Tree
						</h3>
						<div className='ml-4'>
							<div className='row'>
								<div
									className='col-md-3'
									style={{ background: "white", padding: "20px" }}>
									<h5
										style={{
											fontSize: "1.2rem",
											fontWeight: "bold",
										}}>
										Add New Account
									</h5>
									<div className='row'>
										<div className='col-md-4 mt-4' style={{ fontSize: "13px" }}>
											Account Type
										</div>
										<div className='col-md-8 mt-4'>
											<input
												type='text'
												className='w-75 mx-auto text-center'
												style={{
													border: "lightgrey solid 1px",
												}}
											/>
										</div>

										<div className='col-md-4 mt-4' style={{ fontSize: "13px" }}>
											Account Name
										</div>
										<div className='col-md-8 mt-4'>
											<input
												type='text'
												className='w-75 mx-auto text-center'
												style={{
													border: "lightgrey solid 1px",
												}}
											/>
										</div>

										<div className='col-md-4 mt-4' style={{ fontSize: "13px" }}>
											SUB Account
										</div>
										<div className='col-md-8 mt-4'>
											<input
												type='text'
												className='w-75 mx-auto text-center'
												style={{
													border: "lightgrey solid 1px",
												}}
											/>
										</div>

										<div className='col-md-6 mt-4' style={{ fontSize: "13px" }}>
											Account Description
										</div>
										<div className='col-md-12 mt-1'>
											<textarea
												type='text'
												rows={5}
												className='w-75 mx-auto text-center'
												style={{
													border: "lightgrey solid 1px",
												}}
											/>
										</div>
									</div>
								</div>
								<div className='col-md-9 mx-auto'>
									<div className='row mt-4'>
										{allAccountsData &&
											allAccountsData.map((account, i) => {
												return (
													<div
														className='col-md-1 mx-auto'
														// onClick={() => {
														// 	setChosenTable(account);
														// 	setModalVisible(true);
														// }}
														key={i}
														style={{
															fontWeight: "bold",
															textTransform: "uppercase",
															background: "#bababa",
															textAlign: "center",
															padding: "5px 10px",
															fontSize: "1rem",
															textDecoration: "underline",
															// cursor: "pointer",
														}}>
														{account.account_type}
													</div>
												);
											})}
									</div>
									<div className='row mt-1'>
										{allAccountsData &&
											allAccountsData.map((account, i) => {
												return (
													<div className='col-md-1 mx-auto' key={i}>
														<div
															style={{
																fontWeight: "bold",
																textTransform: "uppercase",
																background: "#d3d3d3",
																textAlign: "center",
																padding: "5px 10px",
																marginLeft: "10px",
																fontSize: "0.8rem",
															}}
															className='col-md-12'>
															{account.account_name}
														</div>
													</div>
												);
											})}
									</div>
									<div className='row mt-3'>
										{allAccountsData &&
											allAccountsData.map((account, i) => {
												return (
													<div className='col-md-1 mx-auto' key={i}>
														<div className='row'>
															{account.subaccount.subaccounts.map((sub, ii) => {
																return (
																	<div
																		style={{
																			fontWeight: "bold",
																			textTransform: "uppercase",
																			background: "#e0e0e0",
																			textAlign: "center",
																			padding: "5px 10px",
																			marginLeft: "20px",
																			fontSize: "0.7rem",
																		}}
																		key={ii}
																		className='col-md-12 mt-1'>
																		{" "}
																		{sub}{" "}
																	</div>
																);
															})}
														</div>
													</div>
												);
											})}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</FinanceMainDashboardWrapper>
	);
};

export default FinanceMainDashboard;

const FinanceMainDashboardWrapper = styled.div`
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
