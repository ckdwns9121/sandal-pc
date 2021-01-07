import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './HomeSlick.module.scss';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { requestBannerList } from '../../api/event/banner';
import { useModal } from '../../hooks/useModal';

// import NoImage from '../../components/svg/noimage.png';

import { DBImageFormat } from '../../lib/formatter';
import ErrorCoverImage from '../../components/assets/ErrorCoverImage';


const settings = {
    infinite: true,
    autoplay: true,
    speed: 3000,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    initialSlide: 0
};

const HomeSlick = () => {
    const openModal = useModal();
    const slider = useRef();
    const [list, setList] = useState([]);
    const getBannerList = useCallback(async () => {
        try {
            const res = await requestBannerList();
            if (res.data.msg === '성공') {
                setList(res.data.query);
            } else {
                openModal('배너를 가지고 오는데 오류가 발생했습니다.', '페이지를 새로고침 해 주세요.');
            }
        } catch (e) {
            openModal('배너를 가지고 오는데 오류가 발생했습니다.', '페이지를 새로고침 해 주세요.');
        }
    }, [openModal]);
    
    useEffect(() => {
        getBannerList();
    }, [getBannerList]);

    return (
        <div className={styles['container']}>
            {list.length !== 0 && 
            <Slider {...settings} ref={slider}>
                {list.map(item => (
                    (item.bn_url.indexOf('http://') !== -1 || item.bn_url.indexOf('https://') !== -1 ?
                    <a key={item.id} href={item.bn_url}>
                        {/* <div className={styles['item']} style={{ backgroundImage: "url('" + DBImageFormat(item.bn_img)[0] + "'), url('" + NoImage + "')" }}/> */}
                        <ErrorCoverImage src={DBImageFormat(item.bn_img)[0]} alt="배너" />
                    </a> : 
                    <Link key={item.id} to={item.bn_url}>
                        {/* <div className={styles['item']} style={{ backgroundImage: "url('" + DBImageFormat(item.bn_img)[0] + "'), url('" + NoImage + "')" }}/> */}
                        <ErrorCoverImage src={DBImageFormat(item.bn_img)[0]} alt="배너" />
                    </Link>)
                ))}
            </Slider>}
        </div>
    );
};

export default HomeSlick;
