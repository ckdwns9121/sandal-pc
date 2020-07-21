import React from 'react';
import styles from './SignComplete.module.scss';
import TitleBar from 'components/titlebar/TitleBar';
import Button from 'components/button/Button';



const SignComplete =({mainTitle,subTitle,text})=>{
    return(
            <CompleteBox mainTitle={mainTitle} subTitle={subTitle} text={text}/>
    )
}

function CompleteBox({mainTitle,subTitle,text}) {
    return (
        <div className={styles['item-box']} >
            <MainTitle mainTitle={mainTitle}></MainTitle>
            <SubTitle subTitle={subTitle}></SubTitle>
            <Text text={text}></Text>
        </div>
    )
}

function MainTitle({mainTitle}) {
    return (
        <div className={styles['main-title']}>
            {mainTitle}
        </div>
    )
}
function SubTitle({subTitle}) {
    return (
        <div className={styles['sub-title']}>
            {subTitle}
        </div>
    )
}
function Text ({text}){
    return(
        <div className={styles['text']}>
            {text}
        </div>
    )
}

export default SignComplete;
