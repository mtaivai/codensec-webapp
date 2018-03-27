import React, {Component} from 'react';
import PropTypes from 'prop-types';
import NavLink from "./NavLink";

class NavBarBrand extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <NavLink {...this.props}/>
        );
    }
}

NavBarBrand.propTypes = {
    children: PropTypes.any
};
NavBarBrand.defaultProps = {
    to: "/",
    exact: true,
    className: "navbar-brand",

};

export default NavBarBrand;
