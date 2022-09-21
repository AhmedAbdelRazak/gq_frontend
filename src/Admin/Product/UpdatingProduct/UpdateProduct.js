/** @format */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import AdminMenu from "../../AdminMenu/AdminMenu";
import { getProducts } from "../../apiAdmin";

const UpdateProduct = () => {
	const [allProducts, setAllProducts] = useState([]);
	const [q, setQ] = useState("");

	const gettingAllProducts = () => {
		getProducts().then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setAllProducts(data);
			}
		});
	};

	useEffect(() => {
		gettingAllProducts();
		// eslint-disable-next-line
	}, []);

	function search(orders) {
		return orders.filter((row) => {
			return (
				row.productName.toLowerCase().indexOf(q) > -1 ||
				row.productName_Arabic.toLowerCase().indexOf(q) > -1 ||
				row.productSKU.toLowerCase().indexOf(q) > -1
			);
		});
	}

	return (
		<UpdateProductWrapper>
			<div className='row'>
				<div className='col-3'>
					<AdminMenu fromPage='UpdateProduct' />
				</div>
				<div className='col-8'>
					<ul className='list-group col-md-10 mx-auto'>
						<h3
							className='text-center mt-5'
							style={{ color: "#009ef7", fontWeight: "bold" }}>
							All {allProducts && allProducts.length} Products in your store
						</h3>
						<div className=' mb-3 form-group mx-3 text-center'>
							<label
								className='mt-3 mx-3'
								style={{
									fontWeight: "bold",
									fontSize: "1.05rem",
									color: "black",
									borderRadius: "20px",
								}}>
								Search
							</label>
							<input
								className='p-2 my-5 '
								type='text'
								value={q}
								onChange={(e) => setQ(e.target.value.toLowerCase())}
								placeholder='Search By Product Name Or SKU'
								style={{
									borderRadius: "20px",
									width: "50%",
									border: "1px lightgrey solid",
								}}
							/>
						</div>
						{allProducts &&
							allProducts[0] &&
							search(allProducts).map((e, i) => (
								<Link
									key={i}
									to={`/admin/update-product/${e._id}`}
									// onClick={() => setLinkClick(true)}
								>
									<div className='container text-capitalize'>
										<div className='row'>
											<li
												className='list-group-item d-flex justify-content-between align-items-center col-md-9'
												style={{ fontSize: "1.1rem" }}>
												<strong>{e.productName}</strong>
												<span className='col-md-6 mx-auto'>
													<img
														width='20%'
														height='20%'
														style={{ marginLeft: "100px" }}
														src={e.thumbnailImage[0].images[0].url}
														alt={e.productName}
													/>
												</span>
											</li>
											{!e.activeProduct && (
												<li
													className='list-group-item d-flex justify-content-between align-items-center col-md-3'
													style={{
														fontSize: "0.7rem",
														color: "red",
														fontWeight: "bold",
													}}>
													<strong>Inactive</strong>
												</li>
											)}
										</div>
									</div>
								</Link>
							))}
					</ul>
				</div>
			</div>
		</UpdateProductWrapper>
	);
};

export default UpdateProduct;

const UpdateProductWrapper = styled.div`
	min-height: 880px;
	overflow-x: hidden;
	/* background: #ededed; */
`;
