import React from "react";
import { nameToImageURL } from "./helperFunctions";
import { NewBanner } from "./newBanner";

export const ProductCard = (props) => {
    const IMAGE_SRC = "./images/" + nameToImageURL(props.itemData.name, "-", ".jpg")
    const NEW_BANNER = props.itemData.new === true ? <NewBanner />: ""
    const AVAILABILITY = (props.itemData.available === false) ? <OutOfStock />: ""
    const SHOW_STAR = (props.loggedIn === true) ? true: false
    let STAR = "";
    if (SHOW_STAR) {
        STAR = (props.watchlist_IDs.indexOf(props.itemData.prodID) !== -1) ? <img src="./images/star.svg" onClick={(event) => {props.removeWatchlistProduct(props.itemData.prodID)}} />: <img src="./images/star-outline.svg" onClick={(event) => {props.addWatchlistProduct(props.itemData.prodID)}} />
    }
    return (
        <section className="product-card-container">
            <a href={"./product/" + props.itemData.prodID} className="product-link">
                <img src={IMAGE_SRC} className="product-image" alt={props.itemData.name} />
            </a>
            {NEW_BANNER}
            <section className="product-name-favourites-combo-section">
                <a href={"./product/" + props.itemData.prodID} className="product-link">
                    <span className="product-name">{props.itemData.name}</span>
                </a>
                {STAR}
            </section>
            <span className="product-price">£{props.itemData.price}</span>
            {AVAILABILITY}
        </section>
    )
}

const OutOfStock = (props) => {
    return (
        <section className="out-of-stock-section">
            <span className="out-of-stock-icon material-icons">priority_high</span>
            <span className="out-of-stock-text">Out of stock</span>
        </section>
    )
}