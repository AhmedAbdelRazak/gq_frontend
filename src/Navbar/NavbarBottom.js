/** @format */
// eslint-disable-next-line
import React, { Fragment, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { isAuthenticated } from "../auth";
// import CartButtons from "./CartButtons";
import styled from "styled-components";
import { useCartContext } from "../Checkout/cart_context";
import { FaTrash, FaMinus, FaPlus, FaTimes } from "react-icons/fa";
import DarkBackground from "./DarkBackground";

const isActive = (history, path) => {
	if (history.location.pathname === path) {
		return {
			color: "white !important",
			background: "#c4ffc4",
			fontWeight: "bold",
			// textDecoration: "underline",
		};
	} else {
		return { color: "#c4ffc4", fontWeight: "bold" };
	}
};

const isActive2 = (history, path) => {
	if (history.location.pathname === path) {
		return {
			color: "white !important",
			background: "#e8f3ff",
			fontWeight: "bold",
			// textDecoration: "underline",
		};
	} else {
		return { color: "#ffffff", fontWeight: "bold" };
	}
};

const NavbarBottom = ({ history, chosenLanguage }) => {
	// const [click, setClick] = useState(false);
	//
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

	// const handleSidebar = () => {
	// 	setClick(!click);
	// };

	const sideCart = () => {
		return (
			<SideWrapper show={isSidebarOpen}>
				<div
					onClick={closeSidebar}
					className='float-right mr-3'
					style={{ fontSize: "15px", color: "black", cursor: "pointer" }}>
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
											{chosenLanguage === "Arabic" ? i.nameArabic : i.name}
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
											{i.priceAfterDiscount * i.amount} KD
										</div>
										<button
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
							{chosenLanguage === "Arabic"
								? "مواصلة التسوق"
								: "Continue Shopping"}
						</Link>
						<Link
							to='/cart'
							className='link-btn btn-primary'
							onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
							{chosenLanguage === "Arabic" ? "الدفع" : "Check Out"}
						</Link>
					</div>
				</div>
			</SideWrapper>
		);
	};

	return (
		<Nav
			className=' navbar  navbar-expand-sm'
			style={{ backgroundColor: "	white" }}>
			{isSidebarOpen ? <DarkBackground isSidebarOpen={isSidebarOpen} /> : null}
			<div
				className='collapse navbar-collapse '
				dir={chosenLanguage === "Arabic" ? "rtl" : "ltr"}>
				<ul
					className='navbar-nav mx-auto navbar-expand '
					style={{ backgroundColor: "	white" }}>
					<li className='nav-item'>
						<Link
							className='nav-link'
							style={isActive(history, "/home")}
							to='/home'
							onClick={() => {
								window.scrollTo({ top: 0, behavior: "smooth" });
							}}>
							{chosenLanguage === "Arabic" ? (
								<span
									style={{
										fontFamily: "Droid Arabic Kufi",
										letterSpacing: "0px",
									}}>
									الصفحة الرئيسية
								</span>
							) : (
								"Home"
							)}
						</Link>
					</li>
					<li className='nav-item'>
						<Link
							className='nav-link'
							style={isActive(history, "/our-products")}
							to='/our-products'
							onClick={() => {
								window.scrollTo({ top: 0, behavior: "smooth" });
							}}>
							{chosenLanguage === "Arabic" ? (
								<span
									style={{
										fontFamily: "Droid Arabic Kufi",
										letterSpacing: "0px",
									}}>
									منتجاتنا
								</span>
							) : (
								"Our Products"
							)}
						</Link>
					</li>
					<li className='nav-item'>
						<Link
							className='nav-link'
							style={isActive(history, "/contact")}
							to='/contact'
							onClick={() => {
								window.scrollTo({ top: 0, behavior: "smooth" });
							}}>
							{chosenLanguage === "Arabic" ? (
								<span
									style={{
										fontFamily: "Droid Arabic Kufi",
										letterSpacing: "0px",
									}}>
									اتصل بنا
								</span>
							) : (
								"Contact Us"
							)}
						</Link>
					</li>
					<li className='nav-item'>
						<Link
							className='nav-link'
							style={isActive(history, "/about")}
							to='/about'
							onClick={() => {
								window.scrollTo({ top: 0, behavior: "smooth" });
							}}>
							{chosenLanguage === "Arabic" ? (
								<span
									style={{
										fontFamily: "Droid Arabic Kufi",
										letterSpacing: "0px",
									}}>
									من نحن
								</span>
							) : (
								"About Us"
							)}
						</Link>
					</li>

					{isAuthenticated() && isAuthenticated().user.role === 0 && (
						<li className='nav-item ml-5'>
							<Link
								className='nav-link'
								style={isActive2(history, "/user-dashboard/last-purchase")}
								to='/user-dashboard/last-purchase'
								onClick={() => {
									window.scrollTo({ top: 0, behavior: "smooth" });
								}}>
								My Dasboard/Account
								{chosenLanguage === "Arabic" ? "حسابي" : "My Dasboard/Account"}
							</Link>
						</li>
					)}

					{isAuthenticated() && isAuthenticated().user.role === 1 && (
						<li className='nav-item'>
							<Link
								className='nav-link'
								style={isActive(history, "/user-dashboard/last-purchase")}
								to='/user-dashboard/last-purchase'
								onClick={() => {
									window.scrollTo({ top: 0, behavior: "smooth" });
								}}>
								Owner Regular Account
							</Link>
						</li>
					)}
					{isAuthenticated() && isAuthenticated().user.role === 1 && (
						<li className='nav-item ml-4'>
							<Link
								className='nav-link'
								style={isActive2(history, "/admin/dashboard")}
								to='/admin/dashboard'
								onClick={() => {
									window.scrollTo({ top: 0, behavior: "smooth" });
								}}>
								Owner Dashboard
							</Link>
						</li>
					)}
					{isAuthenticated() && isAuthenticated().user.role === 2 && (
						<li className='nav-item'>
							<Link
								className='nav-link'
								style={isActive(history, "/user-dashboard/last-purchase")}
								to='/user-dashboard/last-purchase'
								onClick={() => {
									window.scrollTo({ top: 0, behavior: "smooth" });
								}}>
								Stylist Regular Account
							</Link>
						</li>
					)}
					{isAuthenticated() && isAuthenticated().user.role === 2 && (
						<li className='nav-item ml-4'>
							<Link
								className='nav-link'
								style={isActive2(history, "/stylist/dashboard")}
								to='/stylist/dashboard'
								onClick={() => {
									window.scrollTo({ top: 0, behavior: "smooth" });
								}}>
								Stylist Dashboard
							</Link>
						</li>
					)}
				</ul>
			</div>
			<span
				style={{ color: "black", fontSize: "20px", cursor: "pointer" }}
				className='mr-3'
				onClick={() => {
					history.push("/cart");
				}}>
				Cart
			</span>
			<div className='nav-cart mr-5 mt-2'>
				{/* <FaCartPlus className="nav-icon" onClick={handleCart} /> */}
				<div
					style={{ cursor: "pointer" }}
					// to='/cart'
					onClick={isSidebarOpen ? closeSidebar : openSidebar}>
					<sup>
						<small className='cart-badge'>{total_items}</small>
					</sup>
					<i
						className='fa fa-cart-plus faaaa-bars'
						style={{ color: "black", fontSize: "20px" }}
						aria-hidden='true'></i>
				</div>

				{sideCart()}
			</div>
			<hr />
		</Nav>
	);
};

export default withRouter(NavbarBottom);

const Nav = styled.nav`
	border-top: 1px solid lightgray;
	border-bottom: 1px solid lightgray;
	/* margin-top: 5px; */
	position: -webkit-sticky;
	position: sticky;
	top: 0;
	z-index: 120;

	li a {
		font-size: 0.95rem;
	}
	.nav-link {
		color: black !important;
	}
	li {
		margin: 0px 12px 0px 0px;
	}

	li a:hover {
		background: #ffc4c4;
		color: black !important;
		outline-color: var(--darkGrey);
		transition: var(--mainTransition);
	}

	.cart-badge {
		border-radius: 100%;
		font-size: 13px;
		font-style: italic;
		color: black;
		text-decoration: none !important;
		display: block;
		margin-left: 18px;
		font-weight: bold;
	}

	@media (max-width: 900px) {
		li a {
			color: black !important;
			font-size: 0.7rem;
			margin: 0px;
		}
		li {
			margin: 0px 0px 0px 0px;
		}
	}

	@media (max-width: 680px) {
		display: none;
	}
`;

const SideWrapper = styled.nav`
	position: fixed;
	top: 0px;
	right: 0;
	width: 24%;
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
		margin-top: 3rem;
		margin-left: 10px;
		margin-right: 10px;
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
`;
