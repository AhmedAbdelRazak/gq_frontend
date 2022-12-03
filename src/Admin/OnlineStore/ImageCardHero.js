/** @format */

import React from "react";
import styled from "styled-components";
import imageImage from "../../GeneralImages/UploadImageImage.jpg";

const ImageCardHero = ({
	thumbnail,
	thumbnail2,
	thumbnail3,
	setThumbnail,
	setThumbnail2,
	setThumbnail3,
	handleImageRemove,
	handleImageRemove2,
	handleImageRemove3,
	fileUploadAndResizeThumbNail,
	fileUploadAndResizeThumbNail2,
	fileUploadAndResizeThumbNail3,
}) => {
	return (
		<ImageCardHeroWrapper>
			<div className='row'>
				<div className='col-md-4 mx-auto'>
					<div className='card card-flush py-4'>
						<div className=''>
							<div className=' p-3'>
								<h5 style={{ fontWeight: "bold", fontSize: "1.05rem" }}>
									Home Page Main Image 1
								</h5>
							</div>
						</div>
						<div className='card-body text-center pt-0'>
							<div
								className='image-input image-input-empty image-input-outline image-input-placeholder mb-3'
								data-kt-image-input='true'>
								<div className='image-input-wrapper w-180px h-180px'></div>
								<div className='col-12'>
									{thumbnail &&
										thumbnail.images &&
										thumbnail.images.map((image) => {
											return (
												<div className='m-3 col-6 '>
													<button
														type='button'
														className='close'
														onClick={() => {
															handleImageRemove(image.public_id);
															setThumbnail([]);
														}}
														style={{
															color: "white",
															background: "black",
															fontSize: "20px",
														}}
														aria-label='Close'>
														<span aria-hidden='true'>&times;</span>
													</button>
													<img
														src={image.url}
														alt='Img Not Found'
														style={{
															width: "130px",
															height: "130px",
															boxShadow: "1px 1px 1px 1px rgba(0,0,0,0.2)",
														}}
														key={image.public_id}
													/>
												</div>
											);
										})}
								</div>
								{!thumbnail.images ? (
									<label
										className=''
										style={{ cursor: "pointer", fontSize: "0.95rem" }}>
										<img src={imageImage} alt='imageUpload' />
										<input
											type='file'
											hidden
											accept='images/*'
											onChange={fileUploadAndResizeThumbNail}
											required
										/>
									</label>
								) : null}
							</div>
							<div className='text-muted fs-7'>
								Image Size should be 3800*1700. Set the Home Page Main thumbnail
								image 1. Only *.png, *.jpg and *.jpeg image files are accepted
							</div>
						</div>
					</div>
				</div>

				<div className='col-md-4 mx-auto'>
					<div className='card card-flush py-4'>
						<div className=''>
							<div className=' p-3'>
								<h5 style={{ fontWeight: "bold", fontSize: "1.05rem" }}>
									Home Page Main Image 2
								</h5>
							</div>
						</div>
						<div className='card-body text-center pt-0'>
							<div
								className='image-input image-input-empty image-input-outline image-input-placeholder mb-3'
								data-kt-image-input='true'>
								<div className='image-input-wrapper w-180px h-180px'></div>
								<div className='col-12'>
									{thumbnail2 &&
										thumbnail2.images &&
										thumbnail2.images.map((image) => {
											return (
												<div className='m-3 col-6 '>
													<button
														type='button'
														className='close'
														onClick={() => {
															handleImageRemove(image.public_id);
															setThumbnail2([]);
														}}
														style={{
															color: "white",
															background: "black",
															fontSize: "20px",
														}}
														aria-label='Close'>
														<span aria-hidden='true'>&times;</span>
													</button>
													<img
														src={image.url}
														alt='Img Not Found'
														style={{
															width: "130px",
															height: "130px",
															boxShadow: "1px 1px 1px 1px rgba(0,0,0,0.2)",
														}}
														key={image.public_id}
													/>
												</div>
											);
										})}
								</div>
								{!thumbnail2.images ? (
									<label
										className=''
										style={{ cursor: "pointer", fontSize: "0.95rem" }}>
										<img src={imageImage} alt='imageUpload' />
										<input
											type='file'
											hidden
											accept='images/*'
											onChange={fileUploadAndResizeThumbNail2}
											required
										/>
									</label>
								) : null}
							</div>
							<div className='text-muted fs-7'>
								Image Size should be 3800*1700. Set the Home Page Main thumbnail
								image 1. Only *.png, *.jpg and *.jpeg image files are accepted
							</div>
						</div>
					</div>
				</div>

				<div className='col-md-4 mx-auto'>
					<div className='card card-flush py-4'>
						<div className=''>
							<div className=' p-3'>
								<h5 style={{ fontWeight: "bold", fontSize: "1.05rem" }}>
									Home Page Main Image 3
								</h5>
							</div>
						</div>
						<div className='card-body text-center pt-0'>
							<div
								className='image-input image-input-empty image-input-outline image-input-placeholder mb-3'
								data-kt-image-input='true'>
								<div className='image-input-wrapper w-180px h-180px'></div>
								<div className='col-12'>
									{thumbnail3 &&
										thumbnail3.length > 0 &&
										thumbnail3.images &&
										thumbnail3.images[0] &&
										thumbnail3.images.map((image) => {
											return (
												<div className='m-3 col-6 '>
													<button
														type='button'
														className='close'
														onClick={() => {
															handleImageRemove3(image.public_id);
															setThumbnail3([]);
														}}
														style={{
															color: "white",
															background: "black",
															fontSize: "20px",
														}}
														aria-label='Close'>
														<span aria-hidden='true'>&times;</span>
													</button>
													<img
														src={image.url}
														alt='Img Not Found'
														style={{
															width: "130px",
															height: "130px",
															boxShadow: "1px 1px 1px 1px rgba(0,0,0,0.2)",
														}}
														key={image.public_id}
													/>
												</div>
											);
										})}
								</div>
								{!thumbnail3.images ? (
									<label
										className=''
										style={{ cursor: "pointer", fontSize: "0.95rem" }}>
										<img src={imageImage} alt='imageUpload' />
										<input
											type='file'
											hidden
											accept='images/*'
											onChange={fileUploadAndResizeThumbNail3}
											required
										/>
									</label>
								) : null}
							</div>
							<div className='text-muted fs-7'>
								Set the Home Page Main thumbnail image 3. Only *.png, *.jpg and
								*.jpeg image files are accepted
							</div>
						</div>
					</div>
				</div>
			</div>
		</ImageCardHeroWrapper>
	);
};

export default ImageCardHero;

const ImageCardHeroWrapper = styled.div`
	.card {
		border: 1px #f6f6f6 solid !important;
	}
`;
