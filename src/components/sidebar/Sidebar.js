import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.scss';
import classnames from 'classnames/bind';

const cn = classnames.bind(styles);

export default ({ title, linkList, active }) => (
    <div className={styles['sidebar']}>
        <h3 className={styles['title']}>{title}</h3>
        <ul className={styles['list']}>
            {linkList.map((item) => (
                <li className={styles['item']}>
                    <Link
                        className={cn('link', { active: active === item.url })}
                        to={item.url}
                    >
                        {item.name}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);