import React, { useState } from 'react';
import {useHistory} from 'react-router-dom';
import SignNormalInput from '../../components/sign/SignNormalInput';
import SignAuthInput from '../../components/sign/SignAuthInput';
import TitleBar from '../../components/titlebar/TitleBar';
import Button from '../../components/button/Button';
import styles from './Sign.module.scss';
import SignComplete from '../../components/complete/SignComplete';

const logo = "http://www.agenciasampling.com.br/asampling/assets/img/sample/shortcode/logo/1.png";

const RecoveryContainer = () => {

    const history = useHistory();
    const onClickIdLink=()=>{
        history.push('/recovery_id');
    }
    const onClickPwLink=()=>{
        history.push('/recovery_pw');
    }
    return (
        <div className="sign-main">
            <div className="sign-content">
                <TitleBar title="아이디/비밀번호 찾기" src={logo} alt="아이디/비밀번호 찾기"></TitleBar>
                <div className={styles.linkbox}>
                    <div className={styles.linkitem} onClick={onClickIdLink}>
                    <SignComplete className={styles.linkitem} mainTitle={"아이디찾기"} text={"인증을 통해 아이디 찾아"}/>
                    </div>
                    <div className={styles.linkitem} onClick={onClickPwLink}>
                    <SignComplete className={styles.linkitem} mainTitle={"비밀번호 찾기"} text={"인증을 통해 아이디 찾아"}/>
                    </div>
                </div>
            </div>

        </div>
    )
}


export default RecoveryContainer;