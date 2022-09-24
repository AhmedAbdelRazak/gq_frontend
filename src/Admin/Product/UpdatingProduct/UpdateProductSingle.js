/** @format */

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AdminMenu from "../../AdminMenu/AdminMenu";
import { Select } from "antd";
// eslint-disable-next-line
import Resizer from "react-image-file-resizer";
// eslint-disable-next-line
import axios from "axios";
import {
	getProducts,
	getCategories,
	getGenders,
	getListOfSubs,
	getSubCategories,
	cloudinaryUpload1,
	updateProduct,
} from "../../apiAdmin";
import { isAuthenticated } from "../../../auth";
// eslint-disable-next-line
import { toast } from "react-toastify";
import UpdateBasicDataForm from "./UpdateBasicDataForm";
import UpdatingProductVariable from "./UpdateProductVariable";
import DarkBG from "../../AdminMenu/DarkBG";
const { Option } = Select;

const isActive = (clickedLink, sureClickedLink) => {
	if (clickedLink === sureClickedLink) {
		return {
			// color: "white !important",
			background: "#dbeeff",
			fontWeight: "bold",
			padding: "10px 2px",
			borderRadius: "5px",
			// textDecoration: "underline",
		};
	} else {
		return { color: "black", fontWeight: "bold" };
	}
};

