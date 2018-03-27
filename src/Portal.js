import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

export class Archipelago extends React.Component {
    constructor(props) {
        super(props);
        this.islands = {};
    }

    getChildContext() {
        return {archipelago: this};
    }

    render() {
        return this.props.children;
    }
}

Archipelago.propTypes = {
    children: PropTypes.any
};

Archipelago.childContextTypes = {
    archipelago: PropTypes.instanceOf(Archipelago).isRequired
};

export class Island extends React.Component {
    constructor(props) {
        super(props);


    }

    componentWillMount() {
        console.log("Island.componentWillMount", this.context);
        const name = this.props.name;
        if (!name) {
            throw new Error("Island 'name' is required");
        }
        const archipelago = this.context.archipelago;
        if (!archipelago) {
            throw new Error("No Archipelago ancestor found");
        }
        const islands = archipelago.islands;

        if (islands[name]) {
            console.error("The archipelago already has an island with name '" + name + "'");
        } else {
            islands[name] = this;
        }
    }


    getContainerElement() {
        return this.containerElement;
    }

    render() {

        const {name, className, children, ...rest} = this.props;

        return (
            <div ref={(el) => this.containerElement = el}
                 className={"Island-" + name + " " + className}
                 data-island-container={"true"} {...rest}>
                {children}
            </div>
        );
    }


}

Island.propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.any
};

Island.contextTypes = {
    archipelago: PropTypes.instanceOf(Archipelago).isRequired
};


export class Portal extends React.Component {

    //
    constructor(props, context) {
        super(props, context);

    }

    _getRemoteWrapper(createIfNecessary = true) {
        if (!this._remoteWrapper && createIfNecessary) {
            this._remoteWrapper = document.createElement('div');
            this._remoteWrapper.setAttribute("data-portal-wrapper", "true");
        }
        return this._remoteWrapper;
    }

    _getRemoteContainer() {


    }

    componentWillMount() {
        console.log("Portal.componentWillMount", this.context);

        this.remoteContainer = this._getRemoteContainer();
        if (this.remoteContainer) {
            this.remoteContainer.appendChild(this._getRemoteWrapper());
        }

    }
    componentWillUnmount() {
        if (this.remoteContainer && this._getRemoteWrapper(false)) {
            this.remoteContainer.removeChild(this._getRemoteWrapper(false));
        }
    }

    render() {
        if (this.remoteContainer) {
            return ReactDOM.createPortal(
                this.props.children,
                this._getRemoteWrapper(true),
            );
        } else {

            let fallbackSite = this.props.fallbackSite;
            if (fallbackSite) {
                fallbackSite = fallbackSite.trim().toLowerCase();
            }
            if (fallbackSite === "here") {
                return this.props.children;
            } else {
                return null;
            }

        }
    }
}

Portal.defaultProps = {
    fallbackSite: "here",
};

Portal.propTypes = {
    remoteContainer: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
        PropTypes.func
    ]).isRequired,

    // "here", null
    fallbackSite: PropTypes.string.isRequired

};
Portal.contextTypes = {
    archipelago: PropTypes.instanceOf(Archipelago)
};

// TODO Portal?
export class IslandPortal extends Portal {

    //
    constructor(props, context) {
        super(props, context);
    }

    _getRemoteContainer() {

        if (this.props.remoteContainer) {
            return super._getRemoteContainer();
        }

        const islandName = this.props.island;
        if (!islandName) {
            return undefined;
        }


        const archipelago = this.context.archipelago;
        if (archipelago) {
            const island = archipelago.islands[islandName];
            if (island) {
                const c = island.getContainerElement();
                if (!c) {
                    console.warn("Island '" +islandName + "' has no ContainerElement");
                }
                return c;
            } else {
                console.warn("No Island with name '" + islandName + "' found");
            }
        } else {
            console.warn("No Archipelago context found");
        }
    }

}

IslandPortal.defaultProps = {
    ...Portal.defaultProps,
    remoteContainer: ""
};

IslandPortal.propTypes = {
    ...Portal.propTypes,
    island: PropTypes.string.isRequired
};

