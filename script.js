const products = [
            {
                id: 1,
                name: "MacBook Pro 13\"",
                price: 12999,
                originalPrice: 14999,
                category: "Ordinateurs",
                image: "fas fa-laptop",
                badge: "Promo",
                rating: 4.5
            },
            {
                id: 2,
                name: "iPhone 14 Pro",
                price: 11999,
                originalPrice: 12999,
                category: "Smartphones",
                image: "fas fa-mobile-alt",
                badge: "Nouveau",
                rating: 4.8
            },
            {
                id: 3,
                name: "Casque Gaming",
                price: 599,
                originalPrice: 799,
                category: "Accessoires",
                image: "fas fa-headphones",
                badge: "",
                rating: 4.2
            },
            {
                id: 4,
                name: "Souris Sans Fil",
                price: 199,
                originalPrice: 299,
                category: "Accessoires",
                image: "fas fa-mouse",
                badge: "Économisez 100Dhs",
                rating: 4.0
            },
            {
                id: 5,
                name: "Samsung Galaxy S23",
                price: 8999,
                originalPrice: 9999,
                category: "Smartphones",
                image: "fas fa-mobile-alt",
                badge: "Promo",
                rating: 4.6
            },
            {
                id: 6,
                name: "Clavier Mécanique",
                price: 449,
                originalPrice: 599,
                category: "Accessoires",
                image: "fas fa-keyboard",
                badge: "",
                rating: 4.3
            },
            {
                id: 7,
                name: "Dell XPS 15",
                price: 15999,
                originalPrice: 17999,
                category: "Ordinateurs",
                image: "fas fa-laptop",
                badge: "Meilleure vente",
                rating: 4.7
            },
            {
                id: 8,
                name: "iPad Air",
                price: 6999,
                originalPrice: 7999,
                category: "Smartphones",
                image: "fas fa-tablet-alt",
                badge: "Nouveau",
                rating: 4.4
            }
        ];

        // Cart data
        let cart = [];
        let cartCount = 0;
        let cartTotal = 0;

        // DOM Elements
        const productsGrid = document.getElementById('productsGrid');
        const cartToggle = document.getElementById('cartToggle');
        const cartSidebar = document.getElementById('cartSidebar');
        const closeCart = document.getElementById('closeCart');
        const overlay = document.getElementById('overlay');
        const cartItems = document.getElementById('cartItems');
        const cartTotalElement = document.getElementById('cartTotal');
        const cartCountElement = document.querySelector('.cart-count');

        // Generate products
        function generateProducts() {
            productsGrid.innerHTML = '';
            
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                
                productCard.innerHTML = `
                    <div class="product-img">
                        <i class="${product.image}"></i>
                        ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                    </div>
                    <div class="product-content">
                        <h3>${product.name}</h3>
                        <div class="product-price">
                            <span class="current-price">${product.price.toFixed(2)} Dhs</span>
                            ${product.originalPrice ? `<span class="original-price">${product.originalPrice.toFixed(2)} Dhs</span>` : ''}
                        </div>
                        <div class="product-rating">
                            ${generateRatingStars(product.rating)}
                        </div>
                        <div class="product-actions">
                            <button class="btn-add-cart" data-id="${product.id}">
                                <i class="fas fa-cart-plus"></i>
                                Ajouter au panier
                            </button>
                            <button class="btn-wishlist">
                                <i class="far fa-heart"></i>
                            </button>
                        </div>
                    </div>
                `;
                
                productsGrid.appendChild(productCard);
            });
            
            // Add event listeners to add to cart buttons
            document.querySelectorAll('.btn-add-cart').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    addToCart(productId);
                });
            });
        }

        // Generate rating stars
        function generateRatingStars(rating) {
            let stars = '';
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 !== 0;
            
            for (let i = 0; i < fullStars; i++) {
                stars += '<i class="fas fa-star"></i>';
            }
            
            if (hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            }
            
            const emptyStars = 5 - Math.ceil(rating);
            for (let i = 0; i < emptyStars; i++) {
                stars += '<i class="far fa-star"></i>';
            }
            
            return stars;
        }

        // Add to cart function
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            
            if (product) {
                const existingItem = cart.find(item => item.id === productId);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        quantity: 1
                    });
                }
                
                updateCart();
                showNotification(`${product.name} ajouté au panier`);
            }
        }

        // Remove from cart function
        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            updateCart();
        }

        // Update quantity function
        function updateQuantity(productId, change) {
            const item = cart.find(item => item.id === productId);
            
            if (item) {
                item.quantity += change;
                
                if (item.quantity <= 0) {
                    removeFromCart(productId);
                } else {
                    updateCart();
                }
            }
        }

        // Update cart UI
        function updateCart() {
            // Update cart count
            cartCount = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountElement.textContent = cartCount;
            
            // Update cart total
            cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            cartTotalElement.textContent = `${cartTotal.toFixed(2)} Dhs`;
            
            // Update cart items
            cartItems.innerHTML = '';
            
            if (cart.length === 0) {
                cartItems.innerHTML = '<p style="text-align: center; padding: 20px;">Votre panier est vide</p>';
                return;
            }
            
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                
                cartItem.innerHTML = `
                    <div class="cart-item-img">
                        <i class="${item.image}"></i>
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">${item.price.toFixed(2)} Dhs</div>
                        <div class="cart-item-actions">
                            <div class="quantity-control">
                                <button class="quantity-btn minus" data-id="${item.id}">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span>${item.quantity}</span>
                                <button class="quantity-btn plus" data-id="${item.id}">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <button class="remove-item" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                
                cartItems.appendChild(cartItem);
            });
            
            // Add event listeners to cart item buttons
            document.querySelectorAll('.quantity-btn.minus').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    updateQuantity(productId, -1);
                });
            });
            
            document.querySelectorAll('.quantity-btn.plus').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    updateQuantity(productId, 1);
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    removeFromCart(productId);
                });
            });
        }

        // Show notification
        function showNotification(message) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--success);
                color: white;
                padding: 15px 20px;
                border-radius: 5px;
                box-shadow: var(--shadow);
                z-index: 1200;
                transition: var(--transition);
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }

        cartToggle.addEventListener('click', () => {
            cartSidebar.classList.add('active');
            overlay.classList.add('active');
        });

        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            overlay.classList.remove('active');
        });

        overlay.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            overlay.classList.remove('active');
        });

        generateProducts();
        updateCart();