import React, { useState, useEffect, useCallback, useReducer } from 'react';
import {useHistory} from 'react-router-dom';
import styles from './Sign.module.scss';
import SignNormalInput from '../../components/sign/SignNormalInput';
import SignAuthInput from '../../components/sign/SignAuthInput';
import TitleBar from '../../components/titlebar/TitleBar';
import Button from '../../components/button/Button';

const logo = "http://www.agenciasampling.com.br/asampling/assets/img/sample/shortcode/logo/1.png";

const initialUserState = {
    name:'',
    email: '',
    password: '',
    compare: '',
    phoneNumber: '',
    authNumber: '',

}

const userReducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_USER_NAME':
            return {
                ...state,
                name: action.name
            }
        case 'UPDATE_USER_EMAIL':
            return {
                ...state,
                email: action.email
            }
        case 'UPDATE_USER_PASSWORD':
            return {
                ...state,
                password: action.password
            }
        case 'UPDATE_USER_COMPARE':
            return {
                ...state,
                compare: action.compare
            }
        case 'UPDATE_USER_PHONENUMBER':
            return {
                ...state,
                phoneNumber: action.phoneNumber
            }
        case 'UPDATE_USER_AUTHNUMBER':
            return {
                ...state,
                authNumber: action.authNumber
            }
        default:
            return state;

    }
}

const SignUpContainer = () => {
    
    const history = useHistory();

    const [user, dispatchUser] = useReducer(userReducer, initialUserState);
    const [check ,setCheck] =useState(false);

    const updateName = useCallback((e) => {
        console.log(e.target.value);
        dispatchUser({ type: 'UPDATE_USER_NAME', name: e.target.value });
        console.log(user);
    })

    const updateEmail = useCallback((e) => {
        console.log(e.target.value);
        dispatchUser({ type: 'UPDATE_USER_EMAIL', email: e.target.value });
        console.log(user);
    })
    const updatePassword = useCallback((e) => {
        console.log(e.target.value);
        dispatchUser({ type: 'UPDATE_USER_PASSWORD', password: e.target.value });

    })
    const updateCompare = useCallback((e) => {
        console.log(e.target.value);
         dispatchUser({ type: 'UPDATE_USER_COMPARE', compare: e.target.value });
        console.log(user);
        setCheck(user.password===e.target.value);
    })
    const updatePhoneNumber = useCallback((e) => {
        console.log(e.target.value);
        dispatchUser({ type: 'UPDATE_USER_PHONENUMBER', phoneNumber: e.target.value });

    })
    const updateAuthNumber = useCallback((e) => {
        console.log(e.target.value);
        dispatchUser({ type: 'UPDATE_USER_AUTHNUMBER', authNumber: e.target.value });
  
    })

    const matchPassword =()=>{
        if(check) return user.password=== user.compare;
        else return false;
    }

    const renderCompaere =()=>{
        if(matchPassword()){
            return(
                <label>비밀번호가 일치합니다.</label>
            )
        }
        else{
            return(
                <label>비밀번호가 일치하지 않습니다.</label>
            )
        }
    }
    const onSignup =()=>{
        history.push(`/complete/${user.name}`);
    }


    useEffect(()=>{

    },[user.password,user.compare])

    return (
        <div className="sign-main">
            <div className="sign-content">
                <TitleBar title="회원가입" src={logo} alt="회원가입"></TitleBar>
                <label>이름</label>
                <SignNormalInput inputType={"text"} initValue={user.name}  onChange={updateName}/>
                <label>이메일</label>
                <SignAuthInput inputType={"text"} initValue={user.email} onChange={updateEmail}buttonTitle={"중복검사"} />
                <label>비밀번호</label>
                <SignNormalInput inputType={"password"} initValue={user.password} onChange={updatePassword}/>
                <SignNormalInput inputType={"password"} initValue={user.compare} onChange={updateCompare}/>
                <div className={(check)? styles.compare :styles.compare_fail}>
                    {renderCompaere()}
                </div>
                <label>휴대폰 인증</label>
                <SignAuthInput inputType={"text"} initValue={user.phoneNumber} onChange={updatePhoneNumber} buttonTitle={"인증번호 발송"} />
                <SignAuthInput inputType={"text"} initValue={user.authNumber}  onChange={updateAuthNumber}buttonTitle={"인증하기"} />
                <AcceptContainer></AcceptContainer>
                <Button title={"회원가입"} onClick={onSignup}></Button>

            </div>

        </div>
    )
}

function AcceptContainer() {
    const [allCheck ,setAllCheck] =useState(false);
    const onChangeCheck =(e)=>{
        setAllCheck(!allCheck);
        console.log(allCheck);
    }
    return (
        <div className={styles.agree}>
            <div className={styles.item}>
                <div className={styles.sub}>
                    <input type="radio" checked={allCheck} onClick={onChangeCheck}/>
                    <label>모두 동의합니다</label>
                </div>
            </div>
            <div className={styles.item}>
                <div className={styles.subtitle}>
                    <input type="radio" />
                    <label>개인정보처리방침 필수 동의</label>
                </div>
                <div className={styles.subtitle}>
                    <label>보기 </label>
                </div>
            </div>
            <div className={styles.item}>
                <div className={styles.subtitle}>
                    <input type="radio" />
                    <label>이용약관 필수 동의</label>
                </div>
                <div className={styles.subtitle}>
                    <label>보기 </label>
                </div>
            </div>
            <div className={styles.item}>
                <div className={styles.subtitle}>
                    <input type="radio" />
                    <label>이벤트알림 선택 동의</label>
                </div>
                <div className={styles.subtitle}>
                    <label>보기 </label>
                </div>
            </div>
            <div className={styles.box}>
                <div className={styles.grayText}>
                    <label>SMS, 이메일을 통해 할인/이벤트/쿠폰 정보를 </label><br></br>
                    <label>받아보실 수 있습니다. </label>
                </div>
            </div>
        </div>
    )
}

export default SignUpContainer;