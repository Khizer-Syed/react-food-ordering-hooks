import React, {useEffect, Suspense} from 'react';
import Layout from './hoc/Layout/Layout';
import {Route, Switch} from 'react-router-dom';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from "./containers/Auth/Logout/Logout";
import {connect} from 'react-redux';
import {checkAuthState} from "./store/actions";
import {withRouter, Redirect} from "react-router-dom";

const Checkout = React.lazy(() => {
    return import("./containers/Checkout/Checkout");
});
const Orders = React.lazy(() => {
    return import("./containers/Orders/Orders");
});
const Auth = React.lazy(() => {
    return import("./containers/Auth/Auth");
});


const app = props => {
    useEffect(() => {
        props.onTryAutoSignIn();
    }, []);
    let routes = (
        <Switch>
            <Route path={'/auth'} render={(props) => <Auth {...props}/>}/>
            <Route path={'/'} exact component={BurgerBuilder}/>
            <Redirect to="/"/>
        </Switch>
    );

    if (props.isAuthenticated) {
        routes = (
            <Switch>
                <Route path={'/logout'} component={Logout}/>
                <Route path={'/auth'} render={(props) => <Auth {...props}/>}/>
                <Route path={'/checkout'} render={(props) => <Checkout {...props}/>}/>
                <Route path={'/orders'} render={(props) => <Orders {...props}/>}/>
                <Route path={'/'} exact component={BurgerBuilder}/>
                <Redirect to="/"/>
            </Switch>
        )
    }
    return (
        <div>
            <Layout>
                <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense>
            </Layout>
        </div>)
};

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    }
};
const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignIn: () => dispatch(checkAuthState())
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(app));
