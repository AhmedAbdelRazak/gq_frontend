/** @format */

import React, { useState, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import styled from "styled-components";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { showAverageRating2 } from "../SingleProduct/Rating";
import { useCartContext } from "../../Checkout/cart_context";
import { viewsCounter } from "../../apiCore";
import { DollarCircleFilled } from "@ant-design/icons";

const CardInHomePage = ({
	product,
	chosenLanguage,
	i,
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
								className=' rounded  d-block product-imgs'
								alt={item.productName}
								src={i.url}
								key={i.public_id}
								style={{
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
				<div className='card '>
					<div className='card-body  ' style={{ marginLeft: "5px" }}>
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
						<div>
							{/* {showViewButton(showViewProductButton)} */}
							{showAddToCartBtn(showAddToCartButton)}
						</div>
						<div className=' productname ml-2'>
							<div className='row'>
								<div className='col-md-8 productname col-7'>
									{productPrice <= productPriceAfterDsicount ? null : (
										<div className='' style={{ fontWeight: "bold" }}>
											<span
												style={{
													color: "goldenrod",
													fontSize: "20px",
												}}>
												<DollarCircleFilled />{" "}
											</span>
											<span className='' style={{ color: "darkred" }}>
												{(
													100 -
													(
														(productPriceAfterDsicount / productPrice) *
														100
													).toFixed(2)
												).toFixed(0)}
												% OFF
											</span>
										</div>
									)}
									{chosenLanguage === "Arabic" ? (
										<div
											style={{
												fontFamily: "Droid Arabic Kufi",
												letterSpacing: "0px",
											}}>
											{product.productName_Arabic}
										</div>
									) : (
										<div className=''> {product.productName} </div>
									)}
								</div>
								<div className='col-md-4 col-5'>
									{productPrice <= productPriceAfterDsicount ? (
										<span style={{ fontWeight: "bold" }}>
											{productPrice} L.E.
										</span>
									) : (
										<span>
											<div className='mt-2'>
												<s style={{ fontWeight: "bold", color: "red" }}>
													{productPrice} L.E.
												</s>
											</div>
											<div style={{ fontWeight: "bold" }}>
												{productPriceAfterDsicount} L.E.
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
										// fontWeight: "bold",
										color: "black",
									}}>
									{chosenLanguage === "Arabic" ? null : null}
								</div>
							)}
						</div>
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
		width: 94%;
		border: 1px white solid !important;
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
		transform: scale(1);
		opacity: 0.4;
	}

	.card-body {
		font-weight: bold;
		letter-spacing: 2px;
	}

	.productname {
		font-size: 14px;
		font-weight: bold;
		/* text-align: center; */
		text-transform: capitalize;
		letter-spacing: 0px;
		font-weight: normal;
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
			min-height: 420px;
			width: 100%;
			margin: 0px !important;
		}

		.card-body {
			padding: 0px !important;
			width: 100%;
		}

		.cartoptions {
			font-size: 14px;
			display: block;
			border-radius: 0px !important;
		}

		.cartoptions2 {
			font-size: 14px;
			display: block;
			border-radius: 0px !important;
		}

		.productname {
			font-size: 12px;
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
