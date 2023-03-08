import React from "react";
import { Header } from "./header";
import { ProductList } from "./productList";
import { ProductDetails } from "./productDetails";
import { Footer } from "./footer";
import { isPositiveDecimalNumber, createURLFilter, stringifyBasket, deStringifyBasket, capitaliseFirstLetter } from "./helperFunctions";
import { ErrorMessage } from "./errorMessage";

export class Page extends React.Component {
    constructor(props) {
        super(props)

        let basket = []

        // Retrieve permanently stored (stringified) basket and destringify. Loads up the basket so that the user can resume where they left off if on the same device.
        if (window.localStorage.getItem("outfitsora_basket") !== null) {
            basket = deStringifyBasket(window.localStorage.getItem("outfitsora_basket"))
        }

        this.TYPE_FILTER_PAIRING = {
            "NEW!": "new=Yes",
            "Collections": "",
            "Shirts": "type=Shirts",
            "Polo Shirts": "type=Polo Shirts",
            "Formal": "type=Formal",
        }
        this.SORT_BY_OPTIONS = {
            "Relevance": "/asc/prodID",
            "Price: Low - High": "/asc/price",
            "Price: High - Low": "/desc/price",
        }
        this.BASE_API_URL = "https://moselsh.eu.pythonanywhere.com/api/products"
        this.ORIGINAL_API_URL = this.BASE_API_URL + this.SORT_BY_OPTIONS['Relevance']

        this.state = {
            apiURL: this.ORIGINAL_API_URL,
            products: [],
            allColourFilters: [],
            selectedPriceFilter: [],
            selectedColourFilter: [],
            selectedAvailableFilter: [],
            basket: basket,
            fullProductData: [],
            typeFilter: "",
            clothesType: "",
            errorMessageDisplay: false,
            errorMessage: "",
            loggedIn: false,
            userEmail: "",
            name: "",
            nameOnOrder: "",
            picture: "",
        }

        this.addToBasket = this.addToBasket.bind(this)
        this.fetchAPIdata = this.fetchAPIdata.bind(this)
        this.changeSortOption = this.changeSortOption.bind(this)
        this.changeTypeFilter = this.changeTypeFilter.bind(this)
        this.removeFromBasket = this.removeFromBasket.bind(this)
        this.removeFullProductInformation = this.removeFullProductInformation.bind(this)
        this.removePriceFilters = this.removePriceFilters.bind(this)
        this.removeUserData = this.removeUserData.bind(this)
        this.updateStateValueWithAPIdata = this.updateStateValueWithAPIdata.bind(this)
        this.submitPriceFilterValues = this.submitPriceFilterValues.bind(this)
        this.toggleCheckBoxFilterValues = this.toggleCheckBoxFilterValues.bind(this)
        this.toggleErrorMessageBox = this.toggleErrorMessageBox.bind(this)
        this.toggleLoggedIn = this.toggleLoggedIn.bind(this)
        this.updateUserData = this.updateUserData.bind(this)
    }

    // Adds selected item and options to the basket. See "../../Development Info/basketItemID.txt" for how it is generated and used.
    addToBasket(basketItemID, prodID, size, quantity, name, price) {
        let basket = [...this.state.basket]
        let found = false
        for (let x = 0; x < this.state.basket.length; x++) {
            if (this.state.basket[x][0] === basketItemID) {
                basket[x] = [basketItemID, prodID, size, quantity, name, price]
                found= true
            }
        }

        if (!found) {
            basket.push([basketItemID, prodID, size, quantity, name, price])
        }

        this.setState((state) => {
            return {
                basket: basket,
            }
        })

        // Permanently store stringified basket on device so that if user returns they can leave where they left off.
        window.localStorage.setItem("outfitsora_basket", stringifyBasket(basket))

        return
    }

    // Chnages the sort option and then retrieves products in a different order.
    changeSortOption(event) {
        const NEW_API_URL = this.BASE_API_URL + this.SORT_BY_OPTIONS[event.target.value]
        this.setState((state) => {
            return {
                apiURL: NEW_API_URL,
                chosenSortOption: event.target.value,
            }
        })

        this.fetchAPIdata(NEW_API_URL, this.state.selectedPriceFilter, this.state.selectedColourFilter, this.state.selectedAvailableFilter, this.state.typeFilter, "products")

        return
    }

    // Changes the clothes type the user wants to see.
    changeTypeFilter(newType) {
        
        // Make sure that user is not on the checkout page. If so, remove it from display.
        if (this.state.startCheckout === true) {
            this.toggleStartCheckout()
        }

        this.setState((state) => {
            return {
                typeFilter: this.TYPE_FILTER_PAIRING[newType],
                clothesType: newType,
                fullProductData: [],
            }
        })

        this.fetchAPIdata(this.state.apiURL, this.state.selectedPriceFilter, this.state.selectedColourFilter, this.state.selectedAvailableFilter, this.TYPE_FILTER_PAIRING[newType], "products")

        return
    }

