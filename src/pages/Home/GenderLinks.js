/** @format */

import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const GenderLinks = ({ allGenders }) => {
	return (
		<GenderLinksWrapper>
			<h1 className='title mb-3'>Gender</h1>
			<div className='container'>
				<div className='text-center row mx-auto'>
					{allGenders &&
						allGenders.map((g, i) => {
							return (
								<div
									key={i}
									className='col-lg-2 col-md-4 col-sm-6 col-6 mx-auto text-center'>
									<Link
										to={`/our-products?filterby=gender&gendername=${g.genderName}`}>
										<img
											src={g.thumbnail && g.thumbnail[0] && g.thumbnail[0].url}
											alt={g.genderName}
											className='mb-4 '
											style={{ height: "230px", width: "230px" }}
										/>
										<br />
										<span className='GenderText mb-5'>{g.genderName}</span>
									</Link>
								</div>
							);
						})}
				</div>
			</div>
		</GenderLinksWrapper>
	);
};

export default GenderLinks;

const GenderLinksWrapper = styled.div`
	margin-top: 70px;

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

	img {
		/* box-shadow: 1px 1px 2.5px 2.5px rgba(0, 0, 0, 0.3); */
		border: 2px white solid;
		border-radius: 10px 10px;
		transition: 1s;
	}

	img:hover {
		border-radius: 10px 10px;
		transition: 0.5s;
		height: 205px !important;
		width: 205px !important;
		box-shadow: 5px 5px 2px 2px rgba(0, 0, 0, 0.5);
	}

    .GenderText {
		font-size: 1.1rem;
		text-align: center;
		margin-bottom: 7px;
		/* font-style: italic; */
		font-weight: bold;
		/* letter-spacing: 3px; */
		/* text-shadow: 1px 4px 3px rgba(0, 0, 0, 0.5); */
		color: #330000;
        text-transform: capitalize;

	}


    @media (max-width: 900px) {
		img {
			/* box-shadow: 1px 1px 2.5px 2.5px rgba(0, 0, 0, 0.3); */
			border: 2px white solid;
			border-radius: 10px 10px;
			transition: 1s;
		}
		.GenderText {
			font-size: 1.1rem;
			text-align: center;
			margin-bottom: 7px;
			/* font-style: italic; */
			font-weight: bold;
			letter-spacing: 3px;
			/* text-shadow: 1px 4px 3px rgba(0, 0, 0, 0.5); */
			color: #330000;
		}

		img:hover {
		border-radius: 10px 10px;
		transition: 0.5s;
		height: 205px !important;
		width: 205px !important;
		box-shadow: 5px 5px 2px 2px rgba(0, 0, 0, 0.5);
	}
	}
	@media (max-width: 700px) {
		img {
			/* box-shadow: 1px 1px 2.5px 2.5px rgba(0, 0, 0, 0.3); */
			border: 2px white solid;
			border-radius: 10px 10px;
			transition: 1s;
			width: 175px !important;
			height: 175px !important;
		}
		.GenderText {
			font-size: 1rem;
			text-align: center;
			margin-bottom: 7px;
			/* font-style: italic; */
			/* font-weight: bold; */
			letter-spacing: 3px;
			/* text-shadow: 1px 4px 3px rgba(0, 0, 0, 0.5); */
			color: #330000;
			display: none;
		}

		img:hover {
		border-radius: 10px 10px;
		transition: 0.5s;
		height: 205px !important;
		width: 205px !important;
		box-shadow: 5px 5px 2px 2px rgba(0, 0, 0, 0.5);
	}
`;
