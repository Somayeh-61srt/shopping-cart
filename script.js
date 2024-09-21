
const productsArray = [
    {
        id: 1,
        name: 'Cheese',
        price: '12',
        image: 'img/3aa5e0bb1d7dd3547fa2156551ff62515bde4208_1670323381.jpg',
        count: '1'
    },
    {
        id: 2,
        name: 'Pelastic',
        price: '23',
        image: 'img/4e5c840b72a94f346434517b86c777dd0fa96ae1_1699171878.jpg',
        count: '1'
    },
    {
        id: 3,
        name: 'Wash hand',
        price: '34',
        image: 'img/80d81d62b899dc8af9e4680df18ce5c72df8d417_1713944384.jpg',
        count: '1'
    },
    {
        id: 4,
        name: 'Popcorn',
        price: '8',
        image: 'img/81fa61b7dc55c47c2edb5010b51099da51b17d29_1611581898.jpg',
        count: '1'
    },
    {
        id: 5,
        name: 'Potato sticks',
        price: '10',
        image: 'img/c846a90ee3ce8f1a9a1282b838037a723f7b2c96_1665928450.jpg',
        count: '1'
    },
    {
        id: 6,
        name: 'Milk',
        price: '13',
        image: 'img/dc3602aa2e47d39950ee36a3657cdfb9637ef8ee_1687762025.jpg',
        count: '1'
    }
]

let userBasket = []
const productsContainer = document.querySelector('.products-container')
const basketContainer = document.querySelector('.basket-body')
let purchaseBtn = document.querySelector('.purchace-btn')
let totalPriceSpan = document.querySelector('.total-price')

productsArray.forEach(function (product) {
    productsContainer.insertAdjacentHTML('afterbegin', `<div class="product">
            <h3 class="product-name">`+ product.name + `</h3>
            <img src="`+ product.image + `" alt="` + product.name + `" class="product-image">
            <div class="price-container">
                <span class="price">$`+ product.price + `</span>
                <button class="add-btn" onclick="addProductToCart(`+ product.id + `)">Add To Cart</button>
            </div>
        </div>`)
})

// Retrieve basket from local storage (if available) when the page loads
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('userBasket')) {
        userBasket = JSON.parse(localStorage.getItem('userBasket'));
        basketGenerator(userBasket);  // Re-render basket on page load
        totalPriceCal(userBasket);    // Recalculate total price on page load
    }
});

// Save basket to local storage
function saveBasketToLocalStorage() {
    localStorage.setItem('userBasket', JSON.stringify(userBasket));
}

// Adding product to the cart
function addProductToCart(productId) {
    let mainProduct = productsArray.find(function (product) {
        return product.id === productId;
    });
    let existingProduct = userBasket.find(function (product) {
        return product.id === productId;
    });

    if (existingProduct) {
        existingProduct.count++;
    } else {
        userBasket.push({...mainProduct});
    }

    basketGenerator(userBasket);
    totalPriceCal(userBasket);
    saveBasketToLocalStorage(); // Save basket to localStorage after adding product
}

// Generating the basket (with localStorage save)
function basketGenerator(userBasketArray) {
    basketContainer.innerHTML = '';
    userBasketArray.forEach(function (product) {
        basketContainer.insertAdjacentHTML('beforeend', `
            <tr class="cart-item-${product.id}">
                <td class="img-name-container">
                    <img src="`+ product.image + `" alt="`+ product.name + `" class="cart-image">
                    <span class="cart-item-name">` + product.name + `</span>
                </td>
                <td><span class="cart-price">$`+ (product.price * product.count) + `</span></td>
                <td>
                    <input type="number" class="cart-quantity" onchange="changeNumberOfProduct(` + product.id + `, this.value)" min="1" value="` + product.count + `">
                    <button class="remove-btn" onclick="removeProductFromBasket(` + product.id + `)">REMOVE</button>
                </td>
            </tr>
        `);
    });

    saveBasketToLocalStorage(); // Save basket to localStorage whenever it's generated
}

// Removing product from the basket
function removeProductFromBasket(productId) {
    userBasket = userBasket.filter(function (product) {
        return product.id !== productId;
    });
    basketGenerator(userBasket);
    totalPriceCal(userBasket);
    saveBasketToLocalStorage(); // Save basket to localStorage after removing product
}

// Changing product quantity
function changeNumberOfProduct(productId, newCount) {
    let productToUpdate = userBasket.find(function (product) {
        return product.id === productId;
    });

    if (productToUpdate) {
        productToUpdate.count = parseInt(newCount);

        // Update the price in the specific product row
        let productRow = document.querySelector(`.cart-item-${productId}`);
        let updatedPrice = productToUpdate.price * productToUpdate.count;
        productRow.querySelector('.cart-price').textContent = "$" + updatedPrice;

        totalPriceCal(userBasket);
        saveBasketToLocalStorage(); // Save basket to localStorage after changing quantity
    }
}

// Purchase (clear basket and local storage)
purchaseBtn.addEventListener('click', function () {
    userBasket = [];
    basketGenerator(userBasket);
    totalPriceCal(userBasket);
    localStorage.removeItem('userBasket'); // Clear localStorage on purchase
});

// Total price calculation
function totalPriceCal(userBasketArray) {
    let totalPriceValue = 0;
    userBasketArray.forEach(function (product) {
        totalPriceValue += product.count * product.price;
    });
    totalPriceSpan.innerHTML = "Total Price: $" + totalPriceValue;
}
