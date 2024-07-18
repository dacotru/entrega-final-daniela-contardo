// Variables y constantes
const productsDiv = document.getElementById('products');
const cartUl = document.getElementById('cart');
const checkoutButton = document.getElementById('checkout');
const LOCAL_STORAGE_CART_KEY = 'cart';

// Funciones
const getCart = () => JSON.parse(localStorage.getItem(LOCAL_STORAGE_CART_KEY)) || [];
const saveCart = (cart) => localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));

const createProductElement = (product) => {
    const div = document.createElement('div');
    div.className = 'product';

    const name = document.createElement('span');
    name.textContent = `${product.name} - $${product.price}`;

    const button = document.createElement('button');
    button.textContent = 'Add to Cart';
    button.addEventListener('click', () => addToCart(product));

    div.appendChild(name);
    div.appendChild(button);
    return div;
};

const renderProducts = (products) => {
    productsDiv.innerHTML = '';
    products.forEach(product => {
        const productElement = createProductElement(product);
        productsDiv.appendChild(productElement);
    });
};

const renderCart = () => {
    cartUl.innerHTML = '';
    const cart = getCart();
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - $${item.price}`;
        cartUl.appendChild(li);
    });
};

const addToCart = (product) => {
    const cart = getCart();
    cart.push(product);
    saveCart(cart);
    renderCart();
    Swal.fire('Added to Cart', `${product.name} has been added to your cart.`, 'success');
};

const checkout = () => {
    const cart = getCart();
    if (cart.length === 0) {
        Swal.fire('Cart is empty', 'Please add items to your cart before checking out.', 'error');
    } else {
        localStorage.removeItem(LOCAL_STORAGE_CART_KEY);
        renderCart();
        Swal.fire('Purchase Complete', 'Thank you for your purchase!', 'success');
    }
};

// Event Listeners
checkoutButton.addEventListener('click', checkout);

document.addEventListener('DOMContentLoaded', () => {
    // Fetching initial products from JSON
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            renderProducts(data);
            renderCart();
        })
        .catch(() => Swal.fire('Error', 'Failed to load products', 'error'));
});
