/** @format */

import React, { Fragment, useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";
import styled from "styled-components";
import { useCartContext } from "../Checkout/cart_context";
import { FaTrash, FaMinus, FaPlus, FaTimes } from "react-icons/fa";
import DarkBackground from "./DarkBackground";
import { allLoyaltyPointsAndStoreStatus } from "../apiCore";
import { Helmet } from "react-helmet";
import Sidebar from "./Sidebar";

// import logo from "../pagesImgs/Sinai-I-Logo.jpg";

const NavbarTop = ({
	history,
	click,
	setClick,
	clickMenu,
	setClickMenu,
	language,
	setLanguage,
}) => {
	const {
		cart,
		total_items,
		// clearCart,
		removeItem,
		toggleAmount,
		// total_amount,
		openSidebar,
		closeSidebar,
		isSidebarOpen,
	} = useCartContext();

	// eslint-disable-next-line
	const [logoImage, setLogoImage] = useState("");
	// eslint-disable-next-line
	const [onlineStoreName, setOnlineStoreName] = useState("");

	const handleSidebar = () => {
		setClick(!click);
	};

	const getOnlineStoreName = () => {
		allLoyaltyPointsAndStoreStatus().then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setLogoImage(
					data &&
						data[data.length - 1] &&
						data[data.length - 1].addStoreLogo &&
						data[data.length - 1].addStoreLogo[0] &&
						data[data.length - 1].addStoreLogo[0].url,
				);
				setOnlineStoreName(
					data && data[data.length - 1] && data[data.length - 1].addStoreName,
				);
			}
		});
	};

	useEffect(() => {
		getOnlineStoreName();
		// eslint-disable-next-line
	}, []);

	const storeLogo = logoImage;
	var index = storeLogo.indexOf("upload");

	var finalLogoUrl =
		storeLogo.substr(0, index + 6) +
		"/e_bgremoval" +
		storeLogo.substr(index + 6);

	// console.log(logoImage);

	const sideCart = () => {
		return (
			<SideWrapperCart show={isSidebarOpen}>
				<div
					onClick={closeSidebar}
					className='float-right mr-3'
					style={{ fontSize: "20px", color: "darkRed", cursor: "pointer" }}>
					<FaTimes />
				</div>
				<div className='cellPhoneLayout mt-5'>
					{cart.map((i, k) => {
						const increase = () => {
							toggleAmount(i.id, "inc");
						};
						const decrease = () => {
							toggleAmount(i.id, "dec");
						};
						return (
							<div key={k} className='mt-2'>
								<div className='row mx-auto'>
									<div className='col-3'>
										<span>
											<img
												src={i.image}
												alt={i.name}
												style={{ width: "80px", height: "80px" }}
											/>
										</span>
									</div>
									<div className='col-9 mx-auto my-auto'>
										<div
											style={{
												fontSize: "12px",
												fontWeight: "bold",
												marginLeft: "10px",
											}}>
											{i.name}
										</div>
										<span
											className='buttons-up-down'
											style={{ color: "#282491", marginTop: "10px" }}>
											<span style={{ color: "black" }}>Quantity:</span>
											<button
												type='button'
												className='amount-btn'
												onClick={decrease}>
												<FaMinus />
											</button>
											<span className='amount'>{i.amount}</span>
											<button
												type='button'
												className='amount-btn'
												onClick={increase}>
												<FaPlus />
											</button>
										</span>
										<div
											style={{
												fontSize: "0.9rem",
												fontWeight: "bold",
												letterSpacing: "3px",
												color: "#8d9124",
												marginLeft: "70px",
												marginTop: "10px",
											}}>
											${i.price * i.amount}
										</div>
										<button
											className='trashIcon'
											type='button'
											style={{
												marginLeft: "250px",
												color: "red",
												border: "none",
												fontWeight: "bold",
											}}
											onClick={() => removeItem(i.id)}>
											<FaTrash />
										</button>
									</div>
								</div>

								<hr />
							</div>
						);
					})}
					<div className='link-container' onClick={closeSidebar}>
						<Link
							to='/our-products'
							className='link-btn btn-primary'
							onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
							continue shopping
						</Link>
						<Link
							to='/cart'
							className='link-btn btn-primary'
							onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
							Check Out
						</Link>
					</div>
				</div>
			</SideWrapperCart>
		);
	};

	return (
		<Nav
			className=' navbar  navbar-expand-sm nav-center py-0'
			style={{ backgroundColor: "white" }}>
			{click ? (
				<i
					className='fas fa-times nav-icon faaa-bars'
					onClick={handleSidebar}
					style={{ color: "green" }}></i>
			) : (
				<i
					className='fa fa-bars nav-icon faaa-bars'
					onClick={handleSidebar}
					style={{ color: "lightBlack" }}></i>
			)}
			<Helmet>
				<meta charSet='utf-8' />
				<link
					rel='stylesheet'
					href='https://fonts.googleapis.com/earlyaccess/droidarabickufi.css'
				/>
				<link rel='canonical' href='http://infinite-apps.com' />
			</Helmet>
			{isSidebarOpen ? <DarkBackground isSidebarOpen={isSidebarOpen} /> : null}
			<Sidebar
				clickMenu={clickMenu}
				setClickMenu={setClickMenu}
				click={click}
				setClick={setClick}
				setLanguage={setLanguage}
				language={language}
			/>
			<div className='logo-type ml-5'>
				<Link
					to='/'
					onClick={() => {
						window.scrollTo({ top: 0, behavior: "smooth" });
					}}>
					<div className='infiniteAppsLogo'>
						<img className='imgLogo' src={finalLogoUrl} alt='Infinite Apps' />
					</div>
					{/* <div
						className='logo-type ml-1'
						style={{ color: "black", fontSize: "18px" }}>
						{onlineStoreName} <br />
					</div> */}
				</Link>
			</div>

			<div className='collapse navbar-collapse '>
				<ul className='navbar-nav actual-list ml-auto'>
					{isAuthenticated() && isAuthenticated().user.role === 0 && (
						<li className='nav-item'>
							<Link
								className='nav-link mt-2'
								to='/user-dashboard/last-purchase'
								onClick={() => {
									window.scrollTo({ top: 0, behavior: "smooth" });
								}}
								style={{
									color: "black",
									textDecoration: "underline",
									fontWeight: "bold",
									marginRight: "20px",
									// fontStyle: "italic",
								}}>
								Hello {isAuthenticated().user.name}
							</Link>
						</li>
					)}
					{isAuthenticated() && isAuthenticated().user.role === 1 && (
						<li className='nav-item'>
							<Link
								className='nav-link mt-2'
								to='/admin/dashboard'
								onClick={() => {
									window.scrollTo({ top: 0, behavior: "smooth" });
								}}
								style={{
									color: "black",
									textDecoration: "underline",
									fontWeight: "bold",
									marginRight: "20px",
									// fontStyle: "italic",
								}}>
								Hello {isAuthenticated().user.name}
							</Link>
						</li>
					)}
					{isAuthenticated() && isAuthenticated().user.role === 2 && (
						<li className='nav-item'>
							<Link
								className='nav-link mt-2'
								to='/admin/dashboard'
								onClick={() => {
									window.scrollTo({ top: 0, behavior: "smooth" });
								}}
								style={{
									color: "black",
									textDecoration: "underline",
									fontWeight: "bold",
									marginRight: "20px",
									// fontStyle: "italic",
								}}>
								Hello {isAuthenticated().user.name}
							</Link>
						</li>
					)}
					{!isAuthenticated() && (
						<Fragment>
							<li className='nav-item'>
								<Link
									className='nav-link mt-2 '
									to='/signin'
									onClick={() => {
										window.scrollTo({ top: 0, behavior: "smooth" });
									}}
									style={{
										color: "black",
										textDecoration: "underline",
										fontWeight: "bold",
										marginRight: "20px",
										// fontStyle: "italic",
									}}>
									Login
								</Link>
							</li>

							<li className='nav-item'>
								<Link
									className='nav-link mt-2'
									to='/signup'
									onClick={() => {
										window.scrollTo({ top: 0, behavior: "smooth" });
									}}
									style={{
										color: "black",
										textDecoration: "underline",
										fontWeight: "bold",
										marginRight: "100px",
										// fontStyle: "italic",
									}}>
									Register
								</Link>
							</li>
						</Fragment>
					)}
					{isAuthenticated() && (
						<li className='nav-item'>
							<span
								className='nav-link mt-2'
								style={{
									cursor: "pointer",
									fontWeight: "bold",
									textDecoration: "underline",
									color: "red",
									// fontStyle: "italic",
									marginRight: "100px",
								}}
								onClick={() =>
									signout(() => {
										history.push("/");
										localStorage.removeItem("userHistoryPurchases");
										localStorage.removeItem("order");
										window.scrollTo({ top: 0, behavior: "smooth" });
									})
								}>
								Signout
							</span>
						</li>
					)}
					<li className='nav-item mt-2'>
						<span style={{ fontWeight: "bold" }}>Language</span>{" "}
						<span className='mx-3 btn' style={{ padding: "1px" }}>
							{language === "English" ? (
								<span
									style={{ background: "#c40000", color: "white" }}
									className='btn '
									onClick={() => {
										setLanguage("Arabic");
										// window.location.reload(false);
									}}>
									Arabic
								</span>
							) : (
								<span
									style={{ background: "#c40000", color: "white" }}
									className='btn '
									onClick={() => {
										setLanguage("English");
										// window.location.reload(false);
									}}>
									English
								</span>
							)}
						</span>
					</li>
				</ul>
			</div>

			<div className='nav-cart mr-3 faaa-bars'>
				{/* <FaCartPlus className="nav-icon" onClick={handleCart} /> */}

				<div
					onClick={isSidebarOpen ? closeSidebar : openSidebar}
					style={{ cursor: "pointer" }}>
					<sup>
						<small className='cart-badge'>{total_items}</small>
					</sup>
					<i
						className='fa fa-cart-plus faaa-bars'
						style={{ color: "black" }}
						aria-hidden='true'></i>
				</div>

				{sideCart()}
			</div>
		</Nav>
	);
};

