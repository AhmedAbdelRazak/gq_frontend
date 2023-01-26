/** @format */

import React, { useState, useEffect } from "react";
import styled from "styled-components";
// eslint-disable-next-line
import { isAuthenticated } from "../../../../auth";
// eslint-disable-next-line
import { getColors, getProducts } from "../../../apiAdmin";
import LogoImage from "../../../../GeneralImages/Logo2.png";
import { FilterFilled } from "@ant-design/icons";
import ProductsPrview from "./ProductsPreview";
import OrderedItems from "./OrderedItems";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import FiltersModal from "./FiltersModal";
import FinalBarcodePrint from "./FinalBarcodePrint";

const PrintBarcodesMain = () => {
	const [modalVisible, setModalVisible] = useState(false);
	const [modalVisible2, setModalVisible2] = useState(false);
	const [allProducts, setAllProducts] = useState([]);
	const [allProductsAll, setAllProductsAll] = useState([]);
	const [allCategories, setAllCategories] = useState([]);
	const [allGenders, setAllGenders] = useState([]);
	// eslint-disable-next-line
	const [allColors, setAllColors] = useState([]);
	const [allSubSKUs, setAllSubSKUs] = useState([]);
	const [chosenSubSKUs, setChosenSubSKUs] = useState([]);
	const [chosenProducts, setChosenProducts] = useState([]);

	const [genderFilter, setGenderFilter] = useState("men");
	const [categoryFilter, setCategoryFilter] = useState("");
	const [chosenProductWithVariables, setChosenProductWithVariables] = useState(
		[],
	);

	const [currentPage, setCurrentPage] = useState(1);
	// eslint-disable-next-line
	const [postsPerPage, setPostsPerPage] = useState(15);

	// eslint-disable-next-line
	const { user, token } = isAuthenticated();

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

				const quantityReceivedFuntion = (requiredSKU) => {
					return 1;
				};

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
								receivedQuantity: quantityReceivedFuntion(ii.SubSKU),
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
							quantity: quantityReceivedFuntion(i.SubSKU),
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

	// Get current posts
	const indexOfLastPost = currentPage * postsPerPage;
	const indexOfFirstPost = indexOfLastPost - postsPerPage;
	const currentPosts = allProducts.slice(indexOfFirstPost, indexOfLastPost);

	// Change page
	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	let productsTotalAmount =
		chosenProductWithVariables &&
		chosenProductWithVariables
			.map((i) => Number(i.OrderedQty) * Number(i.pickedPrice))
			.reduce((a, b) => a + b, 0);

	return (
		<PrintBarcodesMainWrapper>
			<div className=''>
				<div style={{ padding: "30px 0px", background: "rgb(198,14,14)" }}>
					<img
						className='imgLogo2'
						src={LogoImage}
						alt='Infinite Apps'
						style={{
							width: "80px",
							position: "absolute",
							top: "10px",
							padding: "0px",
							left: "20px",
							background: "#c60e0e",
							border: "#c60e0e solid 1px",
						}}
					/>
					<span
						style={{
							fontSize: "1.2rem",
							marginLeft: "42%",
							color: "white",
							position: "absolute",
							top: "15px",
						}}>
						Barcode Print
					</span>
				</div>

				<div className='mainContent' style={{ margin: "0px 30px" }}>
					<div className='col-md-12 '>
						<div
							className='posWrapper'
							style={{
								// border: "2px lightgrey solid",
								borderRadius: "5px",
								// background: "white",
							}}>
							<div
								className='row mx-3'
								style={{
									minHeight: "720px",
									borderBottom: "3px grey solid",
								}}>
								<OrderedItems
									chosenProductWithVariables={chosenProductWithVariables}
									chosenSubSKUs={chosenSubSKUs}
									setChosenSubSKUs={setChosenSubSKUs}
									chosenProducts={chosenProducts}
									setChosenProductWithVariables={setChosenProductWithVariables}
									setChosenProducts={setChosenProducts}
									allProductsAll={allProductsAll}
									allColors={allColors}
									allSubSKUs={allSubSKUs}
									productsTotalAmount={productsTotalAmount}
								/>

								<FiltersModal
									modalVisible={modalVisible}
									setModalVisible={setModalVisible}
									allCategories={allCategories}
									allGenders={allGenders}
									setGenderFilter={setGenderFilter}
									setCategoryFilter={setCategoryFilter}
								/>

								<ProductsPrview
									allProducts={allProducts}
									allProductsAll={allProductsAll}
									allSubSKUs={allSubSKUs}
									chosenProductWithVariables={chosenProductWithVariables}
									chosenSubSKUs={chosenSubSKUs}
									setChosenProductWithVariables={setChosenProductWithVariables}
									setChosenSubSKUs={setChosenSubSKUs}
									FilterFilled={FilterFilled}
									postsPerPage={postsPerPage}
									totalPosts={allProducts.length}
									paginate={paginate}
									currentPage={currentPage}
									currentPosts={currentPosts}
									setModalVisible={setModalVisible}
								/>

								<FinalBarcodePrint
									modalVisible={modalVisible2}
									setModalVisible={setModalVisible2}
									allChosenProducts={chosenProductWithVariables}
									allColors={allColors}
								/>
							</div>
							<div className='row'>
								<div className='col-6'>
									<div className='row'>
										<div
											className='col-6 mt-3'
											// style={{ border: "1px black solid" }}
										>
											<div className='row'>
												<div className='col-7 mx-auto'>
													<button
														onClick={() => setModalVisible2(true)}
														style={{
															background: "#004d00",
															border: "none",
															padding: "20px 30px",
															color: "white",
															fontWeight: "bold",
															borderRadius: "10px",
															fontSize: "1.2rem",
														}}>
														PRINT BARCODE
													</button>
													<br />
													<button
														onClick={() => {
															setChosenSubSKUs([]);
															setChosenProductWithVariables([]);
															setChosenProducts([]);
														}}
														style={{
															background: "darkred",
															border: "none",
															padding: "5px",
															color: "white",
															fontWeight: "bold",
															borderRadius: "10px",
															marginLeft: "70px",
															marginTop: "10px",
														}}>
														CLEAR
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</PrintBarcodesMainWrapper>
	);
};

export default PrintBarcodesMain;

const PrintBarcodesMainWrapper = styled.div`
	min-height: 880px;
	margin-bottom: 100px;

	.grid-container {
		display: grid;
		grid-template-columns: ${(props) => (props.show ? "8% 92%" : "15% 85%")};
		margin: auto;
	}

	.productsOnRight {
		padding: 0px;

		.grid-container2 {
			display: grid;
			grid-template-columns: 18.5% 18.5% 18.5% 18.5% 18.5%;
			margin: auto;
			padding-left: 2px;
			text-align: center;
		}
	}

	.grid-container3 {
		display: grid;
		margin: auto;
		grid-template-columns: 25% 25% 25% 25%;
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
