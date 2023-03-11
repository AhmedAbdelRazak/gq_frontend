/** @format */

import React from "react";
import styled from "styled-components";
import Chart from "react-apexcharts";

const Section1 = ({ allOrdersAggregated, allOrders2, allOrders, day2 }) => {
	var today = new Date();
	var yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
	var last7Days = new Date(new Date().setDate(new Date().getDate() - 7));
	var last15Days = new Date(new Date().setDate(new Date().getDate() - 15));

	let last30daysOrdersRevenue = allOrders2
		.filter(
			(i) =>
				i.status !== "Cancelled" &&
				i.status !== "Returned" &&
				!i.status.includes("Rejected"),
		)
		.map((ii) => ii.totalAmountAfterDiscount);

	const sumOfLast30DaysRevenue =
		last30daysOrdersRevenue &&
		last30daysOrdersRevenue.reduce((a, b) => a + b, 0);

	let todaysOrders = allOrders2.filter(
		(i) =>
			new Date(i.orderCreationDate).setHours(0, 0, 0, 0) ===
			new Date(today).setHours(0, 0, 0, 0),
	);

	const todaysRevenue =
		todaysOrders && todaysOrders.map((i) => Number(i.totalAmountAfterDiscount));

	const sumOfTodaysRevenue = todaysRevenue.reduce((a, b) => a + b, 0);

	let yesterdaysOrders = allOrders2.filter(
		(i) =>
			new Date(i.orderCreationDate).setHours(0, 0, 0, 0) ===
			new Date(yesterday).setHours(0, 0, 0, 0),
	);

	const yesterdaysRevenue =
		yesterdaysOrders &&
		yesterdaysOrders.map((i) => Number(i.totalAmountAfterDiscount));

	const sumOfyesterdaysRevenue = yesterdaysRevenue.reduce((a, b) => a + b, 0);

	let last7daysOrdersRevenue = allOrders2
		.filter(
			(i) =>
				new Date(i.orderCreationDate).setHours(0, 0, 0, 0) >=
					new Date(last7Days).setHours(0, 0, 0, 0) &&
				i.status !== "Cancelled" &&
				i.status !== "Returned" &&
				!i.status.includes("Rejected"),
		)
		.map((ii) => ii.totalAmountAfterDiscount);

	const sumOfLast7DaysRevenue =
		last7daysOrdersRevenue && last7daysOrdersRevenue.reduce((a, b) => a + b, 0);

	let last7daysOrders = allOrders2
		.filter(
			(i) =>
				new Date(i.orderCreationDate).setHours(0, 0, 0, 0) >=
					new Date(last15Days).setHours(0, 0, 0, 0) &&
				i.status !== "Cancelled" &&
				i.status !== "Returned" &&
				!i.status.includes("Rejected"),
		)
		.map((ii) => {
			return {
				...ii,
				orderCreationDate: new Date(ii.orderCreationDate).toLocaleDateString(),
			};
		});

	var OrdersDates_TotalAmount = [];
	last7daysOrders &&
		last7daysOrders.reduce(function (res, value) {
			if (!res[value.orderCreationDate]) {
				res[value.orderCreationDate] = {
					orderCreationDate: value.orderCreationDate,
					totalAmountAfterDiscount: 0,
				};
				OrdersDates_TotalAmount.push(res[value.orderCreationDate]);
			}
			res[value.orderCreationDate].totalAmountAfterDiscount += Number(
				value.totalAmountAfterDiscount,
			);
			return res;
		}, {});

	var chartDataTotalAmount = {
		options: {
			chart: {
				id: "area",
				background: "",
			},

			plotOptions: {
				bar: {
					horizontal: false,
					borderRadius: 0,
					columnWidth: "100%",
					barHeight: "100%",
					distributed: false,
					rangeBarOverlap: true,
					rangeBarGroupRows: false,

					dataLabels: {
						position: "center",
						maxItems: 100,
						hideOverflowingLabels: true,
						orientation: "vertical",
					},
				},
			},

			dataLabels: {
				enabled: true,

				enabledOnSeries: undefined,
				formatter: function (val, opts) {
					return Number(val).toLocaleString();
				},
				style: {
					fontSize: "10px",
					fontFamily: "Helvetica, Arial, sans-serif",
					fontWeight: "bold",
					// colors: undefined,
					colors: ["black", "#E91E63", "#9C27B0"],
				},
			},

			title: {
				text: "Day Over Day Overview",
				align: "left",
				margin: 10,
				offsetX: 0,
				offsetY: 0,
				floating: false,
				style: {
					fontWeight: "bold",
					// fontFamily: undefined,
					color: "black",
				},
			},
			xaxis: {
				name: "Schedule Date",
				categories: OrdersDates_TotalAmount.map((i) =>
					new Date(i.orderCreationDate).toLocaleDateString(),
				),
			},
			colors: ["#99dd99"],

			stroke: {
				width: [2, 2],
			},

			yaxis: {
				tickAmount: 5,
				labels: {
					formatter: function (val) {
						return val.toFixed(0);
					},
				},
			},
			fill: {
				type: "gradient",
				colors: ["#99dd99"],
				gradient: {
					shadeIntensity: 1,
					opacityFrom: 0.7,
					opacityTo: 0.9,
					stops: [0, 100],
				},
			},
		},
		series: [
			{
				name: "Total Paid Amount",
				data: OrdersDates_TotalAmount.map((i) =>
					i.totalAmountAfterDiscount.toFixed(2),
				),
			},
		],
	};

	var orderChannelModified = allOrders
		.map((i) => {
			return {
				...i,
				channel:
					i.paymentStatus && i.paymentStatus === "Paid In Store"
						? "Offline"
						: "online",
			};
		})
		.filter(
			(iii) =>
				new Date(iii.orderCreationDate).setHours(0, 0, 0, 0) >=
					new Date(day2).setHours(0, 0, 0, 0) &&
				iii.totalAmountAfterDiscount !== 0,
		);

	var OrderChannelSummary = [];
	orderChannelModified &&
		orderChannelModified.reduce(function (res, value) {
			if (!res[value.channel]) {
				res[value.channel] = {
					channel: value.channel,
					totalAmountAfterDiscount: 0,
					ordersCount: 0,
					totalOrderQty: 0,
				};
				OrderChannelSummary.push(res[value.channel]);
			}
			res[value.channel].totalAmountAfterDiscount += Number(
				value.totalAmountAfterDiscount,
			);

			res[value.channel].ordersCount += 1;

			res[value.channel].totalOrderQty += Number(value.totalOrderQty);

			return res;
		}, {});

	function getMinMax(arr) {
		if (!arr) {
			return null;
		}
		var minV = arr[0];
		var maxV = arr[0];
		var a;
		for (a of arr) {
			if (a < minV) minV = a;
			if (a > maxV) maxV = a;
		}
		return [minV, maxV];
	}

	const xAxisValues =
		OrderChannelSummary &&
		OrderChannelSummary.map((i) => i.totalAmountAfterDiscount);

	var barchartHorizontal = {
		chart: {
			type: "bar",
		},
		plotOptions: {
			bar: {
				horizontal: true,
				borderRadius: 15,
				borderRadiusOnAllStackedSeries: true,
				dataLabels: {
					position: "bottom",
					hideOverflowingLabels: true,
				},
			},
		},

		colors: [
			function ({ value, seriesIndex, dataPointIndex, w }) {
				if (dataPointIndex === 0) {
					return "#00b3b3";
				} else if (dataPointIndex === 1) {
					return "#005ab3";
				} else if (dataPointIndex === 2) {
					return "#ff0000";
				} else if (dataPointIndex === 3) {
					return "#ff8000";
				} else if (dataPointIndex === 4) {
					return "#black";
				} else if (dataPointIndex === 5) {
					return "#darkyellow";
				} else if (dataPointIndex === 6) {
					return "#005ab3";
				} else {
					return "#005ab3";
				}
			},
		],
		dataLabels: {
			enabled: true,
			style: {
				colors: ["#333"],
				fontSize: 10,
			},

			offsetX: 320,

			formatter: function (value) {
				const index =
					OrderChannelSummary &&
					OrderChannelSummary.map((i) =>
						Number(i.totalAmountAfterDiscount).toFixed(2),
					).indexOf(Number(value).toFixed(2));

				return (
					"EGP " +
					Number(value).toLocaleString() +
					` (${
						OrderChannelSummary && OrderChannelSummary[index].ordersCount
					} Orders)`
				);
			},
		},

		xaxis: {
			labels: {
				show: false,
			},
			min: 0,
			max: getMinMax(xAxisValues)[1] + getMinMax(xAxisValues)[1] * 0.25,
		},

		series: [
			{
				data:
					OrderChannelSummary &&
					OrderChannelSummary.map((i) => {
						return {
							x: i.channel.toUpperCase(),
							y: Number(i.totalAmountAfterDiscount).toFixed(2),
						};
					}),
			},
		],
	};

	return (
		<Section1Wrapper className='row mx-auto mt-3'>
			<div
				className='col-xl-7 col-lg-8 col-md-11 mx-auto'
				style={{ minHeight: "450px", maxHeight: "450px" }}>
				<div className='card'>
					<h5
						className='text-center mt-2'
						style={{ fontWeight: "bolder", fontSize: "17px" }}>
						Day Over Day Sales
					</h5>

					<div className='row'>
						<div className='col-md-3 mt-2 ml-3'>
							<h3
								style={{
									fontWeight: "bold",
									color: "green",
									fontSize: "1.35rem",
								}}>
								TODAY
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
							<h3
								className='mt-3'
								style={{
									fontWeight: "bold",
									color: "grey",
									fontSize: "1.2rem",
								}}>
								YESTERDAY
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
										Number(sumOfyesterdaysRevenue).toFixed(2),
									).toLocaleString()}
									<div
										style={{
											fontSize: "11px",
											color: "darkgrey",
										}}>
										{Number(yesterdaysOrders.length).toLocaleString()} Orders
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
						<div className='col-md-8'>
							<div className='mx-auto text-center'>
								<Chart
									options={chartDataTotalAmount.options}
									series={chartDataTotalAmount.series}
									type='area'
									height={400}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div
				className='col-xl-5 col-lg-8 col-md-11  mx-auto'
				style={{
					minHeight: "450px",
					maxHeight: "450px",
					background: "white",
					border: "1px solid lightgrey",
				}}>
				{OrderChannelSummary &&
				allOrders &&
				allOrders2 &&
				OrderChannelSummary.length > 0 &&
				OrderChannelSummary[0] ? (
					<>
						<h5
							className='text-center mt-2'
							style={{ fontWeight: "bolder", fontSize: "17px" }}>
							SALES BY CHANNEL
						</h5>

						<div className='row mt-3'>
							<div className='col-md-5'>
								<h3
									style={{
										fontWeight: "bold",
										color: "green",
										fontSize: "1.35rem",
									}}>
									TODAY
								</h3>
								<div className=' mb-1 row'>
									<div
										className='col-md-3 ml-4'
										style={{
											fontSize: "1rem",
											fontWeight: "bold",
										}}>
										EGP
									</div>{" "}
									<div
										className='col-md-5'
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
							</div>

							<div className='col-md-5'>
								<h3
									style={{
										fontWeight: "bold",
										color: "grey",
										fontSize: "1.2rem",
									}}>
									YESTERDAY
								</h3>
								<div className=' mb-1 row'>
									<div
										className='col-md-3 ml-3'
										style={{
											fontSize: "1rem",
											fontWeight: "bold",
										}}>
										EGP
									</div>{" "}
									<div
										className='col-md-5'
										style={{ fontSize: "1rem", fontWeight: "bold" }}>
										{" "}
										{Number(
											Number(sumOfyesterdaysRevenue).toFixed(2),
										).toLocaleString()}
										<div
											style={{
												fontSize: "11px",
												color: "darkgrey",
											}}>
											{Number(yesterdaysOrders.length).toLocaleString()} Orders
										</div>
									</div>
								</div>
							</div>
						</div>

						<Chart
							title={barchartHorizontal.title}
							options={barchartHorizontal}
							series={barchartHorizontal.series}
							type='bar'
							height={300}
							width={550}
						/>
					</>
				) : null}
			</div>
		</Section1Wrapper>
	);
};

export default Section1;

const Section1Wrapper = styled.div`
	.apexcharts-yaxis-texts-g > text,
	.apexcharts-xaxis-inversed-texts-g > text,
	.apexcharts-data-labels > text {
		font-size: 10px !important;
	}
`;
