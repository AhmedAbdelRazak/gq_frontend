/** @format */

// eslint-disable-next-line
import React, { useEffect, useState } from "react";
import styled from "styled-components";
// eslint-disable-next-line
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import "antd/dist/antd.min.css";
// eslint-disable-next-line
import { Steps, Button } from "antd";
import FormStep1 from "./FormStep1";
import FormStep2 from "./FormStep2";
import FormStep3 from "./FormStep3";
import { Link, Redirect } from "react-router-dom";
import {
	allLoyaltyPointsAndStoreStatus,
	createOrder,
	generatingTokenPaymob,
	getShippingOptions,
	ordersLength,
	readUser,
} from "../../apiCore";
import { ShipToData } from "./ShipToData";
import CheckoutCartItems from "./CheckoutCartItems";
import { useCartContext } from "../cart_context";
import {
	authenticate,
	isAuthenticated,
	signin,
	signout,
	signup,
} from "../../auth";
// eslint-disable-next-line
const { Step } = Steps;

const CheckoutMain = ({ match }) => {
	const [current, setCurrent] = useState(1);

	// eslint-disable-next-line
	const [loading, setLoading] = useState(false);
	const [customerDetails, setCustomerDetails] = useState({
		fullName: "",
		phone: "",
		address: "",
		email: "",
		state: "",
		city: "",
		cityName: "",
		carrierName: "Aramex Express",
		orderComment: "",
		payOnline: "",
		payOnDelivery: "",
	});
	const [chosenShippingOption, setChosenShippingOption] = useState({});
	const [allShippingOptions, setAllShippingOptions] = useState([]);
	const [appliedCoupon, setAppliedCoupon] = useState("");
	const [appliedCouponName, setAppliedCouponName] = useState("");
	const [paymobToken, setPaymobtoken] = useState("");
	const [payMobPaymentData, setPayMobPaymentData] = useState("");
	const [couponApplied, setCouponApplied] = useState(false);
	const [
		// eslint-disable-next-line
		alreadySetLoyaltyPointsManagement,
		setAlreadySetLoyaltyPointsManagement,
	] = useState({});
	const [lengthOfOrders, setLengthOfOrders] = useState(0);
	const [authenticatedUser, setAutheticatedUser] = useState("");
	// eslint-disable-next-line
	const [purchaseHistory, setPurchaseHistory] = useState("");

	// eslint-disable-next-line
	const [orderCreationDate, setOrderCreationDate] = useState(
		new Date(
			new Date().toLocaleString("en-US", {
				timeZone: "Africa/Cairo",
			}),
		),
	);

	// eslint-disable-next-line
	const [forAI, setForAI] = useState({
		height: 0,
		weight: 0,
		waist: 0,
		size: "",
		OTNumber: "",
	});

	const { cart, total_amount, total_items, clearCart } = useCartContext();

	const gettingAllShippingOptions = () => {
		getShippingOptions().then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllShippingOptions(
					data.filter((i) => i.carrierName === "Aramex Express"),
				);
				setChosenShippingOption(
					data.filter((i) => i.carrierName === "Aramex Express"),
				);
				var shippingName = data.filter(
					(i) => i.carrierName === "Aramex Express",
				)[0];
				setCustomerDetails({
					...customerDetails,
					carrierName: shippingName.carrierName,
				});
				if (isAuthenticated() && isAuthenticated().user) {
					const { user } = isAuthenticated();
					setCustomerDetails({
						...customerDetails,
						fullName: user.name,
						phone: user.email,
					});
				}
				if (localStorage.getItem("PaidNow")) {
					setCurrent(3);
					const addedCustomerDetails = JSON.parse(
						localStorage.getItem("storedData"),
					);
					const addedShippingOptions = JSON.parse(
						localStorage.getItem("chosenShippingOption"),
					);
					setCustomerDetails({
						fullName: addedCustomerDetails.fullName,
						phone: addedCustomerDetails.phone,
						address: addedCustomerDetails.address,
						email: addedCustomerDetails.email,
						state: addedCustomerDetails.state,
						city: addedCustomerDetails.city,
						cityName: addedCustomerDetails.cityName,
						carrierName: "Aramex Express",
						orderComment: addedCustomerDetails.orderComment,
						payOnline: addedCustomerDetails.payOnline,
						payOnDelivery: addedCustomerDetails.payOnDelivery,
					});
					setChosenShippingOption(addedShippingOptions);
				}
			}
		});
	};

	const gettingPreviousLoyaltyPointsManagement = () => {
		allLoyaltyPointsAndStoreStatus().then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAlreadySetLoyaltyPointsManagement(data && data[data.length - 1]);
				var selectedStoreAttributes = data && data[data.length - 1];

				if (
					selectedStoreAttributes.activatePayOnDelivery &&
					selectedStoreAttributes.activatePayOnline
				) {
					setCustomerDetails({
						...customerDetails,
						payOnDelivery: true,
						payOnline: true,
					});
				} else if (selectedStoreAttributes.activatePayOnDelivery) {
					setCustomerDetails({
						...customerDetails,
						payOnDelivery: true,
						payOnline: false,
					});
				} else if (selectedStoreAttributes.activatePayOnline) {
					setCustomerDetails({
						...customerDetails,
						payOnDelivery: false,
						payOnline: true,
					});
				} else {
					setCustomerDetails({
						...customerDetails,
						payOnDelivery: true,
						payOnline: false,
					});
				}

				if (isAuthenticated() && isAuthenticated().user) {
					const { user, token } = isAuthenticated();

					readUser(user._id, token).then((data3) => {
						if (data3.error) {
							console.log(data3.error);
						} else {
							setPurchaseHistory(data3);
							const lastinHistory =
								data3.history.length > 0
									? data3.history[data3.history.length - 1]
									: "";
							setCustomerDetails({
								...customerDetails,
								fullName: user.name,
								phone: user.email,
								address:
									lastinHistory &&
									lastinHistory.customerDetails &&
									lastinHistory.customerDetails.address,
								payOnDelivery:
									lastinHistory &&
									lastinHistory.customerDetails &&
									lastinHistory.customerDetails.payOnDelivery,
								payOnline:
									lastinHistory &&
									lastinHistory.customerDetails &&
									lastinHistory.customerDetails.payOnline,
								city:
									lastinHistory &&
									lastinHistory.customerDetails &&
									lastinHistory.customerDetails.city,
								cityName:
									lastinHistory &&
									lastinHistory.customerDetails &&
									lastinHistory.customerDetails.cityName,
								state:
									lastinHistory &&
									lastinHistory.customerDetails &&
									lastinHistory.customerDetails.state,
							});
						}

						if (localStorage.getItem("PaidNow")) {
							setCurrent(3);
							const addedCustomerDetails = JSON.parse(
								localStorage.getItem("storedData"),
							);
							const addedShippingOptions = JSON.parse(
								localStorage.getItem("chosenShippingOption"),
							);
							setCustomerDetails({
								fullName: addedCustomerDetails.fullName,
								phone: addedCustomerDetails.phone,
								address: addedCustomerDetails.address,
								email: addedCustomerDetails.email,
								state: addedCustomerDetails.state,
								city: addedCustomerDetails.city,
								cityName: addedCustomerDetails.cityName,
								carrierName: "Aramex Express",
								orderComment: addedCustomerDetails.orderComment,
								payOnline: addedCustomerDetails.payOnline,
								payOnDelivery: addedCustomerDetails.payOnDelivery,
							});
							setChosenShippingOption(addedShippingOptions);
						}
					});
				}
			}
		});
	};

	// eslint-disable-next-line
	let shippingFee =
		chosenShippingOption.length > 0 &&
		customerDetails.carrierName &&
		customerDetails.city &&
		customerDetails.state &&
		customerDetails.cityName
			? chosenShippingOption
					.map((i) => i.chosenShippingData)[0]
					.filter((ii) => ii.governorate === customerDetails.state)[0]
					.shippingPrice_Client
			: 0;

	const totalAmountAfterDiscounting2 = () => {
		const totalWithoutCOD = Number(total_amount) + Number(shippingFee);
		if (
			couponApplied &&
			appliedCoupon &&
			appliedCoupon.name &&
			appliedCoupon.expiry &&
			new Date(appliedCoupon.expiry).setHours(0, 0, 0, 0) >=
				new Date().setHours(0, 0, 0, 0)
		) {
			return Number(
				Number(totalWithoutCOD) -
					(Number(total_amount) * Number(appliedCoupon.discount)) / 100,
			).toFixed(2);
		} else {
			return Number(totalWithoutCOD);
		}
	};

	// console.log(totalAmountAfterDiscounting2(), "totalAmountAfterDiscounting2");

	useEffect(() => {
		gettingAllShippingOptions();
		gettingPreviousLoyaltyPointsManagement();

		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		generatingTokenPaymob(
			setPaymobtoken,
			setPayMobPaymentData,
			customerDetails,
			totalAmountAfterDiscounting2,
			total_amount,
			cart,
		);

		// eslint-disable-next-line
	}, [appliedCoupon, current]);

	const handleChange = (name) => (e) => {
		const value = e.target.value;
		setCustomerDetails({ ...customerDetails, [name]: value });
	};

	let getGov = ShipToData.map((i) => i.GovernorateEn);

	let UniqueGovernorates = [...new Set(getGov)];

	const handleChangeState = (e) => {
		setCustomerDetails({ ...customerDetails, state: e.target.value });
		setAllShippingOptions(
			allShippingOptions.filter(
				(i) =>
					i.chosenShippingData
						.map((iii) => iii.governorate)
						.indexOf(e.target.value) > -1,
			),
		);
	};

	let chosenCity = customerDetails.state
		? ShipToData.filter((i) => i.GovernorateEn === customerDetails.state)
		: [];

	// eslint-disable-next-line
	let chosenCityCode = customerDetails.cityName
		? ShipToData.filter((i) => i.City.AreaEn === customerDetails.cityName)[0]
		: [];

	const handleChangeCity = (e) => {
		setCustomerDetails({
			...customerDetails,
			cityName: e.target.value,
			city: ShipToData.filter((i) => i.City.AreaEn === e.target.value)[0]
				.LoctionCode,
		});
	};

	const handleChangeCarrier = (e) => {
		setCustomerDetails({ ...customerDetails, carrierName: e.target.value });

		setChosenShippingOption(
			allShippingOptions.filter((i) => i.carrierName === e.target.value),
		);
	};

	const handleAppliedCoupon = (event) => {
		setAppliedCouponName(event.target.value);
	};

	const steps = [
		{
			title: (
				<Link to='/cart' className='FormTitle'>
					Cart
				</Link>
			),
			content: "",
		},
		{
			title: <div className='FormTitle'>Information</div>,
			content: (
				<FormStep1
					customerDetails={customerDetails}
					setCustomerDetails={setCustomerDetails}
					handleChange={handleChange}
					alreadySetLoyaltyPointsManagement={alreadySetLoyaltyPointsManagement}
					appliedCoupon={appliedCoupon}
					setAppliedCoupon={setAppliedCoupon}
					setAppliedCouponName={setAppliedCouponName}
					appliedCouponName={appliedCouponName}
					handleAppliedCoupon={handleAppliedCoupon}
					couponApplied={couponApplied}
					setCouponApplied={setCouponApplied}
				/>
			),
		},
		{
			title: <div className='FormTitle'>Shipping</div>,
			content: (
				<FormStep2
					UniqueGovernorates={UniqueGovernorates}
					customerDetails={customerDetails}
					handleChangeCarrier={handleChangeCarrier}
					handleChangeState={handleChangeState}
					handleChangeCity={handleChangeCity}
					chosenCity={chosenCity}
					allShippingOptions={allShippingOptions}
					shippingFee={shippingFee}
					setAppliedCouponName={setAppliedCouponName}
					appliedCouponName={appliedCouponName}
					appliedCoupon={appliedCoupon}
					setAppliedCoupon={setAppliedCoupon}
					handleAppliedCoupon={handleAppliedCoupon}
					couponApplied={couponApplied}
					setCouponApplied={setCouponApplied}
				/>
			),
		},
		{
			title: (
				<div className='FormTitle'>
					{" "}
					{customerDetails.payOnline &&
					!customerDetails.payOnDelivery &&
					alreadySetLoyaltyPointsManagement.activatePayOnline ? (
						<span>Payment/ Review</span>
					) : (
						<span>Review</span>
					)}
				</div>
			),
			content: (
				<FormStep3
					customerDetails={customerDetails}
					cart={cart}
					total_amount={total_amount}
					total_items={total_items}
					shippingFee={shippingFee}
					appliedCoupon={appliedCoupon}
					couponApplied={couponApplied}
					setAppliedCoupon={setAppliedCoupon}
					handleAppliedCoupon={handleAppliedCoupon}
					appliedCouponName={appliedCouponName}
				/>
			),
		},
	];

	const next = () => {
		setCurrent(current + 1);
	};

	const prev = () => {
		setCurrent(current - 1);
	};

	const tokenHelper1 = JSON.parse(localStorage.getItem("jwt"));
	const tokenHelper2 = tokenHelper1 && tokenHelper1.token;

	const user =
		isAuthenticated() && isAuthenticated().user
			? isAuthenticated().user
			: authenticatedUser && authenticatedUser.user;
	const token = tokenHelper2
		? tokenHelper2
		: authenticatedUser && authenticatedUser.token;

	var chosenProductQtyWithVariables = cart.map((i) => {
		return {
			SubSKU: i.chosenProductAttributes.SubSKU,
			OrderedQty: i.amount ? i.amount : i.OrderedQty,
			productId: i._id,
			productName: i.name ? i.name : i.productName,
			productMainImage: i.image ? i.image : i.productSubSKUImage,
			productSubSKUImage: i.image ? i.image : i.productMainImage,
			SubSKUPriceAfterDiscount: i.chosenProductAttributes.priceAfterDiscount
				? i.chosenProductAttributes.priceAfterDiscount
				: i.chosenProductAttributes.SubSKUPriceAfterDiscount,
			SubSKURetailerPrice: i.chosenProductAttributes.price
				? i.chosenProductAttributes.price
				: i.chosenProductAttributes.SubSKURetailerPrice,
			SubSKUWholeSalePrice: i.chosenProductAttributes.WholeSalePrice
				? i.chosenProductAttributes.WholeSalePrice
				: i.chosenProductAttributes.SubSKUWholeSalePrice,
			SubSKUDropshippingPrice: i.chosenProductAttributes.DropShippingPrice
				? i.chosenProductAttributes.DropShippingPrice
				: i.chosenProductAttributes.SubSKUDropshippingPrice,
			pickedPrice: i.chosenProductAttributes.priceAfterDiscount
				? i.chosenProductAttributes.priceAfterDiscount
				: i.chosenProductAttributes.pickedPrice,
			quantity: i.chosenProductAttributes.quantity
				? i.chosenProductAttributes.quantity
				: i.chosenProductAttributes.quantity,
			SubSKUColor: i.chosenProductAttributes.color
				? i.chosenProductAttributes.color
				: i.chosenProductAttributes.SubSKUColor,
			SubSKUSize: i.chosenProductAttributes.size
				? i.chosenProductAttributes.size
				: i.chosenProductAttributes.SubSKUSize,
			SubSKUMSRP: i.chosenProductAttributes.price
				? i.chosenProductAttributes.price
				: i.chosenProductAttributes.SubSKUMSRP,
		};
	});

	var notAvailableStock =
		cart.map((i) => i.max < i.amount).indexOf(true) !== -1;

	const CreatingOrder = (e) => {
		e.preventDefault();
		window.scrollTo({ top: 0, behavior: "smooth" });

		ordersLength().then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setLengthOfOrders(data);
			}
		});

		if (
			!customerDetails.fullName ||
			!customerDetails.phone ||
			!customerDetails.state ||
			!customerDetails.address ||
			!customerDetails.cityName ||
			!customerDetails.carrierName ||
			customerDetails.carrierName === "No Shipping Carrier" ||
			customerDetails.cityName === "Unavailable"
		) {
			setCurrent(1);
			return toast.error("Please Add All Required Info");
		}

		if (cart.length === 0) {
			return toast.error("Please Add Products To The Order");
		}
		if (customerDetails.phone.length < 11) {
			setCurrent(1);
			return toast.error("Phone Should Be 11 Digits");
		}

		if (notAvailableStock) {
			return toast.error("Not Enough Stock for the product you picked");
		}

		var today = new Date(
			new Date().toLocaleString("en-US", {
				timeZone: "Africa/Cairo",
			}),
		);

		const totalAmountAfterDiscounting = () => {
			if (
				couponApplied &&
				appliedCoupon &&
				appliedCoupon.name &&
				appliedCoupon.expiry &&
				new Date(appliedCoupon.expiry).setHours(0, 0, 0, 0) >=
					new Date().setHours(0, 0, 0, 0)
			) {
				return Number(
					Number(total_amount) +
						Number(shippingFee) +
						-(Number(total_amount) * Number(appliedCoupon.discount)) / 100,
				).toFixed(2);
			} else {
				return Number(total_amount) + Number(shippingFee);
			}
		};

		//In Processing, Ready To Ship, Shipped, Delivered
		const createOrderData = {
			productsNoVariable: [],
			chosenProductQtyWithVariables: [chosenProductQtyWithVariables],
			customerDetails: customerDetails,
			totalOrderQty: Number(total_items),
			status: "On Hold",
			totalAmount: Number(total_amount) + Number(shippingFee),
			// Number(Number(total_amount * 0.01).toFixed(2))
			totalAmountAfterDiscount:
				totalAmountAfterDiscounting() && totalAmountAfterDiscounting() !== 0
					? totalAmountAfterDiscounting()
					: Number(total_amount) + Number(shippingFee),
			// Number(Number(total_amount * 0.01).toFixed(2))
			totalOrderedQty: Number(total_items),
			orderTakerDiscount: "",
			employeeData: "Online Order",
			chosenShippingOption: chosenShippingOption,
			orderSource: "ace",
			sendSMS: false,
			trackingNumber: "Not Added",
			invoiceNumber: "Not Added",
			appliedCoupon: appliedCoupon,
			OTNumber: `OT${new Date(orderCreationDate).getFullYear()}${
				new Date(orderCreationDate).getMonth() + 1
			}${new Date(orderCreationDate).getDate()}000${lengthOfOrders + 1}`,
			returnStatus: "Not Returned",
			shipDate: today,
			returnDate: today,
			exchangedProductQtyWithVariables: [],
			exhchangedProductsNoVariable: [],
			freeShipping: false,
			orderCreationDate: orderCreationDate,
			shippingFees: Number(shippingFee).toFixed(2),
			appliedShippingFees: true,
			totalAmountAfterExchange: 0,
			exchangeTrackingNumber: "Not Added",
			onHoldStatus: "Not On Hold",
			paymobData: payMobPaymentData,
			paymentStatus: customerDetails.payOnDelivery
				? "Pay On Delivery"
				: customerDetails.payOnline
				? "Paid Online"
				: "Pay On Delivery",
			forAI: {
				...forAI,
				OTNumber: `OT${new Date(orderCreationDate).getFullYear()}${
					new Date(orderCreationDate).getMonth() + 1
				}${new Date(orderCreationDate).getDate()}000${lengthOfOrders + 1}`,
			},
		};

		createOrder(token, createOrderData, user._id)
			.then((response) => {
				clearCart();
				toast.success("Payment on delivery order was successfully placed");
				setTimeout(function () {
					window.location.reload(false);
				}, 1500);
			})

			.catch((error) => {
				console.log(error);
			});
	};

	var today = new Date(
		new Date().toLocaleString("en-US", {
			timeZone: "Africa/Cairo",
		}),
	);

	// eslint-disable-next-line
	const CreatingOrderPaid = (e) => {
		const orderDataStoredLocalStor = JSON.parse(
			localStorage.getItem("orderDataStored"),
		);

		console.log(orderDataStoredLocalStor);

		window.scrollTo({ top: 0, behavior: "smooth" });

		if (cart.length === 0) {
			return toast.error("Please Add Products To The Order");
		}

		if (notAvailableStock) {
			return toast.error("Not Enough Stock for the product you picked");
		}

		//In Processing, Ready To Ship, Shipped, Delivered
		const createOrderData = orderDataStoredLocalStor;

		createOrder(token, createOrderData, user._id)
			.then((response) => {
				clearCart();
				setTimeout(function () {
					window.location.reload(false);
				}, 2500);
			})

			.catch((error) => {
				console.log(error);
			});
	};

	const RedirectToHome = () => {
		return <Redirect to='/user/dashboard' />;
	};

	useEffect(() => {
		if (localStorage.getItem("PaidNow")) {
			setCurrent(3);
			const addedCustomerDetails = JSON.parse(
				localStorage.getItem("storedData"),
			);
			const addedShippingOptions = JSON.parse(
				localStorage.getItem("chosenShippingOption"),
			);
			setCustomerDetails({
				fullName: addedCustomerDetails.fullName,
				phone: addedCustomerDetails.phone,
				address: addedCustomerDetails.address,
				email: addedCustomerDetails.email,
				state: addedCustomerDetails.state,
				city: addedCustomerDetails.city,
				cityName: addedCustomerDetails.cityName,
				carrierName: "Aramex Express",
				orderComment: addedCustomerDetails.orderComment,
				payOnline: addedCustomerDetails.payOnline,
				payOnDelivery: addedCustomerDetails.payOnDelivery,
			});
			setChosenShippingOption(addedShippingOptions);
		} else {
			return;
		}
	}, []);

	useEffect(() => {
		if (window.location.search.includes("integration_id")) {
			toast.success("Your order was successfully set");
			setTimeout(() => {
				CreatingOrderPaid();
			}, 2000);
		}
		// eslint-disable-next-line
	}, []);

	return (
		<CheckoutMainWrapper>
			{cart.length === 0 ? RedirectToHome() : null}
			<div className='row'>
				<div className='col-md-8 mx-auto leftSize'>
					<Steps current={current}>
						{steps.map((item) => (
							<Step key={item.title} title={item.title} />
						))}
					</Steps>

					<div className='steps-content'>{steps[current].content}</div>
					<div className='text-center mt-2'>
						{current > 1 && current !== 1 && !loading && (
							<Button
								className='Buttons'
								style={{
									width: "20%",
									marginRight: "10px",
									backgroundColor: "var(--orangePrimary)",
									color: "white",
									fontWeight: "bold",
									fontSize: "0.9rem",
								}}
								onClick={() => prev()}>
								Previous
							</Button>
						)}
						{current === 1 && !loading && (
							<Button
								disabled={
									!customerDetails.phone ||
									!customerDetails.address ||
									!customerDetails.fullName ||
									(customerDetails.payOnDelivery &&
										customerDetails.payOnline) ||
									(!customerDetails.payOnDelivery &&
										!customerDetails.payOnline) ||
									notAvailableStock
								}
								type='primary'
								className='Buttons'
								style={{
									width: "20%",
									fontWeight: "bold",
									fontSize: "0.9rem",
								}}
								onClick={() => {
									next();

									window.scrollTo({ top: 100, behavior: "smooth" });

									if (user.email !== customerDetails.phone) {
										signout(() => {
											localStorage.removeItem("order");
										});
									}

									signup({
										name: customerDetails.fullName,
										email: customerDetails.phone,
										password: customerDetails.phone,
										password2: customerDetails.phone,
										role: 0,
										userRole: "client",
										misMatch: false,
									}).then((data) => {
										// console.log(data);
										if (data.error) {
											console.log(data.error);
											// toast.error(data.error);
										} else {
											console.log("registered");
										}
									});
								}}>
								Next
							</Button>
						)}
						{current === 2 && !loading && (
							<Button
								type='primary'
								className='Buttons'
								style={{
									width: "20%",
									fontWeight: "bold",
									fontSize: "0.9rem",
								}}
								onClick={() => {
									next();

									signin({
										email: customerDetails.phone,
										password: customerDetails.phone,
									}).then((data) => {
										if (data.error) {
											console.log(data.error);
										} else {
											authenticate(data, () => {
												setAutheticatedUser(data);
											});
										}
									});

									window.scrollTo({ top: 100, behavior: "smooth" });
								}}>
								Next
							</Button>
						)}

						{current === 3 &&
							!loading &&
							customerDetails.payOnDelivery &&
							!customerDetails.payOnline &&
							customerDetails.city &&
							customerDetails.state && (
								<Button
									// disabled={dataEnter1()}
									type='primary'
									className='Buttons'
									style={{
										width: "20%",
										fontWeight: "bold",
										fontSize: "0.9rem",
										background: "#005fbb",
									}}
									onClick={(e) => {
										CreatingOrder(e);
										window.scrollTo({ top: 0, behavior: "smooth" });
									}}>
									Order Now
								</Button>
							)}

						{current === 3 &&
							!loading &&
							!customerDetails.payOnDelivery &&
							customerDetails.payOnline &&
							customerDetails.city &&
							customerDetails.state && (
								<Button
									// disabled={dataEnter1()}
									type='primary'
									className='Buttons'
									style={{
										width: "20%",
										fontWeight: "bold",
										fontSize: "0.9rem",
										background: "#005fbb",
									}}
									onClick={(e) => {
										ordersLength().then((data) => {
											if (data.error) {
												console.log(data.error);
											} else {
												setLengthOfOrders(data);
											}
										});

										localStorage.setItem("PaidNow", "PaidNow");
										//Start of created Order On hold
										const orderDataTobeStored = {
											productsNoVariable: [],
											chosenProductQtyWithVariables: [
												chosenProductQtyWithVariables,
											],
											customerDetails: customerDetails,
											totalOrderQty: Number(total_items),
											status: "On Hold",
											totalAmount: Number(total_amount) + Number(shippingFee),
											// Number(Number(total_amount * 0.01).toFixed(2))
											totalAmountAfterDiscount:
												totalAmountAfterDiscounting2() &&
												totalAmountAfterDiscounting2() !== 0
													? totalAmountAfterDiscounting2()
													: Number(total_amount) + Number(shippingFee),
											// Number(Number(total_amount * 0.01).toFixed(2))
											totalOrderedQty: Number(total_items),
											orderTakerDiscount: "",
											employeeData: "Online Order",
											chosenShippingOption: chosenShippingOption,
											orderSource: "ace",
											sendSMS: false,
											trackingNumber: "Not Added",
											invoiceNumber: "Not Added",
											appliedCoupon: appliedCoupon,
											OTNumber: `OT${new Date(
												orderCreationDate,
											).getFullYear()}${
												new Date(orderCreationDate).getMonth() + 1
											}${new Date(orderCreationDate).getDate()}000${
												lengthOfOrders + 1
											}`,
											returnStatus: "Not Returned",
											shipDate: today,
											returnDate: today,
											exchangedProductQtyWithVariables: [],
											exhchangedProductsNoVariable: [],
											freeShipping: false,
											orderCreationDate: orderCreationDate,
											shippingFees: Number(shippingFee).toFixed(2),
											appliedShippingFees: true,
											totalAmountAfterExchange: 0,
											exchangeTrackingNumber: "Not Added",
											onHoldStatus: "Not On Hold",
											paymobData: payMobPaymentData,
											paymentStatus:
												customerDetails.payOnDelivery &&
												!customerDetails.payOnline
													? "Pay On Delivery"
													: customerDetails.payOnline
													? "Paid Online"
													: "Pay On Delivery",
											forAI: {
												...forAI,
												OTNumber: `OT${new Date(
													orderCreationDate,
												).getFullYear()}${
													new Date(orderCreationDate).getMonth() + 1
												}${new Date(orderCreationDate).getDate()}000${
													lengthOfOrders + 1
												}`,
											},
										};
										localStorage.setItem(
											"orderDataStored",
											JSON.stringify(orderDataTobeStored),
										);

										//end of created Order On hold
										localStorage.setItem(
											"storedData",
											JSON.stringify(customerDetails),
										);
										localStorage.setItem(
											"chosenShippingOption",
											JSON.stringify(chosenShippingOption),
										);
										window.location.replace(
											`${process.env.REACT_APP_IFRAME_LINK}${paymobToken}`,
										);

										window.scrollTo({ top: 0, behavior: "smooth" });
									}}>
									Pay Now
								</Button>
							)}
					</div>
				</div>

				<div className='col-md-4 rightSide mx-auto'>
					<CheckoutCartItems
						shippingFee={shippingFee}
						appliedCoupon={appliedCoupon}
						couponApplied={couponApplied}
					/>
				</div>
			</div>
		</CheckoutMainWrapper>
	);
};

