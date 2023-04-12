/** @format */

import { EditOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
// eslint-disable-next-line
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { isAuthenticated } from "../../auth";
import AdminMenu from "../AdminMenu/AdminMenu";
import DarkBG from "../AdminMenu/DarkBG";
import Navbar from "../AdminNavMenu/Navbar";
import {
	getColors,
	getShippingLabel,
	getTrackingDetails,
	readSingleOrder,
	updateOrder,
	updateOrderEditing,
	updateOrderExchangeAndReturn,
	updateOrderNoDecrease,
} from "../apiAdmin";
import SingleOrderPageDetails from "./SingleOrderPageDetails";
import Trial from "./UpdateModals/Trials";
import UpdateProductModal from "./UpdateModals/UpdateProductModal";

const SingleOrderPage = (props) => {
	const [loading, setLoading] = useState(true);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalVisible2, setModalVisible2] = useState(false);
	const [editProductClicked, setEditProductClicked] = useState(false);
	const [updateElement, setUpdateElement] = useState("");
	const [singleOrder, setSingleOrder] = useState({});
	const [updateSingleOrder, setUpdateSingleOrder] = useState({});
	const [oldProducts, setOldProducts] = useState([]);
	const [newProducts, setNewProducts] = useState([]);
	const [updateCustomerDetails, setUpdateCustomerDetails] = useState({});
	const [productToBeUpdated, setProductToBeUpdated] = useState("");
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [allColors, setAllColors] = useState([]);
	const [offset, setOffset] = useState(0);
	const [trackingDetails, setTrackingDetails] = useState("");
	const [pageScrolled, setPageScrolled] = useState(false);
	const [collapsed, setCollapsed] = useState(false);

	const { user, token } = isAuthenticated();

	const loadSingleOrder = (orderId) => {
		setLoading(true);
		readSingleOrder(user._id, token, orderId).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setLoading(true);

				setSingleOrder(data);
				setUpdateSingleOrder({ ...data, oldProducts: [], newProducts: [] });
				setUpdateCustomerDetails(data.customerDetails);

				if (data.trackingNumber && data.trackingNumber !== "Not Added") {
					getTrackingDetails(user._id, token, data).then((data2) => {
						if (data2.error) {
							console.log(data2.error);
						} else {
							setTrackingDetails(data2);

							var statusChangeCheck =
								data2.TrackingResults &&
								data2.TrackingResults[0] &&
								data2.TrackingResults[0].Value &&
								data2.TrackingResults[0].Value.map((i) => i.UpdateCode).indexOf(
									"SH239",
								);

							var statusChangeCheckInTransit =
								data2.TrackingResults &&
								data2.TrackingResults[0] &&
								data2.TrackingResults[0].Value &&
								data2.TrackingResults[0].Value.map((i) => i.UpdateCode).indexOf(
									"SH008",
								);

							var statusChangeCheckRejected =
								data2.TrackingResults &&
								data2.TrackingResults[0] &&
								data2.TrackingResults[0].Value &&
								data2.TrackingResults[0].Value.map((i) => i.UpdateCode).indexOf(
									"SH498",
								);

							if (
								!data.status.includes("Exchange") &&
								!data.status.includes("Exchanged") &&
								!data.status.includes("Return") &&
								!data.status.includes("Returned") &&
								statusChangeCheck > -1 &&
								data.status !== "Delivered"
							) {
								const updatedObject = { ...data, status: "Delivered" };

								updateOrder(updatedObject._id, user._id, token, updatedObject)
									.then((response) => {
										// toast.success("Payment on delivery order was successfully updated");
										setTimeout(function () {
											window.location.reload(false);
										}, 1000);
									})

									.catch((error) => {
										console.log(error);
									});
							} else if (
								!data.status.includes("Exchange") &&
								!data.status.includes("Exchanged") &&
								!data.status.includes("Return") &&
								!data.status.includes("Returned") &&
								statusChangeCheckInTransit > -1 &&
								statusChangeCheckRejected > -1 &&
								data.status !== "Delivered" &&
								data.status !== "In Transit | Rejected" &&
								data.status !== "Rejected Order | Received"
							) {
								const updatedObject = {
									...data,
									status: "In Transit | Rejected",
								};

								updateOrder(updatedObject._id, user._id, token, updatedObject)
									.then((response) => {
										// toast.success("Payment on delivery order was successfully updated");
										setTimeout(function () {
											window.location.reload(false);
										}, 1000);
									})

									.catch((error) => {
										console.log(error);
									});
							} else if (
								!data.status.includes("Exchange") &&
								!data.status.includes("Exchanged") &&
								!data.status.includes("Return") &&
								!data.status.includes("Returned") &&
								statusChangeCheckInTransit > -1 &&
								data.status !== "Delivered" &&
								data.status !== "In Transit" &&
								data.status !== "In Transit | Rejected" &&
								data.status !== "Rejected Order | Received"
							) {
								const updatedObject = { ...data, status: "In Transit" };

								updateOrder(updatedObject._id, user._id, token, updatedObject)
									.then((response) => {
										// toast.success("Payment on delivery order was successfully updated");
										setTimeout(function () {
											window.location.reload(false);
										}, 1000);
									})

									.catch((error) => {
										console.log(error);
									});
							} else {
								setLoading(false);
							}
						}
					});
				} else {
					setLoading(false);
				}

				setLoading(false);
			}
		});
	};

	// console.log(trackingDetails.TrackingResults[0].Value, "Tracking Details");

	useEffect(() => {
		const orderId = props.match.params.orderId;
		loadSingleOrder(orderId);
		// eslint-disable-next-line
	}, []);

	// console.log(trackingDetails, "trackingDetails");

	const UpdatingOrder = (e) => {
		e.preventDefault();
		window.scrollTo({ top: 0, behavior: "smooth" });

		if (updateSingleOrder.status === "Cancelled") {
			if (
				window.confirm(
					"Once Order is cancelled, The Ordered Quantity will be added BACK to your active stock, Are you sure you want to cancel?",
				)
			) {
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
			}
		} else {
			if (
				updateSingleOrder.status === "Returned and Not Refunded" ||
				updateSingleOrder.status === "Returned and Not Refunded (Partial)" ||
				updateSingleOrder.status === "Exchanged - Stocked"
			) {
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
			} else if (
				updateSingleOrder.status === "Exchange And Return Processed And Stocked"
			) {
				updateOrderExchangeAndReturn(
					updateSingleOrder._id,
					user._id,
					token,
					updateSingleOrder,
				)
					.then((response) => {
						toast.success("Payment on delivery order was successfully updated");
						setTimeout(function () {
							window.location.reload(false);
						}, 2500);
					})

					.catch((error) => {
						console.log(error);
					});
			} else {
				updateOrderNoDecrease(
					updateSingleOrder._id,
					user._id,
					token,
					updateSingleOrder,
				)
					.then((response) => {
						toast.success("Payment on delivery order was successfully updated");
						setTimeout(function () {
							window.location.reload(false);
						}, 2500);
					})

					.catch((error) => {
						console.log(error);
					});
			}
		}
	};

	const UpdatingOrderForEditing = (e) => {
		e.preventDefault();
		window.scrollTo({ top: 0, behavior: "smooth" });

		if (updateSingleOrder.chosenProductQtyWithVariables[0].length === 0) {
			return toast.info("No Products Available in this order");
		}
		updateOrderEditing(
			updateSingleOrder._id,
			user._id,
			token,
			updateSingleOrder,
		)
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

	const gettingShippingLabel = () => {
		getShippingLabel(user._id, token, updateSingleOrder).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				window.scrollTo({ top: 0, behavior: "smooth" });
				toast.info("Please Wait To Return Shipping Label");
				setTimeout(function () {
					window.open(data.ShipmentLabel.LabelURL, "_newtab");
					window.location.reload(false);
				}, 2500);
				setTimeout(function () {
					window.location.reload(false);
				}, 3500);
			}
		});
	};

	// console.log(trackingDetails, "trackingDetails");

	useEffect(() => {
		const onScroll = () => setOffset(window.pageYOffset);
		// clean up code
		window.removeEventListener("scroll", onScroll);
		window.addEventListener("scroll", onScroll, { passive: true });
		if (window.pageYOffset > 0) {
			setPageScrolled(true);
		} else {
			setPageScrolled(false);
		}
		return () => window.removeEventListener("scroll", onScroll);
	}, [offset]);

	const gettingAllColors = () => {
		getColors(token).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllColors(data);
			}
		});
	};

	useEffect(() => {
		gettingAllColors();
		// eslint-disable-next-line
	}, []);

	return (
		<SingleOrderPageWrapper show={AdminMenuStatus}>
			{!collapsed ? (
				<DarkBG collapsed={collapsed} setCollapsed={setCollapsed} />
			) : null}
			<div className='grid-container'>
				<div className=''>
					<AdminMenu
						fromPage='OrdersHist'
						AdminMenuStatus={AdminMenuStatus}
						setAdminMenuStatus={setAdminMenuStatus}
						collapsed={collapsed}
						setCollapsed={setCollapsed}
					/>
				</div>
				<div className='mainContent'>
					<Navbar fromPage='OrdersHist' pageScrolled={pageScrolled} />
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

							<UpdateProductModal
								modalVisible={modalVisible2}
								setModalVisible={setModalVisible2}
								updateSingleOrder={updateSingleOrder}
								setUpdateSingleOrder={setUpdateSingleOrder}
								updateElement={updateElement}
								setProductToBeUpdated={setProductToBeUpdated}
								productToBeUpdated={productToBeUpdated}
								singleOrder={singleOrder}
								allColors={allColors}
								oldProducts={oldProducts}
								setOldProducts={setOldProducts}
								newProducts={newProducts}
								setNewProducts={setNewProducts}
							/>
							<h5
								style={{
									fontWeight: "bold",
									textAlign: "center",
									marginBottom: "20px",
								}}>
								Order Status:{" "}
								<>
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
												{singleOrder.invoiceNumber === "Not Added" ? null : (
													<EditOutlined />
												)}
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
												{singleOrder.invoiceNumber === "Not Added" ? null : (
													<EditOutlined />
												)}
											</span>
										</span>
									)}
								</>
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

							{singleOrder.exchangedProductQtyWithVariables &&
							singleOrder.exchangedProductQtyWithVariables.length > 0 ? (
								<h5
									style={{
										fontWeight: "bold",
										textAlign: "center",
										marginBottom: "20px",
									}}>
									Tracking Number After Exchange:{" "}
									<strong style={{ color: "darkgreen" }}>
										{updateSingleOrder.exchangeTrackingNumber}
										<span
											className='ml-2'
											style={{ cursor: "pointer" }}
											onClick={() => {
												setModalVisible(true);
												setUpdateElement("Tracking Number Exchange");
											}}>
											<EditOutlined />
										</span>
									</strong>
								</h5>
							) : null}

							<h5
								style={{
									fontWeight: "bold",
									textAlign: "center",
									marginBottom: "20px",
								}}>
								Order Purchase Date:{" "}
								{updateSingleOrder.orderCreationDate === undefined ? (
									<span style={{ color: "darkgreen" }}>
										{new Date(updateSingleOrder.createdAt).toDateString()}
										<span
											className='ml-2'
											style={{ cursor: "pointer" }}
											onClick={() => {
												setModalVisible(true);
												setUpdateElement("PurchaseDate");
											}}>
											<EditOutlined />
										</span>
									</span>
								) : (
									<span style={{ color: "darkgreen" }}>
										{new Date(
											updateSingleOrder.orderCreationDate,
										).toDateString()}
										<span
											className='ml-2'
											style={{ cursor: "pointer" }}
											onClick={() => {
												setModalVisible(true);
												setUpdateElement("PurchaseDate");
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
								Order Invoice Number:{" "}
								<span
									style={{
										color:
											updateSingleOrder.invoiceNumber === "Not Added"
												? "darkred"
												: "darkgreen",
									}}>
									{updateSingleOrder.invoiceNumber}
								</span>
							</h5>
							{/* {updateSingleOrder.trackingNumber === "Not Added" ? (
								<h5
									style={{
										fontWeight: "bold",
										textAlign: "center",
										marginBottom: "20px",
									}}>
									<Link
										to={`/admin/update-miscellaneous-order/${updateSingleOrder._id}`}>
										Edit Order
										<span className='ml-2' style={{ cursor: "pointer" }}>
											<EditOutlined />
										</span>
									</Link>
								</h5>
							) : null} */}

							{updateSingleOrder.paymentStatus === "Paid Online" && (
								<h5
									style={{
										fontWeight: "bold",
										textAlign: "center",
										marginBottom: "20px",
									}}>
									Payment Status:{" "}
									<span
										style={{
											color:
												updateSingleOrder.paymentStatus === "Paid Online"
													? "darkgreen"
													: "darkgreen",
										}}>
										{updateSingleOrder.paymentStatus}
									</span>
								</h5>
							)}
							<h5
								style={{
									fontWeight: "bold",
									textAlign: "center",
									marginBottom: "20px",
								}}>
								<Link
									to={`/admin/single-order/invoice/${updateSingleOrder._id}`}>
									Display Invoice
								</Link>
							</h5>

							{updateSingleOrder &&
							updateSingleOrder.status &&
							(updateSingleOrder.status.includes("Exchange") ||
								updateSingleOrder.status.includes("Exchanged")) ? (
								<h5
									style={{
										fontWeight: "bold",
										textAlign: "center",
										marginBottom: "20px",
									}}>
									<Link
										to={`/admin/single-order/invoice2/${updateSingleOrder._id}`}>
										Display Invoice 2 (For Exchange)
									</Link>
								</h5>
							) : null}
							{updateSingleOrder &&
							updateSingleOrder.trackingNumber &&
							updateSingleOrder.trackingNumber !== "Not Added" ? (
								<h5
									style={{
										fontWeight: "bold",
										textAlign: "center",
										marginBottom: "20px",
									}}>
									<Link to={`#`} onClick={gettingShippingLabel}>
										Shipping Label
									</Link>
								</h5>
							) : null}

							{trackingDetails &&
							trackingDetails.TrackingResults &&
							trackingDetails.TrackingResults[0] &&
							trackingDetails.TrackingResults[0].Value &&
							updateSingleOrder &&
							!updateSingleOrder.status.includes("Exchange") &&
							!updateSingleOrder.status.includes("Exchanged") &&
							!updateSingleOrder.status.includes("Return") ? (
								<div className='my-5'>
									<div style={{ fontSize: "1.25rem", fontWeight: "bolder" }}>
										Aramex (Shipment) Tracking Details{" "}
									</div>

									{trackingDetails.TrackingResults[0].Value.map((v, i) => {
										// 818035920000
										// 16768497600000200
										//1676835360000
										var fomattingDate = parseInt(
											v.UpdateDateTime.replace(/[^0-9]/g, ""),
										)
											.toString()
											.slice(0, 13);

										return (
											<div
												key={i}
												className='mt-2'
												style={{ fontSize: "0.8rem" }}>
												{trackingDetails.TrackingResults[0].Value.length - i}.{" "}
												<strong>Last Update:</strong> {v.UpdateDescription} |{" "}
												<strong>Update DateTime:</strong>{" "}
												{new Date(Number(fomattingDate)).toLocaleString()} |{" "}
												{v.Comments ? (
													<strong>Comments: {v.Comments}</strong>
												) : null}
											</div>
										);
									})}
								</div>
							) : null}

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
								{updateSingleOrder &&
								updateSingleOrder.customerDetails &&
								updateSingleOrder.customerDetails.customerProfileLink ? (
									<div className='col-md-6'>
										Customer Profile Link:{" "}
										<strong style={{ color: "darkblue" }}>
											{" "}
											{updateSingleOrder.customerDetails.customerProfileLink}
										</strong>
									</div>
								) : null}

								<div className='col-md-6 mx-auto'>
									Customer Additional Comment:{" "}
									<strong style={{ color: "darkblue" }}>
										{updateSingleOrder.customerDetails.orderComment}
									</strong>
								</div>
								<div className='col-md-6 mx-auto'>
									Order Taker:{" "}
									<strong style={{ color: "darkblue" }}>
										{updateSingleOrder.employeeData.name}
									</strong>
								</div>

								{updateSingleOrder &&
								updateSingleOrder.appliedCoupon &&
								updateSingleOrder.appliedCoupon.name ? (
									<div className='col-md-6 mx-auto'>
										Applied Coupon:{" "}
										<strong style={{ color: "darkblue" }}>
											{updateSingleOrder.appliedCoupon.name}{" "}
											<span style={{ color: "green" }}>
												({updateSingleOrder.appliedCoupon.discount}% OFF)
											</span>
										</strong>
									</div>
								) : null}
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
											{singleOrder.chosenShippingOption &&
												singleOrder.chosenShippingOption.length > 0 &&
												singleOrder.customerDetails.carrierName &&
												singleOrder.chosenShippingOption[0] &&
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
											{singleOrder.chosenShippingOption &&
												singleOrder.chosenShippingOption.length > 0 &&
												singleOrder.customerDetails.carrierName &&
												singleOrder.chosenShippingOption[0] &&
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
							{singleOrder.returnedItems.length >= 0 &&
							(singleOrder.status.includes("Return") ||
								singleOrder.status.includes("Returned")) ? (
								<>
									<div
										style={{
											fontSize: "1.25rem",
											fontWeight: "bolder",
											marginTop: "30px",
										}}>
										Order Return Details:
									</div>
									<div
										className='row my-3'
										style={{ border: "lightgrey solid 2px" }}>
										<div
											className='col-md-3 mx-auto my-3'
											style={{ fontWeight: "bold" }}>
											Refund Number: {singleOrder.refundNumber}
										</div>
										<div
											className='col-md-3 mx-auto my-3'
											style={{ fontWeight: "bold" }}>
											Refund Method: {singleOrder.refundMethod}
										</div>
										<div
											className='col-md-3 mx-auto my-3'
											style={{ fontWeight: "bold" }}>
											Reason For Return: {singleOrder.reasonForReturn}
										</div>
										<div
											className='col-md-3 mx-auto my-3'
											style={{ fontWeight: "bold" }}>
											Return Date:{" "}
											{new Date(singleOrder.returnDate).toDateString()}
										</div>
									</div>
								</>
							) : null}
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
									{(updateSingleOrder.trackingNumber === "Not Added" ||
										!updateSingleOrder.trackingNumber) &&
									updateSingleOrder.invoiceNumber === "Not Added" ? (
										<h5
											style={{
												fontWeight: "bold",
												marginBottom: "20px",
												fontSize: "1rem",
											}}>
											Add Products To Order{" "}
											<strong style={{ color: "darkgreen" }}>
												<span
													className='ml-2'
													style={{ cursor: "pointer" }}
													onClick={() => {
														setModalVisible2(true);
														setUpdateElement("Add New Products To The Order");
														setEditProductClicked(true);
													}}>
													<EditOutlined />
												</span>
											</strong>
										</h5>
									) : null}

									<div className='row'>
										{updateSingleOrder.chosenProductQtyWithVariables.map(
											(p, i) => {
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
																				{allColors[
																					allColors
																						.map((i) => i.hexa)
																						.indexOf(pp.SubSKUColor)
																				]
																					? allColors[
																							allColors
																								.map((i) => i.hexa)
																								.indexOf(pp.SubSKUColor)
																					  ].color
																					: pp.SubSKUColor}
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
																			<br />
																			Price:{" "}
																			<strong style={{ color: "darkblue" }}>
																				{pp.pickedPrice}
																			</strong>{" "}
																			L.E
																		</div>

																		<div className='col-md-6'>
																			{(updateSingleOrder.trackingNumber ===
																				"Not Added" ||
																				!updateSingleOrder.trackingNumber) &&
																			updateSingleOrder.invoiceNumber ===
																				"Not Added" ? (
																				<strong
																					style={{
																						fontWeight: "bold",
																						marginBottom: "20px",
																						fontSize: "1rem",
																					}}>
																					<span
																						className='ml-2'
																						style={{ cursor: "pointer" }}
																						onClick={() => {
																							setUpdateElement(
																								`Update Product ${pp.productName} | ${pp.SubSKU}`,
																							);
																							setModalVisible2(true);
																							setProductToBeUpdated(pp);
																							setEditProductClicked(true);
																						}}>
																						<EditOutlined />
																					</span>
																				</strong>
																			) : null}
																			{pp.productSubSKUImage ? (
																				<img
																					style={{ width: "100px" }}
																					src={
																						pp.productSubSKUImage
																							? pp.productSubSKUImage
																							: ""
																					}
																					alt=''
																				/>
																			) : (
																				<img
																					style={{ width: "100px" }}
																					src={
																						pp.productMainImage
																							? pp.productMainImage
																							: ""
																					}
																					alt=''
																				/>
																			)}
																		</div>
																	</div>
																</div>
															);
														})}
													</React.Fragment>
												);
											},
										)}
									</div>
								</>
							) : null}

							{updateSingleOrder.returnedItems.length > 0 &&
							updateSingleOrder.status.includes("(Partial)") ? (
								<>
									<div
										style={{
											fontSize: "1.25rem",
											fontWeight: "bolder",
											marginTop: "30px",
										}}>
										Order Return Details:
									</div>
									<div
										className='row my-3'
										style={{ border: "lightgrey solid 2px" }}>
										<div
											className='col-md-3 mx-auto my-3'
											style={{ fontWeight: "bold" }}>
											Refund Number: {updateSingleOrder.refundNumber}
										</div>
										<div
											className='col-md-3 mx-auto my-3'
											style={{ fontWeight: "bold" }}>
											Refund Method: {updateSingleOrder.refundMethod}
										</div>
										<div
											className='col-md-3 mx-auto my-3'
											style={{ fontWeight: "bold" }}>
											Reason For Return: {updateSingleOrder.reasonForReturn}
										</div>
										<div
											className='col-md-3 mx-auto my-3'
											style={{ fontWeight: "bold" }}>
											Return Date:{" "}
											{new Date(updateSingleOrder.returnDate).toDateString()}
										</div>
									</div>

									<div className='row'>
										{updateSingleOrder.returnedItems &&
											updateSingleOrder.returnedItems.length > 0 &&
											updateSingleOrder.exchangedProductQtyWithVariables &&
											updateSingleOrder.exchangedProductQtyWithVariables
												.length === 0 &&
											updateSingleOrder.returnedItems.map((p, i) => {
												return (
													<React.Fragment key={i}>
														<div className='col-md-4 text-capitalize'>
															<div className='row'>
																<div className='col-md-6'>
																	Product Name:{" "}
																	<strong
																		style={{
																			color: "darkblue",
																			textTransform: "capitalize",
																		}}>
																		{p.productName} | {p.SubSKU} |{" "}
																		{allColors[
																			allColors
																				.map((i) => i.hexa)
																				.indexOf(p.SubSKUColor)
																		]
																			? allColors[
																					allColors
																						.map((i) => i.hexa)
																						.indexOf(p.SubSKUColor)
																			  ].color
																			: p.SubSKUColor}
																	</strong>
																	<br />
																	<br />
																	Quantity:{" "}
																	<strong style={{ color: "darkblue" }}>
																		{p.OrderedQty}{" "}
																	</strong>
																	{Number(p.OrderedQty) > 1 ? "Units" : "Unit"}
																	<br />
																	Price:{" "}
																	<strong style={{ color: "darkblue" }}>
																		{p.returnAmount}
																	</strong>{" "}
																	L.E
																</div>

																<div className='col-md-6'>
																	{p.productSubSKUImage ? (
																		<img
																			style={{ width: "100px" }}
																			src={
																				p.productSubSKUImage
																					? p.productSubSKUImage
																					: ""
																			}
																			alt=''
																		/>
																	) : (
																		<img
																			style={{ width: "100px" }}
																			src={
																				p.productMainImage
																					? p.productMainImage
																					: ""
																			}
																			alt=''
																		/>
																	)}
																</div>
															</div>
														</div>
													</React.Fragment>
												);
											})}
									</div>
								</>
							) : null}

							<div className='col-md-8 mx-auto text-center'>
								<hr />
							</div>

							{updateSingleOrder &&
							updateSingleOrder.exchangedProductQtyWithVariables &&
							updateSingleOrder.exchangedProductQtyWithVariables.length > 0 &&
							updateSingleOrder.returnedItems &&
							updateSingleOrder.returnedItems.length > 0 ? (
								<SingleOrderPageDetails
									singleOrder={singleOrder}
									updateSingleOrder={updateSingleOrder}
									allColors={allColors}
									totalExchangedAmount2={singleOrder.totalAmountAfterExchange}
									totalExchangedQty={0}
								/>
							) : null}
							{singleOrder.exchangedProductQtyWithVariables &&
							singleOrder.returnedItems &&
							singleOrder.returnedItems.length === 0 &&
							singleOrder.exchangedProductQtyWithVariables.length > 0 ? (
								<>
									<div
										className='my-3'
										style={{ fontSize: "1rem", fontWeight: "bolder" }}>
										Exchanged Products:
									</div>
									<div className='row'>
										{singleOrder.exchangedProductQtyWithVariables.map(
											(ep, iii) => {
												return (
													<div className='col-md-4 text-capitalize' key={iii}>
														<div className='row'>
															<div className='col-md-6 my-4'>
																Product Name:{" "}
																<strong
																	style={{
																		color: "darkblue",
																		textTransform: "capitalize",
																	}}>
																	{ep.exchangedProduct.productName} |{" "}
																	{ep.exchangedProduct.SubSKU} |{" "}
																	{allColors[
																		allColors
																			.map((i) => i.hexa)
																			.indexOf(ep.exchangedProduct.SubSKUColor)
																	]
																		? allColors[
																				allColors
																					.map((i) => i.hexa)
																					.indexOf(
																						ep.exchangedProduct.SubSKUColor,
																					)
																		  ].color
																		: ep.exchangedProduct.SubSKUColor}
																</strong>{" "}
																<br />
																<strong>EXCHANGED WITH: </strong>
																<br />
																<strong
																	style={{
																		color: "darkblue",
																		textTransform: "capitalize",
																	}}>
																	{ep.productName} | {ep.SubSKU} |{" "}
																	{ep.SubSKUColor}
																</strong>
																Quantity:{" "}
																<strong style={{ color: "darkblue" }}>
																	{ep.OrderedQty}{" "}
																</strong>
																{Number(ep.OrderedQty) > 1 ? "Units" : "Unit"}
																<br />
																Price:{" "}
																<strong style={{ color: "darkblue" }}>
																	{ep.pickedPrice}{" "}
																</strong>
															</div>

															<div className='col-md-6 my-4'>
																<img
																	style={{ width: "100px" }}
																	src={
																		ep.productMainImage
																			? ep.productMainImage
																			: ""
																	}
																	alt=''
																/>
															</div>
														</div>
													</div>
												);
											},
										)}
									</div>
								</>
							) : null}

							<div className='col-md-4 mx-auto text-center'>
								<hr />
							</div>
							<br />
							{singleOrder &&
							singleOrder.returnedItems &&
							singleOrder.returnedItems.length > 0 &&
							singleOrder.exchangedProductQtyWithVariables &&
							singleOrder.exchangedProductQtyWithVariables.length > 0 ? null : (
								<>
									<div style={{ fontSize: "1.25rem", fontWeight: "bolder" }}>
										Order Total Value:
									</div>

									<div className='mt-4' style={{ fontSize: "1.2rem" }}>
										Total Amount:{" "}
										{updateSingleOrder.totalAmount !==
										updateSingleOrder.totalAmountAfterDiscount ? (
											<>
												<strong>
													<s style={{ color: "darkred" }}>
														{updateSingleOrder.totalAmount} L.E.
													</s>
												</strong>{" "}
												<strong style={{ color: "darkblue" }}>
													{updateSingleOrder.totalAmountAfterDiscount} L.E.
												</strong>
											</>
										) : (
											<strong style={{ color: "darkblue" }}>
												{updateSingleOrder.totalAmountAfterDiscount} L.E.
											</strong>
										)}
									</div>
									{updateSingleOrder.returnedItems &&
									updateSingleOrder.returnedItems.length > 0 ? (
										<div className='mt-2' style={{ fontSize: "1.2rem" }}>
											<strong
												style={{ color: "red", border: "solid lightgrey 1px" }}>
												Total Amount Should Be Refunded:{" "}
												{updateSingleOrder.returnAmount} L.E.
											</strong>
											<br />
											Total Amount After Refund:{" "}
											<strong style={{ color: "darkblue" }}>
												{updateSingleOrder.returnAmount -
													updateSingleOrder.totalAmountAfterDiscount <
												0
													? updateSingleOrder.totalAmountAfterDiscount -
													  updateSingleOrder.returnAmount
													: 0}{" "}
												L.E.
											</strong>
										</div>
									) : null}

									{updateSingleOrder.exchangedProductQtyWithVariables &&
									updateSingleOrder.exchangedProductQtyWithVariables.length >
										0 ? (
										<div className='mt-2' style={{ fontSize: "1.2rem" }}>
											Total Amount After Exchange:{" "}
											<strong style={{ color: "darkblue" }}>
												{updateSingleOrder.totalAmountAfterExchange} L.E.
											</strong>
											<br />
											<strong
												style={{ color: "red", border: "solid lightgrey 1px" }}>
												Total Amount Due:{" "}
												{Number(updateSingleOrder.totalAmountAfterExchange) -
													Number(
														updateSingleOrder.totalAmountAfterDiscount,
													)}{" "}
												L.E.
											</strong>
										</div>
									) : null}
									<br />
									{updateSingleOrder.returnedItems.length > 0 &&
										updateSingleOrder.exchangedProductQtyWithVariables.length >
											0 && (
											<strong
												style={{
													color: "darkgoldenrod",
													fontSize: "1.3rem",
													fontWeight: "bolder",
												}}>
												Total Amount Due After RETURN AND EXCHANGE:{" "}
												<span
													style={{
														fontSize: "1.6rem",
													}}>
													{updateSingleOrder.totalAmountAfterExchange -
														updateSingleOrder.totalAmountAfterDiscount -
														updateSingleOrder.returnAmount}{" "}
													L.E.
												</span>
											</strong>
										)}
								</>
							)}

							{updateSingleOrder.returnedItems.length === 0 &&
							(updateSingleOrder.status.includes("Return") ||
								updateSingleOrder.status.includes("Returned")) ? (
								<div className='mt-2' style={{ fontSize: "1.2rem" }}>
									Refund Amount:{" "}
									<strong style={{ color: "darkblue" }}>
										{updateSingleOrder.returnAmount} L.E.
									</strong>
								</div>
							) : null}
							<div className='col-md-5 mx-auto text-center my-5'>
								{editProductClicked ? (
									<button
										className='btn btn-success btn-block mb-3 mx-auto text-center'
										onClick={UpdatingOrderForEditing}>
										Update Order
									</button>
								) : (
									<button
										className='btn btn-success btn-block mb-3 mx-auto text-center'
										onClick={UpdatingOrder}>
										Update Order
									</button>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</SingleOrderPageWrapper>
	);
};

export default SingleOrderPage;

const SingleOrderPageWrapper = styled.div`
	min-height: 880px;
	overflow-x: hidden;
	/* background: #ededed; */

	.grid-container {
		display: grid;
		grid-template-columns: ${(props) => (props.show ? "8% 92%" : "15% 85%")};
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

	@media (max-width: 1750px) {
		background: white;

		.grid-container {
			display: grid;
			/* grid-template-columns: 18% 82%; */
			grid-template-columns: ${(props) => (props.show ? "7% 93%" : "18% 82%")};
			margin: auto;
			/* border: 1px solid red; */
			/* grid-auto-rows: minmax(60px, auto); */
		}
	}

	@media (max-width: 1400px) {
		background: white;

		.grid-container {
			display: grid;
			grid-template-columns: 12% 88%;
			margin: auto;
			/* border: 1px solid red; */
			/* grid-auto-rows: minmax(60px, auto); */
		}
	}
`;
