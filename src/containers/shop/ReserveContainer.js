import React, { useEffect, useState, useCallback,useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Paths } from 'paths';
import styles from './Reserve.module.scss';
import TabMenu from '../../components/tab/TabMenu';
import MenuItemList from '../../components/item/MenuItemList';
import Message from 'components/assets/Message';
import CustomItemList from '../../components/item/CustomItemList';
import PreferModal from '../../components/modal/PreferModal';
import { useHistory } from 'react-router';
import ShopBanner from '../../components/svg/shop/shop_banner.png';
import Loading from '../../components/assets/Loading';

import {
    getPreferMenuList,
    getCustomMenuList,
    getMenuList,
} from '../../api/menu/menu';
import { getCategory } from '../../api/category/category';
import { get_catergory, get_menulist,add_menuitem } from '../../store/product/product';
import { stringNumberToInt } from '../../lib/formatter';
import {useScroll} from '../../hooks/useScroll';

const OFFSET = 8;
const LIMIT = 8;

const ReserveContainer = ({ tab = '0' }) => {
    const { categorys, items } = useSelector((state) => state.product);
    const dispatch = useDispatch();

    const history = useHistory();
    const [open, setOpen] = useState(false);
    const [budget, setBudget] = useState(0); // 맞춤 가격
    const [endBudget, setEndBudget] = useState(0); // 맞춤 가격 끝
    const [desireQuan, setDesireQuan] = useState(0); //희망수량
    const [orderType, setOrderType] = useState('reserve'); //사용자 선택 값 1.예약주문 2.배달주문
    const [tabIndex, setTab] = useState(parseInt(tab));
    const [loading, setLoading] = useState(false);
    const [preferMenuList, setPreferMenuList] = useState([]); //추천메뉴 리스트

    const { isScrollEnd } = useScroll( loading);

    const [posts, setPosts] = useState([]); //보여줄 배열
    const [isPaging, setIsPaging] = useState(false); //페이징중인지
    const [offset, setOffset] = useState(8);
    const handleOpen = () => setOpen(true); //test
    const handleClose = () => setOpen(false);

    const onChangeIndex = (e, index) => {
        setTab(index);
    };
    //주문 종류 선택
    const onChangeOrderType = (e) => {
        setOrderType(e.target.value);
    };

    //추천메뉴 설정
    const onClickCustomOrder = () => {
        setOpen(false);
        getCustomList();
    };

    // 사용자 추천 메뉴들고오기
    const getCustomList = async () => {
        setLoading(true);
        try {
            // const res = await getCustomMenuList(); 임시데이터
            const res = await getPreferMenuList();
            console.log('추천메뉴');
            console.log(res);
            // console.log(res);
            setPreferMenuList(res.items_prefer);
        } catch {
            alert('오류!');
        }
        setLoading(false);
    };

    //전체 예산 입력
    const onChangeBudget = useCallback((e) => {
        const value = stringNumberToInt(e.target.value);
        setBudget(value);
    }, []);

    const onChangeEndBudget = useCallback((e) => {
        const value = stringNumberToInt(e.target.value);
        setEndBudget(value);
    }, []);

    const onClickMenuItem = useCallback(
        (item_id) => {
            history.push(`${Paths.ajoonamu.product}?item_id=${item_id}`);
            sessionStorage.setItem('offset', offset);
        },
        [history, offset],
    );

    //첫 로딩시 메뉴 받아오기
    const getProductList = useCallback(async () => {
        setLoading(true);

        //카테고리 길이가 1이면 받아오기.
        if (categorys.length === 1) {
            const res = await getCategory();
            res.sort((a, b) => a.ca_id - b.ca_id);
            // 카테고리를 분류 순서로 정렬.
            let ca_list = res.filter((item) => item.ca_id !== 12); //이거 나중에 뺴야함.
            dispatch(get_catergory(ca_list));
            let arr = [];
            //카테고리별로 메뉴 리스트 받아오기.
            for (let i = 0; i < ca_list.length; i++) {
                    const result = await getMenuList(ca_list[i].ca_id, 0, LIMIT);
                    const temp = { ca_id: ca_list[i].ca_id, items: result };
                    arr.push(temp);
            }
            arr.sort((a, b) => a.ca_id - b.ca_id);
            dispatch(get_menulist(arr));
        }
        setLoading(false);
    }, [categorys, dispatch, offset]);

    const getMenuListApi = useCallback(async () => {
        if(!loading){
        try {

            //현재 탭이 추천메뉴 탭이 아니고, 카테고리를 받아오고난뒤, 아이템이 있으면 실행
            if (tabIndex !== 0 && categorys.length !== 1 && items) {
                setIsPaging(true);
                const res = await getMenuList(
                    categorys[tabIndex].ca_id,
                    offset,
                    LIMIT,
                );

                if (res.length !== 0) {
                    setOffset(offset + LIMIT);
                    dispatch(
                        add_menuitem({
                            ca_id: categorys[tabIndex].ca_id,
                            items: res,
                        }),
                    );
                }
                setTimeout(() => {
                    setIsPaging(false);
                }, 1000);
            }
        } catch (e) {
            console.error(e);
        }
    }
    }, [tabIndex, categorys, offset, items, posts,loading]);

    //첫 로딩시 아이템 셋팅
    useEffect(() => {
        getProductList();
        window.scrollTo(0,0);
    }, []);


    //탭 바뀌었을때 오프셋 갱신
    useEffect(()=>{
        setOffset(OFFSET);
    },[tabIndex])
  
    useEffect(()=>{
        setLoading(true);
        setTimeout(()=>{
            const url = JSON.parse(sessionStorage.getItem('url'));
            if(url){
            //이전 페이지가 상품페이지라면 오프셋 유지.
            if(url.prev ==='/product'){
              const OS = sessionStorage.getItem('offset');
              if(OS){
                setOffset(parseInt(OS));
              }
            }
        }
            setLoading(false);
        },100)
    },[])

    //로딩 완료 되었을 때 스크롤 위치로 이동.
    useEffect(() => {
        const scrollTop = sessionStorage.getItem('scrollTop');
        const url = JSON.parse(sessionStorage.getItem('url'));
        if(url){
        //이전 주소가 상품페이지라면 스크롤 유지
        if(url.prev ==='/product'){
              console.log('스크롤 이동');
            window.scrollTo(0,scrollTop);
        }
    }
    }, [loading]);

    // 탭 인덱스로 URL 이동
    useEffect(() => {
        history.replace(`${Paths.ajoonamu.shop}?tab=${tabIndex}`);
    }, [history, tabIndex]);

    //아이템과 인덱스가 변했을 시 보여줄 리스트 갱신.
    useEffect(() => {
        items && tabIndex !== 0 && setPosts(items[tabIndex - 1].items);
    }, [items, tabIndex]);

    //스크롤 끝과 페이징중인지 확인후 페이지네이션 실행.
    useEffect(() => {
        if (isScrollEnd && !isPaging) {
            console.log(isScrollEnd);
            getMenuListApi();
        }
    }, [isScrollEnd, isPaging]);

    useEffect(() => {
        if (budget > endBudget) {
            setEndBudget(budget);
        }
    }, [budget, endBudget]);

    const renderPost =useCallback(()=>{
        // console.log(offset +'으로 렌더');
        return(
            <>
            {posts && (
                <MenuItemList
                    menuList={posts.slice(0, offset)}
                    onClick={onClickMenuItem}
                />
            )}
            </>
        )
    },[posts,offset,onClickMenuItem])

    return (
        <>
            {loading && <Loading open={loading} />}
            <div className={styles['banner']}>
                <img
                    className={styles['shop-banner']}
                    src={ShopBanner}
                    alt="banner"
                />
            </div>
            <div className={styles['container']}>
                <div className={styles['content']}>
                    <div className={styles['title']}>예약주문 메뉴리스트</div>
                    {categorys.length !== 1 && (
                        <TabMenu
                            tabs={categorys}
                            index={tabIndex}
                            onChange={onChangeIndex}
                        />
                    )}

                    <div className={styles['shop']}>
                        {tabIndex === 0 ? (
                            <>
                                {preferMenuList.length !== 0 ? (
                                    <MenuItemList menuList={preferMenuList} />
                                ) : (
                                    <Message
                                        msg="전체 예산과 희망 수량을 선택하시면 메뉴 구성을 추천 받으실 수 있습니다."
                                        isButton={true}
                                        buttonName={'맞춤주문 설정하기'}
                                        onClick={handleOpen}
                                        src={false}
                                    />
                                )}
                            </>
                        ) : (
                            <>
                               {renderPost()}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <PreferModal
                open={open}
                handleClose={handleClose}
                itemType={orderType}
                onChangeType={onChangeOrderType}
                budget={budget}
                endBudget={endBudget}
                onChangeBudget={onChangeBudget}
                onChangeEndBudget={onChangeEndBudget}
                desireQuan={desireQuan}
                onClickCustomOrder={onClickCustomOrder}
            />
        </>
    );
};

export default ReserveContainer;
