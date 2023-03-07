import { isPositiveDecimalNumber, isPositiveNumber, capitaliseFirstLetter, createURLFilter, nameToImageURL, clothesType, stringifyBasket, deStringifyBasket, checkNameValid } from "./helperFunctions";

// isPositiveDecimalNumber tests Start

test("Test Valid Decimal Number", () => {
    expect(isPositiveDecimalNumber("5.5")).toBe(true)
})

test("Test Invalid Decimal Number", () => {
    expect(isPositiveDecimalNumber("-5.10")).toBe(false)
})

test("Test Invalid Data", () => {
    expect(isPositiveDecimalNumber("abc.54re")).toBe(false)
})

// isPositiveDecimalNumber tests End


// isPositiveNumber tests Start

test("Test Valid Number", () => {
    expect(isPositiveNumber("5")).toBe(true)
})

test("Test Invalid Number", () => {
    expect(isPositiveNumber("5e10")).toBe(false)
})

test("Test Negative Number", () => {
    expect(isPositiveNumber("-5")).toBe(false)
})

test("Test Invalid Data", () => {
    expect(isPositiveNumber("abcde")).toBe(false)
})

// isPositiveNumber tests End





// capitaliseFirstLetter test Start

test("Test Capital First Letter Without Space", () => {
    expect(capitaliseFirstLetter("abcde")).toBe("Abcde")
})

test("Test Capital First Letter With Space", () => {
    expect(capitaliseFirstLetter("abcde fghij")).toBe("Abcde fghij")
})

test("Test Number As Capital", () => {
    expect(capitaliseFirstLetter("5bcde fghij")).toBe("5bcde fghij")
})

// capitaliseFirstLetter test End






// createURLFilter test Start

test("Test Filter URL Creation", () => {
    expect(createURLFilter(["12.50", "18.50"], ["Black", "Blue"], ["Yes"], "")).toBe("/price=12.50,18.50&colour=Black|Blue&available=Yes&")
})

test("User Modified Selected Price Filter Array", () => {
    expect(createURLFilter(["12.50", "17.50", "18.50"], ["Black", "Blue"], [], "")).toBe("")
})

test("User Modified Selected Available Filter Array Fail", () => {
    expect(createURLFilter(["12.50", "18.50"], ["Black", "Blue"], ["Modified"], "")).toBe("")
})


test("Price Omitted Filter URL", () => {
    expect(createURLFilter([], ["Black", "Blue"], ["Yes"], "")).toBe("/colour=Black|Blue&available=Yes&")
})

test("Available Omitted Filter URL", () => {
    expect(createURLFilter([], ["Black", "Blue"], [], "")).toBe("/colour=Black|Blue&")
})

test("Colour Omitted Filter URL", () => {
    expect(createURLFilter(["12.50", "18.99"], [], [], "")).toBe("/price=12.50,18.99&")
})

// Should never occur but tested anyway.
test("Empty Filters URL", () => {
    expect(createURLFilter([], [], [], "")).toBe("/")
})

// createURLFilter test End



// nameToImageURL test Start

test("Correct nametoImageURL Values Test 1", () => {
    expect(nameToImageURL("Luxury Yellow Shirt", "-", ".jpg")).toBe("Luxury-Yellow-Shirt.jpg")
})

test("Correct nametoImageURL Values Test 2", () => {
    expect(nameToImageURL("Luxury Black Shirt", "-", ".jpg")).toBe("Luxury-Black-Shirt.jpg")
})

test("Correct nametoImageURL Values Test 3", () => {
    expect(nameToImageURL("Luxury Brown Shirt", "-", ".jpg")).toBe("Luxury-Brown-Shirt.jpg")
})

test("Correct nametoImageURL Values Test 4", () => {
    expect(nameToImageURL("Blue Trousers", "-", ".jpg")).toBe("Blue-Trousers.jpg")
})

test("Correct nametoImageURL Values Test 5", () => {
    expect(nameToImageURL("Luxury White Shirt", "-", ".jpg")).toBe("Luxury-White-Shirt.jpg")
})

test("Correct nametoImageURL Values Test 6", () => {
    expect(nameToImageURL("Luxury Dark Grey Shirt", "-", ".jpg")).toBe("Luxury-Dark-Grey-Shirt.jpg")
})

