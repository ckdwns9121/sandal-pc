import React from 'react';
import {Paths} from 'paths';
import {useHistory} from 'react-router-dom';
import './Header.scss';
import logo from 'logo.svg';

const Header =()=>{
    const history = useHistory();

    const goToHome =()=>{
        history.push(Paths.index);
    }

    const onLogin=()=>{
        history.push(Paths.ajoonamu.signin);
    }

    return(
        <div className="app-header">
            <div className ="app-header-nav">
                <div className="app-header-logo" onClick={goToHome}>
                    <img className ="app-header-logoimg" src={logo}></img>
                </div>
                <div className="app-header-menu">
                    <ui>
                        <li onClick={goToHome}>브랜드홈</li>
                        <li>예약주문</li>
                        <li>택배배송</li>
                        <li>이벤트</li>
                        <li>고객센터</li>
                    </ui>
                </div>
                <div className="app-header-user" onClick={onLogin}>
                    <ui>
                        <li>로그인</li>
                    </ui>
                </div>
            </div>
        </div>
    )
}


export default Header;