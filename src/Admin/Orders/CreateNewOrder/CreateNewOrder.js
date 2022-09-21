/** @format */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import AdminMenu from "../../AdminMenu/AdminMenu";
import { Select } from "antd";
import { createOrder, getProducts, getShippingOptions } from "../../apiAdmin";
import { ShipToData } from "../ShippingOptions/ShipToData";
import { isAuthenticated } from "../../../auth";
import { toast } from "react-toastify";
import Navbar from "../../AdminNavMenu/Navbar";
const { Option } = Select;

const isActive = (clickedLink, sureClickedLink) => {
	if (clickedLink === sureClickedLink) {
		return {
			// color: "white !important",
			background: "#dbeeff",
			fontWeight: "bold",
			padding: "10px 2px",
			borderRadius: "5px",
			// textDecoration: "underline",
		};
	} else {
		return { color: "black", fontWeight: "bold" };
	}
};

const CreateNewOrder = () => {
	const [clickedLink, setClickedLink] = useState("ChooseProducts");
	const [allProducts, setAllProducts] = useState([]);
	const [q, setQ] = useState("");
	const [addedProductsToCart, setAddedProductToCart] = useState([]);
	const [chosenProductVariables, setChosenProductVariables] = useState([]);
	const [chosenProductQty, setChosenProductQty] = useState([]);
	const [chosenShippingOption, setChosenShippingOption] = useState({});
	const [allShippingOptions, setAllShippingOptions] = useState({});
	const [orderTakerDiscount, setOrderTakerDiscount] = useState(0);
	const [orderSource, setOrderSource] = useState("");

	const [customerDetails, setCustomerDetails] = useState({
		fullName: "",
		phone: "",
		address: "",
		email: "",
		state: "",
		city: "Unavailable",
		cityName: "Unavailable",
		carrierName: "No Shipping Carrier",
		orderComment: "",
	});

	// eslint-disable-next-line
	const [allOrderData, setAllOrderData] = useState({});

	// eslint-disable-next-line
	const { user, token } = isAuthenticated();

	const handleChange = (name) => (e) => {
		const value = e.target.value;
		setCustomerDetails({ ...customerDetails, [name]: value });
	};

	const gettingAllProducts = () => {
		getProducts().then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllProducts(
					data.map((i) => {
						return {
							...i,
							orderedQuantity: 1,
						};
					}),
				);
			}
		});
	};

	const gettingAllShippingOptions = () => {
		getShippingOptions(token).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllShippingOptions(data);
			}
		});
	};

	useEffect(() => {
		gettingAllProducts();
		gettingAllShippingOptions();
		// eslint-disable-next-line
	}, []);

	function search(orders) {
		return orders.filter((row) => {
			return (
				row.productName.toLowerCase().indexOf(q) > -1 ||
				row.productName_Arabic.toLowerCase().indexOf(q) > -1 ||
				row.productSKU.toLowerCase().indexOf(q) > -1
			);
		});
	}

	const PickingUpProducts = () => {
		return (
			<React.Fragment>
				<div className=' mb-3 form-group mx-3 text-center'>
					<label
						className='mt-3 mx-3'
						style={{
							fontWeight: "bold",
							fontSize: "1.05rem",
							color: "black",
							borderRadius: "20px",
						}}>
						Search
					</label>
					<input
						className='p-2 my-5 '
						type='text'
						value={q}
						onChange={(e) => setQ(e.target.value.toLowerCase())}
						placeholder='Search By Product Name Or SKU'
						style={{
							borderRadius: "20px",
							width: "50%",
							border: "1px lightgrey solid",
						}}
					/>
				</div>
				<ul className='list-group col-md-10 mx-auto'>
					{allProducts &&
						allProducts[0] &&
						search(allProducts).map((e, i) => (
							<>
								{addedProductsToCart.map((i) => i._id).indexOf(e._id) === -1 ? (
									<Link
										key={i}
										to='#'
										onClick={() => {
											setAddedProductToCart([...addedProductsToCart, e]);
										}}>
										<div className='row mb-2'>
											<li
												className='list-group-item d-flex justify-content-between align-items-center col-md-9 text-capitalize'
												style={{ fontSize: "0.85rem" }}>
												<strong>
													{e.productName} (SKU: {e.productSKU}){" "}
												</strong>{" "}
											</li>
											<li
												className='list-group-item d-flex justify-content-between align-items-center col-md-3'
												style={{
													fontSize: "0.7rem",
													color: "darkgreen",
													fontWeight: "bold",
												}}>
												<span>
													<strong>Add To Order</strong>
													<img
														width='30%'
														height='20%'
														style={{ marginLeft: "10px" }}
														src={
															e.thumbnailImage[0].images[0]
																? e.thumbnailImage[0].images[0].url
																: null
														}
														alt={e.productName}
													/>
												</span>
											</li>
										</div>
									</Link>
								) : (
									<Link
										key={i}
										to='#'
										onClick={() => {
											const index = addedProductsToCart
												.map((i) => i._id)
												.indexOf(e._id);

											if (index > -1) {
												// only splice array when item is found
												setAddedProductToCart(
													addedProductsToCart.filter(
														(ppp) => ppp._id !== addedProductsToCart[index]._id,
													),
												);
											}
										}}>
										<div className='row mb-2'>
											<li
												className='list-group-item d-flex justify-content-between align-items-center col-md-9 text-capitalize'
												style={{ fontSize: "0.85rem" }}>
												<strong>
													{e.productName} (SKU: {e.productSKU}){" "}
												</strong>{" "}
											</li>
											<li
												className='list-group-item d-flex justify-content-between align-items-center col-md-3'
												style={{
													fontSize: "0.7rem",
													color: "darkred",
													fontWeight: "bold",
												}}>
												<span>
													<strong>Remove From Order</strong>
													<img
														width='30%'
														height='20%'
														style={{ marginLeft: "10px" }}
														src={
															e.thumbnailImage[0].images[0]
																? e.thumbnailImage[0].images[0].url
																: null
														}
														alt={e.productName}
													/>
												</span>
											</li>
										</div>
									</Link>
								)}
							</>
						))}
				</ul>
			</React.Fragment>
		);
	};

	const availableVariables = () => {
		let allAddedVariables =
			addedProductsToCart && addedProductsToCart.map((i) => i.addVariables);
		return allAddedVariables.indexOf(true) > -1;
	};

	const productsWithVariables =
		addedProductsToCart &&
		addedProductsToCart.filter((i) => i.addVariables === true);

	const productsWithNoVariables =
		addedProductsToCart &&
		addedProductsToCart.filter((i) => i.addVariables === false);

	const productNameWithAttributes =
		productsWithVariables &&
		productsWithVariables.length > 0 &&
		productsWithVariables.map((i) => {
			return {
				productName: i.productName,
				productId: i._id,
				productAttributes: i.productAttributes,
			};
		});

	// console.log(productNameWithAttributes, "productNameWithAttributes");

	useEffect(() => {
		setChosenProductQty(
			chosenProductVariables.map((i) => {
				return i.SubSKU.map((ii) => {
					return {
						SubSKU: ii,
						OrderedQty: 1,
						productId: i.productId,
						productName: i.productName,
						productMainImage: addedProductsToCart.filter(
							(s) => s._id === i.productId,
						)[0].thumbnailImage[0].images[0].url,

						SubSKUPriceAfterDiscount: addedProductsToCart
							.filter((s) => s._id === i.productId)[0]
							.productAttributes.filter((ss) => ss.SubSKU === ii)[0]
							.priceAfterDiscount,

						quantity: addedProductsToCart
							.filter((s) => s._id === i.productId)[0]
							.productAttributes.filter((ss) => ss.SubSKU === ii)[0].quantity,

						SubSKUColor: addedProductsToCart
							.filter((s) => s._id === i.productId)[0]
							.productAttributes.filter((ss) => ss.SubSKU === ii)[0].color,

						SubSKUSize: addedProductsToCart
							.filter((s) => s._id === i.productId)[0]
							.productAttributes.filter((ss) => ss.SubSKU === ii)[0].size,

						SubSKUMSRP: addedProductsToCart
							.filter((s) => s._id === i.productId)[0]
							.productAttributes.filter((ss) => ss.SubSKU === ii)[0].MSRP,
					};
				});
			}),
		);
		// eslint-disable-next-line
	}, [chosenProductVariables]);

	const sizesAndColorsOptions = () => {
		return (
			<>
				{productNameWithAttributes ? (
					<React.Fragment>
						{productNameWithAttributes.map((p, i) => {
							return (
								<div className='form-group text-capitalize  col-md-8' key={i}>
									<label>Product ({p.productName}) SKU's</label>

									<Select
										mode='multiple'
										style={{ width: "100%", textTransform: "capitalize" }}
										placeholder='Please Select Order Colors'
										value={
											chosenProductVariables.length ===
											productNameWithAttributes.length
												? chosenProductVariables[i].SubSKU
												: chosenProductVariables.SubSKU
										}
										onChange={(value) => {
											//
											const index = chosenProductVariables.findIndex(
												(object) => {
													return object.productId === p.productId;
												},
											);

											if (index !== -1) {
												const newArr = chosenProductVariables.map((obj) => {
													if (obj.productId === p.productId) {
														return { ...obj, SubSKU: value };
													}

													return obj;
												});

												setChosenProductVariables(newArr);
											} else {
												setChosenProductVariables([
													...chosenProductVariables,
													{
														SubSKU: value,
														productName: p.productName,
														productId: p.productId,
													},
												]);
											}
										}}>
										{p.productAttributes.map((att, ii) => {
											return (
												<Option value={att.SubSKU} key={ii}>
													{att.SubSKU}
													{" | "} {att.color}
													{" | "}
													{att.size}
													{" | "}
													<strong>Available Stock: {att.quantity}</strong>
												</Option>
											);
										})}
									</Select>
								</div>
							);
						})}
					</React.Fragment>
				) : null}
			</>
		);
	};

	const addingOrderQuantity = () => {
		return (
			<>
				{chosenProductQty &&
					chosenProductVariables &&
					chosenProductQty.map((p, i) => {
						return (
							<div key={i}>
								{p.map((pp, ii) => {
									let requiredAttributes = productNameWithAttributes.filter(
										(x) => x.productId === pp.productId,
									)[0];
									let AvailableStock =
										requiredAttributes.productAttributes.filter(
											(xx) => xx.SubSKU === pp.SubSKU,
										)[0];
									return (
										<div key={{ ii }} className='my-3 text-capitalize'>
											<label
												className='text-muted'
												style={{ fontWeight: "bold", fontSize: "15px" }}>
												{pp.productName} | {pp.SubSKU} | Available Stock:{" "}
												{AvailableStock.quantity} Units | Price:{" "}
												{pp.SubSKUPriceAfterDiscount} | Total Amount:{" "}
												{Number(pp.OrderedQty) *
													Number(pp.SubSKUPriceAfterDiscount)}
												<br />
												<input
													value={pp.OrderedQty}
													type='number'
													style={{
														border: "1px lightgrey solid",
														width: "100%",
													}}
													max={Number(AvailableStock.quantity)}
													onChange={(e) => {
														const index = chosenProductQty[i].findIndex(
															(object) => {
																return (
																	object.productId === pp.productId &&
																	object.SubSKU === pp.SubSKU
																);
															},
														);

														if (index !== -1) {
															chosenProductQty[i][index].OrderedQty =
																e.target.value;
															setChosenProductQty([...chosenProductQty]);
														}
													}}
												/>
											</label>
										</div>
									);
								})}
							</div>
						);
					})}

				{productsWithNoVariables &&
					productsWithNoVariables.length > 0 &&
					productsWithNoVariables.map((p, i) => {
						return (
							<React.Fragment key={i}>
								<div key={i} className='my-3 text-capitalize'>
									<label
										className='text-muted'
										style={{
											fontWeight: "bold",
											fontSize: "15px",
											width: "100%",
										}}>
										{p.productName} | {p.productSKU} | Available Stock:{" "}
										{p.quantity} | Price: {p.priceAfterDiscount} | Total Amount:{" "}
										{Number(p.orderedQuantity) * Number(p.priceAfterDiscount)}
										<br />
										<input
											value={p.orderedQuantity}
											style={{
												border: "1px lightgrey solid",
												width: "34%",
											}}
											onChange={(e) => {
												const index = addedProductsToCart.findIndex(
													(object) => {
														return object._id === p._id;
													},
												);

												if (index !== -1) {
													addedProductsToCart[index].orderedQuantity =
														e.target.value;
													setAddedProductToCart([...addedProductsToCart]);
												}
											}}
										/>
									</label>
								</div>
							</React.Fragment>
						);
					})}
			</>
		);
	};

	function sum_array(arr) {
		// store our final answer
		var sum = 0;

		// loop through entire array
		for (var i = 0; i < arr.length; i++) {
			// loop through each inner array
			for (var j = 0; j < arr[i].length; j++) {
				// add this number to the current final sum
				sum += arr[i][j];
			}
		}

		return sum;
	}

	const allAddedQty = () => {
		var QtyNoVariables =
			productsWithNoVariables &&
			productsWithNoVariables
				.map((iii) => Number(iii.orderedQuantity))
				.reduce((a, b) => a + b, 0);

		var QtyWithVariables = chosenProductQty.map((iii) =>
			iii.map((iiii) => Number(iiii.OrderedQty)),
		);

		return Number(QtyNoVariables) + Number(sum_array(QtyWithVariables));
	};

	let getGov = ShipToData.map((i) => i.GovernorateEn);

	let UniqueGovernorates = [...new Set(getGov)];

	const handleChangeState = (e) => {
		setCustomerDetails({ ...customerDetails, state: e.target.value });
		setAllShippingOptions(
			allShippingOptions.filter(
				(i) =>
					i.chosenShippingData
						.map((iii) => iii.governorate)
						.indexOf(e.target.value) > -1,
			),
		);
	};

	let chosenCity = customerDetails.state
		? ShipToData.filter((i) => i.GovernorateEn === customerDetails.state)
		: [];

	let chosenCityCode = customerDetails.cityName
		? ShipToData.filter((i) => i.City.AreaEn === customerDetails.cityName)[0]
		: [];

	console.log(chosenCityCode, "chosenCity");

	const handleChangeCity = (e) => {
		setCustomerDetails({
			...customerDetails,
			cityName: e.target.value,
			city: ShipToData.filter((i) => i.City.AreaEn === e.target.value)[0]
				.LoctionCode,
		});
	};

	const handleChangeCarrier = (e) => {
		setCustomerDetails({ ...customerDetails, carrierName: e.target.value });

		setChosenShippingOption(
			allShippingOptions.filter((i) => i.carrierName === e.target.value),
		);
	};

	const customerDetailsForm = () => {
		return (
			<React.Fragment>
				<h5 className='mb-4'>Customer Details</h5>
				<div className='row'>
					<div className='form-group col-md-6 '>
						<label className=''>Customer Name</label>
						<input
							onChange={handleChange("fullName")}
							type='text'
							className='form-control'
							value={customerDetails.fullName}
							placeholder='Required - Customer Full Name'
						/>
					</div>

					<div className='form-group col-md-6 '>
						<label className=''>Customer Phone</label>
						<input
							onChange={handleChange("phone")}
							type='text'
							className='form-control'
							value={customerDetails.phone}
							placeholder='Required - Customer Phone Number'
						/>
					</div>

					<div className='form-group col-md-6 '>
						<label className=''>Customer Email Address</label>
						<input
							onChange={handleChange("email")}
							type='text'
							className='form-control'
							value={customerDetails.email}
							placeholder='Optional - Customer Email Address'
						/>
					</div>
					<div className='form-group col-md-6 '>
						<label className=''>Customer Address</label>
						<input
							onChange={handleChange("address")}
							type='text'
							className='form-control'
							value={customerDetails.address}
							placeholder='Required - Customer Physical Address'
						/>
					</div>
					<div className='form-group col-md-6 mx-auto '>
						<label className=''>Order Comment</label>
						<textarea
							row='5'
							onChange={handleChange("orderComment")}
							// type='text'
							className='form-control'
							value={customerDetails.orderComment}
							placeholder='Optional - Add Any Relatable Comment'
						/>
					</div>
				</div>
				<div className='col-md-8 mx-auto text-center'>
					<hr />
				</div>
				<h5 className='mb-4'>Shipping Option</h5>
				<div>
					<select
						onChange={handleChangeState}
						placeholder='Select a Ticket'
						className=' mb-3 col-md-10 mx-auto my-1'
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
						<option value='SelectGovernorate'>Select A Governorate</option>
						{UniqueGovernorates.map((g, ii) => {
							return <option key={ii}>{g}</option>;
						})}
					</select>
				</div>

				{chosenCity.length > 0 ? (
					<div>
						<select
							onChange={handleChangeCity}
							placeholder='Select a Ticket'
							className=' mb-3 col-md-10 mx-auto my-1'
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
							<option value='SelectGovernorate'>Select A City</option>
							{chosenCity.map((g, ii) => {
								return (
									<option value={g.City.AreaEn} key={ii}>
										{g.City.AreaEn} | {g.LoctionCode}
									</option>
								);
							})}
						</select>
					</div>
				) : null}

				{customerDetails.state && allShippingOptions.length > 0 ? (
					<div>
						<select
							onChange={handleChangeCarrier}
							placeholder='Select a Ticket'
							className=' mb-3 col-md-10 mx-auto my-1'
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
							<option value='SelectGovernorate'>Select A Carrier</option>
							{allShippingOptions.map((g, ii) => {
								return <option key={ii}>{g.carrierName}</option>;
							})}
						</select>
					</div>
				) : (
					<div>
						{customerDetails.state && allShippingOptions.length === 0 ? (
							<div>
								No Available Shipping Option for the selected Governorate
							</div>
						) : null}
					</div>
				)}
			</React.Fragment>
		);
	};

	//Calculating Total Amount

	let shippingFee =
		chosenShippingOption.length > 0 && customerDetails.carrierName
			? chosenShippingOption
					.map((i) => i.chosenShippingData)[0]
					.filter((ii) => ii.governorate === customerDetails.state)[0]
					.shippingPrice_Client
			: 0;

	let basicProductTotalAmount = productsWithNoVariables
		.map((i) => Number(i.orderedQuantity) * Number(i.priceAfterDiscount))
		.reduce((a, b) => a + b, 0);

	var PriceWithVariables = chosenProductQty.map((iii) =>
		iii.map(
			(iiii) => Number(iiii.SubSKUPriceAfterDiscount) * Number(iiii.OrderedQty),
		),
	);

	let variableProductTotalAmount = Number(sum_array(PriceWithVariables));

	useEffect(() => {
		setAllOrderData({
			productsNoVariable: productsWithNoVariables,
			chosenProductQtyWithVariables: chosenProductQty,
			customerDetails: customerDetails,
			totalOrderQty: allAddedQty(),
			status: "In Processing",
			totalAmount:
				Number(shippingFee) +
				Number(variableProductTotalAmount) +
				Number(basicProductTotalAmount),

			totalAmountAfterDiscount: (
				((Number(shippingFee) +
					Number(variableProductTotalAmount) +
					Number(basicProductTotalAmount)) *
					(100 - orderTakerDiscount)) /
				100
			).toFixed(2),
			orderTakerDiscount: orderTakerDiscount,
			employeeData: user,
			chosenShippingOption: chosenShippingOption,
		});
		// eslint-disable-next-line
	}, [
		chosenProductVariables,
		customerDetails.fullName,
		customerDetails.phone,
		chosenShippingOption,
	]);

	let QuantityValidation =
		chosenProductQty &&
		chosenProductQty.length > 0 &&
		chosenProductQty.map((ii) =>
			ii.filter((iii) => iii.OrderedQty <= iii.quantity),
		);

	let lengthsOfArrays =
		chosenProductQty && chosenProductQty.map((i) => i.length);
	let lengthsOfArrays_Validation =
		QuantityValidation && QuantityValidation.map((i) => i.length);

	let ArraysValidation =
		lengthsOfArrays_Validation &&
		lengthsOfArrays &&
		JSON.stringify(lengthsOfArrays_Validation) ===
			JSON.stringify(lengthsOfArrays);

	let QuantityValidation_NoVariables =
		productsWithNoVariables &&
		productsWithNoVariables.filter((ii) => ii.orderedQuantity <= ii.quantity);

	console.log(QuantityValidation_NoVariables, "QuantityValidation_NoVariables");
	console.log(productsWithNoVariables, "productsWithNoVariables");

	let quantityValidationLogic_NoVariables =
		productsWithNoVariables.length !== QuantityValidation_NoVariables.length;

	console.log(
		quantityValidationLogic_NoVariables,
		"quantityValidationLogic_NoVariables",
	);

	const CreatingOrder = (e) => {
		e.preventDefault();
		window.scrollTo({ top: 0, behavior: "smooth" });

		if (
			!customerDetails.fullName ||
			!customerDetails.phone ||
			!customerDetails.state ||
			!customerDetails.address ||
			!customerDetails.cityName ||
			!customerDetails.carrierName ||
			customerDetails.carrierName === "No Shipping Carrier" ||
			customerDetails.cityName === "Unavailable"
		) {
			setClickedLink("CustomerDetails");
			return toast.error("Please Add Customer Details");
		}

		if (addedProductsToCart.length === 0) {
			setClickedLink("ChooseProducts");
			return toast.error("Please Add Products To The Order");
		}

		if (!orderSource) {
			return toast.error("Order Source Is Required...");
		}

		if (availableVariables() && chosenProductQty.length === 0) {
			setClickedLink("ProductFeatures");
			return toast.error("Please Add Products Colors & Sizes");
		}

		if (availableVariables() && ArraysValidation === false) {
			setClickedLink("ProductFeatures");
			return toast.error(
				"No Enough Stock Available For The Selected Variables",
			);
		}

		if (quantityValidationLogic_NoVariables) {
			setClickedLink("AdjustQuantity");
			return toast.error("No Enough Stock Available 'No Variable Products'");
		}

		//In Processing, Ready To Ship, Shipped, Delivered
		const createOrderData = {
			productsNoVariable: productsWithNoVariables,
			chosenProductQtyWithVariables: chosenProductQty,
			customerDetails: customerDetails,
			totalOrderQty: allAddedQty(),
			status: "In Processing",
			totalAmount:
				Number(shippingFee) +
				Number(variableProductTotalAmount) +
				Number(basicProductTotalAmount),

			totalAmountAfterDiscount: (
				((Number(shippingFee) +
					Number(variableProductTotalAmount) +
					Number(basicProductTotalAmount)) *
					(100 - orderTakerDiscount)) /
				100
			).toFixed(2),
			totalOrderedQty: allAddedQty(),
			orderTakerDiscount: orderTakerDiscount,
			employeeData: user,
			chosenShippingOption: chosenShippingOption,
			orderSource: orderSource,
			trackingNumber: "Not Added",
		};

		createOrder(user._id, token, createOrderData)
			.then((response) => {
				toast.success("Payment on delivery order was successfully placed");
				setTimeout(function () {
					window.location.reload(false);
				}, 2500);
			})

			.catch((error) => {
				console.log(error);
			});
	};

	const ReviewYourOrder = () => {
		return (
			<React.Fragment>
				<div style={{ fontSize: "1.25rem", fontWeight: "bolder" }}>
					Customer Details
				</div>
				<div className='col-md-4 mx-auto text-center'>
					<hr />
				</div>
				<div className='row'>
					<div className='col-md-6'>
						Customer Name:{" "}
						<strong style={{ color: "darkblue" }}>
							{customerDetails.fullName}
						</strong>
					</div>
					<div className='col-md-6'>
						Customer Phone:{" "}
						<strong style={{ color: "darkblue" }}>
							{customerDetails.phone}
						</strong>
					</div>
					<div className='col-md-6'>
						Customer Email:{" "}
						<strong style={{ color: "darkblue" }}>
							{" "}
							{customerDetails.email}
						</strong>
					</div>

					<div className='col-md-6 mx-auto'>
						Customer Additional Comment:{" "}
						<strong style={{ color: "darkblue" }}>
							{customerDetails.orderComment}
						</strong>
					</div>
				</div>
				<div className='col-md-4 mx-auto text-center'>
					<hr />
				</div>
				<div style={{ fontSize: "1.25rem", fontWeight: "bolder" }}>
					Shipping Details:
				</div>
				<div className='mt-3'>
					Carrier Name:{" "}
					<strong style={{ color: "darkblue" }}>
						{chosenShippingOption &&
							chosenShippingOption[0] &&
							chosenShippingOption[0].carrierName}
					</strong>
				</div>
				<div className='mt-1'>
					Customer Address:{" "}
					<strong style={{ color: "darkblue" }}>
						{customerDetails.address}
					</strong>
				</div>
				<div className='mt-1'>
					Ship To Governorate:{" "}
					<strong style={{ color: "darkblue" }}>{customerDetails.state}</strong>
				</div>
				<div className='mt-1'>
					Ship To City:{" "}
					<strong style={{ color: "darkblue" }}>
						{customerDetails.cityName}
					</strong>
				</div>
				<div className='mt-1'>
					Ship To City Code:{" "}
					<strong style={{ color: "darkblue" }}>{customerDetails.city}</strong>
				</div>
				<div className='mt-1'>
					Shipping Price:{" "}
					<strong style={{ color: "darkblue" }}>
						{chosenShippingOption.length > 0 &&
							customerDetails.carrierName &&
							chosenShippingOption
								.map((i) => i.chosenShippingData)[0]
								.filter((ii) => ii.governorate === customerDetails.state)[0]
								.shippingPrice_Client}{" "}
						L.E.
					</strong>
				</div>
				<div className='mt-1'>
					Estimated Time For Arrival:{" "}
					<strong style={{ color: "darkblue" }}>
						{chosenShippingOption.length > 0 &&
							customerDetails.carrierName &&
							chosenShippingOption
								.map((i) => i.chosenShippingData)[0]
								.filter((ii) => ii.governorate === customerDetails.state)[0]
								.estimatedTimeForArrival}{" "}
						Day
					</strong>
				</div>

				<div className='col-md-4 mx-auto text-center'>
					<hr />
				</div>
				<div style={{ fontSize: "1.25rem", fontWeight: "bolder" }}>
					Order Details:
				</div>
				<div
					className='my-3'
					style={{ fontSize: "1rem", fontWeight: "bolder" }}>
					Basic Products:
				</div>

				<div className='row'>
					{productsWithNoVariables.map((p, i) => {
						return (
							<div className='col-md-4 text-capitalize' key={i}>
								Product Name:{" "}
								<strong style={{ color: "darkblue" }}>{p.productName}</strong>
								<br />
								Quantity:{" "}
								<strong style={{ color: "darkblue" }}>
									{p.orderedQuantity}{" "}
								</strong>
								{Number(p.orderedQuantity) > 1 ? "Units" : "Unit"}
							</div>
						);
					})}
				</div>
				<div className='col-md-4 mx-auto text-center'>
					<hr />
				</div>
				{chosenProductQty.length > 0 ? (
					<>
						<div
							className='my-3'
							style={{ fontSize: "1rem", fontWeight: "bolder" }}>
							Products With Variables:
						</div>

						<div className='row'>
							{chosenProductQty.map((p, i) => {
								return (
									<React.Fragment key={i}>
										{p.map((pp, ii) => {
											return (
												<div className='col-md-4 text-capitalize' key={ii}>
													Product Name:{" "}
													<strong
														style={{
															color: "darkblue",
															textTransform: "capitalize",
														}}>
														{pp.productName} | {pp.SubSKU} | {pp.SubSKUColor}
													</strong>
													<br />
													Quantity:{" "}
													<strong style={{ color: "darkblue" }}>
														{pp.OrderedQty}{" "}
													</strong>
													{Number(pp.OrderedQty) > 1 ? "Units" : "Unit"}
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
				<div style={{ fontSize: "1.25rem", fontWeight: "bolder" }}>
					Order Total Value:
				</div>
				<div className='form-group col-md-6 mx-auto my-2 '>
					<label className=''>You can add a discount {user.name}</label>
					<input
						onChange={(e) => setOrderTakerDiscount(e.target.value)}
						type='number'
						className='form-control'
						value={orderTakerDiscount}
						placeholder='Optional - Add Discount To The Order (Should be Digits Only e.g. 1, 2, 3 which means 1%, 2%, etc...)'
					/>
				</div>
				<div className='form-group col-md-6 mx-auto my-4 '>
					<label className=''>Order Source</label>
					<input
						onChange={(e) => setOrderSource(e.target.value)}
						type='text'
						className='form-control'
						value={orderSource}
						placeholder='Required - e.g. Zirga Instagram, Next Day Instagram, etc...'
					/>
				</div>
				<div className='mt-3'>
					Total Amount Basic Products:{" "}
					<strong style={{ color: "darkblue" }}>
						{basicProductTotalAmount ? basicProductTotalAmount : 0} L.E.
					</strong>
				</div>
				<div className='mt-1'>
					Total Amount Products With Variables:{" "}
					<strong style={{ color: "darkblue" }}>
						{variableProductTotalAmount ? variableProductTotalAmount : 0} L.E.
					</strong>
				</div>
				<div className='mt-1'>
					Shipping Fee:{" "}
					<strong style={{ color: "darkblue" }}>
						{shippingFee ? shippingFee : 0} L.E.
					</strong>
				</div>

				<div className='mt-4' style={{ fontSize: "1.2rem" }}>
					Total Amount:{" "}
					{orderTakerDiscount > 0 ? (
						<>
							<strong>
								<s style={{ color: "darkred" }}>
									{Number(shippingFee) +
										Number(variableProductTotalAmount) +
										Number(basicProductTotalAmount)}{" "}
									L.E.
								</s>
							</strong>{" "}
							<strong style={{ color: "darkblue" }}>
								{(
									((Number(shippingFee) +
										Number(variableProductTotalAmount) +
										Number(basicProductTotalAmount)) *
										(100 - orderTakerDiscount)) /
									100
								).toFixed(2)}{" "}
								L.E.
							</strong>
						</>
					) : (
						<strong style={{ color: "darkblue" }}>
							{Number(shippingFee) +
								Number(variableProductTotalAmount) +
								Number(basicProductTotalAmount)}{" "}
							L.E.
						</strong>
					)}
				</div>

				<div className='mx-auto text-center mt-5 col-md-8'>
					<button
						className='btn btn-success btn-block mb-3 mx-auto text-center'
						onClick={CreatingOrder}>
						Create A New Order
					</button>
				</div>
			</React.Fragment>
		);
	};

	return (
		<CreateNewOrderWrapper>
			<div className='grid-container'>
				<div className=''>
					<AdminMenu fromPage='CreateNewOrder' />
				</div>
				<div className='mainContent'>
					<Navbar fromPage='CreateNewOrder' />
					<h3
						className='mx-auto text-center mb-5'
						style={{ color: "#009ef7", fontWeight: "bold" }}>
						Create A New Order
					</h3>

					<div className='row'>
						<div className='col-3'>
							<ul className='mainUL'>
								<li
									className='mb-4 mainLi'
									onClick={() => setClickedLink("ChooseProducts")}
									style={isActive("ChooseProducts", clickedLink)}>
									Choose Required Products{" "}
									{addedProductsToCart.length > 0 ? (
										<span
											style={{
												background: "darkblue",
												color: "white",
												padding: "0px 2px",
												borderRadius: "5px",
												marginLeft: "5px",
												fontSize: "0.75rem",
											}}>
											{addedProductsToCart.length}
										</span>
									) : null}
								</li>
								<hr />
								{availableVariables() ? (
									<>
										<li
											className='my-4 mainLi'
											onClick={() => setClickedLink("ProductFeatures")}
											style={isActive("ProductFeatures", clickedLink)}>
											Adjust Product Features (Colors, Sizes)
										</li>
										<hr />
									</>
								) : null}

								<li
									className='my-4 mainLi'
									onClick={() => setClickedLink("AdjustQuantity")}
									style={isActive("AdjustQuantity", clickedLink)}>
									Adjust Order Quantity
									{addedProductsToCart.length > 0 ? (
										<span
											style={{
												background: "darkblue",
												color: "white",
												padding: "0px 2px",
												borderRadius: "5px",
												marginLeft: "5px",
												fontSize: "0.75rem",
											}}>
											{allAddedQty()}
										</span>
									) : null}
								</li>
								<hr />
								<li
									className='my-4 mainLi'
									onClick={() => setClickedLink("CustomerDetails")}
									style={isActive("CustomerDetails", clickedLink)}>
									Add Customer Details / Shipping
								</li>
								<hr />

								<li
									className='my-4 mainLi'
									onClick={() => setClickedLink("ReviewOrder")}
									style={isActive("ReviewOrder", clickedLink)}>
									Review Your Order
								</li>
								<hr />
							</ul>
						</div>

						{clickedLink === "ChooseProducts" ? (
							<div
								className='col-8 ml-3 rightContentWrapper'
								// style={{ borderLeft: "darkred 2px solid" }}
							>
								{PickingUpProducts()}
							</div>
						) : null}

						{clickedLink === "ProductFeatures" ? (
							<div
								className='col-8 ml-3 rightContentWrapper'
								// style={{ borderLeft: "darkred 2px solid" }}
							>
								{sizesAndColorsOptions()}
							</div>
						) : null}

						{clickedLink === "AdjustQuantity" ? (
							<div
								className='col-8 ml-3 rightContentWrapper'
								// style={{ borderLeft: "darkred 2px solid" }}
							>
								{addingOrderQuantity()}
							</div>
						) : null}
						{clickedLink === "CustomerDetails" ? (
							<div
								className='col-8 ml-3 rightContentWrapper'
								// style={{ borderLeft: "darkred 2px solid" }}
							>
								{customerDetailsForm()}
							</div>
						) : null}
						{clickedLink === "ReviewOrder" ? (
							<div
								className='col-8 ml-3 rightContentWrapper'
								// style={{ borderLeft: "darkred 2px solid" }}
							>
								{ReviewYourOrder()}
							</div>
						) : null}
					</div>
				</div>
			</div>
		</CreateNewOrderWrapper>
	);
};

export default CreateNewOrder;

const CreateNewOrderWrapper = styled.div`
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

	.mainUL {
		list-style: none;
	}

	.mainLi {
		font-weight: bold;
		transition: 0.3s;
	}

	.mainLi:hover {
		background: #002a52 !important;
		padding: 1px;
		color: white !important;
		border-radius: 5px;
		cursor: pointer;
		transition: 0.3s;
	}

	.variableLinksItem {
		font-weight: bold;
		transition: 0.3s;
	}

	.variableLinksItem:hover {
		background: #002a52 !important;
		/* padding: 1px; */
		color: white !important;
		border-radius: 5px;
		cursor: pointer;
		transition: 0.3s;
	}

	.rightContentWrapper {
		border-left: 1px lightgrey solid;
		min-height: 550px;
	}

	@media (max-width: 1750px) {
		.grid-container {
			display: grid;
			grid-template-columns: 18% 82%;
			margin: auto;
			/* border: 1px solid red; */
			/* grid-auto-rows: minmax(60px, auto); */
		}
	}

	@media (max-width: 1550px) {
		.mainUL > li {
			font-size: 0.75rem;
			margin-left: 20px;
		}
	}
`;
