import React from 'react';

import ContainerPlaceholder from './ContainerPlaceholder';
import EntryDetail from './EntryDetail';
import ContainerLoading from './ContainerLoading';
import strings from './strings';

import './EntryDetailContainer.css';


class EntryDetailContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            //items: this.props.controller.getSelectedItems()
            fetching: false,
            items: []
        };

        // TODO do we need these?
        this.selectionChanged = this.selectionChanged.bind(this);
        this.itemsUpdated = this.itemsUpdated.bind(this);
        this.handleCommand = this.handleCommand.bind(this);


    }

    componentDidMount() {
        this.props.controller.addSelectionChangedListener(this.selectionChanged);
        this.props.controller.addItemsUpdatedListener(this.itemsUpdated);
        this.props.controller.addCommandListener(this.handleCommand);
    }

    componentWillUnmount() {
        this.props.controller.removeSelectionChangedListener(this.selectionChanged);
        this.props.controller.removeItemsUpdatedListener(this.itemsUpdated);
        this.props.controller.removeCommandListener(this.handleCommand);
    }


    selectionChanged(e) {
        console.log("EntryDetailContainer.selectionChanged");

        // TODO we should keep order of current items and add newly selected to the end of the list

        if (typeof(e.selected) !== 'undefined') {
            this.setState({
                fetching: false,
                items: e.selected
            });
        } else {
            this.setState({
                fetching: true
            });

            this.props.controller.getSelectedItems().then((items) => {
                this.setState({
                    items: items,
                    fetching: false
                });
            });
        }


    }
    itemsUpdated(e) {
        console.log("EntryDetailContainer.itemsUpdated ", e);

        let updated = false;
        e.items.forEach((updatedItem) => {
            if (this.state.items && updatedItem) {
                this.state.items.forEach((it) => {
                    if (it.id === updatedItem.id) {
                        Object.assign(it, updatedItem);
                        updated = true;
                    }
                });

            }
        });
        if (updated) {
            this.setState({
                items: this.state.items
            });
        }


        // if (this.state.item.id === e.item.id) {
        //     this.setState({
        //         item: e.item
        //     });
        // }
    }

    handleCommand(e) {
        console.log("EntryDetailContainer.handleCommand", e);

        //const items = [e.item, ...this.state.items];
        this.setState({
            editNewItem: e.item
        });
    }




    render() {

        // console.log("EntryDetailContainer.render()");

        if (this.state.fetching) {
            return (<ContainerLoading/>);
        }

        const renderPlaceholder = () => {
            return (
                <ContainerPlaceholder>
                    <div>
                        {strings.get('No_Entry_Selected')}
                    </div>
                </ContainerPlaceholder>

            );
        };


        const items = this.state.items;
        const renderItems = () => {
            const components = [];
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                components.push(<EntryDetail key={item.id} controller={this.props.controller} item={item}/>);
            }
            return components;
        };
        return (
            <div className={"EntryDetailContainer"}>
                {this.state.editNewItem &&
                    <EntryDetail key={"new"} controller={this.props.controller} item={this.state.editNewItem} editMode={true}
                        onDismiss={() => this.setState({editNewItem: undefined})}/>
                }
                {items && items.length ? renderItems() : (!this.state.editNewItem && renderPlaceholder())}
            </div>
        );
    }
}


export default EntryDetailContainer;
