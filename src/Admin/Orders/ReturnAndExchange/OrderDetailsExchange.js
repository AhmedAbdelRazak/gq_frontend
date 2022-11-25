/** @format */

import React from "react";
import styled from "styled-components";

const OrderDetailsExchange = ({
	updateSingleOrder,
	allColors,
	totalExchangedQty,
	totalExchangedAmount,
}) => {
	return (
		<OrderDetailsExchangeWrapper>
			<div className='col-md-12 mx-auto'>
				<div
					className='my-2'
					style={{
						fontSize: "1.25rem",
						fontWeight: "bolder",
						marginTop: "30px",
					}}>
					Order Exchange:
				</div>
				<div
					className='mb-3'
					style={{
						fontSize: "1rem",
						fontWeight: "bolder",
						marginTop: "30px",
					}}>
					Exchange Tracking #: {updateSingleOrder.exchangeTrackingNumber}
				</div>

				{updateSingleOrder.chosenProductQtyWithVariables.length > 0 ? (
					<>
						<div className='row'>
							{updateSingleOrder.chosenProductQtyWithVariables.map((p, i) => {
								return (
									<React.Fragment key={i}>
										{p.map((pp, ii) => {
											return (
												<div className='text-capitalize' key={ii}>
													<div className='row'>
														<div className='col-md-6'>
															Product Name:{" "}
															<strong
																style={{
																	color: "darkblue",
																	textTransform: "capitalize",
																}}>
																{pp.productName} | {pp.SubSKU} |{" "}
																{allColors[
																	allColors
																		.map((i) => i.hexa)
																		.indexOf(pp.SubSKUColor)
																]
																	? allColors[
																			allColors
																				.map((i) => i.hexa)
																				.indexOf(pp.SubSKUColor)
																	  ].color
																	: pp.SubSKUColor}
															</strong>
														</div>
														<div className='col-md-6'>
															{pp.productSubSKUImage ? (
																<img
																	style={{ width: "100px" }}
																	src={
																		pp.productSubSKUImage
																			? pp.productSubSKUImage
																			: ""
																	}
																	alt=''
																/>
															) : (
																<img
																	style={{ width: "100px" }}
																	src={
																		pp.productMainImage
																			? pp.productMainImage
																			: ""
																	}
																	alt=''
																/>
															)}
														</div>
													</div>

													{updateSingleOrder.exchangedProductQtyWithVariables
														.length > 0 &&
													updateSingleOrder.exchangedProductQtyWithVariables
														.map((iv) => iv.exchangedProduct.SubSKU)
														.indexOf(pp.SubSKU) > -1 ? (
														<div>
															<div
																className='mt-3'
																style={{
																	fontWeight: "bolder",
																	color: "#00cccc",
																}}>
																Exchanged By:
															</div>

															<div className='row'>
																<div className='col-md-6'>
																	Product Name:{" "}
																	<strong
																		style={{
																			color: "darkblue",
																			textTransform: "capitalize",
																		}}>
																		{
																			updateSingleOrder.exchangedProductQtyWithVariables.filter(
																				(ivv) =>
																					ivv.exchangedProduct.SubSKU ===
																					pp.SubSKU,
																			)[0].productName
																		}
																		|{" "}
																		{
																			updateSingleOrder.exchangedProductQtyWithVariables.filter(
																				(ivv) =>
																					ivv.exchangedProduct.SubSKU ===
																					pp.SubSKU,
																			)[0].SubSKU
																		}{" "}
																		|{" "}
																		{
																			updateSingleOrder.exchangedProductQtyWithVariables.filter(
																				(ivv) =>
																					ivv.exchangedProduct.SubSKU ===
																					pp.SubSKU,
																			)[0].color
																		}
																	</strong>
																</div>
																<div className='col-md-6'>
																	<img
																		style={{ width: "100px" }}
																		src={
																			updateSingleOrder.exchangedProductQtyWithVariables.filter(
																				(ivv) =>
																					ivv.exchangedProduct.SubSKU ===
																					pp.SubSKU,
																			)[0].productMainImage
																		}
																		alt=''
																	/>
																</div>
															</div>
														</div>
													) : null}
													<hr />
												</div>
											);
										})}
									</React.Fragment>
								);
							})}
						</div>
					</>
				) : null}

				{updateSingleOrder.exchangedProductQtyWithVariables.length > 0 ? (
					<>
						<strong>
							Total Quantity After Exchanging: {totalExchangedQty()} Items
						</strong>
						<br />
						<br />
						<strong>
							Total Amount After Exchanging: {totalExchangedAmount()} L.E.
						</strong>
					</>
				) : null}
			</div>
		</OrderDetailsExchangeWrapper>
	);
};

export default OrderDetailsExchange;

const OrderDetailsExchangeWrapper = styled.div``;
