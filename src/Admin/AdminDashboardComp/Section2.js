/** @format */

import React from "react";
import styled from "styled-components";
import Chart from "react-apexcharts";

const Section2 = ({
	day1,
	day2,
	OrderSourceSummary,
	allOrders,
	donutChart2,
	sumOfLast30DaysRevenue,
	sumOfLast7DaysRevenue,
	sumOfTodaysRevenue,
	allOrdersAggregated,
	chartDataTotalAmount,
	todaysOrders,
	last7daysOrdersRevenue,
	last30daysOrdersRevenue,
	allOrders2,
}) => {
	return (
		<Section2Wrapper className='row mx-auto mt-3'>
			<div className='col-xl-5 col-lg-8 col-md-11  mx-auto'>
				<div className='card' style={{ maxHeight: "340px" }}>
					<h5 className='text-center'>
						Sales By Store
						<span style={{ fontSize: "13px" }}>
							{" "}
							(From: {new Date(day2).toLocaleDateString()} to:{" "}
							{new Date(day1).toLocaleDateString()})
						</span>
					</h5>

					{OrderSourceSummary &&
					allOrders &&
					allOrders2 &&
					OrderSourceSummary.length > 0 &&
					OrderSourceSummary[0] ? (
						<div className='row'>
							<Chart
								title={donutChart2.title}
								options={donutChart2}
								series={donutChart2.series}
								type='bar'
								height={280}
								width={550}
							/>
						</div>
					) : null}
				</div>
			</div>

			<div className='col-xl-7 col-lg-8 col-md-11 mx-auto'>
				<div className='card'>
					<h5 className='text-center'>Day Over Day Sales</h5>

					<div className='row' style={{ maxHeight: "273px" }}>
						<div className='col-md-3 mt-2'>
							<h3
								style={{
									fontWeight: "bold",
									color: "green",
									fontSize: "1.35rem",
								}}>
								Today
							</h3>
							<div className=' mb-1 row'>
								<div
									className='col-md-5'
									style={{
										fontSize: "1rem",
										fontWeight: "bold",
									}}>
									EGP
								</div>{" "}
								<div
									className='col-md-7'
									style={{ fontSize: "1rem", fontWeight: "bold" }}>
									{" "}
									{Number(
										Number(sumOfTodaysRevenue).toFixed(2),
									).toLocaleString()}
									<div
										style={{
											fontSize: "11px",
											color: "darkgrey",
										}}>
										{Number(todaysOrders.length).toLocaleString()} Orders
									</div>
								</div>
							</div>

							<div className='mt-1 mb-2'>
								<div style={{ fontSize: "12px", fontWeight: "bold" }}>
									<span style={{ color: "goldenrod" }}>WEEK</span>
									<div
										className='row'
										style={{ fontSize: "11px", fontWeight: "bold" }}>
										<div className='col-md-4'>EGP</div>{" "}
										<div className='col-md-7'>
											{Number(
												Number(sumOfLast7DaysRevenue).toFixed(2),
											).toLocaleString()}
											<div
												style={{
													fontSize: "11px",
													color: "darkgrey",
												}}>
												{Number(last7daysOrdersRevenue.length).toLocaleString()}{" "}
												Orders
											</div>
										</div>{" "}
									</div>{" "}
								</div>{" "}
							</div>
							<div className='my-2'>
								<div style={{ fontSize: "12px", fontWeight: "bold" }}>
									<span style={{ color: "red" }}>MONTH</span>
									<div
										className='row'
										style={{ fontSize: "11px", fontWeight: "bold" }}>
										<div className='col-md-4'>EGP</div>{" "}
										<div className='col-md-7'>
											{Number(
												Number(sumOfLast30DaysRevenue).toFixed(2),
											).toLocaleString()}
											<div
												style={{
													fontSize: "11px",
													color: "darkgrey",
												}}>
												{Number(
													last30daysOrdersRevenue.length,
												).toLocaleString()}{" "}
												Orders
											</div>
										</div>{" "}
									</div>{" "}
								</div>{" "}
							</div>
							<div className='my-1'>
								{" "}
								<div style={{ fontSize: "12px", fontWeight: "bold" }}>
									ALL
								</div>{" "}
								<div
									className='row'
									style={{ fontSize: "11px", fontWeight: "bold" }}>
									<div className='col-md-4'>EGP</div>{" "}
									<div className='col-md-7'>
										{Number(
											Number(allOrdersAggregated.totalAmount).toFixed(2),
										).toLocaleString()}
										<div style={{ fontSize: "11px", color: "darkgrey" }}>
											{Number(allOrdersAggregated.ordersCount).toLocaleString()}{" "}
											Orders
										</div>
									</div>{" "}
								</div>{" "}
							</div>
						</div>
						<div className='col-md-9'>
							<div className='mx-auto text-center'>
								<Chart
									options={chartDataTotalAmount.options}
									series={chartDataTotalAmount.series}
									type='area'
									height={300}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Section2Wrapper>
	);
};

export default Section2;

const Section2Wrapper = styled.div``;
