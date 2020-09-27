import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './OrderList.module.scss';
import { Paths } from 'paths';
import { ButtonBase } from '@material-ui/core';
import Message from 'components/assets/Message';
import Loading from '../../components/assets/Loading';
import { getOrderList } from '../../api/order/orderItem';
import { useStore } from '../../hooks/useStore';
import PreviewOrderList from '../../components/order/PreviewOrderItemList';
import { dateToYYYYMMDD } from '../../lib/formatter';
import Pagination  from '../../components/pagenation/Pagenation';
//주문내역 페이지
const OrderListContainer = () => {
    const user_token = useStore();
    const history = useHistory();

    const [order_list, setOrderList] = useState([]); //전체 데이터.
    const [loading, setLoading] = useState(false); //로딩
    const [currentPage, setCurrentPage] = useState(1);   //현재 페이지
    const [postsPerPage] = useState(2);  //한페이지에서 보여줄 POST의 수

    const indexOfLastPost = currentPage * postsPerPage; // 현재 포스트에서 마지막 인덱스
    const indexOfFirstPost = indexOfLastPost - postsPerPage; //현재 포스트에서 첫번째 인덱스
    const currentPosts = order_list.slice(indexOfFirstPost, indexOfLastPost); //현재 포스트에서 보여줄 리스트
    
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber); 
        console.log(pageNumber);
    }//페이지를 이동시킬 함수.

    const callOrderListApi = async () => {
        setLoading(true);
        if (user_token) {
            const res = await getOrderList(user_token);
            console.log("나오냐?");
            console.log(res.orders);
            setOrderList(res.orders);

        }
        setLoading(false);
    };

    const onClickOrderItem = useCallback((order_id) => {
        history.push(`${Paths.ajoonamu.mypage}/order_detail?order_id=${order_id}`,);
    }, [history],);

    useEffect(() => {
        callOrderListApi();
    }, []);
    // useEffect(()=>{
    //     console.log("슬라이스");
    //     console.log(indexOfFirstPost);
    //     console.log(indexOfLastPost);
    //     console.log(order_list.slice(indexOfFirstPost, indexOfLastPost));
    //     setCurrentPosts(order_list.slice(indexOfFirstPost, indexOfLastPost));
    // },[order_list])

    // useEffect(()=>{
    //     console.log("현재 포스트");
    //     console.log(currentPosts);
    // },[currentPosts])

    return (
        <div className={styles['container']}>
            <div className={styles['content']}>
                <div className={styles['title']}>주문내역</div>
            </div>
            {loading ? (
                <Loading open={true} />
            ) : (
                <>
                    <div className={styles['select-date']}>
                        <div className={styles['date']}>
                            <ButtonBase className={styles['date-box']}>
                                1주일
                            </ButtonBase>
                            <ButtonBase className={styles['date-box']}>
                                1개월
                            </ButtonBase>
                            <ButtonBase className={styles['date-box']}>
                                3개월
                            </ButtonBase>
                            <ButtonBase className={styles['date-box']}>
                                6개월
                            </ButtonBase>
                        </div>
                        <div className={styles['date-input-box']}>
                            <div className={styles['text']}>기간 입력</div>
                            <div className={styles['input']}>
                                <input
                                    defaultValue={dateToYYYYMMDD(
                                        new Date(),
                                        '/',
                                    )}
                                />
                            </div>
                            <div className={styles['line']} />
                            <div className={styles['input']}>
                                <input
                                    defaultValue={dateToYYYYMMDD(
                                        new Date(),
                                        '/',
                                    )}
                                />
                            </div>
                            <ButtonBase
                                className={styles['btn']}
                                onClick={() => alert('조회 중입니다.')}
                            >
                                조회
                            </ButtonBase>
                        </div>
                    </div>
                    <div className={styles['order-list']}>
                        {currentPosts.legnth!== 0 ? (
                            <>
                            <PreviewOrderList
                                order_list={currentPosts}
                                onClick={onClickOrderItem}
                            />
                             <Pagination postsPerPage={postsPerPage} totalPosts={order_list.length} paginate={paginate} />
                         </>

                        ) : (
                            <Message
                                msg={'주문 내역이 존재하지 않습니다.'}
                                isButton={true}
                                buttonName={'주문하러 가기'}
                                onClick={() =>
                                    history.push(`${Paths.ajoonamu.shop}?tab=0`)
                                }
                            />
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
export default OrderListContainer;
