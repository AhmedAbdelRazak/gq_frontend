/** @format */

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getColors } from "../../apiCore";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useCartContext } from "../cart_context";
import { Link } from "react-router-dom";

const CheckoutCartItems = ({ chosenLanguage }) => {
	// eslint-disable-next-line
	const [relatedProducts, setRelatedProducts] = useState([]);

	const [allColors, setAllColors] = useState([]);

	const {
		cart,
		toggleAmount,
		// eslint-disable-next-line
		total_amount,
		// eslint-disable-next-line
		shipping_fee,
		changeSize,
		changeColor,
	} = useCartContext();

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
		if (
			cart &&
			cart[0] &&
			cart[0].relatedProducts &&
			cart[0].relatedProducts.length > 0
		) {
			setRelatedProducts(cart[0].relatedProducts);
		} else if (
			cart &&
			cart[1] &&
			cart[1].relatedProducts &&
			cart[1].relatedProducts.length > 0
		) {
			setRelatedProducts(cart[1].relatedProducts);
		} else {
			setRelatedProducts([]);
		}
		gettingAllColors();

		// eslint-disable-next-line
	}, []);

	var checkingAvailability = [];
	return (
		<CheckoutCartItemsWrapper>
			<div className='cellPhoneLayout mt-5'>
				{cart.map((i, k) => {
					var productColors = i.allProductDetailsIncluded.productAttributes.map(
						(iii) => iii.color,
					);
					var uniqueProductColors = [
						...new Map(productColors.map((item) => [item, item])).values(),
					];

					var productSizes = i.allProductDetailsIncluded.productAttributes.map(
						(iii) => iii.size,
					);
					var uniqueProductSizes = [
						...new Map(productSizes.map((item) => [item, item])).values(),
					];

					var chosenAttribute =
						i.allProductDetailsIncluded.productAttributes.filter(
							(iii) => iii.color === i.color && iii.size === i.size,
						)[0];

					if (i.allProductDetailsIncluded.activeBackorder) {
						checkingAvailability.push(true);
					} else {
						checkingAvailability.push(chosenAttribute.quantity >= i.amount);
					}

					const increase = () => {
						toggleAmount(i.id, "inc", chosenAttribute, i.max);
					};
					const decrease = () => {
						toggleAmount(i.id, "dec", chosenAttribute, i.max);
					};

					return (
						<div key={k} className='mt-2'>
							<div className='row'>
								<div className='col-2'>
									<span>
										<img
											src={i.image}
											alt={i.name}
											style={{ width: "80px", height: "80px" }}
										/>
									</span>
								</div>
								<div className='col-9 mx-auto my-auto'>
									<div
										style={{
											fontSize: "12px",
											fontWeight: "bold",
											marginLeft: "0px",
											textTransform: "uppercase",
										}}>
										{chosenLanguage === "Arabic" ? i.nameArabic : i.name}
									</div>
									<div className='my-2'>
										<span className='mr-1'>Size: </span>
										<select
											style={{
												textTransform: "capitalize",
												minWidth: "40%",
												border: "lightgrey solid 1px",
											}}
											onChange={(e) => {
												var chosenAttribute2 =
													i.allProductDetailsIncluded.productAttributes.filter(
														(iii) =>
															iii.color === i.color &&
															iii.size.toLowerCase() ===
																e.target.value.toLowerCase(),
													)[0];
												changeSize(
													i.id,
													e.target.value,
													i.color,
													chosenAttribute2.quantity,
													i.size,
												);
											}}>
											<option style={{ textTransform: "capitalize" }}>
												{i.size}
											</option>

											{uniqueProductSizes &&
												uniqueProductSizes.map((ss, ii) => {
													return (
														<option key={ii} value={ss}>
															{ss}
														</option>
													);
												})}
										</select>
										<br />
										Color:{" "}
										<select
											style={{
												textTransform: "capitalize",
												minWidth: "40%",
												marginTop: "10px",
												border: "lightgrey solid 1px",
											}}
											onChange={(e) => {
												var chosenColorImageHelper =
													i.allProductDetailsIncluded.productAttributes.filter(
														(iii) => iii.color === e.target.value,
													)[0];

												var chosenColorImage =
													chosenColorImageHelper &&
													chosenColorImageHelper.productImages &&
													chosenColorImageHelper.productImages[0] &&
													chosenColorImageHelper.productImages[0].url;

												var chosenAttribute2 =
													i.allProductDetailsIncluded.productAttributes.filter(
														(iii) =>
															iii.color.toLowerCase() ===
																e.target.value.toLowerCase() &&
															iii.size.toLowerCase() === i.size,
													)[0];
												changeColor(
													i.id,
													e.target.value,
													i.size,
													chosenColorImage,
													chosenAttribute2.quantity,
													i.color,
												);
											}}>
											<option style={{ textTransform: "capitalize" }}>
												{allColors &&
													allColors[
														allColors.map((ii) => ii.hexa).indexOf(i.color)
													] &&
													allColors[
														allColors.map((ii) => ii.hexa).indexOf(i.color)
													].color}
											</option>

											{uniqueProductColors &&
												uniqueProductColors.map((cc, ii) => {
													return (
														<option key={ii} value={cc}>
															{allColors &&
																allColors[
																	allColors.map((ii) => ii.hexa).indexOf(cc)
																] &&
																allColors[
																	allColors.map((ii) => ii.hexa).indexOf(cc)
																].color}
														</option>
													);
												})}
										</select>
									</div>
									{chosenLanguage === "Arabic" ? (
										<span
											className='buttons-up-down'
											style={{ color: "#282491", marginTop: "10px" }}>
											<button
												type='button'
												className='amount-btn'
												onClick={increase}>
												<FaPlus />
											</button>
											<span className='amount'>{i.amount}</span>

											<button
												type='button'
												className='amount-btn'
												onClick={decrease}>
												<FaMinus />
											</button>
											<span style={{ color: "black" }}>الكمية</span>
										</span>
									) : (
										<span
											className='buttons-up-down'
											style={{ color: "#282491", marginTop: "10px" }}>
											<span style={{ color: "black" }}>Quantity</span>
											<button
												type='button'
												className='amount-btn'
												onClick={decrease}>
												<FaMinus />
											</button>
											<span className='amount'>{i.amount}</span>
											<button
												type='button'
												className='amount-btn'
												onClick={increase}>
												<FaPlus />
											</button>
										</span>
									)}
									<div
										style={{
											fontSize: "0.9rem",
											fontWeight: "bold",
											letterSpacing: "3px",
											color: "goldenrod",
											marginLeft: "70px",
											marginTop: "10px",
										}}>
										{i.priceAfterDiscount * i.amount} L.E.
									</div>
								</div>
							</div>

							<hr />
						</div>
					);
				})}
				<div className='Totals'>Subtotal: {total_amount} L.E.</div>
				<div className='link-container my-5'>
					<Link
						to='/our-products'
						className='link-btn btn-primary ml-1 p-2'
						style={{ borderRadius: "10px" }}>
						continue shopping
					</Link>
				</div>
			</div>
		</CheckoutCartItemsWrapper>
	);
};

export default CheckoutCartItems;

const CheckoutCartItemsWrapper = styled.div`
	.cellPhoneLayout {
		display: block;
		.buttons-up-down {
			margin-left: 30px;
			display: grid;
			font-size: 12px;
			width: 100px;
			font-weight: bold;
			justify-items: center;
			grid-template-columns: repeat(4, 1fr);
			align-items: center;
			h2 {
				margin-bottom: 0;
			}
			button {
				background: transparent;
				border-color: transparent;
				cursor: pointer;
				padding: 1rem 0;
				width: 2rem;
				height: 1rem;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}

	.link-container {
		margin: auto;
		text-align: center;
	}

	.link-btn {
		background: transparent;
		border-color: transparent;
		text-transform: capitalize;
		padding: 0.25rem 0.5rem;
		background: grey;
		color: var(--clr-white);
		border-radius: var(--radius);
		letter-spacing: var(--spacing);
		font-weight: 400;
		text-align: center;
		cursor: pointer;
		width: 75% !important;
	}

	.Totals {
		text-align: right;
		margin-right: 200px;
		font-size: 1.3rem;
		font-weight: bold;
	}

	@media (max-width: 900px) {
		display: none;
	}
`;
