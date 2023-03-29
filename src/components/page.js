import React from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { deStringifyBasket, stringifyBasket } from "./helperFunctions";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export function Page() {
    const location = useLocation()

    if (location.pathname === "/") {
        return <Navigate to="/products" replace />
    }

    return <PageWrapper location={location} />
}

export class PageWrapper extends React.Component {
    constructor(props) {
        super(props)

        let basket = []

        // Retrieve permanently stored (stringified) basket and destringify. Loads up the basket so that the user can resume where they left off if on the same device.
        if (window.localStorage.getItem("outfitsora_basket") !== null) {
            basket = deStringifyBasket(window.localStorage.getItem("outfitsora_basket"))
        }

        let [name, email, picture] = ["", "", ""]

        if (window.localStorage.getItem("outfitsora_user_name") !== null) {
            name = window.localStorage.getItem("outfitsora_user_name")
            email = window.localStorage.getItem("outfitsora_user_email")
            picture = window.localStorage.getItem("outfitsora_user_picture")
        }

        this.state = {
            basket: basket,
            loggedIn: (window.localStorage.getItem("outfitsora_user_name") !== null) ? true: false,
            userEmail: email,
            name: name,
            picture: picture,
        }

        this.removeUserData = this.removeUserData.bind(this)
        this.toggleLoggedIn = this.toggleLoggedIn.bind(this)
        this.updateUserData = this.updateUserData.bind(this)
    }

    // Clear user data.
    removeUserData() {
        this.setState((state) => {
            return {
                userEmail: "",
                name: "",
                picture: "",
                startCheckout: false,
            }
        })

        window.localStorage.removeItem("outfitsora_user_name")
        window.localStorage.removeItem("outfitsora_user_email")
        window.localStorage.removeItem("outfitsora_user_picture")

        return
    }

    // Toggle whether the active user is logged in or not.
    toggleLoggedIn() {
        this.setState((state) => {
            return {
                loggedIn: (this.state.loggedIn === true) ? false: true,
            }
        })
    }

    // Update the user's data in state.
    updateUserData(email=this.state.email, name=this.state.name, picture=this.state.picture) {
        this.setState((state) => {
            return {
                userEmail: email,
                name: name,
                picture: picture,
            }
        })

        window.localStorage.setItem("outfitsora_user_name", name)
        window.localStorage.setItem("outfitsora_user_email", email)
        window.localStorage.setItem("outfitsora_user_picture", picture)
    }

    render() {
        return (
            <section>
                <Header 
                    basket={this.state.basket}
                    loggedIn={this.state.loggedIn} 
                    toggleLoggedIn={this.toggleLoggedIn}
                    userEmail={this.state.userEmail}
                    name={this.state.name}
                    picture={this.state.picture}
                    updateUserData={this.updateUserData}
                    removeUserData={this.removeUserData}
                />
                <main>
                    {<Outlet context={{name: this.state.name, userEmail: this.state.userEmail, loggedIn: this.state.loggedIn}} />}
                </main>
                <Footer changeTypeFilter={this.changeTypeFilter} />
            </section>
        )
    }
}