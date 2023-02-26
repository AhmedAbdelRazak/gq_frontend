/** @format */

import React from "react";
import styled from "styled-components";

const ReturnReceivingC = ({
	chosenInvoice,
	receivingSource,
	submitInvoice,
	selectedOrder,
	acceptedReturn,
	returnStatusUpdate,
	quantityToBeReceived,
	chosenProduct,
	UpdatingOrder,
	submittedSKU,
	allColors,
	submitReceivingUpdate,
	setReceiverComment,
	receiverComment,
}) => {
	return (
		<ReturnReceivingCWrapper>
			{selectedOrder && submitInvoice ? (
				<>
					<div className='row'>
						<div className='col-md-4 mt-4'>
							<div>
								INV #: <br />
								<strong> {selectedOrder && selectedOrder.invoiceNumber}</strong>
							</div>
						</div>

						<div className='col-md-4 mt-4'>
							<div>
								Tracking #: <br />{" "}
								<strong>
									{" "}
									{selectedOrder && selectedOrder.trackingNumber}
								</strong>
							</div>
						</div>

						<div className='col-md-4 mt-4'>
							<div>
								Returning Reason: <br />
								<strong>
									{" "}
									{selectedOrder && selectedOrder.reasonForReturn}
								</strong>
							</div>
						</div>

						<div className='col-md-4 mt-4'>
							<div>
								Customer Name: <br />
								<strong>
									{selectedOrder &&
										selectedOrder.customerDetails &&
										selectedOrder.customerDetails.fullName}
								</strong>
							</div>
						</div>

						<div className='col-md-4 mt-4'>
							<div>
								Customer Phone: <br />
								<strong>
									{selectedOrder &&
										selectedOrder.customerDetails &&
										selectedOrder.customerDetails.phone}
								</strong>
							</div>
						</div>

						<div className='col-md-4 mt-4'>
							<div>
								Customer Governorate: <br />
								<strong>
									{selectedOrder &&
										selectedOrder.customerDetails &&
										selectedOrder.customerDetails.state}
								</strong>
							</div>
						</div>

						<div className='col-md-4 mt-4'>
							<div>
								Order Taker: <br />
								<strong>
									{selectedOrder &&
										selectedOrder.employeeData &&
										selectedOrder.employeeData.name}
								</strong>
							</div>
						</div>

						<div className='col-md-4 mt-4'>
							<div>
								Purchase Date: <br />
								<strong>
									{selectedOrder &&
										new Date(selectedOrder.orderCreationDate).toDateString()}
								</strong>
							</div>
						</div>

						<div className='col-md-4 mt-4'>
							<div>
								Order Status: <br />
								<strong>{selectedOrder && selectedOrder.status}</strong>
							</div>
						</div>
					</div>

					<div
						className=' col-10 mx-auto'
						style={{ marginTop: "360px", textAlign: "center" }}>
						<div className='row'>
							<div className='col-6'>
								<button
									className='btn btn-success btn-block'
									style={{ fontSize: "15px" }}
									disabled={!returnStatusUpdate || !acceptedReturn}
									onClick={UpdatingOrder}>
									Receive & Change Status
								</button>
							</div>

							<div className='col-6'>
								<button
									className='btn btn-danger btn-block'
									onClick={() => {
										window.location.reload(false);
									}}>
									Cancel
								</button>
							</div>
						</div>
					</div>
					<div className='mt-4 col-6 mx-auto'>
						<button className='btn btn-info btn-block'>
							Check Receiving Log
						</button>
					</div>
				</>
			) : null}

			{receivingSource === "New Receiving Order" &&
			submittedSKU &&
			chosenProduct &&
			chosenProduct.productName ? (
				<div className='mt-4'>
					<h2 className='mb-2'>New Receiving Order</h2>
					<div className='mt-2'>
						<strong>Product Name:</strong>{" "}
						<span style={{ textTransform: "uppercase" }}>
							{chosenProduct && chosenProduct.productName}
						</span>{" "}
					</div>
					<div className='mt-2'>
						<strong>Product Description:</strong>{" "}
						<span style={{ textTransform: "uppercase" }}>
							{chosenProduct &&
								chosenProduct.description &&
								chosenProduct.description.substring(0, 45)}
							......
						</span>{" "}
					</div>

					<div className='mt-2'>
						<strong>Product Added By:</strong>{" "}
						<span style={{ textTransform: "uppercase" }}>
							{chosenProduct &&
								chosenProduct.addedByEmployee &&
								chosenProduct.addedByEmployee.name}
						</span>{" "}
					</div>
					<div className='mt-2'>
						<strong>Product Category:</strong>{" "}
						<span style={{ textTransform: "uppercase" }}>
							{chosenProduct &&
								chosenProduct.category &&
								chosenProduct.category.categoryName}
						</span>{" "}
					</div>
					<div className='mt-2'>
						<strong>Product SKU:</strong>{" "}
						<span style={{ textTransform: "uppercase" }}>
							{chosenProduct && chosenProduct.SubSKU}
						</span>{" "}
					</div>
					<div className='mt-2'>
						<strong>Product Color:</strong>{" "}
						<span style={{ textTransform: "uppercase" }}>
							{allColors[
								allColors.map((i) => i.hexa).indexOf(chosenProduct.color)
							]
								? allColors[
										allColors.map((i) => i.hexa).indexOf(chosenProduct.color)
								  ].color
								: chosenProduct.color}
						</span>{" "}
					</div>
					<div className='mt-2'>
						<strong>Product Size:</strong>{" "}
						<span style={{ textTransform: "uppercase" }}>
							{chosenProduct && chosenProduct.size}
						</span>{" "}
					</div>
					<div className='mt-2'>
						<strong>Quantity Onhand:</strong>{" "}
						{chosenProduct && chosenProduct.quantity
							? chosenProduct.quantity
							: 0}{" "}
						Items
					</div>

					<div className='mt-2'>
						<strong>Quantity To Be Received:</strong> {quantityToBeReceived}{" "}
						Items
					</div>

					<div className='mt-2'>
						<strong>After Receiving Stock Onhand:</strong>{" "}
						{(chosenProduct && chosenProduct.quantity
							? Number(chosenProduct.quantity)
							: 0) + Number(quantityToBeReceived)}{" "}
						Items
					</div>

					<div className='mt-3 mx-auto'>
						<textarea
							type='text'
							className='w-75 form-control mx-auto'
							rows={5}
							placeholder='Add Receiving Comments'
							value={receiverComment}
							onChange={(e) => setReceiverComment(e.target.value)}
						/>
					</div>
					<div
						className=' col-11 mx-auto'
						style={{ marginTop: "350px", textAlign: "center" }}>
						<div className='row'>
							<div className='col-6'>
								<button
									className='btn btn-success btn-block'
									style={{ fontSize: "15px" }}
									disabled={!returnStatusUpdate || !acceptedReturn}
									onClick={submitReceivingUpdate}>
									Receive & Change Status
								</button>
							</div>

							<div className='col-6'>
								<button
									className='btn btn-danger btn-block'
									onClick={() => {
										window.location.reload(false);
									}}>
									Cancel
								</button>
							</div>
						</div>
					</div>
					<div className='mt-4 col-6 mx-auto'>
						<button className='btn btn-info btn-block'>
							Check Receiving Log
						</button>
					</div>
				</div>
			) : null}
		</ReturnReceivingCWrapper>
	);
};

export default ReturnReceivingC;

const ReturnReceivingCWrapper = styled.span``;
