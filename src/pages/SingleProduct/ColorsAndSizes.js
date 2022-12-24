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
				<span className='chooseSize'>Choose a Size:</span>
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
