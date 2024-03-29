/** @format */

import React, { useEffect, useState } from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "antd/dist/antd.min.css";
import ReactGA from "react-ga";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Footer from "./Footer";
import AdminRoute from "./auth/AdminRoute";
import AdminDashboard from "./Admin/AdminDashboard";
import AddGender from "./Admin/Gender/AddGender";
import UpdateGender from "./Admin/Gender/UpdateGender";
import UpdateGenderSingle from "./Admin/Gender/UpdateGenderSingle";
import DeleteGender from "./Admin/Gender/DeleteGender";
import AddCategory from "./Admin/Categories/AddCategory";
import UpdateCategory from "./Admin/Categories/UpdateCategory";
import UpdateCategorySingle from "./Admin/Categories/UpdateCategorySingle";
import DeleteCategory from "./Admin/Categories/DeleteCategory";
import AddProduct from "./Admin/Product/AddingProduct/AddProduct";
import UpdateProduct from "./Admin/Product/UpdatingProduct/UpdateProduct";
import UpdateProductSingle from "./Admin/Product/UpdatingProduct/UpdateProductSingle";
import DeleteProduct from "./Admin/Product/DeleteProduct";
import AddSubcategory from "./Admin/Subcategory/AddSubcategory";
// eslint-disable-next-line
import UpdateSubcategory from "./Admin/Subcategory/UpdateSubcategory";
import UpdateSubcategorySingle from "./Admin/Subcategory/UpdateSubcategorySingle";
import DeleteSubcategory from "./Admin/Subcategory/DeleteSubcategory";
import CreateNewOrder from "./Admin/Orders/CreateNewOrder/CreateNewOrder";
import AddShippingOptions from "./Admin/Orders/ShippingOptions/AddShippingOptions";
import UpdateShippingOptions from "./Admin/Orders/ShippingOptions/UpdateShippingOptions";
import UpdateShippingOptionsSingle from "./Admin/Orders/ShippingOptions/UpdateShippingOptionsSingle";
import DeleteShippOptions from "./Admin/Orders/ShippingOptions/DeleteShippOptions";
import OrdersHist from "./Admin/Orders/OrdersHist";
import SingleOrderPage from "./Admin/Orders/SingleOrderPage";
import AddEmployee from "./Admin/Employees/AddEmployee";
import MainReports from "./Admin/GQShopReports/MainReports";
import UpdateEmployee from "./Admin/Employees/UpdateEmployee";
import UpdateEmployeeSingle from "./Admin/Employees/UpdateEmployeeSingle";
import CreateColor from "./Admin/Attributes/CreateColor";
import CreateSize from "./Admin/Attributes/CreateSize";
import AddStore from "./Admin/StoreManagement/AddStore";
import UpdateStore from "./Admin/StoreManagement/UpdateStore";
import DeleteStore from "./Admin/StoreManagement/DeleteStore";
import UpdateStoreSingle from "./Admin/StoreManagement/UpdateStoreSingle";
import OrderReturn from "./Admin/Orders/OrderReturn";
import OrdersList from "./Admin/Orders/OrdersList";
import OrderExchange from "./Admin/Orders/OrderExchange";
import OrderExchangeSingle from "./Admin/Orders/OrderExchangeSingle";
import ReturnList from "./Admin/Orders/ReturnList";
import ReturnDetails from "./Admin/Orders/ReturnDetails";
import StockReport from "./Admin/GQShopReports/StockReport";
import OnlineStoreManagement from "./Admin/OnlineStore/OnlineStoreManagement";
import AddTopAds from "./Admin/OnlineStore/AddTopAds";
import UpdateTopAds from "./Admin/OnlineStore/UpdateTopAds";
import OperationsReport from "./Admin/GQShopReports/OperationsReport";
import ReturnOrExchange from "./Admin/Orders/ReturnAndExchange/ReturnOrExchange";
import UpdateOrderMiscellaneous from "./Admin/Orders/CreateNewOrder/UpdateOrderMiscellaneous";
import ExchangeList from "./Admin/Orders/ExchangeList";
import ProductList from "./Admin/OnlineStore/ProductSpecsUpdate/ProductList";
import UpdateSpecs from "./Admin/OnlineStore/ProductSpecsUpdate/UpdateSpecs";
import CouponManagement from "./Admin/OnlineStore/CouponManagement";
import AceOrdersList from "./Admin/OnlineStore/AceOrdersList";

