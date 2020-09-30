import React from 'react';
import styles from './Order.module.scss';
import cn from 'classnames/bind';
import Noimage from '../svg/noimage.png';
import {DBImageFormat, numberFormat} from '../../lib/formatter';
const cx = cn.bind(styles);

const OrderItem = (props) => {

    const {
        center,
        item_name,
        item_option,
        item_price,
        item_img
    } = props;

    return (
        <div className={cx('order-item', { space: center })}>
            <div className={styles['menu-img']}>
                <img src={( item_img !== undefined && item_img !== "[]") ? DBImageFormat(item_img)[0] : Noimage} alt="menu" />
            </div>
            <div className={styles['menu-info']}>
                <div className={styles['name']}>{item_name}</div>
                <div className={styles['options']}>
                    <span className={styles['medium']}>추가선택: </span> 
                     {item_option ? item_option : '없음'}
                </div>
                <div className={styles['quanity']}>
                    수량: <span>1</span>
                </div>
                {!center && <div className={cx('price')}>{numberFormat(item_price)}원</div>}
            </div>
            {center && <div className={cx('center-price')}>{numberFormat(item_price)}원</div>}
        </div>
    );
};

OrderItem.defaultProps = {
    center: false,
};
export default OrderItem;
