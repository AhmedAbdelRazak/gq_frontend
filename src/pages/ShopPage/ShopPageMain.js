/** @format */

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getColors, gettingAllProducts } from "../../apiCore";
import MainFilter from "./Filters/MainFilter";
import CardForShop from "./CardForShop";

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
			<span>
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
			{/* <h1 className='my-5'>
				All Products: {allProducts && allProducts.length}
			</h1> */}

			<div className='ml-5 text-center my-3'>
				<div className='row mx-auto'>
					{allProductsAdded &&
						allProductsAdded.map((product, i) => (
							<div
								className='col-lg-3 col-md-6 col-sm-12 mx-auto text-center my-3'
								// style={{ border: "solid black 1px" }}
								key={i}>
								<CardForShop
									product={product}
									key={i}
									chosenLanguage={chosenLanguage}
								/>
							</div>
						))}
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
	}
`;
