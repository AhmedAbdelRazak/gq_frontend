/** @format */

import React, { useEffect, useState } from "react";
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
		getItem(
			<Link to='/admin/dashboard'>Admin Dashboard</Link>,
			"/admin/dashboard",
		),
		getItem(
			<Link to='/admin/gq-reports'>GQ Shop Reports</Link>,
			"/admin/gq-reports",
		),
	]),
	// getItem("Option 2", "3", <DesktopOutlined />),
	// getItem("Option 3", "4", <ContainerOutlined />),

	getItem("Products Management", "sub4", <ShoppingCartOutlined />, [
		getItem("Categories Management", "sub3", <AppstoreOutlined />, [
			getItem("Add Category", "/admin/add-category"),
			getItem(
				<Link to='/admin/update-category'>Update Category</Link>,
				"/admin/update-category",
			),
			getItem("Delete Category", "/admin/delete-category"),
		]),
		getItem("Subcategories Management", "sub7", <AppstoreOutlined />, [
			getItem("Add Subcategory", "/admin/add-subcategory"),
			getItem("Update Subcategory", "/admin/update-subcategory"),
			getItem("Delete Subcategory", "/admin/delete-subcategory"),
		]),
		getItem("Attributes", "sub17", <AppstoreOutlined />, [
			getItem("Add Colors", "/admin/add-color"),
			getItem("Add Sizes", "/admin/add-size"),
		]),
		getItem("Add New Product", "/admin/add-product"),
		getItem(
			<Link
				to='/order-taker/update-product'
				onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
				Inventory Report
			</Link>,
			"/order-taker/update-product",
		),
		getItem("Delete Product", "/admin/delete-product"),
	]),

	getItem("Shipping Options", "sub30", <CopyOutlined />, [
		getItem("Add Shipping Carrier", "/admin/add-shipping-carrier"),
		getItem("Update Shipping Carrier", "/admin/update-shipping-carrier"),
		getItem("Delete Shipping Carrier", "/admin/delete-shipping-carrier"),
	]),

	getItem("Orders Management", "sub6", <DesktopOutlined />, [
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

	getItem("Gender Management", "sub2", <MailOutlined />, [
		getItem("Add Gender", "/admin/add-gender"),
		getItem("Update Gender", "/admin/update-gender"),
		getItem("Delete Gender", "/admin/delete-gender"),
	]),
];

const AdminMenu = ({
	fromPage,
	setAdminMenuStatus,
	collapsed,
	setCollapsed,
}) => {
	const [windowDimensions, setWindowDimensions] = useState(
		getWindowDimensions(),
	);

	const toggleCollapsed = () => {
		setCollapsed(!collapsed);
		setAdminMenuStatus(!collapsed);
	};

	function getWindowDimensions() {
		const { innerWidth: width, innerHeight: height } = window;
		return {
			width,
			height,
		};
	}

	useEffect(() => {
		if (window.innerWidth <= 1400) {
			setCollapsed(true);
			setAdminMenuStatus(true);
		} else {
			setCollapsed(false);
			setAdminMenuStatus(false);
		}
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		function handleResize() {
			setWindowDimensions(getWindowDimensions());
			if (getWindowDimensions().width <= 1400) {
				setCollapsed(true);
				setAdminMenuStatus(true);
			} else {
				setCollapsed(false);
				setAdminMenuStatus(false);
			}
		}

		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
		// eslint-disable-next-line
	}, [windowDimensions]);

	console.log(collapsed, "collapsed");
	console.log(windowDimensions.width, "collapsed");

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
					marginLeft: 10,
					marginTop: 3,
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
						: fromPage === "UpdateProductOrderTaker"
						? "/order-taker/update-product"
						: fromPage === "DeleteProduct"
						? "/admin/delete-product"
						: fromPage === "AddSubcategory"
						? "/admin/add-subcategory"
						: fromPage === "UpdateSubcategory"
						? "/admin/update-subcategory"
						: fromPage === "DeleteSubcategory"
						? "/admin/delete-subcategory"
						: fromPage === "CreateNewOrderOrderTaker"
						? "/order-taker/create-new-order"
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
						: fromPage === "AddColor"
						? "/admin/add-color"
						: fromPage === "AddSize"
						? "/admin/add-size"
						: "/admin/dashboard"
				}
				defaultOpenKeys={[
					"sub1",

					fromPage === "AddGender" ||
					fromPage === "UpdatedGender" ||
					fromPage === "DeleteGender"
						? "sub2"
						: null,

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

					fromPage === "AddColor" || fromPage === "AddSize" ? "sub17" : null,

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
	background: ${(props) => (props.show ? "" : "")};
	top: 0px !important;
	position: relative;
	z-index: 11000;

	li {
		/* margin: 20px auto; */
		font-size: 0.9rem;
		margin-top: ${(props) => (props.show ? "50px " : "0px")};
	}

	ul {
	}

	.ant-menu.ant-menu-inline-collapsed {
		min-height: 1000px;
	}

	.ant-menu.ant-menu-dark,
	.ant-menu-dark .ant-menu-sub,
	.ant-menu.ant-menu-dark .ant-menu-sub {
		color: rgba(255, 255, 255, 0.65);
		background: #1e1e2d !important;
	}

	.ant-menu.ant-menu-dark,
	.ant-menu-dark {
		position: ${(props) => (props.show ? "" : "")};
	}

	@media (max-width: 1650px) {
		ul {
			width: 250px;
			padding: 0px !important;
			margin: 0px !important;
		}

		ul > li {
			font-size: 0.8rem !important;
		}
	}

	@media (max-width: 750px) {
		ul {
			display: ${(props) => (props.show ? "none" : "")};
			margin-top: 0px !important;
			top: 0px !important;
		}

		.ant-menu.ant-menu-dark {
			position: fixed;
		}

		button {
			margin-top: 15px !important;
			position: ${(props) => (props.show ? "" : "")};
			display: ${(props) => (props.show ? "" : "none")};
		}
	}
`;
