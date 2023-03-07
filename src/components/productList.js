import React from "react";
import { H3Title, H2Title } from "./titles";
import { capitaliseFirstLetter, nameToImageURL, listValueToSelectOption } from "./helperFunctions";
import { NewBanner } from "./newBanner";
import { v4 } from "uuid";

export class ProductList extends React.Component {
    constructor(props) {
        super(props)

        this.filterSectionRef = React.createRef()

        this.toggleMobileFiltersDisplay = this.toggleMobileFiltersDisplay.bind(this)
    }
    
    // Toggle the display of the filters section for mobile phones.
    toggleMobileFiltersDisplay(event) {
        this.filterSectionRef.current.style.right = this.filterSectionRef.current.style.right === "0px" ? "100%": "0px"

        return
    }

    render() {
        const SORT_BY_OPTIONS = listValueToSelectOption(Object.keys(this.props.SORT_BY_OPTIONS))

        // Dealing with displaying products.
        let productList = []
        this.props.products.forEach((item) => {
            return productList.push(<ProductCard key={v4()} itemData={item} fetchAPIdata={this.props.fetchAPIdata} />)
        })

        return (
            <section id="products-list-information">
                <H2Title id="product-list-title" title={"Shop for Clothes: " + this.props.clothesType} />
                <section id="products-list-section-container">
                    <FilterSection
                        submitPriceFilterValues={this.props.submitPriceFilterValues}
                        allColourFilters={this.props.allColourFilters} 
                        toggleCheckBoxFilterValues={this.props.toggleCheckBoxFilterValues}
                        toggleMobileFiltersDisplay={this.toggleMobileFiltersDisplay}
                        selectedPriceFilter={this.props.selectedPriceFilter}
                        selectedColourFilter={this.props.selectedColourFilter}
                        selectedAvailableFilter={this.props.selectedAvailableFilter}
                        removePriceFilters={this.props.removePriceFilters}
                        filterSectionRef={this.filterSectionRef}
                    />
                    <section id="products-list-section">
                        <section id="products-list-metadata">
                            <section id="products-list-length-container">
                                <span id="products-list-length">{this.props.products.length} {this.props.products.length === 1 ? "item": "items"} found</span>
                            </section>
                            <section id="mobile-products-filter-toggle-container" className="mobile">
                                <span id="mobile-products-filters-toggle" onClick={this.toggleMobileFiltersDisplay}>
                                    <span id="filters-text">Filters</span>
                                    <span className="material-icons icons" id="filters-icon">tune</span>
                                </span>
                            </section>
                            <section id="sort-by-section">
                                <span id="sort-by-text">Sort By</span>
                                <select id="sort-by-options" onChange={this.props.changeSortOption}>
                                    {SORT_BY_OPTIONS}
                                </select>
                            </section>
                        </section>
                        <section id="products-section">
                            { (productList.length === 0) ? <NoProductsFound />: productList}
                        </section>
                    </section>
                </section>
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
                            <input type="number" name="min-price" placeholder="min" className="min-price-input" value={this.minPrice} onChange={this.changeInputValue} />
                            <span>-</span>
                            <input type="number" name="max-price" placeholder="max" className="max-price-input" value={this.maxPrice} onChange={this.changeInputValue} />
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

const ProductCard = (props) => {
    const FULL_PRODUCT_DATA_URL_BASE = "https://moselsh.eu.pythonanywhere.com/api/product/"
    const IMAGE_SRC = "./images/" + nameToImageURL(props.itemData.name, "-", ".jpg")
    const NEW_BANNER = props.itemData.new === true ? <NewBanner />: ""
    const AVAILABILITY = (props.itemData.available === false) ? <OutOfStock />: ""
    return (
        <section className="product-card-container" onClick={(event) => {props.fetchAPIdata(FULL_PRODUCT_DATA_URL_BASE + props.itemData.prodID, [], [], [], "", "fullProductData")}}>
            <img src={IMAGE_SRC} className="product-image" alt={props.itemData.name} />
            {NEW_BANNER}
            <span className="product-name">{props.itemData.name}</span>
            <span className="product-price">£{props.itemData.price}</span>
            {AVAILABILITY}
        </section>
    )
}

const FilterSubheading = (props) => {
    return (
        <section className="filter-subheading-container">
            <H3Title className="filter-subheading" title={props.title} />
            <span className="filter-subheading-arrow">▼</span>
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

const ChosenFilter = (props) => {
    return (
        <section className="chosen-filter">
            <span className="chosen-filter-type">{props.filterType}:</span>
            <span className="chosen-filter-value">{props.filterValue}</span>
        </section>
    )
}

const NoProductsFound = (props) => {
    return (
        <section id="no-products-found">
            No Products Found. Please clear some filters.
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