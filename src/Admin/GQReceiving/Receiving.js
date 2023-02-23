/** @format */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { isAuthenticated } from "../../auth";
import { listOrdersProcessing } from "../apiAdmin";

const Receiving = () => {
	const [allOrders, setAllOrders] = useState([]);

	const { user, token } = isAuthenticated();

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
				setAllOrders(data.sort(sortOrdersAscendingly));
			}
		});
	};

	useEffect(() => {
		loadOrders();
		// eslint-disable-next-line
	}, []);

	console.log(allOrders, "allOrders");

	return (
		<ReceivingWrapper>
			{user && user.userRole === "Admin Account" ? (
				<div>
					<Link to='/admin/dashboard'>Back to dashboard</Link>
				</div>
			) : null}
			<div>Hello From Receiving</div>
		</ReceivingWrapper>
	);
};

export default Receiving;

const ReceivingWrapper = styled.div`
	min-height: 500px;
`;
