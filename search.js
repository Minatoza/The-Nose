// ==========================================
// SEARCH FUNCTIONALITY - search.js (FIXED)
// ==========================================

class SearchSystem {
  constructor() {
    this.products = [
      // Men's Fragrances
      { name: "Dior Sauvage Elixir", price: 20500, category: "men", brand: "Dior", image: "image/Dior Sauvage Elixir.png" },
      { name: "Tom Ford Bois Pacifique", price: 19500, category: "men", brand: "Tom Ford", image: "image/Tom Ford Bois Pacifique.png" },
      { name: "Creed Aventus", price: 10500, category: "men", brand: "Creed", image: "image/Creed Aventus.png" },
      { name: "Bleu de Chanel Parfum", price: 9500, category: "men", brand: "Chanel", image: "image/Bleu de Chanel Parfum.png" },
      { name: "Tom Ford Fucking Fabulous Parfum", price: 8200, category: "men", brand: "Tom Ford", image: "image/Tom Ford Fucking Fabulous Parfum.png" },
      { name: "Dior Fahrenheit Absolute", price: 7300, category: "vintage", brand: "Dior", image: "image/Dior Fahrenheit Absolute.png" },
      { name: "Chanel Antaeus", price: 9000, category: "vintage", brand: "Chanel", image: "image/Chanel Antaeus.png" },
      
      // Women's Fragrances
      { name: "Maison Francis Kurkdjian Baccarat Rouge 540", price: 5790, category: "women", brand: "Maison Francis Kurkdjian", image: "image/Maison Francis Kurkdjian Baccarat Rouge 540.png" },
      { name: "Chanel Coco Mademoiselle", price: 13999, category: "women", brand: "Chanel", image: "image/Chanel Coco Mademoiselle.png" },
      { name: "Dior J'adore", price: 7800, category: "women", brand: "Dior", image: "image/Dior J'adore.png" },
      { name: "Parfums de Marly Delina", price: 15390, category: "women", brand: "Parfums de Marly", image: "image/Parfums de Marly Delina.png" },
      { name: "Kayali Fleur Majesty Rose Royale", price: 7100, category: "women", brand: "Kayali", image: "image/Kayali Fleur Majesty Rose Royale.png" },
      { name: "Chanel No. 5", price: 13999, category: "women", brand: "Chanel", image: "image/Chanel No. 5.png" },
      { name: "Thierry Mugler Alien Essence Absolue", price: 6700, category: "vintage", brand: "Thierry Mugler", image: "image/Thierry Mugler Alien Essence Absolue.png" },
      { name: "Gucci Eau de Parfum II", price: 6200, category: "vintage", brand: "Gucci", image: "image/Gucci Eau de Parfum II.png" },
      { name: "Phlur Golden Rule", price: 9500, category: "women", brand: "Phlur", image: "image/Phlur Golden Rule.png" }
    ];

    this.searchDropdowns = [];
    try {
      this.initializeSearch();
    } catch (error) {
      console.error('Error initializing search system:', error);
    }
  }

