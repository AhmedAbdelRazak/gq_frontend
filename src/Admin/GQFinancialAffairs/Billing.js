/** @format */

import React from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";

const Billing = () => {
	return (
		<BillingWrapper>
			<Redirect to='/admin/account-tree' />
			<div>Hello From Billing</div>
		</BillingWrapper>
	);
};

export default Billing;

const BillingWrapper = styled.div``;
