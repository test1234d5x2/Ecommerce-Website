import React from "react";
import { ProductCard } from "./productCard";
import jwt_encode from "jwt-encode";
import { H2Title } from "./titles";
import { v4 } from "uuid";

export default class Watchlist extends React.Component {
    constructor(props) {
        super(props)

        let loggedIn = false
        let userEmail = ""
        if (window.localStorage.getItem("outfitsora_user_name") !== null) {
            loggedIn = true
            userEmail = window.localStorage.getItem("outfitsora_user_email")
        }

        this.state = {
            loggedIn: loggedIn,
            userEmail: userEmail,
            products: [],
            refresh: false,
        }

        this.removeWatchlistProduct = this.removeWatchlistProduct.bind(this)
        this.updateStateValue = this.updateStateValue.bind(this)
    }

    componentDidMount() {
        // Get the watchlist of the user if logged in
        if (this.state.loggedIn) {
            fetch("https://moselsh.eu.pythonanywhere.com/api/watchlist/" + jwt_encode({"email": this.state.userEmail}, process.env.REACT_APP_JWT_SECRET) + "/get").then((response) => {return response.json()}).then((data) => {
                let watchlist_item = []
                data.forEach((watchlist_product) => {watchlist_item.push(watchlist_product[0])})
                this.updateStateValue("products", watchlist_item)
            })
        }

        return
    }

    removeWatchlistProduct(prodID) {
        let token = jwt_encode({"email": this.state.userEmail, "prodID": prodID, "process": "remove"}, process.env.REACT_APP_JWT_SECRET)
        fetch("https://moselsh.eu.pythonanywhere.com/api/watchlist/" + token).then((response) => {return response.json()}).then((data) => {
            this.setState((state) => {return {refresh: true}})
        })
        
        return;
    }

    updateStateValue(index, value) {
        let obj = {}
        obj[index] = value
        this.setState((state) => {
            return obj
        })

        return
    }

    render() {

        if (this.state.refresh) {
            return window.location.reload()
        }

        let productList = []
        for (let x = 0; x < this.state.products.length; x++) {
            productList.push(<ProductCard key={v4()} itemData={this.state.products[x]} loggedIn={this.state.loggedIn} watchlist_IDs={this.state.products[x].prodID} removeWatchlistProduct={this.removeWatchlistProduct} />)
        }

        if (this.state.loggedIn) {
            return (
                <section id="products-list-information">
                    <H2Title id="product-list-title" title={"Shop for Clothes: My Watchlist"} />
                    <section id="products-list-section-container">
                        <section id="products-list-section">
                            <section id="products-list-metadata">
                                <section id="products-list-length-container">
                                    <span id="products-list-length">{this.state.products.length} {this.state.products.length === 1 ? "item": "items"} found</span>
                                </section>
                            </section>
                            <section id="products-section">
                                { (productList.length === 0) ? (<section id="no-products-found">No Products Found.</section>): productList}
                            </section>
                        </section>
                    </section>
                </section>
            )
        }
        return (<section id="no-products-found">You are not logged in. Please login to view your watchlist.</section>)
    }
}