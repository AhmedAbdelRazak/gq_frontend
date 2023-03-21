/** @format */
import moment from "moment";
import React from "react";
import styled from "styled-components";

const Expenses = ({ reportName, allAddedAccounts }) => {
	var allAddedAccountModified =
		allAddedAccounts &&
		allAddedAccounts.filter(
			(i) => i.subaccount.toLowerCase() === reportName.toLowerCase(),
		);

	var allAddedValues =
		allAddedAccountModified && allAddedAccountModified.map((i) => i.value);

	return (
		<ExpensesWrapper>
			{reportName.toLowerCase() === "marketing expenses" ||
			reportName.toLowerCase() === "subscriptions" ||
			reportName.toLowerCase() === "social media ads" ? (
				<div className='mt-5' style={{ background: "white", padding: "10px" }}>
					<div className='row'>
						<div className='col-2 mx-auto'>
							<strong>Date</strong>
							{allAddedAccountModified &&
								allAddedAccountModified.map((date, i) => {
									return (
										<div key={i} className='mt-2'>
											{" "}
											{moment(date.logDate).format("DD/MM/YYYY")}
										</div>
									);
								})}
						</div>
						<div className='col-2 mx-auto'>
							<strong>Vendor</strong>
							{allAddedAccountModified &&
								allAddedAccountModified.map((v, i) => {
									return (
										<div
											key={i}
											className='mt-2'
											style={{ textTransform: "capitalize" }}>
											{" "}
											{v.vendor.vendorName ? v.vendor.vendorName : v.vendor}
										</div>
									);
								})}
						</div>
						<div className='col-2 mx-auto'>
							<strong>Added By</strong>
							{allAddedAccountModified &&
								allAddedAccountModified.map((v, i) => {
									return (
										<div key={i} className='mt-2'>
											{" "}
											{v.addedByUser && v.addedByUser.name}
										</div>
									);
								})}
						</div>
						<div className='col-2 mx-auto'>
							<strong>Value</strong>
							{allAddedAccountModified &&
								allAddedAccountModified.map((v, i) => {
									return (
										<div key={i} className='mt-2'>
											{" "}
											EGP {Number(v.value).toLocaleString()}
											{i === allAddedValues.length - 1 ? (
												<>
													<div>
														<hr
															style={{
																width: "35%",
																textAlign: "left",
																position: "absolute",
																borderBottom: "black solid 1px",
															}}
														/>
													</div>

													<br />
													<div className='mt-1'>
														<strong>
															EGP{" "}
															{allAddedValues &&
																allAddedValues.reduce((a, b) => a + b, 0)}
														</strong>
													</div>
												</>
											) : null}
										</div>
									);
								})}
						</div>
						<div className='col-2 mx-auto'>
							<strong>Comment</strong>
							{allAddedAccountModified &&
								allAddedAccountModified.map((v, i) => {
									return (
										<div
											key={i}
											className='mt-2'
											style={{ textTransform: "capitalize" }}>
											{" "}
											{v.employeeComment}
										</div>
									);
								})}
						</div>
						<div className='col-2 mx-auto'>
							<strong>Edit</strong>
						</div>
					</div>
				</div>
			) : null}
		</ExpensesWrapper>
	);
};

export default Expenses;

const ExpensesWrapper = styled.div``;
