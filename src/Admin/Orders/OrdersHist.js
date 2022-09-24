/** @format */

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { isAuthenticated } from "../../auth";
import AdminMenu from "../AdminMenu/AdminMenu";
import Navbar from "../AdminNavMenu/Navbar";
import CountUp from "react-countup";
import { listOrders } from "../apiAdmin";
import { Link } from "react-router-dom";

const OrdersHist = () => {
	const [allOrders, setAllOrders] = useState([]);
	const [q, setQ] = useState("");
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);

	const { user, token } = isAuthenticated();

	const loadOrders = () => {
		function sortOrdersAscendingly(a, b) {
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

	const nonCancelledOrders =
		allOrders && allOrders.filter((i) => i.status !== "Cancelled");

	const overallQtyArray =
		nonCancelledOrders && nonCancelledOrders.map((i) => i.totalOrderQty);

	const ArrayOfQty = overallQtyArray.reduce((a, b) => a + b, 0);

	const overallAmountArray =
		nonCancelledOrders &&
		nonCancelledOrders.map((i) => i.totalAmountAfterDiscount);

	const ArrayOfAmount = overallAmountArray.reduce((a, b) => a + b, 0);

	function search(orders) {
		return orders.filter((row) => {
			var datesYaba = new Date(row.createdAt).toLocaleDateString();
			return (
				row.customerDetails.phone.toString().toLowerCase().indexOf(q) > -1 ||
				row.customerDetails.state.toString().toLowerCase().indexOf(q) > -1 ||
				row.customerDetails.cityName.toString().toLowerCase().indexOf(q) > -1 ||
				datesYaba.toString().toLowerCase().indexOf(q) > -1 ||
				row.customerDetails.fullName.toString().toLowerCase().indexOf(q) > -1 ||
				row.customerDetails.email.toString().toLowerCase().indexOf(q) > -1 ||
				row.status.toString().toLowerCase().indexOf(q) > -1 ||
				row.trackingNumber.toString().toLowerCase().indexOf(q) > -1 ||
				row.chosenShippingOption[0].carrierName
					.toString()
					.toLowerCase()
					.indexOf(q) > -1
			);
		});
	}

	const dataTable = () => {
		return (
			<div className='tableData'>
				<div className=' mb-3 form-group mx-3 text-center'>
					<label
						className='mt-3 mx-3'
						style={{
							fontWeight: "bold",
							fontSize: "1.05rem",
							color: "black",
							borderRadius: "20px",
						}}>
						Search
					</label>
					<input
						className='p-2 my-5 '
						type='text'
						value={q}
						onChange={(e) => setQ(e.target.value.toLowerCase())}
						placeholder='Search By Client Phone, Client Name, Status Or Carrier'
						style={{ borderRadius: "20px", width: "50%" }}
					/>
				</div>
				<table
					className='table table-bordered table-md-responsive table-hover table-striped text-center'
					style={{ fontSize: "0.75rem" }}>
					<thead className='thead-light'>
						<tr>
							<th scope='col'>Order #</th>
							<th scope='col'>Customer Name</th>
							<th scope='col'>Customer Phone</th>
							<th scope='col'>Customer Email</th>
							<th scope='col'>Purchase Date</th>
							<th scope='col'>Status</th>
							<th scope='col'>Governorate</th>
							<th scope='col'>City</th>
							<th scope='col'>Shipping Carrier</th>
							<th scope='col'>Tracking #</th>
							<th scope='col'>Ordered By</th>
							<th scope='col'>Amount</th>
							<th scope='col'>Ordered Qty</th>
							<th scope='col'>Invoice</th>
							<th scope='col'>More Details</th>
						</tr>
					</thead>

					<tbody className='my-auto'>
						{search(allOrders).map((s, i) => (
							<tr
								key={i}
								className=''
								style={{
									background:
										s.status === "Delivered" || s.status === "Shipped"
											? "#004b00"
											: s.status === "Cancelled"
											? "darkred"
											: "",
									color:
										s.status === "Delivered" || s.status === "Shipped"
											? "white"
											: s.status === "Cancelled"
											? "white"
											: "",
								}}>
								<td className='my-auto'>{allOrders.length - i}</td>

								<td>{s.customerDetails.fullName}</td>
								<td>{s.customerDetails.phone}</td>
								<td>{s.customerDetails.email}</td>
								<td>{new Date(s.createdAt).toLocaleDateString()} </td>
								<td
									style={{
										fontWeight: "bold",
										fontSize: "0.9rem",
										width: "8.5%",
										background:
											s.status === "Delivered" || s.status === "Shipped"
												? "#004b00"
												: s.status === "Cancelled"
												? "darkred"
												: "#003264",
										color:
											s.status === "Delivered" || s.status === "Shipped"
												? "white"
												: s.status === "Cancelled"
												? "white"
												: "white",
									}}>
									{s.status}
								</td>
								<td>{s.customerDetails.state}</td>
								<td>{s.customerDetails.cityName}</td>
								<td>{s.chosenShippingOption[0].carrierName}</td>
								<td>{s.trackingNumber ? s.trackingNumber : "Not Added"}</td>
								<td>{s.employeeData.name}</td>
								<td>{s.totalAmountAfterDiscount.toFixed(2)} L.E.</td>
								<td>{s.totalOrderQty}</td>
								<td>Display Invoice</td>
								<Link to={`/admin/single-order/${s._id}`}>
									<td
										style={{
											color: "blue",
											fontWeight: "bold",
											cursor: "pointer",
										}}>
										More Details...
									</td>
								</Link>

								{/* <td>{Invoice(s)}</td> */}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	};

	console.log(allOrders, "AllOrders");

	return (
		<OrdersHistWrapper show={AdminMenuStatus}>
			<div className='grid-container'>
				<div className=''>
					<AdminMenu
						fromPage='OrdersHist'
						AdminMenuStatus={AdminMenuStatus}
						setAdminMenuStatus={setAdminMenuStatus}
					/>
				</div>
				<div className='mainContent'>
					<Navbar fromPage='OrdersHist' />
					<h3
						style={{ color: "#009ef7", fontWeight: "bold" }}
						className='mx-auto text-center mb-5'>
						Sales History
					</h3>
					<div className='container-fluid'>
						<div className='row'>
							<div className='col-xl-4 col-lg-6 col-md-11 col-sm-11 text-center mx-auto my-2'>
								<div className='card' style={{ background: "#f1416c" }}>
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

							<div className='col-xl-4 col-lg-6 col-md-11 col-sm-11 text-center mx-auto my-2'>
								<div className='card' style={{ background: "#009ef7" }}>
									<div className='card-body'>
										<h5 style={{ fontWeight: "bolder", color: "white" }}>
											Overall Ordered Items
										</h5>
										<CountUp
											style={{ color: "white" }}
											duration='3'
											delay={1}
											end={ArrayOfQty}
											separator=','
										/>
									</div>
								</div>
							</div>

							<div className='col-xl-4 col-lg-6 col-md-11 col-sm-11 text-center mx-auto my-2'>
								<div className='card' style={{ background: "#50cd89" }}>
									<div className='card-body'>
										<h5 style={{ fontWeight: "bolder", color: "white" }}>
											Total Amount (L.E.)
										</h5>
										<CountUp
											style={{ color: "white" }}
											duration='3'
											delay={1}
											end={ArrayOfAmount}
											separator=','
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					{dataTable()}
				</div>
			</div>
		</OrdersHistWrapper>
	);
};

export default OrdersHist;

const OrdersHistWrapper = styled.div`
	min-height: 880px;
	/* overflow-x: hidden; */
	/* background: #ededed; */

	.grid-container {
		display: grid;
		grid-template-columns: ${(props) =>
			props.show ? "8% 92%" : "15.5% 84.5%"};
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

	tr:hover {
		background: #009ef7 !important;
		color: white !important;
		font-weight: bolder !important;
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
