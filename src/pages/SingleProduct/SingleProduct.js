/** @format */

import React, { useState, useEffect } from "react";
import styled from "styled-components";

import {
	userlike,
	userunlike,
	productStar,
	readProduct,
	comment,
	uncomment,
	like,
	unlike,
	getColors,
} from "../../apiCore";
// eslint-disable-next-line
import { addItem } from "../../cartHelpers";
import StarRating from "react-star-ratings";
import { Modal } from "antd";
import { toast } from "react-toastify";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import { isAuthenticated } from "../../auth";
// eslint-disable-next-line
import { useHistory, useParams, Link, Redirect } from "react-router-dom";
// eslint-disable-next-line
import Slider from "react-slick";
import { showAverageRating } from "./Rating";
import { useCartContext } from "../../Checkout/cart_context";
// import Resizer from "react-image-file-resizer";
import { Helmet } from "react-helmet";
import DisplayImages from "./DisplayImages";
import HistoricalComments from "./HistoricalComments";
import ColorsAndSizes from "./ColorsAndSizes";
// import CardForRelatedProducts from "./CardForRelatedProducts";

const SingleProduct = (props) => {
	const [Product, setProduct] = useState({});
	const [star, setStar] = useState(0);
	const [modalVisible, setModalVisible] = useState(false);
	const [comments, setComments] = useState([]);
	const [text, setText] = useState("");
	// eslint-disable-next-line
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);
	const [commentsPhotos, setCommentsPhotos] = useState([]);
	const [likee, setLikee] = useState(false);
	// eslint-disable-next-line
	const [likes, setLikes] = useState(0);
	const [userlikee, setuserLikee] = useState(false);
	const [redirect2, setRedirect2] = useState(false);
	const [relatedProducts, setRelatedProducts] = useState([]);
	const [allSizes, setAllSizes] = useState([]);
	const [allAddedColors, setAllAddedColors] = useState([]);
	const [allColors, setAllColors] = useState([]);
	const [colorSelected, setColorSelected] = useState(false);
	const [chosenProductAttributes, setChosenProductAttributes] = useState({
		SubSKU: "",
		OrderedQty: 1,
		productId: "",
		productName: "",
		productMainImage: "",
		productSubSKUImage: "",
		SubSKUPriceAfterDiscount: "",
		SubSKURetailerPrice: "",
		SubSKUWholeSalePrice: "",
		SubSKUDropshippingPrice: "",
		pickedPrice: "",
		quantity: "",
		SubSKUColor: "",
		SubSKUSize: "",
		SubSKUMSRP: "",
	});
	const [chosenImages, setChosenImages] = useState({});

	const token = isAuthenticated() && isAuthenticated().token;
	const user = isAuthenticated() && isAuthenticated().user;
	const { addToCart, openSidebar } = useCartContext();

	useEffect(() => {
		const productId = props.match.params && props.match.params.productId;
		loadSingleEmployee(productId);
		// eslint-disable-next-line
	}, [props, star, modalVisible]);

	const checkLike = (likes) => {
		const userId = isAuthenticated() && isAuthenticated().user._id;
		let match = likes.indexOf(userId) !== -1;
		return match;
	};

	const gettingAllColors = () => {
		getColors(token).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllColors(data);
			}
		});
	};

	useEffect(() => {
		gettingAllColors();
		// eslint-disable-next-line
	}, []);

	const loadSingleEmployee = (productId) => {
		setLoading(true);
		readProduct(productId).then((data) => {
			if (data.error) {
				setError(data.error);
			} else {
				setProduct(data);
				setComments(data.comments);
				setLikes(data.likes.length);
				setLikee(checkLike(data.likes));
				setuserLikee(checkLike(data.likes));
				setRelatedProducts(data.relatedProducts);

				//populating the attributes

				setChosenProductAttributes({
					SubSKU: "",
					OrderedQty: 1,
					productId: data._id,
					productName: data.productName,
					productMainImage: data.thumbnailImage[0].images[0].url,
					productSubSKUImage: "",
					SubSKUPriceAfterDiscount: "",
					SubSKURetailerPrice: "",
					SubSKUWholeSalePrice: "",
					SubSKUDropshippingPrice: "",
					pickedPrice: "",
					quantity: "",
					SubSKUColor: "",
					SubSKUSize: "",
					SubSKUMSRP: "",
				});

				//AllSizes
				var sizesArray = data.productAttributes.map((i) => i.size);

				let uniqueSizesArray = [
					...new Map(sizesArray.map((item) => [item, item])).values(),
				];
				setAllSizes(uniqueSizesArray);

				//AllSizes
				var colorsArray = data.productAttributes.map((i) => i.color);

				let uniqueColorArray = [
					...new Map(colorsArray.map((item) => [item, item])).values(),
				];
				setAllAddedColors(uniqueColorArray);

				//consolidating All Images
				var imagesArray = data.productAttributes.map((i) =>
					i.productImages.map((ii) => ii.url),
				);

				var mergedimagesArray = [].concat.apply([], imagesArray);

				let uniqueImagesArray = [
					...new Map(mergedimagesArray.map((item) => [item, item])).values(),
				];
				setChosenImages(uniqueImagesArray);
			}
		});
		setLoading(false);
	};

	const shouldRedirect2 = (redirect) => {
		if (redirect) {
			return <Redirect to='/signin' />;
		}
	};

	useEffect(() => {
		if (Product && Product.ratings && user) {
			let existingRatingObject = Product.ratings.filter(
				(ele) => ele.ratedBy._id === user._id,
			);
			setStar(
				existingRatingObject &&
					existingRatingObject[existingRatingObject.length - 1] &&
					existingRatingObject[existingRatingObject.length - 1].star,
			);
		}
		// eslint-disable-next-line
	}, [modalVisible]);

	// eslint-disable-next-line
	const shopIsWorkingTodayLogic = () => {
		var today = new Date().getDay();
		if (today === 0) {
			today = "Sunday";
		} else if (today === 1) {
			today = "Monday";
		} else if (today === 2) {
			today = "Tuesday";
		} else if (today === 3) {
			today = "Wednesday";
		} else if (today === 4) {
			today = "Thursday";
		} else if (today === 5) {
			today = "Friday";
		} else if (today === 6) {
			today = "Saturday";
		}
		var WorkingOrNot =
			Product && Product.workingDays && Product.workingDays.indexOf(today) > -1;
		return WorkingOrNot;
	};

	const onStarClick = (newRating, name) => {
		setStar(newRating);
		// console.table(newRating, name);
		productStar(name, newRating, token, user.email, user._id).then(() => {
			// loadSingleEmployee(); // if you want to show updated rating in real time
		});
	};
	let history = useHistory();
	let { productId, productName } = useParams();

	const handleModal = () => {
		if (user && token) {
			setModalVisible(true);
		} else {
			history.push({
				pathname: "/signin",
				state: {
					from: `/product/${productName}/${productId}`,
				},
			});
		}
	};

	//comments
	const updateComments = (comments) => {
		if (user && token) {
			setComments(comments);
		} else {
			history.push({
				pathname: "/signin",
				state: {
					from: `/employee/${productName}/${productId}`,
				},
			});
		}
	};

	const handleChange = (event) => {
		setError("");
		setText(event.target.value);
	};

	const isValid = () => {
		if (!text.length > 0 || text.length > 150) {
			setError({
				error: "Comment should not be empty and less than 150 characters long",
			});
			return false;
		}
		return true;
	};

	const addComment = (e) => {
		e.preventDefault();
		setLoading(true);
		if (!isAuthenticated()) {
			setError({ error: "Please signin to leave a comment" });
			return false;
		}

		if (isValid()) {
			const userId = isAuthenticated().user._id;
			const token = isAuthenticated().token;
			const productId = Product && Product._id;

			comment(userId, token, productId, {
				text: text,
				commentsPhotos: commentsPhotos && commentsPhotos.images,
			}).then((data) => {
				if (data.error) {
					console.log(data.error);
				} else {
					setText("");
					// dispatch fresh list of coments to parent (SinglePost)
					updateComments(data.comments);
					setLoading(false);
					setModalVisible(false);
					setCommentsPhotos([]);
					toast.success(`Thank you for your review ${user.name}`);
				}
			});
		}
	};

	const deleteComment = (comment) => {
		const userId = isAuthenticated().user._id;
		const token = isAuthenticated().token;
		const productId = Product && Product._id;

		uncomment(userId, token, productId, comment).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				updateComments(data.comments);
			}
		});
	};
	const commentForm = () => {
		return (
			<>
				{Product && Product.comments && !loading ? (
					<>
						<h5
							className='mt-5 mb-3'
							style={{ fontWeight: "bold", fontStyle: "italic" }}>
							Your Feedback Is Important To Us!!
						</h5>
						<form onSubmit={addComment}>
							<div className='form-group'>
								<input
									type='text'
									onChange={handleChange}
									value={text}
									className='form-control'
									placeholder='Leave a comment...'
									required
								/>
								<button className='btn btn-raised btn-success mt-3'>
									Post
								</button>
							</div>
						</form>
					</>
				) : (
					<div className='p-5 text-center'> Loading...</div>
				)}
			</>
		);
	};
	const WishList = "Product was added to your wish list!";

	const likeToggle = () => {
		if (!isAuthenticated()) {
			setRedirect2({
				redirectToSignin: true,
			});
			return false;
		}
		if (!likee) {
			toast.success(WishList);
		}

		let callApi = likee ? unlike : like;
		const userId = isAuthenticated().user._id;
		const productId = Product._id;
		const token = isAuthenticated().token;

		callApi(userId, token, productId).then((data) => {
			setLikee(!likee);
			setLikes(data.likes.length);
		});
	};

	const likeToggle2 = () => {
		if (!isAuthenticated()) {
			setRedirect2({
				redirectToSignin: true,
			});
			return false;
		}

		let callApi2 = userlikee ? userunlike : userlike;
		const userId = isAuthenticated().user._id;
		const productId = Product._id;
		const token = isAuthenticated().token;

		callApi2(userId, token, productId).then((data) => {
			setuserLikee(!likee);
		});
	};

	const deleteConfirmed = (comment) => {
		let answer = window.confirm(
			"Are you sure you want to delete your comment?",
		);
		if (answer) {
			deleteComment(comment);
		}
	};

	const selectedFeedbackComments = (description) => {
		description = description && description.split(/\n/g);
		return description;
	};

	// eslint-disable-next-line
	const settings = {
		dots: true,
		infinite: true,
		autoplay: true,
		arrows: true,
		speed: 1000,
		slidesToShow: relatedProducts && relatedProducts.length >= 4 ? 4 : 2,
		slidesToScroll: 1,
		autoplaySpeed: 5000,
		pauseOnHover: true,
		adaptiveHeight: true,

		responsive: [
			{
				breakpoint: 1200,
				settings: {
					dots: true,
					infinite: true,
					autoplay: true,
					arrows: true,
					speed: 1000,
					slidesToShow: relatedProducts && relatedProducts.length >= 2 ? 2 : 1,
					slidesToScroll: 1,
					autoplaySpeed: 5000,
					pauseOnHover: true,
					adaptiveHeight: true,
				},
			},
		],
	};

	var titleName =
		Product && Product.productName && Product.productName.toUpperCase();

	return (
		<SingleEmp className='mx-auto'>
			<Helmet>
				<meta charSet='utf-8' />
				<title>{titleName}</title>

				<meta name='description' content={Product.description} />
				<link
					rel='stylesheet'
					href='http://fonts.googleapis.com/earlyaccess/droidarabickufi.css'
				/>
				<link rel='canonical' href='http://infinite-apps.com' />
			</Helmet>
			{loading && !Product ? (
				<>
					<div
						style={{
							marginTop: "20%",
							fontSize: "2.5rem",
							color: "gold",
							fontWeight: "bold",
						}}>
						Loading...
					</div>
				</>
			) : (
				<>
					<div className='row'>
						<div className='col-md-7 text-center  mt-3'>
							<DisplayImages
								Product={Product}
								chosenImages={chosenImages}
								likee={likee}
								setLikee={setLikee}
								likeToggle={likeToggle}
								likeToggle2={likeToggle2}
								shouldRedirect2={shouldRedirect2}
								redirect2={redirect2}
							/>
						</div>

						<div
							className='col-md-5 mx-auto mt-3'
							style={{ border: "1px solid lightgrey", borderRadius: "15px" }}>
							<h3
								className='text-title mb-4 my-3'
								style={{
									// backgroundColor: "black",
									textAlign: "center",
									padding: "8px",
									color: "grey",
									fontStyle: "italic",
									textTransform: "capitalize",
								}}>
								Product Name: {Product.productName}
								{Product && Product.ratings && Product.ratings.length > 0 ? (
									showAverageRating(Product)
								) : (
									<div
										className='mt-2'
										style={{
											fontSize: "0.75rem",
											fontStyle: "italic",
											fontWeight: "bold",
											color: "black",
										}}>
										<strong>No Ratings</strong>
									</div>
								)}
							</h3>
							<hr />
							<ColorsAndSizes
								Product={Product}
								allColors={allColors}
								allSizes={allSizes}
								allAddedColors={allAddedColors}
								setChosenImages={setChosenImages}
								setChosenProductAttributes={setChosenProductAttributes}
								chosenProductAttributes={chosenProductAttributes}
								setColorSelected={setColorSelected}
								colorSelected={colorSelected}
							/>

							<hr />
							<p
								className='text-capitalize text-title mt-4'
								style={{ color: "#0052a5" }}>
								A little bit about "{Product.productName}":{" "}
							</p>

							<p
								className='single-Product-Description-Style'
								style={{ fontSize: "0.85rem" }}>
								<span className=''>
									{Product &&
										Product.description &&
										selectedFeedbackComments(
											Product && Product.description,
										).map((cc, ii) => {
											return (
												<div key={ii} className='ml-3 my-2'>
													<strong>{cc}</strong>
												</div>
											);
										})}
								</span>
							</p>

							<br />
							<br />
							<hr />
							<div className='row text-center col-lg-12 col-md-11 mx-auto my-5 buttons'>
								{!chosenProductAttributes.SubSKUColor ||
								!chosenProductAttributes.SubSKUSize ? (
									<div
										className='col-md-3 btn btn-outline-primary p-2 mx-auto mt-2'
										style={{ fontSize: "0.9rem", fontWeight: "bolder" }}>
										<span>
											<i className='fa fa-calendar mr-2' aria-hidden='true'></i>
										</span>
										Choose A Size And Color
									</div>
								) : (
									<>
										{chosenProductAttributes.quantity > 0 ? (
											<>
												<div
													className='col-md-3 btn btn-outline-primary p-2 mx-auto mt-2'
													style={{ fontSize: "0.9rem", fontWeight: "bolder" }}
													onClick={() => {
														// history.push("/cart");
														openSidebar();
														addToCart(Product._id, null, 1, Product);
													}}>
													<span>
														<i
															className='fa fa-calendar mr-2'
															aria-hidden='true'></i>
													</span>
													Add To Cart
												</div>
											</>
										) : (
											<div
												className='col-md-3 btn btn-outline-danger p-2 mx-auto mt-2'
												style={{ fontSize: "0.9rem", fontWeight: "bolder" }}>
												<span>
													<i
														className='fa fa-calendar mr-2'
														aria-hidden='true'></i>
												</span>
												Sold Out
											</div>
										)}
									</>
								)}

								<div
									className='col-md-4  btn btn-outline-info p-2 mx-auto mt-2'
									style={{ fontSize: "0.9rem", fontWeight: "bolder" }}>
									<>
										<div onClick={handleModal}>
											<span>
												<i className='far fa-comment-alt mr-2'></i>
											</span>

											{user ? (
												"Leave Your Feedback"
											) : (
												<span
													style={{ fontSize: "0.65rem", fontWeight: "bold" }}>
													Login to leave a feedback or a rating
												</span>
											)}
										</div>
										<Modal
											title={
												<div
													style={{
														textAlign: "center",
														margin: "10px",
														padding: "5px",
														fontWeight: "bold",
													}}>
													{`Please leave a Star Rating and a Comment for ${
														Product && Product.productName
													}`}
												</div>
											}
											visible={modalVisible}
											onOk={() => {
												setModalVisible(false);
												toast.success(
													`Thank you for your Feedback ${user.name}`,
												);
											}}
											okButtonProps={{ style: { display: "none" } }}
											cancelButtonProps={{ style: { display: "none" } }}
											onCancel={() => setModalVisible(false)}>
											<h5
												className='mt-4 mb-2'
												style={{ fontWeight: "bold", fontStyle: "italic" }}>
												Please Leave a Rating
											</h5>
											<StarRating
												name={Product && Product._id}
												numberOfStars={5}
												rating={star}
												changeRating={onStarClick}
												isSelectable={true}
												starRatedColor='red'
											/>
											<br />
											<div className='mt-5'>
												{/* {FileUploadComments()} */}
												{commentForm()}
											</div>
										</Modal>
									</>
								</div>
								<div
									className='col-md-4 btn btn-outline-danger p-2 mx-auto mt-2'
									style={{ fontSize: "0.9rem", fontWeight: "bolder" }}
									onClick={() => history.push("/our-products")}>
									<span>
										<i className='fas fa-home mr-2'></i>
									</span>
									Back to Products Page
								</div>
							</div>
						</div>
					</div>
					{/* {relatedProducts && relatedProducts.length > 0 ? (
						<ProductWrapperRelated>
							<React.Fragment>
								<div className='title mb-2'>
									<h1 className='title'>Products You May Like!</h1>
								</div>
							</React.Fragment>
							<div className='container-fluid my-3 ProductSlider'>
								<Slider {...settings} className='mb-5'>
									{relatedProducts &&
										relatedProducts.map((product, i) => (
											<div className='img-fluid images ' key={i}>
												<CardForRelatedProducts product={product} key={i} />
											</div>
										))}
								</Slider>
							</div>
						</ProductWrapperRelated>
					) : null} */}
					<div className='p-5'>
						<HistoricalComments
							loading={loading}
							Product={Product}
							comments={comments}
							deleteConfirmed={deleteConfirmed}
							isAuthenticated={isAuthenticated}
						/>
					</div>
				</>
			)}
		</SingleEmp>
	);
};

