/** @format */

// eslint-disable-next-line
import React, { useState, Fragment, useEffect } from "react";
import { isAuthenticated } from "../../auth/index";
import styled from "styled-components";
// import { Link } from "react-router-dom";
import {
	createSubcategory,
	getSubCategories,
	getCategories,
	cloudinaryUpload1,
} from "../apiAdmin";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import axios from "axios";
import Resizer from "react-image-file-resizer";
import AdminMenu from "../AdminMenu/AdminMenu";
import Aos from "aos";
import "aos/dist/aos.css";

const AddSubcategory = () => {
	const [SubcategoryName, setSubCategoryName] = useState("");
	const [SubcategoryName_Arabic, setSubCategoryName_Arabic] = useState("");
	// eslint-disable-next-line
	const [loading, setLoading] = useState("");
	// eslint-disable-next-line
	const [SubcategorySlug, setSubCategorySlug] = useState("");
	const [SubcategorySlug_Arabic, setSubCategorySlug_Arabic] = useState("");
	const [categoryId, setSubCategory_CategoryId] = useState("");
	const [allSubcategories, setAllSubCategories] = useState([]);
	const [allCategories, setAllCategories] = useState([]);
	// eslint-disable-next-line
	const [error, setError] = useState(false);
	const [success, setSuccess] = useState(false);
	const [addThumbnail, setAddThumbnail] = useState([]);
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);

	// destructure user and token from localstorage
	const { user, token } = isAuthenticated();

	const handleChange1 = (e) => {
		setError("");
		setSubCategoryName(e.target.value);
		setSubCategorySlug(e.target.value.split(" ").join("-"));
	};

	const handleChange3 = (e) => {
		setError("");
		setSubCategoryName_Arabic(e.target.value);
		setSubCategorySlug_Arabic(e.target.value.split(" ").join("-"));
	};

	const handleChange2 = (e) => {
		setSubCategory_CategoryId(e.target.value);
	};

	const gettingAllCategories = () => {
		getCategories(token).then((data) => {
			if (data.error) {
				setError(data.error);
			} else {
				setError("");
				setAllCategories(data);
			}
		});
	};

	const gettingAllSubcategories = () => {
		getSubCategories(token).then((data) => {
			if (data.error) {
				setError(data.error);
			} else {
				setError("");
				setAllSubCategories(
					data.map(
						(subcategory) =>
							subcategory.SubcategoryName.toLowerCase().replace(/\s/g, "") &&
							subcategory.SubcategoryName.toLowerCase()
								.replace(/\s/g, "")
								.concat(subcategory.categoryId),
					),
				);
			}
		});
	};

	useEffect(() => {
		gettingAllCategories();
		gettingAllSubcategories();
		// eslint-disable-next-line
	}, [SubcategoryName, SubcategorySlug]);

	var addedSubCategoryHelper =
		SubcategoryName &&
		categoryId &&
		SubcategoryName.toLowerCase().replace(/\s/g, "") &&
		SubcategoryName.toLowerCase().replace(/\s/g, "").concat(categoryId);

	let matchingSubCategory =
		allSubcategories.indexOf(addedSubCategoryHelper) !== -1;

	// console.log(matchingSubCategory, "El Logic");

	const clickSubmit = (e) => {
		e.preventDefault();
		if (matchingSubCategory) {
			return toast.error("This Subcategory and Category were added before.");
		}

		if (addThumbnail.length === 0) {
			return toast.error("Please add a thumbnail for this SubCategory.");
		}

		if (!SubcategoryName) {
			return toast.error("Please add a subcategory before creating.");
		}
		if (!categoryId) {
			return toast.error("Please choose a category");
		}
		setError("");
		setSuccess(false);
		// make request to api to create Category
		createSubcategory(user._id, token, {
			SubcategoryName,
			SubcategoryName_Arabic,
			SubcategorySlug,
			SubcategorySlug_Arabic,
			thumbnail: addThumbnail && addThumbnail.images,
			categoryId,
		}).then((data) => {
			if (data.error) {
				setError(data.error);
				setTimeout(function () {
					window.location.reload(false);
				}, 1000);
			} else {
				toast.success("Subcategory was successfully Added.");
				setError("");
				setTimeout(function () {
					setSubCategoryName("");
					setSubCategoryName_Arabic("");
					setSubCategorySlug("");
					setSubCategorySlug_Arabic("");
					setSubCategory_CategoryId("");
				}, 2000);
				setTimeout(function () {
					window.location.reload(false);
				}, 2500);
			}
		});
	};

	const fileUploadAndResizeThumbNail = (e) => {
		// console.log(e.target.files);
		let files = e.target.files;
		let allUploadedFiles = addThumbnail;
		if (files) {
			for (let i = 0; i < files.length; i++) {
				Resizer.imageFileResizer(
					files[i],
					720,
					720,
					"JPEG",
					100,
					0,
					(uri) => {
						cloudinaryUpload1(user._id, token, { image: uri })
							.then((data) => {
								allUploadedFiles.push(data);

								setAddThumbnail({ ...addThumbnail, images: allUploadedFiles });
							})
							.catch((err) => {
								console.log("CLOUDINARY UPLOAD ERR", err);
							});
					},
					"base64",
				);
			}
		}
	};

	const FileUploadThumbnail = () => {
		return (
			<>
				<label
					className='btn btn-info btn-raised'
					style={{ cursor: "pointer", fontSize: "0.95rem" }}>
					Add a Subcategory Thumbnail
					<input
						type='file'
						hidden
						accept='images/*'
						onChange={fileUploadAndResizeThumbNail}
						required
					/>
				</label>
			</>
		);
	};

	const handleImageRemove = (public_id) => {
		setLoading(true);
		// console.log("remove image", public_id);
		axios
			.post(
				`${process.env.REACT_APP_API_URL}/admin/removeimage/${user._id}`,
				{ public_id },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			.then((res) => {
				setLoading(false);
				// eslint-disable-next-line
				const { images } = addThumbnail;
				// let filteredImages = images.filter((item) => {
				// 	return item.public_id !== public_id;
				// });
				setAddThumbnail([]);
				setTimeout(function () {
					window.location.reload(false);
				}, 1000);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
				setTimeout(function () {
					window.location.reload(false);
				}, 1000);
			});
	};

	const newSubcategoryForm = () => (
		<form onSubmit={clickSubmit}>
			<div className='form-group'>
				<label className='text-muted'>Category Name</label>
				<select onChange={handleChange2} className='form-control'>
					<option>Please select a category</option>
					{allCategories &&
						allCategories.map((c, i) => {
							return (
								<option
									value={c._id}
									key={i}
									style={{ textTransform: "capitalize" }}>
									{c.categoryName}
								</option>
							);
						})}
				</select>
			</div>
			<div className='form-group'>
				<label className='text-muted'>Subcategory Name</label>
				<input
					type='text'
					className='form-control'
					onChange={handleChange1}
					value={SubcategoryName}
					required
				/>
			</div>

			<div className='form-group'>
				<label className='text-muted'>اسم الفئة الفرعية</label>
				<input
					type='text'
					className='form-control'
					onChange={handleChange3}
					value={SubcategoryName_Arabic}
					required
				/>
			</div>

			<button className='btn btn-outline-primary mb-3'>Add Subcategory</button>
		</form>
	);

	// eslint-disable-next-line
	const showSuccess = () => {
		if (success) {
			return <h3 className='text-success'>{SubcategoryName} is created</h3>;
		}
	};

	useEffect(() => {
		Aos.init({ duration: 1500 });
	}, []);

	return (
		<AddSubcategoryWrapper>
			<div className='row'>
				<div className='col-3'>
					<AdminMenu
						fromPage='AddSubcategory'
						AdminMenuStatus={AdminMenuStatus}
						setAdminMenuStatus={setAdminMenuStatus}
					/>
				</div>

				<div className='col-8'>
					<div className='container' data-aos='fade-down'>
						<h3
							style={{ color: "#009ef7", fontWeight: "bold" }}
							className='mt-1 mb-3 text-center'>
							Add Subcategory
						</h3>
						<ToastContainer />
						<div className='m-3 col-4'>
							<div className='col-12'>
								{addThumbnail &&
									addThumbnail.images &&
									addThumbnail.images.map((image) => {
										return (
											<div className='m-3 col-6 '>
												<button
													type='button'
													className='close'
													onClick={() => {
														handleImageRemove(image.public_id);
														setAddThumbnail([]);
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
														width: "90px",
														height: "90px",
														boxShadow: "1px 1px 1px 1px rgba(0,0,0,0.2)",
													}}
													key={image.public_id}
												/>
											</div>
										);
									})}
							</div>
							{FileUploadThumbnail()}
						</div>
						{newSubcategoryForm()}
					</div>
				</div>
			</div>
		</AddSubcategoryWrapper>
	);
};

export default AddSubcategory;

const AddSubcategoryWrapper = styled.div`
	min-height: 880px;
	overflow-x: hidden;
	/* background: #ededed; */

	.container {
		margin-top: 100px;
		border: 2px solid lightgrey;
		padding: 20px;
		border-radius: 20px;
	}
`;
