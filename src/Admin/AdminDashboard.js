/** @format */

import {
	AreaChartOutlined,
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
import LetterM from "../GeneralImages/LetterM.jpg";
import LetterIbrahim from "../GeneralImages/LetterIbrahim.jpg";
import LetterRasha from "../GeneralImages/LetterRasha.jpg";
import Product1 from "../GeneralImages/CategoryPants.jpg";
import Product2 from "../GeneralImages/ProductImg2.jpg";
import Product3 from "../GeneralImages/ProductImg3.jpg";
import { listOrders } from "./apiAdmin";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
	const [allOrders, setAllOrders] = useState([]);
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	// eslint-disable-next-line
	const [offset, setOffset] = useState(0);
	const [pageScrolled, setPageScrolled] = useState(false);

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

	useEffect(() => {
		loadOrders();
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
	last7Days.setDate(yesterday.getDate() - 7);
	last30Days.setDate(yesterday.getDate() - 30);
	tomorrow.setDate(yesterday.getDate() + 2);
	next7Days.setDate(yesterday.getDate() + 8);
	next30Days.setDate(yesterday.getDate() + 31);

	// console.log(yesterday, "yesterday");

	let todaysOrders = allOrders.filter(
		(i) =>
			new Date(i.createdAt).toLocaleDateString("en-US", {
				timeZone: "Africa/Cairo",
			}) === today,
	);

	let yesterdaysOrders = allOrders.filter(
		(i) =>
			new Date(i.createdAt).setHours(0, 0, 0, 0) ===
			new Date(yesterday).setHours(0, 0, 0, 0),
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
				i.status !== "Cancelled" ||
				i.status !== "Shipped" ||
				i.status !== "Delivered" ||
				i.status !== "Returned",
		);
	const todaysUnfulfilledOrders =
		todaysOrders &&
		todaysOrders.filter(
			(i) =>
				i.status !== "Cancelled" ||
				i.status !== "Shipped" ||
				i.status !== "Delivered" ||
				i.status !== "Returned",
		);

	const yesterdaysUnfulfilledOrders =
		yesterdaysOrders &&
		yesterdaysOrders.filter(
			(i) =>
				i.status !== "Cancelled" ||
				i.status !== "Shipped" ||
				i.status !== "Delivered" ||
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
				new Date(last7Days).setHours(0, 0, 0, 0),
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

	return (
		<AdminDashboardWrapper show={AdminMenuStatus}>
			<div className='grid-container'>
				<div>
					<AdminMenu
						fromPage='AdminDasboard'
						AdminMenuStatus={AdminMenuStatus}
						setAdminMenuStatus={setAdminMenuStatus}
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

									<div className='card'>
										<h5>Orders Overview</h5>
										<div className='col-md-10 mx-auto'>
											<hr />
										</div>
										<div className='row mt-3'>
											<div className='col-md-5 mx-auto'>
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
											<div className='col-md-5 mx-auto'>
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
											<div className='col-md-5 mt-5 mx-auto'>
												<span className='cardHeader'>Overall Orders PY</span>{" "}
												<div className='metrics'>
													<CountUp
														duration='2'
														delay={0}
														end={0}
														separator=','
													/>
												</div>{" "}
											</div>
											<div className='col-md-5 mt-5 mx-auto'>
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
											<div className='col-md-5 mt-5 mx-auto'>
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
											<div className='col-md-5 mt-5 mx-auto'>
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
									<div className='card'>
										<h5>
											Today's Top Employees (
											{new Date().toDateString("en-US", {
												timeZone: "Africa/Cairo",
											})}
											):
										</h5>
										<div className='col-md-10 mx-auto'>
											<hr />
										</div>
										<div className='row'>
											<div className='col-md-8'>
												<img className='userImage' src={LetterM} alt='name' />
												<span className='employeeName'>
													Mamdouh Muhammad{" "}
													<span className='iconsForEmployee'>
														<VerticalAlignTopOutlined />
													</span>{" "}
												</span>
												<div className='topEmployeeOrders'>
													Taken Orders: 43
												</div>
											</div>
											<div className='col-md-4 mt-2'>
												<div style={{ fontWeight: "bold" }}>
													<CountUp
														duration='2'
														delay={0}
														end={4252}
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
										<div className='row mt-1'>
											<div className='col-md-8'>
												<img
													className='userImage'
													src={LetterIbrahim}
													alt='name'
												/>
												<span className='employeeName'>Ibrahim Gamal</span>
												<div className='topEmployeeOrders'>
													Taken Orders: 37
												</div>
											</div>
											<div className='col-md-4 mt-2'>
												<div style={{ fontWeight: "bold" }}>
													<CountUp
														duration='2'
														delay={0}
														end={3920}
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

										<div className='row mt-1'>
											<div className='col-md-8'>
												<img
													className='userImage'
													src={LetterRasha}
													alt='name'
												/>
												<span className='employeeName'>Rasha Elsayed</span>
												<div className='topEmployeeOrders'>
													Taken Orders: 33
												</div>
											</div>
											<div className='col-md-4 mt-2'>
												<div style={{ fontWeight: "bold" }}>
													<CountUp
														duration='2'
														delay={0}
														end={3745}
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
									</div>
								</div>
								<div className='col-xl-8 col-lg-8 col-md-11 mx-auto my-5'>
									<div className='card'>
										<h5>
											Today's Sales Summary (
											{new Date().toDateString("en-US", {
												timeZone: "Africa/Cairo",
											})}
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
											<div className='col-1'>1</div>
											<div className='col-2'>
												<img
													className='userImage'
													src={Product1}
													alt='product'
												/>
											</div>
											<div className='col-2'>Jeans</div>

											<div className='col-2'>24</div>
											<div className='col-3'>Ibrahim Gamal</div>
											<div
												className='col-2'
												style={{ color: "#ebeb00", fontWeight: "bold" }}>
												In Progress
											</div>

											<div className='col-md-12 mx-auto'>
												<hr />
											</div>
											<div className='col-1'>2</div>
											<div className='col-2'>
												<img
													className='userImage'
													src={Product2}
													alt='product'
												/>
											</div>
											<div className='col-2'>Shorts</div>

											<div className='col-2'>25</div>
											<div className='col-3'>Mamdouh Muhammad</div>
											<div
												className='col-2'
												style={{ color: "#0062c4", fontWeight: "bolder" }}>
												Ready To Ship
											</div>

											<div className='col-md-12 mx-auto'>
												<hr />
											</div>
											<div className='col-1'>3</div>
											<div className='col-2'>
												<img
													className='userImage'
													src={Product3}
													alt='product'
												/>
											</div>
											<div className='col-2'>PJ</div>

											<div className='col-2'>17</div>
											<div className='col-3'>Rasha Elsayed</div>
											<div
												className='col-2'
												style={{ color: "#0062c4", fontWeight: "bolder" }}>
												Ready To Ship
											</div>
										</div>
									</div>
								</div>

								<div className='col-md-12  mx-auto mb-5'>
									<div className='card'>
										<h5>GQ Shop Inventory Report</h5>
										<div className='col-md-10 mx-auto'>
											<hr />
										</div>
										<div className='row mt-3'>
											<div className='col-1'>Item #</div>
											<div className='col-2'>Image</div>
											<div className='col-2'>Product Name</div>
											<div className='col-2'>Inventory Level</div>
											<div className='col-3'>Added By</div>
											<div className='col-2'>Status</div>
											<div className='col-md-12 mx-auto'>
												<hr />
											</div>
											<div className='col-1'>1</div>
											<div className='col-2'>
												<img
													className='userImage'
													src={Product1}
													alt='product'
												/>
											</div>
											<div className='col-2'>Jeans</div>

											<div className='col-2'>24</div>
											<div className='col-3'>Ibrahim Gamal</div>
											<div className='col-2'>In Progress</div>

											<div className='col-md-12 mx-auto'>
												<hr />
											</div>
											<div className='col-1'>2</div>
											<div className='col-2'>
												<img
													className='userImage'
													src={Product2}
													alt='product'
												/>
											</div>
											<div className='col-2'>Shorts</div>

											<div className='col-2'>25</div>
											<div className='col-3'>Mamdouh Muhammad</div>
											<div className='col-2'>Ready To Ship</div>

											<div className='col-md-12 mx-auto'>
												<hr />
											</div>
											<div className='col-1'>3</div>
											<div className='col-2'>
												<img
													className='userImage'
													src={Product3}
													alt='product'
												/>
											</div>
											<div className='col-2'>PJ</div>

											<div className='col-2'>17</div>
											<div className='col-3'>Rasha Elsayed</div>
											<div className='col-2'>Ready To Ship</div>
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
`;
