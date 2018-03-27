import React from 'react'

class NavBarCollapse extends React.Component{

    componentWillMount() {
        this.collapseId = NavBarCollapse.nextCollapseId++;
    }

    render() {

        const {id, className = 'collapse navbar-collapse', ...rest} = this.props;

        const collapseId = id || ('navbarCollapse' + this.collapseId);

        return [
            (
                <button key={collapseId + '-toggler'} className="navbar-toggler" type="button" data-toggle="collapse" data-target={'#' + collapseId} aria-controls={'#' + collapseId} aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>
            ),
            (
                <div key={collapseId + '-navbar'} id={collapseId} className={className} {...rest}/>
            )
        ];
    }
}
NavBarCollapse.nextCollapseId = 1;


export default NavBarCollapse;
