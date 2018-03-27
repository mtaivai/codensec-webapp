import React, {Component} from 'react';
import PropTypes from 'prop-types';
import LoremIpsum from "./components/LoremIpsum";
import NavBar from "./components/nav/NavBar";
import NavLink from "./components/nav/NavLink";
import {BrowserRouter as Router} from "react-router-dom";
import NavBarBrand from "./components/nav/NavBarBrand";
import Nav from "./components/nav/Nav";
import NavBarCollapse from "./components/nav/NavBarCollapse";

import './sticky-footer-navbar.css';


class SidebarLayout extends Component {
    render() {
        // https://getbootstrap.com/docs/4.0/examples/sticky-footer-navbar/
        return (
            <div className={"SidebarLayout"}>
                <header className={"Header"}>
                    <Router>
                        <NavBar additionalClassName={"navbar-expand-md navbar-dark fixed-top bg-dark"}>
                            <NavBarBrand>Codensec</NavBarBrand>
                            <Nav>
                                <NavLink to={"/jotain"}>Jotain</NavLink>
                            </Nav>
                            <NavBarCollapse>
                                <Nav>
                                    <NavLink to={"/ihan"}>Ihan</NavLink>
                                    <NavLink to={"/muuta"}>Muuta</NavLink>
                                </Nav>
                            </NavBarCollapse>
                        </NavBar>
                    </Router>

                </header>

                {/*
                <div className={"Main-Container-Wrapper container-fluid"}>
                    <div className={"Main-Container row"}>
                        <div className={"col-sm-3 col-md-2 d-none d-sm-block bg-light sidebar"}>
                            <h3>Sidebar</h3>
                            <LoremIpsum paragraphs={10} words={5}/>
                        </div>
                        <main role={"main"} className={"Main col-sm-9 ml-sm-auto col-md-10 pt-3"}>
                            <h3>Main</h3>
                            <LoremIpsum paragraphs={10} />
                        </main>
                    </div>
                </div>
                */}
                <main role={"main"} className={"container"}>
                    <h1>Main</h1>
                    <LoremIpsum paragraphs={1} />
                </main>
                <footer className={"footer"}>
                    Footer
                </footer>
            </div>
        );
    }
}

SidebarLayout.propTypes = {};
SidebarLayout.defaultProps = {};

export default SidebarLayout;