const UpdateProductSingle = ({ match }) => {
	const [clickedLink, setClickedLink] = useState("MainData");
	// eslint-disable-next-line
	const [loading, setLoading] = useState(true);
	const [productName, setProductName] = useState("");
	const [productName_Arabic, setProductName_Arabic] = useState("");
	const [productSKU, setProductSKU] = useState("");
	// eslint-disable-next-line
	const [slug, setSlug] = useState("");
	// eslint-disable-next-line
	const [slug_Arabic, setSlug_Arabic] = useState("");
	const [description, setDescription] = useState("");
	const [description_Arabic, setDescription_Arabic] = useState("");
	const [chosenSubcategories, setChosenSubcategories] = useState("");
	// eslint-disable-next-line
	const [chosenCategory, setChosenCategory] = useState("");
	const [chosenGender, setChosenGender] = useState("");
	const [allCategories, setAllCategories] = useState([]);
	const [subsOptions, setSubsOptions] = useState([]);
	// eslint-disable-next-line
	const [allSubcategories, setAllSubcategories] = useState([]);
	// eslint-disable-next-line
	const [allGenders, setAllGenders] = useState([]);
	const [addThumbnail, setAddThumbnail] = useState([]);
	const [price, setPrice] = useState("");
	const [priceAfterDiscount, setPriceAfterDiscount] = useState("");
	const [MSRPPriceBasic, setMSRPPriceBasic] = useState("");
	const [chosenSeason, setChosenSeason] = useState("");
	const [stock, setStock] = useState("");
	const [chosenSizes, setChosenSizes] = useState([]);
	const [chosenColors, setChosenColors] = useState([]);
	const [addVariables, setAddVariables] = useState(false);
	const [clickedVariableLink, setClickedVariableLink] =
		useState("SizesColorsImages");
	const [variablesSubmit, setVariablesSubmit] = useState(false);
	const [clearance, setClearance] = useState(false);
	const [shipping, setShipping] = useState(true);
	const [activeProduct, setActiveProduct] = useState(true);
	const [featured, setFeatured] = useState(false);
	const [productAttributesFinal, setProductAttributesFinal] = useState([]);
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [collapsed, setCollapsed] = useState(false);

	let productAttributes = [];

	const { user, token } = isAuthenticated();

	const gettingAllProducts = () => {
		getProducts().then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				productAttributes = data.filter(
					(e) => e._id === match.params.productId,
				)[0].productAttributes;

				setProductName(
					data.filter((e) => e._id === match.params.productId)[0].productName,
				);
				setProductName_Arabic(
					data.filter((e) => e._id === match.params.productId)[0]
						.productName_Arabic,
				);
				setSlug(data.filter((e) => e._id === match.params.productId)[0].slug);
				setSlug_Arabic(
					data.filter((e) => e._id === match.params.productId)[0].slug_Arabic,
				);
				setProductSKU(
					data.filter((e) => e._id === match.params.productId)[0].productSKU,
				);
				setDescription(
					data.filter((e) => e._id === match.params.productId)[0].description,
				);
				setDescription_Arabic(
					data.filter((e) => e._id === match.params.productId)[0]
						.description_Arabic,
				);
				setChosenSubcategories(
					data.filter((e) => e._id === match.params.productId)[0].subcategory,
				);
				setChosenCategory(
					data.filter((e) => e._id === match.params.productId)[0].category,
				);
				setChosenGender(
					data.filter((e) => e._id === match.params.productId)[0].gender,
				);
				setAddThumbnail(
					data.filter((e) => e._id === match.params.productId)[0]
						.thumbnailImage[0].images[0]
						? data.filter((e) => e._id === match.params.productId)[0]
								.thumbnailImage[0]
						: [],
				);

				setPrice(data.filter((e) => e._id === match.params.productId)[0].price);
				setPriceAfterDiscount(
					data.filter((e) => e._id === match.params.productId)[0]
						.priceAfterDiscount,
				);
				setMSRPPriceBasic(
					data.filter((e) => e._id === match.params.productId)[0]
						.MSRPPriceBasic,
				);
				setStock(
					data.filter((e) => e._id === match.params.productId)[0].quantity,
				);

				setChosenSeason(
					data.filter((e) => e._id === match.params.productId)[0].chosenSeason,
				);

				setAddVariables(
					data.filter((e) => e._id === match.params.productId)[0].addVariables,
				);
				setClearance(
					data.filter((e) => e._id === match.params.productId)[0].clearance,
				);
				setShipping(
					data.filter((e) => e._id === match.params.productId)[0].shipping,
				);
				setActiveProduct(
					data.filter((e) => e._id === match.params.productId)[0].activeProduct,
				);
				setFeatured(
					data.filter((e) => e._id === match.params.productId)[0].featured,
				);
				setProductAttributesFinal(
					data.filter((e) => e._id === match.params.productId)[0]
						.productAttributes,
				);

				setChosenColors([
					...new Set(
						data
							.filter((e) => e._id === match.params.productId)[0]
							.productAttributes.map((ii) => ii.color),
					),
				]);
				setChosenSizes([
					...new Set(
						data
							.filter((e) => e._id === match.params.productId)[0]
							.productAttributes.map((ii) => ii.size),
					),
				]);
				getListOfSubs(
					data.filter((e) => e._id === match.params.productId)[0].category._id,
				).then((data) => {
					if (data.error) {
						console.log(data.error);
					} else {
						setSubsOptions(data);
					}
				});
			}
		});
	};

	const gettingAllCategories = () => {
		getCategories(user._id, token).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllCategories(data.filter((c) => c.categoryStatus === true));
			}
		});
	};

	const gettingAllSubcategories = () => {
		getSubCategories(token).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllSubcategories(data.filter((c) => c.subCategoryStatus === true));
			}
		});
	};

	const gettingAllGenders = () => {
		getGenders(token).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllGenders(data);
			}
		});
	};

	useEffect(() => {
		gettingAllProducts();
		gettingAllCategories();
		gettingAllSubcategories();
		gettingAllGenders();

		// eslint-disable-next-line
	}, [match.params.productId, variablesSubmit]);

	const UpdateBasicDataFormFunction = () => (
		<React.Fragment>
			<UpdateBasicDataForm
				setProductName={setProductName}
				productName={productName}
				productName_Arabic={productName_Arabic}
				setProductName_Arabic={setProductName_Arabic}
				description={description}
				setDescription={setDescription}
				description_Arabic={description_Arabic}
				setDescription_Arabic={setDescription_Arabic}
				setSlug={setSlug}
				setSlug_Arabic={setSlug_Arabic}
				productSKU={productSKU}
				setProductSKU={setProductSKU}
				setAddVariables={setAddVariables}
				addVariables={addVariables}
				setClickedLink={setClickedLink}
				chosenSeason={chosenSeason}
				setChosenSeason={setChosenSeason}
			/>
		</React.Fragment>
	);

	const handleCategoryChange = (e) => {
		setChosenCategory(e.target.value);
		setChosenSubcategories([]);

		getListOfSubs(e.target.value).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setSubsOptions(data);
			}
		});
	};

	const handleChangeGender = (e) => {
		setChosenGender(e.target.value);
	};

	const CategorySubcategoryEntry = () => {
		return (
			<form>
				<div className='form-group  col-md-5 '>
					<label>Gender</label>
					<select
						name='gender'
						className='form-control'
						onChange={handleChangeGender}>
						<option>
							{" "}
							{chosenGender ? chosenGender.genderName : "Please select"}{" "}
						</option>
						{allGenders.length > 0 &&
							allGenders.map((c) => (
								<option key={c._id} value={c._id}>
									{c.genderName}
								</option>
							))}
					</select>
				</div>
				<div className='form-group  col-md-5 '>
					<label>Category</label>
					<select
						name='category'
						className='form-control'
						onChange={handleCategoryChange}>
						<option>
							{chosenCategory ? chosenCategory.categoryName : "Please select"}{" "}
						</option>
						{allCategories.length > 0 &&
							allCategories.map((c) => (
								<option key={c._id} value={c._id}>
									{c.categoryName}
								</option>
							))}
					</select>
				</div>
				{subsOptions && subsOptions.length > 0 && (
					<div className='form-group   col-md-5'>
						<label>Sub Category</label>
						<Select
							mode='multiple'
							style={{ width: "100%" }}
							placeholder='Please Select a subcategory'
							value={chosenSubcategories}
							onChange={(value) => setChosenSubcategories(value)}>
							{subsOptions &&
								subsOptions.map((sub, i) => {
									return (
										<Option key={i} value={sub._id}>
											{sub.SubcategoryName}
										</Option>
									);
								})}
						</Select>
					</div>
				)}
				<button
					className='btn btn-outline-primary my-3 ml-3'
					onClick={() => {
						setClickedLink(addVariables ? "AddVariables" : "AddPrices");
						window.scrollTo({ top: 0, behavior: "smooth" });
					}}>
					{addVariables
						? "Next: Add Product Variables (Product Images, Sizes, Colors, etc..)"
						: "Next: Add Product Prices & Stock"}
				</button>
			</form>
		);
	};

	const handleChange3 = (e) => {
		setPrice(e.target.value);
	};

	const handleChange4 = (e) => {
		setPriceAfterDiscount(e.target.value);
	};

	const handleChange5 = (e) => {
		setStock(e.target.value);
	};
	const handleChange6 = (e) => {
		setMSRPPriceBasic(e.target.value);
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
					Add Product Images
					<input
						type='file'
						hidden
						multiple
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
				// eslint-disable-next-line
				const { images } = addThumbnail;
				let filteredImages = images.filter((item) => {
					return item.public_id !== public_id;
				});
				setAddThumbnail({ ...addThumbnail, images: filteredImages });
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
				// setTimeout(function () {
				// 	window.location.reload(false);
				// }, 1000);
			});
	};

	const AddPricesStockBasic = () => {
		return (
			<form>
				<div className='m-3 col-5'>
					<div className='col-12 row mb-2'>
						{addThumbnail &&
							addThumbnail.images &&
							addThumbnail.images.map((image, iii) => {
								return (
									<div className=' mx-2 col-4 ' key={iii}>
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

				<div className='form-group'>
					<label
						className='text-muted'
						style={{ fontWeight: "bold", fontSize: "17px" }}>
						Manufacturing Price
					</label>
					<input
						type='text'
						className='form-control'
						onChange={handleChange6}
						value={MSRPPriceBasic}
					/>
				</div>

				<div className='form-group'>
					<label
						className='text-muted'
						style={{ fontWeight: "bold", fontSize: "17px" }}>
						Product Price
					</label>
					<input
						type='text'
						className='form-control'
						onChange={handleChange3}
						value={price}
						required
					/>
				</div>

				<div className='form-group'>
					<label
						className='text-muted'
						style={{ fontWeight: "bold", fontSize: "17px" }}>
						Product Price After Discount
					</label>
					<input
						type='text'
						className='form-control'
						onChange={handleChange4}
						value={priceAfterDiscount}
						required
					/>
				</div>

				<div className='form-group'>
					<label
						className='text-muted'
						style={{ fontWeight: "bold", fontSize: "17px" }}>
						Product Stock Level
					</label>
					<input
						type='text'
						className='form-control'
						onChange={handleChange5}
						value={stock}
						required
					/>
				</div>

				<button
					className='btn btn-outline-primary mb-3'
					onClick={() => {
						setClickedLink("ExtraOptions");
						window.scrollTo({ top: 0, behavior: "smooth" });
					}}>
					Add Other Features
				</button>
			</form>
		);
	};

	const UpdatingProductVariableFunction = () => {
		return (
			<React.Fragment>
				<UpdatingProductVariable
					clickedVariableLink={clickedVariableLink}
					setClickedVariableLink={setClickedVariableLink}
					setAddVariables={setAddVariables}
					addVariables={addVariables}
					setChosenColors={setChosenColors}
					chosenColors={chosenColors}
					setChosenSizes={setChosenSizes}
					chosenSizes={chosenSizes}
					setVariablesSubmit={setVariablesSubmit}
					variablesSubmit={variablesSubmit}
					productAttributesFinal={productAttributesFinal}
					setProductAttributesFinal={setProductAttributesFinal}
					setClickedLink={setClickedLink}
					productAttributes={productAttributes}
					setAddThumbnail={setAddThumbnail}
					addThumbnail={addThumbnail}
				/>
			</React.Fragment>
		);
	};
	const UpdateProductToDatabase = (e) => {
		e.preventDefault();
		setClickedLink("MainData");
		window.scrollTo({ top: 0, behavior: "smooth" });

		if (
			!productName ||
			!productName_Arabic ||
			!productSKU ||
			!description ||
			!description_Arabic
		) {
			setClickedLink("MainData");
			return toast.error("Please Add Product Main Data");
		}

		if (!chosenCategory || chosenSubcategories.length < 1 || !chosenGender) {
			setClickedLink("AddCategorySubcategory");
			return toast.error("Please Add Product Categories & Subcategories");
		}

		if (!addVariables) {
			if (!price || !priceAfterDiscount || !stock) {
				setClickedLink("AddPrices");
				return toast.error("Please Add Product Categories & Subcategories");
			}
		}

		if (addVariables) {
			if (!variablesSubmit) {
				setClickedVariableLink("SizesColorsImages");
				return toast.error("Please Submit Your Added Variables");
			}
		}
		if (addVariables) {
			if (chosenColors.length < 1 || chosenSizes.length < 1) {
				setClickedVariableLink("SizesColorsImages");
				return toast.error("Please Add Your Product Colors & Sizes");
			}
		}

		const values = {
			productName: productName,
			productName_Arabic: productName_Arabic,
			productSKU: productSKU,
			slug: slug,
			slug_Arabic: slug_Arabic,
			description: description,
			description_Arabic: description_Arabic,
			price: addVariables ? 0 : price,
			priceAfterDiscount: addVariables ? 0 : priceAfterDiscount,
			MSRPPriceBasic: addVariables ? 0 : Number(MSRPPriceBasic),
			price_unit: "LE",
			loyaltyPoints: 10,
			category: chosenCategory,
			subcategory: chosenSubcategories,
			gender: chosenGender,
			addedByEmployee: user._id,
			updatedByEmployee: user._id,
			quantity: addVariables ? 0 : stock,
			thumbnailImage: addThumbnail,
			relatedProducts: [],
			shipping: shipping,
			addVariables: addVariables,
			clearance: clearance,
			productAttributes: addVariables ? productAttributesFinal : [],
			activeProduct: activeProduct,
			chosenSeason: chosenSeason,
			featuredProduct: featured,
		};

		updateProduct(match.params.productId, user._id, token, {
			product: values,
		}).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				toast.success("Product Was Successfully Updated");
				setTimeout(function () {
					window.location.reload(false);
				}, 3000);
			}
		});
	};

	const extraFeatures = () => {
		return (
			<form className='mt-4 ml-5'>
				<div className='form-group'>
					<label
						className='text-muted'
						style={{ fontWeight: "bold", fontSize: "17px" }}>
						Active Product
					</label>
					<input
						type='checkbox'
						className='ml-2 mt-2'
						onChange={() => setActiveProduct(!activeProduct)}
						checked={activeProduct === true ? true : false}
					/>
				</div>

				<div className='form-group mt-5'>
					<label
						className='text-muted'
						style={{ fontWeight: "bold", fontSize: "17px" }}>
						Shippable Product
					</label>
					<input
						type='checkbox'
						className='ml-2 mt-2'
						onChange={() => setShipping(!shipping)}
						checked={shipping === true ? true : false}
					/>
				</div>

				<div className='form-group mt-5'>
					<label
						className='text-muted'
						style={{ fontWeight: "bold", fontSize: "17px" }}>
						Clearance
					</label>
					<input
						type='checkbox'
						className='ml-2 mt-2'
						onChange={() => setClearance(!clearance)}
						checked={clearance === true ? true : false}
					/>
				</div>

				<div className='form-group mt-5'>
					<label
						className='text-muted'
						style={{ fontWeight: "bold", fontSize: "17px" }}>
						Add First Thing In Home Page
					</label>
					<input
						type='checkbox'
						className='ml-2 mt-2'
						onChange={() => setFeatured(!featured)}
						checked={featured === true ? true : false}
					/>
				</div>
				<div className='mx-auto text-center'>
					<button
						className='btn btn-success mb-3 mx-auto text-center'
						onClick={UpdateProductToDatabase}>
						Update Product To Your Online Store Inventory
					</button>
				</div>
			</form>
		);
	};

	const f = (a, b) => [].concat(...a.map((d) => b.map((e) => [].concat(d, e))));
	const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);

	let combinationsOfColorSizes = cartesian(chosenSizes, chosenColors);

	const allPrimaryKeys = productAttributesFinal.map((i) => i.PK);

	for (let i = 1; i <= combinationsOfColorSizes.length; i++) {
		for (let ii = 1; ii < combinationsOfColorSizes[i - 1].length; ii++) {
			productAttributes = [
				...productAttributes,
				{
					size: combinationsOfColorSizes[i - 1][ii - 1],
					color: combinationsOfColorSizes[i - 1][ii],
					quantity:
						allPrimaryKeys.indexOf(
							combinationsOfColorSizes[i - 1][ii - 1] +
								combinationsOfColorSizes[i - 1][ii],
						) > -1
							? productAttributesFinal[
									allPrimaryKeys.indexOf(
										combinationsOfColorSizes[i - 1][ii - 1] +
											combinationsOfColorSizes[i - 1][ii],
									)
							  ].quantity
							: 0,
					price:
						allPrimaryKeys.indexOf(
							combinationsOfColorSizes[i - 1][ii - 1] +
								combinationsOfColorSizes[i - 1][ii],
						) > -1
							? productAttributesFinal[
									allPrimaryKeys.indexOf(
										combinationsOfColorSizes[i - 1][ii - 1] +
											combinationsOfColorSizes[i - 1][ii],
									)
							  ].price
							: 0,
					priceAfterDiscount:
						allPrimaryKeys.indexOf(
							combinationsOfColorSizes[i - 1][ii - 1] +
								combinationsOfColorSizes[i - 1][ii],
						) > -1
							? productAttributesFinal[
									allPrimaryKeys.indexOf(
										combinationsOfColorSizes[i - 1][ii - 1] +
											combinationsOfColorSizes[i - 1][ii],
									)
							  ].priceAfterDiscount
							: 0,

					MSRP:
						allPrimaryKeys.indexOf(
							combinationsOfColorSizes[i - 1][ii - 1] +
								combinationsOfColorSizes[i - 1][ii],
						) > -1
							? productAttributesFinal[
									allPrimaryKeys.indexOf(
										combinationsOfColorSizes[i - 1][ii - 1] +
											combinationsOfColorSizes[i - 1][ii],
									)
							  ].MSRP
							: 0,

					productImages: productAttributesFinal[i - 1]
						? productAttributesFinal[i - 1].productImages
						: [],
					SubSKU:
						productAttributesFinal[i - 1] &&
						productAttributesFinal[i - 1].SubSKU
							? productAttributesFinal[i - 1].SubSKU
							: null,
					PK:
						combinationsOfColorSizes[i - 1][ii - 1] +
						combinationsOfColorSizes[i - 1][ii],
				},
			];
		}
	}

	useEffect(() => {
		setProductAttributesFinal(productAttributes);
		// eslint-disable-next-line
	}, [variablesSubmit, chosenColors, chosenSizes]);

	return (
		<UpdateProductSingleWrapper>
			{!collapsed ? (
				<DarkBG collapsed={collapsed} setCollapsed={setCollapsed} />
			) : null}
			<div className='grid-container'>
				<div className=''>
					<AdminMenu
						fromPage='UpdateProduct'
						AdminMenuStatus={AdminMenuStatus}
						setAdminMenuStatus={setAdminMenuStatus}
						collapsed={collapsed}
						setCollapsed={setCollapsed}
					/>
				</div>
				<div className='mainContent'>
					<h3 className='mx-auto text-center mb-5 text-capitalize'>
						{clickedLink === "MainData"
							? `Update Product "${productName}" (Basic Data)`
							: clickedLink === "AddCategorySubcategory"
							? `Update Category & Subcategory For Product ${productName}`
							: clickedLink === "AddPrices"
							? `Update Prices & Inventory For Product ${productName}`
							: clickedLink === "ExtraOptions"
							? "Update Product Features & Status"
							: "Update Suitable Variables and Photos"}
					</h3>
					<div className='row'>
						<div className='col-md-3'>
							<ul className='mainUL'>
								<li
									className='mb-4 mainLi'
									onClick={() => setClickedLink("MainData")}
									style={isActive("MainData", clickedLink)}>
									Add Product (Main Data)
								</li>
								<hr />
								<li
									className='my-4 mainLi'
									onClick={() => setClickedLink("AddCategorySubcategory")}
									style={isActive("AddCategorySubcategory", clickedLink)}>
									Add Product Category/ Subcategory
								</li>
								<hr />
								{!addVariables ? (
									<>
										<li
											className='my-4 mainLi'
											onClick={() => setClickedLink("AddPrices")}
											style={isActive("AddPrices", clickedLink)}>
											Add Product Prices And Stock
										</li>
										<hr />
									</>
								) : null}

								{addVariables ? (
									<>
										<li
											className='my-4 mainLi'
											onClick={() => setClickedLink("AddVariables")}
											style={isActive("AddVariables", clickedLink)}>
											Miscellaneous (Product Images, Sizes, Colors, etc..)
										</li>
										<hr />
									</>
								) : null}

								<li
									className='my-4 mainLi'
									onClick={() => setClickedLink("ExtraOptions")}
									style={isActive("ExtraOptions", clickedLink)}>
									Add Product Extra Options
								</li>
								<hr />
							</ul>
						</div>

						{clickedLink === "MainData" ? (
							<div
								className='col-md-8 ml-3 rightContentWrapper'
								// style={{ borderLeft: "darkred 2px solid" }}
							>
								{UpdateBasicDataFormFunction()}
							</div>
						) : null}

						{clickedLink === "AddCategorySubcategory" ? (
							<div
								className='col-8 ml-3 rightContentWrapper'
								// style={{ borderLeft: "darkred 2px solid" }}
							>
								{CategorySubcategoryEntry()}
							</div>
						) : null}
						{clickedLink === "AddPrices" ? (
							<div
								className='col-8 ml-3 rightContentWrapper'
								// style={{ borderLeft: "darkred 2px solid" }}
							>
								{AddPricesStockBasic()}
							</div>
						) : null}

						{clickedLink === "AddVariables" ? (
							<div
								className='col-8 ml-3 rightContentWrapper'
								// style={{ borderLeft: "darkred 2px solid" }}
							>
								{UpdatingProductVariableFunction()}
							</div>
						) : null}

						{clickedLink === "ExtraOptions" ? (
							<div
								className='col-8 ml-3 rightContentWrapper'
								// style={{ borderLeft: "darkred 2px solid" }}
							>
								{extraFeatures()}
							</div>
						) : null}
					</div>
				</div>
			</div>
		</UpdateProductSingleWrapper>
	);
};

