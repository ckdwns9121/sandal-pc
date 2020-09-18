import React from 'react';

//추가 주문 아이템 셀렉트 박스

const Select = ({check}) => {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20">
            <g  transform="translate(-24 -642)">
                <g transform="translate(24 642)" fill="#fff" stroke="#dbdbdb" strokeWidth="1">
                    <rect width="20" height="20" rx="10" stroke="none" />
                    <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" fill="none" />
                </g>
                {check &&
                <rect  width="12" height="12" rx="6" transform="translate(28 646)" fill="#007246" />
                }
            </g>
        </svg>

    )
}

export default Select;