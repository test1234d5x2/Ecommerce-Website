// "something" becomes "Something"
export function capitaliseFirstLetter(aString) {
    return String(aString).charAt(0).toUpperCase() + String(aString).slice(1)
}

// Values such as ("5") are valid.
export function isPositiveNumber(num) {
    return /^[0-9]+$/.test(num)
}

// Decimal numbers ("10.10") are valid too.
export function isPositiveDecimalNumber(num) {
    let decimalSplit = String(num).split(".")
    let valid = true
    for (let x = 0; x < decimalSplit.length; x++) {
        if (!(isPositiveNumber(decimalSplit[x]))) {
            valid = false
        }
    }

    return valid
}

// In the form of "filterData[price=<min-price>,<max-price>&colour=<colour>|<colour>|<colour>&available=Yes&type=<type>&new=Yes]"
// Every single filter type is optional so none of them are actually needed for products to be shown.
export function createURLFilter(selectedPriceFilter, selectedColourFilter, selectedAvailableFilter, typeFilter="") {

    let filterURL = ""
    
    // If there isn't 2 numbers (a min and max price), or either number is not a valid positive number in the array then skip.
    if (selectedPriceFilter.length === 2 && isPositiveDecimalNumber(selectedPriceFilter[0]) && isPositiveDecimalNumber(selectedPriceFilter[1])) {
        let minPrice = selectedPriceFilter[0]
        let maxPrice = selectedPriceFilter[1]
        filterURL = filterURL + "price=" + minPrice + "," + maxPrice + "&"
    }

    // If the array length is not 0 (unfilled) then the array has been played with by the user, so do not attempt to create a filter.
    else if (selectedPriceFilter.length !== 0) {
        return ""
    } 

    // If there aren't any colours then skip.
    if (selectedColourFilter.length !== 0) {
        let coloursNeeded = "colour="
        for (let x = 0; x < selectedColourFilter.length; x++) {
            coloursNeeded = coloursNeeded + selectedColourFilter[x]
            if (x !== selectedColourFilter.length - 1) {
                coloursNeeded = coloursNeeded + "|"
            }
        }

        filterURL = filterURL + coloursNeeded + "&"
    }

    if (selectedAvailableFilter.length === 1 && selectedAvailableFilter[0] === "Yes") {
        filterURL = filterURL + "available=Yes&"
    }

    // If the available filter is not chosen then it must be of length 0
    // otherwise the array has been manipulated by the user so do not attempt to create a filter.
    else if (selectedAvailableFilter.length !== 0) {
        return ""
    }

    return "/" + filterURL + typeFilter
}

// Converts a String where the initial name is a name with spaces to an imageURL.
// The spaceReplacement converts the spaces to another form of punctuation such as hyphens or underscores.
// Image format specifies whether it's .jpeg or .png or another format.
export function nameToImageURL(name, spaceReplacement, imageFormat) {
    if (spaceReplacement === "/") {
        console.error("spaceReplacement must not be " + spaceReplacement)
        return undefined
    }
    else if (!(imageFormat === ".jpg" || imageFormat === ".jpeg" || imageFormat === ".png")) {
        console.error("Image format must be .jpg, .jpeg or .png")
        return undefined
    }
    return String(name).replace(/[ ]/g, spaceReplacement) + imageFormat
}

// Returns the clothes type by filtering through the name.
// For example, "Luxury Blazer Black" should return "Blazer".
export function clothesType(name) {
    let nameParts = String(name).split(" ")
    for (let x = 0; x < nameParts.length; x++) {
        if (nameParts[x] === "Blazer" || nameParts[x] === "Suit") {
            return "Blazer"
        }
        else if (nameParts[x] === "Trousers") {
            return "Trousers"
        }
        else if (nameParts[x] === "Shirt" || nameParts[x] === "Hoodie" || nameParts[x] === "Jumper") {
            return "Shirt"
        }
    }

    console.error("Can't find clothes type. Please amend.")
    return undefined
}

// Converts each element in a list to a format that the HTML select tag can use as an option.
export function listValueToSelectOption(list) {
    let options = list.map((item) => {return <option value={item}>{item}</option>})
    return options
}

// Converts basket to a custom string format (See stringifiedBasket.txt).
export function stringifyBasket(basket) {
    let localStorageString = ""
    const ITEM_SEPARATOR = "&"
    for (let x = 0; x < basket.length; x++) {
        localStorageString += String(basket[x])
        if (x !== basket.length - 1) {
            localStorageString += ITEM_SEPARATOR
        }
    }

    return localStorageString;
}

// Converts custom string format back into a list of basket items (See stringifiedBasket.txt).
export function deStringifyBasket(stringifiedBasket) {
    const ITEM_SEPARATOR = "&"
    let basket = []
    let stringifiedItems = String(stringifiedBasket).split(ITEM_SEPARATOR)
    for (let x = 0; x < stringifiedItems.length; x++) {
        let listedItemData = String(stringifiedItems[x]).split(",")
        basket.push(listedItemData)
    }

    return basket
}

//Checks whether the name entered has any digits (and is therefore an invalid name).
export function checkNameValid(name) {
    const CHECK_NOT_LETTERS = /[^a-zA-Z]+/g
    let filteredName = String(name).replace("-", "").replace(" ", "")
    return !(CHECK_NOT_LETTERS.test(filteredName)) && !(String(name).length === 0)
}

// Gets a string query ready for use in a API URL call.
export function convertStringToURL(string) {
    return String(string).replace(/[ ]/g, "%20").replace(/[+]/g, "%2b")
}

// Creates a query string for the Bing Maps API call
export function createAddressURLquery(streetNumber,  streetName, city, county, country) {
    let queryString = convertStringToURL(streetNumber) + " " + convertStringToURL(streetName) + "," + convertStringToURL(city) + "," + convertStringToURL(county) + "," + convertStringToURL(country)
    return convertStringToURL(queryString)
}