import React from 'react';


class EntryListItem extends React.Component {
    constructor(props) {
        super(props);
        this.controller = props.controller;
        this.state = {
            // item: props.item,
            // onToggleSelection: props.onToggleSelection

        };
        // this.itemsUpdated = this.itemsUpdated.bind(this);
    }

    // itemsUpdated(e) {
    //     console.log("EntryListItem.itemsUpdated: " + JSON.stringify(e));
    //
    //     for (let i = 0; i < e.items.length; i++) {
    //         const item = e.items[i];
    //         if (this.state.item.id === item.id) {
    //             this.setState({
    //                 item: item
    //             });
    //             break;
    //         };
    //     }
    //
    // }

    componentDidMount() {
        // this.controller.addItemsUpdatedListener(this.itemsUpdated);
    }
    componentWillUnmount() {
        // this.controller.removeItemsUpdatedListener(this.itemsUpdated);

    }

    render() {
        console.log("EntryListItem.render()");

        let className = "EntryList-Item";

        const item = this.props.item;

        if (this.controller.isItemSelected(item)) {
            className += " active";
        }

        const onClick = (e) => {
            // console.log("EntryListItem.onClick: " + item.id + "; " + e.metaKey);

            if (typeof(this.props.onToggleSelection) === 'function') {
                this.props.onToggleSelection(item, e.metaKey);
            }
        };

        // TODO these string manipulation functions here are just quick'n' dirty solutions - should be replaced with real ones
        const collapseWhitespaces = (s) => {
            if (!s) {
                return s;
            }
            return s.replace(/\s+/g, " ");
        };
        const stripMarkup = (s, contentType) => {
            if (!s) {
                return s;
            }

            console.log("StripMarkup '" + contentType + "': " + s);

            if (contentType === 'text/html') {

                s = s.replace(/<\s*head\s*.*?\s*>.*<\s*\/\s*head\s*>/, " ");
                s = s.replace(/<\s*script\s*.*?\s*>.*<\s*\/\s*script\s*>/, " ");

                return s.replace(/<[^>]+>/g, " ");
            } else {
                return s;
            }
        };

        const excerpt = (s, len = 40) => {
            if (!s) {
                return s;
            }

            // let e = collapseWhitespaces(s).substr(0, len).trim();
            // if (e.length > len) {
            //     e += "...";
            // }

            let e = collapseWhitespaces(s).substr(0, len).trim();
            if (e.length < s.length) {
                e += "...";
            }
            return e;
        };

        // !substr
        // !plaintext
        // !collapsews

        const contentType = (field) => {
            if (!item._meta || !item._meta.fields || !item._meta.fields[field] || !item._meta.fields[field].type) {
                return undefined;
            }
            return item._meta.fields[field].type.contentType;
        };


        const title = excerpt(stripMarkup(item.title, contentType('title')), 30);
        const detail = excerpt(stripMarkup(item.detail, contentType('detail')), 40);


        return (
            <li className={className} onClick = {onClick}>
                <div className={"EntryList-Item-Title"}>
                    {title}
                </div>
                <div className={"EntryList-Item-Detail"}>
                    {detail}
                </div>
            </li>
        );
    }
}

export default EntryListItem;
