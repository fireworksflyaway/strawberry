/**
 * Created by Mason Jackson in Office on 2017/12/11.
 */
import React from 'react';

export default (WrappedComponent, isLogin, username) =>{
        class NewComponent extends React.Component{
                render(){
                        return <WrappedComponent isLogin={isLogin} username={username} />
                }
        }
        return NewComponent;
}