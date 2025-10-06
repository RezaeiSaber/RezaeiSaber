// Modern Portfolio JS
class PortfolioApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupScrollEffects();
    this.setupSmoothScroll();
    this.setupTypingEffect();
    this.setupObserver();
  }

  // Navigation functionality
  setupNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('.header');

    // Mobile menu toggle
    if (navToggle) {
      navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
      });
    }

    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });

    // Header scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Update active nav link
      this.updateActiveNavLink();
    });
  }

  // Update active navigation link based on scroll position
  updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    let current = '';
    const scrollPosition = window.scrollY + headerHeight + 50;
    
    // Check if we're at the very top
    if (window.scrollY < 100) {
      current = 'home';
    } else {
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        // Special handling for hero section
        if (section.id === 'home') {
          if (scrollPosition < sectionTop + sectionHeight - 200) {
            current = 'home';
          }
        } else {
          // Improved boundary detection for other sections
          const sectionBottom = sectionTop + sectionHeight;
          if (scrollPosition >= sectionTop - 100 && scrollPosition < sectionBottom - 100) {
            current = section.getAttribute('id');
          }
        }
      });
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  // Smooth scrolling for navigation links
  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
          const headerHeight = document.querySelector('.header').offsetHeight;
          let targetPosition;
          
          // Special handling for home section
          if (this.getAttribute('href') === '#home') {
            targetPosition = 0;
          } else {
            // Improved calculation for other sections with better spacing
            targetPosition = target.offsetTop - headerHeight - 20;
          }
          
          window.scrollTo({
            top: Math.max(0, targetPosition), // Ensure we don't scroll to negative position
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Typing effect for hero section
  setupTypingEffect() {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (!heroSubtitle) return;

    const text = heroSubtitle.textContent;
    heroSubtitle.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        heroSubtitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    };

    // Start typing effect after a delay
    setTimeout(typeWriter, 1000);
  }

  // Intersection Observer for animations
  setupObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.card, .timeline-item, .publication, .stats').forEach(el => {
      observer.observe(el);
    });
  }

  // Scroll effects
  setupScrollEffects() {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallax = document.querySelector('.hero');
      
      if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
      }
    });
  }
}

// Publication modal functionality
class PublicationModal {
  constructor() {
    this.modal = null;
    this.init();
  }

  init() {
    this.createModal();
    this.bindEvents();
  }

  createModal() {
    const modalHTML = `
      <div id="publicationModal" class="modal" style="display: none;">
        <div class="modal-overlay"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h3>Abstract</h3>
            <button class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            <p id="modalAbstract"></p>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modal = document.getElementById('publicationModal');
  }

  bindEvents() {
    // Abstract buttons - improved selectors
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-abstract') || 
          (e.target.closest('button') && e.target.closest('button').classList.contains('btn-abstract'))) {
        const button = e.target.classList.contains('btn-abstract') ? e.target : e.target.closest('button');
        const abstract = button.dataset.abstract;
        if (abstract) {
          this.showModal(abstract);
        }
      }
      
      // Handle generic abstract buttons without specific class
      if (e.target.dataset.abstract || (e.target.closest('button') && e.target.closest('button').dataset.abstract)) {
        const button = e.target.dataset.abstract ? e.target : e.target.closest('button');
        const abstract = button.dataset.abstract;
        if (abstract) {
          this.showModal(abstract);
        }
      }
    });

    // Close modal
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-close') || e.target.classList.contains('modal-overlay')) {
        this.hideModal();
      }
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal && this.modal.style.display === 'block') {
        this.hideModal();
      }
    });
  }

  showModal(abstract) {
    document.getElementById('modalAbstract').textContent = abstract;
    this.modal.style.display = 'flex';
    this.modal.style.alignItems = 'center';
    this.modal.style.justifyContent = 'center';
    document.body.style.overflow = 'hidden';
    
    // Add animation
    setTimeout(() => {
      const content = this.modal.querySelector('.modal-content');
      if (content) {
        content.classList.add('animate-in');
      }
    }, 10);
  }

  hideModal() {
    this.modal.style.display = 'none';
    const content = this.modal.querySelector('.modal-content');
    if (content) {
      content.classList.remove('animate-in');
    }
    document.body.style.overflow = '';
  }
}

// PDF Viewer functionality
class PDFViewer {
  constructor() {
    this.modal = null;
    this.init();
  }

  init() {
    this.createModal();
    this.bindEvents();
  }

  createModal() {
    const modalHTML = `
      <div id="pdfModal" class="pdf-modal" style="display: none;">
        <div class="pdf-modal-overlay"></div>
        <div class="pdf-modal-content">
          <div class="pdf-modal-header">
            <h3 id="pdfModalTitle">PDF Viewer</h3>
            <div class="pdf-controls">
              <a id="pdfDownloadLink" class="btn btn-outline btn-small" target="_blank">
                <i class="fas fa-download"></i> Download
              </a>
              <button class="pdf-modal-close">&times;</button>
            </div>
          </div>
          <div class="pdf-modal-body">
            <iframe id="pdfViewer" src="" style="width: 100%; height: 100%; border: none;"></iframe>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modal = document.getElementById('pdfModal');
  }

