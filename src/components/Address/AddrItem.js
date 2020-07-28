import React from './node_modules/react';
import styles from './Addr.module.scss';

const AddrItem =({jibunAddr,roadAddr,onClick})=>{

    /*
    주소를 검색했을 시 보여줄 컴포넌트.
    */
    const handleClick =()=>{
        console.log("gd");
        var data = jibunAddr;
        onClick(data);
    }

    return(
        <div className={styles['address-item']} onClick={handleClick}>
                <JibunAddrBox jibunAddr={jibunAddr}></JibunAddrBox>
                <RoadAddrBox roadAddr={roadAddr}></RoadAddrBox>
        </div>
    )
}
const JibunAddrBox =({jibunAddr}) =>{

    /*
    주소 컴포넌트 내에 지번을 보여줄 컴포넌트
    */

    return(
        <div className ={styles['jibun-box']}>
            {jibunAddr}
        </div>
    )
}
const RoadAddrBox =({roadAddr}) =>{

    /*
    주소 컴포넌트 내에 도로명을 보여줄 컴포넌트
    */
   
    return(
        <div className ={styles['roadAddr-box']}>
           <AddrBtn/> {roadAddr}
        </div>
    )
}
const AddrBtn =()=>{

    /*
    주소 컴포넌트 내에 도로명박스 컴포넌트
    */
    return(
        <div className={styles['btn']}>
            도로명
        </div>
    )
}

export default AddrItem;