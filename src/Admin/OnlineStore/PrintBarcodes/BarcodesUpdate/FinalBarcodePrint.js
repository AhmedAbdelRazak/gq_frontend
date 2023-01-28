/** @format */

import React from "react";
import styled from "styled-components";
import Barcode from "react-barcode";
// import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import { Modal } from "antd";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'

const FinalBarcodePrint = ({
	modalVisible,
	setModalVisible,
	allChosenProducts,
	allColors,
}) => {
	console.log(allChosenProducts, "allChosenProducts");
	const exportPDF = () => {
		const input = document.getElementById("content");
		html2canvas(input, {
			logging: true,
			letterRendering: 1,
			useCORS: true,
		}).then((canvas) => {
			const imgWidth = 250;
			const imgHeight = (canvas.height * imgWidth) / canvas.width;
			const imgDate = canvas.toDataURL("img/png");
			const pdf = new jsPDF("p", "mm", "a4");
			pdf.addImage(imgDate, "PNG", 0, 0, imgWidth, imgHeight);
			pdf.save(`Barcode`);
		});
	};

	const iterationsCount = allChosenProducts.map((i) => i.OrderedQty);
	// .reduce((a, b) => a + b, 0);

	console.log(iterationsCount, "3rd item");

	const mainForm = () => {
		return (
			<React.Fragment>
				<div className='ml-2 my-5 '>
					<div>
						<button className='btn btn-primary' onClick={() => exportPDF()}>
							Print SKU Barcode
						</button>
					</div>
					<div className='content' id='content'>
						{/* <div style={{ display: "grid", gridTemplateColumns: "33% 33%" }}> */}
						<div className='row mx-3'>
							{allChosenProducts &&
								allChosenProducts.map((p, i) => {
									return (
										<div
											key={i}
											className=' mt-1 col-4'
											style={{
												textTransform: "capitalize",
											}}>
											<div
												style={{
													border: "1px black solid",
													padding: "5px 25px",
													width: "591px",
													height: "295px",
												}}>
												<h3
													style={{
														// textAlign: "center",
														fontSize: "1rem",
														fontWeight: "bolder",
														textAlign: "center",
														margin: "0px",
													}}>
													ACE SPORT
												</h3>
												<div className='' style={{ fontWeight: "bolder" }}>
													{p.productName}
												</div>

												<div className='row'>
													<div className='col-6'>
														<div
															style={{
																fontWeight: "bolder",
																fontSize: "0.65rem",
															}}
															className=''>
															Size: {p.SubSKUSize}
														</div>
														<div
															style={{
																fontWeight: "bolder",
																textTransform: "capitalize",
																fontSize: "0.65rem",
															}}
															className=''>
															Color:{" "}
															{allColors[
																allColors
																	.map((i) => i.hexa)
																	.indexOf(p.SubSKUColor)
															]
																? allColors[
																		allColors
																			.map((i) => i.hexa)
																			.indexOf(p.SubSKUColor)
																  ].color
																: p.SubSKUColor}
														</div>
													</div>

													<div
														className='col-6 my-auto py-2'
														style={{
															fontSize: "1rem",
															background: "black",
															color: "white",
															fontWeight: "bolder",
														}}>
														EGP {Number(p.SubSKUPriceAfterDiscount).toFixed(2)}
													</div>
												</div>

												<div>
													<Barcode
														value={p.SubSKU}
														format='CODE128'
														width={0.9}
														height='75px'
													/>
												</div>
											</div>
										</div>
									);
								})}
						</div>
					</div>
				</div>
				<br />
				<br />
			</React.Fragment>
		);
	};

	return (
		<FinalBarcodePrintWrapper>
			<Modal
				width='100%'
				title={
					<div
						style={{
							textAlign: "center",
							fontWeight: "bold",
							fontSize: "1.3rem",
						}}>{`Product Barcodes`}</div>
				}
				open={modalVisible}
				onOk={() => {
					setModalVisible(false);
				}}
				// okButtonProps={{ style: { display: "none" } }}
				cancelButtonProps={{ style: { display: "none" } }}
				onCancel={() => {
					setModalVisible(false);
				}}>
				{mainForm()}
			</Modal>
		</FinalBarcodePrintWrapper>
	);
};

export default FinalBarcodePrint;

const FinalBarcodePrintWrapper = styled.div`
	min-height: 880px;
`;
