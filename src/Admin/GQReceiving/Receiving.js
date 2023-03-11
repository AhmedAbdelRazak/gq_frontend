/** @format */

import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import styled from "styled-components";
import { isAuthenticated } from "../../auth";
import {
	getColors,
	getProducts,
	listOrdersProcessing,
	receiveNew,
	updateOrder,
	updateOrderExchangeAndReturn,
	updateOrderNoDecrease,
	updateProduct,
} from "../apiAdmin";
import { Select } from "antd";
import ReturnReceivingB from "./ReturnReceivingB";
import ReturnReceivingC from "./ReturnReceivingC";
import ReturnReceivingD from "./ReturnReceivingD";
import ReturnReceivingE from "./ReturnReceivingE";
import { toast } from "react-toastify";

const { Option } = Select;

const Receiving = () => {
	// eslint-disable-next-line
	const [allOrders, setAllOrders] = useState([]);
	const [returnInvoices, setReturnInvoices] = useState([]);
	const [exchangeInvoices, setExchangeInvoices] = useState([]);
	const [rejectedInvoices, setRejectedInvoices] = useState([]);
	const [receivingSource, setReceivingSource] = useState("");
	const [chosenInvoice, setChosenInvoice] = useState("");
	const [selectedOrder, setSelectedOrder] = useState("");
	const [selectedOrder2, setSelectedOrder2] = useState("");
	const [acceptedReturn, setAcceptedReturn] = useState(false);
	const [returnStatusUpdate, setReturnStatusUpdate] = useState(false);
	const [submitInvoice, setSubmitInvoice] = useState(false);

	const [allProducts, setAllProducts] = useState([]);
	const [allSubSKUs, setAllSubSKUs] = useState([]);
	const [chosenSubSKU, setChosenSubSKU] = useState("");
	const [chosenProduct, setChosenProduct] = useState("");
	const [receiverComment, setReceiverComment] = useState("");
	const [submittedSKU, setSubmittedSKU] = useState(false);
	const [quantityToBeReceived, setQuantityToBeReceived] = useState(0);
	const [inboundQuantitySubmit, setInboundQuantitySubmit] = useState(false);

	const [allColors, setAllColors] = useState([]);
	const { user, token } = isAuthenticated();

	const loadOrders = () => {
		function sortOrdersAscendingly(a, b) {
			const TotalAppointmentsA = a.invoiceNumber;
			const TotalAppointmentsB = b.invoiceNumber;
			let comparison = 0;
			if (TotalAppointmentsA < TotalAppointmentsB) {
				comparison = 1;
			} else if (TotalAppointmentsA > TotalAppointmentsB) {
				comparison = -1;
			}
			return comparison;
		}
		listOrdersProcessing(user._id, token).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				const invoicesOfReturns = data
					.filter((i) => i.status.includes("Return"))
					.map((ii) => ii && ii.invoiceNumber);

				const invoicesOfExchange = data
					.filter((i) => i.status.includes("Exchange"))
					.map((ii) => ii && ii.invoiceNumber);

				const invoicesOfReject = data
					.filter((i) => i.status === "In Transit | Rejected")
					.map((ii) => ii && ii.invoiceNumber);

				setAllOrders(data.sort(sortOrdersAscendingly));
				setReturnInvoices(invoicesOfReturns);
				setExchangeInvoices(invoicesOfExchange);
				setRejectedInvoices(invoicesOfReject);

				const chosenOrder = data.filter(
					(i) => i.invoiceNumber === chosenInvoice,
				)[0];

				if (
					chosenOrder &&
					chosenOrder.status.includes("Partial") &&
					receivingSource === "Return"
				) {
					const orderModified = {
						...chosenOrder,
						status: "Returned and Not Refunded (Partial)",
						returnedItems: [chosenOrder.returnedItems],
					};

					const orderModified2 = {
						...chosenOrder,
						status: "Returned and Not Refunded (Partial)",
						returnedItems: chosenOrder.returnedItems,
					};

					setSelectedOrder(orderModified);
					setSelectedOrder2(orderModified2);
				} else if (
					chosenOrder &&
					chosenOrder.status.includes("Return") &&
					receivingSource === "Return"
				) {
					const orderModified = {
						...chosenOrder,
						status: "Returned and Not Refunded",
					};

					setSelectedOrder(orderModified);
					setSelectedOrder2(orderModified);
				} else if (
					chosenOrder &&
					chosenOrder.status.includes("Exchange") &&
					receivingSource === "Exchange"
				) {
					const orderModified = {
						...chosenOrder,
						status: "Exchanged - Stocked",
					};

					setSelectedOrder(orderModified);
					setSelectedOrder2(orderModified);
				} else if (
					receivingSource === "Rejected" &&
					chosenOrder &&
					chosenOrder.status === "In Transit | Rejected"
				) {
					const orderModified = {
						...chosenOrder,
						status: "Rejected Order | Received",
					};

					setSelectedOrder(orderModified);
					setSelectedOrder2(orderModified);
				} else {
					setSelectedOrder(chosenOrder);
					setSelectedOrder2(chosenOrder);
				}
			}
		});
	};

	useEffect(() => {
		loadOrders();
		// eslint-disable-next-line
	}, [chosenInvoice]);

	// console.log(allOrders, "allOrders");
	// console.log(returnInvoices, "returnInvoices");
	// console.log(exchangeInvoices, "exchangeInvoices");
	// console.log(selectedOrder, "selectedOrder");
	// console.log(chosenProduct, "chosenProduct");

	const gettingAllProducts = () => {
		getProducts().then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				var allGQProducts = data.filter((i) => i.activeProduct === true);
				setAllProducts(allGQProducts);

				var allSKUs =
					allGQProducts &&
					allGQProducts.map((i) => i.productAttributes.map((ii) => ii.SubSKU));

				var mergedSubSKUs = [].concat.apply([], allSKUs);

				setAllSubSKUs(mergedSubSKUs);

				var addingVariablesToMain =
					allGQProducts &&
					allGQProducts.map((i) =>
						i.productAttributes.map((ii) => {
							return {
								...i,
								DropShippingPrice: ii.DropShippingPrice,
								MSRP: ii.MSRP,
								PK: ii.PK,
								SubSKU: ii.SubSKU,
								WholeSalePrice: ii.WholeSalePrice,
								color: ii.color,
								price: ii.price,
								priceAfterDiscount: ii.priceAfterDiscount,
								productImages: ii.productImages,
								quantity: ii.quantity,
								size: ii.size,
								receivedQuantity: ii.receivedQuantity ? ii.receivedQuantity : 0,
							};
						}),
					);

				var mergedFinalOfFinal = [].concat.apply([], addingVariablesToMain);

				let allAttributesFinalOfFinal = [
					...new Map(mergedFinalOfFinal.map((item) => [item, item])).values(),
				];

				setChosenProduct(
					chosenSubSKU &&
						allAttributesFinalOfFinal &&
						allAttributesFinalOfFinal.filter(
							(i) => i.SubSKU.toLowerCase() === chosenSubSKU.toLowerCase(),
						)[0],
				);
			}
		});
	};

	const gettingAllColors = () => {
		getColors().then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllColors(data);
			}
		});
	};

	useEffect(() => {
		gettingAllProducts();
		gettingAllColors();

		// eslint-disable-next-line
	}, [chosenSubSKU]);

	const UpdatingOrder = (e) => {
		e.preventDefault();
		window.scrollTo({ top: 0, behavior: "smooth" });

		if (
			selectedOrder2.status === "Returned and Not Refunded" ||
			selectedOrder2.status === "Returned and Not Refunded (Partial)" ||
			selectedOrder2.status === "Exchanged - Stocked"
		) {
			updateOrder(selectedOrder2._id, user._id, token, selectedOrder2)
				.then((response) => {
					toast.success("Payment on delivery order was successfully updated");

					const returnedItemsDetails =
						submitInvoice &&
						selectedOrder &&
						selectedOrder.returnedItems &&
						selectedOrder.returnedItems.length > 0 &&
						selectedOrder.customerDetails &&
						selectedOrder.customerDetails.fullName
							? selectedOrder.returnedItems.map((i) => i.map((ii) => ii))
							: null;

					var mergedReturnedItemsDetails = [].concat.apply(
						[],
						returnedItemsDetails,
					);

					const exchangedItemsDetails =
						submitInvoice &&
						selectedOrder &&
						selectedOrder.exchangedProductQtyWithVariables &&
						selectedOrder.exchangedProductQtyWithVariables.length > 0 &&
						selectedOrder.customerDetails &&
						selectedOrder.customerDetails.fullName
							? selectedOrder.exchangedProductQtyWithVariables.map(
									(i) => i.exchangedProduct,
							  )
							: null;

					mergedReturnedItemsDetails &&
						mergedReturnedItemsDetails.map((i) => {
							return receiveNew(user._id, token, {
								productName: i.productName,
								productId: i.productId,
								receivedByEmployee: user,
								storeName: "g&q",
								storeBranch: "g&q",
								receivedSKU: i.SubSKU,
								receivedQuantity: i.OrderedQty,
								receivingCase: "Return",
								PONumber: selectedOrder.invoiceNumber,
							}).then((data) => {
								if (data.error) {
									setTimeout(function () {
										// window.location.reload(false);
									}, 1000);
								} else {
									toast.success("Successfully Added To Your Receiving Log");
								}
							});
						});

					exchangedItemsDetails &&
						exchangedItemsDetails.length > 0 &&
						exchangedItemsDetails.map((i) => {
							return receiveNew(user._id, token, {
								productName: i.productName,
								productId: i.productId,
								receivedByEmployee: user,
								storeName: "g&q",
								storeBranch: "g&q",
								receivedSKU: i.SubSKU,
								receivedQuantity: i.OrderedQty,
								receivingCase: "Exchange",
								PONumber: selectedOrder.invoiceNumber,
							}).then((data) => {
								if (data.error) {
									setTimeout(function () {
										// window.location.reload(false);
									}, 1000);
								} else {
									toast.success("Successfully Added To Your Receiving Log");
								}
							});
						});

					setTimeout(function () {
						window.location.reload(false);
					}, 3000);
				})

				.catch((error) => {
					console.log(error);
				});
		} else if (selectedOrder2.status === "Rejected Order | Received") {
			updateOrder(selectedOrder2._id, user._id, token, selectedOrder2)
				.then((response) => {
					toast.success("Order was successfully updated");

					const chosenProductQtyWithVariables =
						submitInvoice &&
						selectedOrder &&
						selectedOrder.chosenProductQtyWithVariables &&
						selectedOrder.chosenProductQtyWithVariables.length > 0 &&
						selectedOrder.customerDetails &&
						selectedOrder.customerDetails.fullName
							? selectedOrder.chosenProductQtyWithVariables.map((i) =>
									i.map((ii) => ii),
							  )
							: null;

					var mergedchosenProductQtyWithVariables = [].concat.apply(
						[],
						chosenProductQtyWithVariables,
					);

					mergedchosenProductQtyWithVariables &&
						mergedchosenProductQtyWithVariables.map((i) => {
							return receiveNew(user._id, token, {
								productName: i.productName,
								productId: i.productId,
								receivedByEmployee: user,
								storeName: "g&q",
								storeBranch: "g&q",
								receivedSKU: i.SubSKU,
								receivedQuantity: i.OrderedQty,
								receivingCase: "Rejected Order | Received",
								PONumber: selectedOrder.invoiceNumber,
							}).then((data) => {
								if (data.error) {
									setTimeout(function () {
										// window.location.reload(false);
									}, 1000);
								} else {
									toast.success("Successfully Added To Your Receiving Log");
								}
							});
						});

					setTimeout(function () {
						window.location.reload(false);
					}, 3000);
				})

				.catch((error) => {
					console.log(error);
				});
		} else if (
			selectedOrder.status === "Exchange And Return Processed And Stocked"
		) {
			updateOrderExchangeAndReturn(
				selectedOrder._id,
				user._id,
				token,
				selectedOrder,
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
			updateOrderNoDecrease(selectedOrder._id, user._id, token, selectedOrder)
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
	};

	var updatedProductAttributesFinal =
		chosenProduct &&
		chosenProduct.productAttributes.map((i) =>
			i.SubSKU === chosenProduct.SubSKU
				? {
						...i,
						quantity: Number(i.quantity) + Number(quantityToBeReceived),
				  }
				: i,
		);

	const submitReceivingUpdate = (e) => {
		window.scrollTo({ top: 0, behavior: "smooth" });

		const values = {
			productName: chosenProduct.productName,
			productName_Arabic: chosenProduct.productName_Arabic,
			productSKU: chosenProduct.productSKU,
			slug: chosenProduct.slug,
			slug_Arabic: chosenProduct.slug_Arabic,
			description: chosenProduct.description,
			description_Arabic: chosenProduct.description_Arabic,
			price: chosenProduct.addVariables ? 0 : chosenProduct.price,
			priceAfterDiscount: chosenProduct.addVariables
				? 0
				: chosenProduct.priceAfterDiscount,
			MSRPPriceBasic: chosenProduct.addVariables
				? 0
				: Number(chosenProduct.MSRPPriceBasic),
			price_unit: "LE",
			loyaltyPoints: 10,
			category: chosenProduct.category._id,
			viewsCount: chosenProduct.viewsCount,
			subcategory: chosenProduct.subcategory.map((i) => i._id),
			gender: chosenProduct.gender._id,
			addedByEmployee: chosenProduct.addedByEmployee._id,
			updatedByEmployee: user._id,
			quantity: chosenProduct.addVariables ? 0 : chosenProduct.stock,
			thumbnailImage: chosenProduct.thumbnailImage,
			relatedProducts:
				chosenProduct.relatedProducts &&
				chosenProduct.relatedProducts.length > 0
					? chosenProduct.relatedProducts.map((i) => i._id)
					: [],
			shipping: chosenProduct.shipping,
			addVariables: chosenProduct.addVariables,
			storeName: chosenProduct.storeName._id,
			clearance: chosenProduct.clearance,
			productAttributes:
				updatedProductAttributesFinal.length > 0
					? updatedProductAttributesFinal
					: chosenProduct.productAttributes,
			activeProduct: chosenProduct.activeProduct,
			chosenSeason: chosenProduct.chosenSeason,
			featuredProduct: chosenProduct.featured,
			activeBackorder: chosenProduct.activeBackorder,
			policy: chosenProduct.policy ? chosenProduct.policy : "",
			policy_Arabic: chosenProduct.policy_Arabic
				? chosenProduct.policy_Arabic
				: "",
			DNA: chosenProduct.DNA ? chosenProduct.DNA : "",
			DNA_Arabic: chosenProduct.DNA_Arabic ? chosenProduct.DNA_Arabic : "",
			Specs: chosenProduct.Specs ? chosenProduct.Specs : "",
			Specs_Arabic: chosenProduct.Specs_Arabic
				? chosenProduct.Specs_Arabic
				: "",
			fitCare: chosenProduct.fitCare ? chosenProduct.fitCare : "",
			fitCare_Arabic: chosenProduct.fitCare_Arabic
				? chosenProduct.fitCare_Arabic
				: "",
			sizeChart: chosenProduct.sizeChart ? chosenProduct.sizeChart : {},
		};

		// console.log(values, "inside Function");

		updateProduct(chosenProduct._id, user._id, token, {
			product: values,
		}).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				toast.success("Receiving Was Successfully Processed");
				setTimeout(function () {
					window.location.reload(false);
				}, 3000);
			}
		});

		receiveNew(user._id, token, {
			productName: chosenProduct.productName,
			productId: chosenProduct._id,
			receivedByEmployee: user,
			storeName: "g&q",
			storeBranch: "g&q",
			receivedSKU: chosenSubSKU,
			receivedQuantity: quantityToBeReceived,
			receivingCase: "New",
			PONumber: Math.floor(Math.random() * 100000000000),
			receiverComment: receiverComment,
		}).then((data) => {
			if (data.error) {
				setTimeout(function () {
					// window.location.reload(false);
				}, 1000);
			} else {
				toast.success("Successfully Added To Your Receiving Log");
			}
		});
	};

	return (
		<ReceivingWrapper>
			{user.userRole !== "Admin Account" && user.userRole !== "Stock Keeper" ? (
				<Redirect to='/admin/create-new-order' />
			) : null}
			{user && user.userRole === "Admin Account" ? (
				<div
					style={{
						fontSize: "1.3rem",
						fontWeight: "bold",
						textDecoration: "underline",
						color: "lightgray",
						textAlign: "center",
						marginTop: "20px",
					}}>
					<Link to='/admin/dashboard'>Back to dashboard</Link>
				</div>
			) : null}
			{user && user.userRole === "Stock Keeper" ? (
				<div
					style={{
						fontSize: "1.3rem",
						fontWeight: "bold",
						textDecoration: "underline",
						color: "lightgray",
						textAlign: "center",
						marginTop: "20px",
					}}>
					<Link to='/admin/update-product'>Check Stock Report</Link>
				</div>
			) : null}
			<div className='grid-container'>
				<div className='box a'>
					<h2>Receiving Source</h2>

					<div>
						Receive From:
						<br />
						<select
							className='form-control'
							style={{ fontSize: "14px" }}
							onChange={(e) => setReceivingSource(e.target.value)}>
							<option value=''>Please Select</option>
							<option value='Return'>
								Return ({returnInvoices && returnInvoices.length} Orders){" "}
							</option>
							<option value='Exchange'>
								Exchange ({exchangeInvoices && exchangeInvoices.length} Orders)
							</option>
							<option value='Rejected'>
								Rejected ({rejectedInvoices && rejectedInvoices.length} Orders)
							</option>
							<option value='New Receiving Order'>New Receiving Order</option>
						</select>
						{receivingSource === "Return" ||
						receivingSource === "Exchange" ||
						receivingSource === "Rejected" ? (
							<div className='mt-4'>
								{receivingSource === "Return" ? (
									<Select
										style={{
											color: "black",
											textTransform: "uppercase",
											width: "100%",
										}}
										showSearch
										placeholder={`Search For A Return Invoice`}
										value={chosenInvoice ? chosenInvoice : null}
										allowClear
										onChange={(value) => {
											setChosenInvoice(value);
										}}>
										{returnInvoices &&
											returnInvoices.map((invoice, i) => {
												return (
													<Option
														key={i}
														value={invoice}
														style={{ textTransform: "uppercase" }}>
														{invoice}
													</Option>
												);
											})}
									</Select>
								) : receivingSource === "Rejected" ? (
									<Select
										style={{
											color: "black",
											textTransform: "uppercase",
											width: "100%",
										}}
										showSearch
										placeholder={`Search For A Rejected Invoice`}
										value={chosenInvoice ? chosenInvoice : null}
										allowClear
										onChange={(value) => {
											setChosenInvoice(value);
										}}>
										{rejectedInvoices &&
											rejectedInvoices.map((invoice, i) => {
												return (
													<Option
														key={i}
														value={invoice}
														style={{ textTransform: "uppercase" }}>
														{invoice}
													</Option>
												);
											})}
									</Select>
								) : (
									<Select
										style={{
											color: "black",
											textTransform: "uppercase",
											width: "100%",
										}}
										showSearch
										placeholder={`Search For An Exchange Invoice`}
										value={chosenInvoice ? chosenInvoice : null}
										allowClear
										onChange={(value) => {
											setChosenInvoice(value);
										}}>
										{exchangeInvoices &&
											exchangeInvoices.map((invoice, i) => {
												return (
													<Option
														key={i}
														value={invoice}
														style={{ textTransform: "uppercase" }}>
														{invoice}
													</Option>
												);
											})}
									</Select>
								)}

								{receivingSource === "Return" ||
								receivingSource === "Exchange" ||
								receivingSource === "Rejected" ? (
									<div className='mt-4 text-center'>
										<button
											className='btn btn-info'
											onClick={() => setSubmitInvoice(true)}>
											Submit Invoice #
										</button>
									</div>
								) : null}
							</div>
						) : null}
						{receivingSource === "New Receiving Order" ? (
							<div className='mt-4'>
								{allProducts &&
									allProducts.length > 0 &&
									allSubSKUs &&
									allSubSKUs.length > 0 && (
										<div className='form-group mx-auto'>
											<label>Pick a SKU</label>
											<br />
											<Select
												style={{
													color: "black",
													textTransform: "capitalize",
													width: "100%",
												}}
												showSearch
												placeholder='Search to Select A SKU'
												value={chosenSubSKU ? chosenSubSKU : null}
												allowClear
												onChange={(value) => {
													setChosenSubSKU(value);
												}}>
												{allSubSKUs &&
													allSubSKUs.map((subsku, i) => {
														return (
															<Option
																key={i}
																value={subsku}
																style={{ textTransform: "uppercase" }}>
																{subsku}
															</Option>
														);
													})}
											</Select>
										</div>
									)}

								{chosenSubSKU && allSubSKUs.indexOf(chosenSubSKU) > -1 ? (
									<button
										className='btn btn-primary p-1 mt-3'
										onClick={() => setSubmittedSKU(true)}>
										Submit SKU
									</button>
								) : null}
							</div>
						) : null}
					</div>
				</div>
				<div className=' b'>
					<h1 className='' style={{ marginBottom: "50px" }}>
						Stock Receiving
					</h1>

					<ReturnReceivingB
						receivingSource={receivingSource}
						submitInvoice={submitInvoice}
						selectedOrder={selectedOrder}
						acceptedReturn={acceptedReturn}
						returnStatusUpdate={returnStatusUpdate}
						chosenProduct={chosenProduct}
						submittedSKU={submittedSKU}
					/>
				</div>
				<div className='box c'>
					<h2>
						Receiving Details{" "}
						{!submitInvoice && !submittedSKU ? (
							<span style={{ fontSize: "14px" }}>
								(Please Choose A Receiving Source...)
							</span>
						) : null}
					</h2>

					<ReturnReceivingC
						receivingSource={receivingSource}
						submitInvoice={submitInvoice}
						selectedOrder={selectedOrder}
						acceptedReturn={acceptedReturn}
						returnStatusUpdate={returnStatusUpdate}
						UpdatingOrder={UpdatingOrder}
						chosenProduct={chosenProduct}
						submittedSKU={submittedSKU}
						quantityToBeReceived={quantityToBeReceived}
						inboundQuantitySubmit={inboundQuantitySubmit}
						allColors={allColors}
						submitReceivingUpdate={submitReceivingUpdate}
						receiverComment={receiverComment}
						setReceiverComment={setReceiverComment}
					/>
				</div>
				<div className='box d'>
					<h2>Items Review</h2>

					<ReturnReceivingD
						receivingSource={receivingSource}
						submitInvoice={submitInvoice}
						selectedOrder={selectedOrder}
						acceptedReturn={acceptedReturn}
						returnStatusUpdate={returnStatusUpdate}
						setAcceptedReturn={setAcceptedReturn}
						allColors={allColors}
						chosenProduct={chosenProduct}
						submittedSKU={submittedSKU}
						quantityToBeReceived={quantityToBeReceived}
						setQuantityToBeReceived={setQuantityToBeReceived}
						setInboundQuantitySubmit={setInboundQuantitySubmit}
						inboundQuantitySubmit={inboundQuantitySubmit}
					/>
				</div>
				<div className='box e'>
					<h2>Items Received In Stock</h2>
					<ReturnReceivingE
						receivingSource={receivingSource}
						submitInvoice={submitInvoice}
						selectedOrder={selectedOrder}
						acceptedReturn={acceptedReturn}
						returnStatusUpdate={returnStatusUpdate}
						setReturnStatusUpdate={setReturnStatusUpdate}
						allProducts={allProducts}
						chosenProduct={chosenProduct}
						submittedSKU={submittedSKU}
						quantityToBeReceived={quantityToBeReceived}
						setQuantityToBeReceived={setQuantityToBeReceived}
						setInboundQuantitySubmit={setInboundQuantitySubmit}
						inboundQuantitySubmit={inboundQuantitySubmit}
					/>
				</div>
			</div>
		</ReceivingWrapper>
	);
};

export default Receiving;

const ReceivingWrapper = styled.div`
	min-height: 870px;
	margin: auto 50px;

	.grid-container {
		display: grid;
		grid-gap: 20px;
		grid-template-columns: 28%;
		color: #444;
		padding: 20px;
		margin-top: 30px;
	}

	.box {
		background-color: #fff;
		border-radius: 5px;
		padding: 20px;
	}

	.a {
		grid-column: 1;
		grid-row: 1 / span 20;
	}
	.b {
		grid-column: 2;
		grid-row: 1 / span 20;
	}

	.c {
		grid-column: 3;
		grid-row: 1 / span 35;
	}

	.d {
		grid-column: 1;
		grid-row: 21 / span 15;
	}

	.e {
		grid-column: 2;
		grid-row: 21 / span 15;
	}

	h2 {
		font-size: 1.15rem;
		font-weight: bolder;
		text-align: center;
		text-transform: uppercase;
	}

	h1 {
		font-size: 1.65rem;
		font-weight: bolder;
		text-align: center;
		text-transform: uppercase;
	}
`;