//Store
import NavbarTop from "./Navbar/NavbarTop";
import NavbarBottom from "./Navbar/NavbarBottom";
import NavbarAds from "./Navbar/NavbarAds";
import { getAllAds } from "./Admin/apiAdmin";
import AddHeroComp from "./Admin/OnlineStore/AddHeroComp";

import InvoicePDF from "./Admin/Orders/InvoicePDF";
import EditWebsite from "./Admin/OnlineStore/OnlineStorePages/EditWebsite";
import EditAboutUsPage from "./Admin/OnlineStore/OnlineStorePages/EditAboutUsPage";
import EditContactUsPage from "./Admin/OnlineStore/OnlineStorePages/EditContactUsPage";
import AceReceiving from "./Admin/OnlineStore/AceReceiving";
import OnsiteOrderTaking from "./Admin/OnlineStore/OnsiteOrderTaking/OnsiteOrderTaking";
import PrintBarcodes from "./Admin/OnlineStore/PrintBarcodes/PrintBarcodes";
import SingleBarcodePage from "./Admin/OnlineStore/PrintBarcodes/SingleBarcodePage";
import Inventory from "./Admin/OnlineStore/Inventory/Inventory";
import EmployeeShare from "./Admin/GQShopReports/EmployeeShare";
import AceReceivingLog from "./Admin/OnlineStore/AceReceivingLog";
import PrintBarcodesMain from "./Admin/OnlineStore/PrintBarcodes/BarcodesUpdate/PrintBarcodesMain";
import Receiving from "./Admin/GQReceiving/Receiving";
import AdminDashboard2 from "./Admin/AdminDashboard2";
import ReceivingLog from "./Admin/GQReceiving/ReceivingLog";
import SalesReportMain from "./Admin/GQShopReports/SalesReport/SalesReportMain";
import AddAccountTable from "./Admin/GQFinancialAffairs/AddingTables/AddAccountTable";
import FinanceMainDashboard from "./Admin/GQFinancialAffairs/FinanceMainDashboard";
import FinanceMainReport from "./Admin/GQFinancialAffairs/FinanceReports/FinanceMainReport";
import AddVendor from "./Admin/GQFinancialAffairs/AddingVendors/AddVendor";
import Billing from "./Admin/GQFinancialAffairs/Billing";
import InvoicePDF2 from "./Admin/Orders/InvoicePDF2";

