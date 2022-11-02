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
	.ProductSlider {
		padding: 0px 100px 0px 100px;
	}

	@media (max-width: 1400px) {
		.ProductSlider {
			padding: 0px;
		}
	}
`;
