import React from 'react';
import classes from './Modal.css'
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Backdrop from '../Backdrop/Backdrop';

const modal = props => {
    /* shouldComponentUpdate(nextProps, nextState, nextContext) {
         return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
     }*/
    
    return (
        <Aux>
            <Backdrop show={props.show} hide={props.modalClosed}/>
            <div
                style={{
                    transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: props.show ? 1 : 0
                }}
                className={classes.Modal}>{props.children}</div>
        </Aux>
    );
};

export default React.memo(modal, (prevProps, nextProps) => {
    return nextProps.show === prevProps.show && nextProps.children === prevProps.children;
});
