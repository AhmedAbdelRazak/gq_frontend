/** @format */

import React, { useState, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import styled from "styled-components";
import { addItem, updateItem, removeItem } from "../../cartHelpers";
import { views, viewsCounter } from "../../apiCore";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { showAverageRating2 } from "../SingleProduct/Rating";
import { useCartContext } from "../../checkout/cart_context";

const CardForRelatedProducts = ({
	product,
	chosenLanguage,
	// eslint-disable-next-line
	showViewProductButton = true,
	showAddToCartButton = true,
	cartUpdate = false,
	showRemoveProductButton = false,
	setRun = (f) => f,
	run = undefined,
	// changeCartSize
}) => {
	const [redirect, setRedirect] = useState(false);
	const [count, setCount] = useState(product.count);
	// eslint-disable-next-line
	const [viewss, setViewss] = useState(0);
	// eslint-disable-next-line
	const [viewsCounterr, setViewsCounterr] = useState(0);

	const SettingViews = () => {
		const productId = product && product._id;
		const viewsLength = product && product.views && product.views.length + 1;

		views(productId).then((data) => {
			setViewss(data.views.length);
		});
		viewsCounter(productId, viewsLength).then((data) => {
			setViewsCounterr(data.views.length);
		});
		// window.scrollTo(0, 0);
	};

	const { addToCart, openSidebar } = useCartContext();

	// eslint-disable-next-line
	const showViewButton = (showViewProductButton) => {
		return (
			showViewProductButton && (
				<Link
					to={`/product/${
						product && product.category && product.category.categorySlug
					}/${product.slug}/${product._id}`}
					className='mr-2'
					onClick={() => {
						window.scrollTo(0, 0);
					}}>
					<button className='btn btn-outline-primary mt-2 mb-2 card-btn-1 viewproduct'>
						View Product
					</button>
				</Link>
			)
		);
	};
	// eslint-disable-next-line
	const addToCarts = () => {
		// console.log('added');
		addItem(product, setRedirect(true));

		// window.scrollTo(0, 0);
	};

	const shouldRedirect = (redirect) => {
		if (redirect) {
			return <Redirect to='/cart' />;
		}
	};

	const showAddToCartBtn = (showAddToCartButton) => {
		return (
			<Fragment>
				<Fragment>
					{chosenLanguage === "Arabic" ? (
						<Fragment>
							{product.quantity > 0 ? (
								<Fragment>
									{showAddToCartButton && (
										<span onClick={openSidebar}>
											<span
												onClick={() => addToCart(product._id, null, 1, product)}
												className='btn btn-warning mt-2 mb-2 card-btn-1  cartoptions2'>
												أضف إلى السلة
											</span>
										</span>
									)}
								</Fragment>
							) : (
								<Fragment>
									<button
										className='btn btn-warning mt-2 mb-2 card-btn-1 cartoptions2'
										disabled>
										أضف إلى السلة
									</button>
								</Fragment>
							)}
						</Fragment>
					) : (
						<Fragment>
							{product.quantity > 0 ? (
								<Fragment>
									{showAddToCartButton && (
										<span onClick={openSidebar}>
											<span
												onClick={() => addToCart(product._id, null, 1, product)}
												className='btn btn-warning mt-2 mb-2 card-btn-1  cartoptions'>
												Add to cart
											</span>
										</span>
									)}
								</Fragment>
							) : (
								<Fragment>
									<button
										className='btn btn-warning mt-2 mb-2 card-btn-1 cartoptions'
										disabled>
										Add to cart
									</button>
								</Fragment>
							)}
						</Fragment>
					)}
				</Fragment>
			</Fragment>
		);
	};

	const showStock = (quantity) => {
		return quantity > 0 ? (
			<span className='badge badge-primary badge-pill stockStatus'>
				In Stock{" "}
			</span>
		) : (
			<span className='badge badge-danger badge-pill stockStatus'>
				Sold Out{" "}
			</span>
		);
	};

	const handleChange = (productId) => (event) => {
		setRun(!run); // run useEffect in parent Cart
		setCount(event.target.value < 1 ? "" : event.target.value);
		if (event.target.value >= 1) {
			updateItem(productId, event.target.value);
		}
	};

	const showCartUpdateOptions = (cartUpdate) => {
		return (
			cartUpdate && (
				<div>
					<div className='input-group mb-3 '>
						<div className='input-group-prepend'>
							<span className='input-group-text'>Adjust Quantity</span>
						</div>
						<input
							type='number'
							className='form-control'
							value={count}
							onChange={handleChange(product._id)}
						/>
					</div>
				</div>
			)
		);
	};
	const showRemoveButton = (showRemoveProductButton) => {
		return (
			showRemoveProductButton && (
				<button
					onClick={() => {
						removeItem(product._id);
						setRun(!run); // run useEffect in parent Cart
					}}
					className='btn btn-outline-danger mt-2 mb-2'>
					Remove Product
				</button>
			)
		);
	};

	const ShowImage = ({ item }) => (
		<div className='product-img' style={{ borderRadius: "50%" }}>
			{item && item.images && (
				<Carousel
					showArrows={false}
					dynamicHeight={true}
					autoPlay
					infiniteLoop
					interval={5000}
					showStatus={false}
					showIndicators={false}
					showThumbs={false}>
					{item.images.map((i) => (
						<img
							className=' rounded mx-auto d-block product-imgs'
							alt={item.productName}
							src={i.url}
							key={i.public_id}
							style={{ height: "300px", width: "300px", objectFit: "cover" }}
						/>
					))}
				</Carousel>
			)}
		</div>
	);

	// eslint-disable-next-line
	const productNameModified =
		product && product.productName && product.productName.split(" ").join("-");

	return (
		<ProductWrapper className='my-3'>
			<Fragment>
				<div
					className='card '
					style={{ borderRadius: "5%", backgroundColor: "white" }}>
					<div className='card-body  '>
						{shouldRedirect(redirect)}
						<div className='card-img-top center img'>
							{product && product.ratings && product.ratings.length > 0 ? (
								<div className='mb-3'>{showAverageRating2(product)}</div>
							) : (
								<div
									className='mb-2'
									style={{
										fontSize: "0.75rem",
										fontStyle: "italic",
										fontWeight: "bold",
										color: "black",
									}}>
									{chosenLanguage === "Arabic" ? "لا يوجد تقييم" : "No Ratings"}
								</div>
							)}
							<ImageFeat>
								<Link
									to={`/product/${
										product && product.category && product.category.categorySlug
									}/${product.slug}/${product._id}`}
									onClick={() => {
										window.scrollTo({ top: 0, behavior: "smooth" });
										SettingViews();
									}}>
									<ShowImage item={product} />
								</Link>
							</ImageFeat>
						</div>
						<div
							className='mt-2 mb-3 productname'
							style={{
								fontSize: "15px",
								fontWeight: "bold",
								textAlign: "center",
								textTransform: "capitalize",
							}}>
							{chosenLanguage === "Arabic"
								? product.productName_Arabic
								: product.productName}
						</div>

						<div className='row my-2'>
							{product.price > product.priceAfterDiscount ? (
								<div
									className='productprice col-md-5 mx-auto'
									style={{
										fontSize: "15px",
										fontWeight: "bold",
										textAlign: "center",
									}}>
									<span className='productprice'>
										Price: <s style={{ color: "red" }}>{product.price} KD</s>{" "}
										{product.priceAfterDiscount} KD
									</span>
								</div>
							) : (
								<div
									className='productprice col-md-5 mx-auto'
									style={{
										fontSize: "15px",
										fontWeight: "bold",
										textAlign: "center",
									}}>
									Price: {product.price} KD
								</div>
							)}
							<div className='col-md-3 mx-auto'>
								{showStock(product.quantity)}
							</div>
						</div>

						<div onClick={SettingViews}>
							{/* {showViewButton(showViewProductButton)} */}
							{showAddToCartBtn(showAddToCartButton)}
						</div>
						{showRemoveButton(showRemoveProductButton)}
						{showCartUpdateOptions(cartUpdate)}
					</div>
				</div>
			</Fragment>
		</ProductWrapper>
	);
};

export default CardForRelatedProducts;

const ProductWrapper = styled.div`
	.cards {
		text-align: center;
		box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.3);
		transition: var(--mainTransition);
		height: 100%;
		width: 90%;
		-webkit-animation: fadein 3s; /* Safari, Chrome and Opera > 12.1 */
		-moz-animation: fadein 3s; /* Firefox < 16 */
		-ms-animation: fadein 3s; /* Internet Explorer */
		-o-animation: fadein 3s; /* Opera < 12.1 */
		animation: fadein 3s;
		@keyframes fadein {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}
	}
	.card {
		text-align: center;
		box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.3);
		transition: var(--mainTransition);
		height: 100%;
		width: 90%;
	}
	.card:hover {
		box-shadow: 7px 10px 5px 0px rgba(0, 0, 0, 0.5);
		cursor: pointer;
	}
	.card-img-top {
		transition: var(--mainTransition);
	}

	/*To zoom in into the picture when hovering */
	.card:hover .card-img-top {
		transform: scale(1.1);
		opacity: 0.7;
	}

	.card-body {
		font-weight: bold;
		letter-spacing: 2px;
	}

	.productname {
		font-size: 14px;
	}

	@media (max-width: 680px) {
		/* .card {
			width: 100%;
			height: 100%;
		} */
		.productname {
			font-size: 12px !important;
		}

		.productprice {
			font-size: 11px !important;
		}
		.stockStatus {
			font-size: 10px;
		}
		.cartoptions {
			font-size: 12px;
		}
		.viewproduct {
			font-size: 12px;
		}
	}
`;

const ImageFeat = styled.div`
	@media (max-width: 680px) {
		.product-imgs {
			width: 130px !important;
			height: 130px !important;
		}
	}
`;
