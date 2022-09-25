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
import OrderTakerRoute from "./auth/OrderTakerRoute";
import CreateNewOrderOrderTaker from "./OrderTaker/Orders/CreateNewOrder/CreateNewOrderOrderTaker";
import OrdersHistOrderTaker from "./OrderTaker/Orders/OrdersHistOrderTaker";
import SingleOrderPageOrderTaker from "./OrderTaker/Orders/SingleOrderPageOrderTaker";
import CreateColor from "./Admin/Attributes/CreateColor";
import CreateSize from "./Admin/Attributes/CreateSize";
import UpdateProductOrderTaker from "./OrderTaker/Orders/ProductsDetails/UpdateProductOrderTaker";

const App = () => {
	// eslint-disable-next-line
	const [click, setClick] = useState(false);
	const [clickMenu, setClickMenu] = useState(false);
	// eslint-disable-next-line
	const [language, setLanguage] = useState("English");

	useEffect(() => {
		setClickMenu(click);
		// eslint-disable-next-line
	}, [click, clickMenu]);

	useEffect(() => {
		ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_MEASUREMENTID);
		// To Report Page View
		ReactGA.pageview(window.location.pathname + window.location.search);

		setLanguage("English");

		// eslint-disable-next-line
	}, []);

	return (
		<BrowserRouter>
			<ToastContainer />

			<Switch>
				<Route path='/' exact component={Login} />
				<Route path='/signup' exact component={Register} />
				<AdminRoute path='/admin/dashboard' exact component={AdminDashboard} />
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

				<AdminRoute path='/admin/add-category' exact component={AddCategory} />

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
				<AdminRoute path='/admin/orders-hist' exact component={OrdersHist} />
				<AdminRoute
					path='/admin/single-order/:orderId'
					exact
					component={SingleOrderPage}
				/>
				<AdminRoute path='/admin/add-employee' exact component={AddEmployee} />
				<AdminRoute path='/admin/gq-reports' exact component={MainReports} />
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

				<OrderTakerRoute
					path='/order-taker/create-new-order'
					exact
					component={CreateNewOrderOrderTaker}
				/>

				<OrderTakerRoute
					path='/order-taker/orders-hist'
					exact
					component={OrdersHistOrderTaker}
				/>
				<OrderTakerRoute
					path='/order-taker/single-order/:orderId'
					exact
					component={SingleOrderPageOrderTaker}
				/>

				<OrderTakerRoute
					path='/order-taker/update-product'
					exact
					component={UpdateProductOrderTaker}
				/>
			</Switch>
			<Footer />
		</BrowserRouter>
	);
};

export default App;
