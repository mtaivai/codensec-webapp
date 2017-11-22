import React from 'react';

import Modal from './Modal';
import EntryForm from './EntryForm';
import ContainerLoading from './ContainerLoading';
import ContainerPlaceholder from './ContainerPlaceholder';

import './EntryDetail.css';

import strings from './strings';


class EntryDetail extends React.Component {

    constructor(props) {
        super(props);
        this.controller = props.controller;

        this.state = {
            // item: this.mergeItems(this.controller.getSelectedItems()),
            editMode: !!props.editMode,
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
    }

    componentWillUnmount() {
        // this.controller.removeSelectionChangedListener(this.selectionChanged);
        // this.controller.removeItemUpdatedListener(this.itemUpdated);
    }

    render() {
        // console.log("EntryDetail.render()");
        const item = this.props.item;
        // console.log("  item: " + JSON.stringify(item));

        if (!this.state.type || this.state.type.name !== item.type) {

            if (!this.isFetchingType && !this.state.error) {
                this.isFetchingType = true;

                this.controller.getType(item.type).then((type) => {
                    this.isFetchingType = false;
                    const error = (typeof(type) === 'undefined');
                    if (error) {
                        console.error("Failed to get type '" + item.type + "'");
                    }
                    this.setState({
                        error: error,
                        type: type
                    });
                }).catch((err) => {
                    console.error("Failed to fetch type '" + item.type + "'", err);
                    this.isFetchingType = false;
                    this.setState({
                        error: true
                    });
                })
            }

            if (this.isFetchingType) {
                return (
                    <ContainerLoading/>
                );
            } else {
                return (
                    <ContainerPlaceholder>
                        Failed to read entry type
                    </ContainerPlaceholder>
                );
            }
        }

        const onEditButton = (e) => {
            e.preventDefault();

            this.setState({editMode: true});
        };


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
            id: item.id
        };

        const viewModeFieldFilter = (field) => {
            if (field.name === "title") {
                return false;
            }
            return true;
        };

        const onDismiss = typeof(this.props.onDismiss) === "function" ? this.props.onDismiss : () => {};


        const handleEditSave = (e, success, failed) => {
            // console.log("editTarget: " + JSON.stringify(editTarget));
            this.controller.updateItem(item.id, editTarget).then(() => {
                this.setState({editMode: false});
                typeof(success) === "function" && success();
                onDismiss(true);

            }).catch((error) => {
                console.error("Failed to update entry", error);
                alert(strings.get('Failed_To_Save_Entry'));
                typeof(failed) === "function" && failed();
            });
        };
        const handleEditCancel = (e) => {
            this.setState({
                editMode: false
            });
            onDismiss(false);
        };


        return (
            <div className={"EntryDetail"}>
                <h3>{item.title}</h3>
                <p>{this.state.type.title || this.state.type.name}</p>
                <EntryForm item={item} type={this.state.type} readOnly={true}
                           fieldFilter={viewModeFieldFilter}>
                    <div className={"btn-group"}>
                        <button className={"btn btn-primary"} onClick={onEditButton}>{strings.get('Edit')}</button>
                    </div>
                </EntryForm>

                {this.state.editMode && ((
                    <Modal title={strings.formatString(strings.EditEntry_Format, item.title ||'')}
                           okButtonLabel={strings.Save}
                           onDismiss={handleEditCancel}
                           onOk={(e, modal) => {
                               modal.disable();
                               handleEditSave(e, null, modal.enable);
                           }} >
                        <EntryForm item={item} type={this.state.type} readOnly={false} editTarget={editTarget}/>
                    </Modal>
                ))}
            </div>
        );
    }
}

export default EntryDetail;
