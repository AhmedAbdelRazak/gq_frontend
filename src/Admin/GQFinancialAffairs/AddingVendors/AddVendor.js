/** @format */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { isAuthenticated } from "../../../auth";
import AdminMenu from "../../AdminMenu/AdminMenu";
import DarkBG from "../../AdminMenu/DarkBG";
import { createNewVendor, getVendors } from "../../apiAdmin";
import UpdateVendors from "./UpdateVendors";

const AddVendor = () => {
	const [collapsed, setCollapsed] = useState(false);
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [allVendors, setAllVendors] = useState("");
	const [allVendorsData, setAllVendorsData] = useState("");
	const [chosenTable, setChosenTable] = useState("");
	// const [iteration, setIteration] = useState(0);

	//New Vendor Data
	const [vendorName, setVendorName] = useState("");
	const [vendorPhone, setVendorPhone] = useState("");
	const [vendorCountry, setVendorCountry] = useState("");
	const [vendorAddress, setVendorAddress] = useState("");

	const { user, token } = isAuthenticated();

	const gettingAllVendors = () => {
		getVendors(token).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllVendors(data.map((vendor) => vendor.vendorName));
				setAllVendorsData(data);
			}
		});
	};

	useEffect(() => {
		gettingAllVendors();
		// eslint-disable-next-line
	}, [vendorName, vendorCountry]);

	let matchingVendor = allVendors.indexOf(vendorName.toLowerCase()) !== -1;
	// console.log(matchingVendor, "El Logic");

	const clickSubmit = (e) => {
		e.preventDefault();
		if (matchingVendor) {
			return toast.error("This Vendor was added before.");
		}

		if (!vendorName || !vendorAddress || !vendorPhone || !vendorCountry) {
			return toast.error("Please Fill In All Fields");
		}

		// make request to api to create new vendor
		createNewVendor(user._id, token, {
			vendorName,
			vendorCountry,
			vendorPhone,
			vendorAddress,
		}).then((data) => {
			if (data.error) {
				console.log(data.error, "Creating New Vendor");
				setTimeout(function () {
					window.location.reload(false);
				}, 1000);
			} else {
				toast.success("New Vendor was successfully Added.");

				setTimeout(function () {
					window.location.reload(false);
				}, 1500);
			}
		});
	};

	return (
		<AddVendorWrapper show={collapsed}>
			{!collapsed ? (
				<DarkBG collapsed={collapsed} setCollapsed={setCollapsed} />
			) : null}
			<div className='grid-container'>
				<div className=''>
					<AdminMenu
						fromPage='AddVendor'
						AdminMenuStatus={AdminMenuStatus}
						setAdminMenuStatus={setAdminMenuStatus}
						collapsed={collapsed}
						setCollapsed={setCollapsed}
					/>
				</div>
				<div className='mainContent mt-5 col-md-6 mx-auto p-4'>
					<UpdateVendors
						modalVisible={modalVisible}
						setModalVisible={setModalVisible}
						chosenTable={chosenTable}
					/>
					<div
						className=''
						style={{
							background: "white",
							padding: "20px",
							borderRadius: "5px",
							margin: "auto",
						}}>
						<h3
							className='text-center'
							style={{
								fontWeight: "bolder",
								fontSize: "1.4rem",
								textTransform: "uppercase",
							}}>
							Create New Vendor
						</h3>

						<div className=''>
							<div className='form-group'>
								<label
									className='text-muted'
									style={{ fontWeight: "bold", fontSize: "13px" }}>
									Vendor Name
								</label>
								<input
									type='text'
									className='form-control'
									onChange={(e) => setVendorName(e.target.value)}
									value={vendorName}
									required
								/>
							</div>

							<div className='form-group'>
								<label
									className='text-muted'
									style={{ fontWeight: "bold", fontSize: "13px" }}>
									Vendor Phone
								</label>
								<input
									type='text'
									className='form-control'
									onChange={(e) => setVendorPhone(e.target.value)}
									value={vendorPhone}
									required
								/>
							</div>
							<div className='form-group'>
								<label
									className='text-muted'
									style={{ fontWeight: "bold", fontSize: "13px" }}>
									Vendor Country
								</label>
								<input
									type='text'
									className='form-control'
									onChange={(e) => setVendorCountry(e.target.value)}
									value={vendorCountry}
									required
								/>
							</div>
							<div className='form-group'>
								<label
									className='text-muted'
									style={{ fontWeight: "bold", fontSize: "13px" }}>
									Vendor Address
								</label>
								<input
									type='text'
									className='form-control'
									onChange={(e) => setVendorAddress(e.target.value)}
									value={vendorAddress}
									required
								/>
							</div>

							{vendorName && vendorCountry ? (
								<button
									className='btn btn-outline-primary mb-3'
									onClick={clickSubmit}>
									Add New Vendor
								</button>
							) : null}
						</div>
					</div>
				</div>
			</div>
			<div className='col-md-8 mx-auto mt-3'>
				<h5 style={{ fontWeight: "bold" }}>
					Available Vendors (Click To Update)
				</h5>
				<div className='row mt-4'>
					{allVendorsData &&
						allVendorsData.map((v, i) => {
							return (
								<div className='col-3 mt-3' key={i}>
									{" "}
									<Link
										style={{ textTransform: "uppercase" }}
										to={`#`}
										onClick={() => {
											setChosenTable(v);
											setModalVisible(true);
										}}>
										{v.vendorName}
									</Link>{" "}
								</div>
							);
						})}
				</div>
			</div>
		</AddVendorWrapper>
	);
};

export default AddVendor;

const AddVendorWrapper = styled.div`
	min-height: 880px;

	.grid-container {
		display: grid;
		/* grid-template-columns: 16% 84%; */
		grid-template-columns: ${(props) =>
			props.show ? "4.5% 95.5%" : "15% 85%"};

		margin: auto;
		/* border: 1px solid red; */
		/* grid-auto-rows: minmax(60px, auto); */
	}
`;
