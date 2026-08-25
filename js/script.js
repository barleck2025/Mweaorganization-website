/**
 * ============================================================
 * MWEA - MAIN JAVASCRIPT
 * Version: 4.0 - Redesigned
 * ============================================================
 */

(function() {
  'use strict';

  // ============================================================
  // DOM READY
  // ============================================================
  document.addEventListener('DOMContentLoaded', function() {
    initHeader();
    initMobileNav();
    initSearch();
    initHeroCarousel();
    initCounters();
    initTestimonials();
    initContactForm();
    initScrollAnimations();
    initSmoothScroll();
    initYear();
    initDonationButtons();
    initSubjectFromURL();
  });

  // ============================================================
  // HEADER SCROLL EFFECT
  // ============================================================
  function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ============================================================
  // MOBILE NAVIGATION
  // ============================================================
  function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navClose = document.getElementById('navClose');
    const primaryNav = document.getElementById('primaryNav');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    if (!navToggle || !primaryNav) return;
    
    function toggleNav(open) {
      primaryNav.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    }
    
    navToggle.addEventListener('click', function() {
      toggleNav(!primaryNav.classList.contains('open'));
    });
    
    if (navClose) {
      navClose.addEventListener('click', function() {
        toggleNav(false);
      });
    }
    
    document.addEventListener('click', function(e) {
      if (primaryNav.classList.contains('open') && 
          !primaryNav.contains(e.target) && 
          !navToggle.contains(e.target)) {
        toggleNav(false);
      }
    });
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && primaryNav.classList.contains('open')) {
        toggleNav(false);
      }
    });
    
    dropdownToggles.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        const li = btn.closest('.has-dropdown');
        if (li) {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('open');
          const expanded = li.classList.contains('open');
          btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        }
      });
    });
    
    primaryNav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        if (primaryNav.classList.contains('open')) {
          toggleNav(false);
        }
      });
    });
  }

  // ============================================================
  // SEARCH ENGINE
  // ============================================================
  function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchClear = document.getElementById('searchClear');
    
    if (!searchInput || !searchResults) return;
    
    const pages = [
      { title: 'Home', url: 'index.html', icon: 'fa-home', desc: 'MWEA homepage' },
      { title: 'About Us', url: 'about.html', icon: 'fa-info-circle', desc: 'Learn about our mission and vision' },
      { title: 'Projects', url: 'projects.html', icon: 'fa-project-diagram', desc: 'Our community projects' },
      { title: 'Gallery', url: 'gallery.html', icon: 'fa-images', desc: 'Photos from our work' },
      { title: 'Contact', url: 'contact.html', icon: 'fa-envelope', desc: 'Get in touch with us' }
    ];
    
    function performSearch(query) {
      const q = query.toLowerCase().trim();
      if (q.length < 1) {
        searchResults.classList.remove('active');
        if (searchClear) searchClear.classList.remove('visible');
        return;
      }
      
      const results = pages.filter(function(page) {
        return page.title.toLowerCase().includes(q) || 
               page.desc.toLowerCase().includes(q);
      });
      
      renderResults(results, q);
      if (searchClear) searchClear.classList.add('visible');
    }
    
    function renderResults(results, query) {
      if (results.length === 0) {
        searchResults.innerHTML = `
          <div style="padding:1rem;text-align:center;color:var(--gray-500);">
            <i class="fas fa-search" style="display:block;font-size:1.5rem;margin-bottom:0.5rem;"></i>
            No results found for "<strong>${query}</strong>"
          </div>
        `;
        searchResults.classList.add('active');
        return;
      }
      
      let html = '';
      results.forEach(function(page) {
        html += `
          <a href="${page.url}" class="search-result-item">
            <i class="fas ${page.icon}"></i>
            <div>
              <div class="result-title">${page.title}</div>
              <div class="result-desc">${page.desc}</div>
            </div>
            <span class="result-tag">page</span>
          </a>
        `;
      });
      
      searchResults.innerHTML = html;
      searchResults.classList.add('active');
    }
    
    searchInput.addEventListener('input', function() {
      performSearch(this.value);
    });
    
    searchInput.addEventListener('focus', function() {
      if (this.value.trim().length > 0) {
        performSearch(this.value);
      }
    });
    
    if (searchClear) {
      searchClear.addEventListener('click', function() {
        searchInput.value = '';
        searchResults.classList.remove('active');
        searchClear.classList.remove('visible');
        searchInput.focus();
      });
    }
    
    document.addEventListener('click', function(e) {
      const container = searchInput.closest('.search-container');
      if (container && !container.contains(e.target)) {
        searchResults.classList.remove('active');
      }
    });
    
    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
      }
    });
  }

  // ============================================================
  // HERO CAROUSEL
  // ============================================================
  function initHeroCarousel() {
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDotsContainer = document.getElementById('heroDots');
    const heroPrev = document.getElementById('heroPrev');
    const heroNext = document.getElementById('heroNext');
    
    if (heroSlides.length === 0 || !heroDotsContainer) return;
    
    let heroCurrent = 0;
    let heroInterval;
    const INTERVAL_MS = 6000;
    
    heroSlides.forEach(function(_, i) {
      const dot = document.createElement('button');
      dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', function() {
        goToHeroSlide(i);
        resetHeroAutoplay();
      });
      heroDotsContainer.appendChild(dot);
    });
    
    const heroDots = heroDotsContainer.querySelectorAll('.hero-dot');
    
    function goToHeroSlide(index) {
      heroSlides.forEach(function(s, i) {
        s.classList.toggle('active', i === index);
      });
      heroDots.forEach(function(d, i) {
        d.classList.toggle('active', i === index);
      });
      heroCurrent = index;
    }
    
    function nextHeroSlide() {
      goToHeroSlide((heroCurrent + 1) % heroSlides.length);
    }
    
    function prevHeroSlide() {
      goToHeroSlide((heroCurrent - 1 + heroSlides.length) % heroSlides.length);
    }
    
    function startHeroAutoplay() {
      if (heroInterval) clearInterval(heroInterval);
      heroInterval = setInterval(nextHeroSlide, INTERVAL_MS);
    }
    
    function stopHeroAutoplay() {
      if (heroInterval) {
        clearInterval(heroInterval);
        heroInterval = null;
      }
    }
    
    function resetHeroAutoplay() {
      stopHeroAutoplay();
      startHeroAutoplay();
    }
    
    if (heroPrev) {
      heroPrev.addEventListener('click', function() {
        prevHeroSlide();
        resetHeroAutoplay();
      });
    }
    
    if (heroNext) {
      heroNext.addEventListener('click', function() {
        nextHeroSlide();
        resetHeroAutoplay();
      });
    }
    
    const heroCarousel = document.getElementById('heroCarousel');
    if (heroCarousel) {
      heroCarousel.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          nextHeroSlide();
          resetHeroAutoplay();
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prevHeroSlide();
          resetHeroAutoplay();
        }
      });
      
      heroCarousel.addEventListener('mouseenter', stopHeroAutoplay);
      heroCarousel.addEventListener('mouseleave', startHeroAutoplay);
    }
    
    goToHeroSlide(0);
    startHeroAutoplay();
  }

  // ============================================================
  // COUNTERS (Updated numbers from document)
  // ============================================================
  function initCounters() {
    const counters = [
      { el: document.getElementById('counterPeople'), target: 25000 },
      { el: document.getElementById('counterWomen'), target: 10000 },
      { el: document.getElementById('counterYouth'), target: 5000 },
      { el: document.getElementById('counterProjects'), target: 50 }
    ];
    
    const validCounters = counters.filter(function(c) { return c.el !== null; });
    if (validCounters.length === 0) return;
    
    let animated = false;
    
    function animateCounters() {
      if (animated) return;
      animated = true;
      
      validCounters.forEach(function(counter) {
        const el = counter.el;
        const target = counter.target;
        let current = 0;
        const step = Math.ceil(target / 60);
        
        const timer = setInterval(function() {
          current += step;
          if (current >= target) {
            el.textContent = target.toLocaleString() + '+';
            clearInterval(timer);
          } else {
            el.textContent = current.toLocaleString();
          }
        }, 25);
      });
    }
    
    const counterSection = document.querySelector('.counter-section');
    if (counterSection) {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            animateCounters();
          }
        });
      }, { threshold: 0.3 });
      observer.observe(counterSection);
    } else {
      setTimeout(animateCounters, 1000);
    }
  }

  // ============================================================
  // TESTIMONIALS
  // ============================================================
  function initTestimonials() {
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const testimonialDotsContainer = document.getElementById('testimonialDots');
    const testimonialPrev = document.getElementById('prevTestimonial');
    const testimonialNext = document.getElementById('nextTestimonial');
    
    if (testimonialSlides.length === 0 || !testimonialDotsContainer) return;
    
    let testimonialCurrent = 0;
    let testimonialInterval;
    const INTERVAL_MS = 5000;
    
    testimonialSlides.forEach(function(_, i) {
      const dot = document.createElement('button');
      dot.className = (i === 0 ? 'active' : '');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      dot.addEventListener('click', function() {
        goToTestimonial(i);
        resetTestimonialAutoplay();
      });
      testimonialDotsContainer.appendChild(dot);
    });
    
    const testimonialDots = testimonialDotsContainer.querySelectorAll('button');
    
    function goToTestimonial(index) {
      testimonialSlides.forEach(function(s, i) {
        s.classList.toggle('active', i === index);
      });
      testimonialDots.forEach(function(d, i) {
        d.classList.toggle('active', i === index);
      });
      testimonialCurrent = index;
    }
    
    function nextTestimonial() {
      goToTestimonial((testimonialCurrent + 1) % testimonialSlides.length);
    }
    
    function prevTestimonial() {
      goToTestimonial((testimonialCurrent - 1 + testimonialSlides.length) % testimonialSlides.length);
    }
    
    function startTestimonialAutoplay() {
      if (testimonialInterval) clearInterval(testimonialInterval);
      testimonialInterval = setInterval(nextTestimonial, INTERVAL_MS);
    }
    
    function stopTestimonialAutoplay() {
      if (testimonialInterval) {
        clearInterval(testimonialInterval);
        testimonialInterval = null;
      }
    }
    
    function resetTestimonialAutoplay() {
      stopTestimonialAutoplay();
      startTestimonialAutoplay();
    }
    
    if (testimonialPrev) {
      testimonialPrev.addEventListener('click', function() {
        prevTestimonial();
        resetTestimonialAutoplay();
      });
    }
    
    if (testimonialNext) {
      testimonialNext.addEventListener('click', function() {
        nextTestimonial();
        resetTestimonialAutoplay();
      });
    }
    
    const testimonialCarousel = document.querySelector('.testimonial-carousel');
    if (testimonialCarousel) {
      testimonialCarousel.addEventListener('mouseenter', stopTestimonialAutoplay);
      testimonialCarousel.addEventListener('mouseleave', startTestimonialAutoplay);
      
      testimonialCarousel.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          nextTestimonial();
          resetTestimonialAutoplay();
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prevTestimonial();
          resetTestimonialAutoplay();
        }
      });
    }
    
    goToTestimonial(0);
    startTestimonialAutoplay();
  }

  // ============================================================
  // CONTACT FORM
  // ============================================================
  function initContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitBtn = form.querySelector('.btn');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;
      
      if (status) {
        status.className = '';
        status.style.display = 'block';
        status.textContent = 'Sending your message...';
      }
      
      const formData = new FormData(form);
      
      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(function(response) {
        if (response.ok) {
          if (status) {
            status.className = 'success';
            status.textContent = '✅ Thank you! We\'ll get back to you soon.';
          }
          form.reset();
        } else {
          throw new Error('Server error');
        }
      })
      .catch(function(error) {
        if (status) {
          status.className = 'error';
          status.textContent = '❌ Sorry, something went wrong. Please try again or call us directly.';
        }
      })
      .finally(function() {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        setTimeout(function() {
          if (status) {
            status.style.display = 'none';
          }
        }, 6000);
      });
    });
  }

  // ============================================================
  // SCROLL ANIMATIONS
  // ============================================================
  function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-aos]');
    if (elements.length === 0) return;
    
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
        }
      });
    }, { 
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(function(el) {
      observer.observe(el);
    });
  }

  // ============================================================
  // SMOOTH SCROLL
  // ============================================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ============================================================
  // YEAR
  // ============================================================
  function initYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  // ============================================================
  // DONATION & VOLUNTEER BUTTONS
  // ============================================================
  function initDonationButtons() {
    // Donate buttons link to contact page with subject=donation
    const donateBtns = document.querySelectorAll('.btn-donate, .nav-btn-donate, .donate-btn');
    donateBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'contact.html?subject=donation';
      });
    });
    
    // Volunteer buttons link to contact page with subject=volunteer
    const volunteerBtns = document.querySelectorAll('.btn-volunteer, .nav-btn-volunteer, .volunteer-btn');
    volunteerBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'contact.html?subject=volunteer';
      });
    });
  }

  // ============================================================
  // AUTO-FILL SUBJECT FROM URL
  // ============================================================
  function initSubjectFromURL() {
    // Check if we're on contact page and subject is in URL
    const urlParams = new URLSearchParams(window.location.search);
    const subject = urlParams.get('subject');
    
    if (subject && document.getElementById('subject')) {
      const subjectSelect = document.getElementById('subject');
      // Map subject to select option value
      const subjectMap = {
        'donation': 'donation',
        'volunteer': 'volunteer',
        'partnership': 'partnership',
        'general': 'general'
      };
      
      if (subjectMap[subject]) {
        subjectSelect.value = subjectMap[subject];
        // Highlight the select
        subjectSelect.style.borderColor = 'var(--accent)';
        subjectSelect.style.boxShadow = '0 0 0 4px rgba(201, 168, 76, 0.15)';
      }
    }
  }

})();