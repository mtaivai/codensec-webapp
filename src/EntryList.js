import React from 'react';

import EntryListItem from './EntryListItem';
import './EntryList.css';

import ContainerLoading from './ContainerLoading';
import ContainerPlaceholder from './ContainerPlaceholder';

class EntryList extends React.Component {

    constructor(props) {
        super(props);
        this.controller = props.controller;
        this.state = {
            items: null,
            error: undefined
        };
        this.fetching = false;
        this.selectionChanged = this.selectionChanged.bind(this);
        this.itemsAdded = this.itemsAdded.bind(this);


    }

    componentDidMount() {
        this.controller.addSelectionChangedListener(this.selectionChanged);
        this.controller.addItemsAddedListener(this.itemsAdded);
    }

    componentWillUnmount() {
        this.controller.removeSelectionChangedListener(this.selectionChanged);
        this.controller.removeItemsAddedListener(this.itemsAdded);
    }

    selectionChanged(e) {
        console.log("EntryList.selectionChanged", e);
        this.forceUpdate();
        // TODO: Refactor the architecture
        // - EntryController to be removed
        // - EntriesPage etc will take its role (will be a React Component)
    }

    itemsAdded(e) {
        console.log("EntryList.itemsAdded", e);
        this.setState({
            items: null,
            error: false
        });
    }

    render() {
        console.log("EntryList.render()");

        // const items = this.controller.getItems();
        const items = this.state.items;

        if (items === null && !this.state.error) {
            this.fetching = true;
            this.controller.getItems().then((response) => {
                console.log("EntryList.render(): getItems().then: " + response);
                this.fetching = false;
                this.setState({
                    items: response,
                    error: typeof(response) === 'undefined'
                });
            });
        }
        if (this.fetching) {
            return (
                <ContainerLoading/>
            );
        } else if (this.state.error) {
            return (
                <ContainerPlaceholder>Poissa linjoilta</ContainerPlaceholder>
            );
        } else if (items === null || typeof items === 'undefined') {
            return (null);
        }

        const onToggleSelection = (item, multi) => {
            console.log("EntryList.onToggleSelection: " + item.id);
            this.controller.toggleItemSelected(item, multi);

            // const newSelected = !item.selected;
            //
            // if (!multi) {
            //     ITEMS.forEach((it) => {
            //         it.selected = false;
            //     });
            // }
            // item.selected = newSelected;
            //
            // this.setState({
            // });
        };
        const renderItems = () => {

            const c = items.length;
            const components = [];
            for (let i = 0; i < c; i++) {
                const item = items[i];
                components.push(<EntryListItem key={item.id} controller={this.controller} item={item} onToggleSelection={onToggleSelection} />);
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


export default EntryList;
