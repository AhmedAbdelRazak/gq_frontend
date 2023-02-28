/** @format */

import { VerticalAlignTopOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AdminMenu from "./AdminMenu/AdminMenu";
import Navbar from "./AdminNavMenu/Navbar";
import Chart from "react-apexcharts";
import CountUp from "react-countup";
import { aggregateAllOrders, getProducts, listOrdersDates } from "./apiAdmin";
import { isAuthenticated } from "../auth";
// eslint-disable-next-line
import { Link, Redirect } from "react-router-dom";
import DarkBG from "./AdminMenu/DarkBG";
import AttributesModal from "./Product/UpdatingProduct/AttributesModal";
import {
	gettingOrderStatusSummaryCount,
	gettingOrderStatusSummaryRevenue,
} from "./GQShopReports/GettingNumbers";
import OrdersCountCards from "./CardsBreakDown/OrdersCountCards";
import OrdersQtyCard from "./CardsBreakDown/OrdersQtyCard";
import OrdersTotalAmountCards from "./CardsBreakDown/OrdersTotalAmountCards";

const AdminDashboard2 = () => {
	const [allOrders, setAllOrders] = useState([]);
	const [allOrdersAggregated, setAllOrdersAggregated] = useState("");
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	// eslint-disable-next-line
	const [offset, setOffset] = useState(0);
	const [pageScrolled, setPageScrolled] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	const [chosenCard, setChosenCard] = useState("OrdersCountCard");

	const [allProducts, setAllProducts] = useState([]);
	const [modalVisible3, setModalVisible3] = useState(false);
	// eslint-disable-next-line
	const [day1, setDay1] = useState(
		new Date(new Date().setDate(new Date().getDate() + 1)),
	);
	const [day2, setDay2] = useState(
		new Date(new Date().setDate(new Date().getDate() - 30)),
	);
	const [clickedProduct, setClickedProduct] = useState({});

	const { user, token } = isAuthenticated();

	const loadOrders = () => {
		listOrdersDates(user._id, token, day1, day2).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllOrders(data);
			}
		});
	};

	const loadOrdersAggregate = () => {
		aggregateAllOrders(user._id, token).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllOrdersAggregated(data);
			}
		});
	};

	const gettingAllProducts = () => {
		getProducts().then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllProducts(data);
			}
		});
	};

	useEffect(() => {
		loadOrders();
		gettingAllProducts();
		loadOrdersAggregate();
		// eslint-disable-next-line
	}, [day1, day2]);

	var today = new Date().toLocaleString();
	var today2 = new Date();
	// var yesterday = new Date();
	var yesterday = new Date();
	var last7Days = new Date();
	var last15Days = new Date();
	var last30Days = new Date();
	var last90Days = new Date();

	yesterday.setDate(yesterday.getDate() - 1);
	last7Days.setDate(last7Days.getDate() - 7);
	last15Days.setDate(last15Days.getDate() - 15);
	last30Days.setDate(last30Days.getDate() - 30);
	last90Days.setDate(last90Days.getDate() - 45);

	// console.log(yesterday, "yesterday");

	let todaysOrders = allOrders.filter(
		(i) =>
			new Date(i.orderCreationDate).setHours(0, 0, 0, 0) ===
			new Date(today).setHours(0, 0, 0, 0),
	);

	const todaysRevenue =
		todaysOrders && todaysOrders.map((i) => Number(i.totalAmountAfterDiscount));

	const sumOfTodaysRevenue = todaysRevenue.reduce((a, b) => a + b, 0);

	let last7daysOrdersRevenue = allOrders
		.filter(
			(i) =>
				new Date(i.orderCreationDate).setHours(0, 0, 0, 0) >=
					new Date(last7Days).setHours(0, 0, 0, 0) &&
				(i.status !== "Cancelled" || i.status !== "Returned"),
		)
		.map((ii) => ii.totalAmountAfterDiscount);

	const sumOfLast7DaysRevenue =
		last7daysOrdersRevenue && last7daysOrdersRevenue.reduce((a, b) => a + b, 0);

	let last7daysOrders = allOrders
		.filter(
			(i) =>
				new Date(i.orderCreationDate).setHours(0, 0, 0, 0) >=
					new Date(last15Days).setHours(0, 0, 0, 0) &&
				(i.status !== "Cancelled" || i.status !== "Returned"),
		)
		.map((ii) => {
			return {
				...ii,
				orderCreationDate: new Date(ii.orderCreationDate).toLocaleDateString(),
			};
		});

	let last30daysOrdersRevenue = allOrders
		.filter((i) => i.status !== "Cancelled" || i.status !== "Returned")
		.map((ii) => ii.totalAmountAfterDiscount);

	const sumOfLast30DaysRevenue =
		last30daysOrdersRevenue &&
		last30daysOrdersRevenue.reduce((a, b) => a + b, 0);

	let last30daysOrdersQty = allOrders
		.filter((i) => i.status !== "Cancelled" || i.status !== "Returned")
		.map((ii) => ii.totalOrderQty);

	// eslint-disable-next-line
	const sumOfLast30DaysQty =
		last30daysOrdersQty && last30daysOrdersQty.reduce((a, b) => a + b, 0);

	// console.log(last7daysOrders, "last7daysOrders");

	var OrdersDates_TotalAmount = [];
	last7daysOrders &&
		last7daysOrders.reduce(function (res, value) {
			if (!res[value.orderCreationDate]) {
				res[value.orderCreationDate] = {
					orderCreationDate: value.orderCreationDate,
					totalAmountAfterDiscount: 0,
				};
				OrdersDates_TotalAmount.push(res[value.orderCreationDate]);
			}
			res[value.orderCreationDate].totalAmountAfterDiscount += Number(
				value.totalAmountAfterDiscount,
			);
			return res;
		}, {});

	var chartDataTotalAmount = {
		options: {
			chart: {
				id: "area",
				background: "",
			},

			plotOptions: {
				bar: {
					horizontal: false,
					s̶t̶a̶r̶t̶i̶n̶g̶S̶h̶a̶p̶e̶: "flat",
					e̶n̶d̶i̶n̶g̶S̶h̶a̶p̶e̶: "flat",
					borderRadius: 0,
					columnWidth: "90%",
					barHeight: "100%",
					distributed: false,
					rangeBarOverlap: true,
					rangeBarGroupRows: false,

					dataLabels: {
						position: "center",
						maxItems: 100,
						hideOverflowingLabels: true,
						orientation: "vertical",
					},
				},
			},

			dataLabels: {
				enabled: true,
				enabledOnSeries: undefined,
				formatter: function (val, opts) {
					return Number(val).toLocaleString();
				},
				style: {
					fontSize: "10px",
					fontFamily: "Helvetica, Arial, sans-serif",
					fontWeight: "bold",
					// colors: undefined,
					colors: ["black", "#E91E63", "#9C27B0"],
				},
			},

			title: {
				text: "Day Over Day Overview",
				align: "left",
				margin: 10,
				offsetX: 0,
				offsetY: 0,
				floating: false,
				style: {
					fontWeight: "bold",
					// fontFamily: undefined,
					color: "black",
				},
			},
			xaxis: {
				name: "Schedule Date",
				categories: OrdersDates_TotalAmount.map((i) =>
					new Date(i.orderCreationDate).toLocaleDateString(),
				),
			},
			colors: ["#99dd99"],

			stroke: {
				width: [3, 3],
			},

			yaxis: {
				tickAmount: 5,
				labels: {
					formatter: function (val) {
						return val.toFixed(0);
					},
				},
			},
			fill: {
				type: "gradient",
				colors: ["#99dd99"],
				gradient: {
					shadeIntensity: 1,
					opacityFrom: 0.7,
					opacityTo: 0.9,
					stops: [0, 100],
				},
			},
		},
		series: [
			{
				name: "Total Paid Amount",
				data: OrdersDates_TotalAmount.map((i) =>
					i.totalAmountAfterDiscount.toFixed(2),
				),
			},
		],
	};

	useEffect(() => {
		const onScroll = () => setOffset(window.pageYOffset);
		// clean up code
		window.removeEventListener("scroll", onScroll);
		window.addEventListener("scroll", onScroll, { passive: true });
		if (window.pageYOffset > 0) {
			setPageScrolled(true);
		} else {
			setPageScrolled(false);
		}
		return () => window.removeEventListener("scroll", onScroll);
	}, [offset]);

	let selectedDateOrders = allOrders.filter(
		(i) =>
			new Date(i.orderCreationDate).setHours(0, 0, 0, 0) >=
				new Date(day2).setHours(0, 0, 0, 0) &&
			new Date(i.orderCreationDate).setHours(0, 0, 0, 0) <=
				new Date(day1).setHours(0, 0, 0, 0),
	);

	function sortByTopEmployee(a, b) {
		const TotalAppointmentsA = a.totalAmountAfterDiscount;
		const TotalAppointmentsB = b.totalAmountAfterDiscount;
		let comparison = 0;
		if (TotalAppointmentsA < TotalAppointmentsB) {
			comparison = 1;
		} else if (TotalAppointmentsA > TotalAppointmentsB) {
			comparison = -1;
		}
		return comparison;
	}

	var Employees_TotalOrders_Revenue = [];
	selectedDateOrders &&
		selectedDateOrders.reduce(function (res, value) {
			if (!res[value.employeeData.name]) {
				res[value.employeeData.name] = {
					EmployeeName: value.employeeData.name,
					EmployeeImage:
						value.employeeData.employeeImage ===
						"https://res.cloudinary.com/infiniteapps/image/upload/v1663790484/GQ_B2B/1663790483782.jpg"
							? "https://res.cloudinary.com/infiniteapps/image/upload/v1677552600/GQ_B2B/GenderWomen_jpqptm.jpg"
							: value.employeeData.employeeImage,
					totalAmountAfterDiscount: 0,
					totalOrders: 0,
				};
				Employees_TotalOrders_Revenue.push(res[value.employeeData.name]);
			}
			res[value.employeeData.name].totalAmountAfterDiscount += Number(
				value.totalAmountAfterDiscount,
			);

			res[value.employeeData.name].totalOrders += 1;

			return res;
		}, {});

	console.log(Employees_TotalOrders_Revenue, "Employees_TotalOrders_Revenue");

	const selectedDateOrdersModified = () => {
		const modifiedArray =
			selectedDateOrders &&
			selectedDateOrders.map((i) =>
				i.chosenProductQtyWithVariables.map((ii) =>
					ii.map((iii) => {
						return {
							employeeName: i.employeeData.name,
							status: i.status,
							productName: iii.productName,
							OrderedQty: iii.OrderedQty,
							productMainImage: iii.productMainImage,
							pickedPrice: Number(iii.pickedPrice) * Number(iii.OrderedQty),
						};
					}),
				),
			);

		return modifiedArray;
	};

	var destructingNestedArray = [];
	selectedDateOrdersModified() &&
		selectedDateOrdersModified().map((i) =>
			i.map((ii) => destructingNestedArray.push(...ii)),
		);

	function sortTopOrdersProducts(a, b) {
		const TotalAppointmentsA = a.OrderedQty;
		const TotalAppointmentsB = b.OrderedQty;
		let comparison = 0;
		if (TotalAppointmentsA < TotalAppointmentsB) {
			comparison = 1;
		} else if (TotalAppointmentsA > TotalAppointmentsB) {
			comparison = -1;
		}
		return comparison;
	}

	var TopSoldProducts = [];
	destructingNestedArray &&
		destructingNestedArray.reduce(function (res, value) {
			if (!res[value.productName + value.employeeName]) {
				res[value.productName + value.employeeName] = {
					status: value.status,
					productName: value.productName,
					employeeName: value.employeeName,
					productMainImage: value.productMainImage,
					OrderedQty: 0,
					pickedPrice: 0,
				};
				TopSoldProducts.push(res[value.productName + value.employeeName]);
			}

			res[value.productName + value.employeeName].OrderedQty += Number(
				value.OrderedQty,
			);

			res[value.productName + value.employeeName].pickedPrice += Number(
				value.pickedPrice,
			);

			return res;
		}, {});

	TopSoldProducts.sort(sortTopOrdersProducts);

	var TopSoldProducts2 = [];
	destructingNestedArray &&
		destructingNestedArray.reduce(function (res, value) {
			if (!res[value.productName]) {
				res[value.productName] = {
					productName: value.productName,
					productMainImage:
						value.productMainImage ===
						"https://res.cloudinary.com/infiniteapps/image/upload/v1664017759/GQ_B2B/1664017758371.jpg"
							? "https://res.cloudinary.com/infiniteapps/image/upload/v1674859331/GQ_B2B/1674859330886.jpg"
							: value.productMainImage,
					OrderedQty: 0,
					pickedPrice: 0,
				};
				TopSoldProducts2.push(res[value.productName]);
			}

			res[value.productName].OrderedQty += Number(value.OrderedQty);
			res[value.productName].pickedPrice += Number(value.pickedPrice);

			return res;
		}, {});

	TopSoldProducts2.sort(sortTopOrdersProducts);

	const modifyingInventoryTable = () => {
		function sortTopProducts(a, b) {
			const TotalAppointmentsA = a.productQty;
			const TotalAppointmentsB = b.productQty;
			let comparison = 0;
			if (TotalAppointmentsA < TotalAppointmentsB) {
				comparison = 1;
			} else if (TotalAppointmentsA > TotalAppointmentsB) {
				comparison = -1;
			}
			return comparison;
		}

		let modifiedArray = allProducts.map((i) => {
			return {
				productId: i._id,
				productName: i.productName,
				createdAt: i.createdAt,
				productPrice: i.priceAfterDiscount,
				productQty: i.addVariables
					? i.productAttributes
							.map((iii) => iii.quantity)
							.reduce((a, b) => a + b, 0)
					: i.quantity,
				productImage: i.thumbnailImage,
				productSKU: i.productSKU,
				addedBy: i.addedByEmployee,
				orderCreationDate: i.orderCreationDate,
				addVariables: i.addVariables,
				productAttributes: i.productAttributes,
			};
		});

		return modifiedArray.sort(sortTopProducts);
	};

	var OrderStatusSummary = [];
	allOrders &&
		allOrders.reduce(function (res, value) {
			if (
				!res[
					value.status + new Date(value.orderCreationDate).toLocaleDateString()
				]
			) {
				res[
					value.status + new Date(value.orderCreationDate).toLocaleDateString()
				] = {
					status: value.status,
					orderCreationDate: new Date(
						value.orderCreationDate,
					).toLocaleDateString(),
					totalAmountAfterDiscount: 0,
					ordersCount: 0,
					totalOrderQty: 0,
				};
				OrderStatusSummary.push(
					res[
						value.status +
							new Date(value.orderCreationDate).toLocaleDateString()
					],
				);
			}
			res[
				value.status + new Date(value.orderCreationDate).toLocaleDateString()
			].totalAmountAfterDiscount += Number(value.totalAmountAfterDiscount);

			res[
				value.status + new Date(value.orderCreationDate).toLocaleDateString()
			].ordersCount += 1;

			res[
				value.status + new Date(value.orderCreationDate).toLocaleDateString()
			].totalOrderQty += Number(value.totalOrderQty);

			return res;
		}, {});

	var orderSourceModified = allOrders
		.map((i) => {
			return {
				...i,
				orderSource:
					i.orderSource === "ZITRGA"
						? "ZIRGA"
						: i.orderSource === "zirga"
						? "ZIRGA"
						: i.orderSource === "g&q"
						? "G&Q"
						: i.orderSource,
			};
		})
		.filter(
			(iii) =>
				new Date(iii.orderCreationDate).setHours(0, 0, 0, 0) >=
					new Date(day2).setHours(0, 0, 0, 0) &&
				iii.totalAmountAfterDiscount !== 0,
		);

	var OrderSourceSummary = [];
	orderSourceModified &&
		orderSourceModified.reduce(function (res, value) {
			if (!res[value.orderSource]) {
				res[value.orderSource] = {
					orderSource: value.orderSource,
					totalAmountAfterDiscount: 0,
					ordersCount: 0,
					totalOrderQty: 0,
				};
				OrderSourceSummary.push(res[value.orderSource]);
			}
			res[value.orderSource].totalAmountAfterDiscount += Number(
				value.totalAmountAfterDiscount,
			);

			res[value.orderSource].ordersCount += 1;

			res[value.orderSource].totalOrderQty += Number(value.totalOrderQty);

			return res;
		}, {});

	console.log(OrderSourceSummary, "OrderSourceSummary");

	function getMinMax(arr) {
		if (!arr) {
			return null;
		}
		var minV = arr[0];
		var maxV = arr[0];
		var a;
		for (a of arr) {
			if (a < minV) minV = a;
			if (a > maxV) maxV = a;
		}
		return [minV, maxV];
	}

	const xAxisValues =
		OrderSourceSummary &&
		OrderSourceSummary.map((i) => i.totalAmountAfterDiscount);

	console.log(getMinMax(xAxisValues)[1]);

	var donutChart2 = {
		chart: {
			type: "bar",
		},
		plotOptions: {
			bar: {
				horizontal: true,
				borderRadius: 15,
				borderRadiusOnAllStackedSeries: true,
				dataLabels: {
					position: "bottom",
					hideOverflowingLabels: true,
				},
			},
		},
		fontSize: "10px",
		colors: [
			function ({ value, seriesIndex, dataPointIndex, w }) {
				if (dataPointIndex === 0) {
					return "#005ab3";
				} else if (dataPointIndex === 1) {
					return "#00b3b3";
				} else if (dataPointIndex === 2) {
					return "#ff0000";
				} else if (dataPointIndex === 3) {
					return "#ff8000";
				} else if (dataPointIndex === 4) {
					return "#black";
				} else if (dataPointIndex === 5) {
					return "#darkyellow";
				} else if (dataPointIndex === 6) {
					return "#005ab3";
				} else {
					return "#005ab3";
				}
			},
		],
		dataLabels: {
			enabled: true,
			style: {
				colors: ["#333"],
			},

			offsetX: 320,

			formatter: function (value) {
				const index =
					OrderSourceSummary &&
					OrderSourceSummary.map((i) =>
						Number(i.totalAmountAfterDiscount).toFixed(2),
					).indexOf(Number(value).toFixed(2));

				return (
					"EGP " +
					Number(value).toLocaleString() +
					` (${
						OrderSourceSummary && OrderSourceSummary[index].ordersCount
					} Orders)`
				);
			},
		},

		xaxis: {
			labels: {
				show: false,
			},
			min: 0,
			max: getMinMax(xAxisValues)[1] + getMinMax(xAxisValues)[1] * 0.25,
		},

		series: [
			{
				data:
					OrderSourceSummary &&
					OrderSourceSummary.map((i) => {
						return {
							x: i.orderSource.toUpperCase(),
							y: Number(i.totalAmountAfterDiscount).toFixed(2),
						};
					}),
			},
		],
	};

	return (
		<AdminDashboard2Wrapper show={collapsed}>
			{user.userRole === "Order Taker" || user.userRole === "Operations" ? (
				<Redirect to='/admin/create-new-order' />
			) : null}
			{user.userRole === "Stock Keeper" ? (
				<Redirect to='/admin/receiving' />
			) : null}
			{!collapsed ? (
				<DarkBG collapsed={collapsed} setCollapsed={setCollapsed} />
			) : null}
			<div className='grid-container'>
				<div>
					<AdminMenu
						fromPage='AdminDasboard'
						AdminMenuStatus={AdminMenuStatus}
						setAdminMenuStatus={setAdminMenuStatus}
						collapsed={collapsed}
						setCollapsed={setCollapsed}
					/>
				</div>
				<div className='navbarcontent'>
					<Navbar
						fromPage='AdminDashboard'
						pageScrolled={pageScrolled}
						collapsed={collapsed}
					/>
					<div className='mx-auto'>
						<div className='container-fluid'>
							{/* <div className='my-3 text-center'>
								<span
									style={{
										fontSize: "0.9rem",
										color: "black",
										textAlign: "center",
										fontWeight: "normal",
									}}>
									(Selected Date Range From{" "}
									<strong> {new Date(day2).toDateString()}</strong> to{" "}
									<strong>{new Date(day1).toDateString()}</strong>)
								</span>
							</div> */}

							{/* <div className='row mb-3'>
								<div className='col-xl-3 col-lg-6 col-md-11 col-sm-11 text-center mx-auto my-2'>
									<div className='' style={{ background: "#f1416c" }}>
										<div className='card-body'>
											<h5 style={{ fontWeight: "bolder", color: "white" }}>
												Overall Orders Count
											</h5>
											<CountUp
												style={{ color: "white" }}
												duration='3'
												delay={1}
												end={allOrders.length}
												separator=','
											/>
										</div>
									</div>
								</div>

								<div className='col-xl-3 col-lg-6 col-md-11 col-sm-11 text-center mx-auto my-2'>
									<div className='' style={{ background: "#009ef7" }}>
										<div className='card-body'>
											<h5 style={{ fontWeight: "bolder", color: "white" }}>
												Overall Ordered Items
											</h5>
											<CountUp
												style={{ color: "white" }}
												duration='3'
												delay={1}
												end={sumOfLast30DaysQty}
												separator=','
											/>
										</div>
									</div>
								</div>
								{user.userRole === "Order Taker" ? null : (
									<div className='col-xl-3 col-lg-6 col-md-11 col-sm-11 text-center mx-auto my-2'>
										<div className='' style={{ background: "#50cd89" }}>
											<div className='card-body'>
												<h5 style={{ fontWeight: "bolder", color: "white" }}>
													Total Amount (EGP)
												</h5>
												<CountUp
													style={{ color: "white" }}
													duration='3'
													delay={1}
													end={sumOfLast30DaysRevenue}
													separator=','
												/>
											</div>
										</div>
									</div>
								)}
							</div> */}

							{chosenCard === "OrdersCountCard" ? (
								<div>
									<OrdersCountCards allOrders={allOrders} />
								</div>
							) : null}
							{chosenCard === "OrdersQtyCard" ? (
								<div>
									<OrdersQtyCard allOrders={allOrders} />
								</div>
							) : null}
							{chosenCard === "OrdersTotalAmountCard" ? (
								<div>
									<OrdersTotalAmountCards allOrders={allOrders} />
								</div>
							) : null}
							<div className='mb-3 ml-5'>
								<span
									className='mx-1 ordersCount'
									onClick={() => {
										setChosenCard("OrdersCountCard");
									}}>
									Orders Count
								</span>
								<span
									className='mx-1 ordersQty'
									onClick={() => {
										setChosenCard("OrdersQtyCard");
									}}>
									Orders Quantity
								</span>
								<span
									className='mx-1 ordersAmount'
									onClick={() => {
										setChosenCard("OrdersTotalAmountCard");
									}}>
									Orders Total Amount
								</span>
							</div>
							<div className='row mx-auto mt-4'>
								<div className='col-xl-5 col-lg-8 col-md-11  mx-auto'>
									<div className='card'>
										<h5 className='text-center'>
											Sales By Store <br />
											<span style={{ fontSize: "14px" }}>
												{" "}
												(From: {new Date(day2).toLocaleDateString()} to:{" "}
												{new Date(day1).toLocaleDateString()})
											</span>
										</h5>

										{OrderSourceSummary &&
										allOrders &&
										allOrders.length > 0 &&
										OrderSourceSummary.length > 0 &&
										OrderSourceSummary[0] ? (
											<div className='row mt-3'>
												<Chart
													title={donutChart2.title}
													options={donutChart2}
													series={donutChart2.series}
													type='bar'
													style={{
														width: "80%",
													}}
												/>
											</div>
										) : null}
									</div>
								</div>

								<div className='col-xl-7 col-lg-8 col-md-11 mx-auto'>
									<div className='card'>
										<h5 className='text-center'>Day Over Day Sales</h5>
										<div className='col-md-10 mx-auto'>
											<hr />
										</div>
										<div className='row'>
											<div className='col-md-3 mt-2'>
												<h3
													style={{
														fontWeight: "bold",
														color: "green",
														fontSize: "1.35rem",
													}}>
													Today
												</h3>
												<div className=' mb-5 row'>
													<div
														className='col-md-5'
														style={{
															fontSize: "1rem",
															fontWeight: "bold",
														}}>
														EGP
													</div>{" "}
													<div
														className='col-md-7'
														style={{ fontSize: "1rem", fontWeight: "bold" }}>
														{" "}
														{Number(
															Number(sumOfTodaysRevenue).toFixed(2),
														).toLocaleString()}
														<div
															style={{
																fontSize: "11px",
																color: "darkgrey",
															}}>
															{Number(todaysOrders.length).toLocaleString()}{" "}
															Orders
														</div>
													</div>
												</div>

												<div className='my-2'>
													<div style={{ fontSize: "12px", fontWeight: "bold" }}>
														<span style={{ color: "goldenrod" }}>WEEK</span>
														<div
															className='row'
															style={{ fontSize: "11px", fontWeight: "bold" }}>
															<div className='col-md-4'>EGP</div>{" "}
															<div className='col-md-7'>
																{Number(
																	Number(sumOfLast7DaysRevenue).toFixed(2),
																).toLocaleString()}
																<div
																	style={{
																		fontSize: "11px",
																		color: "darkgrey",
																	}}>
																	{Number(
																		last7daysOrdersRevenue.length,
																	).toLocaleString()}{" "}
																	Orders
																</div>
															</div>{" "}
														</div>{" "}
													</div>{" "}
												</div>
												<div className='my-2'>
													<div style={{ fontSize: "12px", fontWeight: "bold" }}>
														<span style={{ color: "red" }}>MONTH</span>
														<div
															className='row'
															style={{ fontSize: "11px", fontWeight: "bold" }}>
															<div className='col-md-4'>EGP</div>{" "}
															<div className='col-md-7'>
																{Number(
																	Number(sumOfLast30DaysRevenue).toFixed(2),
																).toLocaleString()}
																<div
																	style={{
																		fontSize: "11px",
																		color: "darkgrey",
																	}}>
																	{Number(
																		last30daysOrdersRevenue.length,
																	).toLocaleString()}{" "}
																	Orders
																</div>
															</div>{" "}
														</div>{" "}
													</div>{" "}
												</div>
												<div className='my-1'>
													{" "}
													<div style={{ fontSize: "12px", fontWeight: "bold" }}>
														ALL
													</div>{" "}
													<div
														className='row'
														style={{ fontSize: "11px", fontWeight: "bold" }}>
														<div className='col-md-4'>EGP</div>{" "}
														<div className='col-md-7'>
															{Number(
																Number(allOrdersAggregated.totalAmount).toFixed(
																	2,
																),
															).toLocaleString()}
															<div
																style={{ fontSize: "11px", color: "darkgrey" }}>
																{Number(
																	allOrdersAggregated.ordersCount,
																).toLocaleString()}{" "}
																Orders
															</div>
														</div>{" "}
													</div>{" "}
												</div>
											</div>
											<div className='col-md-9'>
												<div className='mx-auto text-center'>
													<Chart
														options={chartDataTotalAmount.options}
														series={chartDataTotalAmount.series}
														type='area'
														style={{
															width: "80%",
														}}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className='col-xl-4 col-lg-8 col-md-11 mx-auto'>
									<div className='card mt-4' style={{ minHeight: "650px" }}>
										<h5>Top Employees</h5>{" "}
										<div className='ml-3'>
											From:{" "}
											<strong style={{ color: "#006ca9" }}>
												{new Date(day2).toDateString()}
											</strong>{" "}
											To:{" "}
											<strong style={{ color: "#006ca9" }}>
												{new Date(day1).toDateString()}
											</strong>
										</div>
										<div className='col-md-10 mx-auto'>
											<hr />
										</div>
										{Employees_TotalOrders_Revenue &&
											Employees_TotalOrders_Revenue.sort(sortByTopEmployee).map(
												(o, i) => {
													return (
														<>
															<div className='row' key={i}>
																<div className='col-md-8'>
																	<img
																		className='userImage'
																		src={o.EmployeeImage}
																		alt={o.EmployeeName}
																	/>
																	<span className='employeeName'>
																		{o.EmployeeName}{" "}
																		{i === 0 ? (
																			<span className='iconsForEmployee'>
																				<VerticalAlignTopOutlined />
																			</span>
																		) : null}
																	</span>
																	<div className='topEmployeeOrders'>
																		Taken Orders: {o.totalOrders}
																	</div>
																</div>
																<div className='col-md-4 mt-2'>
																	<div style={{ fontWeight: "bold" }}>
																		<CountUp
																			duration='2'
																			delay={0}
																			end={o.totalAmountAfterDiscount}
																			separator=','
																		/>{" "}
																		EGP
																	</div>
																	<div
																		style={{
																			color: "darkgrey",
																			fontWeight: "bold",
																			marginTop: "10px",
																		}}>
																		Total Sales
																	</div>
																</div>
															</div>
															<hr />
														</>
													);
												},
											)}
										<div className='mt-3'>
											<div className=''>
												<select
													onChange={(e) => {
														if (e.target.value === "SelectAll") {
															setDay2(last90Days);
															setDay1(today2);
														} else if (e.target.value === "Today") {
															setDay2(today);
															setDay1(today);
														} else if (e.target.value === "Yesterday") {
															setDay2(yesterday);
															setDay1(yesterday);
														} else if (e.target.value === "Last7Days") {
															setDay2(last7Days);
															setDay1(today2);
														} else if (e.target.value === "Last30Days") {
															setDay2(last30Days);
															setDay1(today2);
														} else {
														}
													}}
													placeholder='Select Return Status'
													className=' mx-auto w-100'
													style={{
														paddingTop: "3px",
														paddingBottom: "3px",
														// paddingRight: "50px",
														// textAlign: "center",
														border: "#cfcfcf solid 1px",
														borderRadius: "2px",
														fontSize: "0.9rem",
														// boxShadow: "2px 2px 2px 2px rgb(0,0,0,0.2)",
														textTransform: "capitalize",
													}}>
													<option value='SelectStatus'>Filters:</option>
													<option value='SelectAll'>Select All</option>
													<option value='Today'>Today</option>
													<option value='Yesterday'>Yesterday</option>
													<option value='Last7Days'>Last 7 Days</option>
													<option value='Last30Days'>Last 30 Days</option>
												</select>
											</div>
										</div>
									</div>
								</div>
								<div className='col-xl-4 col-lg-8 col-md-11  mx-auto'>
									<div className='card mt-4' style={{ minHeight: "650px" }}>
										<h5>Items Received In Stock</h5>
										<div className='ml-3'>
											From:{" "}
											<strong style={{ color: "#006ca9" }}>
												{new Date(day2).toDateString()}
											</strong>{" "}
											To:{" "}
											<strong style={{ color: "#006ca9" }}>
												{new Date(day1).toDateString()}
											</strong>
										</div>
										<div className='col-md-10 mx-auto'>
											<hr />
										</div>
										<div className='row my-3'>
											<div className='col-5 mx-auto'>
												<span className='cardHeader'>Orders On Hold</span>{" "}
												<div className='metrics'>
													<CountUp
														duration='2'
														delay={1}
														end={gettingOrderStatusSummaryCount(
															OrderStatusSummary,
															"On Hold",
															day1,
															day2,
														)}
														separator=','
													/>{" "}
													Orders
												</div>{" "}
												<div className='metrics'>
													<CountUp
														duration='2'
														delay={0}
														end={gettingOrderStatusSummaryRevenue(
															OrderStatusSummary,
															"On Hold",
															day1,
															day2,
														)}
														separator=','
													/>{" "}
													EGP
												</div>{" "}
											</div>

											<div className='col-5 mx-auto'>
												<span className='cardHeader'>Orders In Processing</span>{" "}
												<div className='metrics'>
													<CountUp
														duration='2'
														delay={1}
														end={gettingOrderStatusSummaryCount(
															OrderStatusSummary,
															"In Processing",
															day1,
															day2,
														)}
														separator=','
													/>{" "}
													Orders
												</div>{" "}
												<div className='metrics'>
													<CountUp
														duration='2'
														delay={0}
														end={gettingOrderStatusSummaryRevenue(
															OrderStatusSummary,
															"In Processing",
															day1,
															day2,
														)}
														separator=','
													/>{" "}
													EGP
												</div>{" "}
											</div>

											<div className='col-5 mt-5 mx-auto'>
												<span className='cardHeader'>Orders Ready To Ship</span>{" "}
												<div className='metrics'>
													<CountUp
														duration='2'
														delay={1}
														end={gettingOrderStatusSummaryCount(
															OrderStatusSummary,
															"Ready To Ship",
															day1,
															day2,
														)}
														separator=','
													/>{" "}
													Orders
												</div>{" "}
												<div className='metrics'>
													<CountUp
														duration='2'
														delay={0}
														end={gettingOrderStatusSummaryRevenue(
															OrderStatusSummary,
															"Ready To Ship",
															day1,
															day2,
														)}
														separator=','
													/>{" "}
													EGP
												</div>{" "}
											</div>

											<div className='col-5 mt-5 mx-auto'>
												<span className='cardHeader'>Shipped Orders</span>{" "}
												<div className='metrics'>
													<CountUp
														duration='2'
														delay={1}
														end={gettingOrderStatusSummaryCount(
															OrderStatusSummary,
															"Shipped",
															day1,
															day2,
														)}
														separator=','
													/>{" "}
													Orders
												</div>{" "}
												<div className='metrics'>
													<CountUp
														duration='2'
														delay={0}
														end={gettingOrderStatusSummaryRevenue(
															OrderStatusSummary,
															"Shipped",
															day1,
															day2,
														)}
														separator=','
													/>{" "}
													EGP
												</div>{" "}
											</div>
											<div className='col-5 mt-5 mx-auto'>
												<span className='cardHeader'>Delivered Orders</span>{" "}
												<div className='metrics'>
													<CountUp
														duration='2'
														delay={0}
														end={gettingOrderStatusSummaryCount(
															OrderStatusSummary,
															"Delivered",
															day1,
															day2,
														)}
														separator=','
													/>{" "}
													Orders
												</div>{" "}
												<div className='metrics'>
													<CountUp
														duration='2'
														delay={0}
														end={gettingOrderStatusSummaryRevenue(
															OrderStatusSummary,
															"Delivered",
															day1,
															day2,
														)}
														separator=','
													/>{" "}
													EGP
												</div>{" "}
											</div>
											<div className='col-5 mt-5 mx-auto'>
												<span className='cardHeader'>Cancelled Orders</span>{" "}
												<div className='metrics'>
													<CountUp
														duration='2'
														delay={0}
														end={gettingOrderStatusSummaryCount(
															OrderStatusSummary,
															"Cancelled",
															day1,
															day2,
														)}
														separator=','
													/>{" "}
													Orders
												</div>{" "}
												<div className='metrics'>
													<CountUp
														duration='2'
														delay={0}
														end={gettingOrderStatusSummaryRevenue(
															OrderStatusSummary,
															"Cancelled",
															day1,
															day2,
														)}
														separator=','
													/>{" "}
													EGP
												</div>{" "}
											</div>
										</div>
										<hr />
										<div>
											<select
												onChange={(e) => {
													if (e.target.value === "SelectAll") {
														setDay2(last90Days);
														setDay1(today2);
													} else if (e.target.value === "Today") {
														setDay2(today);
														setDay1(today);
													} else if (e.target.value === "Yesterday") {
														setDay2(yesterday);
														setDay1(yesterday);
													} else if (e.target.value === "Last7Days") {
														setDay2(last7Days);
														setDay1(today2);
													} else if (e.target.value === "Last30Days") {
														setDay2(last30Days);
														setDay1(today2);
													} else {
													}
												}}
												placeholder='Select Return Status'
												className=' mx-auto w-100'
												style={{
													paddingTop: "3px",
													paddingBottom: "3px",
													// paddingRight: "50px",
													// textAlign: "center",
													border: "#cfcfcf solid 1px",
													borderRadius: "2px",
													fontSize: "0.9rem",
													// boxShadow: "2px 2px 2px 2px rgb(0,0,0,0.2)",
													textTransform: "capitalize",
												}}>
												<option value='SelectStatus'>Filters:</option>
												<option value='SelectAll'>Select All</option>
												<option value='Today'>Today</option>
												<option value='Yesterday'>Yesterday</option>
												<option value='Last7Days'>Last 7 Days</option>
												<option value='Last30Days'>Last 30 Days</option>
											</select>
										</div>
									</div>
								</div>

								<div className='col-xl-4 col-lg-8 col-md-11  mx-auto'>
									<div className='card mt-4' style={{ minHeight: "650px" }}>
										<h5>Top Sold Products</h5>

										<div className='col-md-10 mx-auto'>
											<hr />
										</div>

										<table
											className='table table-bordered table-md-responsive table-hover '
											style={{ fontSize: "0.75rem", overflowX: "auto" }}>
											<thead className=''>
												<tr
													style={{
														fontSize: "0.75rem",
														textTransform: "capitalize",
														textAlign: "center",
													}}>
													<th scope='col'>Item</th>
													<th scope='col'>Quantity</th>
													<th scope='col'>Revenue</th>
												</tr>
											</thead>
											<tbody
												className='my-auto'
												style={{
													fontSize: "0.75rem",
													textTransform: "capitalize",
													fontWeight: "bolder",
												}}>
												{TopSoldProducts2 &&
													TopSoldProducts2.map((s, i) => {
														if (i <= 4) {
															return (
																<tr
																	key={i}
																	className=''
																	style={{ fontSize: "11px" }}>
																	<td>
																		<img
																			width='20%'
																			src={s.productMainImage}
																			alt={s.productName}
																		/>{" "}
																		{s.productName}{" "}
																	</td>
																	<td>{s.OrderedQty}</td>
																	<td>
																		{Number(s.pickedPrice).toLocaleString()}
																	</td>

																	{/* <td>{Invoice(s)}</td> */}
																</tr>
															);
														} else {
															return null;
														}
													})}
											</tbody>
										</table>
									</div>
								</div>

								<div className='col-md-12  mx-auto my-5'>
									<div className='card'>
										<h5>GQ Shop Inventory Report</h5>
										<div className='col-md-10 mx-auto'>
											<hr />
										</div>

										<div className='tableData'>
											<AttributesModal
												product={clickedProduct}
												modalVisible={modalVisible3}
												setModalVisible={setModalVisible3}
												setCollapsed={setCollapsed}
											/>

											<table
												className='table table-bordered table-md-responsive table-hover '
												style={{ fontSize: "0.75rem", overflowX: "auto" }}>
												<thead className=''>
													<tr
														style={{
															fontSize: "0.75rem",
															textTransform: "capitalize",
															textAlign: "center",
														}}>
														<th scope='col'>Item #</th>
														<th scope='col'>Product Name</th>
														<th scope='col'>Product Main SKU</th>
														<th scope='col'>Product Price</th>
														<th scope='col'>Stock Onhand</th>
														<th scope='col'>Product Creation Date</th>
														<th scope='col'>Product Created By</th>
														<th scope='col'>Product Image</th>
													</tr>
												</thead>
												<tbody
													className='my-auto'
													style={{
														fontSize: "0.75rem",
														textTransform: "capitalize",
														fontWeight: "bolder",
													}}>
													{modifyingInventoryTable().map((s, i) => {
														return (
															<tr key={i} className=''>
																<td className='my-auto'>{i + 1}</td>

																<td>{s.productName}</td>
																<td>{s.productSKU}</td>
																<td>
																	{s.addVariables ? (
																		<span
																			onClick={() => {
																				setModalVisible3(true);
																				setClickedProduct(s);
																				setCollapsed(true);
																			}}
																			style={{
																				fontWeight: "bold",
																				textDecoration: "underline",
																				color: "darkblue",
																				cursor: "pointer",
																			}}>
																			Check Product Attributes
																		</span>
																	) : (
																		s.productPrice
																	)}
																</td>
																<td
																	style={{
																		background:
																			s.productQty <= 0 ? "#fdd0d0" : "",
																	}}>
																	{s.productQty}
																</td>
																<td>{new Date(s.createdAt).toDateString()}</td>
																<td>{s.addedBy.name}</td>
																<td
																	style={{ width: "15%", textAlign: "center" }}>
																	<img
																		width='40%'
																		height='40%'
																		style={{ marginLeft: "20px" }}
																		src={
																			s.productImage[0].images[0]
																				? s.productImage[0].images[0].url
																				: null
																		}
																		alt={s.productName}
																	/>
																</td>

																{/* <td>{Invoice(s)}</td> */}
															</tr>
														);
													})}
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</AdminDashboard2Wrapper>
	);
};

