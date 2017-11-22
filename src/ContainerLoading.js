import React from 'react';

import ContainerPlaceholder from './ContainerPlaceholder';
//import './ContainerLoading.css';
import loadingImage from './loading.svg';
import './Loading.css';

class ContainerLoading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeoutPassed: false
        };
        this.timerId = undefined;
    }

    componentWillUnmount() {
        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = undefined;
        }
    }
    render() {

        if (!this.timerId) {
            this.timerId = setTimeout(() => { this.setState({timeoutPassed: true}) }, 500);

        }

        const visible =
            (typeof(this.props.visible) === 'undefined' || !!this.props.visible) && this.state.timeoutPassed;

        if (!visible) {
            return (null);
        }
        return (
            <ContainerPlaceholder>
                <div>
                    <img src={loadingImage} className="Loading-Image" alt="loading..." />
                </div>
            </ContainerPlaceholder>
        );
    }
}


export default ContainerLoading;