/**
 * Created by Mason Jackson in Office on 1/13/18.
 */
import React from 'react';

export default (WrappedComponent, handleLogout) =>{
        class NewComponent extends React.Component{
                render(){
                        return <WrappedComponent handleLogout={handleLogout} />
                }
        }
        return NewComponent;
}