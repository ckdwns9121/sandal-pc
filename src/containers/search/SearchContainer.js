import React, { useCallback, useEffect, useState } from 'react';
import qs from 'querystring';
import styles from './SearchContainer.module.scss';
import { getSearchMenu } from '../../api/menu/menu';
import ListPaging from '../../components/sidebar/ListPaging';
import { Paths } from '../../paths';
import MenuItemList from '../../components/item/MenuItemList';
import { useHistory } from 'react-router-dom';
import Loading from '../../components/assets/Loading';
import Fail from '../../components/svg/search/Fail';
import { ButtonBase } from '@material-ui/core';

const PAGE_PER_VIEW = 8;

export default ({ location }) => {
    const search = location.search.replace(/\?/g, '');
    const query = qs.parse(search);
    const q = query.query;
    const page = query.page ? parseInt(query.page) : 1;

    const [loading, setLoading] = useState(false);

    const history = useHistory();
    const [count, setCount] = useState(0);
    const [list, setList] = useState([]);

    const onClickMenuItem = useCallback((item_id) => 
        history.push(`${Paths.ajoonamu.product}?item_id=${item_id}`)
    , [history]);

    const getSearchResult = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getSearchMenu(q, PAGE_PER_VIEW, (page - 1) * PAGE_PER_VIEW);
            if (res.data.msg === 'success') {
                if (count !== res.data.query.count) {
                    setCount(res.data.query.count);
                }
                setList(res.data.query.items);
            } else if (res.data.msg === '메뉴가 존재하지 않습니다.') {
                setCount(0);
                setList([]);
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }, [q, count, page]);

    useEffect(() => {
        getSearchResult();
    }, [getSearchResult]);

    return (
        <div className={styles['container']}>
            <div className={styles['content']}>
                {!loading && (list.length ? (
                    <>
                        <div className={styles['search']}>
                            <p className={styles['text']}><b>{q}</b>에 대한 {count}개의 검색결과</p>
                            <MenuItemList
                                menuList={list}
                                onClick={onClickMenuItem}
                            />
                        </div>
                        <ListPaging
                            baseURL={Paths.ajoonamu.search +'?query=' + (q ? q : '') + '&'}
                            currentPage={page}
                            pagePerView={PAGE_PER_VIEW}
                            totalCount={count}
                        />
                    </>
                ) : (
                    <div className={styles['empty']}>
                        <Fail />
                        <p className={styles['text']}><b>{q}</b> 에 대한 검색결과가 없습니다.</p>
                        <p className={styles['sub-text']}>다른 검색어를 입력하시거나 철자와 띄어쓰기를 확인해 보세요.</p>
                        <ButtonBase className={styles['back-button']} onClick={() => history.push(Paths.index)}>
                            돌아가기
                        </ButtonBase>
                    </div>
                ))}
            </div>
            <Loading open={loading} />
        </div>
    );
};
