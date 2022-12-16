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
			background: c,
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
			background: c,
			fontSize: "0.75rem",
			textTransform: "uppercase",
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
			background: "#d8ebff",
			textTransform: "uppercase",
			fontSize: "0.85rem",
			transition: "0.3s",
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
				Choose a Color:
				<div className='my-2 mx-5 text-center row'>
					{allAddedColors &&
						allAddedColors.map((c, i) => {
							return (
								<div
									className='mx-2 p-2 my-2 col-xl-2 col-lg-2 col-md-2 col-sm-2 col-5 attStyling'
									key={i}
									onClick={() => {
										var images = Product.productAttributes.filter(
											(im) => im.color === c,
										);
										if (chosenProductAttributes.SubSKUSize) {
											var chosenAttribute = images.filter(
												(ca) =>
													ca.color.toLowerCase() === c.toLowerCase() &&
													ca.size.toLowerCase() ===
														chosenProductAttributes.SubSKUSize.toLowerCase(),
											)[0];

											setChosenProductAttributes({
												...chosenProductAttributes,
												SubSKUColor: c,
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
												SubSKUColor: c,
											});
										}

										setChosenImages(
											images[0].productImages.map((ii) => ii.url),
										);
										setClickedLink(c);
										setColorSelected(true);
									}}
									style={isActive(c, clickedLink)}>
									{allColors &&
										allColors.length &&
										allColors[allColors.map((i) => i.hexa).indexOf(c)].color}
								</div>
							);
						})}
				</div>
			</div>
			<div className='text-capitalize text-title' style={{ color: "#0052a5" }}>
				Choose a Size:
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
							className='text-capitalize text-title'
							style={{ color: "#0052a5" }}>
							Item Price:{" "}
							<s style={{ color: "red", fontWeight: "bold" }}>
								{chosenProductAttributes.SubSKURetailerPrice} L.E.
							</s>{" "}
							{chosenProductAttributes.pickedPrice} L.E.
						</p>
					) : (
						<p
							className='text-capitalize text-title'
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
						className='text-capitalize text-title'
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
			<p className='text-capitalize text-title' style={{ color: "#0052a5" }}>
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

	.attStyling:hover {
		cursor: pointer;
		font-weight: bolder;
		font-size: 0.9rem;
	}
`;
