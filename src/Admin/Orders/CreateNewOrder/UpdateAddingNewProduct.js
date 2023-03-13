/** @format */

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getProducts } from "../../apiAdmin";
import { Select } from "antd";

const { Option } = Select;

const UpdateAddingNewProduct = ({
	updateSingleOrder,
	setUpdateSingleOrder,
	allColors,
}) => {
	const [chosenProductId, setChosenProductId] = useState(null);
	const [chosenProduct, setChosenProduct] = useState(null);
	const [chosenProductAttribute, setChosenProductAttribute] = useState([]);
	const [allProducts, setAllProducts] = useState([]);
	const [updatedQuantity, setUpdatedQuantity] = useState(1);

	const gettingAllProducts = () => {
		getProducts().then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllProducts(data);
			}
		});
	};

	useEffect(() => {
		gettingAllProducts();
		// eslint-disable-next-line
	}, [chosenProduct]);

	console.log(chosenProduct, "chosenProduct");
	console.log(chosenProductAttribute, "chosenProductAttribute");

	return (
		<UpdateAddingNewProductWrapper>
			<div>Choose A Product</div>

			<Select
				// mode='multiple'
				style={{ width: "60%", textTransform: "capitalize" }}
				placeholder='Please Select A New Product'
				value={chosenProductId}
				onChange={(value) => {
					setChosenProductId(value);
					var chosenProductDetails =
						allProducts && allProducts.filter((i) => i._id === value)[0];

					setChosenProduct(chosenProductDetails);

					console.log(value, "value");
				}}>
				{allProducts &&
					allProducts.map((product, ii) => {
						return (
							<Option value={product._id} key={ii}>
								{product.productName}
							</Option>
						);
					})}
			</Select>

			{chosenProductId ? (
				<div className='mt-4'>
					<div>
						Choose Attributes for (
						<strong style={{ textTransform: "capitalize" }}>
							{chosenProduct.productName}
						</strong>
						){" "}
					</div>

					<Select
						// mode='multiple'
						style={{ width: "100%", textTransform: "capitalize" }}
						placeholder='Please Select Product Attributes'
						value={chosenProductAttribute.SubSKU}
						onChange={(value) => {
							//Get Image

							const productSubSKUImage = (
								requiredProduct,
								productSubSKUColor,
							) => {
								const theReturn = requiredProduct.productAttributes.filter(
									(i) => i.color === productSubSKUColor,
								)[0].productImages;
								return theReturn[0] ? theReturn[0].url : undefined;
							};

							//remove previous product
							const attributesChosenProducts =
								updateSingleOrder &&
								updateSingleOrder.chosenProductQtyWithVariables &&
								updateSingleOrder.chosenProductQtyWithVariables.map((i) =>
									i.map((ii) => ii),
								);

							var mergedAttributesChosenProducts = [].concat.apply(
								[],
								attributesChosenProducts,
							);

							setChosenProductAttribute(
								chosenProduct.productAttributes.filter(
									(ii) => ii.SubSKU === value,
								)[0],
							);

							var productAttributes = chosenProduct.productAttributes.filter(
								(ii) => ii.SubSKU === value,
							)[0];

							//Update single order

							const totalAmountAfterDiscount = mergedAttributesChosenProducts
								.map(
									(i) =>
										Number(i.SubSKUPriceAfterDiscount) * Number(i.OrderedQty),
								)
								.reduce((a, b) => a + b, 0);

							const modifyChosenSKU = {
								SubSKU: value,
								OrderedQty: updatedQuantity,
								productId: chosenProduct._id,
								productName: chosenProduct.productName,
								productMainImage: chosenProduct.thumbnailImage[0].images[0].url,
								productSubSKUImage: productSubSKUImage(
									chosenProduct,
									productAttributes.color,
								),

								SubSKUPriceAfterDiscount: productAttributes.priceAfterDiscount,
								SubSKURetailerPrice: productAttributes.price,
								SubSKUWholeSalePrice: productAttributes.WholeSalePrice,
								SubSKUDropshippingPrice: productAttributes.DropShippingPrice,
								pickedPrice: productAttributes.priceAfterDiscount,
								quantity: chosenProduct.productAttributes.filter(
									(ii) => ii.SubSKU === value,
								)[0].quantity,
								SubSKUColor: chosenProduct.productAttributes.filter(
									(ii) => ii.SubSKU === value,
								)[0].color,
								SubSKUSize: chosenProduct.productAttributes.filter(
									(ii) => ii.SubSKU === value,
								)[0].size,
								SubSKUMSRP: productAttributes.MSRP,
							};

							setUpdateSingleOrder({
								...updateSingleOrder,
								chosenProductQtyWithVariables: [
									[...mergedAttributesChosenProducts, modifyChosenSKU],
								],
								newProducts: [modifyChosenSKU],
								oldProducts: [{ ...modifyChosenSKU, OrderedQty: 0 }],
								totalAmount:
									Number(totalAmountAfterDiscount) +
									Number(
										updatedQuantity * productAttributes.priceAfterDiscount,
									) +
									Number(updateSingleOrder.shippingFees),
								totalAmountAfterDiscount:
									Number(totalAmountAfterDiscount) +
									Number(
										updatedQuantity * productAttributes.priceAfterDiscount,
									) +
									Number(updateSingleOrder.shippingFees),
							});
						}}>
						{chosenProduct &&
							chosenProduct.productAttributes.map((att, ii) => {
								return (
									<Option value={att.SubSKU} key={ii}>
										{att.SubSKU}
										{" | "}{" "}
										<span style={{ color: "black" }}>
											{allColors[
												allColors.map((i) => i.hexa).indexOf(att.color)
											]
												? allColors[
														allColors.map((i) => i.hexa).indexOf(att.color)
												  ].color
												: att.color}
										</span>
										{" | "}
										{att.size}
										{" | "}
										<strong>Stock Onhand: {att.quantity}</strong>
									</Option>
								);
							})}
					</Select>
				</div>
			) : null}

			{chosenProductAttribute && chosenProductAttribute.SubSKU ? (
				<div className='mt-4'>
					<label> Update Quantity</label>
					<br />
					<input
						type='number'
						className='form-control w-50'
						value={updatedQuantity}
						onChange={(e) => {
							setUpdatedQuantity(e.target.value);

							const attributesChosenProducts =
								updateSingleOrder &&
								updateSingleOrder.chosenProductQtyWithVariables &&
								updateSingleOrder.chosenProductQtyWithVariables.map((i) =>
									i.map((ii) => ii),
								);

							var mergedAttributesChosenProducts = [].concat.apply(
								[],
								attributesChosenProducts,
							);

							var targetedQuantity = mergedAttributesChosenProducts
								.filter((i) => i.SubSKU === chosenProductAttribute.SubSKU)
								.map((ii) => {
									return {
										...ii,
										OrderedQty: Number(e.target.value),
									};
								})[0];

							const findIndex = mergedAttributesChosenProducts.findIndex(
								(object) => {
									return object.SubSKU === targetedQuantity.SubSKU;
								},
							);

							mergedAttributesChosenProducts[findIndex] = targetedQuantity;

							// eslint-disable-next-line
							const totalAmountBeforeDiscount = mergedAttributesChosenProducts
								.map(
									(i) => Number(i.SubSKURetailerPrice) * Number(i.OrderedQty),
								)
								.reduce((a, b) => a + b, 0);

							const totalAmountAfterDiscount = mergedAttributesChosenProducts
								.map(
									(i) =>
										Number(i.SubSKUPriceAfterDiscount) * Number(i.OrderedQty),
								)
								.reduce((a, b) => a + b, 0);

							setUpdateSingleOrder({
								...updateSingleOrder,
								chosenProductQtyWithVariables: [mergedAttributesChosenProducts],
								totalAmount:
									Number(totalAmountAfterDiscount) +
									Number(updateSingleOrder.shippingFees),
								totalAmountAfterDiscount:
									Number(totalAmountAfterDiscount) +
									Number(updateSingleOrder.shippingFees),
								newProducts: [targetedQuantity],
							});
						}}
					/>
				</div>
			) : null}
		</UpdateAddingNewProductWrapper>
	);
};

export default UpdateAddingNewProduct;

const UpdateAddingNewProductWrapper = styled.div``;
