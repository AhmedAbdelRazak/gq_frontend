/** @format */

import React, { useState, useEffect } from "react";
import styled from "styled-components";
// eslint-disable-next-line
import { isAuthenticated } from "../../../auth";
import AdminMenu from "../../AdminMenu/AdminMenu";
import Navbar from "../../AdminNavMenu/Navbar";
import DarkBG from "../../AdminMenu/DarkBG";
import { getColors, getProducts } from "../../apiAdmin";
import { Select } from "antd";

const { Option } = Select;

const OnsiteOrderTaking = () => {
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [offset, setOffset] = useState(0);
	const [pageScrolled, setPageScrolled] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	// eslint-disable-next-line
	const [allProducts, setAllProducts] = useState([]);
	// eslint-disable-next-line
	const [allColors, setAllColors] = useState([]);
	const [allSubSKUs, setAllSubSKUs] = useState([]);
	const [chosenSubSKUs, setChosenSubSKUs] = useState([]);
	const [chosenProducts, setChosenProducts] = useState([]);
	const [submittedSKU, setSubmittedSKU] = useState(false);
	const [chosenProductWithVariables, setChosenProductWithVariables] = useState(
		[],
	);

	// eslint-disable-next-line
	const { user, token } = isAuthenticated();

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

	const gettingAllProducts = () => {
		getProducts().then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				var allAceProducts = data.filter(
					(i) => i.activeProduct === true && i.storeName.storeName === "ace",
				);
				setAllProducts(allAceProducts);

				var allAceSKUs =
					allAceProducts &&
					allAceProducts.map((i) => i.productAttributes.map((ii) => ii.SubSKU));

				var mergedSubSKUs = [].concat.apply([], allAceSKUs);
				let uniqueMergedSubSKUs = [...new Set(mergedSubSKUs)];

				setAllSubSKUs(uniqueMergedSubSKUs);

				var addingVariablesToMain =
					allAceProducts &&
					allAceProducts.map((i) =>
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

				let chosenProducts1 =
					chosenSubSKUs &&
					allAttributesFinalOfFinal &&
					allAttributesFinalOfFinal.filter(
						(i) => chosenSubSKUs.indexOf(i.SubSKU) > -1,
					);

				const UniqueProducts = [
					...new Map(
						chosenProducts1.map((item) => [item["SubSKU"], item]),
					).values(),
				];

				setChosenProducts(UniqueProducts);

				const productSubSKUImage = (requiredProduct, productSubSKUColor) => {
					const theReturn = requiredProduct.productAttributes.filter(
						(i) => i.color === productSubSKUColor,
					)[0].productImages;
					return theReturn[0] ? theReturn[0].url : undefined;
				};

				setChosenProductWithVariables(
					UniqueProducts.map((i) => {
						return {
							SubSKU: i.SubSKU,
							OrderedQty: 1,
							productId: i._id,
							productName: i.productName,
							productMainImage: i.thumbnailImage[0].images[0].url,
							productSubSKUImage: productSubSKUImage(
								UniqueProducts.filter((s) => s._id === i._id)[0],
								UniqueProducts.filter(
									(s) => s._id === i._id,
								)[0].productAttributes.filter((ss) => ss.SubSKU === i.SubSKU)[0]
									.color,
							)
								? productSubSKUImage(
										UniqueProducts.filter((s) => s._id === i._id)[0],
										UniqueProducts.filter(
											(s) => s._id === i._id,
										)[0].productAttributes.filter(
											(ss) => ss.SubSKU === i.SubSKU,
										)[0].color,
								  )
								: UniqueProducts.filter((s) => s._id === i._id)[0]
										.thumbnailImage[0].images[0].url,
							SubSKUPriceAfterDiscount: i.priceAfterDiscount,
							SubSKURetailerPrice: i.price,
							SubSKUWholeSalePrice: i.WholeSalePrice,
							SubSKUDropshippingPrice: i.DropShippingPrice,
							pickedPrice: i.priceAfterDiscount,
							quantity: i.receivedQuantity,
							SubSKUColor: i.color,
							SubSKUSize: i.size,
							SubSKUMSRP: i.MSRP,
						};
					}),
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
	}, [chosenSubSKUs]);

	let productsTotalAmount =
		chosenProductWithVariables &&
		chosenProductWithVariables
			.map((i) => Number(i.OrderedQty) * Number(i.pickedPrice))
			.reduce((a, b) => a + b, 0);

	return (
		<OnsiteOrderTakingWrapper show={AdminMenuStatus}>
			{!collapsed ? (
				<DarkBG collapsed={collapsed} setCollapsed={setCollapsed} />
			) : null}
			<div className='grid-container'>
				<div className=''>
					<AdminMenu
						fromPage='AceStoreOrderTaking'
						AdminMenuStatus={AdminMenuStatus}
						setAdminMenuStatus={setAdminMenuStatus}
						collapsed={collapsed}
						setCollapsed={setCollapsed}
					/>
				</div>
				<div className='mainContent'>
					<Navbar fromPage='AceStoreOrderTaking' pageScrolled={pageScrolled} />
					<div className='col-md-9 mx-auto mt-5'>
						{allProducts &&
							allProducts.length > 0 &&
							allSubSKUs &&
							allSubSKUs.length > 0 && (
								<div className='form-group mx-auto'>
									<label>Scan Or Type Product SKUs</label>
									<br />
									<Select
										style={{
											color: "black",
											textTransform: "capitalize",
											width: "50%",
										}}
										showSearch
										mode='multiple'
										placeholder='Search to Select A SKU'
										value={chosenSubSKUs}
										allowClear
										onChange={(value) => {
											setChosenSubSKUs(value);
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

						{chosenSubSKUs.length > 0 && allSubSKUs.length > 0 ? (
							<button
								className='btn btn-primary p-1 mt-3'
								onClick={() => setSubmittedSKU(true)}>
								Submit Order SKU's
							</button>
						) : null}

						{chosenSubSKUs &&
						chosenSubSKUs.length > 0 &&
						chosenProducts &&
						chosenProducts.length > 0 &&
						allSubSKUs.length > 0 &&
						submittedSKU ? (
							<div className='mt-4'>
								<h5
									style={{
										textTransform: "uppercase",
										fontWeight: "bold",
										color: "darkred",
									}}>
									Products Details
								</h5>
								<div className='row'>
									{chosenProductWithVariables &&
										chosenProductWithVariables.map((p, i) => {
											return (
												<div className='col-md-5 mx-auto' key={i}>
													<div className='mb-3'>
														<img
															src={p.productSubSKUImage}
															width='25%'
															alt='infinite-apps'
														/>
													</div>
													<div>
														<strong>Product Name:</strong>{" "}
														<span style={{ textTransform: "uppercase" }}>
															{chosenProducts[i] &&
																chosenProducts[i].productName}
														</span>{" "}
													</div>

													<div>
														<strong>Product Color:</strong>{" "}
														<span style={{ textTransform: "uppercase" }}>
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
														</span>{" "}
													</div>
													<div>
														<strong>Product Size:</strong>{" "}
														<span style={{ textTransform: "uppercase" }}>
															{p && p.SubSKUSize}
														</span>{" "}
													</div>
													<br />
													<div>
														<strong>Current Active Stock In Ace Store:</strong>{" "}
														{chosenProducts[i] &&
														chosenProducts[i].receivedQuantity
															? chosenProducts[i].receivedQuantity
															: 0}{" "}
														Items{" "}
														{chosenProducts[i].receivedQuantity <
														p.OrderedQty ? (
															<strong
																style={{ color: "red", fontSize: "12px" }}>
																(No Enough Stock)
															</strong>
														) : null}
													</div>

													<div>
														<strong>Quantity Onhand (G&Q Hub):</strong>{" "}
														{chosenProducts[i] && chosenProducts[i].quantity
															? chosenProducts[i].quantity
															: 0}{" "}
														Items
													</div>
													<div>
														<strong>
															Product Available Prices (Click to choose):
														</strong>{" "}
														<ul
															style={{
																listStyle: "none",
																textDecoration: "underline",
																color: "#0080ff",
																cursor: "pointer",
															}}>
															<li
																onClick={() => {
																	const index =
																		chosenProductWithVariables.findIndex(
																			(object) => {
																				return (
																					object.productId === p.productId &&
																					object.SubSKU === p.SubSKU
																				);
																			},
																		);

																	if (index !== -1) {
																		chosenProductWithVariables[
																			index
																		].pickedPrice = p.SubSKUPriceAfterDiscount;
																		setChosenProductWithVariables([
																			...chosenProductWithVariables,
																		]);
																	}
																}}>
																{p.SubSKUPriceAfterDiscount} EGP
															</li>
															<li
																onClick={() => {
																	const index =
																		chosenProductWithVariables.findIndex(
																			(object) => {
																				return (
																					object.productId === p.productId &&
																					object.SubSKU === p.SubSKU
																				);
																			},
																		);

																	if (index !== -1) {
																		chosenProductWithVariables[
																			index
																		].pickedPrice = p.SubSKURetailerPrice;
																		setChosenProductWithVariables([
																			...chosenProductWithVariables,
																		]);
																	}
																}}>
																{p.SubSKURetailerPrice} EGP
															</li>
															<li
																onClick={() => {
																	const index =
																		chosenProductWithVariables.findIndex(
																			(object) => {
																				return (
																					object.productId === p.productId &&
																					object.SubSKU === p.SubSKU
																				);
																			},
																		);

																	if (index !== -1) {
																		chosenProductWithVariables[
																			index
																		].pickedPrice = p.SubSKUDropshippingPrice;
																		setChosenProductWithVariables([
																			...chosenProductWithVariables,
																		]);
																	}
																}}>
																{p.SubSKUDropshippingPrice} EGP
															</li>
															<li
																onClick={() => {
																	const index =
																		chosenProductWithVariables.findIndex(
																			(object) => {
																				return (
																					object.productId === p.productId &&
																					object.SubSKU === p.SubSKU
																				);
																			},
																		);

																	if (index !== -1) {
																		chosenProductWithVariables[
																			index
																		].pickedPrice = p.SubSKUWholeSalePrice;
																		setChosenProductWithVariables([
																			...chosenProductWithVariables,
																		]);
																	}
																}}>
																{p.SubSKUWholeSalePrice} EGP
															</li>
															<li
																onClick={() => {
																	const index =
																		chosenProductWithVariables.findIndex(
																			(object) => {
																				return (
																					object.productId === p.productId &&
																					object.SubSKU === p.SubSKU
																				);
																			},
																		);

																	if (index !== -1) {
																		chosenProductWithVariables[
																			index
																		].pickedPrice = p.SubSKUMSRP;
																		setChosenProductWithVariables([
																			...chosenProductWithVariables,
																		]);
																	}
																}}>
																{p.SubSKUMSRP} EGP
															</li>
														</ul>
													</div>
													<br />
													<div className='form-group mt-1'>
														<label className=''>Order Qty</label>
														<input
															value={p.OrderedQty}
															type='number'
															style={{
																border: "1px lightgrey solid",
																width: "100%",
															}}
															// max={Number(AvailableStock.quantity)}
															onChange={(e) => {
																const index =
																	chosenProductWithVariables.findIndex(
																		(object) => {
																			return (
																				object.productId === p.productId &&
																				object.SubSKU === p.SubSKU
																			);
																		},
																	);

																if (index !== -1) {
																	chosenProductWithVariables[index].OrderedQty =
																		e.target.value;
																	setChosenProductWithVariables([
																		...chosenProductWithVariables,
																	]);
																}
															}}
														/>
													</div>
													<div className='form-group mt-1'>
														<label className=''>
															Product Price (Please be careful while adding the
															price manually){" "}
														</label>
														<input
															type='number'
															className='form-control'
															value={p.pickedPrice}
															onChange={(e) => {
																const index =
																	chosenProductWithVariables.findIndex(
																		(object) => {
																			return (
																				object.productId === p.productId &&
																				object.SubSKU === p.SubSKU
																			);
																		},
																	);

																if (index !== -1) {
																	chosenProductWithVariables[
																		index
																	].pickedPrice = e.target.value;
																	setChosenProductWithVariables([
																		...chosenProductWithVariables,
																	]);
																}
															}}
															placeholder='Required - Product Price'
														/>
													</div>
												</div>
											);
										})}
								</div>
								<div className='ml-5 mt-3' style={{ fontSize: "1.1rem" }}>
									Total Amount:{" "}
									<strong>{Number(productsTotalAmount).toFixed(2)} EGP</strong>
								</div>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</OnsiteOrderTakingWrapper>
	);
};

export default OnsiteOrderTaking;

const OnsiteOrderTakingWrapper = styled.div`
	min-height: 880px;
	margin-bottom: 100px;

	.grid-container {
		display: grid;
		grid-template-columns: ${(props) => (props.show ? "8% 92%" : "15% 85%")};
		margin: auto;
	}

	@media (max-width: 1750px) {
		background: white;

		.grid-container {
			display: grid;
			grid-template-columns: ${(props) => (props.show ? "7% 93%" : "18% 82%")};
			margin: auto;
		}
	}

	@media (max-width: 1400px) {
		background: white;

		.grid-container {
			display: grid;
			grid-template-columns: 12% 88%;
			margin: auto;
		}
	}

	@media (max-width: 750px) {
		.grid-container {
			display: grid;
			grid-template-columns: ${(props) => (props.show ? "0% 99%" : "0% 100%")};
			margin: auto;
		}
		h3 {
			margin-top: 60px !important;
		}

		.ant-select {
			width: 100% !important;
		}
	}
`;
