import React from 'react';
import strings from './strings';
import './Modal.css';


// Uses Bootstrap modal styles without bootstrap.js bindings
class Modal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            disabled: false
        };

        this.onDismiss = this.onDismiss.bind(this);
        this.onOk = this.onOk.bind(this);
    }

    componentDidMount() {
        this.show();
    }

    disable(disabled) {

        disabled = disabled || typeof(disabled) === 'undefined';

        if (disabled !== this.state.disabled) {
            this.setState({disabled: disabled});
        }
    }
    enable(enabled) {
        this.disable(typeof(enabled) === 'undefined' ? false : !enabled);
    }


    onDismiss(e) {


        // let vetoed = false;
        // const originalPreventDefault = e.preventDefault;
        // e.preventDefault = () => {
        //     vetoed = true;
        // };

        if (this.state.disabled) {
            return;
        }


        let vetoed = false;
        if (typeof this.props.onDismiss === 'function') {
            this.props.onDismiss(e, this);
            vetoed = e.isDefaultPrevented();
        }

        // e.preventDefault = originalPreventDefault;

        e.preventDefault();

        // let veto = false;
        // if (typeof this.props.onDismiss === 'function') {
        //     veto = this.props.onDismiss();
        // }
        //
        // if (veto) {
        //     return;
        // }
        if (!vetoed) {
            this.close();
        }
        // this.modalRootElement.remove();
    }

    onOk(e) {
        e.preventDefault();

        if (this.state.disabled) {
            return;
        }

        let accepted = true;
        if (typeof this.props.onOk === 'function') {
            accepted = this.props.onOk(e, this);
        }
        if (accepted) {
            this.close();
        }

    }

    close(destroy) {

        //this.modalRootElement.style = "display:none;";
        this.modalRootElement.classList.remove("show");
        document.body.classList.remove("modal-open");
        //this.modalBackdropElement.style = "display: none";
        this.modalBackdropElement.classList.remove("show");

        if (destroy) {
            this.destroy();
        }
    }
    show() {
        // This is a hack to allow CSS transitions to work:
        setTimeout(() => {
            document.body.classList.add("modal-open");
            this.modalRootElement.style = "display:block; padding-right: 15px;";
            this.modalRootElement.classList.add("show");

            this.modalBackdropElement.classList.add("show");


            // const backdrop = document.createElement("div");
            // backdrop.classList.add("modal-backdrop");
            // this.modalRootElement.parentNode.insertBefore(backdrop, this.modalRootElement.nextSibling);
            // backdrop.classList.add("fade", "show");

        }, 10);

    }
    destroy() {
        this.modalRootElement.remove();
    }


    render() {
        return(
            <div>
                <div ref={(div) => this.modalRootElement = div} className="modal fade" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{this.props.title}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                                        onClick={this.onDismiss} disabled={this.state.disabled}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className={"modal-body-contents"}>
                                    {this.props.children}
                                </div>


                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary"
                                        onClick={this.onOk} disabled={this.state.disabled}>
                                    {this.props.okButtonLabel || strings.OK}
                                </button>
                                <button type="button" className="btn btn-secondary" data-dismiss="modal"
                                        onClick={this.onDismiss} disabled={this.state.disabled}>
                                    {this.props.closeButtonLabel || strings.Close}
                                </button>
                            </div>

                            {this.state.disabled &&
                                <div className={"modal-content-disabled-overlay"}>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div ref={(div) => this.modalBackdropElement = div} className="modal-backdrop fade"/>
            </div>
        );
    }
}

export default Modal;
