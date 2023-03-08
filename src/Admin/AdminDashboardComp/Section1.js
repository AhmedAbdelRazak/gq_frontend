/** @format */

import React from "react";
import styled from "styled-components";
import OrdersCountCards from "../CardsBreakDown/OrdersCountCards";
import OrdersQtyCard from "../CardsBreakDown/OrdersQtyCard";
import OrdersTotalAmountCards from "../CardsBreakDown/OrdersTotalAmountCards";

const Section1 = ({ chosenCard, allOrders, setChosenCard }) => {
	return (
		<Section1Wrapper>
			<div>
				{chosenCard === "OrdersCountCard" ? (
					<div>
						<OrdersCountCards allOrders={allOrders} />
					</div>
				) : null}
				{chosenCard === "OrdersQtyCard" ? (
					<div>
						<OrdersQtyCard allOrders={allOrders} />
					</div>
				) : null}
				{chosenCard === "OrdersTotalAmountCard" ? (
					<div>
						<OrdersTotalAmountCards allOrders={allOrders} />
					</div>
				) : null}

				<div className='mb-1 ml-5'>
					<span
						className='mx-1 ordersCount'
						onClick={() => {
							setChosenCard("OrdersCountCard");
						}}>
						Orders Count
					</span>
					<span
						className='mx-1 ordersQty'
						onClick={() => {
							setChosenCard("OrdersQtyCard");
						}}>
						Orders Quantity
					</span>
					<span
						className='mx-1 ordersAmount'
						onClick={() => {
							setChosenCard("OrdersTotalAmountCard");
						}}>
						Orders Total Amount
					</span>
				</div>
			</div>
		</Section1Wrapper>
	);
};

export default Section1;

const Section1Wrapper = styled.div``;
