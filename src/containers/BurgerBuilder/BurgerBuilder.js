import React, {useState, useEffect} from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';
import axios from '../../axios-orders';

export const burgerBuilder = props => {
    const [purchasing, setPurchasing] = useState(false);
    useEffect(() => {
        props.onInitIngredients();
    }, []);
    /*    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const ingredients = {...this.state.ingredients};
        ingredients[type] = updatedCount;
        const priceAddition = this.state.totalPrice + IngredientPrices[type] ;
        this.setState({ingredients, totalPrice: priceAddition});
        this.updatePurchaseState(ingredients);
    };

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1;
        const ingredients = {...this.state.ingredients};
        ingredients[type] = updatedCount;
        const priceSubtraction = this.state.totalPrice - IngredientPrices[type];
        this.setState({ingredients, totalPrice: priceSubtraction});
        this.updatePurchaseState(ingredients);
    };*/

    const updatePurchaseState = (ingredients) => {
        const sum = Object.values(ingredients).reduce((sum, el) => sum + el, 0);
        return sum > 0;
    };

    const purchaseHandler = () => {
        if (props.isAuthenticated) {
            setPurchasing(true);
        } else {
            props.onAuthRedirect('/checkout');
            props.history.push('/auth');
        }
    };

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    };

    /* purchaseContinueHandler = () => {
         const queryParams =[];
         for (let i in this.state.ingredients) {
             queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
         }
         queryParams.push('price=' + this.state.totalPrice);
         const queryString = queryParams.join('&');
         this.props.history.push({
             pathname: '/checkout',
             search: '?' + queryString
         });
     };*/
    const purchaseContinueHandler = () => {
        props.onPurchaseInit();
        props.history.push('/checkout');
    };

    const disabledInfo = {...props.ings};
    for (let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = null;
    let burger = props.error ? <p>Ingredients can't be loaded</p> : <Spinner/>;
    if (props.ings) {
        burger = (
            <Aux>
                <Burger ingredients={props.ings}/>
                <BuildControls
                    ingredientAdded={props.onIngredientAdded}
                    ingredientRemoved={props.onIngredientRemoved}
                    disabled={disabledInfo}
                    purchasable={updatePurchaseState(props.ings)}
                    price={props.price}
                    isAuth={props.isAuthenticated}
                    purchasing={purchaseHandler}
                />
            </Aux>
        );
        orderSummary = <OrderSummary
            close={purchaseCancelHandler}
            continue={purchaseContinueHandler}
            price={props.price}
            ingredients={props.ings}/>;
    }

    return (
        <Aux>
            <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </Aux>
    )

};

const mapStateToProps = state => {
    return {
        ings: state.burger.ingredients,
        price: state.burger.totalPrice,
        error: state.burger.error,
        isAuthenticated: state.auth.token !== null
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onInitIngredients: () => dispatch(actions.initIngredinets()),
        onIngredientAdded: (value) => dispatch(actions.addIngredient(value)),
        onIngredientRemoved: (value) => dispatch(actions.removeIngredient(value)),
        onPurchaseInit: () => dispatch(actions.purchaseInit()),
        onAuthRedirect: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(burgerBuilder, axios));