export default CheckoutMain;

const CheckoutMainWrapper = styled.div`
	overflow: hidden;
	background: white;
	padding: 10px 30px;
	min-height: 733px;
	margin-bottom: 100px;

	.steps-content {
		min-height: 450px;
		margin-top: 16px;
		padding-top: 20px;
		text-align: center;
		background-color: white;
		border: 1px dashed #e9e9e9;
		border-radius: 10px;
	}

	.steps-action {
		margin-top: 24px;
	}
	[data-theme="dark"] .steps-content {
		margin-top: 16px;
		border: 1px dashed #303030;
		background-color: rgba(255, 255, 255, 0.04);
		color: rgba(255, 255, 255, 0.65);
		padding-top: 80px;
	}

	.headsupServices {
		font-weight: bold;
	}

	.photosWrapperCellPhone {
		display: none;
	}

	.rightSide {
		border-left: solid 1px lightgrey;
		padding: 0px 10px;
	}

	.Buttons {
		background: #005fbb;
	}
	.ant-steps-item-icon {
		color: white !important;
		background: #005fbb !important;
	}

	.anticon-check {
		color: white !important;
	}

	.ant-steps-icon {
		color: white !important;
	}

	@media (max-width: 1100px) {
		.formSecondStep {
			text-align: left;
		}

		.textResizeMain {
			font-size: 0.9rem !important;
			text-shadow: 0px 0px 0px !important;
			font-weight: bold !important;
		}

		.textResizeMain2 {
			font-size: 0.8rem !important;
			text-shadow: 0px 0px 0px !important;
			font-weight: bold !important;
		}

		.textResizeMessages {
			font-size: 0.65rem !important;
			text-shadow: 0px 0px 0px !important;
		}

		.dataPointsReview {
			font-size: 0.8rem !important;
		}

		input::placeholder {
			font-size: 13px;
		}
	}

	@media (max-width: 900px) {
		margin-left: 10px;
		margin-right: 10px;

		.ScheduleNowButton {
			font-size: 0.8rem !important;
			width: 40% !important;
		}

		.photosWrapperCellPhone {
			margin-top: 40px;
			display: block;
		}

		.photosWrapper {
			display: none;
		}

		.headsupServices {
			font-size: 14px;
		}
		.selectaTime {
			width: 80% !important;
		}
		.Buttons {
			width: 46% !important;
			font-size: 0.73rem !important;
		}
		.FormTitle {
			font-size: 0.85rem;
		}
		.inputFields {
			padding-top: 9px;
			padding-bottom: 9px;
			/* text-align: center; */
			border: #cfcfcf solid 1px;
			border-radius: 4px !important;
			width: 80% !important;
			font-size: 0.8rem !important;
			/* box-shadow: 2px 2px 2px 2px rgb(0, 0, 0, 0.2); */
			margin-bottom: 15px;
		}
		.ant-steps-item-icon {
			font-size: 12px;
			width: 25px;
			height: 25px;
			line-height: 25px;
			color: white !important;
			background: #005fbb !important;
		}

		.anticon-check {
			color: white !important;
		}

		.ant-steps-icon {
			color: white !important;
		}

		.ant-steps,
		svg,
		.ant-steps-vertical {
			text-align: center !important;
			margin: auto;
		}

		.rightSide {
			border-left: solid 1px white;
		}
	}
`;
