/** @format */

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
	productStar,
	read,
	comment,
	uncomment,
	like,
	unlike,
	//cloudinaryCommentUpload,
} from "../apiCore";
import { userlike, userunlike } from "../../user/apiUser";
// eslint-disable-next-line
import { addItem } from "../cartHelpers";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import StarRating from "react-star-ratings";
import { Modal } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import { isAuthenticated } from "../../auth";
import { useHistory, useParams, Link, Redirect } from "react-router-dom";
import Slider from "react-slick";
import { showAverageRating } from "./Rating";
import { useCartContext } from "../checkout/cart_context";
// import Resizer from "react-image-file-resizer";
import { Helmet } from "react-helmet";
import CardForRelatedProducts from "./CardForRelatedProducts";

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

	const loadSingleEmployee = (productId) => {
		setLoading(true);
		read(productId).then((data) => {
			if (data.error) {
				setError(data.error);
			} else {
				setProduct(data);
				setComments(data.comments);
				setLikes(data.likes.length);
				setLikee(checkLike(data.likes));
				setuserLikee(checkLike(data.likes));
				setRelatedProducts(data.relatedProducts);
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

	const historicalComments = () => {
		return (
			<>
				{!loading && Product && Product.comments && comments ? (
					<div className='col-md-12'>
						<h3 className='text-primary'>
							{comments && comments.length} Comments
						</h3>
						<hr />
						{comments &&
							comments.map((comment, i) => (
								<div key={i}>
									<div>
										<div>
											<p className='font-italic mark'>
												<span className='lead m-3'>{comment.text}</span>
												<br />
												<br />
												{comment.commentsPhotos &&
													comment.commentsPhotos.length > 0 && (
														<img
															src={
																comment.commentsPhotos &&
																comment.commentsPhotos[0] &&
																comment.commentsPhotos[0].url
															}
															alt='CommentPhoto'
															style={{
																width: "180px",
																height: "180px",
																boxShadow: "1px 1px 1px 1px rgba(0,0,0,0.2)",
																borderRadius: "50px",
																marginLeft: "5%",
															}}
														/>
													)}

												<span
													style={{
														padding: "0px",
														margin: "0px",
														fontSize: "0.8rem",
													}}>
													Posted by {comment.postedBy.name.slice(0, 6)} on{" "}
													{new Date(comment.created).toDateString()}
													<span style={{ cursor: "pointer" }}>
														{isAuthenticated().user &&
															isAuthenticated().user._id ===
																comment.postedBy._id && (
																<span
																	onClick={() => deleteConfirmed(comment)}
																	className='text-danger float-right mr-1'>
																	Remove
																</span>
															)}
													</span>
												</span>
											</p>
										</div>
									</div>
									<hr />
								</div>
							))}
					</div>
				) : (
					<div className='text-center'>Loading...</div>
				)}
			</>
		);
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

	return (
		<SingleEmp className='mx-auto'>
			<Helmet>
				<meta charSet='utf-8' />
				<title>Demo Ecommerce Web App | Developed By Infinite-Apps</title>

				<meta
					name='description'
					content='This is a demo website created by Infinite-Apps. This web app is mainly focusing on Ecommerce business/Web Shops and it could be used for Brick and Mortar stores to increase your sales. Infinite Apps can help with your SEO (Search Engine Optimization) so you can market for your business and rank higher with Google. If you are interested, Please contact infinite apps 9099914386 (www.infinite-apps.com)'
				/>
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
						<div className='col-md-6 text-center  mt-3'>
							{Product && Product.images && (
								<Carousel
									autoPlay
									infiniteLoop
									interval={3500}
									showStatus={false}
									dynamicHeight={true}
									showThumbs={true}
									thumbWidth={70}
									// width={"75%"}
									autoFocus={true}>
									{Product.images.map((i) => (
										<img
											alt={Product.productName}
											src={i.url}
											key={i.public_id}
											style={{
												borderRadius: "15px",
												// height: "100%",
												// objectFit: "cover",
											}}
										/>
									))}
								</Carousel>
							)}
							<div className='d-flex mx-3'>
								<Like>
									{likee ? (
										<>
											<ToastContainer className='toast-top-left' />

											<h5 onClick={likeToggle} className='mt-4 '>
												<h5 onClick={likeToggle2}>
													<i
														className='fa fa-heart text-danger  Like'
														style={{
															padding: "8px",
															borderRadius: "50%",
															fontSize: "2rem",
														}}
													/>{" "}
												</h5>
											</h5>
											<strong
												className=''
												style={{
													fontStyle: "italic",
													fontSize: "0.8rem",
													textDecoration: "underline",
												}}>
												{" "}
												<Link to='/user-dashboard/wishlist'>
													Added to your Wish List
												</Link>
											</strong>
										</>
									) : (
										<div className='viewsLikes'>
											<h5 onClick={likeToggle} className='mt-4 '>
												<h5 onClick={likeToggle2}>
													<i
														className='fa fa-heart  Like'
														style={{
															padding: "8px",
															borderRadius: "50%",
															fontSize: "1.7rem",
														}}
													/>{" "}
													{shouldRedirect2(redirect2)}
													<span
														style={{ fontSize: "1rem", fontWeight: "bold" }}>
														Wish List
													</span>
												</h5>
											</h5>
										</div>
									)}
								</Like>
							</div>
						</div>
						<div
							className='col-md-5 mx-auto mt-3'
							style={{ border: "3px solid grey", borderRadius: "15px" }}>
							<h3
								className='text-title mb-4 my-3'
								style={{
									// backgroundColor: "black",
									textAlign: "center",
									padding: "8px",
									color: "grey",
									fontStyle: "italic",
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
							<p
								className='text-capitalize text-title mt-4'
								style={{ color: "#0052a5" }}>
								Product SKU:{" "}
								<span style={{ color: "black" }}>{Product.productSKU}</span>
							</p>
							{Product.price > Product.priceAfterDiscount ? (
								<p
									className='text-capitalize text-title'
									style={{ color: "#0052a5" }}>
									Item Price:{" "}
									<s style={{ color: "red", fontWeight: "bold" }}>
										{Product.price} KD
									</s>{" "}
									{Product.priceAfterDiscount} KD
								</p>
							) : (
								<p
									className='text-capitalize text-title mt-4'
									style={{ color: "#0052a5" }}>
									Item Price: {Product.priceAfterDiscount} KD
								</p>
							)}
							<hr />
							<p
								className='text-capitalize text-title mt-4'
								style={{ color: "#0052a5" }}>
								A little bit about {Product.productName}:{" "}
							</p>

							<p
								className='single-Product-Description-Style'
								style={{ fontSize: "0.85rem" }}>
								<span className=''>
									{Product &&
										Product.description1 &&
										selectedFeedbackComments(
											Product && Product.description1,
										).map((cc, ii) => {
											return (
												<div key={ii} className='ml-3 my-2'>
													<strong>{cc}</strong>
												</div>
											);
										})}
								</span>
							</p>
							<p
								className='single-Product-Description-Style'
								style={{ fontSize: "0.85rem" }}>
								<span className=''>
									{Product &&
										Product.description2 &&
										selectedFeedbackComments(
											Product && Product.description2,
										).map((cc, ii) => {
											return (
												<div key={ii} className='ml-3 my-2'>
													<strong>{cc}</strong>
												</div>
											);
										})}
								</span>
							</p>
							<p
								className='single-Product-Description-Style'
								style={{ fontSize: "0.85rem" }}>
								<span className=''>
									{Product &&
										Product.description3 &&
										selectedFeedbackComments(
											Product && Product.description3,
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
							<br />
							<hr />
							<div className='row text-center col-lg-12 col-md-11 mx-auto my-5 buttons'>
								{Product.quantity > 0 ? (
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
										className='col-md-3 btn btn-outline-primary p-2 mx-auto mt-2'
										style={{ fontSize: "0.9rem", fontWeight: "bolder" }}>
										<span>
											<i className='fa fa-calendar mr-2' aria-hidden='true'></i>
										</span>
										Sold Out
									</div>
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
					{relatedProducts && relatedProducts.length > 0 ? (
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
					) : null}
					<div className='p-5'>{historicalComments()}</div>
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
		border: 2px solid grey;
		border-radius: 15px;
		object-fit: cover;
		/* max-height: 60%; */
		box-shadow: 3px 2px 3px 2px rgba(0, 0, 0, 0.5);
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
`;

const Like = styled.div`
	cursor: pointer;
	.Like {
		background: #ededed;
		text-decoration: none;
		color: var(--darkGrey);
		outline-color: var(--darkGrey);
	}
`;

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
