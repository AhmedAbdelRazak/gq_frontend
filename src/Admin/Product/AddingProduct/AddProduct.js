/** @format */

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AdminMenu from "../../AdminMenu/AdminMenu";
import { Select } from "antd";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import {
	cloudinaryUpload1,
	createProduct,
	getCategories,
	getColors,
	getGenders,
	getListOfSubs,
	getSubCategories,
} from "../../apiAdmin";
import BasicDataForm from "./BasicDataForm";
import { isAuthenticated } from "../../../auth";
import AddingProductVariable from "./AddingProductVariable";
import { toast } from "react-toastify";
import Navbar from "../../AdminNavMenu/Navbar";
import Aos from "aos";
import "aos/dist/aos.css";
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
		return { color: "#a1a5b7", fontWeight: "bold" };
	}
};

const AddProduct = () => {
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
	const [chosenSeason, setChosenSeason] = useState("");
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
	const [stock, setStock] = useState("");
	const [chosenSizes, setChosenSizes] = useState([]);
	const [chosenColors, setChosenColors] = useState([]);
	const [addVariables, setAddVariables] = useState(true);
	const [clickedVariableLink, setClickedVariableLink] =
		useState("SizesColorsImages");
	const [variablesSubmit, setVariablesSubmit] = useState(false);
	const [clearance, setClearance] = useState(false);
	const [shipping, setShipping] = useState(true);
	const [activeProduct, setActiveProduct] = useState(true);
	const [featured, setFeatured] = useState(false);
	const [productAttributesFinal, setProductAttributesFinal] = useState([]);
	const [AdminMenuStatus, setAdminMenuStatus] = useState(false);
	const [offset, setOffset] = useState(0);
	const [parentPrice1, setParentPrice1] = useState(0);
	const [parentPrice2, setParentPrice2] = useState(0);
	const [parentPrice3, setParentPrice3] = useState(0);
	const [parentPrice4, setParentPrice4] = useState(0);
	const [parentPrice5, setParentPrice5] = useState(0);

	const [WholeSalePriceBasic, setWholePriceBasic] = useState(0);
	const [DropShippingPriceBasic, setDropShippingBasic] = useState(0);

	const [pageScrolled, setPageScrolled] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	const [inheritPrice, setInheritPrice] = useState(false);
	const [inheritParentSKU, setInheritParentSKU] = useState(false);
	const [allColors, setAllColors] = useState([]);

	let productAttributes = [];

	const { user, token } = isAuthenticated();

	const BasicDataFormFunction = () => (
		<React.Fragment>
			<BasicDataForm
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
				parentPrice1={parentPrice1}
				setParentPrice1={setParentPrice1}
				parentPrice2={parentPrice2}
				setParentPrice2={setParentPrice2}
				parentPrice3={parentPrice3}
				setParentPrice3={setParentPrice3}
				parentPrice4={parentPrice4}
				setParentPrice4={setParentPrice4}
				parentPrice5={parentPrice5}
				setParentPrice5={setParentPrice5}
				inheritPrice={inheritPrice}
				setInheritPrice={setInheritPrice}
				inheritParentSKU={inheritParentSKU}
				setInheritParentSKU={setInheritParentSKU}
			/>
		</React.Fragment>
	);

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
		gettingAllCategories();
		gettingAllSubcategories();
		gettingAllGenders();
		gettingAllColors();
		// eslint-disable-next-line
	}, []);

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
			<form className='formwrapper'>
				<div className='form-group  col-md-5 '>
					<label>Gender</label>
					<select
						name='gender'
						className='form-control'
						onChange={handleChangeGender}>
						<option>Please select</option>
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
						<option>Please select</option>
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

	const handleChangeWholeSaleBasic = (e) => {
		setWholePriceBasic(e.target.value);
	};

	const handleChangeDropShippingBasic = (e) => {
		setDropShippingBasic(e.target.value);
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
				<div className='form-group mt-4'>
					<label
						className='text-muted'
						style={{ fontWeight: "bold", fontSize: "13px" }}>
						Add Other Variables
					</label>
					<input
						type='checkbox'
						className='ml-2 mt-2'
						onChange={() => {
							setAddVariables(!addVariables);
							setClickedLink("AddVariables");
						}}
						checked={addVariables === true ? true : false}
					/>
				</div>

				<div className='form-group'>
					<label
						className='text-muted'
						style={{ fontWeight: "bold", fontSize: "13px" }}>
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
						style={{ fontWeight: "bold", fontSize: "13px" }}>
						Product Retail Price
					</label>
					<input
						type='text'
						className='form-control'
						onChange={handleChange3}
						value={price}
					/>
				</div>

				<div className='form-group'>
					<label
						className='text-muted'
						style={{ fontWeight: "bold", fontSize: "13px" }}>
						Product Price After Discount
					</label>
					<input
						type='text'
						className='form-control'
						onChange={handleChange4}
						value={priceAfterDiscount}
					/>
				</div>

				<div className='form-group'>
					<label
						className='text-muted'
						style={{ fontWeight: "bold", fontSize: "13px" }}>
						Whole Sale Price
					</label>
					<input
						type='text'
						className='form-control'
						onChange={handleChangeWholeSaleBasic}
						value={WholeSalePriceBasic}
					/>
				</div>

				<div className='form-group'>
					<label
						className='text-muted'
						style={{ fontWeight: "bold", fontSize: "13px" }}>
						Dropshipping Price
					</label>
					<input
						type='text'
						className='form-control'
						onChange={handleChangeDropShippingBasic}
						value={DropShippingPriceBasic}
					/>
				</div>

				<div className='form-group'>
					<label
						className='text-muted'
						style={{ fontWeight: "bold", fontSize: "13px" }}>
						Product Stock Level
					</label>
					<input
						type='text'
						className='form-control'
						onChange={handleChange5}
						value={stock}
					/>
				</div>

				<button
					className='btn btn-outline-primary mb-3'
					onClick={() => {
						setClickedLink("ExtraOptions");
						window.scrollTo({ top: 0, behavior: "smooth" });
					}}>
					Next: Add Other Features
				</button>
			</form>
		);
	};

	const AddingProductVariableFunction = () => {
		return (
			<React.Fragment>
				<AddingProductVariable
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
					parentPrice1={parentPrice1}
					setParentPrice1={setParentPrice1}
					parentPrice2={parentPrice2}
					setParentPrice2={setParentPrice2}
					parentPrice3={parentPrice3}
					setParentPrice3={setParentPrice3}
					parentPrice4={parentPrice4}
					setParentPrice4={setParentPrice4}
					parentPrice5={parentPrice5}
					setParentPrice5={setParentPrice5}
					inheritPrice={inheritPrice}
					setInheritPrice={setInheritPrice}
					inheritParentSKU={inheritParentSKU}
					setInheritParentSKU={setInheritParentSKU}
					productSKU={productSKU}
				/>
			</React.Fragment>
		);
	};

	const AddProductToDatabase = (e) => {
		e.preventDefault();
		setClickedLink("MainData");
		window.scrollTo({ top: 0, behavior: "smooth" });

		if (
			!productName ||
			!productName_Arabic ||
			!productSKU ||
			!description ||
			!description_Arabic ||
			!chosenSeason
		) {
			setClickedLink("MainData");
			return toast.error("Please Add Product Main Data");
		}

		if (addThumbnail.length === 0) {
			return toast.error("Please Add Product Main Image");
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
			DropShippingPriceBasic: addVariables ? 0 : DropShippingPriceBasic,
			WholeSalePriceBasic: addVariables ? 0 : WholeSalePriceBasic,
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

		createProduct(user._id, token, values).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				toast.success("Product Was Successfully Added");
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
						Outlet
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
						onClick={AddProductToDatabase}>
						Add Product To Your Online Store Inventory
					</button>
				</div>
			</form>
		);
	};

	const f = (a, b) => [].concat(...a.map((d) => b.map((e) => [].concat(d, e))));
	const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);

	let combinationsOfColorSizes = cartesian(chosenSizes, chosenColors);

	console.log(combinationsOfColorSizes, "Main Combination");

	for (let i = 1; i <= combinationsOfColorSizes.length; i++) {
		// console.log(combinationsOfColorSizes[i - 1], "From first Loop");

		for (let ii = 1; ii < combinationsOfColorSizes[i - 1].length; ii++) {
			productAttributes = [
				...productAttributes,
				{
					size: combinationsOfColorSizes[i - 1][ii - 1],
					color: combinationsOfColorSizes[i - 1][ii],
					quantity: 0,
					price: inheritPrice ? parentPrice2 : 0,
					priceAfterDiscount: inheritPrice ? parentPrice3 : 0,
					MSRP: inheritPrice ? parentPrice1 : 0,
					WholeSalePrice: inheritPrice ? parentPrice4 : 0,
					DropShippingPrice: inheritPrice ? parentPrice5 : 0,
					productImages: [],
					SubSKU: inheritParentSKU
						? productSKU +
						  "-" +
						  (allColors &&
								allColors[0] &&
								allColors[
									allColors
										.map((i) => i.hexa)
										.indexOf(combinationsOfColorSizes[i - 1][ii])
								].color.substring(0, 3)) +
						  "-" +
						  combinationsOfColorSizes[i - 1][ii - 1].substring(0, 4)
						: "",
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
	}, [
		variablesSubmit,
		chosenSizes,
		chosenColors,
		inheritPrice,
		inheritParentSKU,
	]);

	useEffect(() => {
		Aos.init({ duration: 1500 });
	}, []);

	useEffect(() => {
		const onScroll = () => setOffset(window.pageYOffset);
		// clean up code
		window.removeEventListener("scroll", onScroll);
		window.addEventListener("scroll", onScroll, { passive: true });
		if (window.pageYOffset > 0) {
			setPageScrolled(true);
		} else {
			setPageScrolled(false);
		}
		return () => window.removeEventListener("scroll", onScroll);
	}, [offset]);

	return (
		<AddProductWrapper show={AdminMenuStatus}>
			{!collapsed ? (
				<DarkBG collapsed={collapsed} setCollapsed={setCollapsed} />
			) : null}
			<div className='grid-container'>
				<div className=''>
					<AdminMenu
						fromPage='AddProduct'
						AdminMenuStatus={AdminMenuStatus}
						setAdminMenuStatus={setAdminMenuStatus}
						collapsed={collapsed}
						setCollapsed={setCollapsed}
					/>
				</div>
				<div className='mainContent'>
					<Navbar fromPage='AddProduct' pageScrolled={pageScrolled} />

					<h3
						className='mx-auto text-center py-4 col-md-6 mx-auto'
						style={{
							color: "#009ef7",
							fontWeight: "bold",
							background: "white",
						}}>
						{clickedLink === "MainData"
							? "Add A New Product (Basic Data)"
							: clickedLink === "AddCategorySubcategory"
							? `Add Category & Subcategory For Product ${productName}`
							: clickedLink === "AddPrices"
							? `Add Prices & Inventory For Product ${productName}`
							: clickedLink === "ExtraOptions"
							? "Add Product Features & Status"
							: "Add Suitable Variables and Photos"}
					</h3>

					<div className='row'>
						<div className='col-md-3' data-aos='fade-up'>
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
								data-aos='fade-down'
								className='col-md-8 ml-3 rightContentWrapper'
								// style={{ borderLeft: "darkred 2px solid" }}
							>
								{BasicDataFormFunction()}
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
								{AddingProductVariableFunction()}
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
		</AddProductWrapper>
	);
};

export default AddProduct;

const AddProductWrapper = styled.div`
	min-height: 880px;
	overflow-x: hidden;
	/* background: #ededed; */

	.grid-container {
		display: grid;
		grid-template-columns: ${(props) =>
			props.show ? "4.5% 95.5%" : "15.2% 84.8%"};
		margin: auto;
		/* border: 1px solid red; */
		/* grid-auto-rows: minmax(60px, auto); */
	}
	.mainContent {
		/* margin-top: 50px; */
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

	.formwrapper {
		background: white !important;
		padding: 10px 20px;
		border-radius: 5px;
	}

	@media (max-width: 1750px) {
		background: white;

		.grid-container {
			display: grid;
			/* grid-template-columns: 18% 82%; */
			grid-template-columns: ${(props) => (props.show ? "7% 93%" : "18% 82%")};
			margin: auto;
			/* border: 1px solid red; */
			/* grid-auto-rows: minmax(60px, auto); */
		}
	}

	@media (max-width: 1400px) {
		background: white;

		.grid-container {
			display: grid;
			grid-template-columns: 12% 88%;
			margin: auto;
			/* border: 1px solid red; */
			/* grid-auto-rows: minmax(60px, auto); */
		}
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