  initializeSearch() {
    try {
      const searchInputs = document.querySelectorAll('.search-input');
      
      if (searchInputs.length === 0) {
        console.warn('No search inputs found');
        return;
      }

      searchInputs.forEach((input, index) => {
        try {
          // Create search results dropdown
          const dropdown = this.createSearchDropdown();
          input.parentElement.appendChild(dropdown);
          this.searchDropdowns.push(dropdown);

          // Search on input
          input.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length > 0) {
              this.performSearch(query, dropdown);
            } else {
              this.hideDropdown(dropdown);
            }
          });

          // Close dropdown when clicking outside
          document.addEventListener('click', (e) => {
            if (!input.parentElement.contains(e.target)) {
              this.hideDropdown(dropdown);
            }
          });

          // Handle Enter key
          input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const query = input.value.trim();
              if (query.length > 0) {
                this.redirectToShopWithSearch(query);
              }
            }
          });

          // Handle arrow keys for dropdown navigation
          input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
              e.preventDefault();
              this.handleDropdownNavigation(dropdown, e.key);
            }
          });
        } catch (error) {
          console.error('Error initializing search input:', error);
        }
      });

      // Run filter on shop page if it exists
      this.filterShopProducts();
    } catch (error) {
      console.error('Error in initializeSearch:', error);
    }
  }

  createSearchDropdown() {
    try {
      const dropdown = document.createElement('div');
      dropdown.className = 'search-dropdown';
      dropdown.setAttribute('role', 'listbox');
      dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        max-height: 400px;
        overflow-y: auto;
        z-index: 1001;
        display: none;
        margin-top: 0.5rem;
      `;
      return dropdown;
    } catch (error) {
      console.error('Error creating search dropdown:', error);
      return document.createElement('div');
    }
  }

  performSearch(query, dropdown) {
    try {
      const results = this.searchProducts(query);
      this.displayResults(results, dropdown, query);
    } catch (error) {
      console.error('Error performing search:', error);
    }
  }

  searchProducts(query) {
    try {
      if (!query || typeof query !== 'string') return [];

      const lowerQuery = query.toLowerCase();
      return this.products.filter(product => 
        product.name.toLowerCase().includes(lowerQuery) ||
        product.brand.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  displayResults(results, dropdown, query) {
    try {
      if (!dropdown) return;

      if (results.length === 0) {
        dropdown.innerHTML = `
          <div style="padding: 1.5rem; text-align: center; color: #999;" role="option">
            No products found for "${this.escapeHtml(query)}"
          </div>
        `;
        this.showDropdown(dropdown);
        return;
      }

      const maxResults = 5;
      const displayResults = results.slice(0, maxResults);
      
      let html = '';
      displayResults.forEach((product, index) => {
        html += `
          <div class="search-result-item" role="option" tabindex="${index === 0 ? '0' : '-1'}" style="
            padding: 1rem;
            border-bottom: 1px solid #eee;
            cursor: pointer;
            transition: background 0.2s;
            display: flex;
            align-items: center;
            gap: 1rem;
          " data-product-name="${this.escapeHtml(product.name)}">
            <img src="${this.escapeHtml(product.image)}" alt="${this.escapeHtml(product.name)}" style="
              width: 50px;
              height: 60px;
              object-fit: contain;
              border-radius: 5px;
            " loading="lazy">
            <div style="flex: 1;">
              <div style="font-weight: 600; color: #001153; margin-bottom: 0.25rem;">
                ${this.highlightQuery(product.name, query)}
              </div>
              <div style="font-size: 0.9rem; color: #666;">
                ${this.escapeHtml(product.brand)}
              </div>
            </div>
            <div style="font-weight: bold; color: #000;">
              ₱${product.price.toLocaleString()}
            </div>
          </div>
        `;
      });

      if (results.length > maxResults) {
        html += `
          <div style="padding: 1rem; text-align: center; color: #001153; font-weight: 500;">
            <a href="Shop.html?search=${encodeURIComponent(query)}" style="text-decoration: none; color: #001153;">
              View all ${results.length} results →
            </a>
          </div>
        `;
      }

      dropdown.innerHTML = html;

      // Add click handlers to results
      const resultItems = dropdown.querySelectorAll('.search-result-item');
      resultItems.forEach((item) => {
        item.addEventListener('click', () => {
          this.redirectToShopWithSearch(query);
        });
        
        // Hover effects
        item.addEventListener('mouseover', () => {
          item.style.background = '#f8f8f8';
        });
        item.addEventListener('mouseout', () => {
          item.style.background = 'white';
        });
      });

      this.showDropdown(dropdown);
    } catch (error) {
      console.error('Error displaying results:', error);
    }
  }

  handleDropdownNavigation(dropdown, key) {
    try {
      const items = dropdown.querySelectorAll('.search-result-item');
      if (items.length === 0) return;

      let focused = document.activeElement;
      if (!dropdown.contains(focused)) {
        items[0].focus();
        return;
      }

      const currentIndex = Array.from(items).indexOf(focused);
      let nextIndex = currentIndex;

      if (key === 'ArrowDown') {
        nextIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
      } else if (key === 'ArrowUp') {
        nextIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
      }

      items[nextIndex].focus();
    } catch (error) {
      console.error('Error handling dropdown navigation:', error);
    }
  }

  escapeHtml(text) {
    try {
      if (!text) return '';
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return String(text).replace(/[&<>"']/g, m => map[m]);
    } catch (error) {
      console.error('Error escaping HTML:', error);
      return '';
    }
  }

  highlightQuery(text, query) {
    try {
      if (!text || !query) return this.escapeHtml(text);
      
      const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
      const escaped = this.escapeHtml(text);
      return escaped.replace(regex, '<span style="background: #fff3cd;">$1</span>');
    } catch (error) {
      console.error('Error highlighting query:', error);
      return this.escapeHtml(text);
    }
  }

  escapeRegex(string) {
    try {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    } catch (error) {
      console.error('Error escaping regex:', error);
      return '';
    }
  }

  showDropdown(dropdown) {
    if (dropdown) {
      dropdown.style.display = 'block';
    }
  }

  hideDropdown(dropdown) {
    if (dropdown) {
      dropdown.style.display = 'none';
    }
  }

  redirectToShopWithSearch(query) {
    try {
      if (!query || typeof query !== 'string') return;
      window.location.href = `Shop.html?search=${encodeURIComponent(query)}`;
    } catch (error) {
      console.error('Error redirecting to shop:', error);
    }
  }

  // ==========================================
  // SHOP PAGE SEARCH FILTER
  // ==========================================
  filterShopProducts() {
    try {
      if (!window.location.pathname.includes('Shop.html')) {
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const searchQuery = urlParams.get('search');
      
      if (!searchQuery) return;

      const productCards = document.querySelectorAll('.product-card');
      if (productCards.length === 0) return;

      const lowerQuery = searchQuery.toLowerCase();
      let visibleCount = 0;

      productCards.forEach(card => {
        try {
          const productName = card.querySelector('h4');
          if (!productName) return;

          const productNameText = productName.textContent.toLowerCase();
          
          if (productNameText.includes(lowerQuery)) {
            card.style.display = 'flex';
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        } catch (error) {
          console.error('Error filtering product card:', error);
        }
      });

      // Show search info message
      this.displaySearchResultsMessage(searchQuery, visibleCount);
    } catch (error) {
      console.error('Error filtering shop products:', error);
    }
  }

  displaySearchResultsMessage(searchQuery, visibleCount) {
    try {
      const shopSection = document.querySelector('.shop-section');
      const existingMessage = document.getElementById('searchResultMessage');

      if (existingMessage) {
        try {
          existingMessage.remove();
        } catch (e) {
          console.warn('Error removing existing message:', e);
        }
      }

      if (!shopSection) return;

      const message = document.createElement('div');
      message.id = 'searchResultMessage';
      message.setAttribute('role', 'status');
      message.setAttribute('aria-live', 'polite');
      message.style.cssText = `
        background: #f0f8ff;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        margin-bottom: 2rem;
        border-left: 4px solid #001153;
      `;
      
      message.innerHTML = `
        <strong>Search results for "${this.escapeHtml(searchQuery)}"</strong> - ${visibleCount} product${visibleCount !== 1 ? 's' : ''} found
        <button onclick="window.location.href='Shop.html'" style="
          margin-left: 1rem;
          padding: 0.3rem 1rem;
          background: #001153;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background 0.3s;
        " aria-label="Clear search and view all products">Clear Search</button>
      `;

      // Add hover effect to button
      const btn = message.querySelector('button');
      if (btn) {
        btn.addEventListener('mouseover', () => btn.style.background = '#000a2e');
        btn.addEventListener('mouseout', () => btn.style.background = '#001153');
      }
      
      const shopContainer = document.querySelector('.shop-container');
      if (shopContainer) {
        shopSection.insertBefore(message, shopContainer);
      }
    } catch (error) {
      console.error('Error displaying search results message:', error);
    }
  }
}

// Initialize search when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    window.searchSystem = new SearchSystem();
    console.log('Search system initialized successfully');
  } catch (error) {
    console.error('Failed to initialize search system:', error);
  }
});