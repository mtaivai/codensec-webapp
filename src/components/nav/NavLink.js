import React from 'react'
import PropTypes from 'prop-types'
import {Link, Route} from 'react-router-dom'


/*
 * This is customized from
 * https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/modules/NavLink.js
 * to create Bootstrap 4 navigation links wrapped in 'li' elements.
 *
 */

/**
 * A <Link> wrapper that knows if it's "active" or not.
 */

class NavLink extends React.Component {



    constructor(props) {
        super(props);
    }


    render() {
        const {
            to,
            exact,
            strict,
            location,
            activeClassName,
            className,
            activeStyle,
            style,
            // wrapper,
            // wrapperActiveClassName,
            // wrapperClassName,
            // wrapperActiveStyle,
            // wrapperStyle,
            disabled,
            disabledClassName,
            // disabledWrapperClassName,
            isActive: getIsActive,
            'aria-current': ariaCurrent,
            onClick: onClick,
            ...rest} = this.props;

        //const actualLocation = this.state.location || location;
        const path = typeof to === 'object' ? to.pathname : to;

        // console.log("Render: " + to);

        // Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L202
        const escapedPath = path.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');

        return (
            <Route
                path={escapedPath}
                exact={exact}
                strict={strict}
                location={location}
                children={({location, match}) => {
                    const isActive = !!(getIsActive ? getIsActive(match, location) : match);

                    const isDisabled = !!(typeof(disabled) === 'function' ? disabled(match, location) : disabled);

                    const actualClassName = isDisabled ? [className, disabledClassName].filter(i => i).join(' ') : className;
                    // const actualWrapperClassName = isDisabled ? [wrapperClassName, disabledWrapperClassName].filter(i => i).join(' ') : wrapperClassName;


                    const link = (
                        <Link
                            to={to}
                            onClick={(e) => {if (typeof onClick === 'function') onClick(e); if (isDisabled) e.preventDefault()}}
                            className={isActive ? [actualClassName, activeClassName].filter(i => i).join(' ') : actualClassName}
                            style={isActive ? {...style, ...activeStyle} : style}
                            aria-current={isActive && ariaCurrent || null}
                            {...rest}
                        />
                    );
                    // if (false && typeof(wrapper) === 'function') {
                    //     return wrapper({
                    //         link: link,
                    //         className: isActive ? [actualWrapperClassName, wrapperActiveClassName].filter(i => i).join(' ') : actualWrapperClassName,
                    //         style: isActive ? {...wrapperStyle, ...wrapperActiveStyle} : wrapperStyle
                    //     });
                    // } else {
                    //     return link;
                    // }
                    return link;

                }}
            />
        )
    };
}

NavLink.propTypes = {
    to: Link.propTypes.to,
    exact: PropTypes.bool,
    strict: PropTypes.bool,
    location: PropTypes.object,
    activeClassName: PropTypes.string,
    className: PropTypes.string,
    activeStyle: PropTypes.object,
    style: PropTypes.object,
    // wrapperActiveClassName: PropTypes.string,
    // wrapperClassName: PropTypes.string,
    // wrapperActiveStyle: PropTypes.object,
    // wrapperStyle: PropTypes.object,
    isActive: PropTypes.func,
    disabled: PropTypes.bool,
    disabledClassName: PropTypes.string,
    // disabledWrapperClassName: PropTypes.string,
    'aria-current': PropTypes.oneOf(['page', 'step', 'location', 'date', 'time', 'true'])
};

NavLink.defaultProps = {
    className: 'nav-link',
    'aria-current': 'true',
    // wrapperClassName: 'nav-item',
    // wrapperActiveClassName: 'active',
    disabledClassName: 'disabled',
    // wrapper: ({link, className, style, ...rest}) =>
    //     (<li className={className} style={style} {...rest}>{link}</li>)
};

//
// const ConnectedNavLink = connect(
//     (state) => ({location: state.router.location})
// )(NavLink);
//

export default NavLink;