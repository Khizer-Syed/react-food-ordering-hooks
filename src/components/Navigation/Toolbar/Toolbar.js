import React from 'react';
import classes from './Toolbar.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';

const toolbar = props => {
    return (
        <header className={classes.Toolbar}>
            <DrawerToggle toggle={props.toggleSideDrawer}/>
            <div className={classes.Logo}><Logo /></div>
            <nav className={classes.DesktopOnly}>
                <NavigationItems isAuth={props.isAuth}/>
            </nav>
        </header>
    );
};

export default toolbar;
