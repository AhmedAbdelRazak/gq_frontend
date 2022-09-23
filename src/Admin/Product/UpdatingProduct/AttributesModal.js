/** @format */

import React from "react";
import styled from "styled-components";
import { Modal } from "antd";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'

const AttributesModal = ({ product, modalVisible, setModalVisible }) => {
	// const handleModal = () => {
	// 	setModalVisible(true);
	// };

	// console.log(product, "product From Modal");

	const mainForm = () => {
		return (
			<>
				<table
					className='table table-bordered table-md-responsive table-hover table-striped'
					style={{ fontSize: "0.75rem", overflowX: "auto" }}>
					<thead className='thead-light'>
						<tr
							style={{
								fontSize: "1rem",
								textTransform: "capitalize",
								textAlign: "center",
							}}>
							<th scope='col'>Item #</th>
							<th scope='col'>Product Name</th>
							<th scope='col'>Product SKU</th>
							<th scope='col'>Product Price</th>
							<th scope='col'>Color</th>
							<th scope='col'>Size</th>
							<th scope='col'>Available Stock</th>
						</tr>
					</thead>
					<tbody
						className='my-auto'
						style={{
							fontSize: "0.9rem",
							textTransform: "capitalize",
							fontWeight: "bolder",
						}}>
						{product &&
							product.productAttributes &&
							product.productAttributes.map((s, i) => {
								return (
									<tr key={i} className=''>
										<td className='my-auto'>{i + 1}</td>

										<td>{product.productName}</td>
										<td>{s.SubSKU}</td>
										<td>{s.priceAfterDiscount}</td>
										<td>{s.color}</td>
										<td>{s.size}</td>
										<td
											style={{
												background: s.quantity <= 0 ? "red" : null,
												color: s.quantity <= 0 ? "white" : null,
											}}>
											{s.quantity}
										</td>

										{/* <td>{Invoice(s)}</td> */}
									</tr>
								);
							})}
					</tbody>
				</table>
			</>
		);
	};

	return (
		<AttributesModalWrapper>
			<Modal
				width='90%'
				title={
					<div
						style={{
							textAlign: "center",
							fontWeight: "bold",
							fontSize: "1.3rem",
							textTransform: "capitalize",
						}}>{`Details About ${product.productName}`}</div>
				}
				visible={modalVisible}
				onOk={() => {
					setModalVisible(false);
				}}
				// okButtonProps={{ style: { display: "block" } }}
				cancelButtonProps={{ style: { display: "none" } }}
				onCancel={() => setModalVisible(false)}>
				{mainForm()}
			</Modal>
		</AttributesModalWrapper>
	);
};

export default AttributesModal;

const AttributesModalWrapper = styled.div``;
