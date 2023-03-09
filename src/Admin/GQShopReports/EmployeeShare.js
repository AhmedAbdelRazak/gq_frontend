/** @format */

import React, { useState, useEffect } from "react";
import styled from "styled-components";
// eslint-disable-next-line
import { getColors, listOrdersDates } from "../apiAdmin";
import { isAuthenticated } from "../../auth";
// import { isAuthenticated } from "../../auth";
import AdminMenu from "../AdminMenu/AdminMenu";
import DarkBG from "../AdminMenu/DarkBG";
import Navbar from "../AdminNavMenu/Navbar";
// eslint-disable-next-line
import CountUp from "react-countup";

const EmployeeShare = () => {
	const [offset, setOffset] = useState(0);
	const [pageScrolled, setPageScrolled] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [allOrders, setAllOrders] = useState([]);

	// eslint-disable-next-line
	const [uniqueEmployees, setUniqueEmployees] = useState([]);
	const [q, setQ] = useState("");

	// eslint-disable-next-line
	const [day1, setDay1] = useState(
		new Date(new Date().setDate(new Date().getDate() + 1)),
	);
	// eslint-disable-next-line
	const [day2, setDay2] = useState(
		new Date(new Date().setDate(new Date().getDate() - 90)),
	);

	// eslint-disable-next-line
	const [allColors, setAllColors] = useState([]);

	// eslint-disable-next-line
	const { user, token } = isAuthenticated();

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
				if (user.userRole !== "Admin Account") {
					setAllOrders(
						data
							.filter(
								(i) =>
									i.employeeData.email === user.email &&
									i.status !== "Cancelled",
							)
							.sort(sortOrdersAscendingly),
					);
				} else {
					setAllOrders(
						data
							.filter((i) => i.status !== "Cancelled")
							.sort(sortOrdersAscendingly),
					);

					//Gender Unique
					var employeeUnique = data && data.map((ii) => ii.employeeData);

					let distinctEmpoyees = [
						...new Map(
							employeeUnique &&
								employeeUnique.map((item) => [item["name"], item]),
						).values(),
					];
					setUniqueEmployees(distinctEmpoyees);
				}
			}
		});
	};

	useEffect(() => {
		gettingAllColors();
		loadOrders();
		// eslint-disable-next-line
	}, []);

	var Employees_TotalOrders_Revenue = [];
	allOrders &&
		allOrders.reduce(function (res, value) {
			if (
				!res[
					value.employeeData.name +
						new Date(value.orderCreationDate).toLocaleDateString()
				]
			) {
				res[
					value.employeeData.name +
						new Date(value.orderCreationDate).toLocaleDateString()
				] = {
					EmployeeName: value.employeeData.name,
					EmployeeImage: value.employeeData.employeeImage,
					orderCreationDate: new Date(
						value.orderCreationDate,
					).toLocaleDateString(),
					totalAmountAfterDiscount: 0,
					totalOrders: 0,
				};
				Employees_TotalOrders_Revenue.push(
					res[
						value.employeeData.name +
							new Date(value.orderCreationDate).toLocaleDateString()
					],
				);
			}
			res[
				value.employeeData.name +
					new Date(value.orderCreationDate).toLocaleDateString()
			].totalAmountAfterDiscount += Number(value.totalAmountAfterDiscount);

			res[
				value.employeeData.name +
					new Date(value.orderCreationDate).toLocaleDateString()
			].totalOrders += 1;

			return res;
		}, {});

	function search(orders) {
		return orders.filter((row) => {
			var datesYaba = new Date(row.orderCreationDate).toLocaleDateString();
			return (
				datesYaba.toString().toLowerCase().indexOf(q) > -1 ||
				row.EmployeeName.toString().toLowerCase().indexOf(q) > -1
			);
		});
	}

	return (
		<EmployeeShareWrapper show={collapsed}>
			{!collapsed ? (
				<DarkBG collapsed={collapsed} setCollapsed={setCollapsed} />
			) : null}
			<div className='grid-container'>
				<div className=''>
					<AdminMenu
						fromPage='EmployeeShare'
						AdminMenuStatus={AdminMenuStatus}
						setAdminMenuStatus={setAdminMenuStatus}
						collapsed={collapsed}
						setCollapsed={setCollapsed}
					/>
				</div>
				<div className='mainContent'>
					<Navbar fromPage='EmployeeShare' pageScrolled={pageScrolled} />

					<div className='row mx-4 my-5'>
						<div className='col-xl-4 col-lg-6 col-md-11 col-sm-11 text-center mx-auto my-2'>
							<div className='card' style={{ background: "#f1416c" }}>
								<div className='card-body'>
									<h5 style={{ fontWeight: "bolder", color: "white" }}>
										Overall Orders Count (Not Cancelled)
									</h5>
									<CountUp
										style={{ color: "white" }}
										duration='3'
										delay={1}
										end={allOrders.length}
										separator=','
									/>
									<span
										style={{
											color: "white",
											marginLeft: "5px",
											fontSize: "1.2rem",
										}}>
										Orders
									</span>
								</div>
							</div>
						</div>
					</div>
					<div
						style={{
							margin: "0px 200px",
						}}>
						<div className='form-group'>
							<label
								className=' mr-2'
								style={{
									fontWeight: "bold",
									fontSize: "1.05rem",
									color: "black",
									borderRadius: "20px",
								}}>
								Search
							</label>
							<input
								className='p-2 my-2 '
								type='text'
								value={q}
								onChange={(e) => {
									setQ(e.target.value.toLowerCase());
								}}
								placeholder='Search By Employee Name'
								style={{ borderRadius: "20px", width: "50%" }}
							/>
						</div>
						<div style={{ maxHeight: "800px", overflow: "auto" }}>
							<table
								className='table table-bordered table-md-responsive table-hover'
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
									}}>
									<tr
										style={{
											fontSize: "0.75rem",
											textTransform: "capitalize",
											textAlign: "center",
											backgroundColor: "#009ef7",
											color: "wheat",
										}}>
										<th scope='col'>Order Date</th>
										<th scope='col'>Employee Name</th>
										<th scope='col'>Orders Count</th>
										<th scope='col'>Total Amount (L.E.)</th>
										<th scope='col'>Employee Share (%1)</th>
										<th scope='col'>To Meet Target</th>
									</tr>
								</thead>
								<tbody
									className='my-auto'
									style={{
										fontSize: "0.75rem",
										textTransform: "capitalize",
										fontWeight: "bolder",
									}}>
									{Employees_TotalOrders_Revenue &&
										search(Employees_TotalOrders_Revenue).map((s, i) => {
											return (
												<tr key={i} className=''>
													<td className='my-auto'>
														{new Date(s.orderCreationDate).toDateString()}
													</td>

													<td>{s.EmployeeName}</td>
													<td>{s.totalOrders}</td>
													<td>
														{Number(s.totalAmountAfterDiscount).toFixed(2)} L.E.
													</td>
													{Number(s.totalAmountAfterDiscount) > 5000 ? (
														<td>
															{Number(
																(Number(s.totalAmountAfterDiscount) - 5000) *
																	0.01,
															).toFixed(2)}{" "}
															L.E.
														</td>
													) : (
														<td>DID NOT MEET TARGET</td>
													)}
													{Number(s.totalAmountAfterDiscount) < 5000 ? (
														<td>
															{Number(
																5000 - s.totalAmountAfterDiscount,
															).toFixed(2)}{" "}
															L.E.
														</td>
													) : (
														<td>0</td>
													)}

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
		</EmployeeShareWrapper>
	);
};

export default EmployeeShare;

const EmployeeShareWrapper = styled.div`
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
