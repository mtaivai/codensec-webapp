import React from 'react';
import PropTypes from 'prop-types';

import {BrowserRouter as Router, Route} from "react-router-dom";

// import EntryController from './EntryController';
import EntriesPage from './EntriesPage';

import strings from './strings';

import logo from './logo.svg';
import './App.css';
import './MDLayout.css';
import MockEntryRepository from "./repository/MockEntryRepository";
import NavBar from "./components/nav/NavBar";
import NavBarBrand from "./components/nav/NavBarBrand";
import Nav from "./components/nav/Nav";
import NavLink from "./components/nav/NavLink";
import NavBarCollapse from "./components/nav/NavBarCollapse";

// import './sticky-footer-navbar.css';
import LoremIpsum from "./components/LoremIpsum";

import {Archipelago, Island} from "./Portal";
import './Header.css';
import './Footer.css';
// import './sticky-footer.css';

class Header extends React.Component {

    constructor(props) {
        super(props);
    }
    // return (
    //     <header className="App-header">
    //         <img src={logo} className="App-logo" alt="logo" />
    //         <h1 className="App-title">{strings.get('welcome_message')}</h1>
    //     </header>
    // );


    render() {
        return (
            <header ref={(el) => this.headerElement = el } className={"header"} {...this.props}>
                <NavBar additionalClassName={"navbar-expand-md"}>
                    <NavBarBrand>Codensec</NavBarBrand>
                    <Nav>
                        <NavLink to={"/"}>Items</NavLink>
                    </Nav>
                    <NavBarCollapse>
                        <Nav>
                            <NavLink to={"/scrollingcolumns"}>Skrollaavat</NavLink>
                            <NavLink to={"/stickyfooter"}>Tahmea alatunniste</NavLink>
                        </Nav>
                    </NavBarCollapse>

                    <p>Input tähän</p>
                </NavBar>

            </header>
        );
    }
}

class Footer extends React.Component {
    render()
    {
        return (
            <footer ref={el => this.footerElement = el} className={"footer"}>
                Footer
            </footer>
        );
    }
};


const StickyFooterPage = () => {
    return (
        <div>
            <LoremIpsum />

        </div>
    );
};

const ScrollingColumnsPage = () => {
    return (
        <div className={"container"} >
            <div className={"row"} style={{position: "absolute", left: 0, right: 0, top: 60, bottom: 24, overflow: "hidden"}}>
                <div className={"col d-none d-sm-block"} style={{overflow: "scroll"}}>
                    <h1>Column 1</h1>
                    <LoremIpsum paragraphs={10}/>
                </div>
                <div className={"col"} style={{overflow: "scroll"}}>
                    <h1>Column 2</h1>
                    <LoremIpsum paragraphs={10}/>
                </div>
            </div>

        </div>
    );
};


const getViewportHeight = () => {
    if(typeof(window.innerHeight) !== "undefined") {
        return window.innerHeight;
    } else {
        return document.documentElement.clientHeight;
    }
};

class App extends React.Component {

