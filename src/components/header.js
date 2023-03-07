import React from "react";
import { Basket } from "./basket";
import { Login } from "./login";

export class Header extends React.Component {
    constructor(props) {
        super(props)

        this.mobileNavRef = React.createRef()

        this.state = {
            basketDisplay: false,
            loginDisplay: false,
        }
        
        this.basketDisplayToggle = this.basketDisplayToggle.bind(this)
        this.loginDisplayToggle = this.loginDisplayToggle.bind(this)
        this.toggleMobileNavDisplay = this.toggleMobileNavDisplay.bind(this)
    }

    // Toggle whether the basket is shown or not
    basketDisplayToggle(event) {
        this.setState((state) => {
            return {
                basketDisplay: (this.state.basketDisplay === false) ? true: false,
            }
        })

        return
    }

    // Toggle the display of the login.
    loginDisplayToggle(event) {
        this.setState((state) => {
            return {
                loginDisplay: (this.state.loginDisplay === false) ? true: false,
            }
        })

        return
    }

    // Toggle whether the mobile navigation is displayed or not (mobile only).
    toggleMobileNavDisplay(event) {
        this.mobileNavRef.current.style.right = (this.mobileNavRef.current.style.right === "0px") ? "100%": "0px"

        return
    }

    render() {
        return (
            <header>
                <section className="header-section" id="top-left-header-section">

                    { /* Mobile Only Start */ }
                    <span className="material-icons mobile icons" id="mobile-nav-icon-toggle" onClick={this.toggleMobileNavDisplay}>menu</span>
                    { /* Mobile Only End */ }

                    <h1 id="logo">Outfitsora</h1>

                    { /* Desktop Only Start */ }
                    <NavLinks viewType="desktop" changeTypeFilter={this.props.changeTypeFilter} />
                    { /* Desktop Only End */ }

                </section>

                <section className="header-section" id="top-right-header-section">
                    <section id="basket-icon-section">
                        <span className="material-icons-outlined icons" id="basket-icon" onClick={this.basketDisplayToggle}>shopping_basket</span>
                        <span id="number-of-basket-items">{this.props.basket.length}</span>
                    </section>
                    <section id="profile-section">
                        <img src={ (this.props.picture === "") ? "./images/default-profile-img.jpg": this.props.picture} className="icons" id="user-profile" onClick={this.loginDisplayToggle} />
                    </section>
                </section>

                { (this.state.basketDisplay === true) ? <Basket basket={this.props.basket} removeFromBasket={this.props.removeFromBasket} loggedIn={this.props.loggedIn} />: "" }
                { (this.state.loginDisplay === true) ? <Login loggedIn={this.props.loggedIn} toggleLoggedIn={this.props.toggleLoggedIn} userEmail={this.props.userEmail} name={this.props.name} nameOnOrder={this.props.nameOnOrder} updateUserData={this.props.updateUserData} removeUserData={this.props.removeUserData} />: "" }

                { /* Mobile Only Start */ }
                <MobileNav mobileNavRef={this.mobileNavRef} toggleMobileNavDisplay={this.toggleMobileNavDisplay} changeTypeFilter={this.props.changeTypeFilter} />
                { /* Mobile Only End */ }

            </header>
        )
    }
}

const MobileNav = (props) => {
    return (
        <nav className="mobile nav" id="mobile-nav" ref={props.mobileNavRef}>
            <article className="mobile" id="mobile-nav-container">
                <section className="mobile" id="close-mobile-nav-section">
                    <span className="material-icons icons" id="close-mobile-nav-icon" onClick={(event) => {props.toggleMobileNavDisplay(event)}}>close</span>
                </section>
                <NavLinks viewType="mobile" changeTypeFilter={props.changeTypeFilter} />
            </article>
        </nav>
    )
}

const NavLinks = (props) => {
    return (
        <nav className={props.viewType + " nav"} id={props.viewType + "-nav-links"}>
            <a className={"nav-link " + props.viewType} id={props.viewType + "-nav-link"} href="#" onClick={(event) => {props.changeTypeFilter("NEW!")}}>NEW!</a>
            <a className={"nav-link " + props.viewType} id={props.viewType + "-nav-link"} href="#" onClick={(event) => {props.changeTypeFilter("Collections")}}>Collections</a>
            <a className={"nav-link " + props.viewType} id={props.viewType + "-nav-link"} href="#" onClick={(event) => {props.changeTypeFilter("Shirts")}}>Shirts</a>
            <a className={"nav-link " + props.viewType} id={props.viewType + "-nav-link"} href="#" onClick={(event) => {props.changeTypeFilter("Polo Shirts")}}>Polo Shirts</a>
            <a className={"nav-link " + props.viewType} id={props.viewType + "-nav-link"} href="#" onClick={(event) => {props.changeTypeFilter("Formal")}}>Formal</a>
        </nav>
    )
}