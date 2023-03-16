/** @format */

import { GroupOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import {
	aggregateAllOrders,
	aggregateOrdersByDatesAndStatus,
	getColors,
	listOrdersDates,
} from "../../apiAdmin";
import { isAuthenticated } from "../../../auth";
// import { isAuthenticated } from "../../auth";
import AdminMenu from "../../AdminMenu/AdminMenu";
import DarkBG from "../../AdminMenu/DarkBG";
import Navbar from "../../AdminNavMenu/Navbar";
// import CountUp from "react-countup";
import CustomDatesModal from "../CustomDatesModal";
import OrdersCountCards from "../../CardsBreakDown/OrdersCountCards";
import OrdersQtyCard from "../../CardsBreakDown/OrdersQtyCard";
import OrdersTotalAmountCards from "../../CardsBreakDown/OrdersTotalAmountCards";
import Clock from "./Clock";
import Section1 from "./Section1";
import Section2 from "./Section2";

const isActive = (clickedLink, sureClickedLink) => {
	if (clickedLink === sureClickedLink) {
		return {
			// color: "white !important",
			background: "#f5f8fa",
			color: " #009ef7",
			fontWeight: "bold",
			padding: "5px",
			borderRadius: "5px",
			// textDecoration: "underline",
		};
	} else {
		return {
			color: "darkgrey",
			fontWeight: "bold",
			padding: "5px",
			transition: "0.3s",
		};
	}
};

const SalesReportMain = () => {
	const [offset, setOffset] = useState(0);
	const [pageScrolled, setPageScrolled] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [selectedFilter, setSelectedFilter] = useState("SelectAll");
	const [chosenCard, setChosenCard] = useState("OrdersCountCard");
	// eslint-disable-next-line
	const [modalVisible, setModalVisible] = useState(false);
	// eslint-disable-next-line
	const [allOrdersAggregated, setAllOrdersAggregated] = useState("");
	const [allOrders, setAllOrders] = useState([]);
	const [allOrders2, setAllOrders2] = useState([]);
	const [requiredSKU, setRequiredSKU] = useState("");
	const [day1, setDay1] = useState(
		new Date(new Date().setDate(new Date().getDate())),
	);
	const [day2, setDay2] = useState(
		new Date(new Date().setDate(new Date().getDate() - 30)),
	);

	const [allOrdersByDateAndStatus, setAllOrdersByDateAndStatus] = useState([]);
	// eslint-disable-next-line
	const [allColors, setAllColors] = useState([]);

	const { user, token } = isAuthenticated();

	// eslint-disable-next-line
	var today = new Date();

	var today2 = new Date();
	var yesterday = new Date();
	var last7Days = new Date();
	var last30Days = new Date();
	var last90Days = new Date();

	yesterday.setDate(yesterday.getDate() - 1);
	last7Days.setDate(last7Days.getDate() - 7);
	last30Days.setDate(last30Days.getDate() - 30);
	last90Days.setDate(last90Days.getDate() - 200);

	// var todayTimeZone = moment(new Date().toISOString()).utcOffset(120)._i;

	const loadOrders = () => {
		function sortOrdersAscendingly(a, b) {
			const TotalAppointmentsA = a.orderCreationDate;
			const TotalAppointmentsB = b.orderCreationDate;
			let comparison = 0;
			if (TotalAppointmentsA > TotalAppointmentsB) {
				comparison = 1;
			} else if (TotalAppointmentsA > TotalAppointmentsB) {
				comparison = -1;
			}
			return comparison;
		}

		listOrdersDates(user._id, token, day1, day2).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				if (day1 === day2) {
					setAllOrders(
						data
							.filter(
								(i) =>
									new Date(i.orderCreationDate).setHours(0, 0, 0, 0) ===
									new Date(day1).setHours(0, 0, 0, 0),
							)
							.sort(sortOrdersAscendingly),
					);
				} else {
					setAllOrders(data.sort(sortOrdersAscendingly));
				}
			}
		});
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

	const gettingAllColors = () => {
		getColors(token).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllColors(data);
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

	const loadOrdersAggregateByDateAndStatus = () => {
		aggregateOrdersByDatesAndStatus(user._id, token).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllOrdersByDateAndStatus(data);
			}
		});
	};

	useEffect(() => {
		loadOrders();
		gettingAllColors();
		loadOrdersAggregate();
		// eslint-disable-next-line
	}, [selectedFilter, day1, day2]);

	useEffect(() => {
		loadOrders2();
		loadOrdersAggregateByDateAndStatus();
		// eslint-disable-next-line
	}, []);

	return (
		<SalesReportMainWrapper show={collapsed}>
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
				<div className=''>
					<AdminMenu
						fromPage='MainReports'
						AdminMenuStatus={AdminMenuStatus}
						setAdminMenuStatus={setAdminMenuStatus}
						collapsed={collapsed}
						setCollapsed={setCollapsed}
					/>
				</div>
				<div className='mainContent'>
					<Navbar fromPage='MainReports' pageScrolled={pageScrolled} />
					<div
						style={{
							background: "white",
							textAlign: "right",
							fontSize: "13px",
						}}
						className='py-3 mb-5'>
						<span
							style={isActive("SelectAll", selectedFilter)}
							className='mx-2 filterItem'
							onClick={() => {
								setSelectedFilter("SelectAll");
								setDay2(last90Days);
								setDay1(today2);
							}}>
							Select All
						</span>
						<span
							style={isActive("Today", selectedFilter)}
							className='mx-2 filterItem'
							onClick={() => {
								setSelectedFilter("Today");
								setDay2(today);
								setDay1(today2);
							}}>
							Today
						</span>
						<span
							style={isActive("Yesterday", selectedFilter)}
							className='mx-2 filterItem'
							onClick={() => {
								setSelectedFilter("Yesterday");
								setDay2(yesterday);
								setDay1(yesterday);
							}}>
							Yesterday
						</span>
						<span
							style={isActive("Last7Days", selectedFilter)}
							className='mx-2 filterItem'
							onClick={() => {
								setSelectedFilter("Last7Days");
								setDay2(last7Days);
								setDay1(today2);
							}}>
							Last 7 Days
						</span>
						<span
							style={isActive("Last30Days", selectedFilter)}
							className='mx-2 filterItem'
							onClick={() => {
								setSelectedFilter("Last30Days");
								setDay2(last30Days);
								setDay1(today2);
							}}>
							Last 30 Days
						</span>

						<span
							style={isActive("CustomDates", selectedFilter)}
							className='mx-2 filterItem'
							onClick={() => {
								setSelectedFilter("CustomDates");
								setModalVisible(true);
							}}>
							Custom Dates
						</span>
						<span
							style={isActive("Group", selectedFilter)}
							className='mx-2 filterItem'
							onClick={() => {
								setModalVisible(true);
								setSelectedFilter("Group");
							}}>
							Group <GroupOutlined />
						</span>
					</div>
					<CustomDatesModal
						day1={day1}
						setDay1={setDay1}
						day2={day2}
						setDay2={setDay2}
						modalVisible={modalVisible}
						setModalVisible={setModalVisible}
						setRequiredSKU={setRequiredSKU}
						requiredSKU={requiredSKU}
					/>
					<div className='row'>
						<div className='col-md-3 mt-4'>
							<h3 className='ml-3' style={{ fontWeight: "bold" }}>
								SALES REPORT <Clock />
								<span
									style={{
										fontSize: "0.9rem",
										color: "black",
										textAlign: "center",
										fontWeight: "normal",
									}}>
									(<strong> {new Date(day2).toDateString()}</strong> to{" "}
									<strong>{new Date(day1).toDateString()}</strong>)
								</span>
							</h3>
						</div>

						<div className='col-md-9' style={{ background: "white" }}>
							<div className='container-fluid  mb-5'>
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

								<div className='mt-3 ml-5'>
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
							</div>
						</div>
					</div>
					<div className='mx-auto my-4'>
						<h3 className='ml-3' style={{ fontWeight: "bold" }}>
							OVERALL SALES <br />
							<span
								style={{
									fontSize: "13px",
									margin: "0px",
									top: "-10px",
									position: "relative",
									fontWeight: "normal",
								}}>
								GENERAL SALES METERING
							</span>
						</h3>
						<Section1
							allOrdersAggregated={allOrdersAggregated}
							allOrders2={allOrders2}
							allOrders={allOrders}
							day2={day2}
						/>
					</div>
					<div className='mx-auto my-5'>
						<h3 className='ml-3' style={{ fontWeight: "bold" }}>
							ONLINE SALES <br />
							<span
								style={{
									fontSize: "13px",
									margin: "0px",
									top: "-10px",
									position: "relative",
									fontWeight: "normal",
								}}>
								ONLINE STORES SALES
							</span>
						</h3>
						<div
							className='ml-4 mb-4'
							style={{ top: "-10px", position: "relative" }}>
							<button
								className='mr-4'
								style={{
									border: "none",
									borderRadius: "3px",
									cursor: "pointer",
									background: "lightgrey",
									padding: "5px",
									fontWeight: "bold",
								}}
								onClick={() => {
									setSelectedFilter("Today");
									setDay2(today);
									setDay1(today2);
								}}>
								TODAY
							</button>
							<button
								className='mr-4'
								style={{
									border: "none",
									borderRadius: "3px",
									cursor: "pointer",
									background: "lightgrey",
									padding: "5px",
									fontWeight: "bold",
								}}
								onClick={() => {
									setSelectedFilter("Yesterday");
									setDay2(yesterday);
									setDay1(yesterday);
								}}>
								YESTERDAY
							</button>
							<button
								className='mr-2'
								style={{
									border: "none",
									borderRadius: "3px",
									cursor: "pointer",
									background: "lightgrey",
									padding: "5px",
									fontWeight: "bold",
								}}
								onClick={() => {
									setSelectedFilter("Last7Days");
									setDay2(last7Days);
									setDay1(today2);
								}}>
								WEEK
							</button>
						</div>
						<Section2
							allOrders2={allOrders2}
							allOrders={allOrders}
							day2={day2}
							day1={day1}
							allOrdersByDateAndStatus={allOrdersByDateAndStatus}
						/>
					</div>
				</div>
			</div>
		</SalesReportMainWrapper>
	);
};

