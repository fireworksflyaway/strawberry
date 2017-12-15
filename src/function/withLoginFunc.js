/**
 * Created by Mason Jackson in Office on 2017/12/5.
 */
import React from 'react';

export default (WrappedComponent, handleLogin) =>{
        class NewComponent extends React.Component{
                render(){
                        return <WrappedComponent handleLogin={handleLogin} />
                }
        }
        return NewComponent;
}