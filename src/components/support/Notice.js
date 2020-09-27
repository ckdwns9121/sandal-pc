import React, { useCallback, useEffect, useState } from 'react';
import styles from './Notice.module.scss';

import Message from '../assets/Message';
import { requestNoticeItem, requestNoticeList } from '../../api/support/notice';
import { Link, useHistory } from 'react-router-dom';
import { Paths } from '../../paths';
import { dateToYYYYMMDD } from '../../lib/formatter';
import Loading from '../assets/Loading';
import { useModal } from '../../hooks/useModal';


const numbering = (number) => {
    let result = number;
    if (number < 100) {
        result = "0" + result;
    } if (number < 10) {
        result = "0" + result;
    }
    return result;
}

export default ({ match }) => {
    const openModal = useModal();
    const [loading, setLoading] = useState(false);
    const [noticeList, setNoticeList] = useState([]);
    const [noticeItem, setNoticeItem] = useState({});
    const history = useHistory();

    const { params } = match;

    const getNoticeList = useCallback(async () => {
        setLoading(true);
        try {
            const res = await requestNoticeList();
            setNoticeList(res.notices);
        } catch (e) {
            openModal('잘못된 접근입니다', '정상적으로 다시 접근해 주세요.');
            history.replace(Paths.index);
        }
        setLoading(false);
    }, [history, openModal]);

    const getNoticeItem = useCallback(async () => {
        setLoading(true);
        try {
            const res = await requestNoticeItem(parseInt(params.id));
            if (res.notice !== null && res.notice !== undefined) {
                setNoticeItem(res.notice);
            } else {
                openModal('없는 게시물입니다.', '게시글을 확인해 주세요.');
                history.replace(Paths.ajoonamu.support + '/notice');
            }
        } catch (e) {
            openModal('잘못된 접근입니다', '정상적으로 다시 접근해 주세요.');
            history.replace(Paths.index);
        }
        setLoading(false);
    }, [history, params, openModal]);

    useEffect(() => {
        getNoticeList();
    }, [getNoticeList]);

    useEffect(() => {
        if (params.id !== null && params.id !== undefined) {
            getNoticeItem();
        }
    }, [getNoticeItem, params]);

    return (
        <div className={styles['box']}>
            {loading ? <Loading open={loading}/>
            : <div className={styles['table']}>
                { params.id !== null && params.id !== undefined ? 
                <NoticeContent item={noticeItem} />
                : noticeList.length > 0 ?
                <NoticeList list={noticeList} />
                : <Message src={false} msg={"등록된 공지사항이 없습니다."} size={260} />}
            </div>}
        </div>
    );
};

const NoticeList = ({ list }) => list.map(item => (
    <div key={item.id} className={styles['column']}>
        <Link to={`${Paths.ajoonamu.support}/notice/${item.id}`} className={styles['row']}>
            <div className={styles['id']}>
                {numbering(item.id)}
            </div>
            <div className={styles['title']}>
                {item.title} 
            </div>
            <div className={styles['created']}>
                {dateToYYYYMMDD(item.created_at, '/')}
            </div>
        </Link>
    </div>
));

const NoticeContent = ({ item }) => (
    <>
        <div className={styles['head']}>
            <div className={styles['id']}>
                {numbering(item.id)}
            </div>
            <div className={styles['title']}>
                {item.title}
            </div>
            <div className={styles['created']}>
                {dateToYYYYMMDD(item.created_at, '/')}
            </div>
        </div>
        <div className={styles['content']} dangerouslySetInnerHTML={{ __html: item.body}} />
    </>
);