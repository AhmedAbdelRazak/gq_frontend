/** @format */

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

export const getProducts = () => {
	return fetch(`${process.env.REACT_APP_API_URL}/products`, {
		method: "GET",
	})
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

export const readShippingOption = (shippingId) => {
	return fetch(`${process.env.REACT_APP_API_URL}/shipping/${shippingId}`, {
		method: "GET",
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const getSortedProducts = (sortBy) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/products?sortBy=${sortBy}&order=desc&limit=8`,
		{
			method: "GET",
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const readProduct = (productId) => {
	return fetch(`${process.env.REACT_APP_API_URL}/product/${productId}`, {
		method: "GET",
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

/** @format */

export const read = (userId, token) => {
	return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
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

export const update = (userId, token, user) => {
	return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(user),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const updateFromAdmin = (userId, token, user) => {
	return fetch(`${process.env.REACT_APP_API_URL}/user/admin/${userId}`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(user),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const getPurchaseHistory = (userId, token) => {
	return fetch(`${process.env.REACT_APP_API_URL}/orders/by/user/${userId}`, {
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

export const userlike = (userId, token, productId) => {
	return fetch(`${process.env.REACT_APP_API_URL}/user/like`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ userId, productId }),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const userunlike = (userId, token, productId) => {
	return fetch(`${process.env.REACT_APP_API_URL}/user/unlike`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ userId, productId }),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const updateUser = (user, next) => {
	if (typeof window !== "undefined") {
		if (localStorage.getItem("jwt")) {
			let auth = JSON.parse(localStorage.getItem("jwt"));
			auth.user = user;
			localStorage.setItem("jwt", JSON.stringify(auth));
			next();
		}
	}
};

export const productStar = (productId, star, token, email, userId) => {
	return fetch(
		`${process.env.REACT_APP_API_URL}/product/star/${productId}/${userId}`,
		{
			method: "PUT",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ productId, star, email, userId }),
		},
	)
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const comment = (userId, token, productId, comment, commentsPhotos) => {
	return fetch(`${process.env.REACT_APP_API_URL}/post/comment`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ userId, productId, comment, commentsPhotos }),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const uncomment = (userId, token, productId, comment) => {
	return fetch(`${process.env.REACT_APP_API_URL}/post/uncomment`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ userId, productId, comment }),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const like = (userId, token, productId) => {
	return fetch(`${process.env.REACT_APP_API_URL}/post/like`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ userId, productId }),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const unlike = (userId, token, productId) => {
	return fetch(`${process.env.REACT_APP_API_URL}/post/unlike`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ userId, productId }),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const views = (productId) => {
	return fetch(`${process.env.REACT_APP_API_URL}/views`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ productId }),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
};

export const viewsCounter = (productId, counter) => {
	return fetch(`${process.env.REACT_APP_API_URL}/viewscounter`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ productId, counter }),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
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

export const gettingAllProducts = (
	filterBy,
	urlFilters,
	setAllProducts,
	setAllCategories,
	setAllSubcategories,
	setAllSizes,
	setAllProductColors,
	setAllGenders,
	setSelectedPriceRange,
	setMinPrice,
	setMaxPrice,
) => {
	getProducts().then((data) => {
		if (data.error) {
			console.log(data.error);
		} else {
			if (filterBy === "gender") {
				setAllProducts(
					data
						.filter((i) => i.activeProduct === true)
						.filter(
							(iii) =>
								iii.gender.genderName.toLowerCase() ===
								urlFilters.toLowerCase(),
						),
				);
			} else if (filterBy === "category") {
				setAllProducts(
					data
						.filter((i) => i.activeProduct === true)
						.filter(
							(iii) =>
								iii.category.categorySlug.toLowerCase() ===
								urlFilters.toLowerCase(),
						),
				);
			} else if (filterBy === "subcategory") {
				setAllProducts(
					data
						.filter((i) => i.activeProduct === true)
						.filter(
							(iii) =>
								iii.subcategory
									.map((iiii) => iiii.SubcategorySlug)
									.indexOf(urlFilters.toLowerCase()) !== -1,
						),
				);
			} else {
				setAllProducts(data.filter((i) => i.activeProduct === true));
			}

			//Categories Unique
			// var categoriesArray = data
			// 	.filter((i) => i.activeProduct === true)
			// 	.map((ii) => ii.category);

			// let uniqueCategories = [
			// 	...new Map(
			// 		categoriesArray.map((item) => [item["categoryName"], item]),
			// 	).values(),
			// ];
			// setAllCategories(uniqueCategories);

			if (filterBy === "gender") {
				// eslint-disable-next-line
				var categoriesArray = data
					.filter((i) => i.activeProduct === true)
					.filter(
						(iii) =>
							iii.gender.genderName.toLowerCase() === urlFilters.toLowerCase(),
					)
					.filter((i) => i.activeProduct === true)
					.map((ii) => ii.category);

				let uniqueCategories = [
					...new Map(
						categoriesArray.map((item) => [item["categoryName"], item]),
					).values(),
				];
				setAllCategories(uniqueCategories);
			} else if (filterBy === "category") {
				// eslint-disable-next-line
				var categoriesArray = data
					.filter((i) => i.activeProduct === true)
					.filter(
						(iii) =>
							iii.category.categorySlug.toLowerCase() ===
							urlFilters.toLowerCase(),
					)
					.filter((i) => i.activeProduct === true)
					.map((ii) => ii.category);

				let uniqueCategories = [
					...new Map(
						categoriesArray.map((item) => [item["categoryName"], item]),
					).values(),
				];
				setAllCategories(uniqueCategories);
			} else if (filterBy === "subcategory") {
				// eslint-disable-next-line
				var categoriesArray = data
					.filter((i) => i.activeProduct === true)
					.filter(
						(iii) =>
							iii.subcategory
								.map((iiii) => iiii.SubcategorySlug)
								.indexOf(urlFilters.toLowerCase()) !== -1,
					)
					.filter((i) => i.activeProduct === true)
					.map((ii) => ii.category);

				let uniqueCategories = [
					...new Map(
						categoriesArray.map((item) => [item["categoryName"], item]),
					).values(),
				];
				setAllCategories(uniqueCategories);
			} else {
				// eslint-disable-next-line
				var categoriesArray = data
					.filter((i) => i.activeProduct === true)
					.map((ii) => ii.category);

				let uniqueCategories = [
					...new Map(
						categoriesArray.map((item) => [item["categoryName"], item]),
					).values(),
				];
				setAllCategories(uniqueCategories);
			}

			///

			//Subcategories Unique
			var SubcategoriesArray = data
				.filter((i) => i.activeProduct === true)
				.map((ii) => ii.subcategory);

			var mergedSubcategories = [].concat.apply([], SubcategoriesArray);
			let uniqueSubcategories = [
				...new Map(
					mergedSubcategories.map((item) => [item["SubcategoryName"], item]),
				).values(),
			];
			setAllSubcategories(uniqueSubcategories);

			//Gender Unique
			var genderUnique = data
				.filter((i) => i.activeProduct === true)
				.map((ii) => ii.gender);

			let uniqueGenders = [
				...new Map(
					genderUnique.map((item) => [item["genderName"], item]),
				).values(),
			];
			setAllGenders(uniqueGenders);

			//Unique Sizes
			const allSizes = data
				.filter((i) => i.activeProduct === true)
				.map((i) => i.productAttributes.map((ii) => ii.size));

			var mergedSizes = [].concat.apply([], allSizes);

			let uniqueSizes = [
				...new Map(mergedSizes.map((item) => [item, item])).values(),
			];
			setAllSizes(uniqueSizes);

			//Unique Colors
			const allColorsCombined = data
				.filter((i) => i.activeProduct === true)
				.map((i) => i.productAttributes.map((ii) => ii.color));

			var mergedColors = [].concat.apply([], allColorsCombined);

			let uniqueColors = [
				...new Map(mergedColors.map((item) => [item, item])).values(),
			];

			setAllProductColors(uniqueColors);

			//Unique Prices
			const allPricesCombined = data
				.filter((i) => i.activeProduct === true)
				.map((i) => i.productAttributes.map((ii) => ii.priceAfterDiscount));

			var mergedPrices = [].concat.apply([], allPricesCombined);

			let uniquePrices = [
				...new Map(mergedPrices.map((item) => [item, item])).values(),
			];

			setMinPrice(Math.min(...uniquePrices));
			setMaxPrice(Math.max(...uniquePrices));

			setSelectedPriceRange([
				Math.min(...uniquePrices),
				Math.max(...uniquePrices),
			]);
		}
	});
};
