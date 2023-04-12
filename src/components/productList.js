import React from "react";
import { H3Title, H2Title } from "./titles";
import { ProductCard } from "./productCard";
import { NoProductsFound } from "./noProductsFound";
import { capitaliseFirstLetter, listValueToSelectOption, isPositiveNumber, createURLFilter } from "./helperFunctions";
import { v4 } from "uuid";
import { useParams, useOutletContext } from "react-router-dom";
import { ErrorMessage } from "./errorMessage";
import jwt_encode from "jwt-encode";

export const ProductList = (props) => {
    let params = useParams()
    let context = useOutletContext()
    return <ProductListWrapper typeFilter={params.typeFilter || "Collections"} context={context} />
}

export class ProductListWrapper extends React.Component {
    constructor(props) {
        super(props)

        let loggedIn = false
        let userEmail = ""
        if (window.localStorage.getItem("outfitsora_user_name") !== null) {
            loggedIn = true
            userEmail = window.localStorage.getItem("outfitsora_user_email")
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
        this.ORIGINAL_API_URL = this.BASE_API_URL + this.SORT_BY_OPTIONS['Relevance'] + "/" + this.TYPE_FILTER_PAIRING[props.typeFilter]

        this.state = {
            allColourFilters: [],
            apiURL: this.ORIGINAL_API_URL,
            selectedPriceFilter: [],
            selectedColourFilter: [],
            selectedAvailableFilter: [],
            products: [],
            chosenSortOption: "Relevance",
            typeFilter: props.typeFilter,
            errorMessageDisplay: false,
            errorMessage: "",
            loggedIn: loggedIn,
            userEmail: userEmail,
            watchlist_IDs: []
        }

        this.filterSectionRef = React.createRef()

        this.addWatchlistProduct = this.addWatchlistProduct.bind(this)
        this.changeSortOption = this.changeSortOption.bind(this)
        this.refreshProductsList = this.refreshProductsList.bind(this)
        this.removePriceFilters = this.removePriceFilters.bind(this)
        this.removeWatchlistProduct = this.removeWatchlistProduct.bind(this)
        this.submitPriceFilterValues = this.submitPriceFilterValues.bind(this)
        this.toggleCheckBoxFilterValues = this.toggleCheckBoxFilterValues.bind(this)
        this.toggleErrorMessageDisplay = this.toggleErrorMessageDisplay.bind(this)
        this.toggleMobileFiltersDisplay = this.toggleMobileFiltersDisplay.bind(this)
        this.updateApiUrl = this.updateApiUrl.bind(this)
        this.updateStateValue = this.updateStateValue.bind(this)
    }

    addWatchlistProduct(prodID) {
        let token = jwt_encode({"email": this.state.userEmail, "prodID": prodID, "process": "add"}, process.env.REACT_APP_JWT_SECRET)
        fetch("https://moselsh.eu.pythonanywhere.com/api/watchlist/" + token).then((response) => {return response.json()}).then((data) => {
            console.log(data)
        })
        
        let newWatchlist_IDs = [...this.state.watchlist_IDs]
        newWatchlist_IDs.push(prodID)
        this.setState((state) => {
            return {watchlist_IDs: newWatchlist_IDs}
        })

        return;
    }

    // Chnages the sort option and then retrieves products in a different order.
    changeSortOption(event) {
        const NEW_API_URL = this.BASE_API_URL + this.SORT_BY_OPTIONS[event.target.value] + createURLFilter(this.state.selectedPriceFilter, this.state.selectedColourFilter, this.state.selectedAvailableFilter, this.TYPE_FILTER_PAIRING[this.state.typeFilter])
        
        this.setState((state) => {
            return {
                chosenSortOption: event.target.value,
            }
        })

        this.updateApiUrl(this.state.selectedPriceFilter, this.state.selectedColourFilter, this.state.selectedAvailableFilter, this.SORT_BY_OPTIONS[event.target.value])
        this.refreshProductsList(NEW_API_URL)
        return
    }

    componentDidMount() {
        // Setup the colour filters so they don't have to change each time.
        fetch(this.state.apiURL).then((response) => {return response.json()}).then((data) => {
            let allColourFilters = []
            data.forEach((item) => {
                return (allColourFilters.indexOf(item['colour']) < 0) ? allColourFilters.push(item['colour']): ""
            })
            allColourFilters = allColourFilters.map((colour) => {return <CheckBox toggleCheckBoxFilterValues={this.toggleCheckBoxFilterValues} inputName="Colour" value={colour} />})
            this.updateStateValue("allColourFilters", allColourFilters)
        })
        this.refreshProductsList(this.state.apiURL)

        // Get the watchlist of the user if logged in
        if (this.state.loggedIn) {
            fetch("https://moselsh.eu.pythonanywhere.com/api/watchlist/" + jwt_encode({"email": this.state.userEmail}, process.env.REACT_APP_JWT_SECRET) + "/get").then((response) => {return response.json()}).then((data) => {
                let watchlist_IDs = []
                data.forEach((watchlist_product) => {watchlist_IDs.push(watchlist_product[0].prodID)})
                this.updateStateValue("watchlist_IDs", watchlist_IDs)
            })
        }

        return
    }

    refreshProductsList(apiURL) {
        fetch(apiURL).then((response) => {return response.json()}).then((data) => {
            this.updateStateValue("products", data)
        })

        return
    }

    // Removes price filters and updates the list of products seen.
    removePriceFilters() {
        this.setState((state) => {
            return {
                selectedPriceFilter: []
            }
        })

        this.refreshProductsList(this.updateApiUrl([]))

        return
    }

    removeWatchlistProduct(prodID) {
        let token = jwt_encode({"email": this.state.userEmail, "prodID": prodID, "process": "remove"}, process.env.REACT_APP_JWT_SECRET)
        fetch("https://moselsh.eu.pythonanywhere.com/api/watchlist/" + token).then((response) => {return response.json()}).then((data) => {
            console.log(data)
        })
        
        let newWatchlist_IDs = [...this.state.watchlist_IDs]
        newWatchlist_IDs.splice(newWatchlist_IDs.indexOf(prodID), 1)
        this.setState((state) => {
            return {watchlist_IDs: newWatchlist_IDs}
        })
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

        if (!isPositiveNumber(minPrice) || !isPositiveNumber(maxPrice)) {
            errors['errorMessage'] = "Both values must be a whole number. Please amend your choices"
            errors['errorMessageDisplay'] = true
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
            this.updateStateValue("selectedPriceFilter", newSelectedPriceFilter)
            this.setState((state) => {
                return errors
            })

            this.refreshProductsList(this.updateApiUrl(newSelectedPriceFilter))

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

        this.updateStateValue(filterIndexName, indexFilterValues)

        this.refreshProductsList(this.updateApiUrl())

        return
    }

    toggleErrorMessageDisplay(event) {
        this.setState((state) => {
            return {errorMessageDisplay: this.state.errorMessageDisplay === true ? false: true}
        })

        return
    }

    // Toggle the display of the filters section for mobile phones.
    toggleMobileFiltersDisplay(event) {
        this.filterSectionRef.current.style.right = this.filterSectionRef.current.style.right === "0px" ? "100%": "0px"

        return
    }

    updateApiUrl(selectedPriceFilter=this.state.selectedPriceFilter, selectedColourFilter=this.state.selectedColourFilter, selectedAvailableFilter=this.state.selectedAvailableFilter, sortOption=this.SORT_BY_OPTIONS[this.state.chosenSortOption]) {
        this.setState((state) => {
            return {apiURL: this.BASE_API_URL + sortOption + createURLFilter(selectedPriceFilter, selectedColourFilter, selectedAvailableFilter, this.TYPE_FILTER_PAIRING[this.state.typeFilter])}
        })

        return this.BASE_API_URL + this.SORT_BY_OPTIONS[this.state.chosenSortOption] + createURLFilter(selectedPriceFilter, selectedColourFilter, selectedAvailableFilter, this.TYPE_FILTER_PAIRING[this.state.typeFilter])
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
        const SORT_BY_OPTIONS = listValueToSelectOption(Object.keys(this.SORT_BY_OPTIONS))

        // Dealing with displaying products.
        let productList = []
        this.state.products.forEach((item) => {
            return productList.push(<ProductCard key={v4()} itemData={item} loggedIn={this.state.loggedIn} watchlist_IDs={this.state.watchlist_IDs} addWatchlistProduct={this.addWatchlistProduct} removeWatchlistProduct={this.removeWatchlistProduct} />)
        })

        return (
            <section id="products-list-information">
                <H2Title id="product-list-title" title={"Shop for Clothes: " + this.props.typeFilter} />
                <section id="products-list-section-container">
                    <FilterSection
                        submitPriceFilterValues={this.submitPriceFilterValues}
                        allColourFilters={this.state.allColourFilters} 
                        toggleCheckBoxFilterValues={this.toggleCheckBoxFilterValues}
                        toggleMobileFiltersDisplay={this.toggleMobileFiltersDisplay}
                        selectedPriceFilter={this.state.selectedPriceFilter}
                        selectedColourFilter={this.state.selectedColourFilter}
                        selectedAvailableFilter={this.state.selectedAvailableFilter}
                        removePriceFilters={this.removePriceFilters}
                        filterSectionRef={this.filterSectionRef}
                    />
                    <section id="products-list-section">
                        <section id="products-list-metadata">
                            <section id="products-list-length-container">
                                <span id="products-list-length">{this.state.products.length} {this.state.products.length === 1 ? "item": "items"} found</span>
                            </section>
                            <section id="mobile-products-filter-toggle-container" className="mobile">
                                <span id="mobile-products-filters-toggle" onClick={this.toggleMobileFiltersDisplay}>
                                    <span id="filters-text">Filters</span>
                                    <span className="material-icons icons" id="filters-icon">tune</span>
                                </span>
                            </section>
                            <section id="sort-by-section">
                                <span id="sort-by-text">Sort By</span>
                                <select id="sort-by-options" onChange={this.changeSortOption}>
                                    {SORT_BY_OPTIONS}
                                </select>
                            </section>
                        </section>
                        <section id="products-section">
                            { (productList.length === 0) ? <NoProductsFound />: productList}
                        </section>
                    </section>
                </section>
                {(this.state.errorMessageDisplay === true) ? <ErrorMessage message={this.state.errorMessage} toggleErrorMessageBox={this.toggleErrorMessageDisplay} />: ""}
            </section>
        )
    }
}

class FilterSection extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            "min-price": "",
            "max-price": "",
        }

