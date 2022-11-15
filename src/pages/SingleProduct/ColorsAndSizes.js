/** @format */

import React from "react";
import styled from "styled-components";

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
	return (
		<ColorsAndSizesWrapper>
			<div className='text-capitalize text-title' style={{ color: "#0052a5" }}>
				Choose a Color:
				<div className='my-2 mx-auto text-center'>
					{colorSelected && (
						<span
							className='mx-2 p-2 my-3'
							style={{
								color: "black",
								background: "#d8ffff",
								textTransform: "uppercase",
							}}
							onClick={() => {
								//consolidating All Images
								var imagesArray =
									Product &&
									Product.productAttributes.map((i) =>
										i.productImages.map((ii) => ii.url),
									);

								var mergedimagesArray = [].concat.apply([], imagesArray);

								let uniqueImagesArray = [
									...new Map(
										mergedimagesArray.map((item) => [item, item]),
									).values(),
								];
								setChosenImages(uniqueImagesArray);
								setColorSelected(false);
							}}>
							SELECT ALL
						</span>
					)}
					{allAddedColors &&
						allAddedColors.map((c, i) => {
							return (
								<span
									className='mx-2 p-2 my-3'
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
										setColorSelected(true);
									}}
									style={{
										color:
											c === "#000000" ||
											c === "#0000ff" ||
											c === "#5e535f" ||
											c === "#630e63" ||
											c === "#b30000"
												? "white"
												: "black",
										background: c,
										textTransform: "uppercase",
									}}>
									{allColors[allColors.map((i) => i.hexa).indexOf(c)].color}
								</span>
							);
						})}
				</div>
			</div>
			<div className='text-capitalize text-title' style={{ color: "#0052a5" }}>
				Choose a Size:
				<div className='my-2 mx-auto text-center'>
					{allSizes &&
						allSizes.map((s, i) => {
							return (
								<span
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
									}}
									className='mx-2 p-2 my-3'
									key={i}
									style={{
										color: "black",
										background: "#d8ffff",
										textTransform: "uppercase",
									}}>
									{s}
								</span>
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
`;
