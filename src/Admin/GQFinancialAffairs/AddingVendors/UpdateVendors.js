/** @format */

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Modal } from "antd";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import { removeVendor, updateVendor } from "../../apiAdmin";
import { isAuthenticated } from "../../../auth";
import { toast } from "react-toastify";

// import { toast } from "react-toastify";

const UpdateVendors = ({ setModalVisible, modalVisible, chosenTable }) => {
	const [vendorName, setVendorName] = useState("");
	const [vendorPhone, setVendorPhone] = useState("");
	const [vendorCountry, setVendorCountry] = useState("");
	const [vendorAddress, setVendorAddress] = useState("");
	// const [iteration, setIteration] = useState(0);

	const { user, token } = isAuthenticated();

	const clickSubmit = (e) => {
		e.preventDefault();

		if (!vendorName || !vendorAddress || !vendorPhone || !vendorCountry) {
			return toast.error("Please Fill In All Fields");
		}

		const newVendor = {
			vendorName: vendorName,
			vendorPhone: vendorPhone,
			vendorCountry: vendorCountry,
			vendorAddress: vendorAddress,
		};

		// make request to api to update Vendor
		updateVendor(chosenTable._id, user._id, token, newVendor).then((data) => {
			if (data.error) {
				console.log(data.error, "Update Vendor");
				setTimeout(function () {
					window.location.reload(false);
				}, 1000);
			} else {
				toast.success("Vendor Successfully updated.");

				setTimeout(function () {
					window.location.reload(false);
				}, 2500);
			}
		});
	};

	useEffect(() => {
		setVendorName(chosenTable.vendorName);
		setVendorAddress(chosenTable.vendorAddress);
		setVendorCountry(chosenTable.vendorCountry);
		setVendorPhone(chosenTable.vendorPhone);
		// eslint-disable-next-line
	}, [modalVisible]);

	console.log(chosenTable, "chosenTable");

	const mainForm = () => {
		return (
			<div className='mx-auto '>
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

					<button
						className='btn btn-outline-primary mb-3'
						style={{ textTransform: "capitalize" }}
						onClick={clickSubmit}>
						Update Vendor "{chosenTable.vendorName}"
					</button>

					<>
						<button
							className='btn btn-danger mb-3 mx-5'
							style={{ textTransform: "capitalize" }}
							onClick={() => {
								if (
									window.confirm(
										`Are You Sure You Want To Delete Vendor ${chosenTable.vendorName}?`,
									)
								) {
									removeVendor(chosenTable._id, user._id, token)
										.then((res) => {
											toast.error(`Vendor "${res.data.vendorName}" deleted`);
											setTimeout(function () {
												window.location.reload(false);
											}, 2500);
											setModalVisible(false);
										})
										.catch((err) => console.log(err));
								}
								setTimeout(function () {
									window.location.reload(false);
								}, 2500);
							}}>
							Delete Vendor "{chosenTable.vendorName}"
						</button>
					</>
				</div>
			</div>
		);
	};

	return (
		<UpdateVendorsWrapper>
			<Modal
				width='65%'
				title={
					<div
						style={{
							textAlign: "center",
							fontWeight: "bold",
							fontSize: "1.3rem",
							color: "darkgreen",
							textTransform: "capitalize",
						}}>{`Update Vendor "${chosenTable.vendorName}"`}</div>
				}
				open={modalVisible}
				onOk={() => {
					setModalVisible(false);
				}}
				// okButtonProps={{ style: { display: "none" } }}
				cancelButtonProps={{ style: { display: "none" } }}
				onCancel={() => {
					setModalVisible(false);
				}}>
				{mainForm()}
			</Modal>
		</UpdateVendorsWrapper>
	);
};

export default UpdateVendors;

const UpdateVendorsWrapper = styled.div``;
