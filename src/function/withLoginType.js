/**
 * Created by Mason Jackson in Office on 2/28/18.
 */
import React from 'react';

export default (WrappedComponent, loginType) =>{
        class NewComponent extends React.Component{
                render(){
                        return <WrappedComponent type={loginType} />
                }
        }
        return NewComponent;
}