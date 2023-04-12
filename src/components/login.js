import React from "react";
import { H3Title } from "./titles";
import { ErrorMessage } from "./errorMessage";
import { GoogleLogin, GoogleOAuthProvider, googleLogout } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import jwt_encode from "jwt-encode"

// GoogleOAuth returns JWT if successful so we need to decode it using jwt-decode.

export class Login extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            "errorMessageDisplay": false,
            "errorMessage": "",
        }

        this.onFailure = this.onFailure.bind(this)
        this.onLogout = this.onLogout.bind(this)
        this.onSuccess = this.onSuccess.bind(this)
        this.toggleErrorMessageDisplay = this.toggleErrorMessageDisplay.bind(this)
    }

    // Google login failure function.
    onFailure() {
        this.toggleErrorMessageDisplay()
        this.setState((state) => {
            return {
                errorMessage: "Login Failed. Please try again."
            }
        })

        return
    }

    // Google logout function. Removes all user data.
    onLogout() {
        googleLogout()
        this.props.toggleLoggedIn()
        this.props.removeUserData()

        window.location.reload()

        return
    }

    // After a successful Google login. Save user data to be used on the order.
    onSuccess(credentialResponse) {
        let userData = jwt_decode(credentialResponse.credential)
        this.props.toggleLoggedIn()
        this.props.updateUserData(userData.email, userData.name, userData.picture)

        let token = jwt_encode({"name": userData.name, "email": userData.email}, process.env.REACT_APP_JWT_SECRET)
        fetch("https://moselsh.eu.pythonanywhere.com/customers/" + process.env.REACT_APP_CUSTOMER_MODEL_URL_ACCESS + "/" + token)

        window.location.reload()

        return
    }

    toggleErrorMessageDisplay(event="") {
        this.setState((state) => {
            return {
                errorMessageDisplay: (this.state.errorMessageDisplay === true) ? false: true,
            }
        })

        return
    }

    render() {
        const GOOGLE_LOGIN_AREA = 
        <section id="google-login-area">
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                <GoogleLogin
                    onSuccess={this.onSuccess}
                    onError={this.onFailure}
                    text="continue_with"
                    theme="filled_blue"
                />
            </GoogleOAuthProvider>
        </section>

        const USER_DETAILS_SECTION = 
        <section id="user-details">
            <section id="edit-name-on-order-section">
                <span id="name-on-order-text">Name on order:</span>
                <section id="name-on-order-input-section">
                    <span id="name-on-order">{this.props.name}</span>
                </section>
            </section>
            <span id="user-email">Email: {this.props.userEmail}</span>
            <button id="logout-google-button" onClick={(event) => {this.onLogout()}}>Log Out</button>
        </section>

        return (
            <section id="login-container" className="popup-container">
                <H3Title id="login-title" className="popup-title" title={ (this.props.loggedIn === false) ? "You are currently logged out." : "Hello " + this.props.name} />
                <hr className="popup-section-line-divider" />
                {(this.props.loggedIn === false) ? <span id="guest-text">Please sign in to purchase your order.</span>: ""}
                {(this.props.loggedIn === false) ? GOOGLE_LOGIN_AREA : USER_DETAILS_SECTION}
                {(this.state.errorMessageDisplay === true) ? <ErrorMessage message={this.state.errorMessage} toggleErrorMessageBox={this.toggleErrorMessageDisplay} />: ""}
            </section>
        )
    }
}