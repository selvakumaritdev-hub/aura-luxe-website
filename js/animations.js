/**
 * AURA LUXE RESIDENCES - GSAP & SCROLLTRIGGER ANIMATIONS
 * Cinematic Loading Sequence, 3D Mouse Tilts, Pinned Horizontal Scroll, Parallax & Cursor
 */

(function () {
  'use strict';

  // Register GSAP Plugins
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // --- 1. CINEMATIC LOADING SCREEN SEQUENCE ---
  function initLoadingSequence() {
    const loadingScreen = document.getElementById('loading-screen');
    const barFill = document.getElementById('loader-bar-fill');
    const percentageEl = document.getElementById('loader-percentage');
    const body = document.body;

    if (!loadingScreen || !barFill || !percentageEl) {
      body.classList.remove('loading-active');
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      loadingScreen.classList.add('is-loaded');
      loadingScreen.style.display = 'none';
      body.classList.remove('loading-active');
      if (typeof gsap !== 'undefined') gsap.globalTimeline.timeScale(50);
      return;
    }

    let progress = { value: 0 };

    if (typeof gsap !== 'undefined') {
      const loadTl = gsap.timeline({
        onComplete: () => {
          loadingScreen.classList.add('is-loaded');
          body.classList.remove('loading-active');
          triggerHeroEntranceAnimation();
        }
      });

      // Animate percentage and progress bar
      loadTl.to(progress, {
        value: 100,
        duration: 1.2,
        ease: 'power2.inOut',
        onUpdate: () => {
          const currentVal = Math.floor(progress.value);
          percentageEl.textContent = `${currentVal}%`;
          barFill.style.width = `${currentVal}%`;
        }
      });

      // Loader content scale & fade-out
      loadTl.to('.loader-content', {
        scale: 1.08,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 0.7,
        ease: 'power3.in'
      });

      loadTl.to(loadingScreen, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.3');

    } else {
      // Fallback if GSAP is not loaded
      let count = 0;
      const interval = setInterval(() => {
        count += 4;
        percentageEl.textContent = `${count}%`;
        barFill.style.width = `${count}%`;
        if (count >= 100) {
          clearInterval(interval);
          loadingScreen.classList.add('is-loaded');
          body.classList.remove('loading-active');
        }
      }, 30);
    }
  }

  // --- 2. HERO ENTRANCE & 3D INTERACTION ---
  function triggerHeroEntranceAnimation() {
    if (typeof gsap === 'undefined') return;

    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl.from('.hero-tag-pill', {
      y: 30,
      opacity: 0,
      duration: 0.8
    });

    heroTl.from('.hero-title .title-line', {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.15
    }, '-=0.5');

    heroTl.from('.hero-subtitle', {
      y: 30,
      opacity: 0,
      duration: 0.8
    }, '-=0.6');

    heroTl.from('.hero-btn-group .btn', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15
    }, '-=0.6');

    heroTl.from('.hero-stats-strip .stat-item', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1
    }, '-=0.5');

    heroTl.from('.hero-card-3d', {
      scale: 0.9,
      opacity: 0,
      rotationY: 15,
      duration: 1.2,
      ease: 'power4.out'
    }, '-=1.2');

    heroTl.from('.floating-badge, .floating-price-tag', {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15
    }, '-=0.6');
  }

  function initHero3DTilt() {
    const heroWrapper = document.getElementById('hero-3d-wrapper');
    const heroCard = document.getElementById('hero-card-3d');
    if (!heroWrapper || !heroCard) return;

    let bounds;

    function onMouseMove(e) {
      bounds = heroWrapper.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      const normX = (mouseX / bounds.width - 0.5) * 2; // -1 to 1
      const normY = (mouseY / bounds.height - 0.5) * 2; // -1 to 1

      // Subtle realistic 3D card tilt
      const rotateX = -normY * 12;
      const rotateY = normX * 14;

      heroWrapper.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      // Dynamic glare light follow
      const glareX = (mouseX / bounds.width) * 100;
      const glareY = (mouseY / bounds.height) * 100;
      heroCard.style.setProperty('--mouse-x', `${glareX}%`);
      heroCard.style.setProperty('--mouse-y', `${glareY}%`);
    }

    function onMouseLeave() {
      heroWrapper.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
      heroWrapper.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    }

    function onMouseEnter() {
      heroWrapper.style.transition = 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)';
    }

    heroWrapper.addEventListener('mousemove', onMouseMove);
    heroWrapper.addEventListener('mouseleave', onMouseLeave);
    heroWrapper.addEventListener('mouseenter', onMouseEnter);
  }

  // --- 3. SCROLL-BASED HERO TRANSFORMATION ---
  function initHeroScrollTransformation() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.to('.hero-visual-col', {
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      },
      y: 80,
      scale: 0.94,
      rotationX: 8,
      opacity: 0.85
    });

    gsap.to('.hero-content', {
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      },
      y: -50,
      opacity: 0.4
    });
  }

  // --- 4. 3D PROPERTY CARDS HOVER TILT ---
  function initPropertyCard3DTilt() {
    const cardWrappers = document.querySelectorAll('.property-card-3d-wrapper');

    cardWrappers.forEach(wrap => {
      const card = wrap.querySelector('.property-card-3d');
      const img = wrap.querySelector('.prop-card-img');
      const content = wrap.querySelector('.card-content-wrap');

      if (!card) return;

      wrap.addEventListener('mousemove', (e) => {
        const rect = wrap.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const normX = (x / rect.width - 0.5) * 2;
        const normY = (y / rect.height - 0.5) * 2;

        const rotateX = -normY * 10;
        const rotateY = normX * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

        if (img) {
          img.style.transform = `scale(1.08) translate3d(${normX * 6}px, ${normY * 6}px, 0)`;
        }

        if (content) {
          content.style.transform = `translateZ(30px) translate3d(${-normX * 3}px, ${-normY * 3}px, 0)`;
        }
      });

      wrap.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';

        if (img) {
          img.style.transform = 'scale(1)';
          img.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        }

        if (content) {
          content.style.transform = 'translateZ(25px)';
          content.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        }
      });

      wrap.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease-out';
        if (img) img.style.transition = 'transform 0.1s ease-out';
        if (content) content.style.transition = 'transform 0.1s ease-out';
      });
    });
  }

  // --- 5. CINEMATIC PROPERTY IMAGE REVEALS (SCROLLTRIGGER) ---
  function initPropertyScrollReveals() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const cards = document.querySelectorAll('.property-card-3d-wrapper');

    cards.forEach((card, index) => {
      const img = card.querySelector('.prop-card-img');
      const overlay = card.querySelector('.card-image-dark-overlay');
      const content = card.querySelector('.card-content-wrap');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });

      tl.from(card, {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out'
      });

      if (img) {
        tl.from(img, {
          scale: 1.2,
          duration: 1.2,
          ease: 'power2.out'
        }, 0);
      }

      if (overlay) {
        tl.from(overlay, {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.inOut'
        }, 0.2);
      }

      if (content) {
        tl.from(content.children, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out'
        }, 0.3);
      }
    });
  }

  // --- 6. PINNED HORIZONTAL PROPERTY SHOWCASE ---
  function initPinnedHorizontalShowcase() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const section = document.getElementById('showcase');
    const track = document.getElementById('horizontal-track');
    if (!section || !track) return;

    // Only apply horizontal pin on larger screens
    if (window.innerWidth > 1024) {
      const getScrollAmount = () => {
        return -(track.scrollWidth - window.innerWidth + 100);
      };

      const hTween = gsap.to(track, {
        x: getScrollAmount,
        ease: 'none'
      });

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${track.scrollWidth - window.innerWidth + 600}`,
        pin: true,
        animation: hTween,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (typeof window.updateHorizontalShowcaseProgress === 'function') {
            window.updateHorizontalShowcaseProgress(self.progress);
          }
        }
      });
    }
  }

  // --- 7. AMENITIES & SPECIFICATIONS STAGGER REVEAL ---
  function initAmenitiesStagger() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.from('.amenity-card', {
      scrollTrigger: {
        trigger: '.amenities-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    });
  }

  // --- 8. MULTI-LAYER PARALLAX SECTION ---
  function initMultiLayerParallax() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const parallaxSection = document.getElementById('parallax-view');
    const backImg = document.querySelector('.parallax-img-back');
    const quoteBox = document.querySelector('.parallax-quote-box');

    if (!parallaxSection || !backImg || !quoteBox) return;

    gsap.to(backImg, {
      scrollTrigger: {
        trigger: parallaxSection,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      },
      y: '18%',
      scale: 1.15,
      ease: 'none'
    });

    gsap.to(quoteBox, {
      scrollTrigger: {
        trigger: parallaxSection,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      },
      y: '-12%',
      ease: 'none'
    });
  }

  // --- 9. WHY CHOOSE US & LOCATION STAGGERS ---
  function initWhyUsAndLocationStaggers() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.from('.why-card', {
      scrollTrigger: {
        trigger: '.why-us-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out'
    });

    gsap.from('.landmark-item', {
      scrollTrigger: {
        trigger: '.landmarks-list',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      x: -40,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power2.out'
    });
  }

  // --- 10. FINAL CTA WORD REVEAL ---
  function initFinalCTAAnimation() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const ctaSection = document.getElementById('contact');
    const ctaTitle = document.getElementById('cta-animated-title');
    const ctaBgImg = document.getElementById('cta-bg-img');

    if (!ctaSection || !ctaTitle) return;

    gsap.from(ctaTitle, {
      scrollTrigger: {
        trigger: ctaSection,
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    if (ctaBgImg) {
      gsap.to(ctaBgImg, {
        scrollTrigger: {
          trigger: ctaSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        },
        scale: 1.02,
        y: '8%'
      });
    }
  }

  // --- 11. CUSTOM MINIMAL CURSOR ---
  function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor || window.innerWidth <= 768) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Render loop for smooth cursor lerping
    function renderCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      cursor.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Interactive element hover detections
    const hoverables = document.querySelectorAll('a, button, [data-cursor="hover"], .filter-tab-btn');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });

    const viewables = document.querySelectorAll('[data-cursor="view"], .prop-card-img, .property-card-3d');
    viewables.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('cursor-view'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-view'));
    });

    const draggables = document.querySelectorAll('[data-cursor="drag"], #three-canvas-container');
    draggables.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('cursor-drag'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-drag'));
    });

    // Magnetic buttons
    const magneticBtns = document.querySelectorAll('[data-magnetic]');
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const btnX = e.clientX - rect.left - rect.width / 2;
        const btnY = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${btnX * 0.3}px, ${btnY * 0.3}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      });

      btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'transform 0.1s ease-out';
      });
    });
  }

  // --- INITIALIZE ALL ANIMATIONS ---
  function init() {
    initLoadingSequence();
    initHero3DTilt();
    initHeroScrollTransformation();
    initPropertyCard3DTilt();
    initPropertyScrollReveals();
    initPinnedHorizontalShowcase();
    initAmenitiesStagger();
    initMultiLayerParallax();
    initWhyUsAndLocationStaggers();
    initFinalCTAAnimation();
    initCustomCursor();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
