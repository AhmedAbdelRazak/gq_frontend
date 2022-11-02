/** @format */

import React, { useState, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import styled from "styled-components";
import { updateItem, removeItem } from "../../cartHelpers";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { showAverageRating2 } from "../SingleProduct/Rating";
import { useCartContext } from "../../Checkout/cart_context";

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

	const { addToCart, openSidebar } = useCartContext();

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
		<div className='product-img' style={{ borderRadius: "50%" }}>
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
					style={{ borderRadius: "2%", backgroundColor: "white" }}>
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
									{chosenLanguage === "Arabic" ? (
										<span
											style={{
												fontFamily: "Droid Arabic Kufi",
												letterSpacing: "0px",
											}}>
											لا يوجد تقييم
										</span>
									) : (
										"No Ratings"
									)}
								</div>
							)}
							<ImageFeat>
								<Link
									to={`/product/${product.category.categorySlug}/${product.slug}/${product._id}`}>
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
							{chosenLanguage === "Arabic" ? (
								<span
									style={{
										fontFamily: "Droid Arabic Kufi",
										letterSpacing: "0px",
									}}>
									{product.productName_Arabic}
								</span>
							) : (
								product.productName
							)}
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
				</div>
			</Fragment>
		</ProductWrapper>
	);
};

export default CardInHomePage;

const ProductWrapper = styled.div`
	.cards {
		text-align: center;
		box-shadow: 2.5px 2.5px 1.5px 0px rgba(0, 0, 0, 0.3);
		transition: var(--mainTransition);
		width: 90%;
		min-height: 500px;
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
		box-shadow: 2.5px 2.5px 1.5px 0px rgba(0, 0, 0, 0.3);
		transition: var(--mainTransition);
		min-height: 376px;
		width: 90%;
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
	}

	.cartoptions2 {
		font-family: "Droid Arabic Kufi";
		letter-spacing: 0px;
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

		.cartoptions2 {
			font-size: 13px;
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
