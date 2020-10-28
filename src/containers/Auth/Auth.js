import React, {useState, useEffect} from 'react';
import classes from './Auth.css';
import Input from "../../components/UI/Input/Input";
import Button from '../../components/UI/Button/Button';
import {connect} from 'react-redux';
import Spinner from "../../components/UI/Spinner/Spinner";
import {Redirect} from 'react-router-dom';
import {setAuthRedirectPath} from "../../store/actions";
import {auth} from '../../store/actions';
import {checkValidity, updateObject} from "../../shared/utility";

const authComp = props => {
    const [controls, setControls] = useState({
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'Mail Address'
            },
            value: '',
            validation: {
                required: true,
                isEmail: true
            },
            valid: false,
            touched: false
        },
        password: {
            elementType: 'input',
            elementConfig: {
                type: 'password',
                placeholder: 'Password'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
    });
    const [signUp, setSignUp] = useState(true);
    useEffect(() => {
        if (!props.building && props.authRedirectPath !== '/') {
            props.onAuthRedirect();
        }
    }, []);

    const inputChangedHandler = (event, controlName) => {
        const updatedControls = updateObject(controls, {
            [controlName]: updateObject(controls[controlName], {
                value: event.target.value,
                valid: checkValidity(event.target.value, controls[controlName].validation),
                touched: true
            })
        });
        setControls(updatedControls);
    };

    const submitHandler = (event) => {
        event.preventDefault();
        props.onAuth(controls.email.value, controls.password.value, signUp);
    };

    const switchAuthHandler = (event) => {
        event.preventDefault();
        setSignUp(!signUp);
    };

    const formElementsArray = [];
    for (let key in controls) {
        formElementsArray.push({
            id: key,
            config: controls[key]
        })
    }

    const form = formElementsArray.map(el => {
        return <Input
            key={el.id}
            elementType={el.config.elementType}
            changed={(event) => inputChangedHandler(event, el.id)}
            elementConfig={el.config.elementConfig}
            invalid={!el.config.valid}
            touched={el.config.touched}
            value={el.config.value}/>

    });
    let errorMessage = null;
    if (props.error) {
        errorMessage = <p>{props.error.message}</p>
    }
    let authRedirect = null;
    if (props.isAuthenticated) {
        authRedirect = <Redirect to={props.authRedirectPath}/>
    }
    let auth = (
        <form onSubmit={submitHandler}>
            {authRedirect}
            {errorMessage}
            {form}
            <Button btnType="Success">SUBMIT</Button>
            <Button btnType="Danger"
                    clicked={switchAuthHandler}>SWITCH TO {signUp ? 'LOGIN' : 'SIGNUP'}</Button>
        </form>
    );

    if (props.loading) {
        auth = <Spinner/>
    }

    return (
        <div className={classes.Auth}>
            {auth}
        </div>
    );

};

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        authRedirectPath: state.auth.authRedirectPath,
        building: state.burger.building
    }
};
const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignUp) => dispatch(auth(email, password, isSignUp)),
        onAuthRedirect: () => dispatch(setAuthRedirectPath('/'))

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(authComp);
