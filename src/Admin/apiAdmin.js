/** @format */

import axios from "axios";

/**Gender */
export const createGender = (userId, token, gender) => {
	return fetch(`${process.env.REACT_APP_API_URL}/gender/create/${userId}`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(gender),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
};

export const updateGender = (genderId, userId, token, gender) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/gender/${genderId}/${userId}`,
		{
			method: "PUT",
			headers: {
				// content type?
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(gender),
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const removeGender = (genderId, userId, token) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/gender/${genderId}/${userId}`,
		{
			method: "DELETE",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const getGenders = (token) => {
	return fetch(`${process.env.REACT_APP_API_URL}/genders`, {
		method: "GET",
		headers: {
			// content type?
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};
/**End Gender */

/**
 * Category
 * */

export const createCategory = (userId, token, category) => {
	return fetch(`${process.env.REACT_APP_API_URL}/category/create/${userId}`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(category),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
};

export const updateCategory = (categoryId, userId, token, category) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/category/${categoryId}/${userId}`,
		{
			method: "PUT",
			headers: {
				// content type?
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(category),
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const removeCategory = (categoryId, userId, token) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/category/${categoryId}/${userId}`,
		{
			method: "DELETE",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const getCategories = (token) => {
	return fetch(`${process.env.REACT_APP_API_URL}/categories`, {
		method: "GET",
		headers: {
			// content type?
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

/**End Category */

/**Start Subcategories */
export const getSubCategories = (token) => {
	return fetch(`${process.env.REACT_APP_API_URL}/subcategories`, {
		method: "GET",
		headers: {
			// content type?
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const createSubcategory = (userId, token, subcategory) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/subcategory/create/${userId}`,
		{
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(subcategory),
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
};

export const updateSubcategory = (
	subcategoryId,
	userId,
	token,
	subcategory,
) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/subcategory/${subcategoryId}/${userId}`,
		{
			method: "PUT",
			headers: {
				// content type?
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(subcategory),
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const removeSubcategory = (subcategoryId, userId, token) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/subcategory/${subcategoryId}/${userId}`,
		{
			method: "DELETE",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const getListOfSubs = (_id) => {
	return fetch(`${process.env.REACT_APP_API_URL}/category/subs/${_id}`, {
		method: "GET",
		headers: {
			// content type?
			"Content-Type": "application/json",
			Accept: "application/json",
		},
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

/**End Subcategory */

export const cloudinaryUpload1 = (userId, token, image) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/admin/uploadimages/${userId}`,
		{
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(image),
			// body: image,
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
};

/**Start Product */

export const createProduct = (userId, token, product) => {
	return fetch(`${process.env.REACT_APP_API_URL}/product/create/${userId}`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(product),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
};

export const getProducts = () => {
	return fetch(`${process.env.REACT_APP_API_URL}/products`, {
		method: "GET",
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const updateProduct = (productId, userId, token, product) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/product/${productId}/${userId}`,
		{
			method: "PUT",
			headers: {
				// content type?
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(product),
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const removeProduct = (productId, userId, token) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/product/${productId}/${userId}`,
		{
			method: "DELETE",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

/**End Of Product */

/**Orders Management */

export const createOrder = (userId, token, createOrderData) => {
	return fetch(`${process.env.REACT_APP_API_URL}/order/create/${userId}`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ order: createOrderData }),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const listOrders = (userId, token) => {
	return fetch(`${process.env.REACT_APP_API_URL}/order/list/${userId}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const ordersLength = (userId, token) => {
	return fetch(`${process.env.REACT_APP_API_URL}/order/length/${userId}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const listOrdersDates = (userId, token, day1, day2) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/order/list/dates/${day1}/${day2}/${userId}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
			// body: JSON.stringify(today),
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const listOrdersWeekly = (userId, token) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/orders/orderslist/weekly/${userId}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
			// body: JSON.stringify(today),
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const listOrders30Days = (userId, token) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/orders/orderslist/30days/${userId}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
			// body: JSON.stringify(today),
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const aggregateAllOrders = (userId, token) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/orders/orderslist/aggregateall/${userId}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
			// body: JSON.stringify(today),
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const listOrdersProcessing = (userId, token) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/order/list/order-processing/${userId}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const listOrdersReturn = (userId, token) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/order/list/order-return/${userId}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const listOrdersExchange = (userId, token) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/order/list/order-exchange/${userId}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const listOrdersProcessingDetermined = (userId, token, day1, day2) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/order/list/order-processing/${day1}/${day2}/${userId}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const listOrdersProcessed = (userId, token) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/order/list/order-processed/${userId}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const readSingleOrder = (userId, token, orderId) => {
	return fetch(`${process.env.REACT_APP_API_URL}/order/${orderId}/${userId}`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const readSingleOrderByInvoice = (userId, token, invoice) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/order/byinvoice/${invoice}/${userId}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const readSingleOrderByPhoneNumber = (userId, token, phoneNumber) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/order/byphone/${phoneNumber}/${userId}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const updateOrder = (orderId, userId, token, order) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/update/order/${orderId}/${userId}`,
		{
			method: "PUT",
			headers: {
				// content type?
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ order: order }),
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const updateOrderNoDecrease = (orderId, userId, token, order) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/update/order/nodecrease/${orderId}/${userId}`,
		{
			method: "PUT",
			headers: {
				// content type?
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ order: order }),
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const updateOrderExchange = (orderId, userId, token, order) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/update/order-exchange/${orderId}/${userId}`,
		{
			method: "PUT",
			headers: {
				// content type?
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ order: order }),
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const updateOrderExchangeAndReturn = (orderId, userId, token, order) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/update/order-exchange-return/${orderId}/${userId}`,
		{
			method: "PUT",
			headers: {
				// content type?
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ order: order }),
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const updateOrderExchangeRevert = (orderId, userId, token, order) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/revert/order-exchange-revert/${orderId}/${userId}`,
		{
			method: "PUT",
			headers: {
				// content type?
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ order: order }),
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const listOfOrdersFiltered = (userId, token, limit) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/order/get-limited/orders/${userId}`,
		{
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ limit: limit }),
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

/**End Of Orders Management*/

export const createShippingOptions = (userId, token, shippingOptions) => {
	return fetch(`${process.env.REACT_APP_API_URL}/shipping/create/${userId}`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(shippingOptions),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
};

export const updateShippingOptions = (
	shippingId,
	userId,
	token,
	shippingOptions,
) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/shipping/${shippingId}/${userId}`,
		{
			method: "PUT",
			headers: {
				// content type?
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(shippingOptions),
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const getShippingOptions = (token) => {
	return fetch(`${process.env.REACT_APP_API_URL}/shipping-options`, {
		method: "GET",
		headers: {
			// content type?
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const removeShippingOption = (shippingId, userId, token) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/shipping-carrier/${shippingId}/${userId}`,
		{
			method: "DELETE",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const getAllUsers = (userId, token) => {
	return fetch(`${process.env.REACT_APP_API_URL}/allusers/${userId}`, {
		method: "GET",
		headers: {
			// content type?
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const updateUserByAdmin = (updatedUserId, userId, token, user) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/user/${updatedUserId}/${userId}`,
		{
			method: "PUT",
			headers: {
				// content type?
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ updatedUserByAdmin: user }),
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const removeOrder = (orderId, userId, token) => {
	return fetch(`${process.env.REACT_APP_API_URL}/order/${orderId}/${userId}`, {
		method: "DELETE",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const updateOrderInvoice = (userId, token, orderId, invoiceNumber) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/order/${orderId}/invoice/${userId}`,
		{
			method: "PUT",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ invoiceNumber, orderId }),
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const updateOrderInvoiceStock = (
	userId,
	token,
	orderId,
	order,
	invoiceNumber,
	onholdStatus,
) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/order/${orderId}/invoice/stock/${userId}`,
		{
			method: "PUT",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ invoiceNumber, orderId, order, onholdStatus }),
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

/**
 * Attributes Management
 * */

export const createColor = (userId, token, color) => {
	return fetch(`${process.env.REACT_APP_API_URL}/color/create/${userId}`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(color),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
};

export const createSize = (userId, token, size) => {
	return fetch(`${process.env.REACT_APP_API_URL}/size/create/${userId}`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(size),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
};

export const getColors = (token) => {
	return fetch(`${process.env.REACT_APP_API_URL}/colors`, {
		method: "GET",
		headers: {
			// content type?
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const getSizes = (token) => {
	return fetch(`${process.env.REACT_APP_API_URL}/sizes`, {
		method: "GET",
		headers: {
			// content type?
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

/**End Attributes Management */

/**
 * Store Management
 * */

export const createStore = (userId, token, store) => {
	return fetch(`${process.env.REACT_APP_API_URL}/store/create/${userId}`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(store),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
};

export const updateStore = (storeId, userId, token, store) => {
	return fetch(`${process.env.REACT_APP_API_URL}/store/${storeId}/${userId}`, {
		method: "PUT",
		headers: {
			// content type?
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(store),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const removeStore = (storeId, userId, token) => {
	return fetch(`${process.env.REACT_APP_API_URL}/store/${storeId}/${userId}`, {
		method: "DELETE",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const getStores = (token) => {
	return fetch(`${process.env.REACT_APP_API_URL}/stores`, {
		method: "GET",
		headers: {
			// content type?
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

/**End Store Management */

// Loyalty Points

export const allLoyaltyPointsAndStoreStatus = (token) => {
	return fetch(`${process.env.REACT_APP_API_URL}/store-management`, {
		method: "GET",
		headers: {
			// content type?
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const LoyaltyPointsAndStoreStatus = (userId, token, StoreManagement) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/store-management/create/${userId}`,
		{
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(StoreManagement),
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
};

// End Of Loyalty Points

// Ads Management
export const createAds = (userId, token, ads) => {
	return fetch(`${process.env.REACT_APP_API_URL}/ads/create/${userId}`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(ads),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
};

export const updateAds = (addsId, userId, token, ads) => {
	return fetch(`${process.env.REACT_APP_API_URL}/ads/${addsId}/${userId}`, {
		method: "PUT",
		headers: {
			// content type?
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(ads),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const getAllAds = (token) => {
	return fetch(`${process.env.REACT_APP_API_URL}/all-adds`, {
		method: "GET",
		headers: {
			// content type?
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

// End of Ads Management

// Hero Comp Management
export const createHero = (userId, token, hero) => {
	return fetch(`${process.env.REACT_APP_API_URL}/hero/create/${userId}`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(hero),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
};

export const updateHero = (addsId, userId, token, hero) => {
	return fetch(`${process.env.REACT_APP_API_URL}/hero/${addsId}/${userId}`, {
		method: "PUT",
		headers: {
			// content type?
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(hero),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const getAllHeros = (token) => {
	return fetch(`${process.env.REACT_APP_API_URL}/heroes`, {
		method: "GET",
		headers: {
			// content type?
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

// End of Ads Management

export const getCoupons = async () =>
	await axios.get(`${process.env.REACT_APP_API_URL}/coupons`);

export const createCoupon = (userId, token, name, expiry, discount) => {
	return fetch(`${process.env.REACT_APP_API_URL}/coupon/create/${userId}`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(name, expiry, discount),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
};

export const removeCoupon = (couponId, userId, token) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/coupon/${couponId}/${userId}`,
		{
			method: "DELETE",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const aceOrders = (userId, token, day1, day2) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/ace/orderslist/dates/${day1}/${day2}/${userId}`,
		{
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
			// body: JSON.stringify(today),
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const createContact = (userId, token, contact) => {
	return fetch(`${process.env.REACT_APP_API_URL}/contact/create/${userId}`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(contact),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
};

export const updateContact = (contactId, userId, token, contact) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/contact/${contactId}/${userId}`,
		{
			method: "PUT",
			headers: {
				// content type?
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(contact),
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const getContacts = (token) => {
	return fetch(`${process.env.REACT_APP_API_URL}/contact`, {
		method: "GET",
		headers: {
			// content type?
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const createAbout = (userId, token, about) => {
	return fetch(`${process.env.REACT_APP_API_URL}/about/create/${userId}`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(about),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
};

export const updateAbout = (aboutId, userId, token, about) => {
	return fetch(`${process.env.REACT_APP_API_URL}/about/${aboutId}/${userId}`, {
		method: "PUT",
		headers: {
			// content type?
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(about),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const getAbouts = (token) => {
	return fetch(`${process.env.REACT_APP_API_URL}/about`, {
		method: "GET",
		headers: {
			// content type?
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const receiveNew = (userId, token, receiving) => {
	return fetch(`${process.env.REACT_APP_API_URL}/receiving/create/${userId}`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(receiving),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
};

export const getReceivingLogs = (token) => {
	return fetch(`${process.env.REACT_APP_API_URL}/receivings`, {
		method: "GET",
		headers: {
			// content type?
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const CreateShippingTN = (
	userId,
	token,
	order,
	setAramexResponse,
	allInvoices,
	updateCustomerDetails,
) => {
	const invoiceIndex = allInvoices.indexOf(order.invoiceNumber);

	const transFees = Number(
		(Number(order.totalAmount) - Number(order.shippingFees)) * 0.01,
	).toFixed(2);

	const AramexObject = {
		ClientInfo: {
			UserName: process.env.REACT_APP_ARAMEX_USERNAME_PROD,
			Password: process.env.REACT_APP_ARAMEX_PASSWORD_PROD,
			Version: "v1",
			AccountNumber: process.env.REACT_APP_ACCOUNT_NUMBER_PROD,
			AccountPin: process.env.REACT_APP_ACCOUNT_PIN_PROD,
			AccountEntity: "CAI",
			AccountCountryCode: "EG",
			Source: 24,
		},
		LabelInfo: null,
		Shipments: [
			{
				Reference1:
					invoiceIndex === -1 ? order.invoiceNumber : order.invoiceNumber,
				Reference2: "",
				Reference3: "",
				Shipper: {
					Reference1: order.orderSource,
					Reference2: "GQ",
					AccountNumber: process.env.REACT_APP_ACCOUNT_NUMBER_PROD,
					PartyAddress: {
						Line1: "العجمي -البيطاش-الحنفية",
						Line2: "",
						Line3: "",
						City: "Alexandria",
						StateOrProvinceCode: "",
						PostCode: "",
						CountryCode: "EG",
						Longitude: 0,
						Latitude: 0,
						BuildingNumber: null,
						BuildingName: null,
						Floor: null,
						Apartment: null,
						POBox: null,
						Description: null,
					},
					Contact: {
						Department: "Operations",
						PersonName: order.orderSource,
						Title: "",
						CompanyName: order.orderSource,
						PhoneNumber1: "01208543945",
						PhoneNumber1Ext: "",
						PhoneNumber2: "",
						PhoneNumber2Ext: "",
						FaxNumber: "",
						CellPhone: "01208543945",
						EmailAddress: process.env.REACT_APP_ARAMEX_USERNAME_PROD,
						Type: "",
					},
				},
				Consignee: {
					Reference1:
						invoiceIndex === -1 ? order.invoiceNumber : order.invoiceNumber,
					Reference2: "",
					AccountNumber: process.env.REACT_APP_ACCOUNT_NUMBER_PROD,
					PartyAddress: {
						Line1: updateCustomerDetails.address,
						Line2: "",
						Line3: "",
						City: updateCustomerDetails.cityName,
						StateOrProvinceCode: updateCustomerDetails.city,
						PostCode: "",
						CountryCode: "EG",
						Longitude: 0,
						Latitude: 0,
						BuildingNumber: "",
						BuildingName: "",
						Floor: "",
						Apartment: "",
						POBox: null,
						Description: "",
						CellPhone: updateCustomerDetails.phone
							? updateCustomerDetails.phone
							: "",
					},
					Contact: {
						Department: "Source, Ads",
						PersonName: updateCustomerDetails.fullName,
						Title: "",
						CompanyName: "Customer",
						PhoneNumber1: updateCustomerDetails.phone,
						PhoneNumber1Ext: "",
						PhoneNumber2: "",
						PhoneNumber2Ext: "",
						FaxNumber: "",
						CellPhone: updateCustomerDetails.phone
							? updateCustomerDetails.phone
							: "",
						EmailAddress: updateCustomerDetails.email
							? updateCustomerDetails.email
							: "",
						Type: "",
					},
				},
				ThirdParty: {
					Reference1: "",
					Reference2: "",
					AccountNumber: process.env.REACT_APP_ACCOUNT_NUMBER_PROD,
					PartyAddress: {
						Line1: updateCustomerDetails.address,
						Line2: "",
						Line3: "",
						City: "",
						StateOrProvinceCode: "",
						PostCode: "",
						CountryCode: "",
						Longitude: 0,
						Latitude: 0,
						BuildingNumber: null,
						BuildingName: null,
						Floor: null,
						Apartment: null,
						POBox: null,
						Description: null,
						CellPhone: updateCustomerDetails.phone
							? updateCustomerDetails.phone
							: "",
					},
					Contact: {
						Department: "",
						PersonName: "",
						Title: "",
						CompanyName: "",
						PhoneNumber1: updateCustomerDetails.phone,
						PhoneNumber1Ext: "",
						PhoneNumber2: "",
						PhoneNumber2Ext: "",
						FaxNumber: "",
						CellPhone: updateCustomerDetails.phone
							? updateCustomerDetails.phone
							: "",
						EmailAddress: updateCustomerDetails.email
							? updateCustomerDetails.email
							: "",
						Type: "",
					},
				},
				ShippingDateTime:
					"/Date(" + Date.parse(new Date().toLocaleDateString()) + ")/",
				DueDate: "/Date(" + Date.parse(new Date().toLocaleDateString()) + ")/",
				Comments: updateCustomerDetails.orderComment,
				PickupLocation: "",
				OperationsInstructions: "",
				AccountingInstrcutions: "",
				Details: {
					Dimensions: null,
					ActualWeight: {
						Unit: "KG",
						Value: 0.3,
					},
					ChargeableWeight: null,
					DescriptionOfGoods:
						order.chosenProductQtyWithVariables[0][0].SubSKU +
						" " +
						order.chosenProductQtyWithVariables[0][0].productName,
					GoodsOriginCountry: "EG",
					// NumberOfPieces: order.totalOrderedQty,
					NumberOfPieces: 1,
					ProductGroup: "DOM",
					ProductType: "CDS",
					PaymentType: "P",
					PaymentOptions: "",
					CustomsValueAmount: null,
					CashOnDeliveryAmount: {
						Value: Number(
							Number(order.totalAmountAfterDiscount) + Number(transFees),
						).toFixed(2),
						CurrencyCode: "EGP",
					},
					InsuranceAmount: null,
					CashAdditionalAmount: null,
					CashAdditionalAmountDescription: "",
					CollectAmount: null,
					Services: "CODS",
					Items: [],
				},
				Attachments: [],
				ForeignHAWB: "",
				TransportType: 0,
				PickupGUID: "",
				Number: null,
				ScheduledDelivery: null,
			},
		],
		Transaction: {
			Reference1: "",
			Reference2: "",
			Reference3: "",
			Reference4: "",
			Reference5: "",
		},
	};
	return fetch(`${process.env.REACT_APP_API_URL}/aramex/${userId}`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(AramexObject),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		})
		.then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAramexResponse(data);

				return fetch(
					`${process.env.REACT_APP_API_URL}/update/order/${order._id}/${userId}`,
					{
						method: "PUT",
						headers: {
							// content type?
							"Content-Type": "application/json",
							Accept: "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({
							order: {
								...order,
								aramexResponse: data,
								customerDetails: updateCustomerDetails,
								trackingNumber: data.Shipments[0].ID,
							},
						}),
					},
				)
					.then((response2) => {
						window.location.reload(false);
						return response2.json();
					})
					.catch((err2) => console.log(err2));
			}
		});
};

export const getShippingLabel = (userId, token, order) => {
	const AramexObject = {
		ClientInfo: {
			UserName: process.env.REACT_APP_ARAMEX_USERNAME_PROD,
			Password: process.env.REACT_APP_ARAMEX_PASSWORD_PROD,
			Version: "v1",
			AccountNumber: process.env.REACT_APP_ACCOUNT_NUMBER_PROD,
			AccountPin: process.env.REACT_APP_ACCOUNT_PIN_PROD,
			AccountEntity: "CAI",
			AccountCountryCode: "EG",
			Source: 24,
		},
		LabelInfo: {
			ReportID: 9729,
			ReportType: "URL",
		},
		OriginEntity: "AMM",
		ProductGroup: "DOM",
		ShipmentNumber: order.trackingNumber,
		Transaction: {
			Reference1: "",
			Reference2: "",
			Reference3: "",
			Reference4: "",
			Reference5: "",
		},
	};
	return fetch(`${process.env.REACT_APP_API_URL}/aramex/printlabel/${userId}`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(AramexObject),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
};

export const getTrackingDetails = (userId, token, order) => {
	console.log(order.trackingNumber, "from tracking Details");
	const AramexObject = {
		ClientInfo: {
			UserName: process.env.REACT_APP_ARAMEX_USERNAME_PROD,
			Password: process.env.REACT_APP_ARAMEX_PASSWORD_PROD,
			Version: "v1",
			AccountNumber: process.env.REACT_APP_ACCOUNT_NUMBER_PROD,
			AccountPin: process.env.REACT_APP_ACCOUNT_PIN_PROD,
			AccountEntity: "CAI",
			AccountCountryCode: "EG",
			Source: 24,
		},
		GetLastTrackingUpdateOnly: false,
		Shipments: [order.trackingNumber],
		Transaction: {
			Reference1: "",
			Reference2: "",
			Reference3: "",
			Reference4: "",
			Reference5: "",
		},
	};
	return fetch(
		`${process.env.REACT_APP_API_URL}/aramex/trackingDetails/${userId}`,
		{
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(AramexObject),
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => {
			console.log(err);
		});
};
