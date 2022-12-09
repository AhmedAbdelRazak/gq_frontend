/** @format */

import React from "react";
import styled from "styled-components";

const FormStep3 = ({
	customerDetails,
	cart,
	total_amount,
	total_items,
	shippingFee,
}) => {
	const overAllReviewPayOnDelivery = () => {
		return (
			<div>
				<h5>Shipping Details</h5>
				<div>Name: {customerDetails.fullName}</div>
				<div>Phone #: {customerDetails.phone}</div>
				{customerDetails.email ? (
					<div>Email: {customerDetails.email}</div>
				) : null}
				<div>Governorate: {customerDetails.state}</div>
				<div>City: {customerDetails.cityName}</div>
				<div>Address: {customerDetails.address}</div>
				<div>Payment: Pay on delivery</div>
				<div>Total Purchased Items: {total_items} items </div>
				<div>Shipping Fee: {shippingFee} L.E.</div>
				<div>COD: {Number(total_amount * 0.01).toFixed(2)} L.E. (1%) </div>
				<div>Subtotal: {total_amount} L.E. </div>
				<br />
				<div>
					Total Amount Due:{" "}
					{Number(total_amount) +
						Number(shippingFee) +
						Number(Number(total_amount * 0.01).toFixed(2))}{" "}
					L.E.{" "}
				</div>
			</div>
		);
	};
	return (
		<FormStep3Wrapper>
			{customerDetails.payOnDelivery && !customerDetails.payOnline ? (
				<div>{overAllReviewPayOnDelivery()}</div>
			) : null}
		</FormStep3Wrapper>
	);
};

export default FormStep3;

const FormStep3Wrapper = styled.div`
	margin: 30px 0px;
	text-align: left;
	margin-left: 100px;

	.reviewHeader {
		display: none;
	}

	@media (max-width: 1000px) {
		margin-left: 20px;
		margin: 0px 0px;

		.textResizeMain2 {
			font-size: 0.8rem !important;
			text-shadow: 0px 0px 0px !important;
			font-weight: bold !important;
		}

		.reviewHeader {
			display: block;
			color: var(--orangePrimary);
			font-weight: bolder;
			text-align: center !important;
			margin: 0px auto !important;
		}
	}
`;