        this.changeInputValue = this.changeInputValue.bind(this)
    }

    // Gets the name of the input which corresponds with the index value of state and changes the value.
    changeInputValue(event) {
        let newValue = {}
        newValue[event.target.name] = event.target.value
        this.setState((state) => {
            return newValue
        })

        return
    }

    render() {
        let chosenFilters = []

        // Selected price filters displayed as chosen filters.
        if (this.props.selectedPriceFilter.length === 2) {
            let minPrice = this.props.selectedPriceFilter[0]
            let maxPrice = this.props.selectedPriceFilter[1]
            let filterValue = "£" + String(minPrice) + " - £" + String(maxPrice)
            chosenFilters.push(<ChosenFilter filterValue={filterValue} filterType="Price" />)
        }

        // Selected colour filters displayed as chosen filters.
        if (this.props.selectedColourFilter.length !== 0) {
            for (let x = 0; x < this.props.selectedColourFilter.length; x++) {
                let filterValue = this.props.selectedColourFilter[x]
                chosenFilters.push(<ChosenFilter filterValue={filterValue} filterType="Colour" />)
            }
        }

        // Selected availability filters displayed as chosen filters.
        if (this.props.selectedAvailableFilter.length !== 0) {
            for (let x = 0; x < this.props.selectedAvailableFilter.length; x++) {
                let filterValue = this.props.selectedAvailableFilter[x]
                chosenFilters.push(<ChosenFilter filterValue={filterValue} filterType="Available" />)
            }
        }

        return (
            <section className="products-filter-section-container" ref={this.props.filterSectionRef}>
                <article className="products-filters-section">
                    <span className="material-icons icons mobile" id="close-filters-icon" onClick={this.props.toggleMobileFiltersDisplay}>close</span>
                    <H3Title className="filter-section-title" title="Filters:" />
                    <section className="chosen-filters-section">
                        {chosenFilters}
                    </section>
                    <hr className="filter-line" />
                    <section className="filter-type">
                        <FilterSubheading title="Price:" />
                        <form className="price-range-container" onSubmit={(event) => {this.props.submitPriceFilterValues(event, this.state["min-price"], this.state["max-price"])}}>
                            <input type="number" name="min-price" placeholder="min" className="min-price-input" value={this.state["min-price"]} onChange={this.changeInputValue} />
                            <span>-</span>
                            <input type="number" name="max-price" placeholder="max" className="max-price-input" value={this.state["max-price"]} onChange={this.changeInputValue} />
                            <button className="price-range-submit">➔</button>
                        </form>
                        <br />
                        { (this.props.selectedPriceFilter.length !== 0) ? <button className="price-range-clear" onClick={(event) => {this.props.removePriceFilters()}}>Remove Price Filters</button>: ""}
                    </section>
                    <hr className="filter-line" />
                    <section className="filter-type">
                        <FilterSubheading title="Colours:" />
                        <section className="filter-choices-container">
                            {this.props.allColourFilters}
                        </section>
                    </section>
                    <hr className="filter-line" />
                    <section className="filter-type">
                        <FilterSubheading title="Available:" />
                        <section className="filter-choices-container">
                            <CheckBox inputName="Available" value="Yes" toggleCheckBoxFilterValues={this.props.toggleCheckBoxFilterValues} />
                        </section>
                    </section>
                </article>
            </section>
        )
    }
}

const FilterSubheading = (props) => {
    return (
        <section className="filter-subheading-container">
            <H3Title className="filter-subheading" title={props.title} />
            <span className="filter-subheading-arrow">▼</span>
        </section>
    )
}

const ChosenFilter = (props) => {
    return (
        <section className="chosen-filter">
            <span className="chosen-filter-type">{props.filterType}:</span>
            <span className="chosen-filter-value">{props.filterValue}</span>
        </section>
    )
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