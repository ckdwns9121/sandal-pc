import React, { useCallback, useEffect, useState } from 'react';
import qs from 'querystring';
import classnames from 'classnames/bind';
import { useHistory } from 'react-router-dom';
import { requestQNADetail, requestQNAList, requestQNAStore } from '../../api/support/qna';
import { Paths } from '../../paths';

import Message from '../message/Message';

import styles from './QNA.module.scss';
import { ButtonBase, IconButton } from '@material-ui/core';
import { dateToYYYYMMDD } from '../../lib/formatter';
import Delete from '../svg/support/Delete';

const cn = classnames.bind(styles);

export default ({ match, location }) => {
    const [list, setList] = useState([]);
    const history = useHistory();

    const writeMode = match.params.id === 'write';
    const viewMode = match.params.id === 'view';

    const search = location.search.replace('?', '');
    const query = qs.parse(search);

    const getNoticeList = useCallback(async () => {
        const token = sessionStorage.getItem('access_token');
        try {
            const res = await requestQNAList(token);
            setList(res.qnas);
        } catch (e) {
            alert('잘못된 접근입니다.');
            history.replace(Paths.index);
        }
    }, [history]);

    const handleClickDetail = useCallback(id => {
        history.push(`${Paths.ajoonamu.support}/qna/view?id=${id}`)
    }, [history])

    useEffect(() => {
        getNoticeList();
    }, [getNoticeList]);

    return (
        <div className={styles['box']}>
            {!writeMode && !viewMode && <ButtonBase
                className={styles['qna-button']}
                onClick={() => history.push(`${Paths.ajoonamu.support}/qna/write`)}
            >
                문의하기
            </ButtonBase>}
            {writeMode ? <QNAWrite />
                : viewMode ? <QNADetail id={query.id} />
                    : <QNATable list={list} handleClick={handleClickDetail} />}
            
        </div>
    );
};

const QNATable = ({ list, handleClick }) => (
    <div className={styles['table']}>
        {list.length > 0 ? (
            list.map(({ id, subject, status, q_datetime }) => (
                <ButtonBase key={id} className={styles['column']}
                    onClick={() => handleClick(id)}>
                    <div className={styles['row']}>
                        <QNAState status={status} />
                        <div className={styles['subject']}>{subject}</div>
                        <div className={styles['datetime']}>
                            {dateToYYYYMMDD(q_datetime, '/')}
                        </div>
                    </div>
                </ButtonBase>
            ))
        ) : (
            <Message src={false} msg={'등록된 문의내역이 없습니다.'} size={260} />
        )}
    </div>
);
const QNAWrite = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState([]);
    const history = useHistory();

    const onChangeTitle = useCallback(e => setTitle(e.target.value), [])
    const onChangeContent = useCallback(e => setContent(e.target.value), [])
    const onChangeFiles = useCallback(e => {
        const { files: f } = e.target;
        const fileArray = [];
        for (let i = 0; i < f.length; i++) {
            fileArray.push(f[i]);
        }
        setFiles(fileArray);
    }, []);

    const onDeleteFile = useCallback(name => setFiles(files => files.filter(file => file.name !== name)), []);

    const sendQNAStore = useCallback(async () => {
        const token = sessionStorage.getItem('access_token');
        try {
            const res = await requestQNAStore(token, {
                title,
                content,
                files,
            });
            console.log(res);
            if (res.data.msg === "성공") {
                alert('성공적으로 작성하였습니다!');
                history.replace(`${Paths.ajoonamu.support}/qna`);
            } else {
                alert('작성하는 도중 오류가 발생했습니다!');
            }
        } catch (e) {
            alert('잘못된 접근입니다.');
            history.replace(Paths.index);
        }
    }, [title, content, files, history]);

    return (
        <>
            <div className={styles['table']}>
                <div className={cn('input-area')}>
                    <div className={styles['area-name']}>문의 제목</div>
                    <div className={styles['content']}>
                        <input className={styles['q-title']} type="text" value={title} onChange={onChangeTitle} />
                    </div>
                </div>
                <div className={cn('input-area', 'v-top')}>
                    <div className={styles['area-name']}>문의 내용</div>
                    <div className={styles['content']}>
                        <textarea className={styles['q-content']} value={content} onChange={onChangeContent} />
                    </div>
                </div>
                <div className={cn('input-area')}>
                    <div className={styles['area-name']}>첨부 사진</div>
                    <div className={styles['content']}>
                        <div className={styles['file']}>
                            <div className={styles['unknown-area']}></div>
                            <div style={{ display: 'table-cell', textAlign: 'right' }}>
                                <input className={styles['q-files']} multiple="multiple" type="file" onChange={onChangeFiles} id="file-setter" accept="image/gif, image/jpeg, image/png, image/svg" />
                                <ButtonBase className={styles['file-finder']}>
                                    <label htmlFor="file-setter">
                                        찾아보기
                                    </label> 
                                </ButtonBase>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles['file-list']}>
                    {files.map(file => (
                        <div className={styles['file-item']} key={file.name}>
                            {file.name}
                            <IconButton className={styles['delete']} onClick={() => onDeleteFile(file.name)}>
                                <Delete/>
                            </IconButton>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles['button-area']}>
                <ButtonBase onClick={sendQNAStore} className={styles['confirm']}>
                    등록
                </ButtonBase>
            </div>
        </>
    )
}
const QNADetail = ({ id }) => {
    const history = useHistory();

    const [data, setData] = useState({
        q_datetime: new Date(0)
    });


    const getQNADetail = useCallback(async () => {
        const token = sessionStorage.getItem('access_token');
        if (token) {
            const res = await requestQNADetail(token, id);
            console.log(res);
            if (res.data.query !== null) {
                setData(res.data.query);
            } else {
                alert('잘못된 접근입니다.')
                history.push(Paths.ajoonamu.signin);
            }
        } else {
            alert('잘못된 접근입니다.')
            history.push(Paths.ajoonamu.signin);
        }
    }, [history, id])

    useEffect(() => {
        getQNADetail();
    }, [getQNADetail]);

    const { status, subject, q_datetime, question } = data;

    return (
        <>
            <div style={{ marginBottom: '0' }} className={styles['table']}>
                <div className={styles['column']}>
                    <div className={styles['row']}>
                        <QNAState status={status} />
                        <div className={styles['subject']}>{subject}</div>
                        <div className={styles['datetime']}>
                            {dateToYYYYMMDD(q_datetime, '/')}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles['question']}>
                <div className={styles['q-content']}>{question}</div>
                <div className={styles['interaction']}>
                    <ButtonBase className={styles['btn']}>수정</ButtonBase>
                    <ButtonBase className={styles['btn']}>삭제</ButtonBase>
                </div>
            </div>
            <div className={styles['answer']}>
                <div className={styles['info']}>
                    <span className={styles['a-name']}>답변</span>
                    <span className={styles['a-date']}>2020/00/00</span>
                </div>
                <div className={styles['a-content']}>
                    안녕하세요. <br />
                    아주나무입니다. 문의해주신 내용은 아래와 같이 답변 드립니다. <br />
                    감사합니다.
                </div>
            </div>
        </>
    );
};

const QNAState = ({ status }) => (
    <div className={styles['state']}>
        <div className={cn('state-box', { complete: status !== 0 })}>
            {status !== 0 ? '답변완료' : '답변대기'}
        </div>
    </div>
);