export default withRouter(NavbarTop);

const Nav = styled.nav`
	margin-top: 0px;

	.infiniteAppsLogo {
		width: 65px;
		height: 65px;
		margin-top: 0px;
		margin-bottom: 0px;
		margin-left: 0px;
		border-radius: 15px;
	}

	.btn:hover {
		cursor: pointer;
	}

	.imgLogo {
		width: 120%;
		height: 120%;
		margin-top: 0px;
		margin-bottom: 0px;
		margin-left: 0px;
		border-radius: 15px;
	}

	/* .imgLogo {
			width: 150px;
			height: 79px;
			margin-top: 0px;
			margin-bottom: 0px;
			margin-left: 0px;
			border-radius: 15px;
		} */

	.menu {
		justify-content: flex-end;
	}
	.logo-type {
		font-size: 1rem;
		/* font-family: "Snell Roundhand, cursive"; */
		font-weight: bold;
		text-align: center;
		/* font-style: italic; */
		display: inline-block;
		/* box-shadow: 7px 7px 5px 0px rgba(0, 0, 0, 0.1); */
		vertical-align: middle;
		margin-left: 4px;
	}

	.cart-badge {
		display: none;
	}

	@media (max-width: 680px) {
		position: -webkit-sticky;
		position: sticky;
		top: 0;
		width: 100%;
		padding: 0.5rem 1.5rem;
		background: var(--mainGrey);
		border-bottom: 1px solid lightgrey;
		z-index: 120;

		.cart-badge {
			border-radius: 100%;
			font-size: 13px;
			/* font-style: italic; */
			background: #737070;
			color: black;
			text-decoration: none !important;
			display: block;
			margin-left: 10px;
			font-weight: bold;
			position: absolute;
			top: 0px;
			left: 3px;
		}

		.logo-type {
			font-size: 1rem;
			/* font-family: "Snell Roundhand, cursive"; */
			font-weight: bold;
			text-align: center;
			/* font-style: italic; */
			display: inline-block;
			vertical-align: middle;
			margin-bottom: 0;
			margin-right: 2px;
		}

		.nav-center {
			display: flex;
			align-items: center;
			justify-content: space-between;
			max-width: 1170px;
			margin: 0 auto;
		}
		.nav-icon {
			font-size: 1.35rem;
			cursor: pointer;
			margin-left: 4px;
		}

		.nav-cart {
			position: relative;
		}
		.cart-items {
			background: var(--mainGrey);
			color: black;
			font-weight: bold;
			font-size: 0.7rem;
			position: absolute;
			padding: 0 5px;
		}
		.infiniteAppsLogo {
			width: 159px;
			height: 79px;
			margin-top: 0px;
			margin-bottom: 0px;
			margin-left: 0px;
			border-radius: 15px;
		}

		.imgLogo {
			width: 150px;
			height: 79px;
			margin-top: 0px;
			margin-bottom: 0px;
			margin-left: 0px;
			border-radius: 15px;
		}

		.logo-type {
			font-size: 1rem;
			/* font-family: "Snell Roundhand, cursive"; */
			font-weight: bold;
			text-align: center;
			/* font-style: italic; */
			display: inline-block;
			vertical-align: middle;
			margin-bottom: 0;
		}
	}
	font-size: 1rem;

	li a:hover {
		background: #727272;
		text-decoration: none;
		color: var(--mainWhite) !important;
		outline-color: var(--darkGrey);
		transition: var(--mainTransition);
	}
	@media (min-width: 680px) {
		.faaa-bars {
			display: none;
		}
	}
	@media (max-width: 900px) {
		.actual-list {
			font-size: 0.7rem;
		}
		position: -webkit-sticky;
		position: sticky;
		top: 0;
		z-index: 120;
		padding: 1px;
	}
`;

