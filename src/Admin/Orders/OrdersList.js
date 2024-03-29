/** @format */

import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";
import {isAuthenticated} from "../../auth";
import AdminMenu from "../AdminMenu/AdminMenu";
import DarkBG from "../AdminMenu/DarkBG";
import Navbar from "../AdminNavMenu/Navbar";
import {
	// eslint-disable-next-line
	CreateShippingTN,
	getColors,
	getProducts,
	listOrdersProcessing,
	ordersLength,
	updateOrderInvoice,
	updateOrderInvoiceStock,
} from "../apiAdmin";
// eslint-disable-next-line
import Pagination from "./Pagination";
import CountUp from "react-countup";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ReactExport from "react-export-excel";
import CreateShippingModal from "./UpdateModals/CreateShippingModal";
import moment from "moment";
// import ExcelToJson from "./ExcelToJson";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const OrdersList = () => {
	const [allOrders, setAllOrders] = useState([]);
	const [q, setQ] = useState("");
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [offset, setOffset] = useState(0);
	const [pageScrolled, setPageScrolled] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	const [allProducts, setAllProducts] = useState([]);
	const [lengthOfOrders, setLengthOfOrders] = useState(0);
	const [backorders, setBackorders] = useState("NotClicked");
	const [modalVisible, setModalVisible] = useState(false);
	const [updateCustomerDetails, setUpdateCustomerDetails] = useState("");
	const [pickedOrder, setPickedOrder] = useState("");
	const [excelDataSet, setExcelDataSet] = useState([]);
	const [allColors, setAllColors] = useState([]);

	// eslint-disable-next-line
	const [aramexResponse, setAramexResponse] = useState("");

	//pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [postsPerPage, setPostsPerPage] = useState(100);

	const {user, token} = isAuthenticated();

	// eslint-disable-next-line
	var today = new Date();

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
				var ordersModified = data.filter(
					(i) =>
						i.status !== "In Transit | Rejected" &&
						!i.status.includes("Return") &&
						!i.status.includes("Exchange")
				);
				if (backorders === "Clicked") {
					getProducts().then((data2) => {
						if (data2.error) {
							console.log(data2.error);
						} else {
							const checkingWithLiveStock = (
								productId,
								SubSKU,
								OrderedQty,
								status
							) => {
								if (
									status === "In Processing" ||
									status === "On Hold" ||
									status === "Ready To Ship"
								) {
									const pickedSub =
										data2 && data2.filter((iii) => iii._id === productId)[0];

									const GetSpecificSubSKU =
										pickedSub &&
										pickedSub.productAttributes &&
										pickedSub.productAttributes.filter(
											(iii) => iii.SubSKU === SubSKU
										)[0];
									const QtyChecker =
										GetSpecificSubSKU &&
										GetSpecificSubSKU.quantity < OrderedQty;

									return QtyChecker;
								}
							};

							var stockCheckHelper = ordersModified.map((i) =>
								i.chosenProductQtyWithVariables.map((ii) =>
									ii.map((iii) =>
										checkingWithLiveStock(
											iii.productId,
											iii.SubSKU,
											iii.OrderedQty,
											i.status
										)
									)
								)
							);
							// var merged = [].concat.apply([], stockCheckHelper);

							var beforeel = stockCheckHelper.map((i) =>
								i.map((ii) => ii.filter((iii) => iii === true))
							);

							var backordersAll = [];

							for (var i = 0; i < beforeel.length; i++) {
								for (var ii = 0; ii < beforeel[i].length; ii++) {
									if (beforeel[i][ii].indexOf(true) !== -1) {
										backordersAll.push(ordersModified[i]);
									}
								}
							}

							setAllOrders(backordersAll.sort(sortOrdersAscendingly));
							setExcelDataSet(backordersAll.sort(sortOrdersAscendingly));
						}
					});
				} else if (backorders === "Good") {
					getProducts().then((data2) => {
						if (data2.error) {
							console.log(data2.error);
						} else {
							const checkingWithLiveStock = (productId, SubSKU, OrderedQty) => {
								const pickedSub =
									data2 && data2.filter((iii) => iii._id === productId)[0];

								const GetSpecificSubSKU =
									pickedSub &&
									pickedSub.productAttributes &&
									pickedSub.productAttributes.filter(
										(iii) => iii.SubSKU === SubSKU
									)[0];
								const QtyChecker =
									GetSpecificSubSKU && GetSpecificSubSKU.quantity < OrderedQty;

								return QtyChecker;
							};

							var stockCheckHelper = ordersModified.map((i) =>
								i.chosenProductQtyWithVariables.map((ii) =>
									ii.map((iii) =>
										checkingWithLiveStock(
											iii.productId,
											iii.SubSKU,
											iii.OrderedQty
										)
									)
								)
							);
							// var merged = [].concat.apply([], stockCheckHelper);

							var beforeel = stockCheckHelper.map((i) =>
								i.map((ii) => ii.filter((iii) => iii === true))
							);

							var backordersAll = [];

							for (var i = 0; i < beforeel.length; i++) {
								for (var ii = 0; ii < beforeel[i].length; ii++) {
									if (
										beforeel[i][0].indexOf(true) === -1 &&
										beforeel[i].length === 1
									) {
										backordersAll.push(ordersModified[i]);
									} else if (
										beforeel[i][0].indexOf(true) === -1 &&
										beforeel[i].length === 2
									) {
										if (
											beforeel[i][0].indexOf(true) === -1 &&
											beforeel[i][1].indexOf(true) === -1
										) {
											backordersAll.push(ordersModified[i]);
										}
									}
								}
							}

							setAllOrders(backordersAll.sort(sortOrdersAscendingly));
							setExcelDataSet(backordersAll.sort(sortOrdersAscendingly));
						}
					});
				} else if (backorders === "Processing") {
					setAllOrders(
						ordersModified.filter(
							(i) =>
								i.status.includes("Processing") || i.status === "Ready To Ship"
						)
					);
					setExcelDataSet(
						ordersModified.filter(
							(i) =>
								i.status.includes("Processing") || i.status === "Ready To Ship"
						)
					);
				} else {
					setAllOrders(ordersModified.sort(sortOrdersAscendingly));
					setExcelDataSet(ordersModified.sort(sortOrdersAscendingly));
				}
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

	const loadOrdersLength = () => {
		ordersLength(user._id, token).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setLengthOfOrders(data);
			}
		});
	};

	const gettingAllColors = () => {
		getColors(token).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllColors(data);
			}
		});
	};

	useEffect(() => {
		loadOrders();
		gettingAllProducts();
		loadOrdersLength();
		gettingAllColors();
		// eslint-disable-next-line
	}, [backorders]);

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
				row.OTNumber.toString().toLowerCase().indexOf(q) > -1 ||
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

	const handleInvoiceStatus = (
		invoiceNumber,
		orderId,
		order,
		finalChecker2
	) => {
		if (finalChecker2 === "Failed") {
			console.log(finalChecker2, "Ahowan Yaba sha3'al");

			const checkingWithLiveStock = (productId, SubSKU) => {
				const pickedSub =
					allProducts && allProducts.filter((iii) => iii._id === productId)[0];

				const GetSpecificSubSKU =
					pickedSub &&
					pickedSub.productAttributes &&
					pickedSub.productAttributes.filter((iii) => iii.SubSKU === SubSKU)[0];
				const QtyChecker = GetSpecificSubSKU && GetSpecificSubSKU.quantity;

				return QtyChecker;
			};

			var modifyingTheVariables = order.chosenProductQtyWithVariables;

			var quantityModified = modifyingTheVariables.map((iii) =>
				iii.map((iiii) => {
					return {
						...iiii,
						quantity: checkingWithLiveStock(iiii.productId, iiii.SubSKU),
					};
				})
			);

			var orderFinal = {
				...order,
				onholdStatus: "Not On Hold",
				chosenProductQtyWithVariables: quantityModified,
			};

			// console.log(orderFinal, "orderFinal");

			updateOrderInvoiceStock(
				user._id,
				token,
				orderId,
				orderFinal,
				invoiceNumber,
				"Not On Hold"
			).then((data) => {
				if (data.error) {
					console.log("Status update failed");
				} else {
					window.location.reload(false);
				}
			});
		} else {
			updateOrderInvoice(user._id, token, orderId, invoiceNumber).then(
				(data) => {
					if (data.error) {
						console.log("Status update failed");
					} else {
						window.location.reload(false);
					}
				}
			);
		}
	};

	const allInvoices = allOrders.map((i) => i.invoiceNumber);

	const mainDate =
		allOrders &&
		allOrders.map((i) => {
			const checkingWithLiveStock = (productId, SubSKU, OrderedQty) => {
				const pickedSub =
					allProducts && allProducts.filter((iii) => iii._id === productId)[0];

				const GetSpecificSubSKU =
					pickedSub &&
					pickedSub.productAttributes &&
					pickedSub.productAttributes.filter((iii) => iii.SubSKU === SubSKU)[0];
				const QtyChecker =
					GetSpecificSubSKU && GetSpecificSubSKU.quantity < OrderedQty;

				return QtyChecker;
			};

			var stockCheckHelper = i.chosenProductQtyWithVariables.map((iii) =>
				iii.map((iiii) =>
					checkingWithLiveStock(iiii.productId, iiii.SubSKU, iiii.OrderedQty)
				)
			);
			var merged = [].concat.apply([], stockCheckHelper);
			var finalChecker = merged.indexOf(true) === -1 ? "Passed" : "Failed";

			var gettingTotalAmount = Number(
				Number(i.totalAmountAfterDiscount) +
					(Number(i.totalAmount) - Number(i.shippingFees)) * 0.01
			).toFixed(2);

			return {
				PurchaseDate: new Date(i.orderCreationDate).toLocaleDateString(),
				Invoice: i.invoiceNumber,
				Status: i.status,
				// Name: i.customerDetails.fullName.toString(),
				Phone: i.customerDetails.phone,
				fullName: i.customerDetails.fullName,
				Amount: gettingTotalAmount + " L.E.",
				Store: i.orderSource.toUpperCase(),
				Governorate: i.customerDetails.state,
				// Carrier: i.customerDetails.carrierName,
				SKU_Qty: i.chosenProductQtyWithVariables.map((iii) =>
					iii.map(
						(iiii) =>
							iiii.SubSKU +
							"  /  " +
							iiii.OrderedQty +
							"  /  " +
							iiii.productName +
							" \n"
					)
				),
				backorder: finalChecker === "Passed" ? "Good" : "Backorder",
			};
		});

	const exportPDF = () => {
		const unit = "pt";
		const size = "A4"; // Use A1, A2, A3 or A4
		const orientation = "landscape"; // portrait or landscape

		const marginLeft = 80;
		const doc = new jsPDF(orientation, unit, size);

		doc.setLanguage("ar-Ar");
		doc.setFontSize(9);

		const title = "PENDING ORDERS";
		const headers = [
			[
				"Date",
				"Invoice #",
				"Status",
				"Customer Name",
				"Phone",
				"Amount",
				"Store",
				"Governorate",
				// "Carrier",
				"SKU_Qty",
				"Backorder",
			],
		];

		const data = mainDate.map((elt) => [
			elt.PurchaseDate,
			elt.Invoice,
			elt.Status,
			elt.fullName,
			elt.Phone,
			elt.Amount,
			elt.Store,
			elt.Governorate,
			// elt.Carrier,
			elt.SKU_Qty,
			elt.backorder,
		]);

		let content = {
			startY: 50,
			head: headers,
			body: data,
			// theme: "plain",
			styles: {fontSize: 8, cellWidth: "auto"},
		};

		doc.text(title, marginLeft, 40);
		doc.autoTable(content);
		doc.save("Checklist.pdf");
	};

	// var adjustedExcelData =
	// 	excelDataSet &&
	// 	excelDataSet.map((i) => {
	// 		return i.chosenProductQtyWithVariables.map((ii) => {
	// 			return ii.map((iii) => {
	// 				return {
	// 					Name: i.customerDetails.fullName,
	// 					address: i.customerDetails.address,
	// 					phone1: i.customerDetails.phone,
	// 					phone2: "",
	// 					City: i.customerDetails.cityName + " / " + i.customerDetails.city,
	// 					DescriptionOfGoods: iii.productName + " / " + iii.SubSKU,
	// 					totalAmount: iii.pickedPrice,
	// 					ReferenceNumber: iii.trackingNumber,
	// 					pieces: iii.OrderedQty,
	// 					comment: i.customerDetails.orderComment
	// 						? i.customerDetails.orderComment
	// 						: ".",
	// 					company: i.orderSource,
	// 					email: "gqcanihelpyou@gmail.com",
	// 					weight: 1,
	// 				};
	// 			});
	// 		});
	// 	});

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
				orderDate: i.orderCreationDate
					? moment(i.orderCreationDate).format("DD/MM/YYYY")
					: moment(i.createdAt).format("DD/MM/YYYY"),
				DescriptionOfGoods:
					merged2.length === 1
						? merged2[0]
						: merged2.length === 2
						? merged2[0] + " | " + merged2[1]
						: merged2.length === 3
						? merged2[0] + " | " + merged2[1] + " | " + merged2[2]
						: merged2[0],
				totalAmount: gettingTotalAmount,
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

	// console.log(adjustedExcelData, "adjustedExcelData");

	const selectedDateOrdersSKUsModified = () => {
		const modifiedArray =
			allOrders &&
			allOrders.map((i) =>
				i.chosenProductQtyWithVariables.map((ii) =>
					ii.map((iii) => {
						return {
							productName: iii.productName,
							OrderedQty: iii.OrderedQty,
							productMainImage: iii.productMainImage,
							SubSKU: iii.SubSKU,
							SubSKUColor: iii.SubSKUColor,
							SubSKUSize: iii.SubSKUSize,
							productSubSKUImage: iii.productSubSKUImage,
							orderId: i._id,
							status: i.status,
							totalPaidAmount:
								Number(iii.pickedPrice).toFixed(2) *
								Number(iii.OrderedQty).toFixed(2),
						};
					})
				)
			);

		return modifiedArray;
	};

	var destructingNestedArraySKUs = [];
	selectedDateOrdersSKUsModified() &&
		selectedDateOrdersSKUsModified().map((i) =>
			i.map((ii) => destructingNestedArraySKUs.push(...ii))
		);

	function sortTopOrdersProductsSKUs(a, b) {
		const TotalAppointmentsA = a.totalPaidAmount;
		const TotalAppointmentsB = b.totalPaidAmount;
		let comparison = 0;
		if (TotalAppointmentsA < TotalAppointmentsB) {
			comparison = 1;
		} else if (TotalAppointmentsA > TotalAppointmentsB) {
			comparison = -1;
		}
		return comparison;
	}

	var TopSoldProductsSKUs = [];
	destructingNestedArraySKUs &&
		destructingNestedArraySKUs.reduce(function (res, value) {
			if (!res[value.productName + value.SubSKU]) {
				res[value.productName + value.SubSKU] = {
					productName: value.productName,
					productMainImage: value.productMainImage,
					productSubSKUImage: value.productSubSKUImage,
					SubSKU: value.SubSKU,
					SubSKUColor: value.SubSKUColor,
					SubSKUSize: value.SubSKUSize,
					orderId: value.orderId,
					status: value.status,
					OrderedQty: 0,
					totalPaidAmount: 0,
				};
				TopSoldProductsSKUs.push(res[value.productName + value.SubSKU]);
			}

			res[value.productName + value.SubSKU].OrderedQty += Number(
				value.OrderedQty
			);
			res[value.productName + value.SubSKU].totalPaidAmount += Number(
				value.totalPaidAmount
			);

			return res;
		}, {});

	TopSoldProductsSKUs.sort(sortTopOrdersProductsSKUs);

	const DownloadExcel = () => {
		return (
			<ExcelFile
				filename={`GQ_Orders_ ${new Date().toLocaleString("en-US", {
					timeZone: "Africa/Cairo",
				})}`}
				element={
					<Link
						className='btn btn-info mr-5 ml-2'
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
					<ExcelColumn label='Order Date' value='orderDate' />
					<ExcelColumn
						label='Description Of Goods'
						value='DescriptionOfGoods'
					/>
					<ExcelColumn label='Cod' value='totalAmount' />
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
				<CreateShippingModal
					userId={user._id}
					token={token}
					pickedOrder={pickedOrder}
					setAramexResponse={setAramexResponse}
					allInvoices={allInvoices}
					modalVisible={modalVisible}
					setModalVisible={setModalVisible}
					updateCustomerDetails={updateCustomerDetails}
					setUpdateCustomerDetails={setUpdateCustomerDetails}
					updateSingleOrder={pickedOrder}
					setUpdateSingleOrder={setPickedOrder}
				/>
				{allOrders && allOrders.length === 0 ? (
					<div
						className='text-center mt-5'
						style={{fontSize: "1.2rem", fontWeight: "bold"}}
					>
						No Un-invoiced Orders Available
					</div>
				) : (
					<>
						<div>
							<Link className='btn btn-success' to='/admin/create-new-order'>
								Create New Order
							</Link>
						</div>

						<div
							className='tableScrollBarStyling'
							style={{
								maxHeight: "700px",
								overflow: "auto",
								margin: "40px 100px",
							}}
						>
							<table
								className='table table-bordered table-md-responsive table-hover'
								style={{fontSize: "0.75rem", overflow: "auto"}}
							>
								<thead style={{position: "sticky", top: "0"}}>
									<tr
										style={{
											fontSize: "0.75rem",
											textTransform: "capitalize",
											textAlign: "center",
											backgroundColor: "#009ef7",
											color: "wheat",
										}}
									>
										<th scope='col'>#</th>
										<th scope='col'>SKU</th>
										<th scope='col'>Product Name</th>
										<th scope='col'>Color</th>
										<th scope='col'>Size</th>
										<th scope='col'>Ordered Qty</th>
										<th scope='col'>Status</th>
										<th scope='col'>Details</th>
									</tr>
								</thead>
								<tbody
									className='my-auto'
									style={{
										fontSize: "0.75rem",
										textTransform: "capitalize",
										fontWeight: "bolder",
									}}
								>
									{TopSoldProductsSKUs &&
										TopSoldProductsSKUs.map((s, i) => {
											return (
												<tr key={i} className=''>
													<td className='my-auto'>{i + 1}</td>
													<td style={{textTransform: "uppercase"}}>
														{s.SubSKU}
													</td>
													<td>{s.productName}</td>
													<td>
														{allColors[
															allColors
																.map((i) => i.hexa)
																.indexOf(s.SubSKUColor)
														]
															? allColors[
																	allColors
																		.map((i) => i.hexa)
																		.indexOf(s.SubSKUColor)
															  ].color
															: s.SubSKUColor}
													</td>

													<td style={{textTransform: "uppercase"}}>
														{s.SubSKUSize}
													</td>
													<td>{s.OrderedQty}</td>
													<td>{s.status}</td>
													<td style={{textAlign: "center"}}>
														<Link to={`/admin/single-order/${s.orderId}`}>
															Details...
														</Link>
														{/* <img
															width='30%'
															height='30%'
															style={{ marginLeft: "10px" }}
															src={s.productSubSKUImage}
															alt={s.productName}
														/> */}
													</td>

													{/* <td>{Invoice(s)}</td> */}
												</tr>
											);
										})}
								</tbody>
							</table>
						</div>

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

						<Pagination
							postsPerPage={postsPerPage}
							totalPosts={allOrders.length}
							paginate={paginate}
							currentPage={currentPage}
						/>
						<div>
							<Link
								className='btn btn-primary'
								onClick={() => exportPDF()}
								to='#'
							>
								Download Report (PDF)
							</Link>
							{DownloadExcel()}
							{backorders === "Clicked" ? (
								<Link
									className='btn btn-info mx-2'
									onClick={() => setBackorders("NotClicked")}
									to='#'
								>
									Revert To Default
								</Link>
							) : (
								<Link
									className='btn btn-danger mx-2'
									onClick={() => setBackorders("Clicked")}
									to='#'
								>
									Backorders
								</Link>
							)}
							<Link
								className='btn'
								style={{background: "black", color: "white"}}
								onClick={() => setBackorders("Processing")}
								to='#'
							>
								In Processing
							</Link>
							<Link
								className='btn ml-2 btn-success'
								// style={{ background: "black", color: "white" }}
								onClick={() => setBackorders("Good")}
								to='#'
							>
								Good Orders
							</Link>
						</div>

						<div
							className='my-4 tableScrollBarStyling'
							style={{
								maxHeight: "1200px",
								overflow: "auto",
								margin: "40px 0px",
							}}
						>
							<table
								className='table table-bordered table-md-responsive table-hover text-center'
								style={{fontSize: "0.7rem", overflow: "auto"}}
								id='ahowan'
							>
								<thead
									className='thead-light'
									style={{position: "sticky", top: "0"}}
								>
									<tr>
										<th scope='col'>Purchase Date</th>
										<th scope='col'>INV #</th>
										<th scope='col'>Status</th>
										<th scope='col'>Name</th>
										<th scope='col'>Phone</th>
										<th scope='col'>Amount</th>
										<th scope='col'>Store</th>
										<th scope='col'>Taker</th>
										<th scope='col'>Governorate</th>
										{/* <th scope='col'>City</th> */}
										{/* <th scope='col'>Carrier</th> */}
										<th scope='col'>Tracking #</th>
										<th scope='col'>Quantity</th>
										<th scope='col'>Invoice?</th>
										<th scope='col'>Shipping?</th>
										<th scope='col'>Details?</th>
									</tr>
								</thead>

								<tbody className='my-auto'>
									{search(currentPosts).map((s, i) => {
										const checkingWithLiveStock = (
											productId,
											SubSKU,
											OrderedQty,
											status
										) => {
											if (
												status === "In Processing" ||
												status === "On Hold" ||
												status === "Ready To Ship"
											) {
												const pickedSub =
													allProducts &&
													allProducts.filter((iii) => iii._id === productId)[0];

												const GetSpecificSubSKU =
													pickedSub &&
													pickedSub.productAttributes &&
													pickedSub.productAttributes.filter(
														(iii) => iii.SubSKU === SubSKU
													)[0];
												const QtyChecker =
													GetSpecificSubSKU &&
													GetSpecificSubSKU.quantity < OrderedQty;

												return QtyChecker;
											}
										};

										var stockCheckHelper = s.chosenProductQtyWithVariables.map(
											(iii) =>
												iii.map((iiii) =>
													checkingWithLiveStock(
														iiii.productId,
														iiii.SubSKU,
														iiii.OrderedQty,
														s.status
													)
												)
										);

										var merged = [].concat.apply([], stockCheckHelper);
										var finalChecker =
											merged.indexOf(true) === -1 ? "Passed" : "Failed";

										//Getting stock as of the time the order was taken
										var stockCheckHelper2 = s.chosenProductQtyWithVariables.map(
											(iii) =>
												iii.map((iiii) => iiii.quantity < iiii.OrderedQty)
										);

										var merged2 = [].concat.apply([], stockCheckHelper2);
										var finalChecker2 =
											merged2.indexOf(true) === -1 ? "Passed" : "Failed";

										// console.log(finalChecker2, "Merged2");

										return (
											<tr key={i} className=''>
												{s.orderCreationDate ? (
													<td style={{width: "8%"}}>
														{new Date(s.orderCreationDate).toDateString()}{" "}
													</td>
												) : (
													<td style={{width: "8%"}}>
														{new Date(s.createdAt).toDateString()}{" "}
													</td>
												)}

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
														fontSize: "0.75rem",
														width: "8.5%",
														background:
															// finalChecker2 === "Failed" &&
															finalChecker === "Failed" &&
															s.status !== "Ready To Ship"
																? "darkred"
																: s.status === "Delivered" ||
																  s.status === "Shipped"
																? "#004b00"
																: s.status === "Cancelled"
																? "darkred"
																: s.status === "In Processing"
																? "#d8ffff"
																: s.status === "Exchange - In Processing"
																? "#d8ebff"
																: "#ffffd8",
														color:
															// finalChecker2 === "Failed" &&
															finalChecker === "Failed" &&
															s.status !== "Ready To Ship"
																? "white"
																: s.status === "Delivered" ||
																  s.status === "Shipped"
																? "white"
																: s.status === "Cancelled"
																? "white"
																: "black",
													}}
												>
													{s.status}
												</td>

												<td style={{width: "11%"}}>
													{s.customerDetails.fullName}
												</td>
												<td>{s.customerDetails.phone}</td>
												<td style={{width: "7%"}}>
													{Number(
														Number(s.totalAmountAfterDiscount) +
															(Number(s.totalAmount) - Number(s.shippingFees)) *
																0.01
													).toFixed(2)}{" "}
													L.E.
												</td>
												<td style={{textTransform: "uppercase"}}>
													{s.orderSource}
												</td>
												<td
													style={{
														background:
															s.employeeData === "Online Order"
																? "#ffc994"
																: "",
													}}
												>
													{s.employeeData.name
														? s.employeeData.name
														: s.employeeData === "Online Order"
														? "Online Self Service"
														: ""}
												</td>
												<td>{s.customerDetails.state}</td>
												{/* <td>{s.customerDetails.cityName}</td> */}
												{/* <td style={{ width: "8%" }}>
												{s.chosenShippingOption &&
													s.chosenShippingOption[0] &&
													s.chosenShippingOption[0].carrierName}
											</td> */}
												<td style={{width: "8%"}}>
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
														}}
													>
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
																					lengthOfOrders - i
																			  }`
																			: result;
																	handleInvoiceStatus(
																		invoiceNumber,
																		s._id,
																		s,
																		finalChecker2
																	);
																}}
															>
																Invoice
															</Link>
														) : (
															<Link
																to={`#`}
																style={{color: "darkred"}}
																onClick={() => {
																	if (
																		window.confirm(
																			"Are You Sure You Want To Invoice? Please note that there is no enough stock..."
																		)
																	) {
																		var today = new Date().toDateString(
																			"en-US",
																			{
																				timeZone: "Africa/Cairo",
																			}
																		);

																		let text = s.OTNumber;
																		let result = "INV" + text.slice(2);

																		var invoiceNumber =
																			s.OTNumber === "Not Added"
																				? `INV${new Date(today).getFullYear()}${
																						new Date(today).getMonth() + 1
																				  }${new Date(today).getDate()}000${
																						lengthOfOrders - i
																				  }`
																				: result;
																		handleInvoiceStatus(
																			invoiceNumber,
																			s._id,
																			s,
																			finalChecker2
																		);
																	}
																}}
															>
																Not Enough Stock
															</Link>
														)}
													</td>
												) : (
													<td
														style={{
															color: "darkgreen",
															fontWeight: "bold",
														}}
													>
														Invoiced
													</td>
												)}

												{s.invoiceNumber !== "Not Added" &&
												(s.trackingNumber === "Not Added" ||
													!s.trackingNumber) ? (
													<td
														style={{
															cursor: "pointer",
															fontSize: "10px,",
															fontWeight: "bold",
														}}
													>
														<Link
															to={`#`}
															onClick={() => {
																setPickedOrder(s);
																setUpdateCustomerDetails(s.customerDetails);
																setModalVisible(true);
															}}
														>
															Create Shipping
														</Link>
													</td>
												) : (
													<td
														style={{
															cursor: "pointer",
															fontSize: "10px,",
															color: "darkgray",
															fontWeight: "bold",
														}}
													>
														Create Shipping
													</td>
												)}

												<td
													style={{
														color: "blue",
														fontWeight: "bold",
														cursor: "pointer",
													}}
												>
													<Link to={`/admin/single-order/${s._id}`}>
														Details....
													</Link>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
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
			{allOrders.length === 0 && allProducts.length === 0 ? (
				<div
					style={{
						textAlign: "center",
						fontWeight: "bolder",
						marginTop: "50px",
						fontSize: "2.5rem",
					}}
				>
					Loading....
				</div>
			) : (
				<>
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

							<h3 className='mt-5 text-center' style={{fontWeight: "bolder"}}>
								PENDING ORDERS
							</h3>
							<div className='row mx-5 mt-5'>
								<div className='col-xl-4 col-lg-6 col-md-11 col-sm-11 text-center mx-auto my-2'>
									<div className='card' style={{background: "#f1416c"}}>
										<div className='card-body'>
											<h5 style={{fontWeight: "bolder", color: "white"}}>
												Overall Orders Count
											</h5>
											<CountUp
												style={{color: "white"}}
												duration='3'
												delay={1}
												end={allOrders.length}
												separator=','
											/>
										</div>
									</div>
								</div>

								<div className='col-xl-4 col-lg-6 col-md-11 col-sm-11 text-center mx-auto my-2'>
									<div className='card' style={{background: "#009ef7"}}>
										<div className='card-body'>
											<h5 style={{fontWeight: "bolder", color: "white"}}>
												Overall Ordered Items
											</h5>
											<CountUp
												style={{color: "white"}}
												duration='3'
												delay={1}
												end={ArrayOfQty}
												separator=','
											/>
										</div>
									</div>
								</div>
								{user.userRole === "Order Taker" ||
								user.userRole === "Operations" ||
								user.userRole === "Stock Keeper" ? null : (
									<div className='col-xl-4 col-lg-6 col-md-11 col-sm-11 text-center mx-auto my-2'>
										<div className='card' style={{background: "#50cd89"}}>
											<div className='card-body'>
												<h5 style={{fontWeight: "bolder", color: "white"}}>
													Total Amount (L.E.)
												</h5>
												<CountUp
													style={{color: "white"}}
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
				</>
			)}
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

	.page-break {
		page-break-after: always;
		page-break-inside: avoid;
		clear: both;
	}
	.page-break-before {
		page-break-before: always;
		page-break-inside: avoid;
		clear: both;
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
