/** @format */

import React from "react";
import styled from "styled-components";
import { Modal } from "antd";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
// eslint-disable-next-line
import { toast } from "react-toastify";
// eslint-disable-next-line
import moment from "moment";
import UpdateAddingNewProduct from "../CreateNewOrder/UpdateAddingNewProduct";
import UpdateExistingProduct from "../CreateNewOrder/UpdateExistingProduct";

const UpdateProductModal = ({
	modalVisible,
	setModalVisible,
	updateElement,
	setUpdateSingleOrder,
	setProductToBeUpdated,
	updateSingleOrder,
	productToBeUpdated,
	singleOrder,
	allColors,
	oldProducts,
	setOldProducts,
	newProducts,
	setNewProducts,
}) => {
	const mainForm = () => {
		return (
			<>
				{updateElement === "Add New Products To The Order" ? (
					<UpdateAddingNewProduct
						updateSingleOrder={updateSingleOrder}
						setUpdateSingleOrder={setUpdateSingleOrder}
						allColors={allColors}
					/>
				) : updateElement.includes("Update Product") ? (
					<UpdateExistingProduct
						updateSingleOrder={updateSingleOrder}
						setUpdateSingleOrder={setUpdateSingleOrder}
						productToBeUpdated={productToBeUpdated}
						singleOrder={singleOrder}
						allColors={allColors}
						setProductToBeUpdated={setProductToBeUpdated}
						oldProducts={oldProducts}
						setOldProducts={setOldProducts}
						newProducts={newProducts}
						setNewProducts={setNewProducts}
					/>
				) : null}
			</>
		);
	};

	return (
		<UpdateProductModalWrapper>
			<Modal
				width='65%'
				title={
					<div
						style={{
							textAlign: "center",
							fontWeight: "bold",
							fontSize: "1.3rem",
						}}>{`${updateElement}`}</div>
				}
				open={modalVisible}
				onOk={() => {
					setModalVisible(false);
					// toast.success(`${updateElement} was successfully updated`);
				}}
				// okButtonProps={{ style: { display: "none" } }}
				cancelButtonProps={{ style: { display: "none" } }}
				onCancel={() => setModalVisible(false)}>
				{mainForm()}
			</Modal>
		</UpdateProductModalWrapper>
	);
};

export default UpdateProductModal;

const UpdateProductModalWrapper = styled.div``;