export default SalesReportMain;

const SalesReportMainWrapper = styled.div`
	min-height: 880px;
	overflow-x: hidden;
	/* background: #ededed; */

	.grid-container {
		display: grid;
		/* grid-template-columns: 16% 84%; */
		grid-template-columns: ${(props) =>
			props.show ? "4.5% 95.5%" : "15% 85%"};

		margin: auto;
		/* border: 1px solid red; */
		/* grid-auto-rows: minmax(60px, auto); */
	}

	.card-body {
		font-weight: bolder;
	}

	.card-body span {
		font-size: 1.5rem;
	}

	.filterItem {
		color: darkgrey;
		font-weight: bold;
		padding: 5px;
		transition: 0.3s;
	}

	.filterItem:hover {
		background: #f5f8fa;
		color: #009ef7;
		font-weight: bold;
		padding: 5px;
		border-radius: 3px;
		transition: 0.3s;
		cursor: pointer;
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

	g > text {
		font-size: 11px !important;
	}

	.apexcharts-legend {
		text-transform: uppercase !important;
	}

	.tableData {
		overflow-x: auto;
		margin-top: auto;
		margin-bottom: auto;
		margin-right: 50px;
		margin-left: 50px;
		.table > tbody > tr > td {
			vertical-align: middle !important;
		}
		@media (max-width: 1100px) {
			font-size: 0.5rem;
			/* margin-right: 5px;
		margin-left: 5px; */
		}
	}
`;
