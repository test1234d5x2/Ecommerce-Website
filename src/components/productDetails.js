import React from "react";
import { nameToImageURL, clothesType, listValueToSelectOption, capitaliseFirstLetter } from "./helperFunctions";
import { H2Title, H3Title } from "./titles";
import { ErrorMessage } from "./errorMessage";
import { NewBanner } from "./newBanner";

export class ProductDetails extends React.Component {
    constructor(props) {
        super(props)

        // Work out the correct size range for the type of clothes that the user has selected.
        let sizeRange = ["unavailable Sizes"]

        if (clothesType(this.props.fullProductData[0].name) === "Trousers") {
            sizeRange = [
                "28", "30", "32", "34", "36", "38", "40", "42",
            ]
        }
        else if (clothesType(this.props.fullProductData[0].name) === "Shirt") {
            sizeRange = [
                "XS", "S", "M", "L", "XL", "XXL",
            ]
        }
        else if (clothesType(this.props.fullProductData[0].name) === "Blazer") {
            sizeRange = [
                "40S", "40R", "40L", "42S", "42R", "42L", "44S", "44R", "44L", "46S", "46R", "46L", "48R", "48L", "50R", "50L",
            ]
        }

        this.state = {
            quantity: 1,
            size: sizeRange[0],
            sizeRange: sizeRange,
            errorMessage: "",
            errorMessageDisplay: false,
        }

        this.toggleErrorMessageBox = this.toggleErrorMessageBox.bind(this)
        this.updateOptionsChosen = this.updateOptionsChosen.bind(this)
        this.prepForAddBasket = this.prepForAddBasket.bind(this)
    }

    // Toggle the display of the error message box for price errors.
    toggleErrorMessageBox(event) {
        this.setState((state) => {
            return {
                "errorMessageDisplay": (this.state.errorMessageDisplay === true) ? false: true
            }
        })

        return
    }

    // Updates size or quantity (depending on what's chosen) using the name of the select HTML tag and its chosen value.
    updateOptionsChosen(event) {
        const INDEX_NAME = event.target.name
        let updateStateValue = {}
        updateStateValue[INDEX_NAME] = event.target.value
        this.setState((state) => {
            return updateStateValue
        })

        return
    }

    // Prevents the form being submitted to nowhere and adds to the page basket (method found in page.js)
    prepForAddBasket(event) {
        event.preventDefault()
        this.props.addToBasket(this.props.fullProductData[0].prodID + "_" + this.state.size, this.props.fullProductData[0].prodID, this.state.size, this.state.quantity, this.props.fullProductData[0].name, this.props.fullProductData[0].price)

        return
    }

    render() {
        const SIZE_RANGE = listValueToSelectOption(this.state.sizeRange)
        const QUANTITY_RANGE = listValueToSelectOption([1,2,3,4,5,6,7,8,9,10])

        return (
            <section id="product-details-container">
                <section id="return-back-container">
                    <section id="back-button-container" onClick={(event) => {this.props.removeFullProductInformation()}}>
                        <span className="material-icons" id="back-icon">arrow_back</span>
                        <span id="back-text">Return</span>
                    </section>
                </section>
                <form id="full-product-info-container">
                    <LargeImage src={ "./images/" + nameToImageURL(this.props.fullProductData[0].name, "-", ".jpg")} />
                    <section id="full-product-info-section">
                        {this.props.fullProductData[0].new === true ? <NewBanner />: ""}
                        <H2Title id="product-name" title={this.props.fullProductData[0].name} />
                        <span id="product-description">{this.props.fullProductData[0].description}</span>
                        <H3Title id="product-price" title={"£" + this.props.fullProductData[0].price} />
                        <ProductOptions optionName="size" range={SIZE_RANGE} updateOptionsChosen={this.updateOptionsChosen} />
                        <ProductOptions optionName="quantity" range={QUANTITY_RANGE} updateOptionsChosen={this.updateOptionsChosen} />
                        <button id="basket-button" onClick={(event) => {this.prepForAddBasket(event)}}>
                            Add to basket
                        </button>
                    </section>
                </form>
                { this.state.errorMessageDisplay === true ? <ErrorMessage toggleErrorMessageBox={this.toggleErrorMessageBox} message={this.state.errorMessage} />: "" }
            </section>
        )
    }
}

const LargeImage = (props) => {
    return (
        <section id="product-image-large-container">
            <img src={props.src} id="product-image-large" alt="Product Image" />
        </section>
    )
}

LargeImage.defaultProps = {
    src: "",
}

const ProductOptions = (props) => {
    return (
        <section id={props.optionName + "-container"} className="range-container">
            <span id={props.optionName + "-text"} className="range-text">{capitaliseFirstLetter(props.optionName)}:</span>
            <select id={"product-" + props.optionName} name={props.optionName} className="range-selection" onChange={props.updateOptionsChosen}>
                {props.range}
            </select>
        </section>
    )
}

ProductOptions.defaultProps = {
    optionName: "",
    range: [<option selected>Unavailable</option>],
}