document.addEventListener('DOMContentLoaded', function() {
    initHamburgerMenu();
    initCarousel();
    initSearch();
    initContactForm();
    initImageModal();
    initTouchOptimizations();
    initSmoothScroll();
});

// ===== MENU HAMBURGER =====
function initHamburgerMenu() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mainNav = document.getElementById('main-nav');
    
    if (hamburgerBtn && mainNav) {
        hamburgerBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('active');
            this.classList.toggle('active');
            
            // Gérer le scroll du body
            document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        });
        
        // Fermer le menu en cliquant sur un lien
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', function() {
                mainNav.classList.remove('active');
                hamburgerBtn.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
        
        // Fermer le menu en cliquant en dehors
        document.addEventListener('click', function(e) {
            if (mainNav.classList.contains('active') && 
                !mainNav.contains(e.target) && 
                !hamburgerBtn.contains(e.target)) {
                mainNav.classList.remove('active');
                hamburgerBtn.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }
}

// ===== CAROUSEL =====
function initCarousel() {
    const items = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.indicator');
    let currentIndex = 0;
    let interval;
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (!items.length) return;
    
    const carouselContainer = document.querySelector('.carousel-container');
    
    function showSlide(index) {
        if (index < 0) index = items.length - 1;
        if (index >= items.length) index = 0;
        
        items.forEach((item, i) => {
            item.style.display = i === index ? 'block' : 'none';
        });
        
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === index);
        });
        
        currentIndex = index;
    }
    
    function nextSlide() {
        showSlide((currentIndex + 1) % items.length);
    }
    
    function prevSlide() {
        showSlide((currentIndex - 1 + items.length) % items.length);
    }
    
    // Gestion du swipe pour mobile
    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            clearInterval(interval);
        }, { passive: true });
        
        carouselContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoSlide();
        }, { passive: true });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            nextSlide(); // Swipe gauche
        } else if (touchEndX > touchStartX + swipeThreshold) {
            prevSlide(); // Swipe droite
        }
    }
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            clearInterval(interval);
            showSlide(index);
            startAutoSlide();
        });
    });
    
    function startAutoSlide() {
        clearInterval(interval);
        interval = setInterval(nextSlide, 5000);
    }
    
    // Initialisation
    showSlide(0);
    startAutoSlide();
}

// ===== RECHERCHE =====
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    let searchTimeout;
    
    if (searchInput && searchBtn) {
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (this.value.length >= 2) {
                    performSearch();
                }
            }, 500);
        });
        
        searchBtn.addEventListener('click', performSearch);
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }
}

function performSearch() {
    const searchTerm = document.getElementById('search-input').value.trim();
    if (searchTerm) {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('recherche', searchTerm);
        window.location.href = currentUrl.toString();
    }
}

// ===== FORMULAIRE DE CONTACT =====
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Animation du bouton
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
            submitBtn.disabled = true;
            
            const nom = document.getElementById('nom').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            const messageDiv = document.getElementById('form-message');
            
            if (!nom || !email || !message) {
                showMessage(messageDiv, 'Veuillez remplir tous les champs obligatoires', 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                return;
            }
            
            // Simuler l'envoi du formulaire
            setTimeout(() => {
                showMessage(messageDiv, 'Message envoyé avec succès ! Nous vous répondrons rapidement.', 'success');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Fermer le clavier virtuel sur mobile
                if (document.activeElement && document.activeElement.blur) {
                    document.activeElement.blur();
                }
            }, 1500);
        });
    }
}

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = 'form-message ' + type;
    element.style.display = 'block';
    
    // Scroll vers le message
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

// ===== MODAL IMAGES =====
function initImageModal() {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const closeBtn = document.querySelector('.close-modal');
    const closeBtnAlt = document.querySelector('.modal-close-btn');
    const productImages = document.querySelectorAll('.product-image');
    let currentImageIndex = 0;
    
    if (!modal || !modalImg) return;
    
    // Ouvrir modal
    productImages.forEach((img, index) => {
        img.addEventListener('click', function(e) {
            e.preventDefault();
            currentImageIndex = index;
            modalImg.src = this.src;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Fermer modal
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeBtnAlt) closeBtnAlt.addEventListener('click', closeModal);
    
    // Fermer en cliquant hors de l'image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Fermer avec la touche Echap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });
}

// ===== OPTIMISATIONS TACTILES =====
function initTouchOptimizations() {
    // Empêcher le zoom sur double-tap pour les boutons
    const buttons = document.querySelectorAll('button, .btn-cta, .btn-secondary, .product-card');
    buttons.forEach(button => {
        button.addEventListener('touchstart', (e) => {
            // Pas de preventDefault ici pour ne pas bloquer le scroll
        }, { passive: true });
    });
    
    // Détection de l'orientation
    function handleOrientationChange() {
        if (window.innerHeight > window.innerWidth) {
            document.body.classList.add('portrait');
            document.body.classList.remove('landscape');
        } else {
            document.body.classList.add('landscape');
            document.body.classList.remove('portrait');
        }
    }
    
    window.addEventListener('resize', handleOrientationChange);
    handleOrientationChange();
    
    // Gérer le focus sur les champs de formulaire pour mobile
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            setTimeout(() => {
                this.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    });
}

// ===== SCROLL FLUIDE =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== LAZY LOADING DES IMAGES =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== GESTION DU RÉSEAU =====
window.addEventListener('offline', function() {
    showNetworkMessage('Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.', 'warning');
});

window.addEventListener('online', function() {
    showNetworkMessage('Connexion rétablie !', 'success');
});

function showNetworkMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `network-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 70px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'warning' ? '#ffc107' : '#28a745'};
        color: white;
        padding: 10px 20px;
        border-radius: 30px;
        z-index: 2000;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        animation: slideDown 0.3s ease-out;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}