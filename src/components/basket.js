import React from "react"
import { Navigate, useLocation } from "react-router-dom";
import { v4 } from "uuid";
import { nameToImageURL, deStringifyBasket, stringifyBasket } from "./helperFunctions";
import { H3Title } from "./titles";

export class MainBasket extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            refresh: false,
        }

        this.removeFromBasket = this.removeFromBasket.bind(this)
    }

    removeFromBasket(basketItemID) {
        let basket = []
        if (window.localStorage.getItem("outfitsora_basket") !== null) {
            basket = deStringifyBasket(window.localStorage.getItem("outfitsora_basket"))
        }

        for (let x = 0; x < basket.length; x++) {
            if (basket[x][0] === basketItemID) {
                basket.splice(x, 1)
                this.setState((state) => {
                    return {refresh: true}
                })
            }
        }

        // Permanently store stringified basket on device so that if user returns they can leave where they left off. If the basket is empty, remove the permanent storage altogether.
        if (basket.length === 0) {
            window.localStorage.removeItem("outfitsora_basket")
        }
        else {
            window.localStorage.setItem("outfitsora_basket", stringifyBasket(basket))
        }

        return
    }

    render() {
        if (this.state.refresh) {
            return window.location.reload()
        }

        // Create an element for each basket item.
        let basketElements = []
        let totalPrice = 0;

        // Retrieve permanently stored (stringified) basket and destringify. Loads up the basket so that the user can resume where they left off if on the same device.
        if (window.localStorage.getItem("outfitsora_basket") !== null) {
            let basket = deStringifyBasket(window.localStorage.getItem("outfitsora_basket"))
            basket.forEach((item) => {
                basketElements.push(<MainBasketItem key={v4()} prodID={item[1]} name={item[4]} quantity={item[3]} price={item[5]} size={item[2]} basketItemID={item[0]} removeFromBasket={this.removeFromBasket} />)
                totalPrice += Number(item[5])
            })
        }

        totalPrice = Number(Number(totalPrice * 100).toFixed(0) / 100)

        return (
            <section id="main-basket-container">
                <H3Title id="basket-title" className="popup-title" title="Basket" />
                { (basketElements.length === 0) ? <EmptyBasket /> : basketElements }

                <p>Total Price: £{totalPrice}</p>
            </section>
        )
    }
}

const MainBasketItem = (props) => {
    const IMAGE_URL = "./images/" + nameToImageURL(props.name, "-", ".jpg")
    const TOTAL_ITEM_PRICE = Number(((Number(props.price) * Number(props.quantity)) * 100).toFixed(0)) / 100
    return (
        <section className="main-basket-item-section">
            <input type="hidden" name="product-id" disabled value={props.prodID} />
            <img src={IMAGE_URL} className="main-basket-item-image" />
            <section className="main-basket-item-data-container">
                <span className="main-basket-item-name">{props.name}</span>
                <span className="main-basket-item-size">{props.size}</span>
                <span className="main-basket-item-price">£{props.price} x {props.quantity} = <strong>£{TOTAL_ITEM_PRICE}</strong></span>
                <span className="material-icons icons remove-icon" onClick={(event) => {props.removeFromBasket(props.basketItemID)}}>delete</span>
            </section>
        </section>
    )
}


export function HeaderBasket(props) {
    const location = useLocation()
    return <HeaderBasketWrapper location={location} basket={props.basket} />
}


export class HeaderBasketWrapper extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            viewMainBasket: false,
        }

        this.loadMainBasket = this.loadMainBasket.bind(this)
        this.removeFromBasket = this.removeFromBasket.bind(this)
    }

    loadMainBasket() {
        this.setState((state) => {
            return {viewMainBasket: true}
        })
    }

    removeFromBasket(basketItemID) {
        let basket = []
        if (window.localStorage.getItem("outfitsora_basket") !== null) {
            basket = deStringifyBasket(window.localStorage.getItem("outfitsora_basket"))
        }

        for (let x = 0; x < basket.length; x++) {
            if (basket[x][0] === basketItemID) {
                basket.splice(x, 1)
                this.setState((state) => {
                    return {refresh: true}
                })
            }
        }

        if (basket.length === 0) {
            window.localStorage.removeItem("outfitsora_basket")
        }
        else {
            window.localStorage.setItem("outfitsora_basket", stringifyBasket(basket))
        }

        return window.location.reload()
    }

    render() {
        if (this.state.viewMainBasket) {
            this.setState((state) => {
                return {viewMainBasket: false}
            })
            return <Navigate to="/basket" replace />
        }

        // Create an element for each basket item.
        let basketElements = []
        this.props.basket.forEach((item) => {
            basketElements.push(<HeaderBasketItem key={v4()} prodID={item[1]} name={item[4]} quantity={item[3]} price={item[5]} size={item[2]} basketItemID={item[0]} removeFromBasket={this.removeFromBasket} />)
        })

        return (
            <section id="header-basket-container" className="popup-container">
                <H3Title id="header-basket-title" className="popup-title" title="Basket" />
                <hr className="popup-section-line-divider" />

                {
                // If there aren't any items in the basket, show the user an empty basket message.
                }
                { (basketElements.length === 0) ? <EmptyBasket /> : basketElements }
                { (basketElements.length !== 0) ? <button id="view-basket-button" onClick={(event) => {this.loadMainBasket()}}>View Basket</button>: ""}
            </section>
        )
    }
}


const HeaderBasketItem = (props) => {
    const IMAGE_URL = "./images/" + nameToImageURL(props.name, "-", ".jpg")
    const TOTAL_ITEM_PRICE = Number(((Number(props.price) * Number(props.quantity)) * 100).toFixed(0)) / 100
    return (
        <section className="header-basket-item-section">
            <input type="hidden" name="product-id" disabled value={props.prodID} />
            <img src={IMAGE_URL} className="header-basket-item-image" />
            <span className="header-basket-item-name">{props.name} {props.size}</span>
            <span className="header-basket-item-price">£{props.price} x {props.quantity} = <strong>£{TOTAL_ITEM_PRICE}</strong></span>
            <span className="material-icons icons remove-icon" onClick={(event) => {props.removeFromBasket(props.basketItemID)}}>delete</span>
        </section>
    )
}

const EmptyBasket = (props) => {
    return (
        <section id="empty-basket-section">
            Your basket is empty.
        </section>
    )
}