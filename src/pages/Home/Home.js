/** @format */

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import HeroComponent from "./HeroComponent";
import { getProducts } from "../../apiCore";
import CategoryWrapperComp from "./CategoryWrapperComp";
import FeaturedProducts from "./FeaturedProducts";
import OurBrandsComp from "./OurBrandsComp";
import MostViewedProducts from "./MostViewedProducts";
import GenderLinks from "./GenderLinks";
import HeroComponent2 from "./HeroComponent2";

const Home = ({ chosenLanguage }) => {
	// eslint-disable-next-line
	const [allProducts, setAllProducts] = useState([]);
	const [allCategories, setAllCategories] = useState([]);
	const [allSubcategories, setAllSubcategories] = useState([]);
	const [allGenders, setAllGenders] = useState([]);

	const gettingAllProducts = () => {
		getProducts().then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllProducts(data.filter((i) => i.activeProduct === true));

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
			}
		});
	};

	useEffect(() => {
		gettingAllProducts();
		// eslint-disable-next-line
	}, []);

	return (
		<HomeWrapper>
			<HeroComponent />

			<GenderLinks allGenders={allGenders} />

			<CategoryWrapperComp
				chosenLanguage={chosenLanguage}
				categories={allCategories}
			/>

			<HeroComponent2 />

			<div className='my-5'>
				<FeaturedProducts
					allProducts={allProducts}
					chosenLanguage={chosenLanguage}
				/>
			</div>

			<div className='text-center my-5'>
				<OurBrandsComp
					chosenLanguage={chosenLanguage}
					allSubcategories={allSubcategories}
				/>
			</div>
			<br />
			<hr />
			<br />
			<MostViewedProducts chosenLanguage={chosenLanguage} />

			<br />
			<hr />
			<br />
		</HomeWrapper>
	);
};

export default Home;

const HomeWrapper = styled.div`
	min-height: 880px;
	overflow-x: hidden;
	background-color: white;
`;
