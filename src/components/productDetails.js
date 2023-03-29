import React from "react";
import { nameToImageURL, clothesType, listValueToSelectOption, capitaliseFirstLetter, deStringifyBasket, stringifyBasket } from "./helperFunctions";
import { H2Title, H3Title } from "./titles";
import { ErrorMessage } from "./errorMessage";
import { NewBanner } from "./newBanner";
import { useParams } from "react-router-dom";

const BASE_PRODUCT_DETAILS_API_URL = "https://moselsh.eu.pythonanywhere.com/api/product/"

export function ProductDetails(props) {
    let params = useParams()
    return (<ProductDetailsWrapper prodID={params.prodID} />)
}

class ProductDetailsWrapper extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            productData: [],
            quantity: 1,
            size: "Unavailable Sizes",
            sizeRange: [],
            errorMessage: "",
            errorMessageDisplay: false,
        }

        this.addToBasket = this.addToBasket.bind(this)
        this.toggleErrorMessageBox = this.toggleErrorMessageBox.bind(this)
        this.updateStateValue = this.updateStateValue.bind(this)
        this.updateOptionsChosen = this.updateOptionsChosen.bind(this)
    }

    addToBasket(basketItemID, prodID, size, quantity, name, price) {
        let basket = []

        if (window.localStorage.getItem("outfitsora_basket") !== null) {
            basket = deStringifyBasket(window.localStorage.getItem("outfitsora_basket"))
        }

        let found = false
        for (let x = 0; x < basket.length; x++) {
            if (basket[x][0] === basketItemID) {
                basket[x] = [basketItemID, prodID, size, quantity, name, price]
                found= true
            }
        }

        if (!found) {
            basket.push([basketItemID, prodID, size, quantity, name, price])
        }

        // Permanently store stringified basket on device so that if user returns they can leave where they left off.
        window.localStorage.setItem("outfitsora_basket", stringifyBasket(basket))
        window.location.reload()

        return
    }

    componentDidMount() {
        fetch(BASE_PRODUCT_DETAILS_API_URL + String(this.props.prodID)).then((response) => {return response.json()}).then((data) => {
            this.updateStateValue("productData", data)

            let sizeRange = ["Unavailable Sizes"]
            if (clothesType(data[0].name) === "Trousers") {
                sizeRange = [
                    "28", "30", "32", "34", "36", "38", "40", "42",
                ]
            }
            else if (clothesType(data[0].name) === "Shirt") {
                sizeRange = [
                    "XS", "S", "M", "L", "XL", "XXL",
                ]
            }
            else if (clothesType(data[0].name) === "Blazer") {
                sizeRange = [
                    "40S", "40R", "40L", "42S", "42R", "42L", "44S", "44R", "44L", "46S", "46R", "46L", "48R", "48L", "50R", "50L",
                ]
            }

            this.updateStateValue("sizeRange", sizeRange)
            this.updateStateValue("size", sizeRange[0])
        })

        return
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

    updateStateValue(index, value) {
        let obj = {}
        obj[index] = value
        this.setState((state) => {
            return obj
        })

        return
    }

    render() {
        const SIZE_RANGE = listValueToSelectOption(this.state.sizeRange)
        const QUANTITY_RANGE = listValueToSelectOption([1,2,3,4,5,6,7,8,9,10])
        
        if (this.state.productData.length === 0) {
            return <section>Loading ...</section>
        }

        return (
            <section id="product-details-container">
                <section id="full-product-info-container">
                    <LargeImage src={ "./images/" + nameToImageURL(this.state.productData[0].name, "-", ".jpg")} />
                    <section id="full-product-info-section">
                        {this.state.productData[0].new === true ? <NewBanner />: ""}
                        <H2Title id="product-name" title={this.state.productData[0].name} />
                        <span id="product-description">{this.state.productData[0].description}</span>
                        <H3Title id="product-price" title={"£" + this.state.productData[0].price} />
                        <ProductOptions optionName="size" range={SIZE_RANGE} updateOptionsChosen={this.updateOptionsChosen} />
                        <ProductOptions optionName="quantity" range={QUANTITY_RANGE} updateOptionsChosen={this.updateOptionsChosen} />
                        <button id="basket-button" onClick={(event) => {this.addToBasket(this.state.productData[0].prodID + "_" + this.state.size, this.state.productData[0].prodID, this.state.size, this.state.quantity, this.state.productData[0].name, this.state.productData[0].price)}}>
                            Add to basket
                        </button>
                    </section>
                </section>
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