/** @format */

import { ArrowDownOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getProducts } from "../../apiCore";

const isActive = (c, sureClickedLink, filterItemClicked) => {
	if (c === sureClickedLink && filterItemClicked) {
		return {
			background: "rgb(245, 245, 245)",
			transition: "0.3s",
			padding: "3px",
			color: "black",
			fontWeight: "bold",
		};
	} else {
		return {
			margin: "0px 20px",
			textTransform: "uppercase",
			fontSize: "1rem",
			fontWeight: "bold",
			color: "#767676",
			transition: "0.3s",
			padding: "3px",
		};
	}
};

const ShopPageMain = (props) => {
	const [allProducts, setAllProducts] = useState([]);
	const [allCategories, setAllCategories] = useState([]);
	// eslint-disable-next-line
	const [allSubcategories, setAllSubcategories] = useState([]);
	// eslint-disable-next-line
	const [allGenders, setAllGenders] = useState([]);
	const [allSizes, setAllSizes] = useState([]);
	const [allProductColors, setAllProductColors] = useState([]);
	const [filterItemClicked, setFilterItemClicked] = useState(false);
	const [clickedItem, setClickedItem] = useState("");

	const gettingAllProducts = (filterBy, urlFilters) => {
		getProducts().then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				if (filterBy === "gender") {
					setAllProducts(
						data
							.filter((i) => i.activeProduct === true)
							.filter(
								(iii) =>
									iii.gender.genderName.toLowerCase() ===
									urlFilters.toLowerCase(),
							),
					);
				} else if (filterBy === "category") {
					setAllProducts(
						data
							.filter((i) => i.activeProduct === true)
							.filter(
								(iii) =>
									iii.category.categorySlug.toLowerCase() ===
									urlFilters.toLowerCase(),
							),
					);
				} else if (filterBy === "subcategory") {
					setAllProducts(
						data
							.filter((i) => i.activeProduct === true)
							.filter(
								(iii) =>
									iii.subcategory
										.map((iiii) => iiii.SubcategorySlug)
										.indexOf(urlFilters.toLowerCase()) !== -1,
							),
					);
				} else {
					setAllProducts(data.filter((i) => i.activeProduct === true));
				}

				//Categories Unique
				var categoriesArray = data
					.filter((i) => i.activeProduct === true)
					.map((ii) => ii.category);

				let uniqueCategories = [
					...new Map(
						categoriesArray.map((item) => [item["categoryName"], item]),
					).values(),
				];
				setAllCategories(uniqueCategories);

				//Subcategories Unique
				var SubcategoriesArray = data
					.filter((i) => i.activeProduct === true)
					.map((ii) => ii.subcategory);

				var mergedSubcategories = [].concat.apply([], SubcategoriesArray);
				let uniqueSubcategories = [
					...new Map(
						mergedSubcategories.map((item) => [item["SubcategoryName"], item]),
					).values(),
				];
				setAllSubcategories(uniqueSubcategories);

				//Gender Unique
				var genderUnique = data
					.filter((i) => i.activeProduct === true)
					.map((ii) => ii.gender);

				let uniqueGenders = [
					...new Map(
						genderUnique.map((item) => [item["genderName"], item]),
					).values(),
				];
				setAllGenders(uniqueGenders);

				//Unique Sizes
				const allSizes = data
					.filter((i) => i.activeProduct === true)
					.map((i) => i.productAttributes.map((ii) => ii.size));

				var mergedSizes = [].concat.apply([], allSizes);

				let uniqueSizes = [
					...new Map(mergedSizes.map((item) => [item, item])).values(),
				];
				setAllSizes(uniqueSizes);

				//Unique Colors
				const allColorsCombined = data
					.filter((i) => i.activeProduct === true)
					.map((i) => i.productAttributes.map((ii) => ii.color));

				var mergedColors = [].concat.apply([], allColorsCombined);

				let uniqueColors = [
					...new Map(mergedColors.map((item) => [item, item])).values(),
				];
				setAllProductColors(uniqueColors);
			}
		});
	};

	//getting filters from URL
	const filterPath = window.location.search;
	const urlFiltersHelper = filterPath
		.substring(filterPath.indexOf("=") + 1)
		.trim()
		.toLowerCase();

	const urlFilters = urlFiltersHelper.substring(
		urlFiltersHelper.indexOf("=") + 1,
	);

	const filterBy = filterPath.substring(
		filterPath.indexOf("=") + 1,
		filterPath.indexOf("&"),
	);

	useEffect(() => {
		gettingAllProducts(filterBy, urlFilters);

		// eslint-disable-next-line
	}, []);

	return (
		<ShopPageMainWrapper show={filterItemClicked}>
			<div className='heroFilter'>
				<div className='titleWrapper'>
					<h5>{urlFilters ? urlFilters : ""}</h5>
					<h2>All products</h2>
				</div>
			</div>
			<div
				className='filtersWrapper'
				onMouseLeave={() => {
					setFilterItemClicked(false);
				}}>
				<strong className='filterTitle'>Filters: </strong>
				<span
					className='filtersItem'
					style={isActive("productType", clickedItem, filterItemClicked)}
					onClick={() => {
						if (filterItemClicked) {
							if (clickedItem === "productType") {
								setFilterItemClicked(!filterItemClicked);
							} else {
								setClickedItem("productType");
							}
						} else {
							setFilterItemClicked(!filterItemClicked);
							setClickedItem("productType");
						}
					}}>
					Product Type{" "}
					<span className='arrowDownIcon'>
						<ArrowDownOutlined />
					</span>{" "}
				</span>
				<span
					className='filtersItem'
					style={isActive("size", clickedItem, filterItemClicked)}
					onClick={() => {
						if (filterItemClicked) {
							if (clickedItem === "size") {
								setFilterItemClicked(!filterItemClicked);
							} else {
								setClickedItem("size");
							}
						} else {
							setFilterItemClicked(!filterItemClicked);
							setClickedItem("size");
						}
					}}>
					Size{" "}
					<span className='arrowDownIcon'>
						<ArrowDownOutlined />
					</span>{" "}
				</span>
				<span
					className='filtersItem'
					style={isActive("color", clickedItem, filterItemClicked)}
					onClick={() => {
						if (filterItemClicked) {
							if (clickedItem === "color") {
								setFilterItemClicked(!filterItemClicked);
							} else {
								setClickedItem("color");
							}
						} else {
							setFilterItemClicked(!filterItemClicked);
							setClickedItem("color");
						}
					}}>
					Color{" "}
					<span className='arrowDownIcon'>
						<ArrowDownOutlined />
					</span>{" "}
				</span>
				<span
					className='filtersItem'
					style={isActive("price", clickedItem, filterItemClicked)}
					onClick={() => {
						if (filterItemClicked) {
							if (clickedItem === "price") {
								setFilterItemClicked(!filterItemClicked);
							} else {
								setClickedItem("price");
							}
						} else {
							setFilterItemClicked(!filterItemClicked);
							setClickedItem("price");
						}
					}}>
					Price{" "}
					<span className='arrowDownIcon'>
						<ArrowDownOutlined />
					</span>{" "}
				</span>
				<span
					className='filtersItem'
					style={isActive("sortBy", clickedItem, filterItemClicked)}
					onClick={() => {
						if (filterItemClicked) {
							setClickedItem("sortBy");
							if (clickedItem === "sortBy") {
								setFilterItemClicked(!filterItemClicked);
							} else {
								setClickedItem("sortBy");
							}
						} else {
							setFilterItemClicked(!filterItemClicked);
							setClickedItem("sortBy");
						}
					}}>
					Sort By{" "}
					<span className='arrowDownIcon'>
						<ArrowDownOutlined />
					</span>{" "}
				</span>

				{clickedItem === "productType" && (
					<div className='filterClickedWrapper'>
						{allCategories &&
							allCategories.map((c, i) => {
								return (
									<label htmlFor={c} className='block ' key={i}>
										<input
											type='checkbox'
											id={c}
											// onChange={handleQueryChange_WorkingHours}
											value={c.categoryName}
											className='m-3'
											// checked={
											// 	PreviousAddedHours &&
											// 	PreviousAddedHours.hoursCanBeScheduled &&  PreviousAddedHours.hoursCanBeScheduled.indexOf(
											// 		h,
											// 	) !== -1
											// }
										/>
										{c.categoryName}
									</label>
								);
							})}
					</div>
				)}

				{clickedItem === "size" && (
					<div className='filterClickedWrapper'>
						{allSizes &&
							allSizes.map((s, i) => {
								return (
									<label htmlFor={s} className='block ' key={i}>
										<input
											type='checkbox'
											id={s}
											// onChange={handleQueryChange_WorkingHours}
											value={s}
											className='m-3'
											// checked={
											// 	PreviousAddedHours &&
											// 	PreviousAddedHours.hoursCanBeScheduled &&  PreviousAddedHours.hoursCanBeScheduled.indexOf(
											// 		h,
											// 	) !== -1
											// }
										/>
										{s}
									</label>
								);
							})}
					</div>
				)}

				{clickedItem === "color" && (
					<div className='filterClickedWrapper'>
						{allProductColors &&
							allProductColors.map((c, i) => {
								return (
									<label htmlFor={c} className='block  m-2' key={i}>
										<span
											className='squareColor'
											style={{ background: c }}></span>

										{c}
									</label>
								);
							})}
					</div>
				)}
			</div>
			<h1 className='mt-5'>
				All Products: {allProducts && allProducts.length}
			</h1>
		</ShopPageMainWrapper>
	);
};

