/** @format */

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getColors, gettingAllProducts } from "../../apiCore";
import MainFilter from "./Filters/MainFilter";
import CardForShop from "./CardForShop";
// import { FilterTwoTone } from "@ant-design/icons";

const ShopPageMain = ({ chosenLanguage }) => {
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
	const [usedFilters, setUsedFilters] = useState([]);
	const [allColors, setAllColors] = useState([]);
	const [selectedPriceRange, setSelectedPriceRange] = useState(0);
	const [minPrice, setMinPrice] = useState(0);
	const [maxPrice, setMaxPrice] = useState(0);

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
		if (filterBy && urlFilters) {
			setUsedFilters([
				{
					filterBy: filterBy,
					filterByType: [urlFilters],
				},
			]);
		}
		gettingAllColors();
		gettingAllProducts(
			filterBy,
			urlFilters,
			setAllProducts,
			setAllCategories,
			setAllSubcategories,
			setAllSizes,
			setAllProductColors,
			setAllGenders,
			setSelectedPriceRange,
			setMinPrice,
			setMaxPrice,
			selectedPriceRange,
		);

		// eslint-disable-next-line
	}, []);

	// const returnFinalProducts = () => {
	// 	var filteredByCategories =
	// 		usedFilters &&
	// 		usedFilters
	// 			.filter((ii) => ii.filterBy === "category")
	// 			.map((iii) => iii.filterByType)[0];

	// 	var finalProducts =
	// 		allProducts &&
	// 		allProducts.filter(
	// 			(i) =>
	// 				filteredByCategories &&
	// 				filteredByCategories.indexOf(i.category.categorySlug) !== -1,
	// 		);

	// 	return finalProducts;
	// };

	// console.log(returnFinalProducts(), "returnFinalProducts");
	// console.log(usedFilters, "usedFilters");

	var allProductsAdded =
		allProducts &&
		allProducts.map((ii) => {
			return {
				...ii,
				quantity: 12,
			};
		});

	return (
		<ShopPageMainWrapper>
			<div className='heroFilter'>
				<div className='titleWrapper'>
					<h5>{urlFilters ? urlFilters : ""}</h5>
					<h2>All products</h2>
				</div>
			</div>
			<span className='filters_desktop'>
				<MainFilter
					clickedItem={clickedItem}
					setClickedItem={setClickedItem}
					filterItemClicked={filterItemClicked}
					setFilterItemClicked={setFilterItemClicked}
					allCategories={allCategories}
					allProductColors={allProductColors}
					allSizes={allSizes}
					usedFilters={usedFilters}
					setUsedFilters={setUsedFilters}
					allColors={allColors}
					selectedPriceRange={selectedPriceRange}
					setSelectedPriceRange={setSelectedPriceRange}
					minPrice={minPrice}
					maxPrice={maxPrice}
				/>
			</span>
			<div className='filtersPhone'>
				FILTERS:{" "}
				<svg
					width='24px'
					height='24px'
					viewBox='0 0 24 24'
					version='1.1'
					role='img'>
					<path
						d='M3,16.75 L3,15.25 L11.5805101,15.2501592 C11.9237855,13.6774884 13.3243842,12.5 15,12.5 C16.6756158,12.5 18.0762145,13.6774884 18.4194899,15.2501592 L21,15.25 L21,16.75 L18.4192733,16.7508322 C18.0756259,18.3230064 16.6752637,19.5 15,19.5 C13.3247363,19.5 11.9243741,18.3230064 11.5807267,16.7508322 L3,16.75 Z M15,14 C13.8954305,14 13,14.8954305 13,16 C13,17.1045695 13.8954305,18 15,18 C16.1045695,18 17,17.1045695 17,16 C17,14.8954305 16.1045695,14 15,14 Z M3,8.75 L3,7.25 L5.58051014,7.25015916 C5.92378549,5.67748844 7.32438416,4.5 9,4.5 C10.6756158,4.5 12.0762145,5.67748844 12.4194899,7.25015916 L21,7.25 L21,8.75 L12.4192733,8.75083217 C12.0756259,10.3230064 10.6752637,11.5 9,11.5 C7.32473626,11.5 5.92437411,10.3230064 5.58072667,8.75083217 L3,8.75 Z M9,6 C7.8954305,6 7,6.8954305 7,8 C7,9.1045695 7.8954305,10 9,10 C10.1045695,10 11,9.1045695 11,8 C11,6.8954305 10.1045695,6 9,6 Z'
						id='Combined-Shape'></path>
				</svg>
			</div>

			{/* <h1 className='my-5'>
				All Products: {allProducts && allProducts.length}
			</h1> */}

			<div className='cardWrapper'>
				<div className='row '>
					<div className='grid-container'>
						{allProductsAdded &&
							allProductsAdded.map((product, i) => (
								<CardForShop
									i={i}
									product={product}
									key={i}
									chosenLanguage={chosenLanguage}
								/>
							))}
					</div>

					<hr />
				</div>
			</div>
		</ShopPageMainWrapper>
	);
};

export default ShopPageMain;

const ShopPageMainWrapper = styled.div`
	min-height: 700px;
	background: white;
	transition: 0.3s;
	overflow: hidden;

	.filters_desktop {
		display: block;
	}

	.filtersPhone {
		display: none;
	}

	.grid-container {
		display: grid;
		grid-template-columns: 25% 25% 25% 25%;
		margin: auto 20px;
	}

	.cardWrapper {
		margin-right: 20px;
		margin-left: 20px;
		padding: 0px !important;
	}

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

	.ProductSlider {
		padding: 0px 100px 0px 100px;
	}

	@media (max-width: 1400px) {
		.ProductSlider {
			padding: 0px;
		}
	}
	@media (max-width: 1200px) {
		.ProductSlider {
			padding: 0px 10px 0px 10px;
		}

		.title {
			font-size: 1rem;
			font-weight: bold;
			/* text-shadow: 3px 3px 10px; */
		}

		.titleArabic {
			text-align: center;
			font-size: 1.2rem;
			/* letter-spacing: 7px; */
			font-weight: bold;
			/* text-shadow: 3px 3px 10px; */
		}

		.cardWrapper {
			margin: 30px auto !important;
			padding: 0px !important;
		}

		.grid-container {
			display: grid;
			grid-template-columns: 50% 49%;
			margin: auto 20px;
		}

		.heroFilter {
			min-height: 165px;
		}

		.filters_desktop {
			display: none;
		}

		.filtersPhone {
			display: block;
			margin-top: 10px;
			margin-left: 14px;
			font-weight: bolder;
		}
	}
`;
