import React from 'react';
import './OrderButton.scss';


const OrderButton = ({ title, onClick }) => {
    return (
        <div className="order-btn" onClick={onClick}>
            {title}
        </div>
    )
}

export default OrderButton; 