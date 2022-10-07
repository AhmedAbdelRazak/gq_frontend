/** @format */

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

const OrdersList = () => {
	const [allOrders, setAllOrders] = useState([]);
	const [q, setQ] = useState("");
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [offset, setOffset] = useState(0);
	const [pageScrolled, setPageScrolled] = useState(false);
	const [collapsed, setCollapsed] = useState(false);

	//pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [postsPerPage, setPostsPerPage] = useState(100);

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
				setAllOrders(
					data
						.filter(
							(i) =>
								i.status !== "Delivered" &&
								i.status !== "Shipped" &&
								i.status !== "Cancelled" &&
								i.invoiceNumber === "Not Added",
						)
						.sort(sortOrdersAscendingly),
				);
			}
		});
	};

	useEffect(() => {
		loadOrders();
		// eslint-disable-next-line
	}, []);

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

	const handleInvoiceStatus = (invoiceNumber, orderId) => {
		updateOrderInvoice(user._id, token, orderId, invoiceNumber).then((data) => {
			if (data.error) {
				console.log("Status update failed");
			} else {
				window.location.reload(false);
			}
		});
	};

	const dataTable = () => {
		return (
			<div className='tableData'>
				{allOrders && allOrders.length === 0 ? (
					<div
						className='text-center mt-5'
						style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
						No Un-invoiced Orders Available
					</div>
				) : (
					<>
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
									<th scope='col'>Order #</th>
									<th scope='col'>INV #</th>
									<th scope='col'>Customer Name</th>
									<th scope='col'>Customer Phone</th>
									<th scope='col'>Purchase Date</th>
									<th scope='col'>Status</th>
									<th scope='col'>Governorate</th>
									<th scope='col'>City</th>
									<th scope='col'>Shipping Carrier</th>
									<th scope='col'>Tracking #</th>
									<th scope='col'>Ordered By</th>
									<th scope='col'>Amount</th>
									<th scope='col'>Ordered Qty</th>
									<th scope='col'>Return Order..?</th>
								</tr>
							</thead>

							<tbody className='my-auto'>
								{search(allOrders).map((s, i) => (
									<tr key={i} className=''>
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

										<td>{s.customerDetails.fullName}</td>
										<td>{s.customerDetails.phone}</td>
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
										{s.invoiceNumber === "Not Added" ? (
											<Link
												to={`#`}
												onClick={() => {
													var today = new Date().toDateString("en-US", {
														timeZone: "Africa/Cairo",
													});

													var invoiceNumber = `INV${new Date(
														today,
													).getFullYear()}${
														new Date(today).getMonth() + 1
													}${new Date(today).getDate()}000${
														allOrders.length - i
													}`;
													handleInvoiceStatus(invoiceNumber, s._id);
												}}>
												<td
													style={{
														color: "darkred",
														fontWeight: "bold",
														cursor: "pointer",
													}}>
													Invoice This Order
												</td>
											</Link>
										) : (
											<td
												style={{
													color: "darkgreen",
													fontWeight: "bold",
												}}>
												Order Already Invoiced
											</td>
										)}

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
		<OrdersListWrapper show={AdminMenuStatus}>
			{!collapsed ? (
				<DarkBG collapsed={collapsed} setCollapsed={setCollapsed} />
			) : null}
			<div className='grid-container'>
				<div className=''>
					<AdminMenu
						fromPage='OrdersList'
						AdminMenuStatus={AdminMenuStatus}
						setAdminMenuStatus={setAdminMenuStatus}
						collapsed={collapsed}
						setCollapsed={setCollapsed}
					/>
				</div>
				<div className='mainContent'>
					<Navbar fromPage='OrdersList' pageScrolled={pageScrolled} />

					<div className='mt-5 mx-3'> {dataTable()}</div>
				</div>
			</div>
		</OrdersListWrapper>
	);
};

export default OrdersList;

const OrdersListWrapper = styled.div`
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