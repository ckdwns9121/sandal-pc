import React from 'react';
import { Paths } from 'paths';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import styles from './Menu.module.scss';
import logo from 'logo.svg';


const MenuDetailLink = styled(NavLink)`
    text-decoration:none;
    color:black;
    margin-top :10px;
    & + & {
        margin-left: 10px
    }
`;


//홈 메뉴 아이템 컴포넌트
const MenuItem = ({ itemid, menuTitle, menuText, menuPrice, src }) => {

    return (
        // item_id 로 경로 줘야함
        <MenuDetailLink to={`${Paths.ajoonamu.reserve}/menu/detail/${menuTitle}`}>
            <div className={styles['menu-item']}>
                <MenuImg src={src} />
                <div className={styles['menu-info']}>
                    <MenuTitle menuTitle={menuTitle} />
                    <MenuText menuText={menuText} />
                    <MenuPrice menuPrice={menuPrice} />
                </div>
            </div>
        </MenuDetailLink>
    )

}

//홈 메뉴 이미지 컴포넌트
function MenuImg({ src }) {
    return (
        <div className={styles['menu-img']}>
            <img className={styles.img} src={logo}></img>
        </div>
    )
}
//홈 메뉴 제목 컴포넌트
function MenuTitle({ menuTitle }) {
    return (
        <div className={styles['menu-title']}>
            {menuTitle}
        </div>
    )
}

//홈 메뉴 텍스트 컴포넌트
function MenuText({ menuText }) {
    return (
        <div className={styles['menu-text']}>
            {menuText}
        </div>
    )
}

//홈 메뉴 가격 컴포넌트
function MenuPrice({ menuPrice }) {
    return (
        <div className={styles['menu-price']}>
            {menuPrice}
        </div>
    )
}

export default MenuItem;