import React  from 'react';
import PropTypes from 'prop-types';

import TextareaAutosize from 'react-textarea-autosize';
import ContentEditable from 'react-contenteditable';
import NIEditor from './NIEditor';

import eye from './open-iconic/svg/eye.svg';
import ban from './open-iconic/svg/ban.svg';
import lockLocked from './open-iconic/svg/lock-locked.svg';
import lockUnlocked from './open-iconic/svg/lock-unlocked.svg';

import './form.css';


// const resizeTextarea = (textarea) => {
//     if (!textarea) {
//         return;
//     }
//     console.log("X:" + textarea.value);
//     textarea.style.height = "auto";
//     textarea.style.overflowY = "hidden";
//     textarea.style.height = textarea.scrollHeight + "px";
//
// };

class FormGroup extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const id = this.props.id || "";


        let className = this.props.className;
        if (this.props.additionalClassName) {
            className += " " + this.props.additionalClassName;
        }

        let labelClassName = this.props.labelClassName;
        if (this.props.additionalLabelClassName) {
            labelClassName += " " + this.props.additionalLabelClassName;
        }

        let helpClassName = this.props.helpClassName;
        if (this.props.additionalHelpClassName) {
            helpClassName += " " + this.props.additionalHelpClassName;
        }

        const renderLabel = () => {
            if (this.props.label) {
                return (
                    <label htmlFor={id} className={labelClassName}>
                        {this.props.label}
                    </label>
                );
            } else {
                return null;
            }
        };

        const renderHelp = () => {
            if (this.props.help) {
                const helpId = (this.props.helpId || id + "Help");
                return (
                    <small id={helpId}  className={helpClassName}>
                        {this.props.help}
                    </small>);
            } else {
                return null;
            }
        };

        return (
            <div className={className}>
                {renderLabel()}
                {this.props.children}
                {renderHelp()}
            </div>
        );
    }
}


FormGroup.defaultProps = {
    className: "form-group",
    labelClassName: "",
    helpClassName: "form-text text-muted"
};

FormGroup.propTypes = {

    id: PropTypes.string,
    label: PropTypes.string,
    help: PropTypes.string,

    className: PropTypes.string,
    additionalClassName: PropTypes.string,
    labelClassName: PropTypes.string,
    additionalLabelClassName: PropTypes.string,
    helpClassName: PropTypes.string,
    additionalHelpClassName: PropTypes.string,

};

