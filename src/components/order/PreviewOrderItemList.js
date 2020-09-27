import React from 'react';
import PreviewOrderItem from './PreviewOrderItem';
import styles from './Preview.module.scss';



const PreviewOrderList = ({order_list ,onClick}) =>{

    console.log(order_list);
    const list = order_list.map((item) =>{
        return <PreviewOrderItem key ={item.order_id} {...item}  onClick={()=> onClick(item.order_id)}/>
    })
    return(
        <div className={styles['order-list']}>
            {list}
        </div>
    )

}

export default PreviewOrderList