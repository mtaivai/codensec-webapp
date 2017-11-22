import React from 'react';

import EntryController from './EntryController';
import EntryList from './EntryList'
import EntryDetailContainer from './EntryDetailContainer';
import strings from './strings';

import logo from './logo.svg';
import './App.css';
import './MDLayout.css';


const Header = () => {
    return (
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">{strings.get('welcome_message')}</h1>
        </header>
    );
};

const Footer = () => {
    return (
        <footer></footer>
    );
};




class App extends React.Component {

    render() {
        console.log("App.render()");

        const entryController = new EntryController();


        return (
            <div className="App">
                <Header/>
                <p className="App-intro">
                    {/*This will remain on background of the MDLayout area!*/}
                </p>
                <div className="container-fluid MDLayout">
                    <div className="row MDLayout-MD-Wrapper">
                        <div className="col-md-4 MDLayout-M">
                            {/*
                            <div className={"btn-group"}>
                                <button className={"btn"} onClick={() => {this.forceUpdate()}}>Refresh</button>
                            </div>
                            */}

                            <EntryList controller={entryController}/>

                            <div className={"btn-toolbar"}>
                                <div className={"btn-group btn-group-sm"} role={"group"}>
                                    <button className={"btn btn-secondary"} onClick={(e) => { entryController.addItem() }}>+</button>
                                    <button className={"btn btn-secondary"} disabled={true} onClick={(e) => { entryController.addItem() }}>-</button>
                                    <button className={"btn btn-secondary"} disabled={true} onClick={(e) => { entryController.addItem() }}>...</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8 MDLayout-D">
                            <EntryDetailContainer controller={entryController}/>
                        </div>
                    </div>
                </div>
                <Footer/>

            </div>
        );
    }
}

export default App;