export default AdminDashboard2;

const AdminDashboard2Wrapper = styled.div`
	min-height: 880px;
	margin-bottom: 10px;
	/* background: #fafafa; */
	overflow-x: hidden;

	.grid-container {
		display: grid;
		/* grid-template-columns: 16% 84%; */
		grid-template-columns: ${(props) =>
			props.show ? "4.5% 95.5%" : "15% 85%"};

		margin: auto;
		/* border: 1px solid red; */
		/* grid-auto-rows: minmax(60px, auto); */
	}

	.navbarcontent > nav > ul {
		list-style-type: none;
		background: white;
	}

	.navbarcontent > div > ul > li {
		background: white;
		font-size: 0.8rem;
		font-weight: bolder !important;
		color: #545454;
	}

	.headerIcons {
		font-size: 2.2rem;
		color: white;
		font-weight: bold;
	}

	.headerIconsStars {
		font-size: 2.2rem;
		color: gold;
		font-weight: bold;
	}

	.firstCard {
		background: #f1416c;
		border-radius: 5px;
		padding: 10px;
		margin-top: 18px;
	}

	.secondCard {
		background: #009ef7;
		padding: 10px;
		border-radius: 5px;
		margin-top: 18px;
	}
	.thirdCard {
		background: #50cd89;
		padding: 10px;
		border-radius: 5px;
		margin-top: 18px;
	}

	.headerText {
		font-size: 1.15rem;
		color: white;
		margin-left: 10px;
		margin-top: 15px;
		margin-bottom: 15px;
		font-weight: bolder;
	}

	h5 {
		font-weight: bold;
	}

	.card {
		padding: 15px;
	}

	.cardHeader {
		color: darkgrey;
		font-weight: bold;
	}

	.metrics {
		font-weight: bolder;
	}

	.apexcharts-yaxis-label {
		color: white !important;
	}

	.userImage {
		width: 50px;
		height: 40px;
		margin-right: 5px;
	}
	.employeeName {
		font-weight: bold;
	}

	.topEmployeeOrders {
		font-weight: bold;
		color: darkgrey;
		margin-left: 25%;
	}

	.iconsForEmployee {
		font-size: 1.3rem !important;
		color: green;
		font-weight: bolder;
		margin-left: 5px;
	}

	.storeSummaryFilters {
		position: absolute;
		top: 83%;
		width: 94%;
	}

	.card-body {
		font-weight: bolder;
	}

	.card-body span {
		font-size: 1.5rem;
	}

	.ordersCount {
		padding: 4px 25px;
		background: #f1416c;
		border-radius: 2px;
		color: white;
		font-weight: bold;
		transition: 0.3s;
	}

	.ordersQty {
		padding: 4px 13px;
		background: #009ef7;
		border-radius: 2px;
		color: white;
		font-weight: bold;
		transition: 0.3s;
	}

	.ordersAmount {
		padding: 4px;
		background: #50cd89;
		border-radius: 2px;
		color: white;
		font-weight: bold;
		transition: 0.3s;
	}

	.ordersAmount:hover,
	.ordersQty:hover,
	.ordersCount:hover {
		padding: 9px 25px;
		cursor: pointer;
		transition: 0.3s;
	}

	@media (max-width: 1750px) {
		/* background: white; */

		.grid-container {
			display: grid;
			/* grid-template-columns: 18% 82%; */
			grid-template-columns: ${(props) => (props.show ? "7% 93%" : "18% 82%")};
			margin: auto;
			/* border: 1px solid red; */
			/* grid-auto-rows: minmax(60px, auto); */
		}
	}

	@media (max-width: 1400px) {
		/* background: white; */

		.grid-container {
			display: grid;
			grid-template-columns: 8% 92%;
			margin: auto;
			/* border: 1px solid red; */
			/* grid-auto-rows: minmax(60px, auto); */
		}

		.storeSummaryFilters {
			position: "";
			width: "";
		}
	}

	@media (max-width: 750px) {
		.grid-container {
			display: grid;
			/* grid-template-columns: 16% 84%; */
			grid-template-columns: ${(props) => (props.show ? "0% 99%" : "18% 82%")};
			margin: auto;
			/* border: 1px solid red; */
			/* grid-auto-rows: minmax(60px, auto); */
		}

		.card,
		.firstCard,
		.secondCard,
		.thirdCard {
			margin-top: 20px;
			margin-left: ${(props) => (props.show ? "0px" : "20px")};
		}
	}
`;
