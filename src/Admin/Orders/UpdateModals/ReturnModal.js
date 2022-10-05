/** @format */

import React from "react";
import styled from "styled-components";
import { Modal, DatePicker } from "antd";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import moment from "moment";
import { updateOrder } from "../../apiAdmin";
import { isAuthenticated } from "../../../auth";
import { toast } from "react-toastify";

// import { toast } from "react-toastify";

const ReturnModal = ({
	selectedOrder,
	setSelectedOrder,
	returnDate,
	setReturnDate,
	modalVisible,
	setModalVisible,
	setCollapsed,
	returnStatus,
	setReturnStatus,
}) => {
	const { user, token } = isAuthenticated();

	console.log(selectedOrder, "SelectedOrder");

	const UpdatingOrder = (e) => {
		e.preventDefault();
		window.scrollTo({ top: 0, behavior: "smooth" });

		if (
			window.confirm(
				"Are you sure you have the physical product so it could be added to the active stock?",
			)
		) {
			updateOrder(selectedOrder._id, user._id, token, selectedOrder)
				.then((response) => {
					toast.success("Order was successfully updated");
					setTimeout(function () {
						window.location.reload(false);
					}, 2500);
				})

				.catch((error) => {
					console.log(error);
				});
		}
	};

	const mainForm = () => {
		return (
			<div className='mx-auto text-center'>
				<label style={{ fontWeight: "bolder", fontSize: "1rem" }}>
					Pick Return Date
				</label>
				<br />
				<DatePicker
					className='inputFields'
					onChange={(date) => {
						setReturnDate(new Date(date._d).toLocaleDateString() || date._d);
						setSelectedOrder({
							...selectedOrder,
							returnDate: new Date(date._d).toLocaleDateString() || date._d,
							returnedItems: [],
						});
					}}
					// disabledDate={disabledDate}
					max
					size='small'
					showToday={true}
					defaultValue={moment(new Date(returnDate))}
					placeholder='Please pick Return Date'
					style={{
						height: "auto",
						width: "67%",
						marginLeft: "5px",
						padding: "10px",
						// boxShadow: "2px 2px 2px 2px rgb(0,0,0,0.2)",
						borderRadius: "10px",
					}}
				/>
				<br />
				<br />
				<label style={{ fontWeight: "bolder", fontSize: "1rem" }}>
					What is the Return Status? ({selectedOrder.OTNumber})
				</label>
				<br />
				<div>
					<select
						onChange={(e) =>
							setSelectedOrder({
								...selectedOrder,
								returnStatus: e.target.value,
								status: e.target.value,
								returnedItems: [],
							})
						}
						placeholder='Select Return Status'
						className=' mb-3 col-md-8 mx-auto my-1'
						style={{
							paddingTop: "12px",
							paddingBottom: "12px",
							// paddingRight: "50px",
							// textAlign: "center",
							border: "#cfcfcf solid 1px",
							borderRadius: "10px",
							fontSize: "0.9rem",
							// boxShadow: "2px 2px 2px 2px rgb(0,0,0,0.2)",
							textTransform: "capitalize",
						}}>
						<option value='SelectStatus'>Select A Return Status</option>
						<option value='Returned and Refunded'>Returned and Refunded</option>
						<option value='Returned and Not Refunded'>
							Returned and Not Refunded
						</option>
						<option value='Returned and Rejected'>Returned and Rejected</option>
						{/* <option value='Partially Returned Not Refunded'>
							Partially Returned Not Refunded
						</option>
						<option value='Partially Returned And Refunded'>
							Partially Returned And Refunded
						</option> */}
					</select>
				</div>

				{/* {selectedOrder.status === "Partially Returned And Refunded" ||
				selectedOrder.status === "Partially Returned Not Refunded" ? (
					<div className='my-3'>
						<label style={{ fontWeight: "bolder", fontSize: "1rem" }}>
							Choose Which Products Are Returned
						</label>
						<br />
						{selectedOrder.chosenProductQtyWithVariables.map((p, i) => {
							return (
								<span key={i}>
									{p.map((pp, ii) => {
										return (
											<span key={ii}>
												<input
													type='checkbox'
													value={pp}
													onChange={(e) => {
														setSelectedOrder({
															...selectedOrder,
															returnedItems: [
																...selectedOrder.returnedItems,
																pp,
															],
														});
													}}
												/>{" "}
												SKU: {pp.SubSKU} Quantity: {pp.OrderedQty}
												<br />
											</span>
										);
									})}
								</span>
							);
						})}
					</div>
				) : null} */}
				<div className='col-md-5 mx-auto'>
					<button className='btn btn-primary btn-block' onClick={UpdatingOrder}>
						Update Order
					</button>
				</div>
			</div>
		);
	};

	return (
		<ReturnModalWrapper>
			<Modal
				width='90%'
				title={
					<div
						style={{
							textAlign: "center",
							fontWeight: "bold",
							fontSize: "1.3rem",
						}}>{`Order Return`}</div>
				}
				visible={modalVisible}
				onOk={() => {
					setModalVisible(false);
					setCollapsed(false);
				}}
				// okButtonProps={{ style: { display: "none" } }}
				cancelButtonProps={{ style: { display: "none" } }}
				onCancel={() => {
					setCollapsed(false);
					setModalVisible(false);
				}}>
				{mainForm()}
			</Modal>
		</ReturnModalWrapper>
	);
};

export default ReturnModal;

const ReturnModalWrapper = styled.div``;