    // Upon mounting, display the first set of data (all the products in one set) for initial filling.
    componentDidMount() {

        // Setup the colour filters so they don't have to change each time.
        fetch(this.state.apiURL).then((response) => {return response.json()}).then((data) => {
            let allColourFilters = []
            data.forEach((item) => {
                return (allColourFilters.indexOf(item['colour']) < 0) ? allColourFilters.push(item['colour']): ""
            })
            this.state.allColourFilters = allColourFilters.map((colour) => {return <CheckBox toggleCheckBoxFilterValues={this.toggleCheckBoxFilterValues} inputName="Colour" value={colour} />})
            this.updateStateValueWithAPIdata(this.state.allColourFilters, "allColourFilters")
        })

        // Fetch the initial set of data which is all the products.
        this.fetchAPIdata(this.state.apiURL, this.state.selectedPriceFilter, this.state.selectedColourFilter, this.state.selectedAvailableFilter, this.state.typeFilter, "products")
    }

    // If no filters, retrieve products straight away. If there are filters, create the extra filter URL and then retrieve products. 
    fetchAPIdata(apiURL, selectedPriceFilter, selectedColourFilter, selectedAvailableFilter, typeFilter, stateIndex) {
        if (!(selectedPriceFilter.length === 0 && selectedColourFilter.length === 0 && selectedAvailableFilter.length === 0 && typeFilter.length === 0)) {
            apiURL = apiURL + createURLFilter(selectedPriceFilter, selectedColourFilter, selectedAvailableFilter, typeFilter)
        }

        fetch(apiURL).then((response) => {return response.json()}).then((data) => {
            this.updateStateValueWithAPIdata(data, stateIndex)
        })

        return
    }

    // Removes from the basket by using the basketItemID (see addToBasket for details). If not found then it does nothing.
    removeFromBasket(basketItemID) {
        let basket = [...this.state.basket]
        for (let x = 0; x < this.state.basket.length; x++) {
            if (this.state.basket[x][0] === basketItemID) {
                basket.splice(x, 1)
            }
        }

        this.setState((state) => {
            return {
                basket: basket,
            }
        })

        // Permanently store stringified basket on device so that if user returns they can leave where they left off. If the basket is empty, remove the permanent storage.
        if (basket.length === 0) {
            window.localStorage.removeItem("outfitsora_basket")
        }
        else {
            window.localStorage.setItem("outfitsora_basket", stringifyBasket(basket))
        }

        return
    }

    // Coming back from viewing all of one product's details, all products will be displayed again.
    removeFullProductInformation() {
        this.setState((state) => {
            return {
                fullProductData: [],
                selectedAvailableFilter: [],
                selectedColourFilter: [],
                selectedPriceFilter: [],
                apiURL: this.ORIGINAL_API_URL,
            }
        })

        this.fetchAPIdata(this.ORIGINAL_API_URL, [], [], [], this.state.typeFilter, "products")

        return
    }

    // Removes price filters and updates the list of products seen.
    removePriceFilters() {
        this.setState((state) => {
            return {
                selectedPriceFilter: []
            }
        })

        this.fetchAPIdata(this.state.apiURL, [], this.state.selectedColourFilter, this.state.selectedAvailableFilter, this.state.typeFilter, "products")

        return
    }

    // Clear user data.
    removeUserData() {
        this.setState((state) => {
            return {
                userEmail: "",
                name: "",
                nameOnOrder: "",
                picture: "",
                startCheckout: false,
            }
        })

        return
    }

    // Retrieve the products from the json data and store them.
    updateStateValueWithAPIdata(data, stateIndex) {
        let updateStateValue = {}
        updateStateValue[stateIndex] = data
        this.setState((state) => {
            return updateStateValue
        })

        return
    }

    // Validate the entered minimum and maximum price before submitting them as price filters.
    submitPriceFilterValues(event, minPrice, maxPrice) {
        event.preventDefault()
        let errors = {
            "errorMessageDisplay": false,
            "errorMessage": "",
        }

        // Check lengths of both inputs. If they're not filled then they must try again.
        if (minPrice.length === 0 || maxPrice.length === 0) {
            errors['errorMessage'] = "Both price values must be filled in. Please amend your choices."
            errors['errorMessageDisplay'] = true
        }

        // Check both inputs are actual decimal numbers that are larger than 0. If not then user must try again.
        else if (!(isPositiveDecimalNumber(minPrice) && isPositiveDecimalNumber(maxPrice))) {
            errors['errorMessageDisplay'] = true
            errors['errorMessage'] = "Both price values must be positive decimal numbers. Please amend your choices."

        }

        // Check that the minimum price is smaller than the maximum price. If not then user must try again.
        else if (Number(minPrice) > Number(maxPrice)) {
            errors['errorMessageDisplay'] = true
            errors['errorMessage'] = "The minimum price must be smaller than the maximum price. Please amend your choices."
        }

        // If there are any errors, return the errors. If not, store the values as price filters.
        if (errors['errorMessageDisplay'] === true) {
            this.setState((state) => {
                return errors
            })
        }
        else {
            let newSelectedPriceFilter = [minPrice, maxPrice]
            this.setState((state) => {
                return {
                    selectedPriceFilter: newSelectedPriceFilter
                }
            })
            this.setState((state) => {
                return errors
            })

            this.fetchAPIdata(this.state.apiURL, newSelectedPriceFilter, this.state.selectedColourFilter, this.state.selectedAvailableFilter, this.state.typeFilter, "products")
        }

        return
    }

