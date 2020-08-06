import React, { useState } from 'react';
import styles from './Sign.module.scss';
import SignNormalInput from 'components/sign/SignNormalInput';
import SignAuthInput from 'components/sign/SignAuthInput';
import TitleBar from 'components/titlebar/TitleBar';
import Button from 'components/button/Button';

const logo = "http://www.agenciasampling.com.br/asampling/assets/img/sample/shortcode/logo/1.png";

const RecoveryPwContainer = () => {
    
    const [userName, setUserName] = useState('');
    const [userPhone, setUserPhone] = useState('');

    return (
        <div className={styles['sign-main']}>
            <div className={styles ['sign-content']}>
                <TitleBar title="비밀번호 찾기" src={logo} alt="비밀번호 찾기"></TitleBar>
                <label>이름</label>
                <SignNormalInput/>
                <label>아이디(이메일)</label>
                <SignNormalInput/>
                <label>휴대폰 인증</label>
                <SignAuthInput inputType={""} initValue={""} buttonTitle={"인증번호 발송"}/>
                <SignAuthInput inputType={""} initValue={""} buttonTitle={"인증하기"}/>
                <Button title={"확인"}></Button>
            </div>
        </div>
    )
}


export default RecoveryPwContainer;