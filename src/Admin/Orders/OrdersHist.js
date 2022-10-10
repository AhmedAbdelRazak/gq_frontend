/** @format */

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { isAuthenticated } from "../../auth";
import AdminMenu from "../AdminMenu/AdminMenu";
import Navbar from "../AdminNavMenu/Navbar";
import CountUp from "react-countup";
import { listOrders, removeOrder } from "../apiAdmin";
import { Link } from "react-router-dom";
import DarkBG from "../AdminMenu/DarkBG";
import { toast } from "react-toastify";

const OrdersHist = () => {
	const [allOrders, setAllOrders] = useState([]);
	const [q, setQ] = useState("");
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [offset, setOffset] = useState(0);
	const [pageScrolled, setPageScrolled] = useState(false);
	const [collapsed, setCollapsed] = useState(false);

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

	// "Cancelled to returned to stock"
	// "INV # INVYEARMONTHDAYSERIES AS Invoice #"
	// "Add OT to Order # should be in another page"
	// "If OT into INV and only show INV #"
	// "Hover to side menu"
	// "Return Exchange"
	// "Main Dashboard last 7 days, 30 days, ...."
	// "Time zone difference"
	// "Summary of order status chart in a table format"
	// "Status color code changing and only code the status column"

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

	const handleRemove = (orderId) => {
		if (window.confirm("Are You Sure You Want To Delete?")) {
			removeOrder(orderId, user._id, token)
				.then((res) => {
					toast.error(`Order "${res.data.name}" deleted`);
					setTimeout(function () {
						window.location.reload(false);
					}, 2500);
				})
				.catch((err) => console.log(err));
		}
	};

	const dataTable = () => {
		return (
			<div className='tableData'>
				<div className='mt-4'>
					<Link className='btn btn-info' to='/admin/create-new-order'>
						Create New Order
					</Link>
				</div>
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
					className='table table-bordered table-md-responsive table-hover text-center'
					style={{ fontSize: "0.75rem" }}>
					<thead className='thead-light'>
						<tr>
							{/* <th scope='col'>Order #</th> */}
							<th scope='col'>Purchase Date</th>
							{/* <th scope='col'>Order #</th> */}
							<th scope='col'>INV #</th>
							<th scope='col'>Status</th>
							<th scope='col'>Name</th>
							<th scope='col'>Phone</th>
							<th scope='col'>Amount</th>
							<th scope='col'>Store</th>
							<th scope='col' style={{ width: "6%" }}>
								Taker
							</th>
							<th scope='col'>Governorate</th>
							{/* <th scope='col'>City</th> */}
							<th scope='col'>Carrier</th>
							<th scope='col'>Tracking #</th>
							<th scope='col'>Quantity</th>
							<th scope='col' style={{ width: "8%" }}>
								More Details
							</th>
							<th scope='col'>Shipping?</th>
							<th scope='col'>Delete?</th>
						</tr>
					</thead>

					<tbody className='my-auto'>
						{search(allOrders).map((s, i) => (
							<tr key={i} className=''>
								{/* {s.OTNumber && s.OTNumber !== "Not Added" ? (
									<td className='my-auto'>{s.OTNumber}</td>
								) : (
									<td className='my-auto'>{`OT${new Date(
										s.createdAt,
									).getFullYear()}${
										new Date(s.createdAt).getMonth() + 1
									}${new Date(s.createdAt).getDate()}000${
										allOrders.length - i
									}`}</td>
								)} */}

								<td style={{ width: "8%" }}>
									{new Date(s.createdAt).toDateString()}{" "}
								</td>
								{/* {s.OTNumber && s.OTNumber !== "Not Added" ? (
									<td className='my-auto'>{s.OTNumber}</td>
								) : (
									<td className='my-auto'>{`OT${new Date(
										s.createdAt,
									).getFullYear()}${
										new Date(s.createdAt).getMonth() + 1
									}${new Date(s.createdAt).getDate()}000${
										allOrders.length - i
									}`}</td>
								)} */}
								<td
									style={{
										width: "10%",
										background:
											s.invoiceNumber === "Not Added" ? "#f4e4e4" : "",
									}}>
									{s.invoiceNumber}
								</td>
								<td
									style={{
										fontWeight: "bold",
										fontSize: "0.77rem",
										width: "8.5%",
										background:
											s.status.includes("Delivered") ||
											s.status.includes("Shipped")
												? "#004b00"
												: s.status === "Cancelled"
												? "darkred"
												: s.status.includes("Ready To Ship")
												? "#bbffbb"
												: "#e2e2e2",
										color:
											s.status.includes("Delivered") ||
											s.status.includes("Shipped")
												? "white"
												: s.status.includes("Cancelled")
												? "white"
												: "black",
									}}>
									{s.status}
								</td>

								<td style={{ width: "11%" }}>{s.customerDetails.fullName}</td>
								<td>{s.customerDetails.phone}</td>
								<td>{s.totalAmountAfterDiscount.toFixed(0)} L.E.</td>
								<td style={{ textTransform: "uppercase" }}>{s.orderSource}</td>
								<td>{s.employeeData.name}</td>
								<td>{s.customerDetails.state}</td>
								{/* <td>{s.customerDetails.cityName}</td> */}
								<td style={{ width: "8%" }}>
									{s.chosenShippingOption[0].carrierName}
								</td>
								<td style={{ width: "8%" }}>
									{s.trackingNumber ? s.trackingNumber : "Not Added"}
								</td>
								<td>{s.totalOrderQty}</td>
								<td
									style={{
										color: "blue",
										fontWeight: "bold",
										cursor: "pointer",
									}}>
									<Link to={`/admin/single-order/${s._id}`}>Show More....</Link>
								</td>

								<td
									style={{
										cursor: "pointer",
										fontSize: "10px,",
										width: "8%",
									}}>
									<Link to={`#`}>Create Shipping</Link>
								</td>

								<td
									onClick={() => {
										handleRemove(s._id);
										setTimeout(function () {
											window.location.reload(false);
										}, 1000);
									}}
									style={{
										color: "red",
										fontWeight: "bold",
										cursor: "pointer",
									}}>
									Delete?
								</td>

								{/* <td>{Invoice(s)}</td> */}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
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
		<OrdersHistWrapper show={AdminMenuStatus}>
			{!collapsed ? (
				<DarkBG collapsed={collapsed} setCollapsed={setCollapsed} />
			) : null}
			<div className='grid-container'>
				<div className=''>
					<AdminMenu
						fromPage='OrdersHist'
						AdminMenuStatus={AdminMenuStatus}
						setAdminMenuStatus={setAdminMenuStatus}
						collapsed={collapsed}
						setCollapsed={setCollapsed}
					/>
				</div>
				<div className='mainContent'>
					<Navbar fromPage='OrdersHist' pageScrolled={pageScrolled} />
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
		grid-template-columns: ${(props) => (props.show ? "8% 92%" : "15% 84.5%")};
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
		/* font-weight: bolder !important; */
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

	@media (max-width: 750px) {
		.grid-container {
			display: grid;
			/* grid-template-columns: 16% 84%; */
			grid-template-columns: ${(props) => (props.show ? "0% 99%" : "0% 100%")};
			margin: auto;
			/* border: 1px solid red; */
			/* grid-auto-rows: minmax(60px, auto); */
		}
		h3 {
			margin-top: 60px !important;
		}

		.rightContentWrapper {
			margin-top: 20px;
			margin-left: ${(props) => (props.show ? "0px" : "20px")};
		}
	}
`;
