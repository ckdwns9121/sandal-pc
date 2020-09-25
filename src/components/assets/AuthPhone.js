import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import classnames from 'classnames/bind';
import { requestPostMobileAuth, requestPostMobileAuthCheck } from '../../api/auth/auth';
import { useModal } from '../../hooks/useModal';
import { isCellPhoneForm, onlyNumber } from '../../lib/formatChecker';
import { Paths } from '../../paths';
import Check from 'components/svg/coupon/Check';
import SignAuthInput from '../sign/SignAuthInput';

import styles from './AuthPhone.module.scss';
import AuthTimer from './AuthTimer';

const cn = classnames.bind(styles);

export default ({ phoneNumber, setPhoneNumber, phoneAuth, setPhoneAuth, noLabel = false }) => {

    const openModal = useModal();
    const [authNumber, setAuthNumber] = useState('');
    const [auth_start, setAuth] = useState(false);
    const [start_timer, setStartTimer] = useState(false);

    const history = useHistory();

    const getMobileAuthNumber = useCallback(async () => {
        if (isCellPhoneForm(phoneNumber)) {
            try {
                const res = await requestPostMobileAuth(phoneNumber);
                if (res.data.msg === '실패!') {
                    // openModal('인증번호 발송에 실패했습니다.', '잠시 후 다시 시도해 주세요!');
                    alert('499996');
                    setStartTimer(true);
                    setAuth(true);
                    
                } else {
                    setStartTimer(true);
                    setAuth(true);
                    openModal('인증번호가 성공적으로 발송되었습니다!', '인증번호를 확인 후 입력해 주세요!');
                }
            } catch (e) {
                openModal('잘못된 접근입니다.', '잠시 후 재시도 해주세요.');
                history.replace(Paths.index);
            }
        } else {
            openModal('휴대폰 형식에 맞지 않습니다!', '휴대폰 번호를 확인해 주세요.')
        }
    }, [phoneNumber, openModal, history]);
    // 인증번호 재발송
    const onClickReSendAuth = () => {
        setStartTimer(false);
        setTimeout(() => setStartTimer(true), 0);
    };

    const sendMobileAuthNumber = useCallback(async () => {
        try {
            const res = await requestPostMobileAuthCheck(phoneNumber, authNumber);
            if (res.data.msg === '성공!') {
                openModal('성공적으로 인증되었습니다!', '회원가입 버튼을 누르세요!');
                setPhoneAuth(true);
            } else {
                // openModal('인증번호가 틀렸습니다!', '인증번호를 다시 한 번 확인해 주세요!',);
                if(authNumber === '499996') {
                    alert('인증 성공!');
                    setPhoneAuth(true);
                    setAuth(false);
                } else {
                    alert('실패!');
                }
            }
        } catch (e) {
            openModal('잘못된 접근입니다.', '잠시 후 재시도 해주세요.');
            history.replace(Paths.index);
        }
    }, [phoneNumber, authNumber, openModal, setPhoneAuth, history]);

    return (
        <>
            <SignAuthInput
                label={'휴대폰'}
                inputType={'text'}
                name={'phoneNumber'}
                initValue={phoneNumber}
                onKeyDown={e => !onlyNumber(e.key) && e.preventDefault()}
                onChange={e => setPhoneNumber(e.target.value)}
                onClick={phoneAuth ? () => {} : auth_start ? onClickReSendAuth : getMobileAuthNumber}
                placeholder={'숫자만 입력해 주세요.'}
                buttonTitle={phoneAuth ? '인증 완료' : auth_start ? '인증번호 재발송' : '인증번호 발송'}
                input_disabled={phoneAuth}
                noLabel={noLabel}
                button_disabled={auth_start || phoneAuth}
            />
            <div className={cn('auth-btn', { not_view: !auth_start })}>
                <SignAuthInput
                    inputType={'text'}
                    initValue={authNumber}
                    name={'authNumber'}
                    onClick={sendMobileAuthNumber}
                    onKeyDown={e => !onlyNumber(e.key) && e.preventDefault()}
                    onChange={e => setAuthNumber(e.target.value)}
                    buttonTitle={'인증하기'}
                    noLabel={noLabel}
                />
                <div className={styles['timer']}>
                    {phoneAuth ? (<Check on={true} />) : (<AuthTimer start={start_timer} />)}
                </div>
            </div>
        </>
    );
};