test("Correct nametoImageURL Values Test 7", () => {
    expect(nameToImageURL("Blue Blazer", "-", ".jpg")).toBe("Blue-Blazer.jpg")
})

test("Correct nametoImageURL Values Test 8", () => {
    expect(nameToImageURL("Luxury Gold Shirt", "-", ".jpg")).toBe("Luxury-Gold-Shirt.jpg")
})

test("Correct nametoImageURL Values Test 9", () => {
    expect(nameToImageURL("White Polo Shirt", "-", ".jpg")).toBe("White-Polo-Shirt.jpg")
})

test("Correct nametoImageURL Values Test 10", () => {
    expect(nameToImageURL("Luxury Grey Shirt", "-", ".jpg")).toBe("Luxury-Grey-Shirt.jpg")
})

test("Correct nametoImageURL Values Test 11", () => {
    expect(nameToImageURL("Black Blazer", "-", ".jpg")).toBe("Black-Blazer.jpg")
})

test("Correct nametoImageURL Values Test 12", () => {
    expect(nameToImageURL("Luxury Sky Blue Shirt", "-", ".jpg")).toBe("Luxury-Sky-Blue-Shirt.jpg")
})

test("Correct nametoImageURL Values Test 13", () => {
    expect(nameToImageURL("Luxury Royal Blue Shirt", "-", ".jpg")).toBe("Luxury-Royal-Blue-Shirt.jpg")
})

test("Correct nametoImageURL Values Test 14", () => {
    expect(nameToImageURL("Luxury Green Shirt", "-", ".jpg")).toBe("Luxury-Green-Shirt.jpg")
})

test("Correct nametoImageURL Values Test 15", () => {
    expect(nameToImageURL("Luxury Orange Shirt", "-", ".jpg")).toBe("Luxury-Orange-Shirt.jpg")
})

test("Correct nametoImageURL Values Test 16", () => {
    expect(nameToImageURL("Luxury Red Shirt", "-", ".jpg")).toBe("Luxury-Red-Shirt.jpg")
})

test("Correct nametoImageURL Values Test 17", () => {
    expect(nameToImageURL("Black Trousers", "-", ".jpg")).toBe("Black-Trousers.jpg")
})

test("Incorrect Space Replacement Value", () => {
    expect(nameToImageURL("Black Trousers", "/", ".jpg")).toBe(undefined)
})

test("Incorrect Image Format Value", () => {
    expect(nameToImageURL("Black Trousers", "-", ".randomFormat")).toBe(undefined)
})

// nameToImageURL test End






// clothesType test Start

test("Correct clothesType Values Test 1", () => {
    expect(clothesType("Luxury Yellow Shirt")).toBe("Shirt")
})

test("Correct clothesType Values Test 2", () => {
    expect(clothesType("Luxury Black Shirt")).toBe("Shirt")
})

test("Correct clothesType Values Test 3", () => {
    expect(clothesType("Luxury Brown Shirt")).toBe("Shirt")
})

test("Correct clothesType Values Test 4", () => {
    expect(clothesType("Blue Trousers")).toBe("Trousers")
})

test("Correct clothesType Values Test 5", () => {
    expect(clothesType("Luxury White Shirt")).toBe("Shirt")
})

test("Correct clothesType Values Test 6", () => {
    expect(clothesType("Luxury Dark Grey Shirt")).toBe("Shirt")
})

test("Correct clothesType Values Test 7", () => {
    expect(clothesType("Blue Blazer")).toBe("Blazer")
})

test("Correct clothesType Values Test 8", () => {
    expect(clothesType("Luxury Gold Shirt")).toBe("Shirt")
})

test("Correct clothesType Values Test 9", () => {
    expect(clothesType("White Polo Shirt")).toBe("Shirt")
})

test("Correct clothesType Values Test 10", () => {
    expect(clothesType("Luxury Grey Shirt")).toBe("Shirt")
})

test("Correct clothesType Values Test 11", () => {
    expect(clothesType("Black Blazer")).toBe("Blazer")
})

test("Correct clothesType Values Test 12", () => {
    expect(clothesType("Luxury Sky Blue Shirt")).toBe("Shirt")
})