export default UpdateProductSingle;

const UpdateProductSingleWrapper = styled.div`
	min-height: 880px;
	overflow-x: hidden;
	/* background: #ededed; */

	.grid-container {
		display: grid;
		grid-template-columns: 15.5% 84.5%;
		margin: auto;
		/* border: 1px solid red; */
		/* grid-auto-rows: minmax(60px, auto); */
	}
	.mainContent {
		margin-top: 50px;
	}

	.mainUL {
		list-style: none;
	}

	.mainLi {
		font-weight: bold;
		transition: 0.3s;
	}

	.mainLi:hover {
		background: #002a52 !important;
		padding: 1px;
		color: white !important;
		border-radius: 5px;
		cursor: pointer;
		transition: 0.3s;
	}

	.variableLinksItem {
		font-weight: bold;
		transition: 0.3s;
	}

	.variableLinksItem:hover {
		background: #002a52 !important;
		/* padding: 1px; */
		color: white !important;
		border-radius: 5px;
		cursor: pointer;
		transition: 0.3s;
	}

	.rightContentWrapper {
		border-left: 1px lightgrey solid;
		min-height: 550px;
	}

	@media (max-width: 1550px) {
		.mainUL > li {
			font-size: 0.75rem;
			margin-left: 20px;
		}

		label {
			font-size: 0.8rem !important;
		}

		h3 {
			font-size: 1.2rem !important;
		}
		.rightContentWrapper {
			border-left: 1px lightgrey solid;
			min-height: 550px;
			margin-left: 30px !important;
		}
	}
	@media (max-width: 750px) {
		.grid-container {
			display: grid;
			/* grid-template-columns: 16% 84%; */
			grid-template-columns: ${(props) => (props.show ? "0% 99%" : "0% 100%")};
			margin: auto;
			/* border: 1px solid red; */
			/* grid-auto-rows: minmax(60px, auto); */
		}
		h3 {
			margin-top: 60px !important;
		}

		.rightContentWrapper {
			margin-top: 20px;
			margin-left: ${(props) => (props.show ? "0px" : "20px")};
		}

		.mainUL {
			display: none;
		}
	}
`;