const SideWrapperCart = styled.nav`
	overflow-y: auto;
	position: fixed;
	top: 0px;
	right: 0;
	width: 80%;
	height: 100%;
	background: var(--mainGrey);
	z-index: 100;
	border-left: 3px solid var(--darkGrey);
	transition: 0.5s;
	transform: ${(props) => (props.show ? "translateX(0)" : "translateX(220%)")};
	/*transform: translateX(-100%);*/ /**this will hide the side bar */
	ul {
		list-style-type: none;
		padding: 0 !important;
	}
	.sidebar-link {
		display: block;
		font-size: 1rem;
		text-transform: capitalize;
		color: var(--mainBlack);
		padding: 1.1rem 1.1rem;
		background: transparent;
		transition: var(--mainTransition);
	}
	.sidebar-link:hover {
		background: #727272;
		color: var(--mainWhite);
		/* padding: 1rem 2rem 1rem 2rem; */
		text-decoration: none;
	}

	.link-container {
		display: flex;
		justify-content: space-between;
		margin-top: 1.5rem;
		margin-left: 5px;
		margin-right: 5px;
	}
	.link-btn {
		background: transparent;
		border-color: transparent;
		text-transform: capitalize;
		padding: 0.25rem 0.5rem;
		background: var(--clr-primary-5);
		color: var(--clr-white);
		border-radius: var(--radius);
		letter-spacing: var(--spacing);
		font-weight: 400;
		cursor: pointer;
	}

	.cellPhoneLayout {
		display: block;
		.buttons-up-down {
			margin-left: 30px;
			display: grid;
			font-size: 12px;
			width: 100px;
			font-weight: bold;
			justify-items: center;
			grid-template-columns: repeat(4, 1fr);
			align-items: center;
			h2 {
				margin-bottom: 0;
			}
			button {
				background: transparent;
				border-color: transparent;
				cursor: pointer;
				padding: 1rem 0;
				width: 2rem;
				height: 1rem;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}
	@media (max-width: 1000px) {
		.trashIcon {
			margin-left: 180px !important;
		}
	}
`;
