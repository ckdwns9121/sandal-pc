import React, { useCallback, useEffect, useState } from 'react';
import { Paths } from 'paths';
import { useHistory } from 'react-router-dom';
import styles from './HomeContainer.module.scss';
import HomeSlick from './HomeSlick';
import MenuListView from '../../../components/item/MenuListView';
import {
    bannerImg,
    backImg,
    orderServiceImg,
    templateImg,
} from '../../../components/svg/home';
import cn from 'classnames/bind';
import { ButtonBase } from '@material-ui/core';

import KakaoMap from '../../../components/map/KakaoMap';
import {
    // getMainMenuList,
    getMenuList
} from '../../../api/menu/menu';
import Loading from 'components/assets/Loading';
import { getCategory } from '../../../api/category/category';
import { get_catergory, get_menulist } from '../../../store/product/product';
import { useDispatch, useSelector } from 'react-redux';

const cx = cn.bind(styles);

const HomeContainer = () => {
    const history = useHistory();
    const [useCate, setUseCate] = useState(0);
    const dispatch = useDispatch();
    const { categorys, items } = useSelector((state) => state.product);

    const [loading, setLoading] = useState(false);

    // const getMainMenu = useCallback(async () => {
    //     setLoading(true);
    //     try {
    //         const res = await getMainMenuList();
    //         setMenuList(res);
    //     } catch (e) {
    //         alert('error!');
    //     }
    //     setLoading(false);
    // }, []);


    const getProductList = useCallback(async () => {
        setLoading(true);
        if (categorys.length === 1) {
            const res = await getCategory();
            res.sort((a, b) => a.ca_id - b.ca_id);
            // 카테고리를 분류 순서로 정렬.
            const ca_list = res.filter((item) => item.ca_id !== 12);

            dispatch(get_catergory(ca_list));
            let arr = [];
            for (let i = 0; i < ca_list.length; i++) {
                const result = await getMenuList(ca_list[i].ca_id);
                const temp = { ca_id: ca_list[i].ca_id, items: result };
                arr.push(temp);
            }
            arr.sort((a, b) => a.ca_id - b.ca_id);
            dispatch(get_menulist(arr));
        }
        if (categorys[1]) {
            setUseCate(categorys[1].ca_id);
        }
        setLoading(false);
    }, [categorys, dispatch]);

    const onClickDetailItem = useCallback((item_id)=>{
        history.push(`${Paths.ajoonamu.product}?item_id=${item_id}`);
    },[history]);

    useEffect(() => {
        // getMainMenu();
        getProductList();
    }, [getProductList]);

    return (
        <>
            <div className={styles['carousel']}>
                <HomeSlick />
            </div>
            <div className={styles['container']}>
                <Banner title={'메뉴 추천 받아보기'} subtitle={'샌달에서 간편하게 추천해드려요'} />
                <div className={styles['menu-list']}>
                    <ul className={styles['category']}>
                        {categorys.slice(1, 6).map(category => (
                            <li key={category.ca_id} onClick={() => setUseCate(category.ca_id)}
                                className={cx('item', { active: useCate === category.ca_id})}>
                                <ButtonBase style={{ fontSize: 'inherit', fontWeight: 'inherit', width: '100%', height: '100%', display: 'block', padding: '8px 25px' }}>
                                    {category.ca_name}
                                </ButtonBase>
                            </li>
                        ))}
                    </ul>
                    <Loading open={loading}/>
                    { items !== null && <MenuListView menuList={items[useCate].items} onClick={onClickDetailItem}/>}
                </div>
                <div className={styles['banner-img']} onClick ={()=>{   history.push(`${Paths.ajoonamu.shop}?tab=${0}`) ; window.scrollTo(0,0)}}>
                    <img src={bannerImg} alt="배너" />
                </div>
                <div className={styles['order']}>
                    <div
                        className={styles['box']}
                        style={{ backgroundImage: 'url(' + backImg + ')' }}
                    />
                    <div className={cx('box')}>
                        <div className={styles['service']}>
                            <div className={styles['pd-box']} data-aos='fade-up'>
                                <div className={styles['title']}>
                                    기업조식 정기배송 서비스
                                </div>
                                <div className={styles['sub-title']}>
                                    샌달과 하루를 효율적으로 시작해보세요
                                </div>
                                <ButtonBase
                                    onClick={()=>{ history.push(`${Paths.ajoonamu.breakfast}`); window.scrollTo(0,0)}}
                                    className={styles['order-btn']}
                                >
                                    자세히보기
                                </ButtonBase>
                            </div>
                        </div>
                    </div>
                </div>
                <Banner title={'샌달의 서비스'} subtitle={'샌달은 고객님께 신선함까지 함께 배달해드려요'} />
                <div className={styles['service-box']}>
                    <div className={styles['service-type']}>
                        <div className={styles['box']} data-aos='fade-up'>
                            <img
                                className={styles['box-img']}
                                alt="template"
                                src={templateImg}
                            />
                            <div className={styles['box-text']}>
                                <div className={styles['title']}>
                                    익일 배달서비스 가능
                                </div>
                                <div className={styles['sub-title']}>
                                    익일 배달서비스를 활용해보세요.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles['service-type']}>
                        <div className={styles['box']} data-aos='fade-up'>
                            <img
                                className={styles['box-img']}
                                src={orderServiceImg}
                                alt="order"
                            />
                            <div className={styles['box-text']}>
                                <div className={styles['title']}>
                                    도시락 무료 문구서비스 제공
                                </div>
                                <div className={styles['sub-title']}>
                                    원하는 템플릿을 골라 정성과 마음을 전하세요.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <KakaoMap />
            </div>
        </>
    );
};

function Banner({ title, subtitle, text }) {
    return (
        <div className={styles['banner']}>
            <div className={styles['title']}>{title}</div>
            <div className={styles['sub-title']}>{subtitle}</div>
            <div className={styles['text']}>{text}</div>
        </div>
    );
}

export default HomeContainer;
