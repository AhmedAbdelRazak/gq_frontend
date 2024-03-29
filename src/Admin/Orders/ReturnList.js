/** @format */

import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";
import {isAuthenticated} from "../../auth";
import AdminMenu from "../AdminMenu/AdminMenu";
import DarkBG from "../AdminMenu/DarkBG";
import Navbar from "../AdminNavMenu/Navbar";
import {listOrdersReturn, updateOrderInvoice} from "../apiAdmin";
// eslint-disable-next-line
import Pagination from "./Pagination";
import ReactExport from "react-export-excel";
import moment from "moment";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const ReturnList = () => {
	const [allOrders, setAllOrders] = useState([]);
	const [q, setQ] = useState("");
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [offset, setOffset] = useState(0);
	const [pageScrolled, setPageScrolled] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	const [excelDataSet, setExcelDataSet] = useState([]);

	//pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [postsPerPage, setPostsPerPage] = useState(100);

	const {user, token} = isAuthenticated();

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
			const TotalAppointmentsA = a.returnDate ? a.returnDate : a.updatedAt;
			const TotalAppointmentsB = b.returnDate ? b.returnDate : b.updatedAt;
			let comparison = 0;
			if (TotalAppointmentsA < TotalAppointmentsB) {
				comparison = 1;
			} else if (TotalAppointmentsA >= TotalAppointmentsB) {
				comparison = -1;
			}
			return comparison;
		}
		listOrdersReturn(user._id, token).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllOrders(data.sort(sortOrdersAscendingly));
				setExcelDataSet(data.sort(sortOrdersAscendingly));
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
		window.addEventListener("scroll", onScroll, {passive: true});
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
				row.trackingNumber.toString().toLowerCase().indexOf(q) > -1
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

	var adjustedExcelData =
		excelDataSet &&
		excelDataSet.map((i, counter) => {
			var descriptionChecker = i.chosenProductQtyWithVariables.map((iii) =>
				iii.map(
					(iiii) => "SKU: " + iiii.SubSKU + ", Qty: " + iiii.OrderedQty
					// "  /  " +
					// iiii.productName,
				)
			);

			var merged = [].concat.apply([], descriptionChecker);
			var merged2 = [].concat.apply([], merged);

			var gettingTotalAmount = Number(
				Number(i.totalAmountAfterDiscount) +
					(Number(i.totalAmount) - Number(i.shippingFees)) * 0.01
			).toFixed(2);

			return {
				Index: counter + 1,
				Name: i.customerDetails.fullName,
				address: i.customerDetails.address,
				phone1: i.customerDetails.phone,
				phone2: "",
				City: i.customerDetails.cityName.toUpperCase(),
				returnDate: i.returnDate
					? moment(i.returnDate).format("DD/MM/YYYY")
					: moment(i.updatedAt).format("DD/MM/YYYY"),
				DescriptionOfGoods:
					merged2.length === 1
						? merged2[0]
						: merged2.length === 2
						? merged2[0] + " | " + merged2[1]
						: merged2.length === 3
						? merged2[0] + " | " + merged2[1] + " | " + merged2[2]
						: merged2[0],
				totalAmount: gettingTotalAmount,
				returnAmount: i.returnAmount.toFixed(0),
				ReferenceNumber:
					i.invoiceNumber !== "Not Added" ? i.invoiceNumber : i.OTNumber,
				parcels: 1,
				comment: i.customerDetails.orderComment
					? i.customerDetails.orderComment
					: ".",
				company: i.orderSource.toUpperCase(),
				email: "gqcanihelpyou@gmail.com",
				weight: 1,
			};
		});

	const DownloadExcel = () => {
		return (
			<ExcelFile
				filename={`GQ_Return_List_ ${new Date().toLocaleString("en-US", {
					timeZone: "Africa/Cairo",
				})}`}
				element={
					<Link
						className='btn btn-danger mr-5 ml-2'
						// onClick={() => exportPDF()}
						to='#'
					>
						Download Report (Excel)
					</Link>
				}
			>
				<ExcelSheet data={adjustedExcelData} name='GQ_Orders'>
					<ExcelColumn label='#' value='Index' />
					<ExcelColumn label='Name' value='Name' />
					<ExcelColumn label='Address' value='address' />
					<ExcelColumn label='Phone' value='phone1' />
					<ExcelColumn label='Phone2' value='phone2' />
					<ExcelColumn label='City' value='City' />
					<ExcelColumn label='Return Date' value='returnDate' />
					<ExcelColumn
						label='Description Of Goods'
						value='DescriptionOfGoods'
					/>
					<ExcelColumn label='Cod' value='totalAmount' />
					<ExcelColumn label='Refund Amount' value='returnAmount' />
					<ExcelColumn label='Refrance number' value='ReferenceNumber' />
					<ExcelColumn label='Pieces' value='pieces' />
					<ExcelColumn label='Comment' value='comment' />
					<ExcelColumn label='Company' value='company' />
					<ExcelColumn label='Email' value='email' />
					<ExcelColumn label='Weight' value='weight' />
				</ExcelSheet>
			</ExcelFile>
		);
	};

	const dataTable = () => {
		return (
			<div className='tableData'>
				{allOrders && allOrders.length === 0 ? (
					<div
						className='text-center mt-5'
						style={{fontSize: "1.2rem", fontWeight: "bold"}}
					>
						No Return Orders Available
					</div>
				) : (
					<>
						<div>
							<Link
								className='btn btn-info ml-2'
								to='/admin/exchange-or-return'
							>
								New Return
							</Link>
						</div>
						<div className='mt-4'>{DownloadExcel()}</div>

						<div className='form-group text-right'>
							<label
								className='mt-3 mx-3'
								style={{
									fontWeight: "bold",
									fontSize: "1.05rem",
									color: "black",
									borderRadius: "20px",
								}}
							>
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
								style={{borderRadius: "20px", width: "50%"}}
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
							style={{fontSize: "0.75rem"}}
						>
							<thead className='thead-light'>
								<tr>
									<th scope='col'>Purchase Date</th>
									<th scope='col'>Return Date</th>
									<th scope='col'>INV #</th>
									<th scope='col'>Status</th>
									<th scope='col'>Name</th>
									<th scope='col'>Phone</th>
									<th scope='col'>Amount</th>
									<th scope='col'>Return Amount</th>
									<th scope='col'>Store</th>
									<th scope='col'>Taker</th>
									<th scope='col'>Governorate</th>
									{/* <th scope='col'>City</th> */}
									<th scope='col'>Shipping Carrier</th>
									<th scope='col'>Tracking #</th>
									<th scope='col'>Qty</th>
									<th scope='col'>More...</th>
								</tr>
							</thead>

							<tbody className='my-auto'>
								{search(allOrders).map((s, i) => (
									<tr key={i} className=''>
										<td>{new Date(s.orderCreationDate).toDateString()}</td>
										<td>
											{s.returnDate
												? new Date(s.returnDate).toDateString()
												: new Date(s.updatedAt).toDateString()}
										</td>
										<td
											style={{
												width: "10%",
												background:
													s.invoiceNumber === "Not Added" ? "#f4e4e4" : "",
											}}
										>
											{s.invoiceNumber}
										</td>
										<td
											style={{
												fontWeight: "bold",
												// fontSize: "0.8rem",
												width: "8.5%",
												background:
													s.status === "Returned and Refunded" ||
													s.status ===
														"Exchange And Return Processed And Stocked"
														? "#004b00"
														: s.status === "Returned and Not Refunded"
														? "darkred"
														: "#003264",
												color:
													s.status === "Delivered" || s.status === "Shipped"
														? "white"
														: s.status === "Cancelled"
														? "white"
														: "white",
											}}
										>
											{s.status}
										</td>

										<td style={{width: "9%"}}>{s.customerDetails.fullName}</td>
										<td>{s.customerDetails.phone}</td>
										<td>{s.totalAmountAfterDiscount.toFixed(0)} L.E.</td>
										<td style={{width: "7.8%"}}>
											{s.returnAmount.toFixed(0)} L.E.
										</td>
										<td style={{textTransform: "uppercase"}}>
											{s.orderSource}
										</td>
										<td>{s.employeeData.name}</td>
										<td>{s.customerDetails.state}</td>
										{/* <td>{s.customerDetails.cityName}</td> */}
										<td style={{width: "8%"}}>
											{s.chosenShippingOption &&
												s.chosenShippingOption[0] &&
												s.chosenShippingOption[0].carrierName}
										</td>
										<td style={{width: "8%"}}>
											{s.trackingNumber ? s.trackingNumber : "Not Added"}
										</td>
										<td>{s.totalOrderQty}</td>
										<td>
											<Link to={`/admin/single-order/${s._id}`}>
												Details...
											</Link>
										</td>

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
