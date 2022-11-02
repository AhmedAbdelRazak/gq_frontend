/** @format */

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import HeroComponent from "./HeroComponent";
import { getProducts } from "../../apiCore";
import CategoryWrapperComp from "./CategoryWrapperComp";
import FeaturedProducts from "./FeaturedProducts";

const Home = ({ chosenLanguage }) => {
	// eslint-disable-next-line
	const [allProducts, setAllProducts] = useState([]);

	const [allCategories, setAllCategories] = useState([]);

	const gettingAllProducts = () => {
		getProducts().then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllProducts(data.filter((i) => i.activeProduct === true));
				var categoriesArray = data
					.filter((i) => i.activeProduct === true)
					.map((ii) => ii.category);

				let unique = [
					...new Map(
						categoriesArray.map((item) => [item["categoryName"], item]),
					).values(),
				];
				setAllCategories(unique);
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

			<CategoryWrapperComp
				chosenLanguage={chosenLanguage}
				categories={allCategories}
			/>
			<div className='text-center my-5'>
				<FeaturedProducts
					allProducts={allProducts}
					chosenLanguage={chosenLanguage}
				/>
			</div>
		</HomeWrapper>
	);
};

export default Home;

const HomeWrapper = styled.div`
	min-height: 880px;
	overflow-x: hidden;
	background-color: white;
`;
