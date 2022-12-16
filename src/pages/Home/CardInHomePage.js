/** @format */

import React, { useState, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import styled from "styled-components";
import { updateItem, removeItem } from "../../cartHelpers";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { showAverageRating2 } from "../SingleProduct/Rating";
import { useCartContext } from "../../Checkout/cart_context";
import { viewsCounter } from "../../apiCore";
import { DollarCircleFilled } from "@ant-design/icons";

const CardInHomePage = ({
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
	// eslint-disable-next-line
	const [redirect, setRedirect] = useState(false);
	const [count, setCount] = useState(product.count);
	// eslint-disable-next-line
	const [viewsCounterr, setViewsCounterr] = useState(0);

	const SettingViews = () => {
		const productId = product && product._id;
		const viewsLength =
			product && product.viewsCount >= 1 ? product.viewsCount + 1 : 1;

		viewsCounter(productId, viewsLength).then((data) => {
			setViewsCounterr(data);
		});
		// window.scrollTo(0, 0);
	};

	const { addToCart, openSidebar } = useCartContext();

	const shouldRedirect = (redirect) => {
		if (redirect) {
			return <Redirect to='/cart' />;
		}
	};

	var chosenProductAttributes = product.productAttributes[0];

	const productPriceAfterDsicount =
		product && product.productAttributes.map((i) => i.priceAfterDiscount)[0];
	const productPrice =
		product && product.productAttributes.map((i) => i.price)[0];

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
												onClick={() =>
													addToCart(
														product._id,
														null,
														1,
														product,
														chosenProductAttributes,
													)
												}
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
												onClick={() =>
													addToCart(
														product._id,
														null,
														1,
														product,
														chosenProductAttributes,
													)
												}
												className='btn btn-warning mt-2 mb-2 card-btn-1  cartoptions'>
												Add to Cart
											</span>
										</span>
									)}
								</Fragment>
							) : (
								<Fragment>
									<button
										className='btn btn-warning mt-2 mb-2 card-btn-1 cartoptions'
										disabled>
										Add to Cart
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
		return quantity > 0 ? null : (
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
		<div className='product-img'>
			{item &&
				item.thumbnailImage &&
				item.thumbnailImage[0] &&
				item.thumbnailImage[0].images && (
					<Carousel
						showArrows={false}
						dynamicHeight={true}
						autoPlay
						infiniteLoop
						interval={5000}
						showStatus={false}
						showIndicators={false}
						showThumbs={false}>
						{item.thumbnailImage[0].images.map((i) => (
							<img
								className=' rounded mx-auto d-block product-imgs'
								alt={item.productName}
								src={i.url}
								key={i.public_id}
								style={{
									height: "50vh",
									width: "100%",
									objectFit: "cover",
									minHeight: "400px",
								}}
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
				<div className='card ' style={{ backgroundColor: "white" }}>
					<div className='card-body  '>
						{shouldRedirect(redirect)}
						<div className='card-img-top center'>
							<ImageFeat>
								<Link
									to={`/product/${product.category.categorySlug}/${product.slug}/${product._id}`}
									onClick={() => {
										window.scrollTo({ top: 0, behavior: "smooth" });
										SettingViews();
									}}>
									<ShowImage item={product} />
								</Link>
							</ImageFeat>
						</div>

						<div className='col-md-5 mx-auto'>
							{showStock(product.quantity)}
						</div>

						<div>
							{/* {showViewButton(showViewProductButton)} */}
							{showAddToCartBtn(showAddToCartButton)}
						</div>
						{showRemoveButton(showRemoveProductButton)}
						{showCartUpdateOptions(cartUpdate)}
					</div>
					<div className='mt-2 mb-4 productname' style={{ maxWidth: "90%" }}>
						<div className='row'>
							<div className='col-md-9 productname col-7'>
								{productPrice <= productPriceAfterDsicount ? null : (
									<div className='float-left'>
										<span style={{ color: "goldenrod", fontSize: "20px" }}>
											<DollarCircleFilled />{" "}
										</span>
										<span
											className=''
											style={{ fontWeight: "bold", color: "darkred" }}>
											{(
												100 -
												(
													(productPriceAfterDsicount / productPrice) *
													100
												).toFixed(2)
											).toFixed(2)}
											%
										</span>
									</div>
								)}
								<br />
								<br />
								{chosenLanguage === "Arabic" ? (
									<div
										className=''
										style={{
											fontFamily: "Droid Arabic Kufi",
											letterSpacing: "0px",
										}}>
										{product.productName_Arabic}
									</div>
								) : (
									<div className='float-left'> {product.productName} </div>
								)}
							</div>
							<div className='col-md-3 col-5'>
								{productPrice <= productPriceAfterDsicount ? (
									<span style={{ fontWeight: "bold" }}>
										{productPrice} L.E.
									</span>
								) : (
									<span>
										<div className='ml-2 mt-2' style={{ fontWeight: "bold" }}>
											{productPriceAfterDsicount} L.E.
										</div>
										<div className='mt-2'>
											<s style={{ fontWeight: "bold", color: "red" }}>
												{productPrice} L.E.
											</s>
										</div>
									</span>
								)}
							</div>
						</div>

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
								{chosenLanguage === "Arabic" ? null : null}
							</div>
						)}
					</div>
				</div>
			</Fragment>
		</ProductWrapper>
	);
};

export default CardInHomePage;

const ProductWrapper = styled.div`
	.card {
		/* text-align: center; */
		/* box-shadow: 2.5px 2.5px 1.5px 0px rgba(0, 0, 0, 0.3); */
		transition: var(--mainTransition);
		min-height: 500px;
		width: 90%;
		border: 1px white solid;
	}
	.card:hover {
		box-shadow: 2.5px 2.5px 1.5px 0px rgba(0, 0, 0, 0.3);
		cursor: pointer;
	}
	.card-img-top {
		transition: var(--mainTransition);
	}

	/*To zoom in into the picture when hovering */
	.card:hover .card-img-top {
		transform: scale(1.05);
		opacity: 0.4;
	}

	.card-body {
		font-weight: bold;
		letter-spacing: 2px;
	}

	.productname {
		font-size: 14px;
		font-weight: bold;
		text-transform: capitalize;
	}

	.cartoptions2 {
		font-family: "Droid Arabic Kufi";
		letter-spacing: 0px;
		background-color: #cacaca;
		transition: 0.3s;
	}
	.cartoptions {
		background-color: #cacaca;
		border: none;
		transition: 0.3s;
	}

	.cartoptions:hover {
		background-color: goldenrod;
		border: none;
		transition: 0.3s;
	}
	.cartoptions2:hover {
		background-color: goldenrod;
		border: none;
		transition: 0.3s;
	}

	@media (max-width: 680px) {
		/* .card {
			width: 100%;
			height: 100%;
		} */
		.card {
			min-height: 440px;
		}

		.cartoptions {
			font-size: 12px;
			display: block;
			border-radius: 0px !important;
		}

		.cartoptions2 {
			font-size: 12px;
			display: block;
			border-radius: 0px !important;
		}

		.productname {
			font-size: 10px;
		}
	}
`;

const ImageFeat = styled.div`
	@media (max-width: 750px) {
		.product-imgs {
			width: 100% !important;
			height: 100% !important;
			min-height: 250px !important;
		}
	}
`;