export default ShopPageMain;

const ShopPageMainWrapper = styled.div`
	min-height: 700px;
	background: white;
	transition: 0.3s;

	.heroFilter {
		background: rgb(245, 245, 245);
		min-height: 200px;
	}
	h2 {
		color: rgb(0, 0, 0);
		margin: 0px;
		text-transform: uppercase;
		font-size: 2rem;
		font-weight: 700;
	}

	h5 {
		color: rgb(0, 0, 0);
		margin: 0px;
		text-transform: uppercase;
		font-size: 1.2rem;
		font-weight: 700;
	}

	.titleWrapper {
		position: absolute;
		margin-left: 50px;
		margin-top: 60px;
	}

	.filtersWrapper {
		margin: 0px 0px 0px 50px;
		/* border: 2px red solid; */
	}

	.filterTitle {
		text-transform: uppercase;
		letter-spacing: 1px;
		font-size: 1rem;
		color: black;
	}

	.filtersItem {
		margin: 0px 20px;
		text-transform: uppercase;
		font-size: 1rem;
		font-weight: bold;
		color: #767676;
		transition: 0.3s;
		padding: 3px;
	}

	.filtersItem:hover {
		cursor: pointer;
		background: rgb(245, 245, 245);
		transition: 0.3s;
		padding: 3px;
	}

	.arrowDownIcon {
		font-size: 1.2rem;
		font-weight: bolder;
	}

	.filterClickedWrapper {
		background: ${(props) => (props.show ? "rgb(245, 245, 245)" : "")};
		min-height: ${(props) => (props.show ? "70px" : "")};
		animation: ${(props) => (props.show ? "fadeIn 0.5s linear forwards" : "")};
		transition: 0.3s;
		text-transform: capitalize;
	}

	.filterClickedWrapper > label {
		display: ${(props) => (props.show ? "" : "none")};
	}

	.squareColor {
		padding: 4px 15px;
		border-radius: 2px;
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
		} // CSS properties at start
		100% {
			opacity: 1;
		} // CSS properties at end
	}
`;
