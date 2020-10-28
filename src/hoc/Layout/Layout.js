import React, {useState} from 'react';
import Aux from '../Auxiliary/Auxiliary';
import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import {connect} from 'react-redux';

const layout = props => {
    const [showSideDrawer, setSideDrawer] = useState(false);
    const sideDrawerClosedHandler = () => {
        setSideDrawer(false);
    };

    const sideDrawerOpenHandler = () => {
        setSideDrawer(true);
    };

    const sideDrawerToggleHandler = () => {
        setSideDrawer(!showSideDrawer);
    };
    return (
        <Aux>
            <Toolbar
                toggleSideDrawer={sideDrawerToggleHandler}
                open={sideDrawerOpenHandler}
                isAuth={props.isAuthenticated}/>
            <SideDrawer
                open={showSideDrawer}
                isAuth={props.isAuthenticated}
                closed={sideDrawerClosedHandler}/>
            <main className={classes.Content}>{props.children}</main>
        </Aux>
    )
};

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    }
};

export default connect(mapStateToProps)(layout);
