import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import useInputs from '../../hooks/useInputs';
import { Paths } from 'paths';
import { useHistory } from 'react-router-dom';
import styles from './Sign.module.scss';
import Button from 'components/button/Button';
import { localLogin } from '../../api/auth/auth';
import { get_user_info } from '../../store/auth/auth';
import cn from 'classnames/bind';
import {
    KakaoLogo,
    NaverLogo,
    FacebookLogo,
} from '../../components/svg/sign/social';
import CheckBox from 'components/checkbox/CheckBox';

const cx = cn.bind(styles);

const initialUserState = {
    email: '',
    password: '',
};

const SignInContainer = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const [user, onChangeUserInput] = useInputs(initialUserState);
    const { email, password } = user;

    const [checked, setChecked] = useState(false);

    const onChangeChecked = useCallback(e => {
        setChecked(e.target.checked);
    }, []);

    const onClickSignUp = useCallback(() => {
        history.push(Paths.ajoonamu.signup);
    }, [history]);

    const onClickRecovery = useCallback(() => {
        history.push(Paths.ajoonamu.recovery);
    }, [history]);

    const onClickLogin = useCallback(async () => {
        const { email, password } = user;
        const res = await localLogin(email, password);
        if (res.status === 200) {
            //회원가입 안되있는 이메일
            if (res.data.msg === '회원가입 되어있지 않은 이메일입니다.') {
                alert('회원가입 되어있지 않은 이메일입니다.');
            }
            //비밀번호가 틀렸을 때
            else if (res.data.msg === '비밀번호가 틀렸습니다.') {
                alert('비밀번호가 틀렸습니다.');
            }
            //로그인 성공 했을 때.
            else if (res.data.access_token) {
                sessionStorage.setItem('access_token', res.data.access_token);
                dispatch(get_user_info(res.data.access_token));
                history.replace(Paths.index);
            }
        } else {
            alert('이메일 혹은 패스워드를 확인해주세요');
        }
    }, [user, history, dispatch]);

    return (
        <div className={styles['container']}>
            <div className={cx('content', 'sign-in')}>
                <div className={styles['title']}>로그인</div>
                <div className={styles['user-input']}>
                    <input
                        type="text"
                        name={'email'}
                        value={email}
                        onChange={onChangeUserInput}
                        placeholder="이메일"
                    />
                    <input
                        type="password"
                        name={'password'}
                        value={password}
                        onChange={onChangeUserInput}
                        placeholder="비밀번호"
                    />
                </div>
                <div className={styles['util']}>
                    <div className={styles['keep-mail']}>
                        <CheckBox
                            id={'check1'}
                            text={'이메일 저장하기'}
                            onChange={onChangeChecked}
                            check={checked}
                        />
                    </div>
                    <div
                        className={styles['forgot-mail']}
                        onClick={onClickRecovery}
                    >
                        <label className={styles['sub-text']}>
                            아이디/비밀번호 찾기
                        </label>
                    </div>
                </div>

                <Button
                    title={'로그인'}
                    onClick={onClickLogin}
                    toggle={true}
                ></Button>
                <Button title={'회원가입'} onClick={onClickSignUp}></Button>

                <div className={styles['sns-box']}>
                    <div className={styles['social-login']}>
                        <div className={styles['text']}>간편 로그인</div>
                        <div className={styles['line']}></div>
                    </div>

                    <div className={styles['social']}>
                        <div className={styles['sns']}>
                            <img src={NaverLogo} alt="naver"></img>
                        </div>
                        <div className={styles.sns}>
                            <img src={KakaoLogo} alt="kakao"></img>
                        </div>
                        <div className={styles.sns}>
                            <img src={FacebookLogo} alt="facebook"></img>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInContainer;
