/** @format */

import React, { useState } from "react";
import styled from "styled-components";

const isActive = (c, sureClickedLink) => {
	if (c === sureClickedLink) {
		return {
			// color: "white !important",
			// background: "#dbeeff",
			fontWeight: "bold",
			// padding: "3px 2px",
			color:
				c === "#000000" ||
				c === "#0000ff" ||
				c === "#5e535f" ||
				c === "#630e63" ||
				c === "#b30000" ||
				c === "#006200"
					? "white"
					: "black",
			// background: c,
			textTransform: "uppercase",
			transition: "0.3s",
			fontSize: "0.9rem",
			border: "1px lightgrey solid",
			borderRadius: "10px",
			boxShadow: "1px 2px 1px 2px rgba(0,0,0,0.1)",

			// textDecoration: "underline",
		};
	} else {
		return {
			color:
				c === "#000000" ||
				c === "#0000ff" ||
				c === "#5e535f" ||
				c === "#630e63" ||
				c === "#b30000" ||
				c === "#006200"
					? "white"
					: "black",
			// background: c,
			fontSize: "0.75rem",
			textTransform: "uppercase",
			border: "1px lightgrey solid",
			transition: "0.3s",
		};
	}
};

const isActive2 = (s, sureClickedLink) => {
	if (s === sureClickedLink) {
		return {
			// color: "white !important",
			// background: "#dbeeff",
			fontWeight: "bold",
			padding: "2px 2px",
			color: "black",
			background: "#d8ebff",
			textTransform: "uppercase",
			transition: "0.3s",
			fontSize: "0.9rem",
			border: "1px lightgrey solid",
			borderRadius: "10px",
			boxShadow: "1px 2px 1px 2px rgba(0,0,0,0.1)",

			// textDecoration: "underline",
		};
	} else {
		return {
			color: "black",
			// background: "#d8ebff",
			textTransform: "uppercase",
			fontSize: "0.85rem",
			transition: "0.3s",
			border: "1px black solid",
		};
	}
};

