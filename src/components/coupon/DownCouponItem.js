import React from 'react';
import styles from './DownCoupon.module.scss';
import DownCoupon from 'components/svg/coupon/down.svg';
import { numberFormat } from '../../lib/formatter';

const DownCouponItem = (props) => {
    const {
        cp_datetime,
        // cp_end,
        cp_id,
        // cp_minimum,
        cp_price,
        // cp_start,
        cp_subject,
        // cp_target,
        // cp_use,
        // cp_use_date,
        // cz_id,
        // user_id,
    } = props.item;
    return (
        <div className={styles['coupon-item']}>
            <div className={styles['down']}>
                <CouponDown check={true} />
            </div>
            <div className={styles['info']}>
                <div className={styles['pd-box']}>
                    <CouponEventName event_name={cp_id} />
                    <CouponSale sale={cp_price} />
                    <CouponEventSub sub_name={cp_subject} />
                    <CouponDate date={cp_datetime} />
                </div>
            </div>
        </div>
    );
};
function CouponEventName({ event_name }) {
    return (<div className={styles['event-name']}>{event_name}</div>);
}
function CouponSale({ sale }) {
    return (<div className={styles['sale']}>{numberFormat(sale)}원 할인</div>);
}
function CouponEventSub({ sub_name }) {
    return (<div className={styles['sub-name']}>{sub_name}</div>);
}
function CouponDate({ date }) {
    return (<div className={styles['date']}>{date}</div>);
}
function CouponDown({ check }) {
    return (<>{check && <img src={DownCoupon} alt="다운" />}</>);
}

export default DownCouponItem;
