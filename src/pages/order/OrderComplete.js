import React from 'react';
import OrderCompleteContainer from '../../containers/order/OrderCompleteContainer';
import qs from 'qs';
import { Paths } from '../../paths';

const OrderComplete = ({location}) => {
    const query = qs.parse(location.search, {
        ignoreQueryPrefix: true,
    });
    const { order_number, message } = query;
    if (message.indexOf('결제를 종료하였습니다.') !== -1) {
        window.location = Paths.ajoonamu.order;
    }
    return (
        <OrderCompleteContainer order_number={order_number}/>
    )
}

export default OrderComplete;