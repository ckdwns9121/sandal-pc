import React from 'react';
import { Paths } from 'paths';
import styles from './Coupon.module.scss';
import Header from 'components/header/Header';
import Title from 'components/titlebar/Title';
import TabMenu from 'components/tab/TabMenu';
import CouponItemList from 'components/coupon/CouponItemList';
import UseCouponItemList from 'components/coupon/UseCouponItemList';
import SignAuthInput from 'components/sign/SignAuthInput';

const tabInit = [
    {
        url: `${Paths.ajoonamu.coupon}/mycoupon?`,
        name: '내쿠폰'
    },
    {
        url: `${Paths.ajoonamu.coupon}/download_cp`,
        name: '쿠폰받기'
    },
    {
        url: `${Paths.ajoonamu.coupon}/list_use`,
        name: '쿠폰사용내역'
    },
]


const CouponConatiner = ({ tab = 'mycoupon' }) => {
    return (
        <>
            <Header />
            <Title mainTitle={"쿠폰함>내쿠폰"} subTitle={"쿠폰함"} />
            <div className={styles['container']}>
            <TabMenu tabs={tabInit} />
                {tab === 'mycoupon' &&
                    <>
                    <div className={styles['title-input']}>
                        <div className={styles['title']}>
                             쿠폰코드 입력
                        </div>
                        <div className={styles['input']}>
                           <SignAuthInput buttonTitle={"쿠폰등록"}/>
                        </div>
                    </div>
                    <CouponItemList check= {false} />
                    </>
                }
                {tab === 'download_cp' &&
                    <CouponItemList check={true}/>}
                {tab === 'list_use' &&
                    <UseCouponItemList/>
                }
            </div>
        </>
    )
}

export default CouponConatiner;