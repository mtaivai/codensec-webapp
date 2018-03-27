import React from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import EntryForm from './EntryForm';
import ContainerLoading from './ContainerLoading';
import ContainerPlaceholder from './ContainerPlaceholder';

import './EntryDetail.css';

import strings from './strings';
import {Item} from "./Item";


class EntryDetail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            fetchingType: false,
            fetchingTypeFailed: false
        };

        // TODO do we need these?
        // this.selectionChanged = this.selectionChanged.bind(this);
        // this.itemUpdated = this.itemUpdated.bind(this);

    }

    // mergeItems(itemOrItems) {
    //     if (!itemOrItems) {
    //         return undefined;
    //     }
    //     if (Array.isArray(itemOrItems)) {
    //         if (itemOrItems.length === 1) {
    //             return itemOrItems[0];
    //         } else {
    //             return undefined;
    //         }
    //     }
    //
    //     const mergedItem = {
    //         _mergedItemIds: []
    //     };
    //     itemOrItems.forEach((it) => {
    //         mergedItem._mergedItemIds.push(it.id);
    //
    //         for (let p in it) {
    //             if (!it.hasOwnProperty(p)) {
    //                 continue;
    //             }
    //             if (!mergedItem['_multipleValues_' + p]) {
    //                 const combinedValue = mergedItem[p];
    //                 if (typeof(combinedValue) === 'undefined') {
    //                     mergedItem[p] = it[p];
    //                 } else if (combinedValue !== it[p]) {
    //                     mergedItem[p] = '';
    //                     mergedItem['_multipleValues_' + p] = true;
    //                 }
    //             }
    //         }
    //
    //     });
    //     return mergedItem;
    // }

    selectionChanged(e) {
        console.log("EntryDetail.selectionChanged", e);
        // this.setState({
        //     item: this.mergeItems(this.controller.getSelectedItems())
        // });
    }

    // itemUpdated(e) {
    //
    //     if (this.props.item && (this.props.item.id === e.item.id)) {
    //         this.setState({
    //             item: e.item
    //         });
    //     }
    // }

    componentDidMount() {
        // this.controller.addSelectionChangedListener(this.selectionChanged);
        // this.controller.addItemUpdatedListener(this.itemUpdated);
        // console.log("EntryDetail.componentDidMount");
        this._doFetchType();
        this.mounted = true;
    }

    componentWillUnmount() {
        // this.controller.removeSelectionChangedListener(this.selectionChanged);
        // this.controller.removeItemUpdatedListener(this.itemUpdated);
        this.mounted = false;
    }


    componentWillReceiveProps(nextProps, nextContext) {
        // console.log("EntryDetail.componentWillReceiveProps", nextProps, nextContext);

        // TODO the EntryDetailContainer should take care of fetching types!
        // TODO ...actually, it should be one who fetches items in the first place
        if (Item.getId(this.props.item) !== Item.getId(nextProps.item) ||
            Item.getType(this.props.item) !== Item.getType(nextProps.item)) {
            this.setState({
                type: undefined
            });
            this._doFetchType(nextProps.item, nextProps.typeProvider);
        }
    }


    _doFetchType(item, typeProvider) {
        // Fetch the type
        this.setState({
            fetchingType: true
        });

        if (!item) {
            item = this.props.item;
        }
        if (!typeProvider) {
            typeProvider = this.props.typeProvider;
        }

        // console.log("***** EntryDetail._doFetchType", item);

        const typeName = Item.getType(item);

        const type = typeProvider(typeName);
        // console.log("Type: " + type + "; typeof(type) = " + typeof(type), type);

        if (type === null || typeof(type) === "undefined") {
            console.error("Failed to get type '" + typeName + "'");
            this.setState({
                fetchingType: false,
                fetchingTypeFailed: true,
                type: undefined
            });
        } else if (typeof(type) === "object") {
            // Either a type object or Promise
            if (typeof(type.then) === "function") {
                // A Promise
                type
                    .then((result) => {
                        this._onGetTypeResolved(result);
                    })
                    .catch((err) => {
                        console.error("typeProvider promise failed", err);
                    });
            } else {
                // A type object
                this._onGetTypeResolved(type);
            }
        } else if (typeof(type) === "function") {
            // Simple accessor function
            const typeObj = type(typeName);
            this._onGetTypeResolved(typeObj);
        } else {
            console.error("typeProvider returned invalid type for '" + typeName + "'", type);
            this.setState({
                fetchingType: false,
                fetchingTypeFailed: true,
                type: undefined
            });
        }
    }

    _onGetTypeResolved(result) {
        if (!this.mounted) {
            return;
        }
        // console.log("EntryDetail._onGetTypeResolved", result);
        if (typeof(result) === "object") {
            this.setState({
                fetchingType: false,
                fetchingTypeFailed: false,
                type: result
            });
        } else {
            this.setState({
                fetchingType: false,
                fetchingTypeFailed: true,
                type: undefined
            });
        }
    }



    render() {
        console.log("EntryDetail.render()", this.props, this.state);

        if (!this.mounted) {
            return (null);
        }

        const item = this.props.item;
        if (!item) {
            return (null);
        }

        if (this.state.fetchingType) {
            return (
                <ContainerLoading/>
            );
        } else if (this.state.fetchingTypeFailed) {
            return (
                <ContainerPlaceholder>
                    Failed to read entry type
                </ContainerPlaceholder>
            );
        }


        // const updateItem = (itemId, newState) => {
        //     console.log("updateItem; itemId = " + itemId + "; newState = " + newState);
        //     for (let p in newState) {
        //         if (!newState.hasOwnProperty(p)) {
        //             continue;
        //         }
        //         console.log("Update: " + p + " = " + newState[p]);
        //     }
        // };

        // item.type === "merged"


        const editTarget = {
            id: Item.getId(item)
        };



        const onDismiss = typeof(this.props.onDismiss) === "function" ? this.props.onDismiss : () => {};


        const handleEditSave = (e, success, failed) => {
            // console.log("editTarget: " + JSON.stringify(editTarget));

            // this.controller.updateItem(item.id, editTarget).then(() => {
            //     this.setState({editMode: false});
            //     typeof(success) === "function" && success();
            //     onDismiss(true);
            //
            // }).catch((error) => {
            //     console.error("Failed to update entry", error);
            //     alert(strings.get('Failed_To_Save_Entry'));
            //     typeof(failed) === "function" && failed();
            // });

        };
        const handleEditCancel = (e) => {
            this.setState({
                editMode: false
            });
            onDismiss(false);
        };

        const editInModal = false;

        const type = this.state.type;
        const editMode = this.props.editMode;

        // const showEditButton = typeof(this.props.onBeginEdit) === "function";

        // const onBeginEdit = (e) => {
        //     e.preventDefault();
        //     if (typeof(this.props.onBeginEdit) === "function") {
        //         this.props.onBeginEdit(item);
        //     }
        // };

        const viewModeFieldFilter = (field) => {
            if (field.name !== "XXXtitle") {
                return true;
            }
        };

        return (
            <div className={"EntryDetail"}>
                <EntryForm item={item} type={type}
                           readOnly={!(editMode || editInModal)}
                           editTarget={editTarget}
                           fieldFilter={viewModeFieldFilter}>

                    {/*
                    <div className={"btn-group"} style={{display: "block"}}>
                        {
                            (!editMode && showEditButton) &&
                            <button className={"btn btn-secondary"} onClick={onBeginEdit}>{strings.get('Edit')}</button>
                        }
                        {
                            (editMode && !editInModal) &&
                            <button className={"btn btn-primary"} onClick={onBeginEdit}>{strings.get('Tallentele')}</button>
                        }
                    </div>
                    */}
                </EntryForm>

                {editInModal && editMode && ((
                    <Modal title={strings.formatString(strings.EditEntry_Format, item.title ||'')}
                           okButtonLabel={strings.Save}
                           onDismiss={handleEditCancel}
                           onOk={(e, modal) => {
                               modal.disable();
                               handleEditSave(e, null, modal.enable);
                           }} >
                        <EntryForm item={item} type={type} readOnly={false} editTarget={editTarget}/>
                    </Modal>
                ))}
            </div>
        );
    }
}

EntryDetail.defaultProps = {
    editMode: false
};

EntryDetail.propTypes = {
    // fetching: PropTypes.bool,
    editMode: PropTypes.bool,
    item: PropTypes.object.isRequired,
    typeProvider: PropTypes.func.isRequired//,
    // onBeginEdit: PropTypes.func
};

export default EntryDetail;
