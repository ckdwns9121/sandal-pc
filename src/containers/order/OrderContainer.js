/*global kakao*/

import React, {
    useState,
    useEffect,
    useReducer,
    useCallback,
    useRef,
} from 'react';
import { Paths } from 'paths';
import { useSelector } from 'react-redux';
import styles from './Order.module.scss';
import classNames from 'classnames/bind';
import SquareCheckBox from '../../components/checkbox/SquareCheckBox';
import Button from '../../components/button/Button';
import CheckBox from '../../components/checkbox/CheckBox';
import { ButtonBase } from '@material-ui/core';
import { getCartList } from '../../api/cart/cart';
import { numberFormat, stringNumberToInt } from '../../lib/formatter';
import { getOrderCoupons } from '../../api/coupon/coupon';
import { useStore } from '../../hooks/useStore';
import $script from 'scriptjs';
import ko from 'date-fns/locale/ko';
import DatePicker from 'react-datepicker';
import { user_order } from '../../api/order/order';
import ScrollTop from '../../components/scrollTop/ScrollToTop';
import { onlyNumberListener } from '../../lib/formatChecker';
import { useModal } from '../../hooks/useModal';
import Select from '../../components/svg/select/Select';
import {noAuthGetCartList} from  '../../api/noAuth/cart';
import Loading from '../../components/assets/Loading';
import AuthTimer from '../../components/assets/AuthTimer';
import {noAuth_order} from '../../api/noAuth/order';
const cx = classNames.bind(styles);

const initCheck = {
    allCheck: false,
    check1: false,
    check2: false,
};

const checkReducer = (state, action) => {
    switch (action.type) {
        case 'ALL_CHECK':
            return {
                ...state,
                allCheck: action.check,
            };
        case 'CHECK1':
            return {
                ...state,
                check1: action.check,
            };
        case 'CHECK2':
            return {
                ...state,
                check2: action.check,
            };
        default:
            return state;
    }
};

