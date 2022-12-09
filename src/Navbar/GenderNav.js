/** @format */

import React, { useEffect, useState } from "react";
import { getProducts } from "../apiCore";
import styled from "styled-components";
import { Link } from "react-router-dom";

const GenderNav = () => {
	const [allGenders, setAllGenders] = useState([]);

	const gettingAllProducts = () => {
		getProducts().then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
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
		<GenderNavWrapper>
			<div className='row mx-auto'>
				{allGenders &&
					allGenders.map((g, i) => {
						return (
							<div
								className='col-4 mx-auto genderItem'
								key={i}
								style={{ textTransform: "uppercase" }}>
								<Link
									to={`/our-products?filterby=gender&gendername=${g.genderName}`}>
									{g.genderName}
								</Link>
							</div>
						);
					})}
			</div>
		</GenderNavWrapper>
	);
};

export default GenderNav;

const GenderNavWrapper = styled.div`
	display: none;
	text-align: center;
	background: #f2f2f2;

	.genderItem {
		border: 1px solid #e9e9e9;
		width: 100%;
		padding: 20px 0px;
		font-weight: bold;
	}

	a {
		color: black;
	}

	@media (max-width: 600px) {
		display: block;
	}
`;