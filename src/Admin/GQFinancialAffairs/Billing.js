/** @format */

import { DatePicker } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { isAuthenticated } from "../../auth";
import {
	createFinance,
	getNewAccounts,
	getStores,
	getVendors,
} from "../apiAdmin";
import AdminMenu from "../AdminMenu/AdminMenu";
import DarkBG from "../AdminMenu/DarkBG";
import { Link } from "react-router-dom";

const Billing = () => {
	const [collapsed, setCollapsed] = useState(false);
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);

	//Create New Expenses

	// eslint-disable-next-line
	const [allAccountsData, setAllAccountsData] = useState("");

	// eslint-disable-next-line
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

				var indexAccountData = data
					.map((i) => i.account_type)
					.indexOf("expenses");
				setChosenAccountData(data[indexAccountData]);

				setChosenAccount(data[indexAccountData]._id);
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
		<BillingWrapper show={collapsed}>
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
					<div className='mt-5 row col-11 mx-auto'>
						<div className='col-md-4 mx-auto'>
							<div style={{ fontSize: "13px" }}>Choose Vendor</div>
							<div>
								<select
									className='form-control w-50'
									onChange={(e) => {
										setChosenVendor(e.target.value);
										var indexAccountData =
											allVendors &&
											allVendors.map((i) => i._id).indexOf(e.target.value);
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
						</div>

						<div className='col-md-4 mx-auto'>
							<h3 style={{ fontWeight: "bold" }}>EXPENSES/ BILLS</h3>
						</div>

						<div className='col-md-4 mx-auto'>
							<button
								style={{
									background: "black",
									border: "1px black solid",
									padding: "7px",
									color: "white",
									borderRadius: "3px",
								}}>
								PRINT SLIP
							</button>
							<button
								style={{
									background: "#165656",
									border: "1px #165656 solid",
									padding: "3px 10px",
									color: "white",
									borderRadius: "3px",
									marginLeft: "40px",
								}}>
								NEXT
							</button>
							<button
								className=''
								style={{
									background: "#165656",
									border: "1px #165656 solid",
									padding: "3px 10px",
									color: "white",
									borderRadius: "3px",
									marginLeft: "15px",
								}}>
								PREV
							</button>
						</div>
					</div>

					<div
						className='col-9 ml-5 mt-5'
						style={{ background: "#cde0f2", padding: "7px" }}>
						<h5
							style={{
								background: "#0e2237",
								padding: "7px",
								textAlign: "center",
								fontWeight: "bolder",
								color: "white",
							}}>
							BILL
						</h5>

						<div className='col-md-12'>
							<div className='row'>
								<div className='col-md-6' style={{ fontWeight: "bolder" }}>
									Date{" "}
									<div>
										<DatePicker
											className='w-75 mx-auto '
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
												fontWeight: "bolder",
											}}
										/>
									</div>
									<div>
										<div className='mt-3' style={{ fontWeight: "bolder" }}>
											Bill From{" "}
											<span
												className='ml-4'
												style={{
													textTransform: "uppercase",
													textDecoration: "underline",
												}}>
												{chosenVendor2.vendorName}
											</span>
										</div>
										<div
											className='mt-2'
											style={{
												marginLeft: "94px",
												textTransform: "uppercase",
												border: "1px solid darkgrey",
												width: "150px",
												padding: "10px",
												fontSize: "12px",
											}}>
											{chosenVendor2.vendorPhone}
											<br />
											{chosenVendor2.vendorCountry}
											<br />
											{chosenVendor2.vendorAddress}
										</div>
									</div>
								</div>

								<div className='col-md-6 mt-3' style={{ fontWeight: "bolder" }}>
									<div>Reference Number</div>
									<div>
										<input
											type='text'
											value={referenceNumber}
											className='w-75 mx-auto '
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
									<div className='mt-3'>
										Amount Due{" "}
										<div>
											<input
												type='number'
												value={chosenAccountValue}
												className='w-75 mx-auto '
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
									</div>
									<div className='mt-3'>
										Payment
										<div className=''>
											<select
												className='form-control w-75'
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
									</div>

									<div className='mt-3'>
										{paymentMethod && paymentMethod === "Cheque" ? (
											<>
												Check Number
												<br />
												<input
													type='text'
													value={checkNumber}
													className='w-75 mx-auto '
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
											</>
										) : null}
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className='col-md-11 mx-auto' style={{ marginTop: "130px" }}>
						<div className='row'>
							<div className='col-md-9'>
								<table
									className='table table-bordered table-md-responsive table-hover '
									style={{ fontSize: "0.75rem", overflow: "auto" }}>
									<thead className=''>
										<tr
											style={{
												fontSize: "0.75rem",
												textTransform: "capitalize",
												textAlign: "center",
											}}>
											<th scope='col'>Account</th>
											<th scope='col'>Amount</th>
											<th scope='col'>Memo</th>
											<th scope='col'>Store (Optional) </th>
											<th scope='col'>Employee Comment</th>
										</tr>
									</thead>
									<tbody
										className='my-auto'
										style={{
											fontSize: "0.75rem",
											textTransform: "capitalize",
											fontWeight: "bolder",
										}}>
										<tr style={{ fontSize: "10px" }}>
											<td>
												<select
													className='form-control w-100'
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
														border: "white solid 1px",
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
											</td>

											<td>{Number(chosenAccountValue).toLocaleString()}</td>

											<td>{chosenSubaccountDesc}</td>

											<td>
												<select
													className='form-control w-100'
													onChange={(e) => {
														setChosenStore(e.target.value);
													}}
													style={{
														border: "white solid 1px",
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
											</td>
											<td>
												<textarea
													type='text'
													value={employeeComment}
													placeholder='Add Comments'
													onChange={(e) => setEmployeeComment(e.target.value)}
													rows={1}
													className='w-100 mx-auto'
													style={{
														border: "white solid 1px",
														borderRadius: "5px",
														fontSize: "0.8rem",
														textTransform: "capitalize",
														padding: "5px",
													}}
												/>
											</td>
										</tr>
										<tr>
											<td className='py-3'></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
										</tr>
										<tr>
											<td className='py-3'></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
										</tr>
										<tr>
											<td className='py-3'></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
										</tr>
										<tr>
											<td className='py-3'></td>
											<td></td>
											<td></td>
											<td></td>
											<td></td>
										</tr>
									</tbody>
								</table>
							</div>

							<div className='col-md-3 mx-auto'>
								<div>
									{" "}
									<button
										onClick={clickSubmit}
										style={{
											background: "black",
											color: "white",
											border: "black solid 1px",
											borderRadius: "2px",
											padding: "5px",
										}}>
										BILL NOW
									</button>{" "}
								</div>
								<div className='mt-2'>
									{" "}
									<button
										onClick={() => window.location.reload(false)}
										style={{
											background: "darkred",
											border: "darkred solid 1px",
											color: "white",
											borderRadius: "2px",
											padding: "5px",
										}}>
										CLEAR
									</button>{" "}
								</div>
								<div className='mt-5'>
									{" "}
									<Link
										to={`/admin/single-report/${chosenAccount}/allexpenses`}
										style={{
											background: "#0e2237",
											border: "#0e2237 solid 1px",
											color: "white",
											borderRadius: "2px",
											padding: "5px",
										}}>
										SHOW ALL EXPENSES
									</Link>{" "}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</BillingWrapper>
	);
};

export default Billing;

const BillingWrapper = styled.div`
	min-height: 880px;

	.grid-container {
		display: grid;
		grid-template-columns: ${(props) =>
			props.show ? "4.5% 95.5%" : "15% 85%"};
		margin: auto;
	}

	table,
	thead,
	tbody,
	tr,
	td,
	th {
		border: 1px solid black;
		/* padding: 10px; */
	}

	tr:nth-child(odd) {
		background-color: white;
	}

	tr:nth-child(even) {
		background-color: #cde0f2;
	}
`;