const OrderContainer = () => {
    const user_token = useStore(false);
    const openModal = useModal();
    const { user } = useSelector(state => state.auth);
    const { addr1,addr2,lat,lng } = useSelector(state => state.address);
    const [check, dispatchCheck] = useReducer(checkReducer, initCheck);
    const [addContact, setAddContact] = useState(false);
    const { check1, check2 } = check;
    const [toggle, setToggle] = useState(false); // 결제 동의
    const [payable, setPayable] = useState(false);
    const [payment, setPayment] = useState('페이플 카드 결제'); //결제 방법
    const [cp_list, setCouponList] = useState([]); //사용가능한 쿠폰
    const [totalPrice, setTotalPrice] = useState(0); //총 결제금액
    const [dlvCost, setDlvCost] = useState(0); // 배달비
    const [dlvMemo, setDlvMemo] = useState(''); //배달메모
    const [dlvMemoCheck, setDlvMemoCheck] = useState(false);
    const [orderMemoCheck, setOrderMemoCheck] = useState(false);
    const [orderMemo, setOrderMemo] = useState(''); //주문메모
    const [PCD_PAYER_ID, SET_PCD_PAYER_ID] = useState(null); //결제방식
    const [usePoint, setUsePoint] = useState(0); //포인트 할인
    const order_id = useRef(null);
    const [cp_price, setCpPrice] = useState(0); //쿠폰할인
    const [date, setDate] = useState(new Date());
    const [hours ,setHours]  = useState('09');
    const [minite ,setMinite] = useState('00');

    const [loading, setLoading] = useState(false);
    const [noAuthName, setNoAuthName] = useState('');
    const [firstPhoneNumber, setFirstPhoneNumber] = useState('');
    const [secondPhoneNumber, setSecondPhoneNumber] = useState('');
    const [firstPhoneAuth, setFirstPhoneAuth] = useState('');
    const [secondPhoneAuth, setSecondPhoneAuth] = useState('');

    const paymentInfo = useRef(null);
    const paymentBox = useRef(null);

    const onChangeDlvCheck = (e) => setDlvMemoCheck(e.target.checked);
    const onChangeOrderCheck = (e) => setOrderMemoCheck(e.target.checked);
    const onChangeDeleveryMemo = (e) => setDlvMemo(e.target.value);
    const onChangeOrderMemo = (e) => setOrderMemo(e.target.value);


    const updateAllCheck = (e) => {
        dispatchCheck({ type: 'ALL_CHECK', check: e.target.checked });
        dispatchCheck({ type: 'CHECK1', check: e.target.checked });
        dispatchCheck({ type: 'CHECK2', check: e.target.checked });
    };
    const onChangeCheck1 = (e) => {
        dispatchCheck({ type: 'CHECK1', check: e.target.checked });
    };
    const onChangeCheck2 = (e) => {
        dispatchCheck({ type: 'CHECK2', check: e.target.checked });
    };

    //모두 체크인지 확인 함수
    const isAllCheck = useCallback(() => {
        if (check1 && check2) {
            dispatchCheck({ type: 'ALL_CHECK', check: true });
            setToggle(true);
        } else if (!check1 || !check2) {
            dispatchCheck({ type: 'ALL_CHECK', check: false });
            setToggle(false);
        }
    }, [check1, check2]);

    // 결제방식 변경
    const onClickPayment = (payment) => {
        setPayment(payment);
        localStorage.setItem('user_payment', payment);
    };

    //결제 방법 스토리지에 있다면 들고오기
    const getPayment = () => {
        const payment_item = localStorage.getItem('user_payment');
        if (payment_item) {
            setPayment(payment_item);
        }
    };

    //총 주문금액 구하기 (장바구니 조회해서 가져옴);
    const getTotalPrice = useCallback(async () => {
        setLoading(true);
        if (user_token) {
            try {
                const res = await getCartList(user_token);
                if (res.data.msg === 'success') {
                    let price = 0;
                    const { query } = res.data;
                    let len = Object.keys(query).length;
                    for (let i = 0; i < len - 2; i++) {
                        const { item, options } = query[i];
                        
                        price +=
                            parseInt(item.item_price) *
                            parseInt(item.item_quanity);

                        for (let j = 0; j < options.length; j++) {
                            const { option_price } = options[j];
                            price +=
                                parseInt(option_price) *
                                parseInt(item.item_quanity);
                        }
                    }

                    if (query.PCD_PAYER_ID === null) {
                        
                        SET_PCD_PAYER_ID(query.PCD_PAYER_ID);
                    } else {
                        SET_PCD_PAYER_ID(query.PCD_PAYER_ID.pp_tno);
                    }
                    setTotalPrice(price);
                    setDlvCost(query.delivery_cost);
                }
            } catch (e) {
                
            }
        }
        else {
            try {
                if(addr1){
                const cart_id = JSON.parse(
                    localStorage.getItem('noAuthCartId'),
                );
                const res = await noAuthGetCartList(cart_id, lat, lng, addr1);                
                const { query } = res.data;
                let len = Object.keys(query).length;
                let price = 0;

                for (let i = 0; i < len - 1; i++) {
                    const { item, options } = query[i];
                    price +=
                        parseInt(item.item_price) * parseInt(item.item_quanity);

                    for (let j = 0; j < options.length; j++) {
                        const { option_price } = options[j];
                        price +=
                            parseInt(option_price) *
                            parseInt(item.item_quanity);
                    }
                }
                setDlvCost(query.delivery_cost);
                setTotalPrice(price);
            }
            } catch (e) {
                
            }

        }
        setLoading(false);
    },[user_token,addr1]);

    // 유저의 쿠폰 가져오기
    const getUserCoupons = async () => {
        if (user_token) {
            const res = await getOrderCoupons(user_token);
            setCouponList(res);
        }
    };

    //쿠폰이 있을시 옵션 렌더
    const renderCpList = () => {
        const list = cp_list.map((item) => (
            <option key={item.cp_id} value={item.cp_id}>
                {item.cp_subject}
            </option>
        ));
        return <>{list}</>;
    };

    const onChangeCpPrice = (e) => {
        const cp_id = e.target.value;
        if (cp_id !== 'default') {
            const index = cp_list.findIndex((item) => item.cp_id === cp_id);
            setCpPrice(cp_list[index].cp_price);
        }
        else if(cp_id ==='default'){
            setCpPrice(0);
        }
    };

    const onClickOrder = async () => {
        const payple_url = 'https://testcpay.payple.kr/js/cpay.payple.1.0.1.js';

        const year = date.getFullYear();
        const month = date.getMonth()+1 > 9 ? date.getMonth()+1 : `0${date.getMonth()+1}`;
        const day = date.getDate() > 10 ? date.getDate() : `0${date.getDate()}`;

        const delivery_req_time = `${year}-${month}-${day} ${hours}:${minite}:00`
        //회원 주문
        setLoading(true);
        if (user_token) {
            const res = await user_order(
                user_token,
                'reserve',
                orderMemo,
                dlvMemo,
                delivery_req_time,
            );
            order_id.current = res.data.query;

            //장바구니 삭제
        }
        //비회원 주문
        else {
            const cart_ids = JSON.parse(localStorage.getItem('noAuthCartId'));
            const res = await noAuth_order(
                cart_ids,
                noAuthName,
                firstPhoneNumber,
                16546,
                addr1,
                addr2,
                lat,
                lng,
                'reserve',
                orderMemo,
                dlvMemo,
                delivery_req_time,
            );
            order_id.current = res.data.query;
            //장바구니 삭제
        }
        $script(payple_url, () => {
            
            /*global PaypleCpayAuthCheck*/
            const getResult = function (res) {
                alert('callback : ' + res.PCD_PAY_MSG);
            };

            let pay_type = 'card'; //결제 수단
            let pay_work = 'CERT'; //결제 타입 1. AUTH 계좌등록 2.CERT 가맹점 최종승인후 계좌등록 + 결제진행 3.PAY 가맹점 승인 없이 계좌등록 + 결제진행
            let payple_payer_id = '';

            let buyer_no = ''; //고객 고유번호
            let buyer_name = user ? user.name : noAuthName ; //고객 이름
            let buyer_hp = `${firstPhoneNumber}`;//고객 번호
            let buyer_email = user && user.email; //고객 이메일
            let buy_goods = '테스트'; //구매하는 물건 이름
            let buy_total = Number(parseInt(totalPrice) + parseInt(dlvCost) - parseInt(cp_price) - parseInt(usePoint) ); //가격
            let buy_taxtotal = 0;
            let buy_istax = ''; //과세설정 DEFAULT :Y  비과세 N
            let order_num = order_id.current; //주문 번호
            let is_reguler = 'N';
            let is_taxsave = 'N';
            let simple_flag = 'N';
            let card_ver = '01';

            if (PCD_PAYER_ID !== null) {
                payple_payer_id = PCD_PAYER_ID;
                simple_flag = 'Y';
            }

            let obj = new Object();

            //#########################################################################################################################################################################
            /*
             * DEFAULT SET 1
             */
            obj.PCD_CPAY_VER = '1.0.1'; // (필수) 결제창 버전 (Default : 1.0.0)
            obj.PCD_PAY_TYPE = pay_type; // (필수) 결제 방법 (transfer | card)
            obj.PCD_PAY_WORK = pay_work; // (필수) 결제요청 업무구분 (AUTH : 본인인증+계좌등록, CERT: 본인인증+계좌등록+결제요청등록(최종 결제승인요청 필요), PAY: 본인인증+계좌등록+결제완료)

            // 카드결제 시 필수
            obj.PCD_CARD_VER = card_ver; // DEFAULT: 01 (01: 정기결제 플렛폼, 02: 일반결제 플렛폼)

            //## 2.2 간편결제 (재결제)
            obj.PCD_PAYER_NO = buyer_no; // (선택) 가맹점 회원 고유번호 (결과전송 시 입력값 그대로 RETURN)
            obj.PCD_PAY_GOODS = buy_goods; // (필수) 결제 상품
            obj.PCD_PAY_TOTAL = buy_total; // (필수) 결제 금액
            obj.PCD_PAY_TAXTOTAL = buy_taxtotal; // (선택) 부가세(복합과세인 경우 필수)
            obj.PCD_PAY_ISTAX = buy_istax; // (선택) 과세여부 (과세: Y | 비과세(면세): N)
            obj.PCD_PAY_OID = order_num; // 주문번호 (미입력 시 임의 생성)
            obj.PCD_REGULER_FLAG = is_reguler; // (선택) 정기결제 여부 (Y|N)
            obj.PCD_TAXSAVE_FLAG = is_taxsave; // (선택) 현금영수증 발행 여부 (Y|N)
            obj.PCD_SIMPLE_FLAG = 'N';
            if (simple_flag === 'Y' && payple_payer_id !== '') {
                obj.PCD_SIMPLE_FLAG = 'Y'; // 간편결제 여부 (Y|N)
                //-- PCD_PAYER_ID 는 소스상에 표시하지 마시고 반드시 Server Side Script 를 이용하여 불러오시기 바랍니다. --//
                obj.PCD_PAYER_ID = payple_payer_id; // 결제자 고유ID (본인인증 된 결제회원 고유 KEY)
            }

            /*
             * DEFAULT SET 2
             */
            obj.PCD_PAYER_AUTHTYPE = 'pwd'; // (선택) [간편결제/정기결제] 본인인증 방식
            obj.PCD_RST_URL =
                'http://devapi.ajoonamu.com/api/user/payple/order_mobile'; // (필수) 결제(요청)결과 RETURN URL
            obj.payple_auth_file =
                'http://devapi.ajoonamu.com/api/user/payple/auth'; // (필수) 가맹점이 직접 생성한 인증파일
            obj.callbackFunction = getResult;

           PaypleCpayAuthCheck(obj);
        });
        setLoading(false);
    };

    useEffect(() => {
        if (user) {
            setFirstPhoneNumber(user.hp);
        }
    }, [user]);

    useEffect(() => {
        getPayment();
        getUserCoupons();

        const temp = JSON.parse(localStorage.getItem('requestMemo'));
        if (temp) {
            if (temp.dlvMemo !== false) {
                setDlvMemoCheck(true);
                setDlvMemo(temp.dlvMemo);
            }
            if (temp.orderMemo !== false) {
                setOrderMemoCheck(true);
                setOrderMemo(temp.orderMemo);
            }
        }
    }, []);
    useEffect(()=>{
        getTotalPrice();
    },[getTotalPrice])

    useEffect(() => {
        isAllCheck();
    }, [isAllCheck]);

    useEffect(() => {
        setPayable(
            toggle && firstPhoneAuth
            && (!addContact || secondPhoneAuth)
            && (user || noAuthName !== '')
        )
    }, [addContact, firstPhoneAuth, secondPhoneAuth, noAuthName, user, toggle]);

    useEffect(() => {
        localStorage.setItem(
            'requestMemo',
            JSON.stringify({
                dlvMemo: dlvMemoCheck && dlvMemo,
                orderMemo: orderMemoCheck && orderMemo,
            }),
        );
    }, [dlvMemoCheck, orderMemoCheck, dlvMemo, orderMemo]);

    useEffect(() => {
        const boundingBox = paymentBox.current.getBoundingClientRect();
        const boundingInfo = paymentInfo.current.getBoundingClientRect();
        const STICKY = boundingInfo.top + window.pageYOffset;
        const ABSOLUTE = boundingBox.top + boundingBox.height - boundingInfo.height;
        const scrollEvent = () => {
            if (ABSOLUTE <= window.pageYOffset) {
                paymentInfo.current.style.position = 'absolute';
                paymentInfo.current.style.top = '';
                paymentInfo.current.style.bottom = 0;
            }
            else if (STICKY <= window.pageYOffset) {
                paymentInfo.current.style.position = 'fixed';
                paymentInfo.current.style.top = 0;
            } else {
                paymentInfo.current.style.position = 'static';
                paymentInfo.current.style.top = '';
            }
        }
        window.addEventListener('scroll', scrollEvent);
        return () => window.removeEventListener('scroll', scrollEvent);
    }, [user]);


    return (
        <ScrollTop>
            <div className={styles['container']}>
                <div className={styles['content']}>
                    <div className={styles['title']}>주문하기</div>
                    <div className={styles['delivery-info-box']}>
                        <div className={styles['info-box']}>
                            <div className={styles['sub-title']}>배달정보</div>
                            <div className={styles['user-info']}>
                                <div className={styles['name']}>
                                    {user ? (user.name) : (
                                        <div>
                                            <input
                                                onChange={e => setNoAuthName(e.target.value)}
                                                value={noAuthName}
                                                className={styles['noauth-input']}
                                                placeholder={'이름을 입력하세요.'}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className={styles['addr']}>
                                    {addr1} {addr2}
                                </div>
                                <PhoneInputArea
                                    phoneNumber={firstPhoneNumber}
                                    setPhoneNumber={setFirstPhoneNumber}
                                    auth={firstPhoneAuth}
                                    setAuth={setFirstPhoneAuth}
                                />
                                {addContact && (
                                    <PhoneInputArea
                                        phoneNumber={secondPhoneNumber}
                                        setPhoneNumber={setSecondPhoneNumber}
                                        auth={secondPhoneAuth}
                                        setAuth={setSecondPhoneAuth}
                                    />
                                )}
                                <span
                                    className={styles['input-hp']}
                                    onClick={() => setAddContact(!addContact)}
                                >
                                    <Select check={addContact} />
                                    <span>연락처 추가 입력</span>
                                </span>
                            </div>
                        </div>

                        <div className={styles['info-box']}>
                            <div className={styles['sub-title']}>
                                배달 요청 시간
                            </div>
                            <div className={styles['user-info']}>
                                <div className={styles['date']}>
                                    <div className={styles['first']}>
                                        <DatePicker
                                            locale={ko}
                                            dateFormat="yyyy-MM-dd"
                                            minDate={new Date()}
                                            selected={date}
                                            onChange={(date) => setDate(date)}
                                            withPortal
                                        />
                                    </div>
                                    <div className={styles['second']}>
                                        <select name="hours"onChange ={(e) => {setHours(e.target.value)}}>
                                            {[...new Array(22).keys()].splice(9, 13).map(item => (
                                                <option value={item} key={item}>
                                                    {(item >= 12 ? '오후 ' : '오전 ') + (item > 12 ? item - 12: item) + '시'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={styles['second']}>
                                        <select name="minute" onChange ={(e) => {setMinite(e.target.value)}}>
                                            <option value="00">00분</option>
                                            <option value="10">10분</option>
                                            <option value="20">20분</option>
                                            <option value="30">30분</option>
                                            <option value="40">40분</option>
                                            <option value="50">50분</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles['info-box']}>
                            <div className={styles['sub-title']}>요청사항</div>
                            <div className={styles['user-info']}>
                                <div className={styles['order-memo']}>
                                    <div className={styles['item']}>
                                        <div className={styles['bar']}>
                                            <div className={styles['text']}>
                                                주문요청 사항
                                            </div>
                                            <div
                                                className={styles['check-box']}
                                            >
                                                <SquareCheckBox
                                                    id={'order'}
                                                    text={'자동저장'}
                                                    check={orderMemoCheck}
                                                    onChange={onChangeOrderCheck}
                                                />
                                            </div>
                                        </div>
                                        <div className={styles['memo-input']}>
                                            <input
                                                className={styles['input']}
                                                value={orderMemo}
                                                onChange={onChangeOrderMemo}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles['item']}>
                                        <div className={styles['bar']}>
                                            <div className={styles['text']}>
                                                배달요청 사항
                                            </div>
                                            <div
                                                className={styles['check-box']}
                                            >
                                                <SquareCheckBox
                                                    id={'dlv'}
                                                    text={'자동저장'}
                                                    check={dlvMemoCheck}
                                                    onChange={onChangeDlvCheck}
                                                />
                                            </div>
                                        </div>
                                        <div className={styles['memo-input']}>
                                            <input
                                                className={styles['input']}
                                                value={dlvMemo}
                                                onChange={onChangeDeleveryMemo}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles['info-box']}>
                            <div className={styles['sub-title']}>결제방법</div>
                            <div className={styles['user-info']}>
                                <div className={styles['payments']}>
                                    <Payment
                                        text={'페이플 카드 결제'}
                                        check={true}
                                        onClick={onClickPayment}
                                        payment={payment}
                                    />
                                    <Payment
                                        text={'가상계좌 결제'}
                                        check={false}
                                        onClick={onClickPayment}
                                        payment={payment}
                                    />
                                    <Payment
                                        text={'휴대폰 결제'}
                                        check={false}
                                        onClick={onClickPayment}
                                        payment={payment}
                                    />
                                    <Payment
                                        text={'만나서 직접 결제'}
                                        check={false}
                                        onClick={onClickPayment}
                                        payment={payment}
                                    />
                                </div>
                            </div>
                        </div>

                        {user && (
                            <>
                                <div className={styles['info-box']}>
                                    <div className={styles['sub-title']}>
                                        할인쿠폰 적용
                                    </div>
                                    <div className={styles['user-info']}>
                                        <div className={styles['coupon']}>
                                            <select
                                                name="coupon"
                                                onChange={onChangeCpPrice}
                                            >
                                                <option value="default">
                                                    적용할 쿠폰을 선택해주세요.
                                                </option>
                                                {renderCpList()}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles['info-box']}>
                                    <div className={styles['sub-title']}>
                                        포인트 사용
                                    </div>
                                    <div className={styles['user-info']}>
                                        <div className={styles['point']}>
                                            <div className={styles['text']}>
                                                사용할 포인트
                                            </div>
                                            <input
                                                className={
                                                    styles['point-input']
                                                }
                                                value={numberFormat(usePoint)}
                                                onKeyDown={onlyNumberListener}
                                                onChange={(e) => {
                                                    const value = stringNumberToInt(
                                                        e.target.value,
                                                    );
                                                    if (user.point < value) {
                                                        openModal(
                                                            '보유하신 포인트가 부족합니다!',
                                                            '보유하신 포인트보다 사용하실 포인트가 많을 수 없습니다.',
                                                        );
                                                        setUsePoint(
                                                            parseInt(
                                                                user.point,
                                                            ),
                                                        );
                                                    } else {
                                                        setUsePoint(value);
                                                    }
                                                }}
                                            />
                                            <ButtonBase
                                                className={styles['btn']}
                                                onClick={() =>
                                                    setUsePoint(
                                                        parseInt(user.point),
                                                    )
                                                }
                                            >
                                                전체사용
                                            </ButtonBase>
                                        </div>
                                        <div className={styles['user-point']}>
                                            보유포인트{' '}
                                            <span>
                                                {user &&
                                                    numberFormat(user.point)}
                                                P
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className={styles['order-info-box']} ref={paymentBox}>
                        <div ref={paymentInfo}>
                            <div className={styles['order-box-item']}>
                                <div className={styles['title']}>결제 정보</div>
                                <div className={styles['order-price']}>
                                    <div className={styles['text-price']}>
                                        <div className={styles['text']}>
                                            주문금액
                                        </div>
                                        <div className={styles['price']}>
                                            {numberFormat(totalPrice)}
                                            <span>원</span>
                                        </div>
                                    </div>
                                    <div className={styles['text-price']}>
                                        <div className={styles['text']}>
                                            배달비용
                                        </div>
                                        <div className={styles['price']}>
                                            {numberFormat(dlvCost)}
                                            <span>원</span>
                                        </div>
                                    </div>
                                    {user && (
                                        <>
                                            <div className={styles['text-price']}>
                                                <div className={styles['text']}>
                                                    쿠폰할인
                                                </div>
                                                <div className={styles['price']}>
                                                    -{numberFormat(cp_price)}
                                                    <span>원</span>
                                                </div>
                                            </div>
                                            <div className={styles['text-price']}>
                                                <div className={styles['text']}>
                                                    포인트사용
                                                </div>
                                                <div className={styles['price']}>
                                                    -{numberFormat(usePoint)}
                                                <span>원</span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className={styles['total-price']}>
                                <div className={styles['text']}>합계</div>
                                <div className={styles['price']}>
                                    {numberFormat(
                                        parseInt(totalPrice) +
                                            parseInt(dlvCost) -
                                            parseInt(cp_price),
                                    )}
                                    <span>원</span>
                                </div>
                            </div>
                            <div className={styles['order-btn']}>
                                <Button
                                    title={'결제하기'}
                                    toggle={payable}
                                    onClick={payable ? onClickOrder : () => {}}
                                ></Button>
                            </div>
                            <div className={styles['agree-order']}>
                                <AcceptContainer
                                    {...check}
                                    updateAllCheck={updateAllCheck}
                                    onChangeCheck1={onChangeCheck1}
                                    onChangeCheck2={onChangeCheck2}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Loading open={loading} />
        </ScrollTop>
    );
};

function Payment({ text, onClick, check, payment }) {
    return (
        <ButtonBase
            className={cx('payment-item', { check: payment === text })}
            onClick={() => onClick(text)}
        >
            {text}
        </ButtonBase>
    );
}

const AcceptContainer = (props) => (
    <div className={cx('agree')}>
        <div className={styles['terms']}>
            <div className={styles['all']}>
                <CheckBox
                    id={'all'}
                    text={'모두 동의합니다.'}
                    check={props.allCheck}
                    onChange={props.updateAllCheck}
                />
            </div>
            <div className={cx('pd-sub-top')}>
                <div className={styles['chk-box']}>
                    <CheckBox
                        id={'check1'}
                        text={'개인정보처리방침 필수 동의'}
                        check={props.check1}
                        onChange={props.onChangeCheck1}
                        url={Paths.index}
                    />
                </div>
                <div className={styles['chk-box']}>
                    <CheckBox
                        id={'check2'}
                        text={'이용약관 필수'}
                        check={props.check2}
                        onChange={props.onChangeCheck2}
                        url={Paths.index}
                    />
                </div>
            </div>
        </div>
    </div>
);

export default OrderContainer;


const PhoneInputArea = ({ phoneNumber, setPhoneNumber, auth, setAuth }) => {
    const openModal = useModal();
    const [firstValue, setFirstValue] = useState('010');
    const [secondValue, setSecondValue] = useState('');
    const [thirdValue, setThirdValue] = useState('');

    const [start, setStart] = useState(false);
    const [authNumber, setAuthNumber] = useState('');

    const secondPhoneInput = useRef(null);
    const thirdPhoneInput = useRef(null);
    const authButton = useRef(null);
    const authNumberInput = useRef(null);


    const onClickStartAuth = useCallback(() => {
        if (secondValue.length >= 3 && thirdValue.length === 4) {
            setStart(true);
            alert('499996');
            // openModal('인증번호가 성공적으로 발송되었습니다!', '인증번호를 확인 후 입력해 주세요!');
            authNumberInput.current.focus();
        } else {
            openModal('휴대폰 형식에 맞지 않습니다!', '휴대폰 번호를 확인해 주세요.');
        }
    }, [secondValue, thirdValue, openModal]);

    const onClickResendAuth = useCallback(() => {
        openModal('인증번호를 재전송 하시겠습니까?', '인증번호는 6자리입니다.', () => {
            setAuth(false);
            onClickStartAuth();
        }, true);
    }, [onClickStartAuth, openModal, setAuth]);

    const onClickConfirmAuth = useCallback(() => {
        if (authNumber === '499996') {
            openModal('성공적으로 인증되었습니다!', '주문하기를 계속 진행하세요.');
            setAuth(true);
            setStart(false);
        }
    }, [authNumber, setAuth, openModal]);
    
    const onChangeAuthNumber = useCallback(e => {
        if (e.target.value.length <= 6) {
            setAuthNumber(e.target.value);
            if (e.target.value.length === 6) {
                authButton.current.focus();
            }
        } else {
            e.target.value = authNumber;
        }
    }, [authButton, authNumber, setAuthNumber]);

    const onChangePhoneFirst = useCallback(e => {  
        secondPhoneInput.current.focus();
        setFirstValue(e.target.value);
    }, []);
    const onChangePhoneNext = useCallback(e => {
        if (e.target.value.length >= 4) {
            thirdPhoneInput.current.focus();
        }
        e.target.value = e.target.value.substr(0, 4);
        setSecondValue(e.target.value);
    }, []);
    const onChangePhonePrev = useCallback(e => {
        if (e.target.value.length === 0) {
            secondPhoneInput.current.focus();
        } else if(e.target.value.length >= 4) {
            authButton.current.focus();
        }
        e.target.value = e.target.value.substr(0, 4);
        setThirdValue(e.target.value);
    }, []);

    useEffect(() => {
   
        setPhoneNumber(firstValue + secondValue + thirdValue);
    }, [firstValue, secondValue, thirdValue, setPhoneNumber]);

    return (
        <div className={styles['hp']}>
            <div className={styles['first']}>
                <select name="phone" onChange={onChangePhoneFirst} disabled={start || auth}>
                    <option value="010">010</option>
                    <option value="011">011</option>
                    <option value="016">016</option>
                    <option value="019">019</option>
                </select>
            </div>
            <div className={styles['second']}>
                <input
                    ref={secondPhoneInput}
                    onChange={onChangePhoneNext}
                    onKeyDown={onlyNumberListener}
                    className={styles['sub-number']}
                    placeholder="핸드폰 앞자리"
                    disabled={start || auth}
                />
            </div>
            <div className={styles['second']}>
                <input
                    ref={thirdPhoneInput}
                    onChange={onChangePhonePrev}
                    onKeyDown={onlyNumberListener}
                    className={styles['sub-number']}
                    placeholder="핸드폰 뒷자리"
                    disabled={start || auth}
                />
            </div>
            <div className={cx('auth', { start })}>
                <input
                    ref={authNumberInput}
                    onChange={onChangeAuthNumber}
                    onKeyDown={onlyNumberListener}
                    className={styles['auth-input']}
                />
                <AuthTimer start={start} setStart={setStart} />
            </div>
            <div className={styles['button-area']}>
                <ButtonBase
                    ref={authButton}
                    onClick={auth ? () => openModal('인증이 완료되었습니다', '다음 절차를 진행하세요.')
                        : start ?
                        authNumber.length === 6 ? onClickConfirmAuth
                            : onClickResendAuth : onClickStartAuth}
                    className={styles['button']}>
                    {auth ? "인증 완료"
                        : start ?
                        authNumber.length === 6 ? "인증번호 확인"
                            : "인증번호 재발송" : "인증번호 발송"}
                </ButtonBase>
            </div>
        </div>
    );
};
