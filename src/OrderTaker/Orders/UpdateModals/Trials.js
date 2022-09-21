/** @format */

import React from "react";
import styled from "styled-components";
import { Modal } from "antd";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import { toast } from "react-toastify";

const Trial = ({
	modalVisible,
	setModalVisible,
	updateElement,
	setUpdateSingleOrder,
	updateSingleOrder,
	updateCustomerDetails,
	setUpdateCustomerDetails,
}) => {
	// const handleModal = () => {
	// 	setModalVisible(true);
	// };

	const mainForm = () => {
		return (
			<>
				{updateElement === "Tracking Number" ? (
					<div className='form-group col-md-6 mx-auto my-4 '>
						<label className=''>Update Tracking Number</label>
						<input
							onChange={(e) =>
								setUpdateSingleOrder({
									...updateSingleOrder,
									trackingNumber: e.target.value,
								})
							}
							type='text'
							className='form-control'
							value={updateSingleOrder.trackingNumber}
							placeholder='Add Updated Tracking # Here.'
						/>
						<div className='text-center mx-auto mt-3'>
							<button className='btn btn-primary col-md-6 mx-auto'>
								Send Tracking Number To The Client Via SMS
							</button>
						</div>
					</div>
				) : null}

				{updateElement === "Order Status" ? (
					<div className='form-group col-md-6 mx-auto'>
						<h4 className=' mb-4'>
							Current Status:{" "}
							<span style={{ color: "darkcyan" }}>
								{updateSingleOrder.status}
							</span>
						</h4>
						<select
							className='form-control'
							onChange={(e) =>
								setUpdateSingleOrder({
									...updateSingleOrder,
									status: e.target.value,
								})
							}
							style={{
								border: "#cfcfcf solid 1px",
								borderRadius: "10px",
								width: "100%",
								fontSize: "0.9rem",
								boxShadow: "2px 2px 2px 2px rgb(0,0,0,0.2)",
							}}>
							<option>Update Status</option>
							<option key='1' value='In Processing'>
								In Processing
							</option>
							<option key='2' value='Ready To Ship'>
								Ready To Ship
							</option>
							<option key='3' value='Shipped'>
								Shipped
							</option>
							<option key='4' value='Delivered'>
								Delivered
							</option>
							<option key='5' value='Cancelled'>
								Cancelled
							</option>
						</select>
					</div>
				) : null}

				{updateElement === "Customer Details" ? (
					<div className='row'>
						<div className='form-group col-md-6 '>
							<label className=''>Customer Name</label>
							<input
								onChange={(e) => {
									setUpdateCustomerDetails({
										...updateCustomerDetails,
										fullName: e.target.value,
									});
								}}
								type='text'
								className='form-control'
								value={updateCustomerDetails.fullName}
								placeholder='Update - Customer Full Name'
							/>
						</div>

						<div className='form-group col-md-6 '>
							<label className=''>Customer Phone</label>
							<input
								onChange={(e) => {
									setUpdateCustomerDetails({
										...updateCustomerDetails,
										phone: e.target.value,
									});
								}}
								type='text'
								className='form-control'
								value={updateCustomerDetails.phone}
								placeholder='Update - Customer Phone Number'
							/>
						</div>

						<div className='form-group col-md-6 '>
							<label className=''>Customer Email Address</label>
							<input
								onChange={(e) => {
									setUpdateCustomerDetails({
										...updateCustomerDetails,
										email: e.target.value,
									});
								}}
								type='text'
								className='form-control'
								value={updateCustomerDetails.email}
								placeholder='Update - Customer Email Address'
							/>
						</div>
						<div className='form-group col-md-6 '>
							<label className=''>Customer Address</label>
							<input
								onChange={(e) => {
									setUpdateCustomerDetails({
										...updateCustomerDetails,
										address: e.target.value,
									});
								}}
								type='text'
								className='form-control'
								value={updateCustomerDetails.address}
								placeholder='Update - Customer Physical Address'
							/>
						</div>
						<div className='form-group col-md-6 mx-auto '>
							<label className=''>Order Comment</label>
							<textarea
								onChange={(e) => {
									setUpdateCustomerDetails({
										...updateCustomerDetails,
										orderComment: e.target.value,
									});
								}}
								row='5'
								// type='text'
								className='form-control'
								value={updateCustomerDetails.orderComment}
								placeholder='Optional - Add Any Relatable Comment'
							/>
						</div>
					</div>
				) : null}
			</>
		);
	};

	return (
		<TrialWrapper>
			<Modal
				width='90%'
				title={
					<div
						style={{
							textAlign: "center",
							fontWeight: "bold",
							fontSize: "1.3rem",
						}}>{`Update ${updateElement}`}</div>
				}
				visible={modalVisible}
				onOk={() => {
					if (updateElement === "Customer Details") {
						setUpdateSingleOrder({
							...updateSingleOrder,
							customerDetails: updateCustomerDetails,
						});
					}

					setModalVisible(false);
					toast.success(`${updateElement} was successfully updated`);
				}}
				// okButtonProps={{ style: { display: "none" } }}
				cancelButtonProps={{ style: { display: "none" } }}
				onCancel={() => setModalVisible(false)}>
				{mainForm()}
			</Modal>
		</TrialWrapper>
	);
};

export default Trial;

const TrialWrapper = styled.div``;
