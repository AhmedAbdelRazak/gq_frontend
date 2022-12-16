/** @format */

import Slider from "react-slick";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getAllAds } from "../Admin/apiAdmin";

const NavbarAds = () => {
	const [allAdsCombined, setAllAdsCombined] = useState([]);

	const gettingAllAds = () => {
		getAllAds().then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllAdsCombined(
					data[data.length - 1] && data[data.length - 1].ad_Name,
				);
			}
		});
	};

	useEffect(() => {
		gettingAllAds();
		// eslint-disable-next-line
	}, []);

	const settings = {
		dots: true,
		dotsClass: "slick-dots",
		infinite: true,
		speed: 2000,
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		autoplay: true,
		autoplaySpeed: 7000,
		pauseOnHover: true,
	};

	return (
		<div style={{ backgroundColor: "white", padding: "10px" }}>
			{" "}
			<NavbarAdsWrapper className='mx-auto'>
				<div className='nav-item mainMessages '>
					<Slider {...settings}>
						{allAdsCombined &&
							allAdsCombined.map((i, e) => {
								return (
									<>
										<div key={e}>
											<span>{i}</span>
										</div>
									</>
								);
							})}
					</Slider>
				</div>
			</NavbarAdsWrapper>
		</div>
	);
};

export default NavbarAds;

const NavbarAdsWrapper = styled.nav`
	text-align: center;
	padding-top: 10px;
	padding-bottom: 22px;
	width: 70%;
	/* box-shadow: 8px 10px 5px 0px rgba(0, 0, 0, 0.02); */
	background: white !important;
	border: 1px #f5f5f5 solid;

	.slick-dots li button:hover:before,
	.slick-dots li button:focus:before {
		opacity: 1;
	}
	.slick-dots li button:before {
		font-size: 8px;
		text-align: center;
		opacity: 0.25;
		color: var(--darkGrey);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	.slick-dots li.slick-active button:before {
		opacity: 1;
		color: #898989;
		/* font-weight: bold; */
	}

	.mainMessages {
		color: #000;

		font-weight: bold;
		/* font-style: italic; */
		text-align: center;
		font-size: 0.82rem;
	}

	@media (max-width: 1400px) {
		.mainMessages {
			color: #000;
			font-weight: bold;
			/* font-style: italic; */
			text-align: center;
			font-size: 0.75rem;
		}
	}
	@media (max-width: 900px) {
		width: 100%;
		box-shadow: none;
		margin: 0 !important;

		.mainMessages {
			color: #000;
			font-weight: bold;
			/* font-style: italic; */
			text-align: center;
			font-size: 0.75rem;
		}
		.slick-dots li button:before {
			font-size: 10px;
		}
	}
`;
