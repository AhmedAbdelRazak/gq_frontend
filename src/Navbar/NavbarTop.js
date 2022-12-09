/** @format */

import React, { Fragment, useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";
import styled from "styled-components";
import { useCartContext } from "../Checkout/cart_context";
import { FaTrash, FaMinus, FaPlus, FaTimes } from "react-icons/fa";
import DarkBackground from "./DarkBackground";
import {
	allLoyaltyPointsAndStoreStatus,
	getColors,
	getProducts,
} from "../apiCore";
import { Helmet } from "react-helmet";
import Sidebar from "./Sidebar";
import EgyptianFlag from "../GeneralImages/Egypt.png";
import AmericanFlag from "../GeneralImages/UnitedStates.png";
// import logo from "../pagesImgs/Sinai-I-Logo.jpg";

const NavbarTop = ({
	history,
	click,
	setClick,
	clickMenu,
	setClickMenu,
	language,
	setLanguage,
	chosenLanguage,
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
		changeSize,
		changeColor,
	} = useCartContext();

	// eslint-disable-next-line
	const [logoImage, setLogoImage] = useState("");
	// eslint-disable-next-line
	const [onlineStoreName, setOnlineStoreName] = useState("");
	const [allColors, setAllColors] = useState([]);
	const [allGenders, setAllGenders] = useState([]);

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

	const gettingAllProducts = () => {
		getProducts().then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				//Gender Unique
				var genderUnique = data
					.filter((i) => i.activeProduct === true)
					.map((ii) => ii.gender);

				let uniqueGenders = [
					...new Map(
						genderUnique.map((item) => [item["genderName"], item]),
					).values(),
				];
				setAllGenders(uniqueGenders);
			}
		});
	};

	useEffect(() => {
		getOnlineStoreName();
		gettingAllProducts();
		// eslint-disable-next-line
	}, []);

	const gettingAllColors = () => {
		getColors().then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllColors(data);
			}
		});
	};

	useEffect(() => {
		gettingAllColors();

		// eslint-disable-next-line
	}, []);

	const storeLogo = logoImage;
	var index = storeLogo.indexOf("upload");

	// eslint-disable-next-line
	var finalLogoUrl =
		storeLogo.substr(0, index + 6) +
		"/e_bgremoval" +
		storeLogo.substr(index + 6);

	// console.log(logoImage);
	var checkingAvailability = [];

	const sideCart = () => {
		return (
			<SideWrapperCart show={isSidebarOpen}>
				<div
					onClick={closeSidebar}
					className='float-right mr-3'
					style={{ fontSize: "20px", color: "darkRed", cursor: "pointer" }}>
					<FaTimes />
				</div>
				{cart && cart.length === 0 ? (
					<div style={{ marginTop: "80px" }}>
						<h3
							style={{
								textAlign: "center",
								fontWeight: "bolder",
								color: "darkcyan",
							}}>
							Your Cart Is Empty
						</h3>
					</div>
				) : (
					<div className='cellPhoneLayout mt-5'>
						{cart.map((i, k) => {
							var productColors =
								i.allProductDetailsIncluded.productAttributes.map(
									(iii) => iii.color,
								);
							var uniqueProductColors = [
								...new Map(productColors.map((item) => [item, item])).values(),
							];

							var productSizes =
								i.allProductDetailsIncluded.productAttributes.map(
									(iii) => iii.size,
								);
							var uniqueProductSizes = [
								...new Map(productSizes.map((item) => [item, item])).values(),
							];

							var chosenAttribute =
								i.allProductDetailsIncluded.productAttributes.filter(
									(iii) => iii.color === i.color && iii.size === i.size,
								)[0];

							if (i.allProductDetailsIncluded.activeBackorder) {
								checkingAvailability.push(true);
							} else {
								checkingAvailability.push(chosenAttribute.quantity >= i.amount);
							}

							const increase = () => {
								toggleAmount(i.id, "inc", chosenAttribute, i.max);
							};
							const decrease = () => {
								toggleAmount(i.id, "dec", chosenAttribute, i.max);
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
													textTransform: "capitalize",
												}}>
												{i.name}
											</div>
											<div
												className='row'
												style={{
													fontSize: "12px",
													fontWeight: "bold",
													marginLeft: "10px",
													marginTop: "10px",
													textTransform: "capitalize",
												}}>
												<div className='col-4 mr-3'>
													Size:{" "}
													<select
														style={{ textTransform: "capitalize" }}
														onChange={(e) => {
															var chosenAttribute2 =
																i.allProductDetailsIncluded.productAttributes.filter(
																	(iii) =>
																		iii.color === i.color &&
																		iii.size.toLowerCase() ===
																			e.target.value.toLowerCase(),
																)[0];
															changeSize(
																i.id,
																e.target.value,
																i.color,
																chosenAttribute2.quantity,
																i.size,
															);
														}}>
														<option style={{ textTransform: "capitalize" }}>
															{i.size}
														</option>

														{uniqueProductSizes &&
															uniqueProductSizes.map((ss, ii) => {
																return (
																	<option key={ii} value={ss}>
																		{ss}
																	</option>
																);
															})}
													</select>
												</div>
												<div className='col-4  '>
													Color:{" "}
													<select
														style={{ textTransform: "capitalize" }}
														onChange={(e) => {
															var chosenColorImageHelper =
																i.allProductDetailsIncluded.productAttributes.filter(
																	(iii) => iii.color === e.target.value,
																)[0];

															var chosenColorImage =
																chosenColorImageHelper &&
																chosenColorImageHelper.productImages &&
																chosenColorImageHelper.productImages[0] &&
																chosenColorImageHelper.productImages[0].url;

															var chosenAttribute2 =
																i.allProductDetailsIncluded.productAttributes.filter(
																	(iii) =>
																		iii.color.toLowerCase() ===
																			e.target.value.toLowerCase() &&
																		iii.size.toLowerCase() === i.size,
																)[0];
															changeColor(
																i.id,
																e.target.value,
																i.size,
																chosenColorImage,
																chosenAttribute2.quantity,
																i.color,
															);
														}}>
														<option style={{ textTransform: "capitalize" }}>
															{allColors &&
																allColors[
																	allColors
																		.map((ii) => ii.hexa)
																		.indexOf(i.color)
																] &&
																allColors[
																	allColors
																		.map((ii) => ii.hexa)
																		.indexOf(i.color)
																].color}
														</option>

														{uniqueProductColors &&
															uniqueProductColors.map((cc, ii) => {
																return (
																	<option key={ii} value={cc}>
																		{allColors &&
																			allColors[
																				allColors
																					.map((ii) => ii.hexa)
																					.indexOf(cc)
																			] &&
																			allColors[
																				allColors
																					.map((ii) => ii.hexa)
																					.indexOf(cc)
																			].color}
																	</option>
																);
															})}
													</select>
												</div>
											</div>
											<div
												style={{
													fontSize: "12px",
													fontWeight: "bold",
													marginLeft: "10px",
													marginTop: "10px",
													textTransform: "capitalize",
													color: "darkgreen",
												}}>
												{i.allProductDetailsIncluded
													.activeBackorder ? null : chosenAttribute.quantity >=
												  i.amount ? null : (
													<span style={{ color: "red" }}>
														Unavailable Stock
													</span>
												)}
											</div>
											{chosenLanguage === "Arabic" ? (
												<span
													className='buttons-up-down'
													style={{ color: "#282491", marginTop: "10px" }}>
													<button
														type='button'
														className='amount-btn'
														onClick={increase}>
														<FaPlus />
													</button>
													<span className='amount'>{i.amount}</span>

													<button
														type='button'
														className='amount-btn'
														onClick={decrease}>
														<FaMinus />
													</button>
													<span style={{ color: "black" }}>الكمية</span>
												</span>
											) : (
												<span
													className='buttons-up-down'
													style={{ color: "#282491", marginTop: "10px" }}>
													<span style={{ color: "black" }}>Quantity</span>
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
											)}
											<div
												style={{
													fontSize: "0.9rem",
													fontWeight: "bold",
													letterSpacing: "3px",
													color: "#8d9124",
													marginLeft: "70px",
													marginTop: "10px",
												}}>
												{i.priceAfterDiscount * i.amount} L.E.
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
												onClick={() => removeItem(i.id, i.size, i.color)}>
												<FaTrash />
											</button>
										</div>
									</div>

									<hr />
								</div>
							);
						})}
						<div className='link-container' onClick={closeSidebar}>
							<div className='link-btn-wrapper'>
								<Link
									to='/our-products'
									className='link-btn btn-block w-75 mx-auto text-center py-2'
									onClick={() =>
										window.scrollTo({ top: 0, behavior: "smooth" })
									}>
									continue shopping
								</Link>
							</div>

							<br />
							<div className='link-btn-wrapper'>
								<Link
									to='/cart'
									className='link-btn btn-block w-75 mx-auto text-center py-2'
									onClick={() =>
										window.scrollTo({ top: 0, behavior: "smooth" })
									}>
									Check Out
								</Link>
							</div>
						</div>
					</div>
				)}
			</SideWrapperCart>
		);
	};

	return (
		<Nav
			className=' navbar  navbar-expand-sm nav-center py-0'
			style={{ backgroundColor: "rgb(235, 235, 235)" }}>
			{click ? (
				<i
					className='fas fa-times nav-icon faaa-bars'
					onClick={handleSidebar}
					style={{ color: "darkred" }}></i>
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
				allGenders={allGenders}
			/>
			<div className='logo-type ml-5 logoWrapper'>
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
								className='nav-link'
								to='/user/dashboard'
								onClick={() => {
									window.scrollTo({ top: 0, behavior: "smooth" });
								}}
								style={{
									color: "black",
									// textDecoration: "underline",
									// fontWeight: "bold",
									marginRight: "20px",
									// fontStyle: "italic",
								}}>
								<svg
									className='Styles__AccountIcon-d7nzgu-1 pWXnP'
									width='17'
									height='17'
									style={{ marginRight: "5px", marginBottom: "2px" }}
									viewBox='0 0 20 20'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
									role='img'
									aria-labelledby='00ea8e94-2216-4b64-acff-4d2fb3126ffb'>
									<title id='00ea8e94-2216-4b64-acff-4d2fb3126ffb'>
										Account
									</title>
									<path
										fill-rule='evenodd'
										clip-rule='evenodd'
										d='M13.5 4.79092C13.5 2.53192 11.4849 0.700012 9 0.700012L8.782 0.704731C6.39831 0.808141 4.5 2.59836 4.5 4.79092V5.6091C4.5 7.8681 6.5151 9.70001 9 9.70001L9.218 9.69529C11.6017 9.59188 13.5 7.80166 13.5 5.6091V4.79092ZM8.84702 2.20332L9.014 2.19901L9.18583 2.20488C10.7822 2.28873 12 3.44567 12 4.79092V5.6091L11.9946 5.76395C11.9049 7.04676 10.7094 8.12918 9.15298 8.1967L8.96754 8.20036L8.78519 8.19546C7.21783 8.1113 6 6.95435 6 5.6091V4.79092L6.0054 4.63607C6.09507 3.35326 7.29059 2.27084 8.84702 2.20332ZM15.3594 12.6468C13.6548 12.1815 11.3274 11.7 9 11.7C6.6726 11.7 4.3452 12.1815 2.6406 12.6468C1.0773 13.0725 0 14.4972 0 16.1172V18H18V16.1172L17.9949 15.9238C17.913 14.3848 16.8602 13.0555 15.3594 12.6468ZM3.03471 14.0941C5.07704 13.5366 7.12428 13.2 9 13.2C10.8757 13.2 12.923 13.5366 14.9644 14.0939L15.1214 14.1434C15.9428 14.4386 16.5 15.2247 16.5 16.1172V16.499H1.5V16.1172L1.50646 15.9512C1.57496 15.0735 2.1823 14.3262 3.03471 14.0941Z'
										fill='black'></path>
								</svg>
								Hello {isAuthenticated().user.name}
							</Link>
						</li>
					)}
					{isAuthenticated() && isAuthenticated().user.role === 1 && (
						<li className='nav-item'>
							<Link
								className='nav-link'
								to='/admin/dashboard'
								onClick={() => {
									window.scrollTo({ top: 0, behavior: "smooth" });
								}}
								style={{
									color: "black",
									// textDecoration: "underline",
									// fontWeight: "bold",
									marginRight: "20px",
									// fontStyle: "italic",
								}}>
								<svg
									className='Styles__AccountIcon-d7nzgu-1 pWXnP'
									width='17'
									height='17'
									style={{ marginRight: "5px", marginBottom: "2px" }}
									viewBox='0 0 20 20'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
									role='img'
									aria-labelledby='00ea8e94-2216-4b64-acff-4d2fb3126ffb'>
									<title id='00ea8e94-2216-4b64-acff-4d2fb3126ffb'>
										Account
									</title>
									<path
										fill-rule='evenodd'
										clip-rule='evenodd'
										d='M13.5 4.79092C13.5 2.53192 11.4849 0.700012 9 0.700012L8.782 0.704731C6.39831 0.808141 4.5 2.59836 4.5 4.79092V5.6091C4.5 7.8681 6.5151 9.70001 9 9.70001L9.218 9.69529C11.6017 9.59188 13.5 7.80166 13.5 5.6091V4.79092ZM8.84702 2.20332L9.014 2.19901L9.18583 2.20488C10.7822 2.28873 12 3.44567 12 4.79092V5.6091L11.9946 5.76395C11.9049 7.04676 10.7094 8.12918 9.15298 8.1967L8.96754 8.20036L8.78519 8.19546C7.21783 8.1113 6 6.95435 6 5.6091V4.79092L6.0054 4.63607C6.09507 3.35326 7.29059 2.27084 8.84702 2.20332ZM15.3594 12.6468C13.6548 12.1815 11.3274 11.7 9 11.7C6.6726 11.7 4.3452 12.1815 2.6406 12.6468C1.0773 13.0725 0 14.4972 0 16.1172V18H18V16.1172L17.9949 15.9238C17.913 14.3848 16.8602 13.0555 15.3594 12.6468ZM3.03471 14.0941C5.07704 13.5366 7.12428 13.2 9 13.2C10.8757 13.2 12.923 13.5366 14.9644 14.0939L15.1214 14.1434C15.9428 14.4386 16.5 15.2247 16.5 16.1172V16.499H1.5V16.1172L1.50646 15.9512C1.57496 15.0735 2.1823 14.3262 3.03471 14.0941Z'
										fill='black'></path>
								</svg>
								Hello {isAuthenticated().user.name}
							</Link>
						</li>
					)}
					{isAuthenticated() && isAuthenticated().user.role === 2 && (
						<li className='nav-item'>
							<Link
								className='nav-link '
								to='/admin/dashboard'
								onClick={() => {
									window.scrollTo({ top: 0, behavior: "smooth" });
								}}
								style={{
									color: "black",
									// textDecoration: "underline",
									// fontWeight: "bold",
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
									className='nav-link  '
									to='/signin'
									onClick={() => {
										window.scrollTo({ top: 0, behavior: "smooth" });
									}}
									style={{
										color: "black",
										textDecoration: "underline",
										// fontWeight: "bold",
										marginRight: "20px",
										// fontStyle: "italic",
									}}>
									<svg
										className='Styles__AccountIcon-d7nzgu-1 pWXnP'
										width='17'
										height='17'
										style={{ marginRight: "5px", marginBottom: "2px" }}
										viewBox='0 0 20 20'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
										role='img'
										aria-labelledby='00ea8e94-2216-4b64-acff-4d2fb3126ffb'>
										<title id='00ea8e94-2216-4b64-acff-4d2fb3126ffb'>
											Account
										</title>
										<path
											fill-rule='evenodd'
											clip-rule='evenodd'
											d='M13.5 4.79092C13.5 2.53192 11.4849 0.700012 9 0.700012L8.782 0.704731C6.39831 0.808141 4.5 2.59836 4.5 4.79092V5.6091C4.5 7.8681 6.5151 9.70001 9 9.70001L9.218 9.69529C11.6017 9.59188 13.5 7.80166 13.5 5.6091V4.79092ZM8.84702 2.20332L9.014 2.19901L9.18583 2.20488C10.7822 2.28873 12 3.44567 12 4.79092V5.6091L11.9946 5.76395C11.9049 7.04676 10.7094 8.12918 9.15298 8.1967L8.96754 8.20036L8.78519 8.19546C7.21783 8.1113 6 6.95435 6 5.6091V4.79092L6.0054 4.63607C6.09507 3.35326 7.29059 2.27084 8.84702 2.20332ZM15.3594 12.6468C13.6548 12.1815 11.3274 11.7 9 11.7C6.6726 11.7 4.3452 12.1815 2.6406 12.6468C1.0773 13.0725 0 14.4972 0 16.1172V18H18V16.1172L17.9949 15.9238C17.913 14.3848 16.8602 13.0555 15.3594 12.6468ZM3.03471 14.0941C5.07704 13.5366 7.12428 13.2 9 13.2C10.8757 13.2 12.923 13.5366 14.9644 14.0939L15.1214 14.1434C15.9428 14.4386 16.5 15.2247 16.5 16.1172V16.499H1.5V16.1172L1.50646 15.9512C1.57496 15.0735 2.1823 14.3262 3.03471 14.0941Z'
											fill='black'></path>
									</svg>
									Login
								</Link>
							</li>

							<li className='nav-item'>
								<Link
									className='nav-link '
									to='/signup'
									onClick={() => {
										window.scrollTo({ top: 0, behavior: "smooth" });
									}}
									style={{
										color: "black",
										// textDecoration: "underline",
										// fontWeight: "bold",
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
								className='nav-link '
								style={{
									cursor: "pointer",
									// fontWeight: "bold",
									// textDecoration: "underline",
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
					<li
						className='nav-item mt-2 languageList'
						style={{
							// border: "1px solid black",
							width: "90px",
							height: "30px",
						}}>
						<span className='' style={{ padding: "0px" }}>
							{language === "English" ? (
								<span
									// style={{
									// 	background: "#c40000",
									// 	color: "white",
									// 	width: "100%",
									// }}
									className=''
									onClick={() => {
										setLanguage("Arabic");
										// window.location.reload(false);
									}}>
									{" "}
									<img className='flags' src={EgyptianFlag} alt='Arabic' />
									<span>Arabic</span>
								</span>
							) : (
								<span
									// style={{ background: "#c40000", color: "white" }}
									className=' '
									onClick={() => {
										setLanguage("English");
										// window.location.reload(false);
									}}>
									<img className='flags' src={AmericanFlag} alt='English' />{" "}
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
						style={{ color: "black", fontSize: "20px", marginTop: "10px" }}
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

	.logoWrapper,
	.infiniteAppsLogo {
		display: none;
	}

	.btn:hover {
		cursor: pointer;
	}

	.flags {
		object-fit: cover;
	}
	.languageList:hover {
		cursor: pointer;
	}

	.link-container {
		margin: auto;
		text-align: center;
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

	@media (max-width: 900px) {
		.logoWrapper {
			display: block;
		}
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
			border-radius: 20%;
			font-size: 13px;
			font-style: italic;
			color: white;
			text-decoration: none !important;
			display: block;
			margin-left: 18px;
			font-weight: bold;
			background: darkred;
			padding: 6px;
			position: absolute;
			top: -14px;
			left: -10px;
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
			margin-left: 15px;
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
			display: block;
			width: 159px;
			height: 79px;
			margin-top: 0px;
			margin-bottom: 0px;
			margin-left: 0px;
			border-radius: 15px;
		}

		.imgLogo {
			width: 100px;
			height: 100px;
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
		background: rgb(240, 240, 240);
		text-decoration: none;
		/* color: var(--mainWhite) !important; */
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

	.link-btn {
		background: transparent;
		border-color: transparent;
		text-transform: capitalize;
		padding: 0.25rem 0.5rem;
		background: grey;
		color: var(--clr-white);
		border-radius: var(--radius);
		letter-spacing: var(--spacing);
		font-weight: 400;
		text-align: center;
		cursor: pointer;
		width: 75% !important;
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
