import React from 'react';
import styles from './MainMenu.module.scss';

//홈 메뉴 아이템 컴포넌트
const MenuItem = ({ item_id, menuTitle, menuText, menuPrice, src }) => {
    return (
        // item_id 로 경로 줘야함
        <div className={styles['menu-item']}>
            <MenuImg src={src} />
            <div className={styles['pd-box']}>
                <div className={styles['menu-info']}>
                    <MenuTitle menuTitle={menuTitle} />
                    <MenuText menuText={menuText} />
                    <MenuPrice menuPrice={menuPrice} />
                </div>
            </div>
        </div>
    );
};

//홈 메뉴 이미지 컴포넌트
function MenuImg({ src }) {
    return (
        <div className={styles['menu-img']}>
            <img className={styles['img']} src={src}></img>
        </div>
    );
}
//홈 메뉴 제목 컴포넌트
function MenuTitle({ menuTitle }) {
    return <div className={styles['menu-title']}>{menuTitle}</div>;
}

//홈 메뉴 텍스트 컴포넌트
function MenuText({ menuText }) {
    return <div className={styles['menu-text']}>{menuText}</div>;
}

//홈 메뉴 가격 컴포넌트
function MenuPrice({ menuPrice }) {
    return <div className={styles['menu-price']}>{menuPrice}</div>;
}

export default MenuItem;