const ColorsAndSizes = ({
	Product,
	allColors,
	allSizes,
	allAddedColors,
	setChosenImages,
	setChosenProductAttributes,
	chosenProductAttributes,
	colorSelected,
	setColorSelected,
	setModalVisible2,
}) => {
	const [clickedLink, setClickedLink] = useState("");
	const [clickedLink2, setClickedLink2] = useState("");

	return (
		<ColorsAndSizesWrapper>
			<div className='text-capitalize text-title' style={{ color: "#0052a5" }}>
				<span className='chooseColor'>Choose a Color:</span>
				<div className='my-2 mx-5 text-center row'>
					{allAddedColors &&
						allAddedColors.map((c, i) => {
							return (
								<div
									className='mx-2 p-1 my-2 col-xl-2 col-lg-2 col-md-2 col-sm-2 col-3 attStyling imgWrapper'
									key={i}
									onClick={() => {
										var images = Product.productAttributes.filter(
											(im) => im.color === c.color,
										);
										if (chosenProductAttributes.SubSKUSize) {
											var chosenAttribute = images.filter(
												(ca) =>
													ca.color.toLowerCase() === c.color.toLowerCase() &&
													ca.size.toLowerCase() ===
														chosenProductAttributes.SubSKUSize.toLowerCase(),
											)[0];

											setChosenProductAttributes({
												...chosenProductAttributes,
												SubSKUColor: c.color,
												SubSKU: chosenAttribute.SubSKU,
												OrderedQty: 1,
												productSubSKUImage: images[0].productImages.map(
													(ii) => ii.url,
												)[0],
												SubSKUPriceAfterDiscount:
													chosenAttribute.priceAfterDiscount,
												SubSKURetailerPrice: chosenAttribute.MSRP,
												SubSKUWholeSalePrice: chosenAttribute.WholeSalePrice,
												SubSKUDropshippingPrice:
													chosenAttribute.DropShippingPrice,
												pickedPrice: chosenAttribute.priceAfterDiscount,
												SubSKUMSRP: chosenAttribute.MSRP,
												quantity: chosenAttribute.quantity,
											});
										} else {
											setChosenProductAttributes({
												...chosenProductAttributes,
												SubSKUColor: c.color,
											});
										}

										setChosenImages(
											images[0].productImages.map((ii) => ii.url),
										);
										setClickedLink(c.color);
										setColorSelected(true);
									}}
									style={isActive(c.color, clickedLink)}>
									{/* {allColors &&
										allColors.length &&
										allColors[allColors.map((i) => i.hexa).indexOf(c.color)]
											.color} */}

									{c.productImages && c.productImages.length > 0 ? (
										<img
											style={{ height: "75%", width: "75%" }}
											src={c.productImages[0].url}
											alt='ACE'
										/>
									) : null}
								</div>
							);
						})}
				</div>
			</div>
			<div className='text-capitalize text-title' style={{ color: "#0052a5" }}>
				<div className='row'>
					<div className='col-md-6 '>
						<span className='chooseSize'>Choose a Size:</span>
					</div>
					{Product &&
					Product.sizeChart &&
					Product.sizeChart.chartLength &&
					Product.sizeChart.chartLength.length > 0 ? (
						<div
							onClick={() => setModalVisible2(true)}
							className='col-md-6 '
							style={{
								fontWeight: "bolder",
								textDecoration: "underline",
								cursor: "pointer",
							}}>
							Size Guide
							<svg
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								role='img'
								xmlns='http://www.w3.org/2000/svg'>
								<path
									fill-rule='evenodd'
									clip-rule='evenodd'
									d='M6.44305 7.07914C6.44305 6.31518 7.00822 5.75 7.77219 5.75C8.53616 5.75 9.10134 6.31518 9.10134 7.07914C9.10134 7.84311 8.53616 8.40829 7.77219 8.40829C7.00822 8.40829 6.44305 7.84311 6.44305 7.07914ZM7.77219 4.25C6.1798 4.25 4.94305 5.48675 4.94305 7.07914C4.94305 8.67154 6.1798 9.90829 7.77219 9.90829C9.36459 9.90829 10.6013 8.67154 10.6013 7.07914C10.6013 5.48675 9.36459 4.25 7.77219 4.25ZM5 10.4874H4.25V11.2374V15.3957V15.6228L4.37596 15.8117L5.6361 17.7019V20.2471V20.9971H6.3861H9.15829H9.90829V20.2471V17.7019L11.1684 15.8117L11.2944 15.6228V15.3957V11.2374V10.4874H10.5444H5ZM5.75 15.1686V11.9874H9.79438V15.1686L8.53425 17.0588L8.40829 17.2478V17.4749V19.4971H7.1361V17.4749V17.2478L7.01013 17.0588L5.75 15.1686Z'
									fill='black'></path>
								<path
									fill-rule='evenodd'
									clip-rule='evenodd'
									d='M19.611 4.25H13.2596V7.71524V9.21524V10.4874V11.9874V13.2596V14.7596V16.0318V17.5318V20.9971H19.611V4.25ZM14.759 17.5318V19.497H18.11V5.75H14.759V7.71524H16.8388V9.21524H14.759V10.4874H16.1457V11.9874H14.759V13.2596H16.8388V14.7596H14.759V16.0318H16.1457V17.5318H14.759Z'
									fill='black'></path>
							</svg>
						</div>
					) : null}
				</div>

				<div className='my-2 mx-5 text-center row'>
					{allSizes &&
						allSizes.map((s, i) => {
							return (
								<div
									onClick={() => {
										var images = Product.productAttributes.filter(
											(im) => im.size === s,
										);
										var images2 = Product.productAttributes.filter(
											(im) => im.color === chosenProductAttributes.SubSKUColor,
										);
										if (chosenProductAttributes.SubSKUColor) {
											var chosenAttribute = images.filter(
												(ca) =>
													ca.size.toLowerCase() === s.toLowerCase() &&
													ca.color.toLowerCase() ===
														chosenProductAttributes.SubSKUColor.toLowerCase(),
											)[0];

											setChosenProductAttributes({
												...chosenProductAttributes,
												SubSKUSize: s,
												SubSKU: chosenAttribute.SubSKU,
												OrderedQty: 1,
												productSubSKUImage: images2[0].productImages.map(
													(ii) => ii.url,
												)[0],
												SubSKUPriceAfterDiscount:
													chosenAttribute.priceAfterDiscount,
												SubSKURetailerPrice: chosenAttribute.MSRP,
												SubSKUWholeSalePrice: chosenAttribute.WholeSalePrice,
												SubSKUDropshippingPrice:
													chosenAttribute.DropShippingPrice,
												pickedPrice: chosenAttribute.priceAfterDiscount,
												SubSKUMSRP: chosenAttribute.MSRP,
												quantity: chosenAttribute.quantity,
											});
										} else {
											setChosenProductAttributes({
												...chosenProductAttributes,
												SubSKUSize: s,
											});
										}

										setClickedLink2(s);
									}}
									className='mx-2 p-2 my-3 col-xl-2 col-lg-2 col-md-2 col-sm-2 col-5 attStyling'
									key={i}
									style={isActive2(s, clickedLink2)}>
									{s}
								</div>
							);
						})}
				</div>
			</div>
			{chosenProductAttributes.pickedPrice ? (
				<>
					{chosenProductAttributes.SubSKURetailerPrice >
					chosenProductAttributes.pickedPrice ? (
						<p
							className='text-capitalize text-title chooseSize'
							style={{ color: "#0052a5" }}>
							Item Price:{" "}
							<s style={{ color: "red", fontWeight: "bold" }}>
								{chosenProductAttributes.SubSKURetailerPrice} L.E.
							</s>{" "}
							{chosenProductAttributes.pickedPrice} L.E.
						</p>
					) : (
						<p
							className='text-capitalize text-title chooseSize'
							style={{ color: "#0052a5" }}>
							Item Price: {chosenProductAttributes.pickedPrice} L.E.
						</p>
					)}
				</>
			) : null}

			{(chosenProductAttributes.quantity ||
				chosenProductAttributes.quantity <= 0) &&
			chosenProductAttributes.pickedPrice ? (
				<>
					<p
						className='text-capitalize text-title chooseSize'
						style={{ color: "#0052a5" }}>
						Availability:{" "}
						{chosenProductAttributes.quantity > 0 ? (
							<span>
								<i className='fas fa-check'></i>
								Available{" "}
							</span>
						) : (
							<span>Unavailable</span>
						)}
					</p>
				</>
			) : null}
			<p
				className='text-capitalize text-title chooseSize'
				style={{ color: "#0052a5" }}>
				Product SKU:{" "}
				<span style={{ color: "black", textTransform: "uppercase" }}>
					{Product.productSKU}
				</span>
			</p>
		</ColorsAndSizesWrapper>
	);
};

export default ColorsAndSizes;

const ColorsAndSizesWrapper = styled.div`
	.fa-check {
		color: darkgreen;
		font-size: 1rem;
	}

	.imgWrapper {
		width: 50%;
		height: 50%;
	}

	.attStyling:hover {
		cursor: pointer;
		font-weight: bolder;
		font-size: 0.9rem;
	}

	.chooseColor {
		font-weight: bold;
	}
	.chooseSize {
		font-weight: bold;
	}

	@media (max-width: 1000px) {
		.chooseColor {
			margin-left: 10px !important;
		}
		.chooseSize {
			margin-left: 10px !important;
		}

		.imgWrapper img {
			width: 60% !important;
			height: 60% !important;
			object-fit: cover;
		}
	}
`;
