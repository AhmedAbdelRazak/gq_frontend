/** @format */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { isAuthenticated } from "../../auth";
import AdminMenu from "../AdminMenu/AdminMenu";
import DarkBG from "../AdminMenu/DarkBG";
import Navbar from "../AdminNavMenu/Navbar";
import {
	getProducts,
	listOrdersProcessing,
	updateOrderInvoice,
} from "../apiAdmin";
// eslint-disable-next-line
import Pagination from "./Pagination";
import CountUp from "react-countup";

const OrdersList = () => {
	const [allOrders, setAllOrders] = useState([]);
	const [q, setQ] = useState("");
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [offset, setOffset] = useState(0);
	const [pageScrolled, setPageScrolled] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	const [allProducts, setAllProducts] = useState([]);

	//pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [postsPerPage, setPostsPerPage] = useState(100);

	const { user, token } = isAuthenticated();

	// eslint-disable-next-line
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
			const TotalAppointmentsA = a.invoiceNumber;
			const TotalAppointmentsB = b.invoiceNumber;
			let comparison = 0;
			if (TotalAppointmentsA < TotalAppointmentsB) {
				comparison = 1;
			} else if (TotalAppointmentsA > TotalAppointmentsB) {
				comparison = -1;
			}
			return comparison;
		}
		listOrdersProcessing(user._id, token).then((data) => {
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
						<div>
							<Link className='btn btn-info' to='/admin/create-new-order'>
								Create New Order
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
						</div>

						<Pagination
							postsPerPage={postsPerPage}
							totalPosts={allOrders.length}
							paginate={paginate}
							currentPage={currentPage}
						/>
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
									<th scope='col'>Carrier</th>
									<th scope='col'>Tracking #</th>
									<th scope='col'>Quantity</th>
									<th scope='col'>Invoice?</th>
									<th scope='col'>Details?</th>
								</tr>
							</thead>

							<tbody className='my-auto'>
								{search(currentPosts).map((s, i) => {
									const checkingWithLiveStock = (
										productId,
										SubSKU,
										OrderedQty,
									) => {
										const pickedSub =
											allProducts &&
											allProducts.filter((iii) => iii._id === productId)[0];

										const GetSpecificSubSKU =
											pickedSub.productAttributes.filter(
												(iii) => iii.SubSKU === SubSKU,
											)[0];
										const QtyChecker =
											GetSpecificSubSKU &&
											GetSpecificSubSKU.quantity < OrderedQty;

										return QtyChecker;
									};

									var stockCheckHelper = s.chosenProductQtyWithVariables.map(
										(iii) =>
											iii.map((iiii) =>
												checkingWithLiveStock(
													iiii.productId,
													iiii.SubSKU,
													iiii.OrderedQty,
												),
											),
									);
									var merged = [].concat.apply([], stockCheckHelper);
									var finalChecker =
										merged.indexOf(true) === -1 ? "Passed" : "Failed";
									return (
										<tr key={i} className=''>
											{s.orderCreationDate ? (
												<td style={{ width: "8%" }}>
													{new Date(s.orderCreationDate).toDateString()}{" "}
												</td>
											) : (
												<td style={{ width: "8%" }}>
													{new Date(s.createdAt).toDateString()}{" "}
												</td>
											)}

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
														finalChecker === "Failed"
															? "darkred"
															: s.status === "Delivered" ||
															  s.status === "Shipped"
															? "#004b00"
															: s.status === "Cancelled"
															? "darkred"
															: "#ffffd8",
													color:
														finalChecker === "Failed"
															? "white"
															: s.status === "Delivered" ||
															  s.status === "Shipped"
															? "white"
															: s.status === "Cancelled"
															? "white"
															: "black",
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

											{s.invoiceNumber === "Not Added" ? (
												<td
													style={{
														color: "darkred",
														fontWeight: "bold",
														cursor: "pointer",
														width: "8%",
													}}>
													{finalChecker === "Passed" ? (
														<Link
															to={`#`}
															onClick={() => {
																var today = new Date().toDateString("en-US", {
																	timeZone: "Africa/Cairo",
																});

																let text = s.OTNumber;
																let result = "INV" + text.slice(2);

																var invoiceNumber =
																	s.OTNumber === "Not Added"
																		? `INV${new Date(today).getFullYear()}${
																				new Date(today).getMonth() + 1
																		  }${new Date(today).getDate()}000${
																				allOrders.length - i
																		  }`
																		: result;
																handleInvoiceStatus(invoiceNumber, s._id);
															}}>
															Invoice
														</Link>
													) : (
														<Link to={`#`} style={{ color: "darkred" }}>
															No Enough Stock
														</Link>
													)}
												</td>
											) : (
												<td
													style={{
														color: "darkgreen",
														fontWeight: "bold",
													}}>
													Order Already Invoiced
												</td>
											)}

											<td
												style={{
													color: "blue",
													fontWeight: "bold",
													cursor: "pointer",
												}}>
												<Link to={`/admin/single-order/${s._id}`}>
													Details....
												</Link>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</>
				)}
			</div>
		);
	};

	const overallQtyArray = allOrders && allOrders.map((i) => i.totalOrderQty);

	const ArrayOfQty = overallQtyArray.reduce((a, b) => a + b, 0);

	const overallAmountArray =
		allOrders && allOrders.map((i) => i.totalAmountAfterDiscount);

	const ArrayOfAmount = overallAmountArray.reduce((a, b) => a + b, 0);

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

					<h3 className='mt-5 text-center' style={{ fontWeight: "bolder" }}>
						PENDING ORDERS
					</h3>
					<div className='row mx-5 mt-5'>
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
						{user.userRole === "Order Taker" ? null : (
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
						)}
					</div>
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
		grid-template-columns: ${(props) =>
			props.show ? "8% 92%" : "15.1% 84.9%"};
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
		background: #e3f5ff !important;
		color: black !important;
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
