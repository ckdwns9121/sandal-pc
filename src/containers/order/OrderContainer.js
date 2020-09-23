import React, {
    useState,
    useEffect,
    useReducer,
    useCallback,
    useRef,
} from 'react';
import { Paths } from 'paths';
import styles from './Order.module.scss';
import classNames from 'classnames/bind';
import CircleCheckBox from '../../components/checkbox/CircleCheckBox';
import SquareCheckBox from '../../components/checkbox/SquareCheckBox';
import Button from '../../components/button/Button';
import CheckBox from '../../components/checkbox/CheckBox';
import { ButtonBase } from '@material-ui/core';
import { getCartList } from '../../api/cart/cart';
import { numberFormat } from '../../lib/formatter';
import { getOrderCoupons } from '../../api/coupon/coupon';
import { useStore } from '../../hooks/useStore';
import $script from 'scriptjs';
import { user_order } from '../../api/order/order';

const cx = classNames.bind(styles);

const initCheck = {
    allCheck: false,
    check1: false,
    check2: false,
};

const checkReducer = (state, action) => {
    // console.log(action);
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
    const user_token = useStore();
    const [check, dispatchCheck] = useReducer(checkReducer, initCheck);
    const { check1, check2 } = check;
    const [toggle, setToggle] = useState(false);
    const [payment, setPayment] = useState('만나서 직접 결제');
    const [couponList, setCouponList] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [delivery_cost, setDeliveryCost] = useState(0); // 배달비
    const [delivery_memo, setDeliveryMemo] = useState('');
    const [order_memo, setOrderMemo] = useState('');
    const [PCD_PAYER_ID, SET_PCD_PAYER_ID] = useState(null);
    const order_id = useRef(null);

    const onChangeDeleveryMemo = (e) => {
        setDeliveryMemo(e.target.value);
    };
    const onChangeOrderMemo = (e) => {
        setOrderMemo(e.target.value);
    };

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
        sessionStorage.setItem('payment', payment);
    };

    //결제 방법 스토리지에 있다면 들고오기
    const getPayment = () => {
        const payment_item = sessionStorage.getItem('payment');
        if (payment_item) {
            setPayment(payment_item);
        }
    };

    //총 주문금액 구하기
    const getTotalPrice = async () => {
        if (user_token) {
            const res = await getCartList(user_token);
            console.log(res);
            let price = 0;
            let len = Object.keys(res).length;

            for (let i = 0; i < len - 2; i++) {
                const { item_price, item_quanity } = res[i].item;
                console.log(res[i]);
                price += item_price * item_quanity;
            }
            if (res.PCD_PAYER_ID === null) {
                console.log(res.PCD_PAYER_ID);
                SET_PCD_PAYER_ID(res.PCD_PAYER_ID);
            } else {
                SET_PCD_PAYER_ID(res.PCD_PAYER_ID.pp_tno);
            }
            setTotalPrice(price);
            setDeliveryCost(res.delivery_cost);
        }
    };

    // 유저의 쿠폰 가져오기
    const getUserCoupons = async () => {
        if (user_token) {
            const res = await getOrderCoupons(user_token);
            console.log(res);
            setCouponList(res);
        }
    };

    //쿠폰이 있을시 옵션 렌더
    const renderCpList = () => {
        const list = couponList.map((item) => (
            <option key={item.cp_id} value={item.cp_id}>
                {item.cp_id}
            </option>
        ));
        return <>{list}</>;
    };

    const onClickOrder = async () => {
        const payple_url = 'https://testcpay.payple.kr/js/cpay.payple.1.0.1.js';
        const res = await user_order(user_token);
        console.log(res);
        order_id.current = res.data.query;
        console.log('넘어 오는지 체크');
        console.log(order_id.current);

        $script(payple_url, () => {
            /*global PaypleCpayAuthCheck*/

            const getResult = function (res) {
                alert('callback : ' + res.PCD_PAY_MSG);
            };

            console.log('결제 시작 테스트');

            let pay_type = 'card'; //결제 수단
            let pay_work = 'CERT'; //결제 타입 1. AUTH 계좌등록 2.CERT 가맹점 최종승인후 계좌등록 + 결제진행 3.PAY 가맹점 승인 없이 계좌등록 + 결제진행
            let payple_payer_id = '';

            let buyer_no = ''; //고객 고유번호
            let buyer_name = ''; //고객 이름
            let buyer_hp = ''; //고객 번호
            let buyer_email = ''; //고객 이메일
            let buy_goods = '테스트'; //구매하는 물건 이름
            let buy_total = Number(totalPrice); //가격
            let buy_taxtotal = 0;
            let buy_istax = ''; //과세설정 DEFAULT :Y  비과세 N
            let order_num = order_id.current; //주문 번호
            let is_reguler = 'N';
            let is_taxsave = 'N';
            let simple_flag = 'N';
            let card_ver = '01';
            // const auth_type = "";
            // const is_direct = "";
            // const pcd_rst_ur = "";
            // const server_name = "";

            console.log(order_num);

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
    };

    useEffect(() => {
        getPayment();
        getUserCoupons();
        getTotalPrice();
    }, []);

    useEffect(() => {
        isAllCheck();
    }, [isAllCheck]);

    return (
        <>
            <div className={styles['container']}>
                <div className={styles['content']}>
                    <div className={styles['title']}>주문하기</div>
                    <div className={styles['delivery-info-box']}>
                        <div className={styles['info-box']}>
                            <div className={styles['sub-title']}>배달정보</div>
                            <div className={styles['user-info']}>
                                <div className={styles['name']}>김샌달</div>
                                <div className={styles['addr']}>
                                    서울특별시 구로구 구로동 557, 101동
                                    101호(샌달아파트)
                                </div>
                                <div className={styles['hp']}>
                                    <div className={styles['first']}>
                                        <select name="phone">
                                            <option value="010">010</option>
                                            <option value="011">011</option>
                                            <option value="016">016</option>
                                            <option value="019">019</option>
                                        </select>
                                    </div>
                                    <div className={styles['second']}>
                                        <input
                                            className={styles['sub-number']}
                                            placeholder="핸드폰 앞자리"
                                        ></input>
                                    </div>
                                    <div className={styles['second']}>
                                        <input
                                            className={styles['sub-number']}
                                            placeholder="핸드폰 뒷자리"
                                        ></input>
                                    </div>
                                </div>
                                <div className={styles['input-hp']}>
                                    <CircleCheckBox text={'연락처 추가'} />
                                </div>
                            </div>
                        </div>

                        <div className={styles['info-box']}>
                            <div className={styles['sub-title']}>
                                배달 요청 시간
                            </div>
                            <div className={styles['user-info']}>
                                <div className={styles['date']}>
                                    <div className={styles['first']}>
                                        <select name="date">
                                            <option value="2000">
                                                2000-00-00
                                            </option>
                                            <option value="2001">
                                                2000-00-00
                                            </option>
                                            <option value="2002">
                                                2000-00-00
                                            </option>
                                            <option value="2003">
                                                2000-00-00
                                            </option>
                                        </select>
                                    </div>
                                    <div className={styles['second']}>
                                        <select name="hours">
                                            <option value="9">오전 9시</option>
                                            <option value="10">
                                                오전 10시
                                            </option>
                                            <option value="11">
                                                오전 11시
                                            </option>
                                            <option value="12">
                                                오전 12시
                                            </option>
                                        </select>
                                    </div>
                                    <div className={styles['second']}>
                                        <select name="minute">
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
                                                    text={'자동저장'}
                                                />
                                            </div>
                                        </div>
                                        <div className={styles['memo-input']}>
                                            <input
                                                className={styles['input']}
                                                value={delivery_memo}
                                                onChange={onChangeDeleveryMemo}
                                            ></input>
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
                                                    text={'자동저장'}
                                                />
                                            </div>
                                        </div>
                                        <div className={styles['memo-input']}>
                                            <input
                                                className={styles['input']}
                                                value={order_memo}
                                                onChange={onChangeOrderMemo}
                                            ></input>
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
                                        text={'신용/체크카드 결제'}
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

                        <div className={styles['info-box']}>
                            <div className={styles['sub-title']}>
                                할인쿠폰 적용
                            </div>
                            <div className={styles['user-info']}>
                                <div className={styles['coupon']}>
                                    <select name="coupon">
                                        <option value="cp1">
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
                                    <input className={styles['point-input']} />
                                    <ButtonBase className={styles['btn']}>
                                        사용하기
                                    </ButtonBase>
                                </div>
                                <div className={styles['user-point']}>
                                    보유포인트 <span>5,000P</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles['order-info-box']}>
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
                                        {numberFormat(delivery_cost)}
                                        <span>원</span>
                                    </div>
                                </div>
                                <div className={styles['text-price']}>
                                    <div className={styles['text']}>
                                        쿠폰할인
                                    </div>
                                    <div className={styles['price']}>
                                        0<span>원</span>
                                    </div>
                                </div>
                                <div className={styles['text-price']}>
                                    <div className={styles['text']}>
                                        포인트사용
                                    </div>
                                    <div className={styles['price']}>
                                        0<span>원</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles['total-price']}>
                            <div className={styles['text']}>합계</div>
                            <div className={styles['price']}>
                                {numberFormat(
                                    parseInt(totalPrice) +
                                        parseInt(delivery_cost),
                                )}
                                <span>원</span>
                            </div>
                        </div>
                        <div className={styles['order-btn']}>
                            <Button
                                title={'결제하기'}
                                toggle={toggle}
                                onClick={toggle && onClickOrder}
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
        </>
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

const AcceptContainer = (props) => {
    return (
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
};
export default OrderContainer;
