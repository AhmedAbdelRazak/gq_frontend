/** @format */

import React from "react";
import styled from "styled-components";
import { Modal } from "antd";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'

// import { toast } from "react-toastify";

const SizeChartModal = ({ Product, modalVisible2, setModalVisible2 }) => {
	const mainForm = () => {
		return (
			<div className='mx-auto text-center mx-auto'>
				<label style={{ fontWeight: "bolder", fontSize: "1.2rem" }}>
					SIZE CHART GUIDE
				</label>
				<br />
				<div className='row'>
					<div className='col-md-8 my-auto'>
						<table className='table  table-md-responsive table-hover table-striped'>
							<thead className='theadStyle' style={{ background: "white" }}>
								<th scope='col' className='theadStyle'>
									SIZE
								</th>
								<th scope='col'>LENGTH (CM)</th>
								<th scope='col'>WIDTH (CM)</th>
							</thead>
							<tbody
								className='my-auto tbodystyle'
								style={{
									fontSize: "0.8rem",
									textTransform: "capitalize",
								}}>
								{Product &&
									Product.sizeChart &&
									Product.sizeChart.chartSize &&
									Product.sizeChart.chartSize.map((s, i) => {
										return (
											<tr key={i} style={{ textTransform: "uppercase" }}>
												<td style={{ fontWeight: "bolder" }}>{s}</td>
												<td>{Product.sizeChart.chartLength[i]}</td>
												<td>{Product.sizeChart.chartWidth[i]}</td>
											</tr>
										);
									})}
							</tbody>
						</table>
					</div>

					<div className='col-md-4'>
						<img
							src={
								Product &&
								Product.sizeChart &&
								Product.sizeChart.chartImage &&
								Product.sizeChart.chartImage[0].url
									? Product.sizeChart.chartImage[0].url
									: null
							}
							style={{ width: "100%" }}
							alt='Infinite-Apps'
						/>
					</div>
				</div>
			</div>
		);
	};

	return (
		<SizeChartModalWrapper>
			<Modal
				width='80%'
				title={
					<div
						style={{
							textAlign: "center",
							fontWeight: "bold",
							fontSize: "1.4rem",
						}}>{`CHECK YOUR SIZE`}</div>
				}
				visible={modalVisible2}
				onOk={() => {
					setModalVisible2(false);
				}}
				// okButtonProps={{ style: { display: "none" } }}
				cancelButtonProps={{ style: { display: "none" } }}
				onCancel={() => {
					setModalVisible2(false);
				}}>
				{mainForm()}
			</Modal>
		</SizeChartModalWrapper>
	);
};

export default SizeChartModal;

const SizeChartModalWrapper = styled.div`
	z-index: 18000 !important;
	.tbodystyle {
		font-size: 2rem !important;
	}
	@media (max-width: 650px) {
		.theadStyle {
			font-size: 0.5rem !important;
		}
	}
`;
