/** @format */

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getProducts } from "../../apiAdmin";
import { Select } from "antd";

const { Option } = Select;

const UpdateExistingProduct = ({
	updateSingleOrder,
	singleOrder,
	setUpdateSingleOrder,
	productToBeUpdated,
	setProductToBeUpdated,
	allColors,
	oldProducts,
	setOldProducts,
	newProducts,
	setNewProducts,
}) => {
	const [chosenProduct, setChosenProduct] = useState([]);
	const [chosenProductAttribute, setChosenProductAttribute] = useState([]);
	const [removeProduct, setRemoveProduct] = useState("");
	const [updatedQuantity, setUpdatedQuantity] = useState(1);

	const gettingAllProducts = () => {
		getProducts().then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setChosenProduct(
					data.filter((i) => i._id === productToBeUpdated.productId)[0],
				);
				setChosenProductAttribute(
					data
						.filter((i) => i._id === productToBeUpdated.productId)[0]
						.productAttributes.filter(
							(ii) => ii.SubSKU === productToBeUpdated.SubSKU,
						)[0],
				);
			}
		});
	};

	useEffect(() => {
		gettingAllProducts();
		// eslint-disable-next-line
	}, []);

	// console.log(updateSingleOrder, "updateSingleOrder");
	console.log(productToBeUpdated, "productToBeUpdated");
	// console.log(chosenProduct, "chosenProduct");
	// console.log(chosenProductAttribute, "chosenProductAttribute");
	// console.log(removeProduct, "removeProduct");

	useEffect(() => {
		if (removeProduct === true) {
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

			var afterRemoving = mergedAttributesChosenProducts.filter(
				(i) => i.SubSKU !== productToBeUpdated.SubSKU,
			);

			setUpdateSingleOrder({
				...updateSingleOrder,
				chosenProductQtyWithVariables: [afterRemoving],
				totalAmountAfterDiscount:
					Number(updateSingleOrder.totalAmountAfterDiscount) -
					Number(productToBeUpdated.pickedPrice),
				totalAmount:
					Number(updateSingleOrder.totalAmount) -
					Number(productToBeUpdated.pickedPrice),
				oldProducts: [productToBeUpdated],
				newProducts: [{ ...productToBeUpdated, OrderedQty: 0 }],
			});
		} else if (removeProduct === false) {
			setUpdateSingleOrder({
				...singleOrder,
				oldProducts: [productToBeUpdated],
			});
			setOldProducts([productToBeUpdated]);
		} else {
			return null;
		}
		// eslint-disable-next-line
	}, [removeProduct]);

	console.log(oldProducts, "oldProducts");
	console.log(newProducts, "newProducts");

	return (
		<UpdateExistingProductWrapper>
			<div>
				Would You Like To Remove This Product
				<span className='ml-2'>
					Yes
					<input
						type='checkbox'
						className='ml-1'
						value={removeProduct}
						onChange={() => setRemoveProduct(true)}
						checked={removeProduct}
					/>
				</span>
				<span className='ml-2'>
					No
					<input
						type='checkbox'
						className='ml-1'
						value={removeProduct}
						onChange={() => setRemoveProduct(false)}
						checked={removeProduct === false}
					/>
				</span>
			</div>
			{removeProduct === false ? (
				<div className='form-group text-capitalize  col-md-8 mt-4'>
					<label>Product ({productToBeUpdated.productName}) SKU's</label>

					<Select
						// mode='multiple'
						style={{ width: "100%", textTransform: "capitalize" }}
						placeholder='Please Select Order Colors'
						value={chosenProductAttribute.SubSKU}
						onChange={(value) => {
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

							var afterRemoving = mergedAttributesChosenProducts.filter(
								(i) => i.SubSKU !== productToBeUpdated.SubSKU,
							);

							setChosenProductAttribute(
								chosenProduct.productAttributes.filter(
									(ii) => ii.SubSKU === value,
								)[0],
							);

							//Update single order

							const modifyChosenSKU = {
								SubSKU: value,
								OrderedQty: updatedQuantity,
								productId: chosenProduct._id,
								productName: chosenProduct.productName,
								productMainImage: productToBeUpdated.productMainImage,
								productSubSKUImage: productToBeUpdated.productMainImage,
								SubSKUPriceAfterDiscount:
									productToBeUpdated.SubSKUPriceAfterDiscount,
								SubSKURetailerPrice: productToBeUpdated.SubSKURetailerPrice,
								SubSKUWholeSalePrice: productToBeUpdated.SubSKUWholeSalePrice,
								SubSKUDropshippingPrice:
									productToBeUpdated.SubSKUDropshippingPrice,
								pickedPrice: productToBeUpdated.pickedPrice,
								quantity: chosenProduct.productAttributes.filter(
									(ii) => ii.SubSKU === value,
								)[0].quantity,
								SubSKUColor: chosenProduct.productAttributes.filter(
									(ii) => ii.SubSKU === value,
								)[0].color,
								SubSKUSize: chosenProduct.productAttributes.filter(
									(ii) => ii.SubSKU === value,
								)[0].size,
								SubSKUMSRP: productToBeUpdated.SubSKUMSRP,
							};

							setNewProducts([modifyChosenSKU]);

							setProductToBeUpdated(modifyChosenSKU);

							setUpdateSingleOrder({
								...updateSingleOrder,
								chosenProductQtyWithVariables: [
									[...afterRemoving, modifyChosenSKU],
								],
								newProducts: [modifyChosenSKU],
							});
							console.log(value, "value");
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
									.filter((i) => i.SubSKU === productToBeUpdated.SubSKU)
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

								setNewProducts([targetedQuantity]);

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
									chosenProductQtyWithVariables: [
										mergedAttributesChosenProducts,
									],
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
				</div>
			) : null}
		</UpdateExistingProductWrapper>
	);
};

export default UpdateExistingProduct;

const UpdateExistingProductWrapper = styled.div``;
