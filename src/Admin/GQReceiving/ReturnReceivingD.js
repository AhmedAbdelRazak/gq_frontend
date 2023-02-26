/** @format */

import React from "react";
import styled from "styled-components";

const ReturnReceivingD = ({
	submitInvoice,
	selectedOrder,
	setAcceptedReturn,
	allColors,
	chosenProduct,
	submittedSKU,
	setQuantityToBeReceived,
	quantityToBeReceived,
	setInboundQuantitySubmit,
}) => {
	return (
		<ReturnReceivingDWrapper>
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
												<div className='col-5'>
													<img
														width='100%'
														src={pp.productSubSKUImage}
														alt='infinite-apps.com'
													/>
												</div>
												<div
													className='col-6'
													style={{
														fontSize: "12px",
														textTransform: "uppercase",
													}}>
													<strong>SKU</strong> : {pp.SubSKU}
													<br />
													<strong>Size</strong> : {pp.SubSKUSize}
													<br />
													<strong>Color</strong> :{" "}
													{allColors[
														allColors.map((i) => i.hexa).indexOf(pp.SubSKUColor)
													]
														? allColors[
																allColors
																	.map((i) => i.hexa)
																	.indexOf(pp.SubSKUColor)
														  ].color
														: pp.SubSKUColor}
													<br />
													<strong>Description</strong> : {pp.productName}
													<br />
													<strong>Quantity</strong> : {pp.OrderedQty}
												</div>
												<div className='col-6 text-center mt-3'>
													<button
														className='btn btn-success'
														onClick={() => setAcceptedReturn(true)}>
														ACCEPT
													</button>
												</div>
												<div className='col-6 text-center mt-3'>
													<button className='btn btn-danger'>REFUSE</button>
												</div>
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
										<div className='col-5'>
											<img
												width='100%'
												src={p.exchangedProduct.productSubSKUImage}
												alt='infinite-apps.com'
											/>
										</div>
										<div
											className='col-6'
											style={{
												fontSize: "12px",
												textTransform: "uppercase",
											}}>
											<strong>SKU</strong> : {p.exchangedProduct.SubSKU}
											<br />
											<strong>Size</strong> : {p.exchangedProduct.SubSKUSize}
											<br />
											<strong>Color</strong> :{" "}
											{allColors[
												allColors
													.map((i) => i.hexa)
													.indexOf(p.exchangedProduct.SubSKUColor)
											]
												? allColors[
														allColors
															.map((i) => i.hexa)
															.indexOf(p.exchangedProduct.SubSKUColor)
												  ].color
												: p.exchangedProduct.SubSKUColor}
											<br />
											<strong>Description</strong> :{" "}
											{p.exchangedProduct.productName}
											<br />
											<strong>Quantity</strong> :{" "}
											{p.exchangedProduct.OrderedQty}
										</div>
										<div className='col-6 text-center mt-3'>
											<button
												className='btn btn-success'
												onClick={() => setAcceptedReturn(true)}>
												ACCEPT
											</button>
										</div>
										<div className='col-6 text-center mt-3'>
											<button className='btn btn-danger'>REFUSE</button>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			) : null}

			{submittedSKU && chosenProduct && chosenProduct.productName ? (
				<div>
					<div className='row'>
						<div className='col-4'>
							<img
								src={chosenProduct.thumbnailImage[0].images[0].url}
								width='100%'
								alt='infinite-apps'
							/>
						</div>

						<div className='col-8'>
							<div>
								<strong>Product Name:</strong>{" "}
								<span style={{ textTransform: "uppercase" }}>
									{chosenProduct && chosenProduct.productName}
								</span>{" "}
							</div>
							<div>
								<strong>Product Category:</strong>{" "}
								<span style={{ textTransform: "uppercase" }}>
									{chosenProduct &&
										chosenProduct.category &&
										chosenProduct.category.categoryName}
								</span>{" "}
							</div>
							<div>
								<strong>Product SKU:</strong>{" "}
								<span style={{ textTransform: "uppercase" }}>
									{chosenProduct && chosenProduct.SubSKU}
								</span>{" "}
							</div>
							<div>
								<strong>Product Color:</strong>{" "}
								<span style={{ textTransform: "uppercase" }}>
									{allColors[
										allColors.map((i) => i.hexa).indexOf(chosenProduct.color)
									]
										? allColors[
												allColors
													.map((i) => i.hexa)
													.indexOf(chosenProduct.color)
										  ].color
										: chosenProduct.color}
								</span>{" "}
							</div>
							<div>
								<strong>Product Size:</strong>{" "}
								<span style={{ textTransform: "uppercase" }}>
									{chosenProduct && chosenProduct.size}
								</span>{" "}
							</div>
							<div>
								<strong>Quantity Onhand:</strong>{" "}
								{chosenProduct && chosenProduct.quantity
									? chosenProduct.quantity
									: 0}{" "}
								Items
							</div>
						</div>
					</div>
					<div className='form-group mt-5 '>
						<label className=''>
							Please add how many items would you like to add to your active
							stock?
						</label>
						<input
							onChange={(e) => {
								setQuantityToBeReceived(e.target.value);
							}}
							type='number'
							className='form-control'
							value={quantityToBeReceived}
							placeholder='Required - Inbound Quantity'
						/>
						{quantityToBeReceived && quantityToBeReceived > 0 ? (
							<div className='mt-2'>
								<button
									className='btn btn-info p-2 mb-2'
									onClick={() => setInboundQuantitySubmit(true)}>
									Submit Inbound Quantity
								</button>
							</div>
						) : null}

						<div className='col-6 text-center mt-2'>
							<button
								className='btn btn-success'
								onClick={() => setAcceptedReturn(true)}>
								ACCEPT
							</button>
						</div>
					</div>
				</div>
			) : null}
		</ReturnReceivingDWrapper>
	);
};

export default ReturnReceivingD;

const ReturnReceivingDWrapper = styled.span``;
