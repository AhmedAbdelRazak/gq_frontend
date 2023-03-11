/** @format */

import React from "react";
import styled from "styled-components";
import Chart from "react-apexcharts";

const Section2 = ({ allOrders2, allOrders, day2, day1 }) => {
	var ordersModified = allOrders
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

	var onlineOrdersOnly =
		ordersModified &&
		ordersModified.filter(
			(i) => i.channel === "online" && i.status !== "Cancelled",
		);

	var onlineOrdersCancelled =
		ordersModified &&
		ordersModified.filter(
			(i) =>
				i.channel === "online" &&
				(i.status === "Cancelled" || i.status.includes("Rejected")),
		);

	var orderSourceModified =
		onlineOrdersOnly &&
		onlineOrdersOnly
			.map((i) => {
				return {
					...i,
					totalAmountAfterDiscount: Number(i.totalAmountAfterDiscount).toFixed(
						0,
					),
					totalFOB: Number(i.totalAmountAfterDiscount) - Number(i.shippingFees),
					orderSource:
						i.orderSource === "ZITRGA"
							? "ZIRGA"
							: i.orderSource === "zirga"
							? "ZIRGA"
							: i.orderSource === "g&q"
							? "G&Q"
							: i.orderSource,
				};
			})
			.filter(
				(iii) =>
					new Date(iii.orderCreationDate).setHours(0, 0, 0, 0) >=
						new Date(day2).setHours(0, 0, 0, 0) &&
					iii.totalAmountAfterDiscount !== 0,
			);

	const onlineOrdersRevenue =
		onlineOrdersOnly &&
		onlineOrdersOnly.map((i) => Number(i.totalAmountAfterDiscount));
	const onlineOrdersFOB =
		orderSourceModified && orderSourceModified.map((i) => Number(i.totalFOB));

	const onlineOrdersShipping =
		onlineOrdersOnly && onlineOrdersOnly.map((i) => Number(i.shippingFees));
	const onlineCancelledOrder =
		onlineOrdersCancelled &&
		onlineOrdersCancelled.map((i) => Number(i.totalAmountAfterDiscount));

	const sumOfOnlineRevenue = onlineOrdersRevenue.reduce((a, b) => a + b, 0);
	const sumOfOnlineFOB = onlineOrdersFOB.reduce((a, b) => a + b, 0);
	const sumOfOnlineShippingFees = onlineOrdersShipping.reduce(
		(a, b) => a + b,
		0,
	);
	const sumOfOnlineCancelled = onlineCancelledOrder.reduce((a, b) => a + b, 0);

	var OrderSourceSummary = [];
	orderSourceModified &&
		orderSourceModified.reduce(function (res, value) {
			if (!res[value.orderSource]) {
				res[value.orderSource] = {
					orderSource: value.orderSource,
					totalAmountAfterDiscount: 0,
					ordersCount: 0,
					totalOrderQty: 0,
					shippingFees: 0,
					totalFOB: 0,
				};
				OrderSourceSummary.push(res[value.orderSource]);
			}
			res[value.orderSource].totalAmountAfterDiscount += Number(
				value.totalAmountAfterDiscount,
			);

			res[value.orderSource].ordersCount += 1;

			res[value.orderSource].totalOrderQty += Number(value.totalOrderQty);
			res[value.orderSource].shippingFees += Number(value.shippingFees);
			res[value.orderSource].totalFOB += Number(value.totalFOB);

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
		OrderSourceSummary &&
		OrderSourceSummary.map((i) => i.totalAmountAfterDiscount);

	var barChartHoriz = {
		chart: {
			type: "donut",
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
					return "#005ab3";
				} else if (dataPointIndex === 1) {
					return "#00b3b3";
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
					OrderSourceSummary &&
					OrderSourceSummary.map((i) =>
						Number(i.totalAmountAfterDiscount).toFixed(2),
					).indexOf(Number(value).toFixed(2));

				return (
					"EGP " +
					Number(value).toLocaleString() +
					` (${
						OrderSourceSummary && OrderSourceSummary[index].ordersCount
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
					OrderSourceSummary &&
					OrderSourceSummary.map((i) => {
						return {
							x: i.orderSource.toUpperCase(),
							y: Number(i.totalAmountAfterDiscount).toFixed(2),
						};
					}),
			},
		],
	};

	var donutChart1 = {
		series: OrderSourceSummary.map((i) => {
			return i.totalAmountAfterDiscount;
		}),
		labels: OrderSourceSummary.map(
			(i) =>
				i.orderSource +
				" EGP " +
				Number(i.totalAmountAfterDiscount).toLocaleString(),
		),
		// title: {
		// 	text: "Order Source Breakdown By Orders Count",
		// 	align: "center",
		// },

		dataLabels: {
			enabled: false,

			formatter: function (val, pos) {
				return (
					Number(val).toFixed(0) +
					"%" +
					` (${
						OrderSourceSummary[pos.seriesIndex].totalAmountAfterDiscount
					} Orders)`
				);
			},
		},
		colors: ["#cccc00", "#f1416c", "#00c400", "#ffb1b1", "#9dceff", "#003162"],

		legend: {
			show: true,
			position: "right",
		},
	};

	var donutChart2 = {
		series: OrderSourceSummary.map((i) => {
			return i.totalFOB;
		}),
		labels: OrderSourceSummary.map(
			(i) => i.orderSource + " EGP " + Number(i.totalFOB).toLocaleString(),
		),
		// title: {
		// 	text: "Order Source Breakdown By Orders Count",
		// 	align: "center",
		// },

		dataLabels: {
			enabled: false,

			formatter: function (val, pos) {
				return (
					Number(val).toFixed(0) +
					"%" +
					` (${OrderSourceSummary[pos.seriesIndex].totalFOB} Orders)`
				);
			},
		},
		colors: ["#cccc00", "#f1416c", "#00c400", "#ffb1b1", "#9dceff", "#003162"],

		legend: {
			show: true,
			position: "right",
		},
	};

	var donutChart3 = {
		series: OrderSourceSummary.map((i) => {
			return i.shippingFees;
		}),
		labels: OrderSourceSummary.map(
			(i) => i.orderSource + " EGP " + Number(i.shippingFees).toLocaleString(),
		),
		// title: {
		// 	text: "Order Source Breakdown By Orders Count",
		// 	align: "center",
		// },

		dataLabels: {
			enabled: false,

			formatter: function (val, pos) {
				return (
					Number(val).toFixed(0) +
					"%" +
					` (${OrderSourceSummary[pos.seriesIndex].shippingFees} Orders)`
				);
			},
		},
		colors: ["#cccc00", "#f1416c", "#00c400", "#ffb1b1", "#9dceff", "#003162"],

		legend: {
			show: true,
			position: "right",
		},
	};

	return (
		<Section2Wrapper className='row mx-auto mt-3'>
			<div className='col-xl-5 col-lg-10 col-md-11  mx-auto'>
				<div
					className='card'
					style={{ maxHeight: "450px", minHeight: "450px" }}>
					<h5
						className='text-center mt-2'
						style={{ fontWeight: "bolder", fontSize: "17px" }}>
						SALES BY ONLINE STORES
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
								title={barChartHoriz.title}
								options={barChartHoriz}
								series={barChartHoriz.series}
								type='bar'
								height={380}
								width={650}
							/>
						</div>
					) : null}
				</div>
			</div>
			<div
				className='col-xl-7 col-lg-10 col-md-11  mx-auto'
				style={{
					maxHeight: "450px",
					minHeight: "450px",
					background: "white",
					padding: "10px",
				}}>
				<div className='row'>
					<div className='col-md-6'>
						<h5
							className=' mt-2 my-auto'
							style={{
								fontWeight: "bolder",
								fontSize: "15px",
								color: "darkgrey",
							}}>
							<span style={{ color: "black" }}>
								EGP {Number(sumOfOnlineRevenue).toLocaleString()}
							</span>{" "}
							<br /> ONLINE SALES
						</h5>
						{OrderSourceSummary &&
						allOrders &&
						allOrders2 &&
						OrderSourceSummary.length > 0 &&
						OrderSourceSummary[0] ? (
							<div className='row'>
								<Chart
									// title={donutChart1.title}
									options={donutChart1}
									series={donutChart1.series}
									type='donut'
									width={330}
									height={500}
								/>
							</div>
						) : null}
					</div>
					<div className='col-md-6'>
						<h5
							className=' mt-2 my-auto'
							style={{
								fontWeight: "bolder",
								fontSize: "15px",
								color: "darkgrey",
							}}>
							<span style={{ color: "black" }}>
								EGP {Number(sumOfOnlineFOB).toLocaleString()}
							</span>{" "}
							<br /> FOB SALES
						</h5>
						{OrderSourceSummary &&
						allOrders &&
						allOrders2 &&
						OrderSourceSummary.length > 0 &&
						OrderSourceSummary[0] ? (
							<div className='row'>
								<Chart
									// title={donutChart1.title}
									options={donutChart2}
									series={donutChart2.series}
									type='donut'
									width={330}
									height={500}
								/>
							</div>
						) : null}
					</div>
					<div className='col-md-6 mt-5'>
						<h5
							className=' mt-2 my-auto'
							style={{
								fontWeight: "bolder",
								fontSize: "15px",
								color: "darkgrey",
							}}>
							<span style={{ color: "black" }}>
								EGP {Number(sumOfOnlineShippingFees).toLocaleString()}
							</span>{" "}
							<br /> SHIPPING FEES
						</h5>
						{OrderSourceSummary &&
						allOrders &&
						allOrders2 &&
						OrderSourceSummary.length > 0 &&
						OrderSourceSummary[0] ? (
							<div className='row'>
								<Chart
									// title={donutChart1.title}
									options={donutChart3}
									series={donutChart3.series}
									type='donut'
									width={330}
									height={500}
								/>
							</div>
						) : null}
					</div>
					<div className='col-md-6 mt-5'>
						<h5
							className=' mt-2 my-auto'
							style={{
								fontWeight: "bolder",
								fontSize: "15px",
								color: "darkgrey",
							}}>
							<span style={{ color: "black" }}>
								EGP {Number(sumOfOnlineCancelled).toLocaleString()}
							</span>{" "}
							<br />{" "}
							<span style={{ fontSize: "13.5px" }}>
								CANCELLED/ REJECTED ORDERS
							</span>
						</h5>
						{OrderSourceSummary &&
						allOrders &&
						allOrders2 &&
						OrderSourceSummary.length > 0 &&
						OrderSourceSummary[0] ? (
							<div className='row'>
								<Chart
									// title={donutChart1.title}
									options={donutChart1}
									series={donutChart1.series}
									type='donut'
									width={330}
									height={500}
								/>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</Section2Wrapper>
	);
};

export default Section2;

const Section2Wrapper = styled.div`
	.apexcharts-yaxis-texts-g > text,
	.apexcharts-xaxis-inversed-texts-g > text,
	.apexcharts-data-labels > text {
		font-size: 10px !important;
	}
	.apexcharts-legend-text {
		font-size: 10px !important;
		font-weight: bolder !important;
	}

	.apexcharts-legend-series {
		margin-top: 4px !important;
	}
`;