  bindEvents() {
    // PDF view buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-pdf-view') || 
          (e.target.closest('a') && e.target.closest('a').classList.contains('btn-pdf-view'))) {
        e.preventDefault();
        const link = e.target.classList.contains('btn-pdf-view') ? e.target : e.target.closest('a');
        const pdfUrl = link.href;
        const title = link.dataset.title || 'PDF Document';
        if (pdfUrl) {
          this.showPDF(pdfUrl, title);
        }
      }
    });

    // Close modal
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('pdf-modal-close') || e.target.classList.contains('pdf-modal-overlay')) {
        this.hidePDF();
      }
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal && this.modal.style.display === 'block') {
        this.hidePDF();
      }
    });
  }

  showPDF(pdfUrl, title) {
    document.getElementById('pdfModalTitle').textContent = title;
    document.getElementById('pdfViewer').src = pdfUrl;
    document.getElementById('pdfDownloadLink').href = pdfUrl;
    this.modal.style.display = 'flex';
    this.modal.style.alignItems = 'center';
    this.modal.style.justifyContent = 'center';
    document.body.style.overflow = 'hidden';
    
    // Add animation
    setTimeout(() => {
      const content = this.modal.querySelector('.pdf-modal-content');
      if (content) {
        content.classList.add('animate-in');
      }
    }, 10);
  }

  hidePDF() {
    this.modal.style.display = 'none';
    const content = this.modal.querySelector('.pdf-modal-content');
    if (content) {
      content.classList.remove('animate-in');
    }
    document.getElementById('pdfViewer').src = '';
    document.body.style.overflow = '';
  }
}

// Statistics counter animation
class StatsCounter {
  constructor() {
    this.animated = false;
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animated) {
          this.animateCounters();
          this.animated = true;
        }
      });
    });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
      observer.observe(statsSection);
    }
  }

  animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
      const target = parseInt(counter.textContent.replace('+', ''));
      const increment = target / 50;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target + (counter.textContent.includes('+') ? '+' : '');
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current) + (counter.textContent.includes('+') ? '+' : '');
        }
      }, 20);
    });
  }
}

// Contact form handler
class ContactForm {
  constructor() {
    this.init();
  }

  init() {
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
      item.addEventListener('click', () => {
        const link = item.querySelector('a');
        if (link) {
          link.click();
        }
      });
    });
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
  new PublicationModal();
  new PDFViewer();
  new StatsCounter();
  new ContactForm();
});

// Add modal styles dynamically
const modalStyles = `
<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  position: relative;
  z-index: 1;
  margin: auto;
  transform: translateY(0);
}

.modal-header {
  padding: var(--space-lg);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--primary-gradient);
  color: white;
}

.modal-header h3 {
  margin: 0;
  color: white;
}

.modal-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: var(--transition-fast);
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.1);
}

.modal-body {
  padding: var(--space-lg);
  overflow-y: auto;
  max-height: 60vh;
  line-height: 1.7;
}

/* PDF Modal Styles */
.pdf-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.pdf-modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
}

.pdf-modal-content {
  background: white;
  border-radius: 16px;
  width: 95%;
  height: 90vh;
  max-width: 1200px;
  max-height: 800px;
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  margin: auto;
  transform: translateY(0);
}

.pdf-modal-header {
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--primary-gradient);
  color: white;
  flex-shrink: 0;
}

.pdf-modal-header h3 {
  margin: 0;
  color: white;
  font-size: 1.2rem;
}

.pdf-controls {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.pdf-modal-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: var(--transition-fast);
}

.pdf-modal-close:hover {
  background: rgba(255, 255, 255, 0.1);
}

.pdf-modal-body {
  flex: 1;
  overflow: hidden;
  background: #f5f5f5;
}

.btn-small {
  padding: 8px 16px;
  font-size: 0.85rem;
}

.animate-in {
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Center modals properly on all screen sizes */
@media (max-width: 768px) {
  .pdf-modal-content {
    width: 98%;
    height: 95vh;
    margin: auto;
  }
  
  .modal-content {
    width: 95%;
    margin: auto;
  }
  
  .pdf-controls {
    gap: var(--space-xs);
  }
  
  .pdf-modal, .modal {
    align-items: center;
    justify-content: center;
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .modal-content {
    width: 98%;
    max-height: 85vh;
  }
  
  .pdf-modal-content {
    width: 100%;
    height: 100vh;
    border-radius: 0;
    max-width: none;
    max-height: none;
  }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', modalStyles);
