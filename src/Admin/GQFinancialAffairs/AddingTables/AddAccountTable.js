/** @format */
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { isAuthenticated } from "../../../auth";
import AdminMenu from "../../AdminMenu/AdminMenu";
import DarkBG from "../../AdminMenu/DarkBG";
import { createNewAccount, getNewAccounts } from "../../apiAdmin";
import UpdateTables from "./UpdateTables";

const AddAccountTable = () => {
	const [collapsed, setCollapsed] = useState(false);
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [allAccounts, setAllAccounts] = useState("");
	const [allAccountsData, setAllAccountsData] = useState("");
	const [chosenTable, setChosenTable] = useState("");
	const [iteration, setIteration] = useState(0);

	//New Account Data
	const [account_type, setAccount_type] = useState("");
	const [account_name, setAccount_name] = useState("");
	const [subaccount, setSubaccount] = useState({
		subaccounts: [],
		descriptions: [],
	});
	const [subaccountHelper, setSubaccountHelper] = useState("");
	const [account_description, setAccount_description] = useState("");

	const { user, token } = isAuthenticated();

	const gettingAllAccounts = () => {
		getNewAccounts(token).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllAccounts(data.map((account) => account.account_type));
				setAllAccountsData(data);
			}
		});
	};

	useEffect(() => {
		gettingAllAccounts();
		// eslint-disable-next-line
	}, [account_type, account_description]);

	let matchingAccount = allAccounts.indexOf(account_type.toLowerCase()) !== -1;
	// console.log(matchingAccount, "El Logic");

	const clickSubmit = (e) => {
		e.preventDefault();
		if (matchingAccount) {
			return toast.error("This Account was added before.");
		}

		if (
			!account_name ||
			subaccount.descriptions.length === 0 ||
			subaccount.subaccounts.length === 0 ||
			!account_type
		) {
			return toast.error("Please Fill In All Fields");
		}

		if (subaccount.descriptions.length !== subaccount.subaccounts.length) {
			return toast.error(
				"Please make sure to add descriptions for all subaccounts",
			);
		}

		// make request to api to create new Account
		createNewAccount(user._id, token, {
			account_name,
			account_type,
			subaccount,
		}).then((data) => {
			if (data.error) {
				console.log(data.error, "Creating New Account");
				setTimeout(function () {
					window.location.reload(false);
				}, 1000);
			} else {
				toast.success("New Account was successfully Added.");
				setTimeout(function () {
					setAccount_description("");
					setAccount_name("");
					setAccount_type("");
					setSubaccount("");
				}, 2000);
				setTimeout(function () {
					window.location.reload(false);
				}, 2500);
			}
		});
	};

	console.log(allAccountsData, "allAccountsData");

	return (
		<AddAccountTableWrapper show={collapsed}>
			{!collapsed ? (
				<DarkBG collapsed={collapsed} setCollapsed={setCollapsed} />
			) : null}
			<div className='grid-container'>
				<div className=''>
					<AdminMenu
						fromPage='NewAccount'
						AdminMenuStatus={AdminMenuStatus}
						setAdminMenuStatus={setAdminMenuStatus}
						collapsed={collapsed}
						setCollapsed={setCollapsed}
					/>
				</div>
				<div className='mainContent mt-5 col-md-6 mx-auto p-4'>
					<UpdateTables
						modalVisible={modalVisible}
						setModalVisible={setModalVisible}
						chosenTable={chosenTable}
					/>
					<div
						className=''
						style={{
							background: "white",
							padding: "20px",
							borderRadius: "5px",
							margin: "auto",
						}}>
						<h3
							className='text-center'
							style={{
								fontWeight: "bolder",
								fontSize: "1.4rem",
								textTransform: "uppercase",
							}}>
							Create New Account
						</h3>

						<div className=''>
							<div className='form-group'>
								<label
									className='text-muted'
									style={{ fontWeight: "bold", fontSize: "13px" }}>
									Account Type
								</label>
								<input
									type='text'
									className='form-control'
									onChange={(e) => setAccount_type(e.target.value)}
									value={account_type}
									required
								/>
							</div>

							<div className='form-group'>
								<label
									className='text-muted'
									style={{ fontWeight: "bold", fontSize: "13px" }}>
									Account Name
								</label>
								<input
									type='text'
									className='form-control'
									onChange={(e) => setAccount_name(e.target.value)}
									value={account_name}
									required
								/>
							</div>
							{account_name && account_type ? (
								<div className='form-group'>
									<label
										className='text-muted'
										style={{ fontWeight: "bold", fontSize: "13px" }}>
										Subaccounts
									</label>
									<input
										type='text'
										className='form-control'
										onChange={(e) => {
											setSubaccountHelper(e.target.value);
										}}
										value={subaccountHelper}
										required
									/>
									<div className='mt-2'>
										Added Subaccounts:{" "}
										<div className='row'>
											{subaccount &&
												subaccount.subaccounts &&
												subaccount.subaccounts.map((sub, i) => {
													return (
														<div
															className='col-md-2 ml-3'
															key={i}
															style={{
																fontWeight: "bold",
																textTransform: "capitalize",
															}}>
															{sub}
														</div>
													);
												})}
										</div>
									</div>
									<button
										className='mt-1 mb-3 px-1 py-1'
										style={{
											background: "#0f2c49",
											color: "white",
											borderRadius: "4px",
											border: "none",
										}}
										onClick={() => {
											setSubaccount({
												...subaccount,
												subaccounts: [
													...subaccount.subaccounts,
													subaccountHelper,
												],
											});
											setSubaccountHelper("");
										}}>
										Add Subaccount
									</button>
								</div>
							) : null}

							{subaccount &&
							subaccount.subaccounts &&
							subaccount.subaccounts.length > 0 ? (
								<div className='form-group'>
									<label
										className='text-muted mt-2'
										style={{
											fontWeight: "bold",
											fontSize: "13px",
											textTransform: "capitalize",
										}}>
										Account Description ({subaccount.subaccounts[iteration]})
									</label>
									<input
										type='text'
										className='form-control'
										onChange={(e) => {
											setAccount_description(e.target.value);
										}}
										value={account_description}
										required
									/>
									<div>Added Descriptions:</div>
									{subaccount &&
										subaccount.descriptions &&
										subaccount.descriptions.map((des, i) => {
											return (
												<div
													className='col-md-10 ml-3'
													key={i}
													style={{
														fontWeight: "bold",
														textTransform: "capitalize",
													}}>
													({des}){" "}
													<span style={{ fontSize: "12px" }}>
														{" "}
														For subaccount ({subaccount.subaccounts[i]})
													</span>
												</div>
											);
										})}

									<button
										className='mt-1 mb-3 px-1 py-1'
										disabled={subaccount.subaccounts.length <= iteration}
										style={{
											background:
												subaccount.subaccounts.length <= iteration
													? "darkgrey"
													: "#0f2c49",
											color: "white",
											borderRadius: "4px",
											border: "none",
										}}
										onClick={() => {
											setSubaccount({
												...subaccount,
												descriptions: [
													...subaccount.descriptions,
													account_description,
												],
											});
											setIteration(iteration + 1);
											setAccount_description("");
										}}>
										Add Subaccount Description
									</button>
								</div>
							) : null}
							{account_name && account_type ? (
								<button
									disabled={
										subaccount.subaccounts.length !==
										subaccount.descriptions.length
									}
									className='btn btn-outline-primary mb-3'
									onClick={clickSubmit}>
									Add New Account
								</button>
							) : null}
						</div>
					</div>
				</div>
			</div>
			<div className='col-md-8 mx-auto mt-3'>
				<h5 style={{ fontWeight: "bold" }}>Available Tree (Click To Update)</h5>
				<div className='row mt-4'>
					{allAccountsData &&
						allAccountsData.map((account, i) => {
							return (
								<div
									className='col-md-1 mx-auto'
									onClick={() => {
										setChosenTable(account);
										setModalVisible(true);
									}}
									key={i}
									style={{
										fontWeight: "bold",
										textTransform: "uppercase",
										background: "#bababa",
										textAlign: "center",
										padding: "5px 10px",
										fontSize: "1rem",
										textDecoration: "underline",
										cursor: "pointer",
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
		</AddAccountTableWrapper>
	);
};

export default AddAccountTable;

const AddAccountTableWrapper = styled.div`
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
