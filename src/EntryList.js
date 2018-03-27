import React from 'react';
import PropTypes from 'prop-types';

import EntryListItem from './EntryListItem';
import './EntryList.css';

import ContainerLoading from './ContainerLoading';
import ContainerPlaceholder from './ContainerPlaceholder';

class EntryList extends React.Component {

    constructor(props) {
        super(props);
        // this.controller = props.controller;
        this.state = {
            // items: null,
            // error: undefined
            selectedIds: new Set()
        };

        this.onToggleSelection = this.onToggleSelection.bind(this);

        this.renderToolbar = this.renderToolbar.bind(this);
    }

    componentWillMount() {

    }


    componentDidMount() {
        // this.controller.addSelectionChangedListener(this.selectionChanged);
        // this.controller.addItemsAddedListener(this.itemsAdded);

        // Fetch data here

        if (this.props.getToolbarContainer) {
            this.toolbarContainer = this.props.getToolbarContainer();
            this.toolbarContainer.connect(this, { renderIsland: this.renderToolbar });
        }




    }


    componentWillUnmount() {
        // this.controller.removeSelectionChangedListener(this.selectionChanged);
        // this.controller.removeItemsAddedListener(this.itemsAdded);
        if (this.toolbarContainer) {
            this.toolbarContainer.disconnect(this);
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        // Remove entries from selected id's:
        const selectedIds = this.state.selectedIds;
        const items = nextProps.items;
        const itemIds = new Set();
        if (items) {
            items.forEach((it) => {
                itemIds.add(it.id);
            });
        }
        const newSelectedIds = new Set();
        selectedIds.forEach((id) => {
            if (itemIds.has(id)) {
                newSelectedIds.add(id);
            }
        });
        this.setState({
            selectedIds: newSelectedIds
        });

    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        if (this.toolbarContainer) {
            this.toolbarContainer.updateIsland(this);
        }
    }


    // selectionChanged(e) {
    //     console.log("EntryList.selectionChanged", e);
    //     // this.forceUpdate();
    //     // TODO: Refactor the architecture
    //     // - EntryController to be removed
    //     // - EntriesPage etc will take its role (will be a React Component)
    // }

    itemsAdded(e) {
        console.log("EntryList.itemsAdded", e);
        // this.setState({
        //     items: null,
        //     error: false
        // });
    }

    toggleItemSelected(item, multi) {

    }

    onToggleSelection(item, multi) {
        console.log("EntryList.onToggleSelection: " + item.id);
        //this.controller.toggleItemSelected(item, multi);
        const selectedIds = this.state.selectedIds;

        let oldSelection = selectedIds;
        const storeOldSelection = () => {
            oldSelection = new Set(selectedIds);
            // selectedIds.forEach((id) => oldSelection.add);
        };

        let changed = false;
        if (selectedIds.has(item.id)) {
            // Is selected
            // If not multi, keep selected and remove others
            if (!multi) {
                changed = selectedIds.size > 1;
                if (changed) {
                    storeOldSelection();
                }
                selectedIds.clear();
                selectedIds.add(item.id);
            } else {
                // Multi mode, remove selection
                storeOldSelection();
                selectedIds.delete(item.id);
                changed = true;
            }
        } else {
            storeOldSelection();
            if (!multi) {
                selectedIds.clear();
            }
            selectedIds.add(item.id);
            changed = true;
        }
        if (changed) {

            this.setState({
                selectedIds: selectedIds
            });

            if (typeof(this.props.onSelectionChanged) === "function") {
                this.props.onSelectionChanged(oldSelection, selectedIds);
            }
        }
    }

    renderToolbar() {
        return (null);
    }

    render() {
        console.log("EntryList.render()");


        // const items = this.controller.getItems();
        const items = this.props.items;

        if (this.props.fetching) {
            return (
                <ContainerLoading/>
            );
        } else if (this.props.error) {
            return (
                <ContainerPlaceholder>Poissa linjoilta</ContainerPlaceholder>
            );
        } else if (items === null || typeof items === 'undefined') {
            return (null);
        }


        const renderItems = () => {

            const c = items.length;
            const components = [];
            for (let i = 0; i < c; i++) {
                const item = items[i];
                components.push(
                    <EntryListItem
                        key={item.id}
                        item={item}
                        selected={this.state.selectedIds.has(item.id)}
                        onToggleSelection={this.onToggleSelection} />
                );
            }
            return components;
        };

        return (
            <div className={"EntryList"}>
                <ul className={"EntryList-List"}>
                    {renderItems()}
                </ul>
            </div>
        );
    }
}
EntryList.defaultProps = {
    fetching: false,
    error: false,
    items: []
};

EntryList.propTypes = {
    fetching: PropTypes.bool,
    error: PropTypes.bool,
    items: PropTypes.array,
    onSelectionChanged: PropTypes.func,
    getToolbarContainer: PropTypes.func
};

export default EntryList;
