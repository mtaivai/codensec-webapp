import React from "react";
import PropTypes from 'prop-types';

import EntryList from "./EntryList";
import EntryDetailContainer from "./EntryDetailContainer";
import {EntryRepository} from "./repository/EntryRepository";
import {getItemId} from "./Item";
import LoremIpsum from "./components/LoremIpsum";

import "./EntriesPage.css";
import "./Sidebar.css";


class IslandContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };

        // TODO should we set this elsewhere, at least in willReceiveProps?
        if (typeof(props.bind) === "function") {
            props.bind(this);
        }

        this.sources = [];

        this.connect = this.connect.bind(this);
        this.disconnect = this.disconnect.bind(this);
    }



    connect(source, provider) {
        if (!source) {
            return;
        }

        this.sources.push({
            source: source,
            provider: provider,
        });
    }
    disconnect(source) {
        if (!source) {
            return;
        }

        for (let i = 0; i < this.sources.length; i++) {
            if (this.sources[i].source === source) {
                this.sources.splice(i, 1);
                i--;
            }
        }
    }

    updateIsland(source) {
        // TODO 'source' is to provide hint, which island provider to update...
        this.setState({

        });
    }
    // setContent(content) {
    //     this.setState({
    //         content: content
    //     });
    // }

    render() {

        const islands = [];
        let i = 0;
        this.sources.forEach((s) => {
            const key = i++;
            const island = s.provider.renderIsland(s);
            if (island) {
                islands.push(<div key={key}>{island}</div>);
            }
        });

        return (
            <div>
                {islands}
            </div>
        );
    }

}

class EntriesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fetching: false,
            items: [],
            selectedItemIds: new Set()
        };

        console.log("EntriesPage", props);

        this.onAddItem = this.onAddItem.bind(this);
        this.handleListSelectionChanged = this.handleListSelectionChanged.bind(this);
    }

    onAddItem(e) {
        console.log("EntriesPage.onAddItem", e);

    }

    componentWillMount() {
    }

    componentDidMount() {
        this.setState({
            fetching: true
        });

        this.props.repository.getItems().then((response) => {
            console.log("EntriesPage received response from repository.getItems()", response);

            this.setState({
                fetching: false,
                items: response
            });
        });
    }


    handleListSelectionChanged(oldSelectedIds, newSelectedIds) {
        console.log("EntriesPage.handleListSelectionChanged", oldSelectedIds, newSelectedIds);
        const selectedIds = new Set();
        newSelectedIds.forEach((id) => selectedIds.add(id));
        this.setState({
            selectedItemIds: selectedIds
        });
    }



    render() {


        const typeProvider = (typeName) => {
            return this.props.repository.getType(typeName);
        };

        const getSelectedItems = () => {
            const items = [];
            this.state.items.forEach((it) => {
                if (this.state.selectedItemIds.has(getItemId(it))) {
                    items.push(it);
                }
            });
            return items;
        };

        const onScrollDetailContent = (e) => {
            // console.log("onScroll", e);
            // const y = e.target.scrollTop;
            // if (y > 0) {
            //     console.log("Scrolled");
            // }
        };

        const selectedItems = getSelectedItems();



        let itemDetailToolbar;

        return (
            <div className={"EntriesPage container-fluid"}>
                <div className={"row"}>
                    <div className={"col sidebar"}>
                        <div className={"sidebar-content"}>
                            <EntryList
                                fetching={this.state.fetching}
                                items={this.state.items}
                                onSelectionChanged={this.handleListSelectionChanged}
                            />
                        </div>
                    </div>
                    <div className={"primary col XXXml-sm-auto pt-3"}>
                        <EntryDetailContainer items={selectedItems} typeProvider={typeProvider}
                                              getToolbarIsland={() => itemDetailToolbar}/>
                    </div>
                </div>
            </div>

        );
    }
}


EntriesPage.propTypes = {
    repository: PropTypes.instanceOf(EntryRepository).isRequired
};

export default EntriesPage;
