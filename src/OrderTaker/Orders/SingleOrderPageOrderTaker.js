/** @format */

import { EditOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { isAuthenticated } from "../../auth";
import AdminMenu from "../OrderTakerMenu/OrderTakerMenu";
import Navbar from "../OrderTakerNavMenu/Navbar";
import { readSingleOrder, updateOrder } from "../apiOrderTaker";
import Trial from "./UpdateModals/Trials";

const SingleOrderPageOrderTaker = (props) => {
	const [loading, setLoading] = useState(true);
	const [modalVisible, setModalVisible] = useState(false);
	const [updateElement, setUpdateElement] = useState("");
	const [singleOrder, setSingleOrder] = useState({});
	const [updateSingleOrder, setUpdateSingleOrder] = useState({});
	const [updateCustomerDetails, setUpdateCustomerDetails] = useState({});
	const { user, token } = isAuthenticated();

	const loadSingleOrder = (orderId) => {
		setLoading(true);
		readSingleOrder(user._id, token, orderId).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setSingleOrder(data);
				setUpdateSingleOrder(data);
				setUpdateCustomerDetails(data.customerDetails);
				setLoading(false);
			}
		});
	};

	useEffect(() => {
		const orderId = props.match.params.orderId;
		loadSingleOrder(orderId);
		// eslint-disable-next-line
	}, []);

	const UpdatingOrder = (e) => {
		e.preventDefault();
		window.scrollTo({ top: 0, behavior: "smooth" });

		updateOrder(updateSingleOrder._id, user._id, token, updateSingleOrder)
			.then((response) => {
				toast.success("Payment on delivery order was successfully updated");
				setTimeout(function () {
					window.location.reload(false);
				}, 2500);
			})

			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<SingleOrderPageOrderTakerWrapper>
			<div className='grid-container'>
				<div className=''>
					<AdminMenu fromPage='OrdersHistOrderTaker' />
				</div>
				<div className='mainContent'>
					<Navbar fromPage='OrdersHistOrderTaker' />
					{loading ? (
						<div>
							<div
								style={{
									fontSize: "2rem",
									textAlign: "center",
									marginTop: "50px",
									color: "darkslategray",
									fontWeight: "bold",
								}}>
								Loading...
							</div>
						</div>
					) : (
						<div className='col-10 mx-auto'>
							<Trial
								modalVisible={modalVisible}
								setModalVisible={setModalVisible}
								updateElement={updateElement}
								updateSingleOrder={updateSingleOrder}
								setUpdateSingleOrder={setUpdateSingleOrder}
								updateCustomerDetails={updateCustomerDetails}
								setUpdateCustomerDetails={setUpdateCustomerDetails}
							/>
							<h5
								style={{
									fontWeight: "bold",
									textAlign: "center",
									marginBottom: "20px",
								}}>
								Order Status:{" "}
								{updateSingleOrder.status === "Not Processed" ||
								updateSingleOrder.status === "In Processing" ||
								updateSingleOrder.status === "Cancelled" ? (
									<span style={{ color: "darkred" }}>
										{updateSingleOrder.status}

										<span
											className='ml-2'
											style={{ cursor: "pointer" }}
											onClick={() => {
												setModalVisible(true);
												setUpdateElement("Order Status");
											}}>
											<EditOutlined />
										</span>
									</span>
								) : (
									<span style={{ color: "darkgreen" }}>
										{updateSingleOrder.status}
										<span
											className='ml-2'
											style={{ cursor: "pointer" }}
											onClick={() => {
												setModalVisible(true);
												setUpdateElement("Order Status");
											}}>
											<EditOutlined />
										</span>
									</span>
								)}
							</h5>
							<h5
								style={{
									fontWeight: "bold",
									textAlign: "center",
									marginBottom: "20px",
								}}>
								Tracking Number:{" "}
								{updateSingleOrder.trackingNumber === undefined ||
								updateSingleOrder.trackingNumber === "Not Added" ? (
									<span style={{ color: "darkred" }}>
										No Tracking Number
										<span
											className='ml-2'
											style={{ cursor: "pointer" }}
											onClick={() => {
												setModalVisible(true);
												setUpdateElement("Tracking Number");
											}}>
											<EditOutlined />
										</span>
									</span>
								) : (
									<span style={{ color: "darkgreen" }}>
										{updateSingleOrder.trackingNumber}
										<span
											className='ml-2'
											style={{ cursor: "pointer" }}
											onClick={() => {
												setModalVisible(true);
												setUpdateElement("Tracking Number");
											}}>
											<EditOutlined />
										</span>
									</span>
								)}
							</h5>
							<div style={{ fontSize: "1.25rem", fontWeight: "bolder" }}>
								Customer Details{" "}
								<span
									className='ml-2'
									style={{ cursor: "pointer" }}
									onClick={() => {
										setModalVisible(true);
										setUpdateElement("Customer Details");
									}}>
									<EditOutlined />
								</span>
							</div>
							<div className='col-md-4 mx-auto text-center'>
								<hr />
							</div>
							<div className='row'>
								<div className='col-md-6'>
									Customer Name:{" "}
									<strong style={{ color: "darkblue" }}>
										{updateSingleOrder.customerDetails.fullName}
									</strong>
								</div>
								<div className='col-md-6'>
									Customer Phone:{" "}
									<strong style={{ color: "darkblue" }}>
										{updateSingleOrder.customerDetails.phone}
									</strong>
								</div>
								<div className='col-md-6'>
									Customer Email:{" "}
									<strong style={{ color: "darkblue" }}>
										{" "}
										{updateSingleOrder.customerDetails.email}
									</strong>
								</div>

								<div className='col-md-6 mx-auto'>
									Customer Additional Comment:{" "}
									<strong style={{ color: "darkblue" }}>
										{updateSingleOrder.customerDetails.orderComment}
									</strong>
								</div>
							</div>
							<div className='col-md-4 mx-auto text-center'>
								<hr />
							</div>
							<div style={{ fontSize: "1.25rem", fontWeight: "bolder" }}>
								Shipping Details:{" "}
								{/* <span
									className='ml-2'
									style={{ cursor: "pointer" }}
									onClick={() => {
										setModalVisible(true);
										setUpdateElement("Shipping Details");
									}}>
									<EditOutlined />
								</span> */}
							</div>
							<div className='row mt-3'>
								<div className='col-md-6'>
									Carrier Name:{" "}
									<strong style={{ color: "darkblue" }}>
										{singleOrder.chosenShippingOption &&
											singleOrder.chosenShippingOption[0] &&
											singleOrder.chosenShippingOption[0].carrierName}
									</strong>
								</div>

								<div className='col-md-6'>
									<div className='mt-1'>
										Customer Address:{" "}
										<strong style={{ color: "darkblue" }}>
											{singleOrder.customerDetails.address}
										</strong>
									</div>
								</div>

								<div className='col-md-6'>
									<div className='mt-1'>
										Ship To Governorate:{" "}
										<strong style={{ color: "darkblue" }}>
											{singleOrder.customerDetails.state}
										</strong>
									</div>
								</div>

								<div className='col-md-6'>
									<div className='mt-1'>
										Ship To City:{" "}
										<strong style={{ color: "darkblue" }}>
											{singleOrder.customerDetails.cityName}
										</strong>
									</div>
								</div>

								<div className='col-md-6'>
									<div className='mt-1'>
										Ship To City Code:{" "}
										<strong style={{ color: "darkblue" }}>
											{singleOrder.customerDetails.city}
										</strong>
									</div>
								</div>

								<div className='col-md-6'>
									<div className='mt-1'>
										Shipping Price:{" "}
										<strong style={{ color: "darkblue" }}>
											{singleOrder.chosenShippingOption.length > 0 &&
												singleOrder.customerDetails.carrierName &&
												singleOrder.chosenShippingOption[0].chosenShippingData.filter(
													(ii) =>
														ii.governorate ===
														singleOrder.customerDetails.state,
												)[0].shippingPrice_Client}{" "}
											L.E.
										</strong>
									</div>
								</div>

								<div className='col-md-6 mx-auto'>
									<div className='mt-1'>
										Estimated Time For Arrival:{" "}
										<strong style={{ color: "darkblue" }}>
											{singleOrder.chosenShippingOption.length > 0 &&
												singleOrder.customerDetails.carrierName &&
												singleOrder.chosenShippingOption[0].chosenShippingData.filter(
													(ii) =>
														ii.governorate ===
														singleOrder.customerDetails.state,
												)[0].estimatedTimeForArrival}{" "}
											Day
										</strong>
									</div>
								</div>
							</div>

							<div className='col-md-4 mx-auto text-center'>
								<hr />
							</div>
							<div
								style={{
									fontSize: "1.25rem",
									fontWeight: "bolder",
									marginTop: "30px",
								}}>
								Order Details:
							</div>
							{singleOrder.productsNoVariable.length > 0 ? (
								<React.Fragment>
									<div
										className='my-3'
										style={{ fontSize: "1rem", fontWeight: "bolder" }}>
										Basic Products:
									</div>

									<div className='row'>
										{singleOrder.productsNoVariable.map((p, i) => {
											return (
												<div className='col-md-4 text-capitalize' key={i}>
													<div className='row'>
														<div className='col-md-6'>
															Product Name:{" "}
															<strong style={{ color: "darkblue" }}>
																{p.productName}
															</strong>
															<br />
															<br />
															Quantity:{" "}
															<strong style={{ color: "darkblue" }}>
																{p.orderedQuantity}{" "}
															</strong>
															{Number(p.orderedQuantity) > 1 ? "Units" : "Unit"}
														</div>

														<div className='col-md-6'>
															<img
																style={{ width: "100px" }}
																src={p.thumbnailImage[0].images[0].url}
																alt=''
															/>
														</div>
													</div>
												</div>
											);
										})}
									</div>
								</React.Fragment>
							) : null}

							{singleOrder.chosenProductQtyWithVariables.length > 0 ? (
								<>
									<div
										className='my-3'
										style={{ fontSize: "1rem", fontWeight: "bolder" }}>
										Products With Variables:
									</div>

									<div className='row'>
										{singleOrder.chosenProductQtyWithVariables.map((p, i) => {
											return (
												<React.Fragment key={i}>
													{p.map((pp, ii) => {
														return (
															<div
																className='col-md-4 text-capitalize'
																key={ii}>
																<div className='row'>
																	<div className='col-md-6'>
																		Product Name:{" "}
																		<strong
																			style={{
																				color: "darkblue",
																				textTransform: "capitalize",
																			}}>
																			{pp.productName} | {pp.SubSKU} |{" "}
																			{pp.SubSKUColor}
																		</strong>
																		<br />
																		<br />
																		Quantity:{" "}
																		<strong style={{ color: "darkblue" }}>
																			{pp.OrderedQty}{" "}
																		</strong>
																		{Number(pp.OrderedQty) > 1
																			? "Units"
																			: "Unit"}
																	</div>
																	<div className='col-md-6'>
																		<img
																			style={{ width: "100px" }}
																			src={
																				pp.productMainImage
																					? pp.productMainImage
																					: ""
																			}
																			alt=''
																		/>
																	</div>
																</div>
															</div>
														);
													})}
												</React.Fragment>
											);
										})}
									</div>
								</>
							) : null}

							<div className='col-md-4 mx-auto text-center'>
								<hr />
							</div>
							<br />
							<div style={{ fontSize: "1.25rem", fontWeight: "bolder" }}>
								Order Total Value:
							</div>

							<div className='mt-4' style={{ fontSize: "1.2rem" }}>
								Total Amount:{" "}
								{singleOrder.totalAmount !==
								singleOrder.totalAmountAfterDiscount ? (
									<>
										<strong>
											<s style={{ color: "darkred" }}>
												{singleOrder.totalAmount} L.E.
											</s>
										</strong>{" "}
										<strong style={{ color: "darkblue" }}>
											{singleOrder.totalAmountAfterDiscount} L.E.
										</strong>
									</>
								) : (
									<strong style={{ color: "darkblue" }}>
										{singleOrder.totalAmountAfterDiscount} L.E.
									</strong>
								)}
							</div>
							<div className='col-md-5 mx-auto text-center my-5'>
								<button
									className='btn btn-success btn-block mb-3 mx-auto text-center'
									onClick={UpdatingOrder}>
									Update Order
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</SingleOrderPageOrderTakerWrapper>
	);
};

export default SingleOrderPageOrderTaker;

const SingleOrderPageOrderTakerWrapper = styled.div`
	min-height: 880px;
	overflow-x: hidden;
	/* background: #ededed; */

	.grid-container {
		display: grid;
		grid-template-columns: 15.5% 84.5%;
		margin: auto;
		/* border: 1px solid red; */
		/* grid-auto-rows: minmax(60px, auto); */
	}

	.card-body {
		font-weight: bolder;
	}

	.card-body span {
		font-size: 1.5rem;
	}

	.tableData {
		overflow-x: auto;
		margin-top: auto;
		margin-bottom: auto;
		margin-right: 50px;
		margin-left: 50px;
		.table > tbody > tr > td {
			vertical-align: middle !important;
		}
		@media (max-width: 1100px) {
			font-size: 0.5rem;
			/* margin-right: 5px;
		margin-left: 5px; */
		}
	}
`;
