/** @format */

import React from "react";
import styled from "styled-components";
import CardInHomePage from "./CardInHomePage";
import Slider from "react-slick";

const FeaturedProducts = ({ allProducts, chosenLanguage }) => {
	var allFeaturedProducts =
		allProducts &&
		allProducts
			.filter((i) => i.featuredProduct === true)
			.map((ii) => {
				return {
					...ii,
					quantity: 12,
				};
			});

	const settings = {
		dots: true,
		infinite: true,
		autoplay: true,
		arrows: true,
		speed: 1000,
		slidesToShow: 4,
		slidesToScroll: 1,
		autoplaySpeed: 5000,
		pauseOnHover: true,
		adaptiveHeight: true,

		responsive: [
			{
				breakpoint: 1200,
				settings: {
					dots: true,
					infinite: true,
					autoplay: true,
					arrows: true,
					speed: 1000,
					slidesToShow: 2,
					slidesToScroll: 1,
					autoplaySpeed: 5000,
					pauseOnHover: true,
					adaptiveHeight: true,
				},
			},
		],
	};

	return (
		<FeaturedProductsWrapper>
			<div
				className={
					chosenLanguage === "Arabic" ? "titleArabic mb-2" : "title mb-2"
				}>
				<h1 className={chosenLanguage === "Arabic" ? "titleArabic" : "title"}>
					{chosenLanguage === "Arabic" ? "منتجات مميزة" : "Featured Products"}{" "}
				</h1>
			</div>
			<div className='container-fluid my-3 ProductSlider'>
				<Slider {...settings} className='mb-5'>
					{allFeaturedProducts &&
						allFeaturedProducts.map((product, i) => (
							<div className='img-fluid images ' key={i}>
								<CardInHomePage
									product={product}
									key={i}
									chosenLanguage={chosenLanguage}
								/>
							</div>
						))}
				</Slider>
			</div>
		</FeaturedProductsWrapper>
	);
};

export default FeaturedProducts;

const FeaturedProductsWrapper = styled.div`
	margin-top: 50px;

	.title {
		text-align: center;
		font-size: 2rem;
		letter-spacing: 7px;
		font-weight: bold;
		/* color: #ffc4c4; */
		color: #ff7676;
		/* text-shadow: 3px 3px 10px; */
	}

	.titleArabic {
		text-align: center;
		font-size: 2rem;
		/* letter-spacing: 7px; */
		font-weight: bold;
		color: #ffc4c4;
		font-family: "Droid Arabic Kufi";
		/* text-shadow: 3px 3px 10px; */
	}

	.images {
		margin-left: 20px;
		margin-bottom: 30px;
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