test("Correct clothesType Values Test 13", () => {
    expect(clothesType("Luxury Royal Blue Shirt")).toBe("Shirt")
})

test("Correct clothesType Values Test 14", () => {
    expect(clothesType("Luxury Green Shirt")).toBe("Shirt")
})

test("Correct clothesType Values Test 15", () => {
    expect(clothesType("Luxury Orange Shirt")).toBe("Shirt")
})

test("Correct clothesType Values Test 16", () => {
    expect(clothesType("Luxury Red Shirt")).toBe("Shirt")
})

test("Correct clothesType Values Test 17", () => {
    expect(clothesType("Black Trousers")).toBe("Trousers")
})

test("Correct clothesType Values Test 18", () => {
    expect(clothesType("Luxury Hoodie Green")).toBe("Shirt")
})

test("Correct clothesType Values Test 19", () => {
    expect(clothesType("Luxury Jumper Green")).toBe("Shirt")
})

test("Correct clothesType Values Test 20", () => {
    expect(clothesType("Suit Black")).toBe("Blazer")
})

test("Unidentifiable clothes type", () => {
    expect(clothesType("Some random title not including a clothes type")).toBe(undefined)
})

test("Empty clothesType name", () => {
    expect(clothesType("")).toBe(undefined)
})

// clothesType test End




// Basket stringification de-stringification test Start

test("Stringify Basket Valid Test", () => {
    expect(stringifyBasket([["377e85de-9632-4db1-be1b-e373b9db2d5b_XS","377e85de-9632-4db1-be1b-e373b9db2d5b","XS",1,"Luxury Black Shirt",7.99,],["377e85de-9632-4db1-be1b-e373b9db2d5b_L","377e85de-9632-4db1-be1b-e373b9db2d5b","L",1,"Luxury Black Shirt",7.99,],])).toBe("377e85de-9632-4db1-be1b-e373b9db2d5b_XS,377e85de-9632-4db1-be1b-e373b9db2d5b,XS,1,Luxury Black Shirt,7.99&377e85de-9632-4db1-be1b-e373b9db2d5b_L,377e85de-9632-4db1-be1b-e373b9db2d5b,L,1,Luxury Black Shirt,7.99")
})

test("Destringify Basket Valid Test", () => {
    expect(deStringifyBasket("377e85de-9632-4db1-be1b-e373b9db2d5b_XS,377e85de-9632-4db1-be1b-e373b9db2d5b,XS,1,Luxury Black Shirt,7.99&377e85de-9632-4db1-be1b-e373b9db2d5b_L,377e85de-9632-4db1-be1b-e373b9db2d5b,L,1,Luxury Black Shirt,7.99")).toStrictEqual([["377e85de-9632-4db1-be1b-e373b9db2d5b_XS","377e85de-9632-4db1-be1b-e373b9db2d5b","XS","1","Luxury Black Shirt","7.99",],["377e85de-9632-4db1-be1b-e373b9db2d5b_L","377e85de-9632-4db1-be1b-e373b9db2d5b","L","1","Luxury Black Shirt","7.99",],])
})

// // Basket stringification de-stringification test




// checkNameValid test Start

test("Check Name Valid Test 1", () => {
    expect(checkNameValid("Test")).toBe(true)
})

test("Check Name Valid Test 2", () => {
    expect(checkNameValid("Test Test")).toBe(true)
})

test("Check Name Valid Test 3", () => {
    expect(checkNameValid("Test-Test")).toBe(true)
})

test("Check Name Valid Test 4", () => {
    expect(checkNameValid("Test-Test Test")).toBe(true)
})

test("Check Name Invalid Test 1", () => {
    expect(checkNameValid("Test123")).toBe(false)
})

test("Check Name Invalid Test 2", () => {
    expect(checkNameValid("Test123-Test123")).toBe(false)
})

test("Check Name Invalid Test 3", () => {
    expect(checkNameValid("Test123 Test123")).toBe(false)
})

test("Check Name Invalid Test 4", () => {
    expect(checkNameValid("Test123-Test123 Test123")).toBe(false)
})

test("Check Name Invalid Test 5", () => {
    expect(checkNameValid("123")).toBe(false)
})

// checkNameValid test End