let menu = document.querySelector('#menu-btn');
let navbar = document.querySelector('.header .navbar');

menu.onclick = () =>{
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
}
let cart = [];
let total = 0;
const cartIcon = document.getElementById("cart-icon");
const cartSidebar = document.getElementById("cart-sidebar");

cartIcon.addEventListener("mouseenter", () => {
    cartSidebar.classList.add("active");
});

cartSidebar.addEventListener("mouseleave", () => {
    cartSidebar.classList.remove("active");
});
 
function addToCart(name, price) {

    const existingProduct = cart.find(item => item.name === name);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1
        });
    }

    updateCart();
}

function removeFromCart(name) {

    cart = cart.filter(item => item.name !== name);

    updateCart();
}

function changeQuantity(name, change) {

    const product = cart.find(item => item.name === name);

    if (!product) return;

    product.quantity += change;

    if (product.quantity <= 0) {
        removeFromCart(name);
        return;
    }

    updateCart();
}

function updateCart() {

    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const totalPrice = document.getElementById("total-price");

    cartItems.innerHTML = "";

    let total = 0;
    let totalItems = 0;

    cart.forEach(item => {

        total += item.price * item.quantity;
        totalItems += item.quantity;

        let div = document.createElement("div");
        div.classList.add("cart-item");

        div.innerHTML = `
            <div class="cart-product-info">
                <p class="cart-product-name">${item.name}</p>

                <div class="cart-quantity">
                    <button onclick="changeQuantity('${item.name}', -1)">
                        -
                    </button>

                    <span>${item.quantity}</span>

                    <button onclick="changeQuantity('${item.name}', 1)">
                        +
                    </button>
                </div>
            </div>

            <div class="cart-right">
                <p>
                    R$ ${(item.price * item.quantity).toFixed(2)}
                </p>

                <button class="remove-btn"
                    onclick="removeFromCart('${item.name}')">
                    ✖
                </button>
            </div>
        `;

        cartItems.appendChild(div);
    });

    cartCount.innerText = totalItems;
    totalPrice.innerText = total.toFixed(2);
}

async function carregarProdutos() {
    try {
        const resposta = await fetch('produtos.json');
        const produtos = await resposta.json();
        exibirProdutos(produtos);
    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
    }
}
 
function exibirProdutos(produtos) {
    const container = document.getElementById('products-list');
    container.innerHTML = '';
 
    produtos.forEach(produto => {
        const card = document.createElement('div');
        card.classList.add('box');
 
        card.innerHTML = `
            <div class="image">
                <img src="${produto.imagem}" alt="${produto.nome}">
            </div>
            <div class="content">
                <h3>${produto.nome}</h3>
                <p>${produto.categoria}</p>
                <div class="price" style="font-size: 2rem; color: rgb(238, 87, 51); margin: 1rem 0;">
                    R$ ${produto.preco.toFixed(2)}
                </div>
                <button class="btn" onclick="addToCart('${produto.nome}', ${produto.preco})">
                    Comprar
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', carregarProdutos);
