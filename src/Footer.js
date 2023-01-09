/** @format */

import React from "react";
import styled from "styled-components";

const Footer = () => {
	return (
		<Wrapper>
			<div className='bottomWrapper'>
				<h5>
					&copy; {new Date().getFullYear()}
					<span> G&Q Factory</span>
					{"    "}
				</h5>
				<h5 className='ml-2'> All rights reserved</h5>
			</div>
		</Wrapper>
	);
};

const Wrapper = styled.footer`
	background: white;
	padding-top: 8px;

	.flags {
		width: 1.2%;
	}

	.footerLinks {
		font-size: 1rem;
		font-weight: bold;
		color: #5d5d5d;
	}

	.footerLinks > a {
		font-size: 1rem;
		font-weight: bold;
		color: #5d5d5d;
	}

	.paymentImages {
		margin-top: 10px;
		text-align: center;
	}

	.paymentImages > img {
		margin-right: 10px;
		width: 4%;
		text-align: center;
	}

	.bottomWrapper {
		height: 5rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: white;
		text-align: center;
		/* margin-top: 100px; */

		span {
			color: #004080;
			font-weight: bold;
		}
		h5 {
			color: black;
			font-weight: 400;
			text-transform: none;
			line-height: 1.25;
		}
		@media (min-width: 776px) {
			flex-direction: row;
		}
	}

	@media (max-width: 1000px) {
		.paymentImages > img {
			width: 10%;
			text-align: center;
		}
		.flags {
			width: 3%;
		}
		h5 {
			font-size: 1rem;
		}
	}
`;

export default Footer;
