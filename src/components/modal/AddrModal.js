import React, { useState } from 'react';
import styles from './Addr.module.scss';
import Dialog from '@material-ui/core/Dialog';
import AddrItemList from 'components/address/AddrItemList';
import CloseIcon from '../svg/modal/CloseIcon';
import { searchIcon } from 'components/svg/header';
import { ButtonBase } from '@material-ui/core';


const AddressModal = (props) => {
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState('sm');

    const { open, addrs, searchAddr, detailAddr, selectAddr } = props;
    const {
        handleClose,
        onChangeAddr,
        onSearchClick,
        // onInsertAddr,
        onChangeDetail,
        onClickAddrItem,
    } = props;
    return (
        <Dialog
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            className={styles['dialog']}
        >
            <div className={styles['title-bar']}>
                <div className={styles['title']}>배달 받을 주소 </div>
                <div className={styles['close']} onClick={props.handleClose}>
                    <CloseIcon />
                </div>
            </div>
            <div className={styles['modal-content']}>
                <div className={styles['modal-input']}>
                    <input
                        className={styles['input']}
                        type="text"
                        value={searchAddr}
                        placeholder="예) 아주나무동12-3 또는 아주나무 아파트"
                        onChange={onChangeAddr}
                        onKeyPress={props.handleKeyPress}
                    ></input>
                    <img
                        className={styles['icon']}
                        onClick={onSearchClick}
                        src={searchIcon}
                        alt="search"
                    />
                </div>
                <div className={styles['search-result']}>
                    {addrs
                        ? `${addrs.length}개의 검색결과가 있습니다.`
                        : '0개의 검색결과가 있습니다.'}
                </div>
                <div className={styles['addrs-box']}>
                    <div className={styles['addrs-list']}>
                        {addrs ? (
                            <AddrItemList
                                addrs={addrs}
                                onClick={onClickAddrItem}
                            />
                        ) : (
                            ''
                        )}
                    </div>
                </div>
                <div className={styles['detail-addr']}>
                    <div className={styles['addr']}>
                        {selectAddr ? selectAddr : ''}
                    </div>
                    <div className={styles['detail-input']}>
                        <input
                            className={styles['modal-input']}
                            type="text"
                            value={detailAddr}
                            placeholder="상세 주소를 입력하세요"
                            onChange={onChangeDetail}
                        ></input>
                    </div>
                    <div className={styles['btn-box']}>
                        <ButtonBase className={styles['btn']}>
                            이 주소로 배달지 설정
                        </ButtonBase>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default AddressModal;