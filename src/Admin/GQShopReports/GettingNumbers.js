/** @format */

// eslint-disable-next-line
var today = new Date().toDateString("en-US", {
	timeZone: "Africa/Cairo",
});

var yesterday = new Date();
var last7Days = new Date();
var last30Days = new Date();
var tomorrow = new Date();
var next7Days = new Date();
var next30Days = new Date();

yesterday.setDate(yesterday.getDate() - 1);
last7Days.setDate(last7Days.getDate() - 10);
last30Days.setDate(last30Days.getDate() - 30);
tomorrow.setDate(tomorrow.getDate() + 2);
next7Days.setDate(next7Days.getDate() + 8);
next30Days.setDate(next30Days.getDate() + 31);

export const overUncancelledRevenue = (allOrders) => {
	let overallUncancelledOrders = allOrders.filter(
		(i) => i.status !== "Cancelled" && i.status !== "Returned",
	);

	let overallUncancelledOrders2 =
		overallUncancelledOrders &&
		overallUncancelledOrders.map((i) => i.totalAmountAfterDiscount);

	const SumoverallUncancelledOrders2 = overallUncancelledOrders2.reduce(
		(a, b) => a + b,
		0,
	);

	return SumoverallUncancelledOrders2;
};

export const gettingOrderStatusSummaryRevenue = (
	OrderStatusSummary,
	passedStatus,
) => {
	let statusArraySummary = OrderStatusSummary.filter(
		(i) => i.status === passedStatus,
	);

	let statusArraySummaryNumbers =
		statusArraySummary &&
		statusArraySummary.map((i) => i.totalAmountAfterDiscount);

	const SumOfStatusRevenue = statusArraySummaryNumbers.reduce(
		(a, b) => a + b,
		0,
	);

	return SumOfStatusRevenue;
};

export const gettingOrderStatusSummaryCount = (
	OrderStatusSummary,
	passedStatus,
) => {
	let statusArraySummary = OrderStatusSummary.filter(
		(i) => i.status === passedStatus,
	);

	let statusArraySummaryNumbers =
		statusArraySummary && statusArraySummary.map((i) => i.ordersCount);

	const SumOfStatusRevenue = statusArraySummaryNumbers.reduce(
		(a, b) => a + b,
		0,
	);

	return SumOfStatusRevenue;
};

export const gettingOrderSourceSummaryCount = (
	OrderSourceSummary,
	passedStore,
) => {
	let sourceArraySummary = OrderSourceSummary.filter(
		(i) => i.status === passedStore,
	);

	let SourceArraySummaryNumbers =
		sourceArraySummary && sourceArraySummary.map((i) => i.ordersCount);

	const SumOfSourceRevenue = SourceArraySummaryNumbers.reduce(
		(a, b) => a + b,
		0,
	);

	return SumOfSourceRevenue;
};
