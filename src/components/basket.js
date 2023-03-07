import React from "react"
import { v4 } from "uuid";
import { nameToImageURL } from "./helperFunctions";
import { H3Title } from "./titles";

export class Basket extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        // Create an element for each basket item.
        let basketElements = []
        this.props.basket.forEach((item) => {
            basketElements.push(<BasketItem key={v4()} prodID={item[1]} name={item[4]} quantity={item[3]} price={item[5]} size={item[2]} basketItemID={item[0]} removeFromBasket={this.props.removeFromBasket} />)
        })

        return (
            <section id="basket-container" className="popup-container">
                <H3Title id="basket-title" className="popup-title" title="Basket" />
                <hr className="popup-section-line-divider" />

                {/* If there aren't any basket elements, show the empty basket message. */}
                { (basketElements.length === 0) ? <EmptyBasket /> : basketElements }

                {/* If there aren't any basket elements, no need to show checkout button. If the user is logged out, disable the checkout button. */}
                { (basketElements.length !== 0) ? <button id="checkout-button" disabled={true} >Checkout {this.props.loggedIn === false ? " - Must login first": ""}</button>: "" }
            </section>
        )
    }
}

Basket.defaultProps = {
    loggedIn: false,
}

const EmptyBasket = (props) => {
    return (
        <section id="empty-basket-section">
            Your basket is empty.
        </section>
    )
}

const BasketItem = (props) => {
    const IMAGE_URL = "./images/" + nameToImageURL(props.name, "-", ".jpg")
    const TOTAL_ITEM_PRICE = (Number(props.price) * Number(props.quantity)).toFixed(2)
    return (
        <section className="basket-item-section">
            <input type="hidden" name="product-id" disabled value={props.prodID} />
            <img src={IMAGE_URL} className="basket-item-image" />
            <span className="basket-item-name">{props.name} {props.size}</span>
            <span className="basket-item-price">£{props.price} x {props.quantity} = <strong>£{TOTAL_ITEM_PRICE}</strong></span>
            <span className="material-icons icons remove-icon" onClick={(event) => {props.removeFromBasket(props.basketItemID)}}>delete</span>
        </section>
    )
}