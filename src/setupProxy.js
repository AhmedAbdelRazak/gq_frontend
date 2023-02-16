/** @format */

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
	// app.use("", (req, res, next) => {
	// 	res.header("Access-Control-Allow-Origin", "*");
	// 	next();
	// });
	// app.use("", (req, res, next) => {
	// 	res.header("Content-Type", "application/json");
	// 	next();
	// });

	app.use(
		"/ShippingAPI.V2/Shipping/Service_1_0.svc/json/CreateShipments",
		createProxyMiddleware({
			target: "https://ws.dev.aramex.net", // API endpoint 2
			changeOrigin: true,
			secure: false,
		}),
	);
};
