import React from 'react'


const NavBar = ({className = "navbar", additionalClassName, ...rest}) => {

    if (additionalClassName) {
        if (className) {
            className += " ";
        }
        className += additionalClassName;
    }
    return (
        <div className={className} {...rest}/>
    );
};



export default NavBar;
