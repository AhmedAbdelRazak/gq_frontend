/** @format */

import React, { useState, useEffect } from "react";
import styled from "styled-components";
// eslint-disable-next-line
import { isAuthenticated } from "../../../auth";
import AdminMenu from "../../AdminMenu/AdminMenu";
import DarkBG from "../../AdminMenu/DarkBG";
import { getColors, getProducts } from "../../apiAdmin";
import { Select } from "antd";
import { FaMinus, FaPlus } from "react-icons/fa";
import LogoImage from "../../../GeneralImages/ace-logo.png";

const { Option } = Select;

const OnsiteOrderTaking = () => {
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [offset, setOffset] = useState(0);
	// eslint-disable-next-line
	const [pageScrolled, setPageScrolled] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	const [allProducts, setAllProducts] = useState([]);
	const [allProductsAll, setAllProductsAll] = useState([]);
	const [allCategories, setAllCategories] = useState([]);
	const [allGenders, setAllGenders] = useState([]);
	// eslint-disable-next-line
	const [allColors, setAllColors] = useState([]);
	const [allSubSKUs, setAllSubSKUs] = useState([]);
	const [chosenSubSKUs, setChosenSubSKUs] = useState([]);
	const [chosenProducts, setChosenProducts] = useState([]);
	const [submittedSKU, setSubmittedSKU] = useState(false);
	const [genderFilter, setGenderFilter] = useState("men");
	const [categoryFilter, setCategoryFilter] = useState("");
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

				setAllProductsAll(allAceProducts);

				const AllProductsModified =
					allAceProducts && allAceProducts.map((i) => i.productAttributes);

				var mergedAttributes = [].concat.apply([], AllProductsModified);

				let allAttributes = [
					...new Map(mergedAttributes.map((item) => [item, item])).values(),
				];

				const allAttributesEnhanced =
					allAttributes &&
					allAttributes.filter((i) => i.productImages.length > 0);

				const PK =
					allAttributesEnhanced && allAttributesEnhanced.map((i) => i.PK);

				const finalResultVariableDifferentImages = allAceProducts.map((i) => {
					return {
						...i,
						productAttributes: i.productAttributes,
						clickedProductAttribute: i.productAttributes.filter(
							(ii) => PK.indexOf(ii.PK) !== -1,
						),
					};
				});

				const finalOfFinal1 =
					finalResultVariableDifferentImages &&
					finalResultVariableDifferentImages.map((i) =>
						i.clickedProductAttribute.map((ii) => {
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
							};
						}),
					);

				var mergedFinalOfFinal2 = [].concat.apply([], finalOfFinal1);

				let allAttributesFinalOfFinalMain = [
					...new Map(mergedFinalOfFinal2.map((item) => [item, item])).values(),
				];

				const requiredProducts =
					allAttributesFinalOfFinalMain &&
					allAttributesFinalOfFinalMain.filter(
						(i) =>
							i.productImages &&
							i.productImages[0] &&
							i.productImages[0].url !== undefined,
					);

				if (categoryFilter) {
					setAllProducts(
						requiredProducts.filter(
							(iii) =>
								iii.gender.genderName.toLowerCase() ===
									genderFilter.toLowerCase() &&
								iii.category.categoryName.toLowerCase() ===
									categoryFilter.toLowerCase(),
						),
					);
				} else {
					setAllProducts(
						requiredProducts.filter(
							(iii) =>
								iii.gender.genderName.toLowerCase() ===
								genderFilter.toLowerCase(),
						),
					);
				}

				//Unique Categories
				var categoriesArray =
					allAceProducts && allAceProducts.map((ii) => ii.category);

				let uniqueCategories = [
					...new Map(
						categoriesArray &&
							categoriesArray.map((item) => [item["categoryName"], item]),
					).values(),
				];
				setAllCategories(uniqueCategories);

				//Gender Unique
				var genderUnique =
					allAceProducts && allAceProducts.map((ii) => ii.gender);

				let uniqueGenders = [
					...new Map(
						genderUnique &&
							genderUnique.map((item) => [item["genderName"], item]),
					).values(),
				];
				setAllGenders(uniqueGenders);

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

				// eslint-disable-next-line
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
	}, [chosenSubSKUs, genderFilter, categoryFilter]);

	// console.log(allProducts, "allProducts");
	// console.log(allCategories, "allCategories");

	let productsTotalAmount =
		chosenProductWithVariables &&
		chosenProductWithVariables
			.map((i) => Number(i.OrderedQty) * Number(i.pickedPrice))
			.reduce((a, b) => a + b, 0);

	const arrayOfColorsGender = ["#c4c4ff", "#ffc4c4"];
	const arrayOfColorsCategories = [
		"#00ffff",
		"#00ff80",
		"#ffc4e2",
		"#c4e2ff",
		"#e6e600",
		"#ffe2c4",
		"",
		"",
		"",
	];

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
					<div className='col-md-12 '>
						<div className='text-center mx-auto'>
							<h3 className='text-center' style={{ fontWeight: "bold" }}>
								<img
									src={LogoImage}
									alt='GQ Logo'
									style={{
										width: "10%",
										padding: "0px",
										objectFit: "cover",
									}}
								/>
								Onsite POS (Store #1)
							</h3>
						</div>
						{allProductsAll &&
							allProductsAll.length > 0 &&
							allSubSKUs &&
							allSubSKUs.length > 0 && (
								<div className='form-group mx-3'>
									<label>Scan Or Type Product SKUs</label>
									<br />
									<Select
										style={{
											color: "black",
											textTransform: "capitalize",
											width: "30%",
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
						<div
							className='posWrapper'
							style={{
								border: "2px lightgrey solid",
								borderRadius: "5px",
								background: "white",
							}}>
							<div className='row mx-3' style={{ minHeight: "720px" }}>
								<div className='col-md-5 mt-3'>
									<div>
										<div className='row text-center'>
											<div className='col-1'>#</div>
											<div className='col-4'>Name</div>
											<div className='col-4'>Quantity</div>
											<div className='col-3'>Unit Price</div>
										</div>
										{chosenSubSKUs &&
											chosenSubSKUs.length > 0 &&
											chosenProducts &&
											chosenProducts.length > 0 &&
											allSubSKUs.length > 0 &&
											chosenProductWithVariables.length > 0 &&
											allProductsAll.length > 0 && (
												<>
													{chosenProductWithVariables &&
														chosenProductWithVariables.map((p, i) => {
															const allSizes =
																allProductsAll &&
																allProductsAll
																	.filter(
																		(product) => product._id === p.productId,
																	)[0]
																	.productAttributes.map((iiii) => iiii.size);

															var mergedSizes = [].concat.apply([], allSizes);

															let uniqueSizes = [
																...new Map(
																	mergedSizes.map((item) => [item, item]),
																).values(),
															];

															return (
																<div
																	className='row text-center my-3'
																	key={i}
																	style={{
																		borderBottom: "2px solid lightgrey",
																	}}>
																	<div className='col-1 mt-1'>{i + 1}</div>
																	<div
																		className='col-4 my-auto'
																		style={{
																			textTransform: "uppercase",
																			fontSize: "12px",
																		}}>
																		<div>
																			{chosenProducts[i] &&
																				chosenProducts[i].productName}
																		</div>
																		<div>{p.SubSKU}</div>
																		<div>
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
																		</div>
																		<select
																			className='py-2 mb-3'
																			style={{
																				textTransform: "uppercase",
																				minWidth: "50%",
																				border: "lightgrey solid 1px",
																			}}
																			onChange={(e) => {
																				var updatedProduct1 =
																					allProductsAll &&
																					allProductsAll.filter(
																						(product) =>
																							product._id === p.productId,
																					)[0];
																				var updatedProduct2 =
																					updatedProduct1.productAttributes.filter(
																						(att) =>
																							att.color === p.SubSKUColor &&
																							att.size === e.target.value,
																					)[0];
																				console.log(
																					updatedProduct2,
																					"updatedProduct2",
																				);

																				const index =
																					chosenProductWithVariables.findIndex(
																						(object) => {
																							return (
																								object.productId ===
																									p.productId &&
																								object.SubSKU === p.SubSKU
																							);
																						},
																					);

																				if (index !== -1) {
																					chosenProductWithVariables[
																						index
																					].SubSKUSize = e.target.value;

																					chosenProducts[index].size =
																						e.target.value;

																					chosenProductWithVariables[
																						index
																					].quantity = updatedProduct2.quantity;

																					chosenProducts[index].quantity =
																						updatedProduct2.quantity;

																					chosenProductWithVariables[
																						index
																					].receivedQuantity =
																						updatedProduct2.receivedQuantity
																							? updatedProduct2.receivedQuantity
																							: 0;

																					chosenProducts[
																						index
																					].receivedQuantity =
																						updatedProduct2.receivedQuantity
																							? updatedProduct2.receivedQuantity
																							: 0;

																					chosenProductWithVariables[
																						index
																					].SubSKU = updatedProduct2.SubSKU;

																					chosenProducts[index].SubSKU =
																						updatedProduct2.SubSKU;

																					setChosenProductWithVariables([
																						...chosenProductWithVariables,
																					]);
																					setChosenProducts([
																						...chosenProducts,
																					]);
																				}
																			}}>
																			<option
																				style={{ textTransform: "capitalize" }}>
																				{p.SubSKUSize}
																			</option>

																			{uniqueSizes &&
																				uniqueSizes.map((ss, iii) => {
																					return (
																						<option key={iii} value={ss}>
																							{ss}
																						</option>
																					);
																				})}
																		</select>
																	</div>
																	<div className='col-4 mt-1'>
																		<button
																			style={{
																				border: "lightgrey solid 1px",
																				backgroundColor: "white",
																				color: "darkgrey",
																				padding: "4px",
																			}}
																			type='button'
																			className='amount-btn'
																			onClick={() => {
																				const index =
																					chosenProductWithVariables.findIndex(
																						(object) => {
																							return (
																								object.productId ===
																									p.productId &&
																								object.SubSKU === p.SubSKU
																							);
																						},
																					);

																				if (index !== -1) {
																					chosenProductWithVariables[
																						index
																					].OrderedQty -= 1;

																					setChosenProductWithVariables([
																						...chosenProductWithVariables,
																					]);
																				}
																			}}>
																			<FaMinus />
																		</button>
																		<span
																			className='amount'
																			style={{
																				border: "lightgrey solid 1px",
																				backgroundColor: "white",
																				color: "black",
																				padding: "6px 5px",
																			}}>
																			{p.OrderedQty}
																		</span>
																		<button
																			style={{
																				border: "lightgrey solid 1px",
																				backgroundColor: "white",
																				color: "darkgrey",
																				padding: "4px",
																			}}
																			type='button'
																			className='amount-btn'
																			onClick={() => {
																				const index =
																					chosenProductWithVariables.findIndex(
																						(object) => {
																							return (
																								object.productId ===
																									p.productId &&
																								object.SubSKU === p.SubSKU
																							);
																						},
																					);

																				if (index !== -1) {
																					chosenProductWithVariables[
																						index
																					].OrderedQty += 1;

																					setChosenProductWithVariables([
																						...chosenProductWithVariables,
																					]);
																				}
																			}}>
																			<FaPlus />
																		</button>
																		<div style={{ fontSize: "12px" }}>
																			<strong>
																				Current Active Stock In Ace Store:
																			</strong>{" "}
																			{chosenProducts &&
																			chosenProducts[i] &&
																			chosenProducts[i].receivedQuantity
																				? chosenProducts[i].receivedQuantity
																				: 0}{" "}
																			Items{" "}
																			{chosenProducts &&
																			chosenProducts[i] &&
																			chosenProducts[i].receivedQuantity <
																				p.OrderedQty ? (
																				<strong
																					style={{
																						color: "red",
																						fontSize: "12px",
																					}}>
																					(No Enough Stock)
																				</strong>
																			) : null}
																			<div
																				style={{
																					fontSize: "12px",
																				}}>
																				<strong>
																					Quantity Onhand (G&Q Hub):
																				</strong>{" "}
																				{chosenProducts[i] &&
																				chosenProducts[i].quantity
																					? chosenProducts[i].quantity
																					: 0}{" "}
																				Items
																			</div>
																		</div>
																	</div>
																	<div className='col-3 mt-1'>
																		{Number(p.pickedPrice).toFixed(2)} EGP
																	</div>
																</div>
															);
														})}
												</>
											)}
									</div>
									<div
										className='ml-5'
										style={{
											fontSize: "1.1rem",
											marginTop:
												chosenProductWithVariables.length === 1
													? "300px"
													: chosenProductWithVariables.length === 2
													? "200px"
													: chosenProductWithVariables.length > 2
													? "40px"
													: "480px",
										}}>
										Total Amount:{" "}
										<strong>
											{Number(productsTotalAmount).toFixed(2)} EGP
										</strong>
									</div>
									<div className='btn btn-primary ml-5 my-3'>
										Receipt Preview & Print
									</div>
								</div>
								<div
									className='col-md-1 px-0 pb-5 '
									style={{ background: "lightgrey" }}>
									<div className='pt-2 mb-4'>
										<span className='ml-2' style={{ fontWeight: "bold" }}>
											GENDER
										</span>
										{allGenders &&
											allGenders.map((g, i) => {
												return (
													<React.Fragment key={i}>
														{" "}
														<div
															className=' w-100 mx-0'
															style={{
																padding: "15px 4px",
																background: arrayOfColorsGender[i]
																	? arrayOfColorsGender[i]
																	: "red",
																textTransform: "uppercase",
																fontSize: "12px",
																fontWeight: "bold",
																cursor: "pointer",
															}}
															onClick={() =>
																setGenderFilter(g.genderName.toLowerCase())
															}>
															{g.genderName}
														</div>
													</React.Fragment>
												);
											})}
									</div>
									<div>
										<span className='ml-2' style={{ fontWeight: "bold" }}>
											CATEGORIES
										</span>

										{allCategories &&
											allCategories.map((c, i) => {
												return (
													<React.Fragment key={i}>
														{" "}
														<div
															className=' w-100 mx-0'
															style={{
																padding: "15px 4px",
																background: arrayOfColorsCategories[i]
																	? arrayOfColorsCategories[i]
																	: "lightgrey",

																textTransform: "uppercase",
																fontSize: "12px",
																fontWeight: "bold",
																cursor: "pointer",
															}}
															onClick={() =>
																setCategoryFilter(c.categoryName.toLowerCase())
															}>
															{c.categoryName}
														</div>
													</React.Fragment>
												);
											})}
									</div>
								</div>
								<div className='col-md-6 productsOnRight'>
									<div className='grid-container2'>
										{allProducts &&
											allProducts.map((p, i) => {
												return (
													<div
														className='pt-3 mb-5'
														key={i}
														style={{ cursor: "pointer" }}
														onClick={() => {
															if (chosenSubSKUs.length === 0) {
																setChosenSubSKUs([p.SubSKU]);
															} else if (
																chosenSubSKUs.indexOf(p.SubSKU) !== -1
															) {
																const index =
																	chosenProductWithVariables.findIndex(
																		(object) => {
																			return (
																				object.productId === p._id &&
																				object.SubSKU === p.SubSKU
																			);
																		},
																	);

																if (index !== -1) {
																	chosenProductWithVariables[
																		index
																	].OrderedQty += 1;

																	setChosenProductWithVariables([
																		...chosenProductWithVariables,
																	]);
																}
															} else {
																setChosenSubSKUs([...chosenSubSKUs, p.SubSKU]);
															}
														}}>
														<img
															width='100%'
															height='100%'
															src={p.productImages[0].url}
															alt='infinite-apps'
														/>
														<div
															style={{
																fontSize: "13px",
																fontWeight: "bold",
																textTransform: "capitalize",
															}}>
															<div>
																{p.productName}
																<br />
																{Number(p.priceAfterDiscount).toFixed(2)} EGP
															</div>
														</div>
													</div>
												);
											})}
									</div>
								</div>
							</div>

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
															<strong>
																Current Active Stock In Ace Store:
															</strong>{" "}
															{chosenProducts &&
															chosenProducts[i] &&
															chosenProducts[i].receivedQuantity
																? chosenProducts[i].receivedQuantity
																: 0}{" "}
															Items{" "}
															{chosenProducts &&
															chosenProducts[i] &&
															chosenProducts[i].receivedQuantity <
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
																			].pickedPrice =
																				p.SubSKUPriceAfterDiscount;
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
																		chosenProductWithVariables[
																			index
																		].OrderedQty = e.target.value;
																		setChosenProductWithVariables([
																			...chosenProductWithVariables,
																		]);
																	}
																}}
															/>
														</div>
														<div className='form-group mt-1'>
															<label className=''>
																Product Price (Please be careful while adding
																the price manually){" "}
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
										<strong>
											{Number(productsTotalAmount).toFixed(2)} EGP
										</strong>
									</div>
								</div>
							) : null}
						</div>
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

	.productsOnRight {
		.grid-container2 {
			display: grid;
			grid-template-columns: 20% 20% 20% 20% 20%;
			margin: auto;
		}
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
