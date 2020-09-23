import React from 'react';
import CartItem from 'components/cart/CartItem';


const CartItemList = (props) => {
    console.log(props);

    const list = props.carts.map((cart,index) =>(
            <CartItem 
            id={index} 
            key={index} 
            {...cart} 
            handleCheckChild={props.handleCheckChild}
            />

    ));
    return (
        <div>
            {list}
        </div>
    )
}

export default React.memo(CartItemList);