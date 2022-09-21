/** @format */

import React, { useState } from "react";
import "antd/dist/antd.css";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import {
	AppstoreOutlined,
	SettingOutlined,
	DesktopOutlined,
	SearchOutlined,
	BellOutlined,
	WindowsOutlined,
	HomeOutlined,
	LogoutOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
// eslint-disable-next-line
import LetterGPhoto from "../../GeneralImages/LetterG.jpg";
import { CSSTransition } from "react-transition-group";
import { isAuthenticated, signout } from "../../auth";

const Navbar = ({ fromPage, history }) => {
	const [showAccountMenu, setShowAccountMenu] = useState(false);
	const { employeeImage } = isAuthenticated().user;

	console.log(employeeImage, "employeeImage");
	return (
		<NavbarWrapper>
			<div className='row'>
				<div className='col-9'>
					<Menu
						mode='horizontal'
						defaultSelectedKeys={
							fromPage === "AdminDasboard"
								? "/admin/dashboard"
								: fromPage === "AddGender"
								? "/admin/add-gender"
								: fromPage === "AddCategory"
								? "/admin/add-category"
								: fromPage === "AddProduct"
								? "/admin/add-product"
								: fromPage === "AddSubcategory"
								? "/admin/add-subcategory"
								: fromPage === "CreateNewOrder"
								? "/admin/create-new-order"
								: fromPage === "UpdateShippingOption"
								? "/admin/update-shipping-carrier"
								: fromPage === "AddShippingOption"
								? "/admin/add-shipping-carrier"
								: fromPage === "OrdersHist"
								? "/admin/orders-hist"
								: "/admin/dashboard"
						}>
						<Menu.Item key='/admin/dashboard' icon={<HomeOutlined />}>
							<Link to='/admin/dashboard'>Owner Dashboard</Link>
						</Menu.Item>
						<Menu.SubMenu
							key='SubMenu'
							title='Sales'
							icon={<SettingOutlined />}>
							<Menu.Item key='two' icon={<AppstoreOutlined />}>
								Day Over Day Sales
							</Menu.Item>
							<Menu.Item key='three' icon={<AppstoreOutlined />}>
								Pending Sales
							</Menu.Item>
							<Menu.Item key='/admin/orders-hist' icon={<AppstoreOutlined />}>
								<Link to='/admin/orders-hist'>Sales History</Link>
							</Menu.Item>
							<Menu.ItemGroup title='Top Trending'>
								<Menu.Item key='four' icon={<AppstoreOutlined />}>
									Top Sold Items
								</Menu.Item>
								<Menu.Item key='five' icon={<AppstoreOutlined />}>
									Top Employee Performance
								</Menu.Item>
							</Menu.ItemGroup>
						</Menu.SubMenu>

						<Menu.SubMenu
							key='SubMenu2'
							title='Modules'
							icon={<DesktopOutlined />}>
							<Menu.Item key='/admin/add-gender' icon={<AppstoreOutlined />}>
								<Link to='/admin/add-gender'>Gender Management</Link>
							</Menu.Item>
							<Menu.Item key='/admin/add-category' icon={<AppstoreOutlined />}>
								<Link to='/admin/add-category'>Categories Management</Link>
							</Menu.Item>
							<Menu.Item key='/admin/add-product' icon={<AppstoreOutlined />}>
								<Link to='/admin/add-product'>Products And Inventory</Link>
							</Menu.Item>
							<Menu.Item
								key='/admin/add-shipping-carrier'
								icon={<AppstoreOutlined />}>
								<Link to='/admin/add-shipping-carrier'>
									Shipping / Carriers
								</Link>
							</Menu.Item>
							<Menu.Item key='eleven' icon={<AppstoreOutlined />}>
								Financial
							</Menu.Item>
						</Menu.SubMenu>
					</Menu>
				</div>

				<div className='col-3 rightList'>
					<ul>
						<li>
							<SearchOutlined />
						</li>
						<li>
							<BellOutlined />
						</li>
						<li>
							<WindowsOutlined />
						</li>

						<li
							onMouseOver={() => setShowAccountMenu(true)}
							onMouseLeave={() => setShowAccountMenu(false)}
							onClick={() => {
								// window.scrollTo({ top: 0, behavior: "smooth" });
							}}>
							<img src={employeeImage} alt='GQShop' />
							<CSSTransition
								in={showAccountMenu}
								timeout={200}
								classNames='subMenuWrapper'
								unmountOnExit={showAccountMenu ? false : true}
								onEnter={() => setShowAccountMenu(showAccountMenu)}
								// onExited={() => setShowAccountMenu(!showAccountMenu)}
							>
								<ul className='subMenuWrapper'>
									<li
										className='subMenuList'
										onClick={() => {
											setShowAccountMenu(!showAccountMenu);
											signout(() => {
												window.location.reload(false);
											});
										}}>
										{isAuthenticated().user.name} Account!
										<br />
										<br />
										<LogoutOutlined />
										{"   "}{" "}
										<span style={{ color: "#ffd8d8", zIndex: "100" }}>
											Logout
										</span>
									</li>
								</ul>
							</CSSTransition>
						</li>
					</ul>
				</div>
			</div>
		</NavbarWrapper>
	);
};

export default Navbar;

const NavbarWrapper = styled.div`
	background: white;
	margin-bottom: 20px;

	.rightList > ul {
		list-style-type: none;
		background: white;
	}

	.rightList > ul > li {
		display: inline-block;
		margin-left: 25px;
		font-size: 1.5rem;
		color: #b6b6b6;
		font-weight: bold !important;
		transition: 0.3s;
		margin-top: 5px;
		padding-right: 5px;
		padding-left: 5px;
		padding-bottom: 10px;
	}

	.rightList > ul > li:hover {
		background: #d8ebff;
		transition: 0.3s;
		border-radius: 3px;
		padding-right: 5px;
		padding-left: 5px;
		padding-bottom: 10px;
		cursor: pointer;
	}

	.rightList > ul > li > img {
		width: 30px;
		object-fit: cover;
		border-radius: 5px;
	}

	.subMenuWrapper {
		position: absolute;
		background: #00458a;
		border-radius: 5px;
		padding: 20px;
		right: 50px;
		margin-top: 10px;
	}

	.subMenuList {
		display: block;
		color: white !important;
		font-size: 0.9rem;
	}

	.subMenuList a {
		display: block;
		color: white !important;
		font-size: 0.9rem;
		font-weight: bold;
	}

	.subMenuWrapper-enter {
		opacity: 0;
		transform: scale(0.4);
	}
	.subMenuWrapper-enter-active {
		opacity: 1;
		transform: translateX(0);
		transition: opacity 300ms, transform 300ms;
	}
	.subMenuWrapper-exit {
		opacity: 1;
	}
	.subMenuWrapper-exit-active {
		opacity: 0;
		transform: scale(0.9);
		transition: opacity 200ms, transform 200ms;
	}
`;
