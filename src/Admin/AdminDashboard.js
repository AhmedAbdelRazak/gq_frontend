/** @format */

import {
	AreaChartOutlined,
	EditOutlined,
	FileUnknownOutlined,
	ShoppingCartOutlined,
	VerticalAlignTopOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AdminMenu from "./AdminMenu/AdminMenu";
import Navbar from "./AdminNavMenu/Navbar";
import Chart from "react-apexcharts";
import CountUp from "react-countup";

import { getProducts, listOrders } from "./apiAdmin";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import DarkBG from "./AdminMenu/DarkBG";
import EditDateModal from "./Modals/EditDateModal";
import ShowOrdersHistory from "./Modals/ShowOrdersHistory";
import AttributesModal from "./Product/UpdatingProduct/AttributesModal";

const AdminDashboard = () => {
	const [allOrders, setAllOrders] = useState([]);
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	// eslint-disable-next-line
	const [offset, setOffset] = useState(0);
	const [pageScrolled, setPageScrolled] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	const [selectedDate, setSelectedDate] = useState(
		new Date().toLocaleDateString("en-US", {
			timeZone: "Africa/Cairo",
		}),
	);

	const [modalVisible, setModalVisible] = useState(false);
	const [modalVisible2, setModalVisible2] = useState(false);

	const [allProducts, setAllProducts] = useState([]);
	const [modalVisible3, setModalVisible3] = useState(false);
	const [clickedProduct, setClickedProduct] = useState({});

	const { user, token } = isAuthenticated();

	const loadOrders = () => {
		function sortOrdersAscendingly(a, b) {
			const TotalAppointmentsA = a.createdAt;
			const TotalAppointmentsB = b.createdAt;
			let comparison = 0;
			if (TotalAppointmentsA > TotalAppointmentsB) {
				comparison = 1;
			} else if (TotalAppointmentsA > TotalAppointmentsB) {
				comparison = -1;
			}
			return comparison;
		}
		listOrders(user._id, token).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllOrders(data.sort(sortOrdersAscendingly));
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

		// eslint-disable-next-line
	}, []);

	var today = new Date().toLocaleDateString("en-US", {
		timeZone: "Africa/Cairo",
	});

	var yesterday = new Date(today);
	var last7Days = new Date(today);
	var last30Days = new Date(today);
	var tomorrow = new Date(today);
	var next7Days = new Date(today);
	var next30Days = new Date(today);

	yesterday.setDate(yesterday.getDate() - 1);
	last7Days.setDate(yesterday.getDate() - 9);
	last30Days.setDate(yesterday.getDate() - 30);
	tomorrow.setDate(yesterday.getDate() + 2);
	next7Days.setDate(yesterday.getDate() + 8);
	next30Days.setDate(yesterday.getDate() + 31);

	// console.log(yesterday, "yesterday");

	let todaysOrders = allOrders.filter(
		(i) =>
			new Date(i.createdAt).setHours(0, 0, 0, 0) ===
				new Date(today).setHours(0, 0, 0, 0) &&
			i.status !== "Cancelled" &&
			i.status !== "Returned",
	);

	let yesterdaysOrders = allOrders.filter(
		(i) =>
			new Date(i.createdAt).setHours(0, 0, 0, 0) ===
				new Date(yesterday).setHours(0, 0, 0, 0) &&
			i.status !== "Cancelled" &&
			i.status !== "Returned",
	);

	let overallUncancelledOrders = allOrders.filter(
		(i) => i.status !== "Cancelled" && i.status !== "Returned",
	);

	let overallUncancelledOrders2 =
		overallUncancelledOrders &&
		overallUncancelledOrders.map((i) => i.totalAmountAfterDiscount);

	const SumoverallUncancelledOrders2 = overallUncancelledOrders2.reduce(
		(a, b) => a + b,
		0,
	);

	const todaysRevenue =
		todaysOrders && todaysOrders.map((i) => i.totalAmountAfterDiscount);

	const sumOfTodaysRevenue = todaysRevenue.reduce((a, b) => a + b, 0);

	const yesterdaysRevenue =
		yesterdaysOrders && yesterdaysOrders.map((i) => i.totalAmountAfterDiscount);

	const sumOfYesterdaysRevenue = yesterdaysRevenue.reduce((a, b) => a + b, 0);

	const overAllUnfulfilledOrders =
		allOrders &&
		allOrders.filter(
			(i) =>
				i.status !== "Cancelled" &&
				i.status !== "Shipped" &&
				i.status !== "Delivered" &&
				i.status !== "Returned",
		);

	const todaysUnfulfilledOrders =
		todaysOrders &&
		todaysOrders.filter(
			(i) =>
				i.status !== "Cancelled" &&
				i.status !== "Shipped" &&
				i.status !== "Delivered" &&
				i.status !== "Returned",
		);

	const yesterdaysUnfulfilledOrders =
		yesterdaysOrders &&
		yesterdaysOrders.filter(
			(i) =>
				i.status !== "Cancelled" &&
				i.status !== "Shipped" &&
				i.status !== "Delivered" &&
				i.status !== "Returned",
		);

	const yesterdaysUnfulfilledRevenue =
		yesterdaysUnfulfilledOrders &&
		yesterdaysUnfulfilledOrders.map((i) => i.totalAmountAfterDiscount);

	const sumOfYesterdaysUnfulfilledRevenue = yesterdaysUnfulfilledRevenue.reduce(
		(a, b) => a + b,
		0,
	);

	const todaysUnfulfilledRevenue =
		todaysUnfulfilledOrders &&
		todaysUnfulfilledOrders.map((i) => i.totalAmountAfterDiscount);

	const sumOfTodaysUnfulfilledRevenue = todaysUnfulfilledRevenue.reduce(
		(a, b) => a + b,
		0,
	);

	let last7daysOrders = allOrders
		.filter(
			(i) =>
				new Date(i.createdAt).setHours(0, 0, 0, 0) >=
					new Date(last7Days).setHours(0, 0, 0, 0) &&
				i.status !== "Cancelled" &&
				i.status !== "Returned",
		)
		.map((ii) => {
			return {
				...ii,
				createdAt: new Date(ii.createdAt).toLocaleDateString(),
			};
		});

	// console.log(last7daysOrders, "last7daysOrders");

	var OrdersDates_TotalAmount = [];
	last7daysOrders &&
		last7daysOrders.reduce(function (res, value) {
			if (!res[value.createdAt]) {
				res[value.createdAt] = {
					createdAt: value.createdAt,
					totalAmountAfterDiscount: 0,
				};
				OrdersDates_TotalAmount.push(res[value.createdAt]);
			}
			res[value.createdAt].totalAmountAfterDiscount += Number(
				value.totalAmountAfterDiscount,
			);
			return res;
		}, {});

	var chartDataTotalAmount = {
		options: {
			chart: {
				id: "bar",
				background: "#ebf5ff",
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
					return val;
				},
				style: {
					fontSize: "12px",
					fontFamily: "Helvetica, Arial, sans-serif",
					fontWeight: "bold",
					// colors: undefined,
					colors: ["#ebf5ff", "#E91E63", "#9C27B0"],
				},
			},

			title: {
				text: "GQ Shop Day Over Day Overview",
				align: "center",
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
					new Date(i.createdAt).toLocaleDateString(),
				),
			},
		},
		series: [
			{
				name: "Total Paid Amount",
				data: OrdersDates_TotalAmount.map((i) => i.totalAmountAfterDiscount),
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
			new Date(i.createdAt).setHours(0, 0, 0, 0) ===
				new Date(selectedDate).setHours(0, 0, 0, 0) &&
			i.status !== "Cancelled" &&
			i.status !== "Returned",
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
					EmployeeImage: value.employeeData.employeeImage,
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
						};
					}),
				),
			);

		return modifiedArray;
	};

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
				productPrice: i.priceAfterDiscount,
				productQty: i.addVariables
					? i.productAttributes
							.map((iii) => iii.quantity)
							.reduce((a, b) => a + b, 0)
					: i.quantity,
				productImage: i.thumbnailImage,
				productSKU: i.productSKU,
				addedBy: i.addedByEmployee,
				createdAt: i.createdAt,
				addVariables: i.addVariables,
				productAttributes: i.productAttributes,
			};
		});

		return modifiedArray.sort(sortTopProducts);
	};

	return (
		<AdminDashboardWrapper show={collapsed}>
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
					<Navbar fromPage='AdminDashboard' pageScrolled={pageScrolled} />
					<div className='mx-auto  mt-5'>
						<div className='container-fluid'>
							<div className='row mx-auto'>
								<div className='col-xl-4 col-lg-8 col-md-11  mx-auto'>
									<div className='firstCard mb-3'>
										<div className='headerIcons'>
											<ShoppingCartOutlined />
										</div>
										<div className='headerText'>Order Takers Summary</div>
									</div>
									<ShowOrdersHistory
										Orders={selectedDateOrdersModified()}
										modalVisible2={modalVisible2}
										setModalVisible2={setModalVisible2}
										setCollapsed={setCollapsed}
										selectedDate={selectedDate}
									/>
									<div className='card'>
										<h5>Orders Overview</h5>
										<div className='col-md-10 mx-auto'>
											<hr />
										</div>
										<div className='row mt-3'>
											<div className='col-5 mx-auto'>
												<span className='cardHeader'>Overall Orders</span>{" "}
												<div className='metrics'>
													<CountUp
														duration='2'
														delay={1}
														end={allOrders.length}
														separator=','
													/>
												</div>{" "}
											</div>

											<div className='col-5 mx-auto'>
												<span className='cardHeader'>
													Overall Uncancelled Revenue{" "}
												</span>{" "}
												<div className='metrics'>
													<CountUp
														duration='2'
														delay={1}
														end={SumoverallUncancelledOrders2}
														separator=','
													/>
												</div>{" "}
											</div>

											<div className='col-5 mt-5 mx-auto'>
												<span className='cardHeader'>Today's Orders </span>{" "}
												<div className='metrics'>
													<CountUp
														duration='2'
														delay={1}
														end={todaysOrders.length}
														separator=','
													/>
												</div>{" "}
											</div>

											<div className='col-5 mt-5 mx-auto'>
												<span className='cardHeader'>Yesterday's Orders</span>{" "}
												<div className='metrics'>
													<CountUp
														duration='2'
														delay={1}
														end={yesterdaysOrders.length}
														separator=','
													/>
												</div>{" "}
											</div>
											<div className='col-5 mt-5 mx-auto'>
												<span className='cardHeader'>Today's Revenue</span>{" "}
												<div className='metrics'>
													<CountUp
														duration='2'
														delay={0}
														end={sumOfTodaysRevenue}
														separator=','
													/>{" "}
													L.E.
												</div>{" "}
											</div>
											<div className='col-5 mt-5 mx-auto'>
												<span className='cardHeader'>Yesterday's Revenue </span>{" "}
												<div className='metrics'>
													<CountUp
														duration='2'
														delay={0}
														end={sumOfYesterdaysRevenue}
														separator=','
													/>{" "}
													L.E.
												</div>{" "}
											</div>
										</div>
									</div>
								</div>

								<div className='col-xl-4 col-lg-8 col-md-11 mx-auto'>
									<div className='secondCard mb-3'>
										<div className='headerIcons'>
											<FileUnknownOutlined />
										</div>
										<div className='headerText'>Orders Status</div>
									</div>
									<div className='card'>
										<h5>Actions Needed...</h5>
										<div className='col-md-10 mx-auto'>
											<hr />
										</div>
										<div className='row mt-3'>
											<div className='col-md-5 mx-auto'>
												<span className='cardHeader'>
													Overall Unfulfilled Orders
												</span>{" "}
												<div className='metrics'>
													<CountUp
														duration='2'
														delay={1}
														end={overAllUnfulfilledOrders.length}
														separator=','
													/>
												</div>{" "}
											</div>
											<div className='col-md-5 mx-auto'>
												<span className='cardHeader'>
													Today's Unfulfilled Orders{" "}
												</span>{" "}
												<div className='metrics'>
													<CountUp
														duration='2'
														delay={1}
														end={todaysUnfulfilledOrders.length}
														separator=','
													/>
												</div>{" "}
											</div>

											<div className='col-md-5 mt-5 mx-auto'>
												<span className='cardHeader'>
													Today's Unfulfilled Revenue
												</span>{" "}
												<div className='metrics'>
													<CountUp
														duration='2'
														delay={1}
														end={sumOfTodaysUnfulfilledRevenue}
														separator=','
													/>{" "}
													L.E.
												</div>{" "}
											</div>
											<div className='col-md-5 mt-5 mx-auto'>
												<span className='cardHeader'>
													Yesterday's Unfulfilled Revenue{" "}
												</span>{" "}
												<div className='metrics'>
													<CountUp
														duration='2'
														delay={1}
														end={sumOfYesterdaysUnfulfilledRevenue}
														separator=','
													/>{" "}
													L.E.
												</div>{" "}
											</div>
											<div
												className='col-md-5 mt-3 mx-auto'
												style={{ fontWeight: "bolder" }}>
												{" "}
												<Link to='/admin/orders-hist'>LEARN MORE...</Link>{" "}
											</div>
										</div>
									</div>
								</div>
								<div className='col-xl-4 col-lg-8 col-md-11 mx-auto'>
									<div className='thirdCard mb-3'>
										<div className='headerIcons'>
											<AreaChartOutlined />
										</div>
										<div className='headerText'>Sales Stats</div>
									</div>
									<div className='card'>
										<h5>Day Over Day Sales Stats:</h5>
										<div className='col-md-10 mx-auto'>
											<hr />
										</div>
										<div className='mx-auto text-center w-100 h-100'>
											<Chart
												options={chartDataTotalAmount.options}
												series={chartDataTotalAmount.series}
												type='bar'
												style={{
													width: "100%",
													height: "100%",
												}}
											/>
										</div>
									</div>
								</div>

								<div className='col-xl-4 col-lg-8 col-md-11  mx-auto my-5'>
									<EditDateModal
										selectedDate={selectedDate}
										setSelectedDate={setSelectedDate}
										modalVisible={modalVisible}
										setModalVisible={setModalVisible}
										setCollapsed={setCollapsed}
									/>

									<div className='card'>
										<h5>
											Top Employees (
											{new Date(selectedDate).toDateString("en-US", {
												timeZone: "Africa/Cairo",
											})}
											<span
												onClick={() => {
													setModalVisible(true);
													setCollapsed(true);
												}}
												style={{ cursor: "pointer" }}>
												<EditOutlined />
											</span>{" "}
											):
										</h5>
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
																		L.E.
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
									</div>
								</div>

								<div className='col-xl-8 col-lg-8 col-md-11 mx-auto my-5'>
									<div className='card'>
										<h5>
											Sales Summary (
											{new Date(selectedDate).toDateString("en-US", {
												timeZone: "Africa/Cairo",
											})}
											<span
												onClick={() => {
													setModalVisible(true);
													setCollapsed(true);
												}}
												style={{ cursor: "pointer" }}>
												<EditOutlined />
											</span>{" "}
											):
										</h5>
										<div className='col-md-10 mx-auto'>
											<hr />
										</div>

										<div className='row mt-3'>
											<div className='col-1'>Item #</div>
											<div className='col-2'>Image</div>
											<div className='col-2'>Product Name</div>
											<div className='col-2'>Ordered Qty</div>
											<div className='col-3'>Ordered By</div>
											<div className='col-2'>Status</div>
											<div className='col-md-12 mx-auto'>
												<hr />
											</div>
											<>
												{selectedDateOrdersModified() &&
													selectedDateOrdersModified().map((o, i) =>
														o.map((oo) =>
															oo.map((ooo, iii) => {
																return (
																	<React.Fragment key={iii}>
																		{i <= 3 ? (
																			<>
																				<div className='col-1'> {i + 1} </div>

																				<div className='col-2'>
																					<img
																						className='userImage'
																						src={ooo.productMainImage}
																						alt='product'
																					/>
																				</div>
																				<div className='col-2 text-capitalize'>
																					{ooo.productName}
																				</div>

																				<div className='col-2'>
																					{ooo.OrderedQty}
																				</div>
																				<div className='col-3'>
																					{ooo.employeeName}
																				</div>
																				{ooo.status === "Cancelled" ? (
																					<div
																						className='col-2'
																						style={{
																							color: "darkred",
																							fontWeight: "bold",
																						}}>
																						{ooo.status}
																					</div>
																				) : ooo.status === "Shipped" ||
																				  ooo.status === "Delivered" ? (
																					<div
																						className='col-2'
																						style={{
																							color: "darkgreen",
																							fontWeight: "bold",
																						}}>
																						{ooo.status}
																					</div>
																				) : (
																					<div
																						className='col-2'
																						style={{
																							color: "black",
																							fontWeight: "bold",
																						}}>
																						{ooo.status}
																					</div>
																				)}

																				<div className='col-md-12 mx-auto'>
																					<hr />
																				</div>
																			</>
																		) : null}
																	</React.Fragment>
																);
															}),
														),
													)}
												{selectedDateOrdersModified() &&
													selectedDateOrdersModified().length > 4 && (
														<div
															className='text-center my-4 mx-auto'
															style={{ fontWeight: "bolder" }}>
															{" "}
															<Link
																to='#'
																onClick={() => {
																	setModalVisible2(true);
																	setCollapsed(true);
																}}>
																SHOW MORE...
															</Link>{" "}
														</div>
													)}
											</>
										</div>
									</div>
								</div>

								<div className='col-md-12  mx-auto mb-5'>
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
																<td>
																	{new Date(s.createdAt).toLocaleDateString()}
																</td>
																<td>{s.addedBy.name}</td>
																<td style={{ width: "20%" }}>
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
		</AdminDashboardWrapper>
	);
};

export default AdminDashboard;

const AdminDashboardWrapper = styled.div`
	min-height: 880px;
	margin-bottom: 10px;
	/* background: #fafafa; */
	overflow-x: hidden;

	.grid-container {
		display: grid;
		/* grid-template-columns: 16% 84%; */
		grid-template-columns: ${(props) => (props.show ? "8% 92%" : "16% 84%")};

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

	.firstCard {
		background: #f1416c;
		border-radius: 5px;
		padding: 10px;
	}

	.secondCard {
		background: #009ef7;
		padding: 10px;
		border-radius: 5px;
	}
	.thirdCard {
		background: #50cd89;
		padding: 10px;
		border-radius: 5px;
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
		min-height: 470px !important;
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

	@media (max-width: 1750px) {
		background: white;

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
		background: white;

		.grid-container {
			display: grid;
			grid-template-columns: 12% 88%;
			margin: auto;
			/* border: 1px solid red; */
			/* grid-auto-rows: minmax(60px, auto); */
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
