import React from 'react';
import PropTypes from 'prop-types';
import {FormInput} from './form';
import strings from './strings';
import {DEFAULT_TYPE_NAME} from "./repository/EntryRepository";

import './EntryForm.css';

class EntryForm extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        // console.log("EntryForm.render: item = " + JSON.stringify(this.props.item));
        const item = this.props.item;
        const type = this.props.type;

        const readOnly = this.props.readOnly;
        const children = this.props.children;

        const renderField = (field, horizontalForm) => {

            const editTarget = this.props.editTarget;
            let value;
            // editTarget may or may not be present, in readOnly mode it's not required
            // - if present, we use its value; unless 'undefined'
            //   (it will be initialized in onChange handler)
            if (typeof(editTarget) !== 'undefined' && editTarget !== null) {
                value = editTarget[field.name];
            }
            if (typeof(value) === 'undefined') {
                value = item[field.name];
            }

            const dataType = (field.dataType || "").trim().toLowerCase();
            const contentType = (field.contentType || "").trim().toLowerCase();

            if (dataType === "string" || dataType === "password" || dataType === "html") {

                let inputType;
                let maskValue;

                if (dataType === "password") {
                    inputType = field.maxLength > 40 ? "password-textarea" : "password";
                    maskValue = true;
                } else {
                    if (dataType === "html" || contentType === "text/html") {
                        inputType = "html";
                    } else {
                        inputType = field.maxLength > 40 ? "textarea" : "text";
                    }
                    maskValue = false;
                }

                return (
                    <FormInput key={field.name} id={field.name} type={inputType}
                               label={field.label || strings.get("EntryForm_" + field.name, field.name)}
                               placeholder={null}
                               help={field.description || strings.get("EntryForm_" + field.name + "_Help", '')}
                               value={value}
                               maskValue={maskValue}
                               allowToggleMaskValue={maskValue}
                               allowPasswordInput={false}
                               readOnly={readOnly}
                               horizontalForm={horizontalForm}
                               onChange={(e) => {
                                   console.log("FormInput: " + e.target.value);
                                   this.props.editTarget[field.name] = e.target.value;
                                   this.setState({
                                       // TODO not going tow owork
                                       editTarget: this.state.editTarget
                                   });
                               }}
                    />);


            } else {
                return (<pre key={field.name}>{field.name}: {dataType}</pre>);
            }
        };


        const fieldFilter = (field) => {
            // In read-only mode, don't show title or tags as regular fields
            if (this.props.readOnly && field.name === "title" || field.name === "tags") {
                return false;
            }
            if (typeof(this.props.fieldFilter) === "function") {
                return this.props.fieldFilter(field);
            } else {
                return false;
            }
        };



        const headerFields = [];
        const bodyFields = [];

        const isHeaderField = (field) => {
            return (field.name === "title");
        };
        const isBodyField = (field) => {
            return !isHeaderField(field);
        };

        for (let fieldName in type.fields) {
            if (!type.fields.hasOwnProperty(fieldName)) {
                continue;
            }
            const field = {name: fieldName, ...type.fields[fieldName]};

            if (fieldFilter(field)) {
                if (isHeaderField(field)) {
                    headerFields.push(field);
                }
                if (isBodyField(field)) {
                    bodyFields.push(field);
                }
            }

        }

        const renderFields = (fields, horizontal) => {
            const fieldComponents = [];
            fields.forEach((field) => {
                if (fieldFilter(field)) {
                    fieldComponents.push(renderField(field, horizontal));
                }
            });
            return fieldComponents;
        };

        const renderTags = () => {
            if (item.tags) {
                const elems = [];
                let tagIndex = 0;
                item.tags.forEach((tag) => {
                    elems.push(<span key={"tag-" + (tagIndex++)} className={"badge badge-primary"}>{tag}</span>);
                });
                if (elems.length > 0) {
                    return (
                        <div className={"tag-list"}>
                            {elems}
                        </div>
                    );
                } else {
                    return (null);
                }


            } else {
                return (null);
            }
        };

        const typeLabel = type.name === DEFAULT_TYPE_NAME ? "" : (type.title || type.name);
        const title = item.title || "";


        return (
            <form className="EntryForm form">

                <div className="EntryForm-Header">
                    {title && <h2 className={"item-field-title"}>{title}</h2>}
                    {typeLabel && <div className={"item-field-type"}>{typeLabel}</div>}

                    {renderTags()}

                    {renderFields(headerFields, false)}
                </div>



                <div className="EntryForm-Body">
                    {renderFields(bodyFields, false)}
                </div>

                {/*
                <FormInput id="name" type={"text"}
                           label={strings.get('EntryForm_Title')}
                           placeholder={strings.get('EntryForm_Title')}
                           help={"Help!"}
                           value={item.title}
                           readOnly={readOnly}
                           onChange={(e) => this.editTarget.title = e.target.value }


                />
                <FormInput id="userName"
                           type={"text"}
                           label={strings.get('EntryForm_UserName')}
                           value={item.detail}
                           placeholder={strings.get('EntryForm_UserName')}
                           readOnly={readOnly}
                           onChange={(e) => {
                               this.editTarget.detail = e.target.value;
                           }}
                />

                <FormInput id="password" type={"password"}
                           label={strings.get('EntryForm_Password')}
                           placeholder={strings.get('EntryForm_Password')}
                           readOnly={readOnly}/>
                           */}
                {children}
            </form>
        );
    }
}

EntryForm.defaultProps = {
    readOnly: false
};

EntryForm.propTypes = {
    // fetching: PropTypes.bool,
    item: PropTypes.object.isRequired,
    type: PropTypes.object.isRequired,
    readOnly: PropTypes.bool,
    children: PropTypes.object,
    editTarget: PropTypes.object,
    fieldFilter: PropTypes.func
};


export default EntryForm;
