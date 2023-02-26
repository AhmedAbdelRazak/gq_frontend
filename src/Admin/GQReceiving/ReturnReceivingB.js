/** @format */

import React from "react";
import styled from "styled-components";

const ReturnReceivingB = ({
	chosenInvoice,
	receivingSource,
	submitInvoice,
	selectedOrder,
	acceptedReturn,
	returnStatusUpdate,
}) => {
	return (
		<ReturnReceivingBWrapper>
			{(receivingSource === "Return" || receivingSource === "Exchange") &&
			submitInvoice ? (
				<div
					className=' my-auto mx-auto text-center'
					style={{
						backgroundColor: "white",
						padding: "80px 0px 180px 0px",
					}}>
					<h2 className='mb-4'>STATUS UPDATE</h2>

					<div className='row col-12 mx-auto'>
						<div className='col-4 mb-2' style={{ fontWeight: "bold" }}>
							INVOICE STATUS
						</div>
						<div className='col-4 mb-2' style={{ fontWeight: "bold" }}>
							CHECK
						</div>
						<div className='col-4 mb-2' style={{ fontWeight: "bold" }}>
							STATUS UPDATE
						</div>
					</div>
					<div className='row col-12 mx-auto'>
						{selectedOrder && selectedOrder.status ? (
							<div
								className='col-3 mx-auto my-auto'
								style={{
									backgroundColor: "orangered",
									padding: "10px 0px",
									color: "white",
									fontWeight: "bolder",
									borderRadius: "4px",
									fontSize: "12px",
								}}>
								{selectedOrder.status}
								{acceptedReturn ? (
									<div
										style={{
											position: "absolute",
											borderTop: "solid 2px black",
											padding: "30px",
											left: "100%",
											top: "50%",
										}}></div>
								) : null}
							</div>
						) : null}

						<div
							className='col-3 mx-auto my-auto'
							style={{
								backgroundColor: "darkgreen",
								padding: "10px 0px",
								color: "white",
								fontWeight: "bolder",
								borderRadius: "4px",
							}}>
							Accepted
							{returnStatusUpdate ? (
								<div
									style={{
										position: "absolute",
										borderTop: "solid 2px black",
										padding: "30px",
										left: "100%",
										top: "50%",
									}}></div>
							) : null}
						</div>
						<div
							className='col-3 mx-auto my-auto'
							style={{
								backgroundColor: "lightgreen",
								padding: "10px 0px",
								color: "black",
								fontWeight: "bolder",
								borderRadius: "4px",
							}}>
							RET-NOT-REF
						</div>
					</div>
				</div>
			) : receivingSource === "Exchange" && submitInvoice ? (
				<div
					className=' my-auto mx-auto text-center'
					style={{
						backgroundColor: "white",
						padding: "80px 0px 180px 0px",
					}}>
					<h2 className='mb-4'>STATUS UPDATE</h2>

					<div className='row col-12 mx-auto'>
						<div className='col-4 mb-2' style={{ fontWeight: "bold" }}>
							INVOICE STATUS
						</div>
						<div className='col-4 mb-2' style={{ fontWeight: "bold" }}>
							CHECK
						</div>
						<div className='col-4 mb-2' style={{ fontWeight: "bold" }}>
							STATUS UPDATE
						</div>
					</div>
					<div className='row col-12 mx-auto'>
						{selectedOrder && selectedOrder.status ? (
							<div
								className='col-3 mx-auto'
								style={{
									backgroundColor: "orangered",
									padding: "10px 0px",
									color: "white",
									fontWeight: "bolder",
									borderRadius: "4px",
									fontSize: "10px",
								}}>
								{selectedOrder.status}
							</div>
						) : null}
						<div
							className='col-3 mx-auto'
							style={{
								backgroundColor: "darkgreen",
								padding: "10px 0px",
								color: "white",
								fontWeight: "bolder",
								borderRadius: "4px",
							}}>
							Accepted
						</div>
						<div
							className='col-3 mx-auto'
							style={{
								backgroundColor: "lightgreen",
								padding: "10px 0px",
								color: "black",
								fontWeight: "bolder",
								borderRadius: "4px",
								fontSize: "12px",
							}}>
							Exchanged - Stocked
						</div>
					</div>
				</div>
			) : receivingSource === "New Receiving Order" ? (
				<div
					className=' my-auto mx-auto text-center'
					style={{
						backgroundColor: "white",
						padding: "80px 0px 180px 0px",
					}}>
					<h2 className='mb-4'>STATUS UPDATE</h2>

					<div className='row col-12 mx-auto'>
						<div className='col-4 mb-2' style={{ fontWeight: "bold" }}>
							PO STATUS
						</div>
						<div className='col-4 mb-2' style={{ fontWeight: "bold" }}>
							CHECK
						</div>
						<div className='col-4 mb-2' style={{ fontWeight: "bold" }}>
							STATUS UPDATE
						</div>
					</div>
					<div className='row col-12 mx-auto'>
						<div
							className='col-3 mx-auto my-auto'
							style={{
								backgroundColor: "orangered",
								padding: "10px 0px",
								color: "white",
								fontWeight: "bolder",
								borderRadius: "4px",
								fontSize: "13px",
							}}>
							New Receiving
							{acceptedReturn ? (
								<div
									style={{
										position: "absolute",
										borderTop: "solid 2px black",
										padding: "30px",
										left: "100%",
										top: "50%",
									}}></div>
							) : null}
						</div>

						<div
							className='col-3 mx-auto my-auto'
							style={{
								backgroundColor: "darkgreen",
								padding: "10px 0px",
								color: "white",
								fontWeight: "bolder",
								borderRadius: "4px",
							}}>
							Accepted
							{returnStatusUpdate ? (
								<div
									style={{
										position: "absolute",
										borderTop: "solid 2px black",
										padding: "30px",
										left: "100%",
										top: "50%",
									}}></div>
							) : null}
						</div>
						<div
							className='col-3 mx-auto my-auto'
							style={{
								backgroundColor: "lightgreen",
								padding: "10px 0px",
								color: "black",
								fontWeight: "bolder",
								borderRadius: "4px",
							}}>
							Received
						</div>
					</div>
				</div>
			) : (
				<div
					style={{
						fontWeight: "bold",
						fontSize: "1.25rem",
						textAlign: "center",
						color: "darkred",
					}}>
					Please Choose A Receiving Source
				</div>
			)}
		</ReturnReceivingBWrapper>
	);
};

export default ReturnReceivingB;

const ReturnReceivingBWrapper = styled.span``;
