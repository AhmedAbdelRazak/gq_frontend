/** @format */

import React from "react";
import styled from "styled-components";

const ReturnReceivingE = ({
	submitInvoice,
	receivingSource,
	selectedOrder,
	setReturnStatusUpdate,
	allProducts,
	chosenProduct,
	quantityToBeReceived,
	returnStatusUpdate,
	submittedSKU,
}) => {
	const returnedItemsDetails =
		submitInvoice &&
		selectedOrder &&
		selectedOrder.returnedItems &&
		selectedOrder.returnedItems.length > 0 &&
		selectedOrder.customerDetails &&
		selectedOrder.customerDetails.fullName
			? selectedOrder.returnedItems.map((i) => i.map((ii) => ii))
			: null;

	var mergedReturnedItemsDetails = [].concat.apply([], returnedItemsDetails);

	const exchangedItemsDetails =
		submitInvoice &&
		selectedOrder &&
		selectedOrder.exchangedProductQtyWithVariables &&
		selectedOrder.exchangedProductQtyWithVariables.length > 0 &&
		selectedOrder.customerDetails &&
		selectedOrder.customerDetails.fullName
			? selectedOrder.exchangedProductQtyWithVariables.map((i) => i)
			: null;

	var addingVariablesToMain =
		allProducts &&
		allProducts.map((i) =>
			i.productAttributes.map((ii) => {
				return {
					...i,
					DropShippingPrice: ii.DropShippingPrice,
					MSRP: ii.MSRP,
					PK: ii.PK,
					SubSKU: ii.SubSKU,
					WholeSalePrice: ii.WholeSalePrice,
					color: ii.color,
					price: ii.price,
					priceAfterDiscount: ii.priceAfterDiscount,
					productImages: ii.productImages,
					quantity: ii.quantity,
					size: ii.size,
					receivedQuantity: ii.receivedQuantity ? ii.receivedQuantity : 0,
				};
			}),
		);

	var mergedFinalOfFinal = [].concat.apply([], addingVariablesToMain);

	let allAttributesFinalOfFinal = [
		...new Map(mergedFinalOfFinal.map((item) => [item, item])).values(),
	];

	const activeStockFinal = allAttributesFinalOfFinal.filter(
		(i) =>
			mergedReturnedItemsDetails &&
			mergedReturnedItemsDetails
				.map((ii) => ii.SubSKU.toLowerCase())
				.indexOf(i.SubSKU.toLowerCase()) > -1,
	);

	const activeStockFinal2 = allAttributesFinalOfFinal.filter(
		(i) =>
			exchangedItemsDetails &&
			exchangedItemsDetails
				.map((ii) => ii.exchangedProduct.SubSKU.toLowerCase())
				.indexOf(i.SubSKU.toLowerCase()) > -1,
	);

	// console.log(mergedReturnedItemsDetails, "mergedReturnedItemsDetails");
	// console.log(allAttributesFinalOfFinal, "allAttributesFinalOfFinal");
	// console.log(activeStockFinal, "activeStockFinal");

	var alreadyStockedQuantity =
		chosenProduct && chosenProduct.receivedQuantity
			? chosenProduct.receivedQuantity
			: 0;

	var updatedProductAttributesFinal =
		chosenProduct &&
		chosenProduct.productAttributes.map((i) =>
			i.SubSKU === chosenProduct.SubSKU
				? {
						...i,
						receivedQuantity:
							Number(alreadyStockedQuantity) + Number(quantityToBeReceived),
						quantity: Number(i.quantity) - Number(quantityToBeReceived),
				  }
				: i,
		);
	console.log(updatedProductAttributesFinal, "updatedProductAttributesFinal");

	const variableImage =
		chosenProduct &&
		chosenProduct.productAttributes.filter(
			(i) => i.SubSKU.toLowerCase() === chosenProduct.SubSKU.toLowerCase(),
		) &&
		chosenProduct &&
		chosenProduct.productAttributes.filter(
			(i) => i.SubSKU.toLowerCase() === chosenProduct.SubSKU.toLowerCase(),
		)[0] &&
		chosenProduct &&
		chosenProduct.productAttributes.filter(
			(i) => i.SubSKU.toLowerCase() === chosenProduct.SubSKU.toLowerCase(),
		)[0].productImages[0].url;

	console.log(variableImage, "variableImage");

	return (
		<ReturnReceivingEWrapper>
			{submitInvoice &&
			selectedOrder &&
			selectedOrder.returnedItems &&
			selectedOrder.returnedItems.length > 0 &&
			selectedOrder.customerDetails &&
			selectedOrder.customerDetails.fullName ? (
				<div>
					<div>
						{selectedOrder.returnedItems.map((p, i) => {
							return (
								<div key={i}>
									{p.map((pp, ii) => {
										return (
											<div key={ii} className='row'>
												<div className='col-3'>ITEM</div>
												<div className='col-3'>BEFORE</div>
												<div className='col-3'>RECEIVED</div>
												<div className='col-3'>AFTER</div>
												<div className='col-3'>
													<img
														width='100%'
														src={pp.productSubSKUImage}
														alt='infinite-apps.com'
													/>
													<strong>SKU</strong> : {pp.SubSKU}
												</div>

												<div className='col-3'>
													{activeStockFinal &&
														activeStockFinal[i] &&
														activeStockFinal[i].quantity}
												</div>
												<div className='col-3'>{pp.OrderedQty}</div>
												<div className='col-3'>
													{Number(pp.OrderedQty) +
														Number(
															activeStockFinal &&
																activeStockFinal[i] &&
																activeStockFinal[i].quantity,
														)}
												</div>
												<div className='col-6 text-center mt-3'>
													<button
														className='btn btn-success'
														disabled={returnStatusUpdate}
														style={{
															background: returnStatusUpdate
																? "darkblue"
																: null,
														}}
														onClick={() => setReturnStatusUpdate(true)}>
														STATUS UPDATE
													</button>
												</div>
												<div
													className='col-12 mt-3'
													style={{
														borderBottom: "lightgrey solid 1px",
													}}></div>
											</div>
										);
									})}
								</div>
							);
						})}
					</div>
				</div>
			) : null}

			{submitInvoice &&
			selectedOrder &&
			selectedOrder.exchangedProductQtyWithVariables &&
			selectedOrder.exchangedProductQtyWithVariables.length > 0 &&
			selectedOrder.customerDetails &&
			selectedOrder.customerDetails.fullName ? (
				<div>
					<div>
						{selectedOrder.exchangedProductQtyWithVariables.map((p, i) => {
							return (
								<div key={i}>
									<div className='row'>
										<div className='col-3'>ITEM</div>
										<div className='col-3'>BEFORE</div>
										<div className='col-3'>RECEIVED</div>
										<div className='col-3'>AFTER</div>
										<div className='col-3'>
											<img
												width='100%'
												src={p.exchangedProduct.productMainImage}
												alt='infinite-apps.com'
											/>
											<strong>SKU</strong> : {p.exchangedProduct.SubSKU}
										</div>

										<div className='col-3'>
											{activeStockFinal2 &&
												activeStockFinal2[i] &&
												activeStockFinal2[i].quantity}
										</div>
										<div className='col-3'>{p.exchangedProduct.OrderedQty}</div>
										<div className='col-3'>
											{Number(p.exchangedProduct.OrderedQty) +
												Number(
													activeStockFinal2 &&
														activeStockFinal2[i] &&
														activeStockFinal2[i].quantity,
												)}
										</div>
										<div className='col-6 text-center mt-3'>
											<button
												className='btn btn-success'
												disabled={returnStatusUpdate}
												style={{
													background: returnStatusUpdate ? "darkblue" : null,
												}}
												onClick={() => setReturnStatusUpdate(true)}>
												STATUS UPDATE
											</button>
										</div>
										<div
											className='col-12 mt-3'
											style={{
												borderBottom: "lightgrey solid 1px",
											}}></div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			) : null}

			{receivingSource === "New Receiving Order" &&
			chosenProduct &&
			submittedSKU &&
			chosenProduct.productName ? (
				<div>
					<div className='row'>
						<div className='col-3'>ITEM</div>
						<div className='col-3'>BEFORE</div>
						<div className='col-3'>RECEIVED</div>
						<div className='col-3'>AFTER</div>
						<div className='col-3'>
							<img
								src={
									variableImage
										? variableImage
										: chosenProduct.thumbnailImage[0].images[0].url
								}
								width='100%'
								alt='infinite-apps'
							/>
							<strong>SKU</strong> : {chosenProduct && chosenProduct.SubSKU}
						</div>

						<div className='col-3'>
							{chosenProduct && chosenProduct.quantity
								? Number(chosenProduct.quantity)
								: 0}{" "}
						</div>
						<div className='col-3'>{quantityToBeReceived}</div>
						<div className='col-3'>
							{(chosenProduct && chosenProduct.quantity
								? Number(chosenProduct.quantity)
								: 0) + Number(quantityToBeReceived)}
						</div>
						<div className='col-6 text-center mt-3'>
							<button
								className='btn btn-success'
								disabled={returnStatusUpdate}
								style={{
									background: returnStatusUpdate ? "darkblue" : null,
								}}
								onClick={() => setReturnStatusUpdate(true)}>
								STATUS UPDATE
							</button>
						</div>
						<div
							className='col-12 mt-3'
							style={
								{
									// borderBottom: "lightgrey solid 1px",
								}
							}></div>
					</div>
				</div>
			) : null}
		</ReturnReceivingEWrapper>
	);
};

export default ReturnReceivingE;

const ReturnReceivingEWrapper = styled.span``;
