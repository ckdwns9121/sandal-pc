import React ,{useState} from 'react';
import {Paths} from 'paths';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import styles from './TabMenu.module.scss';



const TabLink = styled(NavLink)`
    text-decoration:none;
    color:black;

`;

const TabMenu =({tabs}) =>{

    console.log(tabs);
    const activeStyle = {
        height :'100%',
        textDecoration:'none',
        color:'black',
        borderBottom:'3px solid #000'
    };

    const tabList = tabs.map(tab =>(
        <TabLink key = {tab.url} exact to={tab.url} activeStyle={activeStyle}>  <TabItem name={tab.name}/> </TabLink>
    ))
    ;
    return(
        <div className={styles['tab-menu']}>
            {tabList}
        </div>
    )
}

const TabItem= ({name}) =>{

    return(
        <div className={styles['tab-item']} >
            {name}
        </div>
    )
}
export default TabMenu;