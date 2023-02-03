/** @format */

import React from "react";
import styled from "styled-components";
import Barcode from "react-barcode";
// import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
// eslint-disable-next-line
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
			const imgWidth = 472;
			const imgHeight = (canvas.height * imgWidth) / canvas.width;
			const imgDate = canvas.toDataURL("img/png");
			const pdf = new jsPDF("p", "px", [472, 2000]);
			pdf.addImage(imgDate, "PNG", 0, 0, imgWidth, imgHeight);
			pdf.save(`Barcode`);
		});
	};

	const iterationsCount = allChosenProducts.map((i) => i.OrderedQty);
	// .reduce((a, b) => a + b, 0);

	// const exportPDF = () => {
	// 	var pdf = new jsPDF("p", "px", [472, 295]);
	// 	const input = document.getElementById("content");

	// 	pdf.canvas.height = 3100;
	// 	pdf.canvas.width = 472;

	// 	pdf.html(input, {
	// 		callback: function (doc) {
	// 			// const canvas = document.getElementById("barcode");
	// 			// const jpegUrl = doc.toDataURL("image/jpeg");

	// 			doc.save("barcode.pdf");
	// 		},
	// 		// x: 10,
	// 		// y: 10,
	// 	});
	// };

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
					<div className='content'>
						{/* <div style={{ display: "grid", gridTemplateColumns: "33% 33%" }}> */}
						<div id='content' style={{}}>
							{allChosenProducts &&
								allChosenProducts.map((p, i) => {
									var SubSkuAdjusted = p.SubSKU;

									var lastFive = SubSkuAdjusted.substr(
										SubSkuAdjusted.length <= 12
											? SubSkuAdjusted.length - 10
											: SubSkuAdjusted.length - 10,
									);

									return (
										<div
											key={i}
											style={{
												textTransform: "capitalize",
												// marginTop: i === 0 ? "0px" : "11px",
												marginBottom: "27px",
											}}>
											<div
												style={{
													// border: "1px black solid",
													padding: "5px 5px",
													width: "50%",
												}}>
												<div>
													<h3
														className='ml-3'
														style={{
															// textAlign: "center",
															fontSize: "0.9rem",
															fontWeight: "bolder",
															// textAlign: "center",
															margin: "0px",
														}}>
														ACE SPORT
													</h3>
													<div className='' style={{ fontWeight: "bolder" }}>
														{p.productName}
													</div>
													<div
														style={{
															fontWeight: "bolder",
															fontSize: "0.7rem",
														}}
														className=''>
														Size: {p.SubSKUSize}
													</div>
													<div
														style={{
															fontWeight: "bolder",
															textTransform: "capitalize",
															fontSize: "0.7rem",
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
													<Barcode
														value={lastFive}
														// renderer={"img"}
														format='CODE128'
														// width={1.8}
														height='60px'
														marginLeft={0}
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
