import React from 'react';
import {FormInput} from './form';
import strings from './strings';

class EntryForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            editTarget: props.editTarget
        };
    }

    render() {
        // console.log("EntryForm.render: item = " + JSON.stringify(this.props.item));
        const item = this.props.item;
        const type = this.props.type;

        const readOnly = this.props.readOnly;
        const children = this.props.children;

        const renderField = (field) => {

            const editTarget = this.state.editTarget;
            let value;
            // editTarget may or may not be present, in readOnly mode it's not required
            // - if present, we use its value; unless 'undefined'
            //   (it will be initialized in onChange handler)
            if (typeof(editTarget) !== 'undefined' && editTarget !== null) {
                value = this.state.editTarget[field.name];
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
                               onChange={(e) => {
                                   console.log("FormInput: " + e.target.value);
                                   this.state.editTarget[field.name] = e.target.value;
                                   this.setState({
                                       editTarget: this.state.editTarget
                                   });
                               }}
                    />);


            } else {
                return (<pre key={field.name}>{field.name}: {dataType}</pre>);
            }
        };

        let fieldFilter;
        if (typeof(this.props.fieldFilter) === "function") {
            fieldFilter = this.props.fieldFilter;
        } else {
            fieldFilter = () => true;
        }
        const renderFields = () => {

            const fieldComponents = [];
            for (let fieldName in type.fields) {
                if (!type.fields.hasOwnProperty(fieldName)) {
                    continue;
                }
                const field = {name: fieldName, ...type.fields[fieldName]};

                if (fieldFilter(field)) {
                    fieldComponents.push(renderField({name: fieldName, ...field}));
                }
            }

            return fieldComponents;
        };

        return (
            <form className="EntryForm form">

                {renderFields()}

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

export default EntryForm;
