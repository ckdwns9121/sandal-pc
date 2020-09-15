import React, { useState, useEffect, useCallback, useReducer} from 'react';
import {Paths} from 'paths';
import {useHistory} from 'react-router-dom';
import styles from './Sign.module.scss';
import SignNormalInput from 'components/sign/SignNormalInput';
import TitleBar from 'components/titlebar/TitleBar';
import Button from 'components/button/Button';
import {localLogin,getUserInfo} from '../../api/auth/auth';
import {get_user_info} from '../../store/auth/auth';
import { useDispatch } from 'react-redux';
import Header from '../../components/header/Header';
import cn from 'classnames/bind';
const cx = cn.bind(styles);

const logo = "http://www.agenciasampling.com.br/asampling/assets/img/sample/shortcode/logo/1.png";

const initialUserState = {
    email: '',
    password: '',
}

const userReducer = (state, action) => {
    switch (action.type) {
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
        default:
            return state;

    }
}

const SignInContainer = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [user,dispatchUser] = useReducer(userReducer,initialUserState);
    const [checked , setChecked]  = useState(false);
    useEffect(()=>{
        
    },[])

    const updateEmail = useCallback((e) => {
        dispatchUser({type:'UPDATE_USER_EMAIL', email:e.target.value});
    })
    const updatePassword = useCallback((e) => {
        dispatchUser({type:'UPDATE_USER_PASSWORD', password:e.target.value});
    })
    const updateChecked = useCallback(()=>{
        setChecked(!checked);
        console.log(checked);
    })
    const goToSignup =useCallback(()=>{
        history.push(Paths.ajoonamu.signup);
    })
    const onLogin = useCallback(async ()=>{
        console.log("Gd");
      const {email,password} = user;
      const res = await localLogin(email,password);
      console.log(res);
        if(res.status ==200){
            sessionStorage.setItem("access_token" , res.data.access_token);
             dispatch(get_user_info(res.data.access_token));
            history.push(Paths.index);
        }
        else{
            alert("이메일 혹은 패스워드를 확인해주세요");
        }

    })
    const goToRecovery=useCallback(()=>{
        history.push(Paths.ajoonamu.recovery);
    })

    return (
        <>
        <Header/>
        <div className={styles['container']}>
            <div className={cx ('content','sign-in')}>
                <div className={styles['title']}>
                    로그인
                </div>
                <div className={styles['user-input']}>
                    <input type="text" value={user.email} onChange={updateEmail} placeholder="이메일"></input>
                    <input type="password" value={user.password} onChange={updatePassword} placeholder="비밀번호"></input>
                </div>
                <div className={styles.sub}>
                    <div>
                        <input type="checkbox" name="remember" checked={checked} onChange={updateChecked}/>
                        <label className={styles['sub-text']}>이메일 저장하기</label><br />
                    </div>
                    <div onClick={goToRecovery}>
                        <label className={styles['sub-text']}>아이디/비밀번호 찾기</label>
                    </div>
                </div>
       
                <Button title={"로그인"} onClick ={onLogin} toggle={true}></Button>
                <Button title={"회원가입"} onClick={goToSignup}></Button>

                {/* 이부분 컴포넌트 만들어야함 */}
                <div className={styles['social']}>
                    <div style={{ marginBottom: 50 }}>간편로그인</div>
                    <div className={styles['sns']}>
                        <span> 네이버 로그인</span>
                    </div>
                    <div className={styles['sns']}>
                        <span> 카카오 로그인</span>
                    </div>
                    <div className={styles['sns']}>
                        <span> 페이스북 로그인</span>
                    </div>
                </div>
            </div>

        </div>
        </>
    )
}

export default SignInContainer;