    // Toggles colour and available filter values by either adding or removing it. It then updates the list of products seen.
    toggleCheckBoxFilterValues(event) {

        // Gets the correct index for the filters list.
        let filterIndexName = "selected" + String(event.target.name) + "Filter"
        let indexFilterValues = this.state[filterIndexName]

        // Checks if the value is in the list. If it's in the list, remove it because it must be a filter. If it's not in the list, it's not a filter so add it.
        let result = (indexFilterValues.indexOf(event.target.value) < 0) ? indexFilterValues.push(event.target.value): indexFilterValues.splice(indexFilterValues.indexOf(event.target.value), 1)

        // Updates the filters list.
        this.setState((state) => {
            let amendedFilterValues = {}
            amendedFilterValues[filterIndexName] = indexFilterValues
            return amendedFilterValues
        })

        // Applies new filters to the products list.
        this.fetchAPIdata(this.state.apiURL, this.state.selectedPriceFilter, this.state.selectedColourFilter, this.state.selectedAvailableFilter, this.state.typeFilter, "products")

        return
    }

    // Toggle the display of the error message box for price errors.
    toggleErrorMessageBox(event) {
        this.setState((state) => {
            return {
                errorMessageDisplay: (this.state.errorMessageDisplay === true) ? false: true
            }
        })

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

    // Update the user's data. Name can differ from the name on the order (for a gift e.g.).
    updateUserData(email=this.state.email, name=this.state.name, nameOnOrder=this.state.nameOnOrder, picture=this.state.picture) {
        this.setState((state) => {
            return {
                userEmail: email,
                name: name,
                nameOnOrder: nameOnOrder,
                picture: picture,
            }
        })
    }

    render() {

        let sectionDisplayed

        if (this.state.fullProductData.length === 0) {
            sectionDisplayed = 
            <ProductList
                products={this.state.products}
                fetchAPIdata={this.fetchAPIdata}
                allColourFilters={this.state.allColourFilters}
                submitPriceFilterValues={this.submitPriceFilterValues}
                toggleCheckBoxFilterValues={this.toggleCheckBoxFilterValues}
                changeSortOption={this.changeSortOption}
                selectedPriceFilter={this.state.selectedPriceFilter}
                selectedColourFilter={this.state.selectedColourFilter}
                selectedAvailableFilter={this.state.selectedAvailableFilter}
                removePriceFilters={this.removePriceFilters}
                SORT_BY_OPTIONS={this.SORT_BY_OPTIONS}
                clothesType={this.state.clothesType}
            />
        }
        else {
            sectionDisplayed = <ProductDetails fullProductData={this.state.fullProductData} removeFullProductInformation={this.removeFullProductInformation} addToBasket={this.addToBasket} />
        }

        return (
            <section>
                <Header
                    basket={this.state.basket} 
                    changeTypeFilter={this.changeTypeFilter} 
                    removeFromBasket={this.removeFromBasket} 
                    loggedIn={this.state.loggedIn} 
                    toggleLoggedIn={this.toggleLoggedIn}
                    userEmail={this.state.userEmail}
                    name={this.state.name}
                    nameOnOrder={this.state.nameOnOrder}
                    picture={this.state.picture}
                    updateUserData={this.updateUserData}
                    removeUserData={this.removeUserData}
                />
                <main>
                    {sectionDisplayed}
                </main>
                <Footer changeTypeFilter={this.changeTypeFilter} />
                { (this.state.errorMessageDisplay === true) ? <ErrorMessage message={this.state.errorMessage} toggleErrorMessageBox={this.toggleErrorMessageBox} />: "" }
            </section>
        )
    }
}

const CheckBox = (props) => {
    return (
        <section className="filter-choices">
            <label className="check-box-container">
                <input type="checkbox" name={props.inputName} value={props.value} onClick={props.toggleCheckBoxFilterValues} />
                <span className="checkmark"></span>
                <span className="checkmark-value">{capitaliseFirstLetter(props.value)}</span>
            </label>
        </section>
    )
}