// Also for 'textarea' and special 'password-textarea'
class FormInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //value: props.value
            maskValue: typeof(props.maskValue) !== 'undefined' ? props.maskValue : this.isPassword()
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeTextarea = this.handleChangeTextarea.bind(this);
        this.handleChangeHtml = this.handleChangeHtml.bind(this);

        this.changed = false;
    }

    isPassword() {
        return this.props.type === "password-textarea" ||
            this.props.type === "password";
    }

    setState(updater, callback) {
        if (updater) {
            this.changed = true;
        }
        return super.setState(updater, callback);
    }
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps) !== JSON.stringify(this.props)) {
            this.changed = true;
        }
    }
    componentDidMount() {

        // setTimeout(() => {
        //     if (typeof(this.htmlElement) !== "undefined") {
        //         this.htmlElement.setAttribute("contentEditable", "true");
        //     }
        // }, 10);


    }
    shouldComponentUpdate() {
        return this.changed;
    }

    componentDidUpdate() {
        this.changed = false;

    }



    handleChange(event) {
        // console.log("FormInput.handleChange: " + event.target.value);
        this.changed = true;

        if (!(this.props.readOnly || this.props.disabled)) {

            if (typeof this.props.onChange === 'function') {
                this.props.onChange(event);
                //this.setState({value: event.target.value});
            }

        }
    }
    handleChangeTextarea(event) {

        const result = this.handleChange(event);

        // resizeTextarea(this.textareaElement);

        return result;
    }
    handleChangeHtml(event) {
        console.log("HandleChangeHtml: " + event.target.value);

        return this.handleChange(event);
    }


    render() {
        // TODO generate id if not specified!
        // TODO what if we have the same form in a modal? ID's would be duplicated: we need to prefix id values.
        // console.log("FormInput.render: " + this.props.id + " = " + this.props.value + " - " + this.state.value);


        const id = this.props.id || "";
        const helpId = (this.props.help ? (id + "Help") : "");
        //const value = (typeof this.state.value !== 'undefined') ? this.state.value : this.props.value;

        let value = this.props.value;

        let inputType = this.props.type || "text";

        // const password = this.isPassword();
        const passwordInput = inputType === "password" && this.props.allowPasswordInput;
        const html = inputType === "html";
        let placeholder = this.props.placeholder;

        const horizontal = this.props.horizontalForm;

        // const renderTextareaAsDiv = false && this.props.readOnly;
        // const renderInputAsDiv = false && this.props.readOnly;

        if (!html) {


            if (inputType === "password" && !passwordInput) {
                inputType = "text";
            }

            if (inputType === "password-textarea") {
                inputType = "textarea";
            }


            if (this.state.maskValue && !passwordInput) {
                //value = this.props.value ? "****" : "";
                value = "****";
                placeholder = this.props.value ? "(Piilotettu)" : "";
            }

            if (!this.state.maskValue && passwordInput) {
                inputType = "text";
            }
        }



        // Force controller mode:
        value = value || "";

        const valid = true;

        const inputClassName = `form-control${valid ? ' is-valid' : ' is-invalid'}${this.props.disabled ? ' disabled' : ''}`;


        const renderGenericInput = () => {
            return (
                <input
                    ref={(input) => {this.inputElement = input}}
                    type={inputType}
                    className={inputClassName}
                    id={id}
                    aria-describedby={helpId}
                    placeholder={placeholder}
                    value={value}
                    readOnly={this.props.readOnly || (this.state.maskValue && !passwordInput)}
                    disabled={this.props.disabled || typeof this.props.onChange !== 'function'}
                    onChange={this.handleChange}
                />
            );
        };


        const renderTextarea = () => {

            return (
                <TextareaAutosize
                    className={inputClassName}
                    id={id}
                    ref={(textarea) => {this.textareaElement = textarea}}
                    aria-describedby={helpId}
                    value={value}
                    readOnly={this.props.readOnly || this.state.maskValue}
                    disabled={this.props.disabled || typeof this.props.onChange !== 'function'}
                    onChange={this.handleChangeTextarea}
                />
            );
        };

        const renderHtml = () => {

            if (this.props.readOnly) {
                return (
                    <div
                        className={inputClassName}
                        id={id}
                        dangerouslySetInnerHTML={{__html: value}}
                    >
                    </div>
                );

            } else {
                return (
                    <ContentEditable
                        html={value}
                        className={inputClassName}
                        id={id}
                        readOnly={this.state.maskValue}
                        disabled={this.state.maskValue}
                        onChange={this.handleChangeHtml}
                    >
                    </ContentEditable>
                );
            }

        };

        let doRenderInput;
        if (inputType === "textarea") {
            doRenderInput = renderTextarea;
        } else if (inputType === "html") {
            doRenderInput = renderHtml;
        } else {
            doRenderInput = renderGenericInput;

        }

        const handleToggleMaskValue = (e) => {
            e.preventDefault();
            this.setState({
                maskValue: !this.state.maskValue
            });
        };

        const showLabel = (!this.props.readOnly && !passwordInput ? 'Edit': 'Show');
        const renderInput = () => {
            if (this.props.allowToggleMaskValue) {
                return (
                    <div className={"input-group"}>
                        {doRenderInput()}
                        <span className={"input-group-btn"}>
                            <a className={"btn btn-sm btn-link"} type={"link"}
                                onClick={handleToggleMaskValue}
                                title={this.state.maskValue ? showLabel : 'Hide'}>
                                {/*this.state.maskValue ? showLabel : 'Hide'*/}
                                <img src={this.state.maskValue ? lockLocked : lockUnlocked} alt={this.state.maskValue ? showLabel : 'Hide'}
                                    style={{height: "16px"}} />


                            </a>

                        </span>
                    </div>
                );
            } else {
                return doRenderInput();
            }

        };

        const renderWrappedInput = (wrap, wrapperClassName) => {
            if (wrap) {
                return (
                    <div className={wrapperClassName}>
                        {renderInput()}
                    </div>
                );
            } else {
                return renderInput();
            }
        };


        return (
            <FormGroup id={id} helpId={helpId}
                       additionalClassName={horizontal ? "row" : ""}
                       additionalHelpClassName={horizontal ? "col-lg-12" : ""}
                       additionalLabelClassName={horizontal ? "col-form-label col-md-2" : ""}
                       {...this.props}
            >
                {/*
                <input
                    ref={(input) => {this.inputElement = input}}
                    type={this.props.type || 'text'}
                    className={inputClassName}
                    id={id}
                    aria-describedby={helpId}
                    placeholder={this.props.placeholder}
                    value={value}
                    readOnly={this.props.readOnly}
                    disabled={this.props.disabled || typeof this.props.onChange !== 'function'}
                    onChange={this.handleChange}
                />*/}
                {renderWrappedInput(horizontal, "col-md-10")}

                <div className={"invalid-feedback" + (horizontal ? " col-lg-12" : "")}>
                    Please provide a valid city.
                </div>
            </FormGroup>
        );
    }
}


FormInput.defaultProps = {
    type: "text",
    disabled: false,
    readonly: false,
    allowPasswordInput: true,
    allowToggleMaskValue: true,
    horizontalForm: false
};

FormInput.propTypes = {
    id: PropTypes.string,
    helpId: PropTypes.string,
    value: PropTypes.any,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,

    onChange: PropTypes.func,

    allowPasswordInput: PropTypes.bool,
    allowToggleMaskValue: PropTypes.bool,

    horizontalForm: PropTypes.bool

};


export {FormGroup, FormInput};