export default SingleProduct;

const SingleEmp = styled.div`
	width: 90%;
	margin-top: 5px;
	/* .carousel-slider {
		width: 75%;
	} */

	.carousel-root {
		border: 1px solid lightgrey;
		border-radius: 15px;
		object-fit: cover;
		/* max-height: 60%; */
		/* box-shadow: 3px 2px 3px 2px rgba(0, 0, 0, 0.5); */
	}
	/* .control-dots li {
		background-color: black !important;
	} */
	.slider img {
		width: 98%;
		height: 600px !important;
		object-fit: cover !important;
	}

	.carousel-root .thumb {
		margin-top: 20px !important;
		padding: 0px !important;
	}

	.buttons:hover {
		cursor: pointer;
	}

	@media (max-width: 1000px) {
		.slider img {
			width: 90%;
			height: 400px !important;
			object-fit: cover !important;
		}
	}
`;

// eslint-disable-next-line
const ProductWrapperRelated = styled.div`
	margin-top: 50px;

	.title {
		text-align: center;
		font-size: 2rem;
		letter-spacing: 7px;
		font-weight: bold;
		text-shadow: 3px 3px 10px;
	}

	.titleArabic {
		text-align: center;
		font-size: 2rem;
		/* letter-spacing: 7px; */
		font-weight: bold;
		text-shadow: 3px 3px 10px;
	}

	.images {
		margin-left: 20px;
		margin-bottom: 30px;
	}

	.ProductSlider {
		padding: 0px 100px 0px 100px;
	}

	@media (max-width: 1400px) {
		.ProductSlider {
			padding: 0px;
		}
	}
	@media (max-width: 1200px) {
		.ProductSlider {
			padding: 0px 10px 0px 10px;
		}
	}
`;
