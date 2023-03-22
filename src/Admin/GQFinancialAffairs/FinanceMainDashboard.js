/** @format */
import { DatePicker } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { isAuthenticated } from "../../auth";
import AdminMenu from "../AdminMenu/AdminMenu";
import DarkBG from "../AdminMenu/DarkBG";
import {
	createFinance,
	getNewAccounts,
	getStores,
	getVendors,
} from "../apiAdmin";

const FinanceMainDashboard = () => {
	const [collapsed, setCollapsed] = useState(false);
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [allAccountsData, setAllAccountsData] = useState("");
	const [allStores, setAllStores] = useState("");
	const [allVendors, setAllVendors] = useState("");
	const [chosenAccount, setChosenAccount] = useState("");
	const [chosenSubaccount, setChosenSubaccount] = useState("");
	const [chosenDate, setChosenDate] = useState(moment(new Date()));
	const [chosenSubaccountDesc, setChosenSubaccountDesc] = useState("");
	const [chosenAccountData, setChosenAccountData] = useState("");
	const [paymentMethod, setPaymentMethod] = useState("");
	const [chosenVendor, setChosenVendor] = useState("");
	const [chosenVendor2, setChosenVendor2] = useState("");
	const [referenceNumber, setReferenceNumber] = useState("");
	const [checkNumber, setCheckNumber] = useState("");
	const [chosenStore, setChosenStore] = useState("");
	const [chosenAccountValue, setChosenAccountValue] = useState("");
	const [employeeComment, setEmployeeComment] = useState("");

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
	const gettingAllStores = () => {
		getStores(token).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllStores(data);
			}
		});
	};

	const gettingAllVendors = () => {
		getVendors(token).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllVendors(data);
			}
		});
	};

	useEffect(() => {
		gettingAllAccounts();
		gettingAllStores();
		gettingAllVendors();
		// eslint-disable-next-line
	}, []);

	const clickSubmit = (e) => {
		e.preventDefault();

		if (!chosenAccount) {
			return toast.error("Please Choose an Account Type");
		}

		if (!chosenSubaccount) {
			return toast.error("Please Choose Subaccount");
		}

		if (!chosenAccountValue) {
			return toast.error("Please Add Desired Value");
		}

		if (!chosenVendor) {
			return toast.error("Please Add Desired Vendor");
		}

		if (!paymentMethod) {
			return toast.error("Please Add A Payment Method");
		}

		if (paymentMethod === "Cheque" && !checkNumber) {
			return toast.error("Please Add A Check Number");
		}

		createFinance(user._id, token, {
			account_type: chosenAccount,
			account_name: chosenAccountData.account_name,
			subaccount: chosenSubaccount,
			account_description: chosenSubaccountDesc,
			value: chosenAccountValue,
			employeeComment: employeeComment,
			storeName: chosenStore ? chosenStore : "Not Added",
			vendor: chosenVendor ? chosenVendor2 : { vendorName: "No Vendor" },
			logDate: chosenDate,
			addedByUser: user,
			paymentMethod: paymentMethod,
			referenceNumber: referenceNumber ? referenceNumber : "Not Added",
			chequeNumber: checkNumber ? checkNumber : "Not Added",
		}).then((data) => {
			if (data.error) {
				console.log(data.error, "error");
				setTimeout(function () {
					window.location.reload(false);
				}, 1000);
			} else {
				toast.success("Successfully Added");

				setTimeout(function () {
					window.location.reload(false);
				}, 1500);
			}
		});
	};

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
										<div className='col-md-4 mt-2' style={{ fontSize: "13px" }}>
											Account Type
										</div>
										<div className='col-md-8 mt-2'>
											<select
												className='form-control'
												onChange={(e) => {
													setChosenAccount(e.target.value);
													var indexAccountData = allAccountsData
														.map((i) => i._id)
														.indexOf(e.target.value);
													setChosenAccountData(
														allAccountsData[indexAccountData],
													);
												}}
												style={{
													border: "#cfcfcf solid 1px",
													borderRadius: "5px",
													fontSize: "0.8rem",
													textTransform: "capitalize",
												}}>
												<option value='Select'>Select Account Type</option>
												{allAccountsData &&
													allAccountsData.map((acc, i) => {
														return (
															<option value={acc._id} key={i}>
																{acc.account_type}
															</option>
														);
													})}
											</select>
										</div>

										<div className='col-md-4 mt-4' style={{ fontSize: "13px" }}>
											Subccount
										</div>
										<div className='col-md-8 mt-4'>
											<select
												className='form-control'
												onChange={(e) => {
													setChosenSubaccount(e.target.value);
													var indexSubAccount =
														chosenAccountData.subaccount.subaccounts.indexOf(
															e.target.value,
														);
													setChosenSubaccountDesc(
														chosenAccountData.subaccount.descriptions[
															indexSubAccount
														],
													);
												}}
												style={{
													border: "#cfcfcf solid 1px",
													borderRadius: "5px",
													fontSize: "0.8rem",
													textTransform: "capitalize",
												}}>
												<option value='Select'>Select Subaccount</option>
												{chosenAccountData &&
													chosenAccountData.subaccount &&
													chosenAccountData.subaccount.subaccounts &&
													chosenAccountData.subaccount.subaccounts.map(
														(sub, i) => {
															return (
																<option value={sub} key={i}>
																	{sub}
																</option>
															);
														},
													)}
											</select>
										</div>

										<div className='col-md-4 mt-4' style={{ fontSize: "13px" }}>
											Vendor
										</div>
										<div className='col-md-8 mt-4'>
											<select
												className='form-control'
												onChange={(e) => {
													setChosenVendor(e.target.value);
													var indexAccountData =
														allVendors &&
														allVendors
															.map((i) => i._id)
															.indexOf(e.target.value);
													setChosenVendor2(allVendors[indexAccountData]);
												}}
												style={{
													border: "#cfcfcf solid 1px",
													borderRadius: "5px",
													fontSize: "0.8rem",
													textTransform: "capitalize",
												}}>
												<option value='Select'>Select A Vendor</option>
												{allVendors &&
													allVendors.map((acc, i) => {
														return (
															<option value={acc._id} key={i}>
																{acc.vendorName}
															</option>
														);
													})}
											</select>
										</div>

										<div className='col-md-4 mt-4' style={{ fontSize: "13px" }}>
											Store Name
										</div>
										<div className='col-md-8 mt-4'>
											<select
												className='form-control'
												onChange={(e) => {
													setChosenStore(e.target.value);
												}}
												style={{
													border: "#cfcfcf solid 1px",
													borderRadius: "5px",
													fontSize: "0.8rem",
													textTransform: "capitalize",
												}}>
												<option value='Select'>Select A Store</option>
												{allStores &&
													allStores.map((acc, i) => {
														return (
															<option value={acc.storeName} key={i}>
																{acc.storeName}
															</option>
														);
													})}
											</select>
										</div>

										<div className='col-md-4 mt-4' style={{ fontSize: "13px" }}>
											Payment
										</div>
										<div className='col-md-8 mt-4'>
											<select
												className='form-control'
												onChange={(e) => {
													setPaymentMethod(e.target.value);
												}}
												style={{
													border: "#cfcfcf solid 1px",
													borderRadius: "5px",
													fontSize: "0.8rem",
													textTransform: "capitalize",
												}}>
												<option value='Select'>Payment Method</option>
												<option value='Cash'>Cash</option>
												<option value='Online Payment'>Online Payment</option>
												<option value='Cheque'>Cheque</option>
											</select>
										</div>

										{paymentMethod && paymentMethod === "Cheque" ? (
											<>
												<div
													className='col-md-4 mt-4'
													style={{ fontSize: "13px" }}>
													Check Number
												</div>
												<div className='col-md-8 mt-4'>
													<input
														type='text'
														value={checkNumber}
														className='w-100 mx-auto '
														style={{
															border: "#cfcfcf solid 1px",
															borderRadius: "5px",
															fontSize: "0.8rem",
															textTransform: "capitalize",
															padding: "5px",
														}}
														onChange={(e) => {
															setCheckNumber(e.target.value);
														}}
													/>
												</div>
											</>
										) : null}

										<div className='col-md-4 mt-4' style={{ fontSize: "13px" }}>
											Reference Number
										</div>
										<div className='col-md-8 mt-4'>
											<input
												type='text'
												value={referenceNumber}
												className='w-100 mx-auto '
												style={{
													border: "#cfcfcf solid 1px",
													borderRadius: "5px",
													fontSize: "0.8rem",
													textTransform: "capitalize",
													padding: "5px",
												}}
												onChange={(e) => {
													setReferenceNumber(e.target.value);
												}}
											/>
										</div>

										<div className='col-md-4 mt-4' style={{ fontSize: "13px" }}>
											Value (EGP)
										</div>
										<div className='col-md-8 mt-4'>
											<input
												type='number'
												value={chosenAccountValue}
												className='w-100 mx-auto '
												style={{
													border: "#cfcfcf solid 1px",
													borderRadius: "5px",
													fontSize: "0.8rem",
													textTransform: "capitalize",
													padding: "5px",
												}}
												onChange={(e) => {
													setChosenAccountValue(e.target.value);
												}}
											/>
										</div>

										<div className='col-md-4 mt-4' style={{ fontSize: "13px" }}>
											Date
										</div>
										<div className='col-md-8 mt-4'>
											<DatePicker
												className='inputFields'
												onChange={(date) => {
													setChosenDate(new Date(date._d) || date._d);
												}}
												// disabledDate={disabledDate}
												max
												size='small'
												showToday={true}
												defaultValue={moment(new Date(chosenDate))}
												placeholder='Please pick the desired schedule date'
												style={{
													border: "#cfcfcf solid 1px",
													borderRadius: "5px",
													width: "100%",
													fontSize: "0.8rem",
													textTransform: "capitalize",
													padding: "5px",
												}}
											/>
										</div>

										<div className='col-md-6 mt-4' style={{ fontSize: "13px" }}>
											Account Description
										</div>
										<div className='col-md-12 mt-1'>
											<textarea
												type='text'
												value={chosenSubaccountDesc}
												rows={2}
												className='w-100 mx-auto'
												style={{
													border: "#cfcfcf solid 1px",
													borderRadius: "5px",
													fontSize: "0.8rem",
													textTransform: "capitalize",
													padding: "5px",
												}}
											/>
										</div>

										<div className='col-md-6 mt-4' style={{ fontSize: "13px" }}>
											Employee Comment
										</div>
										<div className='col-md-12 mt-1'>
											<textarea
												type='text'
												value={employeeComment}
												placeholder='Add Comments'
												onChange={(e) => setEmployeeComment(e.target.value)}
												rows={2}
												className='w-100 mx-auto'
												style={{
													border: "#cfcfcf solid 1px",
													borderRadius: "5px",
													fontSize: "0.8rem",
													textTransform: "capitalize",
													padding: "5px",
												}}
											/>
										</div>
										<div className='col-md-6 mx-auto text-center mt-4'>
											<button
												className='btn btn-primary'
												onClick={clickSubmit}
												style={{ textTransform: "capitalize" }}>
												Add{" "}
												{chosenAccountData && chosenAccountData.account_type}
											</button>
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
															padding: "7px 0px",
															fontSize:
																account.account_type.length > 10
																	? "0.8rem"
																	: "0.9rem",
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
																padding: "7px 0px",
																marginLeft: "10px",
																fontSize: "0.75rem",
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
																			padding: "5px 0px",
																			marginLeft: "20px",
																			fontSize: "0.65rem",
																		}}
																		key={ii}
																		className='col-md-12 mt-3'>
																		{" "}
																		<Link
																			to={`/admin/single-report/${account._id}/${sub}`}
																			style={{ color: "black" }}>
																			{sub}
																		</Link>{" "}
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