const App = () => {
	// eslint-disable-next-line
	const [language, setLanguage] = useState("English");
	const [allAdsCombined, setAllAdsCombined] = useState([]);

	useEffect(() => {
		ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_MEASUREMENTID);
		// To Report Page View
		ReactGA.pageview(window.location.pathname + window.location.search);

		setLanguage("English");

		// eslint-disable-next-line
	}, []);

	const languageToggle = () => {
		console.log(language);
		localStorage.setItem("lang", JSON.stringify(language));
		// window.location.reload(false);
	};

	useEffect(() => {
		languageToggle();
		// eslint-disable-next-line
	}, [language]);

	const gettingAllAds = () => {
		getAllAds().then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllAdsCombined(data[data.length - 1] && data[data.length - 1]);
			}
		});
	};

	useEffect(() => {
		// if (
		// 	isAuthenticated() &&
		// 	isAuthenticated().user &&
		// 	!window.location.pathname.includes("admin")
		// ) {
		// 	window.location.href = `${process.env.REACT_APP_MAIN_URL}/admin/dashboard`;
		// } else {
		// 	return null;
		// }

		gettingAllAds();
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (window.location.pathname.includes("/checkout")) {
			return;
		} else {
			localStorage.removeItem("PaidNow");
			localStorage.removeItem("storedData");
			localStorage.removeItem("chosenShippingOption");
			localStorage.removeItem("orderDataStored");
		}

		// eslint-disable-next-line
	}, []);

	return (
		<BrowserRouter>
			<ToastContainer />
			{window.location.pathname.includes("admin") ||
			window.location.pathname === "/" ? null : allAdsCombined &&
			  allAdsCombined.show_ad ? (
				<>
					<NavbarAds />
				</>
			) : null}
			{window.location.pathname.includes("admin") ||
			window.location.pathname === "/" ? null : (
				<>
					<NavbarTop language={language} setLanguage={setLanguage} />

					<NavbarBottom chosenLanguage={language} />
				</>
			)}

			<Switch>
				<Route path='/' exact component={Login} />
				<Route path='/signup' exact component={Register} />

				<AdminRoute path='/admin/dashboard' exact component={AdminDashboard} />
				<AdminRoute
					path='/admin/dashboard2'
					exact
					component={AdminDashboard2}
				/>
				<AdminRoute
					path='/admin/receiving-log'
					exact
					component={ReceivingLog}
				/>
				<AdminRoute path='/admin/add-gender' exact component={AddGender} />
				<AdminRoute
					path='/admin/update-gender'
					exact
					component={UpdateGender}
				/>
				<AdminRoute
					path='/admin/update-gender/:genderId'
					exact
					component={UpdateGenderSingle}
				/>

				<AdminRoute
					path='/admin/delete-gender'
					exact
					component={DeleteGender}
				/>

				<AdminRoute path='/admin/receiving' exact component={Receiving} />
				<AdminRoute
					path='/admin/sales-report-main'
					exact
					component={SalesReportMain}
				/>

				<AdminRoute path='/admin/add-category' exact component={AddCategory} />
				<AdminRoute
					path='/admin/coupon-management'
					exact
					component={CouponManagement}
				/>
				<AdminRoute path='/admin/product-specs' exact component={ProductList} />
				<AdminRoute
					path='/admin/update-specs/:productId'
					exact
					component={UpdateSpecs}
				/>

				<AdminRoute
					path='/admin/update-category'
					exact
					component={UpdateCategory}
				/>

				<AdminRoute
					path='/admin/update-category/:categoryId'
					exact
					component={UpdateCategorySingle}
				/>

				<AdminRoute
					path='/admin/delete-category'
					exact
					component={DeleteCategory}
				/>

				<AdminRoute
					path='/admin/add-subcategory'
					exact
					component={AddSubcategory}
				/>

				<AdminRoute
					path='/admin/update-subcategory'
					exact
					component={UpdateSubcategory}
				/>

				<AdminRoute
					path='/admin/update-subcategory/:subcategoryId'
					exact
					component={UpdateSubcategorySingle}
				/>

				<AdminRoute
					path='/admin/delete-subcategory'
					exact
					component={DeleteSubcategory}
				/>

				<AdminRoute path='/admin/add-product' exact component={AddProduct} />

				<AdminRoute
					path='/admin/update-product'
					exact
					component={UpdateProduct}
				/>

				<AdminRoute
					path='/admin/update-product/:productId'
					exact
					component={UpdateProductSingle}
				/>

				<AdminRoute
					path='/admin/delete-product'
					exact
					component={DeleteProduct}
				/>

				<AdminRoute
					path='/admin/add-shipping-carrier'
					exact
					component={AddShippingOptions}
				/>

				<AdminRoute
					path='/admin/update-shipping-carrier'
					exact
					component={UpdateShippingOptions}
				/>

				<AdminRoute
					path='/admin/update-shipping-carrier/:shippingId'
					exact
					component={UpdateShippingOptionsSingle}
				/>

				<AdminRoute
					path='/admin/delete-shipping-carrier'
					exact
					component={DeleteShippOptions}
				/>

				<AdminRoute
					path='/admin/create-new-order'
					exact
					component={CreateNewOrder}
				/>

				<AdminRoute
					path='/admin/create-accounts'
					exact
					component={AddAccountTable}
				/>
				<AdminRoute path='/admin/add-vendors' exact component={AddVendor} />
				<AdminRoute path='/admin/account-billing' exact component={Billing} />

				<AdminRoute
					path='/admin/account-tree'
					exact
					component={FinanceMainDashboard}
				/>

				<AdminRoute
					path='/admin/single-report/:accountId/:report'
					exact
					component={FinanceMainReport}
				/>

				<AdminRoute
					path='/admin/update-miscellaneous-order/:orderId'
					exact
					component={UpdateOrderMiscellaneous}
				/>

				<AdminRoute path='/admin/orders-hist' exact component={OrdersHist} />
				<AdminRoute
					path='/admin/ace-orders-list'
					exact
					component={AceOrdersList}
				/>
				<AdminRoute
					path='/admin/ace-receiving'
					exact
					component={AceReceiving}
				/>
				<AdminRoute
					path='/admin/ace-receiving-log'
					exact
					component={AceReceivingLog}
				/>
				<AdminRoute
					path='/admin/ace-inventory-report'
					exact
					component={Inventory}
				/>
				<AdminRoute
					path='/admin/offline-order-taking'
					exact
					component={OnsiteOrderTaking}
				/>
				<AdminRoute
					path='/admin/print-barcodes/draft'
					exact
					component={PrintBarcodes}
				/>
				<AdminRoute
					path='/admin/print-barcodes'
					exact
					component={PrintBarcodesMain}
				/>
				<AdminRoute
					path='/admin/single-barcode/:sku'
					exact
					component={SingleBarcodePage}
				/>
				<AdminRoute
					path='/admin/single-order/:orderId'
					exact
					component={SingleOrderPage}
				/>
				<AdminRoute
					path='/admin/single-order/invoice/:orderId'
					exact
					component={InvoicePDF}
				/>
				<AdminRoute
					path='/admin/single-order/invoice2/:orderId'
					exact
					component={InvoicePDF2}
				/>

				<AdminRoute
					path='/admin/exchange-order/:orderId'
					exact
					component={OrderExchangeSingle}
				/>
				<AdminRoute path='/admin/add-employee' exact component={AddEmployee} />
				<AdminRoute
					path='/admin/gq-reports/sales'
					exact
					component={MainReports}
				/>
				<AdminRoute
					path='/admin/gq-reports/stock'
					exact
					component={StockReport}
				/>

				<AdminRoute
					path='/admin/gq-reports/operations'
					exact
					component={OperationsReport}
				/>
				<AdminRoute
					path='/admin/employee-share'
					exact
					component={EmployeeShare}
				/>
				<AdminRoute
					path='/admin/update-employee'
					exact
					component={UpdateEmployee}
				/>
				<AdminRoute
					path='/admin/update-employee/:userId'
					exact
					component={UpdateEmployeeSingle}
				/>
				<AdminRoute path='/admin/add-color' exact component={CreateColor} />
				<AdminRoute path='/admin/add-size' exact component={CreateSize} />

				<AdminRoute path='/admin/add-new-store' exact component={AddStore} />
				<AdminRoute path='/admin/order-return' exact component={OrderReturn} />
				<AdminRoute path='/admin/orders-list' exact component={OrdersList} />
				<AdminRoute path='/admin/return-list' exact component={ReturnList} />
				<AdminRoute
					path='/admin/exchange-list'
					exact
					component={ExchangeList}
				/>
				<AdminRoute
					path='/admin/return-details/:orderId'
					exact
					component={ReturnDetails}
				/>
				<AdminRoute
					path='/admin/order-exchange'
					exact
					component={OrderExchange}
				/>
				<AdminRoute
					path='/admin/exchange-or-return'
					exact
					component={ReturnOrExchange}
				/>

				<AdminRoute path='/admin/update-store' exact component={UpdateStore} />

				<AdminRoute
					path='/admin/update-store/:storeId'
					exact
					component={UpdateStoreSingle}
				/>

				<AdminRoute path='/admin/delete-store' exact component={DeleteStore} />

				<AdminRoute
					path='/admin/online-store-management'
					exact
					component={OnlineStoreManagement}
				/>

				<AdminRoute path='/admin/add-top-ads' exact component={AddTopAds} />
				<AdminRoute
					path='/admin/update-top-ads'
					exact
					component={UpdateTopAds}
				/>

				<AdminRoute path='/admin/add-hero-comp' exact component={AddHeroComp} />
				<AdminRoute path='/admin/website-edit' exact component={EditWebsite} />
				<AdminRoute
					path='/admin/website-edit/aboutus-edit'
					exact
					component={EditAboutUsPage}
				/>
				<AdminRoute
					path='/admin/website-edit/contactus-edit'
					exact
					component={EditContactUsPage}
				/>
			</Switch>
			<Footer />
		</BrowserRouter>
	);
};

export default App;
