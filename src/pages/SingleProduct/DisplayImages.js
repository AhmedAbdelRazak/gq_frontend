/** @format */

import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import { Link } from "react-router-dom";

const DisplayImages = ({
	Product,
	chosenImages,
	likee,
	setLikee,
	likeToggle,
	likeToggle2,
	shouldRedirect2,
	redirect2,
}) => {
	return (
		<div>
			{Product && chosenImages && chosenImages.length > 0 && (
				<Carousel
					autoPlay
					infiniteLoop
					interval={3500}
					showStatus={false}
					dynamicHeight={true}
					showThumbs={true}
					thumbWidth={50}
					autoFocus={true}>
					{chosenImages &&
						chosenImages.map((i, ii) => (
							<img
								alt={Product.productName}
								src={i}
								key={ii}
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
									<span style={{ fontSize: "1rem", fontWeight: "bold" }}>
										Wish List
									</span>
								</h5>
							</h5>
						</div>
					)}
				</Like>
				<div
					className='ml-auto p-2 '
					style={{
						color: "black",
						fontStyle: "italic",
						fontWeight: "bold",
						textAlign: "center",
						marginTop: "16px",
						fontSize: "1.2rem",
					}}>
					<i
						className='fa fa-street-view'
						style={{
							fontSize: "24px",
						}}>
						{" "}
						{Product.viewsCount} Views
					</i>
				</div>
			</div>
		</div>
	);
};

export default DisplayImages;

const Like = styled.div`
	cursor: pointer;
	.Like {
		background: #ededed;
		text-decoration: none;
		color: var(--darkGrey);
		outline-color: var(--darkGrey);
	}
`;
