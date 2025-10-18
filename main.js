// ==========================================
// MAIN UI INTERACTIONS - main.js (FIXED)
// ==========================================

class UIController {
  constructor() {
    this.mobileMenuOpen = false;
    this.init();
  }

  init() {
    try {
      this.createMobileMenuToggle();
      this.initializeMobileMenu();
      this.initializeScrollEffects();
      this.initializeSmoothScroll();
      this.initializeFormValidation();
      this.initializeNavigationActiveState();
      this.initializeKeyboardNavigation();
    } catch (error) {
      console.error('Error initializing UI Controller:', error);
    }
  }

  // ==========================================
  // NAVIGATION ACTIVE STATE
  // ==========================================
  initializeNavigationActiveState() {
    try {
      const navLinks = document.querySelectorAll('.nav-links a[data-page]');
      const currentPage = this.getCurrentPage();
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === currentPage) {
          link.classList.add('active');
        }
      });
    } catch (error) {
      console.error('Error setting navigation active state:', error);
    }
  }

  getCurrentPage() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('shop')) return 'shop';
    if (path.includes('brand')) return 'brand';
    if (path.includes('register')) return 'register';
    return 'home';
  }

  // ==========================================
  // KEYBOARD NAVIGATION
  // ==========================================
  initializeKeyboardNavigation() {
    try {
      // Close cart with Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const cartSidebar = document.getElementById('cartSidebar');
          if (cartSidebar && cartSidebar.classList.contains('open')) {
            if (window.shoppingCart) {
              window.shoppingCart.toggleCartSidebar();
            }
          }
          // Also close mobile menu
          if (this.mobileMenuOpen) {
            this.closeMobileMenu();
          }
        }
      });

      // Handle Enter key for category cards
      const categoryCards = document.querySelectorAll('.category-card');
      categoryCards.forEach(card => {
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.click();
          }
        });
      });
    } catch (error) {
      console.error('Error initializing keyboard navigation:', error);
    }
  }

  // ==========================================
  // MOBILE MENU
  // ==========================================
  createMobileMenuToggle() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    if (!toggle) {
      console.warn('Mobile menu toggle button not found in HTML');
    }
  }

  initializeMobileMenu() {
    try {
      const toggle = document.querySelector('.mobile-menu-toggle');
      const navLinks = document.querySelector('.nav-links');
      
      if (!toggle || !navLinks) return;

      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMobileMenu();
      });

      const links = navLinks.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('click', () => {
          if (window.innerWidth <= 767) {
            this.closeMobileMenu();
          }
        });
      });

      document.addEventListener('click', (e) => {
        if (this.mobileMenuOpen && 
            !navLinks.contains(e.target) && 
            !toggle.contains(e.target)) {
          this.closeMobileMenu();
        }
      });

      window.addEventListener('resize', () => {
        if (window.innerWidth > 767 && this.mobileMenuOpen) {
          this.closeMobileMenu();
        }
      });
    } catch (error) {
      console.error('Error initializing mobile menu:', error);
    }
  }

  toggleMobileMenu() {
    try {
      const toggle = document.querySelector('.mobile-menu-toggle');
      const navLinks = document.querySelector('.nav-links');
      
      if (!toggle || !navLinks) return;

      this.mobileMenuOpen = !this.mobileMenuOpen;
      toggle.classList.toggle('active');
      toggle.setAttribute('aria-expanded', this.mobileMenuOpen);
      navLinks.classList.toggle('active');
      document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : 'auto';
    } catch (error) {
      console.error('Error toggling mobile menu:', error);
    }
  }

  closeMobileMenu() {
    try {
      const toggle = document.querySelector('.mobile-menu-toggle');
      const navLinks = document.querySelector('.nav-links');
      
      if (!toggle || !navLinks) return;

      this.mobileMenuOpen = false;
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', false);
      navLinks.classList.remove('active');
      document.body.style.overflow = 'auto';
    } catch (error) {
      console.error('Error closing mobile menu:', error);
    }
  }

  // ==========================================
  // SCROLL EFFECTS
  // ==========================================
  initializeScrollEffects() {
    try {
      const nav = document.querySelector('nav');
      if (!nav) return;

      window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
          nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
        } else {
          nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
        }
      });
    } catch (error) {
      console.error('Error initializing scroll effects:', error);
    }
  }

  // ==========================================
  // SMOOTH SCROLL
  // ==========================================
  initializeSmoothScroll() {
    try {
      const links = document.querySelectorAll('a[href^="#"]');
      
      links.forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (href === '#' || href === '#about') {
            const target = document.querySelector(href);
            if (target) {
              e.preventDefault();
              const offset = 80;
              const targetPosition = target.offsetTop - offset;

              window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
              });

              if (this.mobileMenuOpen) {
                this.closeMobileMenu();
              }
            }
          }
        });
      });
    } catch (error) {
      console.error('Error initializing smooth scroll:', error);
    }
  }

  // ==========================================
  // FORM VALIDATION & SANITIZATION
  // ==========================================
  initializeFormValidation() {
    try {
      const forms = document.querySelectorAll('form');
      
      forms.forEach(form => {
        form.addEventListener('submit', (e) => {
          // Newsletter forms
          if (form.id === 'newsletterForm') {
            e.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            
            if (emailInput && this.validateEmail(emailInput.value)) {
              this.showNotification('Thank you for subscribing!', 'success');
              form.reset();
            } else {
              this.showNotification('Please enter a valid email address', 'error');
            }
          }

          // Register form
          if (form.classList.contains('register-form')) {
            e.preventDefault();
            if (this.validateRegisterForm(form)) {
              this.showNotification('Registration successful! Redirecting...', 'success');
              setTimeout(() => {
                window.location.href = 'Home.html';
              }, 2000);
            }
          }
        });
      });
    } catch (error) {
      console.error('Error initializing form validation:', error);
    }
  }

  validateEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  }

  sanitizeInput(input) {
    if (!input || typeof input !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  validateRegisterForm(form) {
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
      const value = input.value.trim();
      
      if (!value) {
        this.showInputError(input, 'This field is required');
        isValid = false;
      } else if (input.type === 'email' && !this.validateEmail(value)) {
        this.showInputError(input, 'Please enter a valid email');
        isValid = false;
      } else if (input.type === 'text' && value.length < 2) {
        this.showInputError(input, 'Must be at least 2 characters');
        isValid = false;
      } else if (input.type === 'tel' && !/^\+?[\d\s\-()]+$/.test(value)) {
        this.showInputError(input, 'Please enter a valid phone number');
        isValid = false;
      } else {
        this.clearInputError(input);
      }
    });

    const passwordInputs = form.querySelectorAll('input[type="password"]');
    if (passwordInputs.length >= 2) {
      const password = passwordInputs[0];
      const confirmPassword = passwordInputs[1];
      
      if (password.value !== confirmPassword.value) {
        this.showInputError(confirmPassword, 'Passwords do not match');
        isValid = false;
      } else if (password.value.length < 6) {
        this.showInputError(password, 'Password must be at least 6 characters');
        isValid = false;
      }
    }

    const termsCheckbox = form.querySelector('input[type="checkbox"][required]');
    if (termsCheckbox && !termsCheckbox.checked) {
      this.showNotification('Please accept the terms and conditions', 'error');
      isValid = false;
    }

    return isValid;
  }

  showInputError(input, message) {
    if (!input) return;
    
    input.style.borderColor = '#ff4444';
    input.setAttribute('aria-invalid', 'true');
    
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) existingError.remove();

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.style.cssText = 'color: #ff4444; font-size: 0.85rem; margin-top: 0.25rem;';
    errorDiv.textContent = message;
    input.parentNode.appendChild(errorDiv);
  }

  clearInputError(input) {
    if (!input) return;
    
    input.style.borderColor = '#ccc';
    input.setAttribute('aria-invalid', 'false');
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) errorMessage.remove();
  }

  showNotification(message, type = 'success') {
    if (!message || typeof message !== 'string') return;
    
    try {
      const existing = document.querySelectorAll('.ui-notification');
      existing.forEach(el => {
        try {
          el.remove();
        } catch (e) {
          console.warn('Error removing notification:', e);
        }
      });

      const notification = document.createElement('div');
      notification.className = 'ui-notification';
      notification.setAttribute('role', 'alert');
      notification.setAttribute('aria-live', 'polite');
      notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 2rem;
        background: ${type === 'success' ? '#4caf50' : '#ff4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10001;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
      `;
      notification.textContent = this.sanitizeInput(message);
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
      }, 10);

      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
          try {
            notification.remove();
          } catch (e) {
            console.warn('Error removing notification:', e);
          }
        }, 300);
      }, 3000);
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }
}

// ==========================================
// INITIALIZE ON DOM LOAD
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  try {
    window.uiController = new UIController();
    console.log('UI Controller initialized successfully');
  } catch (error) {
    console.error('Failed to initialize UI Controller:', error);
  }
});