    constructor(props) {
        super(props);

        this.handleScroll = this.handleScroll.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    componentWillMount() {
        console.log("App.componentWillMount");
        this.repository = new MockEntryRepository();



        document.body.classList.add("XXXfixed-header", "XXXfixed-footer", "fixed-sidebar");
        window.addEventListener('scroll', this.handleScroll);
        window.addEventListener('resize', this.handleResize);

        this.layoutAdjustTimer = setInterval(() => {
            if (this.isFixedSidebar()) {
                if (this.footer && this.footer.footerElement) {
                    const rect = this.footer.footerElement.getBoundingClientRect();
                    if (rect) {
                        const viewportHeight = getViewportHeight();
                        let needUpdate = false;

                        if (rect.top < viewportHeight) {
                            if (!this._footerVisible) {
                                this._footerVisible = true;
                                needUpdate = true;
                            }
                        } else {
                            if (this._footerVisible) {
                                this._footerVisible = false;
                                needUpdate = true;
                            }
                        }
                        if (needUpdate) {
                            this.updateFixedSidebarLayout({updatePosition: false});
                        }
                    }
                }
            }


        }, 200);
    }

    componentDidMount() {
        console.log("App.componentDidMount");

        this.updateFixedSidebarLayout();
    }

    componentWillUnmount() {
        console.log("App.componentWillUnmount");
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        if (this.layoutAdjustTimer) {
            clearInterval(this.layoutAdjustTimer);
            this.layoutAdjustTimer = undefined;
        }
    }

    handleScroll(e) {
        let scrollTop = document.documentElement.scrollTop;
        if (!scrollTop) {
            // Safari uses body for overflow elem
            scrollTop = document.body.scrollTop;
        }
        this.updateFixedSidebarLayout();
    }

    handleResize(e) {
        this.updateFixedSidebarLayout();
    }

    isFixedSidebar() {
        return document.body.classList.contains("fixed-sidebar");
    }
    isFixedHeader() {
        return document.body.classList.contains("fixed-header");
    }

    updateFixedSidebarLayout({sidebarElements, updatePosition = true, updateHeight = true, ...args} = {}) {


        // Find fixed sidebar elements
        if (this.isFixedSidebar()) {

            if (typeof(sidebarElements) === "undefined") {
                sidebarElements = document.getElementsByClassName("sidebar");
            }

            if (sidebarElements.length) {

                let headerBottom = 0;


                let viewportHeight = getViewportHeight();

                let innerHeight = viewportHeight;

                const style = {
                    border: "1px solid red"
                };



                if (updatePosition || updateHeight) {
                    if (this.isFixedHeader()) {
                        headerBottom = 0;
                    } else {
                        if (this.header && this.header.headerElement) {
                            const rect = this.header.headerElement.getBoundingClientRect();
                            if (rect) {
                                headerBottom = rect.bottom;
                                if (headerBottom < 0) {
                                    headerBottom = 0;
                                }
                            }
                        }
                    }
                    innerHeight -= headerBottom;
                    if (updatePosition) {
                        style.top = headerBottom + "px";
                    }
                }

                if (updateHeight) {
                    let footerTop = 0;
                    if (this.footer && this.footer.footerElement) {
                        const rect = this.footer.footerElement.getBoundingClientRect();
                        if (rect) {
                            if (rect.top < viewportHeight) {
                                innerHeight -= (viewportHeight - rect.top);
                            }
                        }
                    } else {

                    }

                    style.height = innerHeight + "px";
                }
                // console.log("VPH: " + viewportHeight);
                // console.log("D", document.body.getBoundingClientRect());
                // console.log("H", this.header.headerElement.getBoundingClientRect());
                // console.log("F", this.footer.footerElement.getBoundingClientRect());



                Array.prototype.forEach.call(sidebarElements, (el) => {

                    for (let styleAttr in style) {
                        if (style.hasOwnProperty(styleAttr)) {
                            el.style[styleAttr] = style[styleAttr];
                        }
                    }
                });
            }
        }
    }


    render() {
        console.log("App.render()");

        // const entryController = new EntryController();

        // ref={(el) => {contextHeaderElement = el}}
        let contextHeaderElement;
        return (
            <Router>
                <div className={"App"}>
                    <Header ref={(header) => { this.header = header } }/>
                    <Archipelago>
                        <main role={"main"} className={"main container-fluid"}>

                            <div className={"context-header"}>
                                <Island name={"contextToolbar"} className={"ContextToolbar"}/>
                            </div>

                            <Route exact path={"/"} render={() => <EntriesPage repository={this.repository}/>}/>
                            <Route exact path={"/stickyfooter"} component={StickyFooterPage}/>
                            <Route exact path={"/scrollingcolumns"} component={ScrollingColumnsPage}/>

                            <div className={"context-footer"}>Context footer</div>
                        </main>
                    </Archipelago>
                    <Footer ref={(footer) => { this.footer = footer } }/>
                </div>
            </Router>
        );

        return (
            <div className="App">
                <Header/>
                <p className="App-intro">
                    {/*This will remain on background of the MDLayout area!*/}
                </p>

                <EntriesPage repository={this.repository}/>
                <Footer/>

            </div>
        );
    }
}

export default App;
