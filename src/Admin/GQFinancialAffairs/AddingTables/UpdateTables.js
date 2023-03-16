/** @format */

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Modal } from "antd";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import { removeAccount, updateAccounts } from "../../apiAdmin";
import { isAuthenticated } from "../../../auth";
import { toast } from "react-toastify";

// import { toast } from "react-toastify";

const UpdateTables = ({ setModalVisible, modalVisible, chosenTable }) => {
	const [account_type, setAccount_type] = useState("");
	const [account_name, setAccount_name] = useState("");
	const [subaccount, setSubaccount] = useState("");
	const [subaccountHelper, setSubaccountHelper] = useState("");
	const [iteration, setIteration] = useState(0);
	const [account_description, setAccount_description] = useState("");

	const { user, token } = isAuthenticated();

	const clickSubmit = (e) => {
		e.preventDefault();

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

		const newAccount = {
			account_name: account_name,
			account_type: account_type,
			subaccount: subaccount,
		};

		// make request to api to update Account
		updateAccounts(chosenTable._id, user._id, token, newAccount).then(
			(data) => {
				if (data.error) {
					console.log(data.error, "Creating New Account");
					setTimeout(function () {
						window.location.reload(false);
					}, 1000);
				} else {
					toast.success("Account Successfully updated.");

					setTimeout(function () {
						window.location.reload(false);
					}, 2500);
				}
			},
		);
	};

	useEffect(() => {
		setAccount_type(chosenTable.account_type);
		setAccount_name(chosenTable.account_name);
		setSubaccount(chosenTable.subaccount);
		// eslint-disable-next-line
	}, [modalVisible]);

	console.log(chosenTable, "chosenTable");
	console.log(subaccount, "subaccount");

	const mainForm = () => {
		return (
			<div className='mx-auto '>
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
													className='col-md-2 ml-3 my-2'
													key={i}
													style={{
														fontWeight: "bold",
														textTransform: "capitalize",
														fontSize: "12px",
													}}>
													{sub}
													<span
														onClick={() => {
															var clickedItem = subaccount.subaccounts.splice(
																i,
																1,
															)[0];

															var remainderElements =
																subaccount.subaccounts.filter(
																	(i) => i !== clickedItem,
																);

															setSubaccount({
																...subaccount,
																subaccounts: remainderElements,
															});
														}}
														className='ml-2'
														style={{
															fontSize: "10px",
															color: "red",
															border: "1px solid lightgrey",
															padding: "2px 5px",
															cursor: "pointer",
														}}>
														Remove
													</span>
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
										subaccounts: [...subaccount.subaccounts, subaccountHelper],
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
											<span
												onClick={() => {
													var clickedItem = subaccount.descriptions.splice(
														i,
														1,
													)[0];

													var remainderElements =
														subaccount.descriptions.filter(
															(i) => i !== clickedItem,
														);

													setSubaccount({
														...subaccount,
														descriptions: remainderElements,
													});
												}}
												className='ml-2'
												style={{
													fontSize: "10px",
													color: "red",
													border: "1px solid lightgrey",
													padding: "2px 5px",
													cursor: "pointer",
												}}>
												Remove
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
					{subaccount &&
					subaccount.subaccounts &&
					subaccount.subaccounts.length ? (
						<>
							{account_name && account_type ? (
								<button
									disabled={
										subaccount.subaccounts.length !==
										subaccount.descriptions.length
									}
									className='btn btn-outline-primary mb-3'
									style={{ textTransform: "capitalize" }}
									onClick={clickSubmit}>
									Update Account "{chosenTable.account_type}"
								</button>
							) : null}
						</>
					) : null}
					{subaccount &&
					subaccount.subaccounts &&
					subaccount.subaccounts.length ? (
						<>
							{account_name && account_type ? (
								<button
									className='btn btn-danger mb-3 mx-5'
									style={{ textTransform: "capitalize" }}
									onClick={() => {
										if (
											window.confirm(
												`Are You Sure You Want To Delete Account ${chosenTable.account_type}?`,
											)
										) {
											removeAccount(chosenTable._id, user._id, token)
												.then((res) => {
													toast.error(
														`Account "${res.data.account_type}" deleted`,
													);
													setTimeout(function () {
														window.location.reload(false);
													}, 2500);
													setModalVisible(false);
												})
												.catch((err) => console.log(err));
										}
										setTimeout(function () {
											window.location.reload(false);
										}, 2500);
									}}>
									Delete Account "{chosenTable.account_type}"
								</button>
							) : null}
						</>
					) : null}
				</div>
			</div>
		);
	};

	return (
		<UpdateTablesWrapper>
			<Modal
				width='65%'
				title={
					<div
						style={{
							textAlign: "center",
							fontWeight: "bold",
							fontSize: "1.3rem",
							color: "darkgreen",
							textTransform: "capitalize",
						}}>{`Update Account "${chosenTable.account_type}"`}</div>
				}
				open={modalVisible}
				onOk={() => {
					setModalVisible(false);
				}}
				// okButtonProps={{ style: { display: "none" } }}
				cancelButtonProps={{ style: { display: "none" } }}
				onCancel={() => {
					setModalVisible(false);
				}}>
				{mainForm()}
			</Modal>
		</UpdateTablesWrapper>
	);
};

export default UpdateTables;

const UpdateTablesWrapper = styled.div``;
