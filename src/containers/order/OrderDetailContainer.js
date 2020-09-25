import React,{useState,useEffect,useCallback} from 'react';
import {useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';
import OrderItemList from '../../components/order/OrderItemList';
import styles from './OrderDetail.module.scss';
import cn from 'classnames/bind';
import Loading from '../../components/assets/Loading';
import { useStore } from '../../hooks/useStore';
import { getDetailOrderView } from '../../api/order/orderItem';
import { numberFormat,stringToTel } from '../../lib/formatter';

import qs from 'qs';

const cx = cn.bind(styles);

const OrderDetailContainer = (props) => {

    const query = qs.parse(props.location.search, {
        ignoreQueryPrefix: true,
    });
    const {order_id} =query;

    const user_token = useStore();
    const history = useHistory();
    const { user } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState(null);
    const [payinfo, setPayInfo] = useState(null);
    const [payple_info , setPaypleInfo] = useState(null);


    const getOrderInfo = useCallback(async () => {
        if (user_token) {
            setLoading(true);
            const res = await getDetailOrderView(user_token, order_id);
            console.log(res);
            setOrders(res.orders);
            setPayInfo(res.payinfo);
            const temp = JSON.parse(res.payinfo.pp_result);
            setPaypleInfo(temp);
            console.log(temp);
            
            setLoading(false);
        } else {
            history.replace('/');
        }
    }, [order_id, history,user_token]);


    useEffect(() => {
        if (!order_id) {
            history.replace('/');
        } else {
            getOrderInfo();
        }
    }, [order_id, getOrderInfo, history]);

    console.log(query);
    return (
        <>
        {loading ? <Loading open ={true}/> :
        
        <div className={styles['container']}>
        <div className={styles['content']}>
            <div className={styles['detail-box']}>
                <div className={styles['title']}>주문 상세 보기</div>
                <div className={styles['preview-title-bar']}>
                    <div className={styles['order-info']}>
                        <div className={styles['top']}>
                            <div className={styles['order-date']}>
                            {orders && orders.receipt_time}
                            </div>
                            <div className={styles['order-id']}>
                                주문번호 : {orders && orders.order_id}
                            </div>
                            <div className={styles['order-type']}>
                                배달완료
                            </div>
                        </div>
                        <div className={styles['bottom']}>
                            <div className={styles['req-date']}>
                                배달 요청 시간 : 2020-06-02 09:30:00
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles['detail-box']}>
                <div className={styles['title']}>주문 상세 내역</div>
                <div className={styles['order-detail-view']}>
                    <div className={styles['order-item-list']}>
                        {orders && 
                            <OrderItemList items ={orders.items} center={true}/>
                        }
                    </div>
                </div>
            </div>
            <div className={styles['detail-box']}>
                <div className={styles['title']}>배달정보</div>
                <div className={styles['order-detail-view']}>
                    <div className={styles['context']}>
                        <UserInfoBox text={'받는분'} value={user && user.name} />
                        <UserInfoBox
                            text={'연락처'}
                            value={user && user.hp && stringToTel(user.hp) }
                        />
                        <UserInfoBox
                            text={'배달 요청 시간'}
                            value={'2020년 05월 17일 오전 9시 30분'}
                        />
                        <UserInfoBox
                            text={'배달 주소'}
                            value={orders && orders.s_addr1}
                        />
                        <UserInfoBox
                            text={'요청 사항'}
                            value={'빨리 배달 해주세요~~'}
                        />
                    </div>
                </div>
            </div>
            <div className={styles['detail-box']}>
                <div className={styles['title']}>주문정보</div>
                <div className={styles['order-detail-view']}>
                    <div className={styles['context']}>
                        <UserInfoBox text={'주문자'} value={user && user.name} />
                        <UserInfoBox
                            text={'연락처'}
                            value={user && user.hp && stringToTel(user.hp)}
                        />
                        <UserInfoBox
                            text={'이메일'}
                            value={user && user.email}
                        />
                        <UserInfoBox
                            text={'주문 종류'}
                            value={'배달주문'}
                        />
                        <UserInfoBox
                            text={'요청 사항'}
                            value={'빨리 배달 해주세요~~'}
                        />
                    </div>
                </div>
            </div>

            <div className={styles['detail-box']}>
                <div className={styles['store-info']}>
                    <div className={styles['title']}>매장정보</div>
                    <div className={styles['order-detail-view']}>
                        <div className={styles['context']}>
                            <UserInfoBox text={'매장명'} value={orders && orders.shop_name} />
                            <UserInfoBox
                                text={'매장주소'}
                                value={orders && orders.shop_addr1}
                            />
                            <UserInfoBox
                                text={'연락처'}
                                value={orders && orders.shop_hp && stringToTel(orders.shop_hp)}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles['order-info']}>
                    <div className={styles['title']}>결제금액</div>
                    <div className={styles['order-detail-view']}>
                        <div className={styles['order-box']}>
                        <OrderInfoBox text={'주문금액'} value={orders && numberFormat(orders.total_price)} />
                        <OrderInfoBox text={'배달비용'} value={orders && `${numberFormat(orders.send_cost)}`} />
                        <OrderInfoBox text={'쿠폰할인'} value={orders && `-${numberFormat(orders.cp_price)}`} />
                        <OrderInfoBox
                            text={'포인트사용'}
                            value={orders &&`-${numberFormat(orders.point_price)}`}
                        />
                        </div>
                 
                        <div className={styles['total']}>
                            <div className={styles['box']}>
                            <div className={styles['text']}>합계</div>
                            <div className={styles['value']}>
                            {orders && numberFormat(orders.receipt_price)} <span>원</span>
                            </div>
                            </div>
                            <div className={cx('box','card')}>
                            <div className={styles['text']}></div>
                            <div className={styles['value']}>
                            {payple_info &&  payple_info.PCD_PAY_CARDNAME}

                            </div>
                            </div>
                            <div className={cx('box','card-type')}>
                            <div className={styles['text']}></div>
                            <div className={styles['value']}>
                            {payple_info &&  payple_info.PCD_PAY_CARDNUM} 일시불
                            </div>
                            </div>
                
                
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
        
        }

        </>
    );
};

function UserInfoBox({ text, value }) {
    return (
        <div className={styles['box']}>
            <div className={styles['text']}>{text}</div>
            <div className={styles['value']}>{value}</div>
        </div>
    );
}

function OrderInfoBox({ text, value }) {
    return (
        <div className={styles['order-item']}>
            <div className={styles['text']}>{text}</div>
            <div className={styles['value']}>
                {value}
                <span>원</span>
            </div>
        </div>
    );
}

export default OrderDetailContainer;
