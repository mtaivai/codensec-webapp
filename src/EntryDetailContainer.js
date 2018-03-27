import React from 'react';

import PropTypes from 'prop-types';

import ContainerPlaceholder from './ContainerPlaceholder';
import EntryDetail from './EntryDetail';
import ContainerLoading from './ContainerLoading';
import strings from './strings';
import {IslandPortal} from "./Portal";

import './EntryDetailContainer.css';
import {Item} from "./Item";



// TODO Exclave?




class EntryDetailContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            inEditModeIds: new Set()
        };

        // TODO do we need these?
        // this.selectionChanged = this.selectionChanged.bind(this);
        // this.itemsUpdated = this.itemsUpdated.bind(this);
        // this.handleCommand = this.handleCommand.bind(this);

        this.renderToolbar = this.renderToolbar.bind(this);
        this.beginEdit = this.beginEdit.bind(this);

    }

    componentDidMount() {
        // this.props.controller.addSelectionChangedListener(this.selectionChanged);
        // this.props.controller.addItemsUpdatedListener(this.itemsUpdated);
        // this.props.controller.addCommandListener(this.handleCommand);

        if (this.props.getToolbarIsland) {
            this.toolbarIsland = this.props.getToolbarIsland();
            if (this.toolbarIsland) {
                this.toolbarIsland.connect(this, { renderIsland: this.renderToolbar });
            }
        }

    }

    componentWillUnmount() {
        // this.props.controller.removeSelectionChangedListener(this.selectionChanged);
        // this.props.controller.removeItemsUpdatedListener(this.itemsUpdated);
        // this.props.controller.removeCommandListener(this.handleCommand);
        if (this.toolbarIsland) {
            this.toolbarIsland.disconnect(this);
        }
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (this.toolbarIsland) {
            this.toolbarIsland.updateIsland(this);
        }
    }


    // selectionChanged(e) {
    //     console.log("EntryDetailContainer.selectionChanged");
    //
    //     // TODO we should keep order of current items and add newly selected to the end of the list
    //
    //     if (typeof(e.selected) !== 'undefined') {
    //         this.setState({
    //             fetching: false,
    //             items: e.selected
    //         });
    //     } else {
    //         this.setState({
    //             fetching: true
    //         });
    //
    //         this.props.controller.getSelectedItems().then((items) => {
    //             this.setState({
    //                 items: items,
    //                 fetching: false
    //             });
    //         });
    //     }
    //
    //
    // }
    // itemsUpdated(e) {
    //     console.log("EntryDetailContainer.itemsUpdated ", e);
    //
    //     let updated = false;
    //     e.items.forEach((updatedItem) => {
    //         if (this.state.items && updatedItem) {
    //             this.state.items.forEach((it) => {
    //                 if (it.id === updatedItem.id) {
    //                     Object.assign(it, updatedItem);
    //                     updated = true;
    //                 }
    //             });
    //
    //         }
    //     });
    //     if (updated) {
    //         this.setState({
    //             items: this.state.items
    //         });
    //     }
    //
    //
    //     // if (this.state.item.id === e.item.id) {
    //     //     this.setState({
    //     //         item: e.item
    //     //     });
    //     // }
    // }
    //
    // handleCommand(e) {
    //     console.log("EntryDetailContainer.handleCommand", e);
    //
    //     //const items = [e.item, ...this.state.items];
    //     this.setState({
    //         editNewItem: e.item
    //     });
    // }




    renderToolbar() {
        // TODO is this needed?
        const items = this.props.items;
        if (items && items.length === 1) {
            return (<div className={"btn-toolbar"} role={"toolbar"} aria-label={"Tools"}>
                {
                <div className={"btn-group"} role={"group"} aria-label={"Item actions"}>
                    <button
                        type={"button"}
                        className={"btn btn-secondary"}
                        onClick={() => {this.beginEdit(items[0])}}>
                        Muokkaa
                    </button>
                    <button
                        type={"button"}
                        className={"btn btn-danger"}
                        onClick={() => {this.beginEdit(items[0])}}>
                        Poista
                    </button>
                    <button
                        type={"button"}
                        className={"btn btn-secondary"}
                        onClick={() => {this.beginEdit(items[0])}}>
                        Jotain aivan muuta
                    </button>
                </div>
                }
            </div>);
        } else {
            return null;
        }

    }

    beginEdit(item) {

        this.state.inEditModeIds.add(Item.getId(item));

        this.setState({
            inEditModeIds: this.state.inEditModeIds
        });
    }


    render() {
        //
        // return (
        //     <OnIsland target={"contextToolbar"}>{this.renderToolbar()}</OnIsland>
        // );
        console.log("EntryDetailContainer.render()", this.props);

        if (this.props.fetching) {
            return (<ContainerLoading/>);
        }

        const items = this.props.items;

        if (!items || items.length === 0) {
            return (
                <ContainerPlaceholder>
                    <div>
                        {strings.get('No_Entry_Selected')}
                    </div>
                </ContainerPlaceholder>

            );
        }




        const renderItems = () => {
            const components = [];
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                components.push(
                    <EntryDetail
                        key={Item.getId(item)}
                        item={item}
                        typeProvider={this.props.typeProvider}
                        editMode={this.state.inEditModeIds.has(Item.getId(item))}
                        onBeginEdit={this.beginEdit}
                    />
                );
            }
            return components;
        };

        return (
            <div className={"EntryDetailContainer"}>

                <div className={"ToolbarXXX"}>
                    <IslandPortal island={"contextToolbar"}>{this.renderToolbar()}</IslandPortal>
                </div>

                <div>
                    {renderItems()}
                </div>

                <div>
                    Tämä tulee muokkaustilassa pohjalel
                </div>
            </div>
        );

        // return (
        //     <div className={"EntryDetailContainer"}>
        //         {this.state.editNewItem &&
        //             <EntryDetail key={"new"} controller={this.props.controller} item={this.state.editNewItem} editMode={true}
        //                 onDismiss={() => this.setState({editNewItem: undefined})}/>
        //         }
        //         {items && items.length ? renderItems() : (!this.state.editNewItem && renderPlaceholder())}
        //     </div>
        // );
    }
}

EntryDetailContainer.defaultProps = {
    fetching: false,
    error: false,
    items: []
};

EntryDetailContainer.propTypes = {
    fetching: PropTypes.bool,
    error: PropTypes.bool,
    items: PropTypes.array,
    typeProvider: PropTypes.func.isRequired,
    getToolbarIsland: PropTypes.func
    // onContentReady: PropTypes.func
};


export default EntryDetailContainer;
