/** @format */

import React, { useState } from "react";
import styled from "styled-components";
import { Redirect, Link } from "react-router-dom";
import "antd/dist/antd.css";
import {
	AppstoreOutlined,
	ContainerOutlined,
	// eslint-disable-next-line
	DesktopOutlined,
	ShoppingCartOutlined,
	MailOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	PieChartOutlined,
	CopyOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";

function getItem(label, key, icon, children, type) {
	return {
		key,
		icon,
		children,
		label,
		type,
	};
}

const items = [
	getItem("Admin Dashboard", "sub1", <PieChartOutlined />, [
		getItem("Admin Dashboard", "/admin/dashboard"),
		getItem("GQ Shop Reports", "/admin/gq-reports"),
	]),
	// getItem("Option 2", "3", <DesktopOutlined />),
	// getItem("Option 3", "4", <ContainerOutlined />),
	getItem("Gender Management", "sub2", <MailOutlined />, [
		getItem("Add Gender", "/admin/add-gender"),
		getItem("Update Gender", "/admin/update-gender"),
		getItem("Delete Gender", "/admin/delete-gender"),
	]),

	getItem("Products Management", "sub4", <ShoppingCartOutlined />, [
		getItem("Categories Management", "sub3", <AppstoreOutlined />, [
			getItem("Add Category", "/admin/add-category"),
			getItem("Update Category", "/admin/update-category"),
			getItem("Delete Category", "/admin/delete-category"),
		]),
		getItem("Subcategories Management", "sub7", <AppstoreOutlined />, [
			getItem("Add Subcategory", "/admin/add-subcategory"),
			getItem("Update Subcategory", "/admin/update-subcategory"),
			getItem("Delete Subcategory", "/admin/delete-subcategory"),
		]),
		getItem("Add New Product", "/admin/add-product"),
		getItem("Update Product", "/admin/update-product"),
		getItem("Delete Product", "/admin/delete-product"),
	]),

	getItem("Orders Management", "sub6", <DesktopOutlined />, [
		getItem("Shipping Options", "sub30", <CopyOutlined />, [
			getItem("Add Shipping Carrier", "/admin/add-shipping-carrier"),
			getItem("Update Shipping Carrier", "/admin/update-shipping-carrier"),
			getItem("Delete Shipping Carrier", "/admin/delete-shipping-carrier"),
		]),
		getItem(
			<Link
				to='/order-taker/create-new-order'
				onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
				Create A New Order
			</Link>,
			"/order-taker/create-new-order",
		),
		getItem(
			<Link
				to='/order-taker/orders-hist'
				onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
				Sales History
			</Link>,
			"/order-taker/orders-hist",
		),
	]),
	getItem("Employees Management", "sub5", <ContainerOutlined />, [
		getItem("Add A New Employee", "/admin/add-employee"),
		getItem("Update Employee Profile", "/admin/update-employee"),
	]),

	// getItem("Navigation Two", "sub3", <AppstoreOutlined />, [
	// 	getItem("Option 9", "9"),
	// 	getItem("Option 10", "10"),
	// 	getItem("Submenu", "sub3", null, [
	// 		getItem("Option 11", "11"),
	// 		getItem("Option 12", "12"),
	// 	]),
	// ]),
];

const AdminMenu = ({ fromPage }) => {
	const [collapsed, setCollapsed] = useState(false);

	const toggleCollapsed = () => {
		setCollapsed(!collapsed);
	};

	// console.log(fromPage, "Ahowan");

	return (
		<AdminMenuWrapper
			show={collapsed}
			style={{
				width: 285,
			}}>
			<Button
				type='primary'
				onClick={toggleCollapsed}
				style={{
					marginBottom: 8,
					textAlign: "center",
					// marginLeft: 10,
				}}>
				{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
			</Button>
			<Menu
				defaultSelectedKeys={
					fromPage === "AdminDasboard"
						? "/admin/dashboard"
						: fromPage === "AddGender"
						? "/admin/add-gender"
						: fromPage === "UpdateGender"
						? "/admin/update-gender"
						: fromPage === "DeleteGender"
						? "/admin/delete-gender"
						: fromPage === "AddCategory"
						? "/admin/add-category"
						: fromPage === "UpdateCategory"
						? "/admin/update-category"
						: fromPage === "DeleteCategory"
						? "/admin/delete-category"
						: fromPage === "AddProduct"
						? "/admin/add-product"
						: fromPage === "UpdateProduct"
						? "/admin/update-product"
						: fromPage === "DeleteProduct"
						? "/admin/delete-product"
						: fromPage === "AddSubcategory"
						? "/admin/add-subcategory"
						: fromPage === "UpdateSubcategory"
						? "/admin/update-subcategory"
						: fromPage === "DeleteSubcategory"
						? "/admin/delete-subcategory"
						: fromPage === "CreateNewOrder"
						? "/admin/create-new-order"
						: fromPage === "UpdateShippingOption"
						? "/admin/update-shipping-carrier"
						: fromPage === "AddShippingOption"
						? "/admin/add-shipping-carrier"
						: fromPage === "DeleteShippingOption"
						? "/admin/delete-shipping-carrier"
						: fromPage === "OrdersHistOrderTaker"
						? "/order-taker/orders-hist"
						: fromPage === "AddEmployee"
						? "/admin/add-employee"
						: fromPage === "MainReports"
						? "/admin/gq-reports"
						: fromPage === "UpdateEmployee"
						? "/admin/update-employee"
						: fromPage === "CreateNewOrderOrderTaker"
						? "/order-taker/create-new-order"
						: "/order-taker/create-new-order"
				}
				defaultOpenKeys={[
					"sub1",
					"sub2",
					fromPage === "AddCategory" ||
					fromPage === "UpdateCategory" ||
					fromPage === "DeleteCategory"
						? "sub3"
						: null,

					fromPage === "AddSubcategory" ||
					fromPage === "UpdateSubcategory" ||
					fromPage === "DeleteSubcategory"
						? "sub7"
						: null,
					fromPage === "AddShippingOption" ||
					fromPage === "UpdateShippingOption" ||
					fromPage === "DeleteShippingOption"
						? "sub30"
						: null,

					"sub4",
					"sub5",
					"sub6",
				]}
				mode='inline'
				theme='dark'
				inlineCollapsed={collapsed}
				items={items}
				onClick={(e) => <Redirect to={e.key} />}
			/>
		</AdminMenuWrapper>
	);
};

export default AdminMenu;

const AdminMenuWrapper = styled.div`
	margin-left: 3px;
	margin-bottom: 15px;
	background: ${(props) => (props.show ? null : "white")};
	top: 0px !important;
	position: relative;

	li {
		/* margin: 20px auto; */
		font-size: 0.9rem;
		margin-top: ${(props) => (props.show ? "50px " : "0px")};
	}

	.ant-menu.ant-menu-inline-collapsed {
		min-height: 700px;
	}

	.ant-menu.ant-menu-dark,
	.ant-menu-dark .ant-menu-sub,
	.ant-menu.ant-menu-dark .ant-menu-sub {
		color: rgba(255, 255, 255, 0.65);
		background: #1e1e2d !important;
	}
`;
