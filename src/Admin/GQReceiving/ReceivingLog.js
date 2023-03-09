/** @format */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getReceivingLogs } from "../apiAdmin";

const ReceivingLog = () => {
	const [allReceivings, setAllReceivings] = useState([]);

	const gettingReceivingLog = () => {
		getReceivingLogs().then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllReceivings(data.filter((i) => i.storeName === "g&q"));
			}
		});
	};

	useEffect(() => {
		gettingReceivingLog();

		// eslint-disable-next-line
	}, []);

	return (
		<ReceivingLogWrapper>
			<div
				style={{
					fontSize: "1.3rem",
					fontWeight: "bold",
					textDecoration: "underline",
					color: "lightgray",
					textAlign: "center",
					marginTop: "20px",
					marginBottom: "20px",
				}}>
				<Link to='/admin/receiving'>Back To Receiving</Link>
			</div>
			<table
				className='table table-bordered table-md-responsive table-hover '
				style={{ fontSize: "0.75rem", overflowX: "auto" }}>
				<thead className=''>
					<tr
						style={{
							fontSize: "0.75rem",
							textTransform: "capitalize",
							textAlign: "center",
						}}>
						<th scope='col'>PO #</th>
						<th scope='col'>Receiving Date</th>
						<th scope='col'>Receiving By</th>
						<th scope='col'>Product Name</th>
						<th scope='col'>Product SKU</th>
						<th scope='col'>Received Quantity</th>
						<th scope='col'>Receiving Case</th>
						<th scope='col'>Receiver Comment</th>
					</tr>
				</thead>
				<tbody
					className='my-auto'
					style={{
						fontSize: "0.75rem",
						textTransform: "capitalize",
						fontWeight: "bolder",
					}}>
					{allReceivings &&
						allReceivings.map((s, i) => {
							return (
								<tr key={i} className='' style={{ fontSize: "11px" }}>
									<td>{s.PONumber}</td>
									<td>{new Date(s.createdAt).toDateString()}</td>
									<td>{s.receivedByEmployee && s.receivedByEmployee.name}</td>
									<td>{s.productName}</td>
									<td>{s.receivedSKU}</td>
									<td>{s.receivedQuantity}</td>
									<td>{s.receivingCase}</td>
									<td>{s.receiverComment}</td>

									{/* <td>{Invoice(s)}</td> */}
								</tr>
							);
						})}
				</tbody>
			</table>
		</ReceivingLogWrapper>
	);
};

export default ReceivingLog;

const ReceivingLogWrapper = styled.div`
	min-height: 820px;
	margin: 20px 50px;

	table {
		overflow: auto;
		background: white;
	}
`;
