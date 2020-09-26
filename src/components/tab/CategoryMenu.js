import React from 'react';
import { useHistory } from 'react-router-dom';
import styles from './CategoryMenu.module.scss';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    tabs: {
        width: '100%',
        minHeight: '70px',
        margin: '0 auto',
        backgroundColor: '#fff',
        paddingLeft:"24px",
        paddingRight:"24px",
        marginBottom:"60px",
        border :"1px soild red",
    },
}));

const CategoryMenu = ({ tabs, index, onChange,isPush }) => {
    const classes = useStyles();
    const history = useHistory();

    const onClickTab = (url) => {
        if (url !== undefined || url!==null) {
            isPush ? history.push(url) : history.replace(url);
        }
    };

    const tabList = tabs.map((tab) => (
        <Tab
            label={tab.name}
            key={tab.name}
            className={styles['tab-item']}
            onClick={() => onClickTab(tab.url)}
        />
    ));

    return (
        <Tabs
            value={index}
            onChange={onChange}
            TabIndicatorProps={{
                style: {
                    backgroundColor: '#000',
                    height:'4px',
                    borderRadius:'100px'
                },
            }}
            // className={classes.tabs}
            className={styles['tabs']}
            centered={true}
        >
            {tabList}
        </Tabs>
    );
};

CategoryMenu.defaultProps = {
    tabs: null,
    index: 0,
    isPush : false,
    onChange: () => console.warn(null),
};

export default CategoryMenu;