/** @format */

import { VerticalAlignTopOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AdminMenu from "./AdminMenu/AdminMenu";
import Navbar from "./AdminNavMenu/Navbar";
import CountUp from "react-countup";
import {
	aggregateAllOrders,
	getProducts,
	getReceivingLogs,
	listOrdersDates,
} from "./apiAdmin";
import { isAuthenticated } from "../auth";
// eslint-disable-next-line
import { Link, Redirect } from "react-router-dom";
import DarkBG from "./AdminMenu/DarkBG";
import AttributesModal from "./Product/UpdatingProduct/AttributesModal";
import Section1 from "./AdminDashboardComp/Section1";
import Section2 from "./AdminDashboardComp/Section2";
import moment from "moment";

const AdminDashboard2 = () => {
	const [allOrders, setAllOrders] = useState([]);
	const [allOrders2, setAllOrders2] = useState([]);
	const [allOrdersAggregated, setAllOrdersAggregated] = useState("");
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	// eslint-disable-next-line
	const [offset, setOffset] = useState(0);
	const [pageScrolled, setPageScrolled] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	const [chosenCard, setChosenCard] = useState("OrdersCountCard");
	const [allReceivings, setAllReceivings] = useState([]);
	const [allProducts, setAllProducts] = useState([]);
	const [modalVisible3, setModalVisible3] = useState(false);
	const [selectedFilter, setSelectedFilter] = useState("");
	// eslint-disable-next-line
	const [day1, setDay1] = useState(
		new Date(new Date().setDate(new Date().getDate() + 3)),
	);
	const [day2, setDay2] = useState(
		new Date(new Date().setDate(new Date().getDate() - 30)),
	);
	const [clickedProduct, setClickedProduct] = useState({});

	const { user, token } = isAuthenticated();

	var today = new Date(new Date().setDate(new Date().getDate() + 3));
	// var yesterday = new Date();
	var yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
	var last7Days = new Date(new Date().setDate(new Date().getDate() - 7));
	var last15Days = new Date(new Date().setDate(new Date().getDate() - 15));
	var last30Days = new Date(new Date().setDate(new Date().getDate() - 30));
	var last90Days = new Date(new Date().setDate(new Date().getDate() - 90));

	const loadOrders = () => {
		listOrdersDates(user._id, token, day1, day2).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				if (selectedFilter === "Today") {
					setAllOrders(
						data.filter(
							(i) =>
								new Date(i.orderCreationDate).setHours(0, 0, 0, 0) ===
								new Date().setHours(0, 0, 0, 0),
						),
					);
				} else if (selectedFilter === "Yesterday") {
					setAllOrders(
						data.filter(
							(i) =>
								new Date(i.orderCreationDate).setHours(0, 0, 0, 0) ===
								new Date(yesterday).setHours(0, 0, 0, 0),
						),
					);
				} else {
					setAllOrders(data);
				}
			}
		});
	};

	const loadOrders2 = () => {
		const day3 = new Date(new Date().setDate(new Date().getDate() + 1));
		const day4 = new Date(new Date().setDate(new Date().getDate() - 30));
		listOrdersDates(user._id, token, day3, day4).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllOrders2(data);
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
	}, [day1, day2, selectedFilter]);

	useEffect(() => {
		loadOrders2();
		// eslint-disable-next-line
	}, []);

	let todaysOrders = allOrders2.filter(
		(i) =>
			new Date(i.orderCreationDate).setHours(0, 0, 0, 0) ===
				new Date().setHours(0, 0, 0, 0) &&
			i.status !== "Cancelled" &&
			i.status !== "Returned" &&
			!i.status.includes("Rejected"),
	);

	const todaysRevenue =
		todaysOrders && todaysOrders.map((i) => Number(i.totalAmountAfterDiscount));

	const sumOfTodaysRevenue = todaysRevenue.reduce((a, b) => a + b, 0);

	let last7daysOrdersRevenue = allOrders2
		.filter(
			(i) =>
				new Date(i.orderCreationDate).setHours(0, 0, 0, 0) >=
					new Date(last7Days).setHours(0, 0, 0, 0) &&
				i.status !== "Cancelled" &&
				i.status !== "Returned" &&
				!i.status.includes("Rejected"),
		)
		.map((ii) => ii.totalAmountAfterDiscount);

	const sumOfLast7DaysRevenue =
		last7daysOrdersRevenue && last7daysOrdersRevenue.reduce((a, b) => a + b, 0);

	let last7daysOrders = allOrders2
		.filter(
			(i) =>
				new Date(i.orderCreationDate).setHours(0, 0, 0, 0) >=
					new Date(last15Days).setHours(0, 0, 0, 0) &&
				i.status !== "Cancelled" &&
				i.status !== "Returned" &&
				!i.status.includes("Rejected"),
		)
		.map((ii) => {
			return {
				...ii,
				orderCreationDate: new Date(ii.orderCreationDate).toLocaleDateString(),
			};
		});

	let last30daysOrdersRevenue = allOrders2
		.filter(
			(i) =>
				i.status !== "Cancelled" &&
				i.status !== "Returned" &&
				!i.status.includes("Rejected"),
		)
		.map((ii) => ii.totalAmountAfterDiscount);

	const sumOfLast30DaysRevenue =
		last30daysOrdersRevenue &&
		last30daysOrdersRevenue.reduce((a, b) => a + b, 0);

	let last30daysOrdersQty = allOrders2
		.filter((i) => i.status !== "Cancelled" && i.status !== "Returned")
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
				fontSize: "50px",

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
				width: [2, 2],
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
				new Date(day1).setHours(0, 0, 0, 0) &&
			i.status !== "Cancelled" &&
			i.status !== "Returned" &&
			!i.status.includes("Rejected"),
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
				iii.totalAmountAfterDiscount !== 0 &&
				iii.status !== "Cancelled" &&
				!iii.status.includes("Rejected"),
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

	var donutChart2 = {
		chart: {
			type: "donut",
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
				fontSize: 10,
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

	const gettingReceivingLog = () => {
		function sortByReceivingDate(a, b) {
			const TotalAppointmentsA = a.createdAt;
			const TotalAppointmentsB = b.createdAt;
			let comparison = 0;
			if (TotalAppointmentsA < TotalAppointmentsB) {
				comparison = 1;
			} else if (TotalAppointmentsA > TotalAppointmentsB) {
				comparison = -1;
			}
			return comparison;
		}

		getReceivingLogs().then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				const dateCrit = new Date(
					new Date().setDate(new Date().getDate() - 60),
				);
				setAllReceivings(
					data
						.filter(
							(i) =>
								i.storeName === "g&q" &&
								new Date(i.createdAt).setHours(0, 0, 0, 0) >=
									new Date(dateCrit).setHours(0, 0, 0, 0),
						)
						.sort(sortByReceivingDate),
				);
			}
		});
	};

	useEffect(() => {
		gettingReceivingLog();

		// eslint-disable-next-line
	}, []);

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
							<Section1
								chosenCard={chosenCard}
								allOrders={allOrders}
								setChosenCard={setChosenCard}
							/>

							<Section2
								day1={day1}
								day2={day2}
								OrderSourceSummary={OrderSourceSummary}
								allOrders={allOrders}
								donutChart2={donutChart2}
								sumOfLast30DaysRevenue={sumOfLast30DaysRevenue}
								sumOfLast7DaysRevenue={sumOfLast7DaysRevenue}
								sumOfTodaysRevenue={sumOfTodaysRevenue}
								allOrdersAggregated={allOrdersAggregated}
								chartDataTotalAmount={chartDataTotalAmount}
								todaysOrders={todaysOrders}
								last7daysOrdersRevenue={last7daysOrdersRevenue}
								last30daysOrdersRevenue={last30daysOrdersRevenue}
								allOrders2={allOrders2}
								selectedFilter={selectedFilter}
							/>
							<div className='row mx-auto mt-3'>
								<div className='col-xl-4 col-lg-8 col-md-11 mx-auto'>
									<div
										className='card mt-4'
										style={{ maxHeight: "485px", overflow: "auto" }}>
										<h5 className='mb-4 mt-2'>
											Top Employees{" "}
											{selectedFilter === "Today" ||
											selectedFilter === "Yesterday" ? (
												<span
													className='ml-1'
													style={{ fontSize: "13px", color: "#006ca9" }}>
													{" "}
													({selectedFilter})
												</span>
											) : (
												<span className='ml-1' style={{ fontSize: "13px" }}>
													From:{" "}
													<strong style={{ color: "#006ca9" }}>
														{new Date(day2).toLocaleDateString()}
													</strong>{" "}
													To:{" "}
													<strong style={{ color: "#006ca9" }}>
														{new Date(day1).toLocaleDateString()}
													</strong>
												</span>
											)}
										</h5>{" "}
										{Employees_TotalOrders_Revenue &&
											Employees_TotalOrders_Revenue.sort(sortByTopEmployee).map(
												(o, i) => {
													return (
														<>
															<div className='row mb-3' key={i}>
																<div
																	className='col-md-8'
																	style={{ fontSize: "12px" }}>
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
																	<div
																		style={{
																			fontWeight: "bold",
																			fontSize: "13px",
																		}}>
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
															setDay1(today);
															setSelectedFilter("");
														} else if (e.target.value === "Today") {
															setSelectedFilter("Today");
														} else if (e.target.value === "Yesterday") {
															setSelectedFilter("Yesterday");
														} else if (e.target.value === "Last7Days") {
															setDay2(last7Days);
															setDay1(today);
															setSelectedFilter("");
														} else if (e.target.value === "Last30Days") {
															setDay2(last30Days);
															setDay1(today);
															setSelectedFilter("");
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
									<div
										className='card mt-4'
										style={{
											maxHeight: "490px",
											overflow: "auto",
											minHeight: "487px",
										}}>
										<h5 className='mb-4'>Items Received In Stock </h5>

										<table
											className='table table-bordered table-md-responsive table-hover '
											style={{ fontSize: "0.75rem", overflow: "auto" }}>
											<thead className=''>
												<tr
													style={{
														fontSize: "0.75rem",
														textTransform: "capitalize",
														textAlign: "center",
													}}>
													<th scope='col'>Date</th>
													<th scope='col'>Receiver</th>
													<th scope='col'>SKU</th>
													<th scope='col'>Qty</th>
													<th
														scope='col'
														style={{ background: "#093664", color: "white" }}>
														Case
													</th>
												</tr>
											</thead>
											<tbody
												className='my-auto'
												style={{
													fontSize: "0.75rem",
													textTransform: "capitalize",
													fontWeight: "bolder",
												}}>
												{allReceivings &&
													allReceivings.map((s, i) => {
														return (
															<tr key={i} style={{ fontSize: "10px" }}>
																<td>
																	{moment(s.createdAt).format("DD/MM/YYYY")}
																</td>
																<td>
																	{s.receivedByEmployee &&
																		s.receivedByEmployee.name}
																</td>

																<td>
																	{s.receivedSKU}
																	<br />
																	{s.productName}{" "}
																</td>
																<td>{s.receivedQuantity}</td>
																<td
																	className='mx-auto text-center'
																	style={{
																		background:
																			s.receivingCase === "return"
																				? "red"
																				: s.receivingCase === "new"
																				? "#093664"
																				: "#f6fafe",
																		color:
																			s.receivingCase === "return"
																				? "white"
																				: s.receivingCase === "new"
																				? "white"
																				: "black",
																	}}>
																	{s.receivingCase}
																</td>

																{/* <td>{Invoice(s)}</td> */}
															</tr>
														);
													})}
											</tbody>
										</table>
									</div>
								</div>

								<div className='col-xl-4 col-lg-8 col-md-11  mx-auto'>
									<div
										className='card mt-4'
										style={{ maxHeight: "485px", overflow: "auto" }}>
										<h5 className='mb-3'>
											Top Sold Products{" "}
											<span className='ml-1' style={{ fontSize: "13px" }}>
												From:{" "}
												<strong style={{ color: "#006ca9" }}>
													{new Date(day2).toLocaleDateString()}
												</strong>{" "}
												To:{" "}
												<strong style={{ color: "#006ca9" }}>
													{new Date(day1).toLocaleDateString()}
												</strong>
											</span>
										</h5>

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

										<div
											className='tableData'
											style={{ maxHeight: "800px", overflow: "auto" }}>
											<AttributesModal
												product={clickedProduct}
												modalVisible={modalVisible3}
												setModalVisible={setModalVisible3}
												setCollapsed={setCollapsed}
											/>

											<table
												className='table table-bordered table-md-responsive table-hover '
												style={{
													fontSize: "0.75rem",
													overflow: "auto",
												}}>
												<thead
													className=''
													style={{
														position: "sticky",
														top: "0",
														zIndex: "100",
														background: "white",
													}}>
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
	overflow-x: auto;

	.grid-container {
		display: grid;
		/* grid-template-columns: 16% 84%; */
		grid-template-columns: ${(props) =>
			props.show ? "4.5% 95.5%" : "15% 85%"};

		margin: auto;
		/* border: 1px solid red; */
		/* grid-auto-rows: minmax(60px, auto); */
	}

	.apexcharts-yaxis-texts-g > text,
	.apexcharts-xaxis-inversed-texts-g > text,
	.apexcharts-data-labels > text {
		font-size: 10px !important;
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
		width: 40px;
		height: 30px;
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

	.ordersCount,
	.ordersQty,
	.ordersAmount {
		display: none;
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
