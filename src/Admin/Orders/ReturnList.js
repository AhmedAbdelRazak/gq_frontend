/** @format */

import { ArrowDownOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { isAuthenticated } from "../../auth";
import AdminMenu from "../AdminMenu/AdminMenu";
import DarkBG from "../AdminMenu/DarkBG";
import Navbar from "../AdminNavMenu/Navbar";
import { listOrders, updateOrderInvoice } from "../apiAdmin";
// eslint-disable-next-line
import Pagination from "./Pagination";

const ReturnList = () => {
	const [allOrders, setAllOrders] = useState([]);
	const [q, setQ] = useState("");
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [offset, setOffset] = useState(0);
	const [pageScrolled, setPageScrolled] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	const [filtersClick, setFiltersClick] = useState(false);
	const [clickedFilter, setClickedFilter] = useState("Select All");

	//pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [postsPerPage, setPostsPerPage] = useState(100);

	const { user, token } = isAuthenticated();

	var today = new Date().toDateString("en-US", {
		timeZone: "Africa/Cairo",
	});

	var yesterday = new Date();
	var last7Days = new Date();
	var last30Days = new Date();

	yesterday.setDate(yesterday.getDate() - 1);
	last7Days.setDate(last7Days.getDate() - 10);
	last30Days.setDate(last30Days.getDate() - 30);

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
				if (clickedFilter === "Select All") {
					setAllOrders(
						data
							.filter(
								(i) =>
									i.status !== "Delivered" &&
									i.status !== "Shipped" &&
									i.status !== "Cancelled" &&
									i.status !== "In Processing" &&
									i.status !== "Ready To Ship" &&
									i.status.includes("Return"),
							)
							.sort(sortOrdersAscendingly),
					);
				} else if (clickedFilter === "Today") {
					setAllOrders(
						data
							.filter(
								(i) =>
									i.status !== "Delivered" &&
									i.status !== "Shipped" &&
									i.status !== "Cancelled" &&
									i.status !== "In Processing" &&
									i.status !== "Ready To Ship" &&
									i.status.includes("Return") &&
									new Date(i.createdAt).setHours(0, 0, 0, 0) ===
										new Date(today).setHours(0, 0, 0, 0),
							)
							.sort(sortOrdersAscendingly),
					);
				} else if (clickedFilter === "Yesterday") {
					setAllOrders(
						data
							.filter(
								(i) =>
									i.status !== "Delivered" &&
									i.status !== "Shipped" &&
									i.status !== "Cancelled" &&
									i.status !== "In Processing" &&
									i.status !== "Ready To Ship" &&
									i.status.includes("Return") &&
									new Date(i.createdAt).setHours(0, 0, 0, 0) ===
										new Date(yesterday).setHours(0, 0, 0, 0),
							)
							.sort(sortOrdersAscendingly),
					);
				} else if (clickedFilter === "Last7Days") {
					setAllOrders(
						data
							.filter(
								(i) =>
									i.status !== "Delivered" &&
									i.status !== "Shipped" &&
									i.status !== "Cancelled" &&
									i.status !== "In Processing" &&
									i.status !== "Ready To Ship" &&
									i.status.includes("Return") &&
									new Date(i.createdAt).setHours(0, 0, 0, 0) >=
										new Date(last7Days).setHours(0, 0, 0, 0),
							)
							.sort(sortOrdersAscendingly),
					);
				} else {
					setAllOrders(
						data
							.filter(
								(i) =>
									i.status !== "Delivered" &&
									i.status !== "Shipped" &&
									i.status !== "Cancelled" &&
									i.status !== "In Processing" &&
									i.status !== "Ready To Ship" &&
									i.status.includes("Return"),
							)
							.sort(sortOrdersAscendingly),
					);
				}
			}
		});
	};

	useEffect(() => {
		loadOrders();
		// eslint-disable-next-line
	}, [clickedFilter]);

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
				row.invoiceNumber.toString().toLowerCase().indexOf(q) > -1 ||
				row.trackingNumber.toString().toLowerCase().indexOf(q) > -1 ||
				row.chosenShippingOption[0].carrierName
					.toString()
					.toLowerCase()
					.indexOf(q) > -1
			);
		});
	}

	const indexOfLastPost = currentPage * postsPerPage;
	const indexOfFirstPost = indexOfLastPost - postsPerPage;
	// eslint-disable-next-line
	const currentPosts =
		allOrders && allOrders.slice(indexOfFirstPost, indexOfLastPost);

	// eslint-disable-next-line
	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	// eslint-disable-next-line
	const handleInvoiceStatus = (invoiceNumber, orderId) => {
		updateOrderInvoice(user._id, token, orderId, invoiceNumber).then((data) => {
			if (data.error) {
				console.log("Status update failed");
			} else {
				window.location.reload(false);
			}
		});
	};

	// How much was refunded
	// return comment
	// Refund Method (CIB, Electronic Wallet, Bank Trans, In Cash, Others)
	// Required Refunded Amount
	// photo sku photo
	// final exchange status exchange
	// free shipping button in create new order
	// tick for 0 product
	// change colors of each status
	// insert date for new orders

	const dataTable = () => {
		return (
			<div className='tableData'>
				{allOrders && allOrders.length === 0 ? (
					<div
						className='text-center mt-5'
						style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
						No Return Orders Available
					</div>
				) : (
					<>
						<div>
							<Link className='btn btn-info' to='/admin/order-return'>
								New Return
							</Link>
						</div>

						<div className='form-group text-right'>
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
								className='p-2 my-2 '
								type='text'
								value={q}
								onChange={(e) => {
									setQ(e.target.value.toLowerCase());

									if (e.target.value.length > 0) {
										setPostsPerPage(allOrders.length + 2);
									} else {
										setPostsPerPage(100);
									}
								}}
								placeholder='Search By Client Phone, Client Name, Status Or Carrier'
								style={{ borderRadius: "20px", width: "50%" }}
							/>
							<div
								className='mb-5 text-center ml-5'
								style={{ fontWeight: "bolder", color: "#808080" }}>
								Filters
								<span
									style={{
										fontSize: "12px",
										fontWeight: "bold",
										cursor: "pointer",
									}}
									onClick={() => {
										setFiltersClick(!filtersClick);
									}}>
									<ArrowDownOutlined />
								</span>
								{filtersClick ? (
									<ul className='filterListWrapper'>
										<li
											className='filters-item'
											onClick={() => {
												setClickedFilter("Select All");
											}}>
											Select All
										</li>
										<li
											className='filters-item'
											onClick={() => {
												setClickedFilter("Today");
											}}>
											Today
										</li>
										<li
											className='filters-item'
											onClick={() => {
												setClickedFilter("Yesterday");
											}}>
											Yesteryday
										</li>
										<li
											className='filters-item'
											onClick={() => {
												setClickedFilter("Last7Days");
											}}>
											Last 7 Days
										</li>
										<li
											className='filters-item'
											onClick={() => {
												setClickedFilter("Last30Days");
											}}>
											Last 30 Days
										</li>
										<li className='filters-item'>Custom Date</li>
									</ul>
								) : null}
							</div>
						</div>

						{/* <Pagination
					postsPerPage={postsPerPage}
					totalPosts={allOrders.length}
					paginate={paginate}
					currentPage={currentPage}
				/> */}
						<table
							className='table table-bordered table-md-responsive table-hover text-center'
							style={{ fontSize: "0.75rem" }}>
							<thead className='thead-light'>
								<tr>
									<th scope='col'>Purchase Date</th>
									<th scope='col'>Order #</th>
									<th scope='col'>INV #</th>
									<th scope='col'>Status</th>
									<th scope='col'>Name</th>
									<th scope='col'>Phone</th>
									<th scope='col'>Amount</th>
									<th scope='col'>Store</th>
									<th scope='col'>Taker</th>
									<th scope='col'>Governorate</th>
									{/* <th scope='col'>City</th> */}
									<th scope='col'>Shipping Carrier</th>
									<th scope='col'>Tracking #</th>
									<th scope='col'>Ordered Qty</th>
								</tr>
							</thead>

							<tbody className='my-auto'>
								{search(allOrders).map((s, i) => (
									<tr key={i} className=''>
										<td style={{ width: "8%" }}>
											{new Date(s.createdAt).toDateString()}{" "}
										</td>
										{s.OTNumber && s.OTNumber !== "Not Added" ? (
											<td className='my-auto'>{s.OTNumber}</td>
										) : (
											<td className='my-auto'>{`OT${new Date(
												s.createdAt,
											).getFullYear()}${
												new Date(s.createdAt).getMonth() + 1
											}${new Date(s.createdAt).getDate()}000${
												allOrders.length - i
											}`}</td>
										)}
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

										<td style={{ width: "11%" }}>
											{s.customerDetails.fullName}
										</td>
										<td>{s.customerDetails.phone}</td>
										<td>{s.totalAmountAfterDiscount.toFixed(0)} L.E.</td>
										<td style={{ textTransform: "uppercase" }}>
											{s.orderSource}
										</td>
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

										{/* <td>{Invoice(s)}</td> */}
									</tr>
								))}
							</tbody>
						</table>
					</>
				)}
			</div>
		);
	};

	return (
		<ReturnListWrapper show={AdminMenuStatus}>
			{!collapsed ? (
				<DarkBG collapsed={collapsed} setCollapsed={setCollapsed} />
			) : null}
			<div className='grid-container'>
				<div className=''>
					<AdminMenu
						fromPage='ReturnList'
						AdminMenuStatus={AdminMenuStatus}
						setAdminMenuStatus={setAdminMenuStatus}
						collapsed={collapsed}
						setCollapsed={setCollapsed}
					/>
				</div>
				<div className='mainContent'>
					<Navbar fromPage='ReturnList' pageScrolled={pageScrolled} />

					<div className='mt-5 mx-3'> {dataTable()}</div>
				</div>
			</div>
		</ReturnListWrapper>
	);
};

export default ReturnList;

const ReturnListWrapper = styled.div`
	min-height: 880px;
	/* overflow-x: hidden; */
	/* background: #ededed; */

	.grid-container {
		display: grid;
		grid-template-columns: ${(props) => (props.show ? "8% 92%" : "15% 84.8%")};
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

	.filterListWrapper {
		list-style: none;
		font-size: 11px;
		font-weight: none;
		color: #808080;
		cursor: pointer;
	}

	.filters-item {
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
