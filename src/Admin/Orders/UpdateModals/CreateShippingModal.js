/** @format */

import React from "react";
import styled from "styled-components";
import { Modal } from "antd";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
// eslint-disable-next-line
import { toast } from "react-toastify";
import { CreateShippingTN } from "../../apiAdmin";

const CreateShippingModal = ({
	modalVisible,
	setModalVisible,
	setUpdateSingleOrder,
	updateSingleOrder,
	updateCustomerDetails,
	setUpdateCustomerDetails,
	userId,
	token,
	setAramexResponse,
	allInvoices,
}) => {
	const mainForm = () => {
		console.log(updateSingleOrder, "updateSingleOrder Modal");
		return (
			<>
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
				<div className='mx-auto text-center'>
					<button
						className='btn btn-primary'
						onClick={() => {
							if (updateCustomerDetails.phone.length !== 11) {
								return toast.error(
									"Phone # is not 11 digits, Please update it.",
								);
							} else {
								setTimeout(() => {
									CreateShippingTN(
										userId,
										token,
										updateSingleOrder,
										setAramexResponse,
										allInvoices,
										updateCustomerDetails,
									);
									setModalVisible(false);
								}, 500);
							}
						}}>
						Create Shipping
					</button>
				</div>
			</>
		);
	};

	return (
		<CreateShippingModalWrapper>
			<Modal
				width='65%'
				title={
					<div
						style={{
							textAlign: "center",
							fontWeight: "bold",
							fontSize: "1.3rem",
						}}>{`Update Shipping Label`}</div>
				}
				open={modalVisible}
				// onOk={() => {
				// 	setUpdateSingleOrder({
				// 		...updateSingleOrder,
				// 		customerDetails: updateCustomerDetails,
				// 	});

				// 	setModalVisible(false);
				// }}
				okButtonProps={{ style: { display: "none" } }}
				cancelButtonProps={{ style: { display: "none" } }}
				onCancel={() => setModalVisible(false)}>
				{mainForm()}
			</Modal>
		</CreateShippingModalWrapper>
	);
};

export default CreateShippingModal;

const CreateShippingModalWrapper = styled.div``;
