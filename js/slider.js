/**
 * AURA LUXE RESIDENCES - SLIDERS & SHOWCASE CONTROLLER
 * Full-Screen Cinematic Image Slider & Horizontal Scroll Showcase Sync
 */

(function () {
  'use strict';

  // --- 1. FULL-SCREEN CINEMATIC SLIDER ---
  let currentSlide = 1;
  const totalSlides = 4;
  let isTransitioning = false;
  let autoSlideTimer = null;

  function initFullscreenSlider() {
    const prevBtn = document.getElementById('slider-prev-btn');
    const nextBtn = document.getElementById('slider-next-btn');
    const currentNumEl = document.getElementById('slider-current-num');

    if (!prevBtn || !nextBtn) return;

    function goToSlide(slideIndex, direction = 'next') {
      if (isTransitioning || slideIndex === currentSlide) return;
      isTransitioning = true;

      const slides = document.querySelectorAll('.fs-slide');
      const outgoingSlide = document.querySelector(`.fs-slide[data-index="${currentSlide}"]`);
      const incomingSlide = document.querySelector(`.fs-slide[data-index="${slideIndex}"]`);

      if (!outgoingSlide || !incomingSlide) {
        isTransitioning = false;
        return;
      }

      // Update Pagination
      if (currentNumEl) {
        currentNumEl.textContent = String(slideIndex).padStart(2, '0');
      }

      if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline({
          onComplete: () => {
            outgoingSlide.classList.remove('active');
            incomingSlide.classList.add('active');
            currentSlide = slideIndex;
            isTransitioning = false;
          }
        });

        // Set initial state for incoming slide
        gsap.set(incomingSlide, {
          opacity: 0,
          scale: 1.05,
          zIndex: 3
        });
        gsap.set(outgoingSlide, { zIndex: 2 });

        // Animate incoming & outgoing
        tl.to(outgoingSlide, {
          opacity: 0,
          scale: 0.96,
          duration: 0.8,
          ease: 'power3.inOut'
        }, 0);

        tl.to(incomingSlide, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.inOut'
        }, 0);

        // Stagger incoming text elements
        const incomingElements = incomingSlide.querySelectorAll('.fs-badge, .fs-title, .fs-tamil-tag, .fs-meta-row, .btn-slider-cta');
        tl.fromTo(incomingElements, {
          y: 35,
          opacity: 0
        }, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out'
        }, 0.2);

      } else {
        outgoingSlide.classList.remove('active');
        incomingSlide.classList.add('active');
        currentSlide = slideIndex;
        isTransitioning = false;
      }
    }

    function nextSlide() {
      const next = currentSlide >= totalSlides ? 1 : currentSlide + 1;
      goToSlide(next, 'next');
    }

    function prevSlide() {
      const prev = currentSlide <= 1 ? totalSlides : currentSlide - 1;
      goToSlide(prev, 'prev');
    }

    nextBtn.addEventListener('click', () => {
      resetAutoPlay();
      nextSlide();
    });

    prevBtn.addEventListener('click', () => {
      resetAutoPlay();
      prevSlide();
    });

    // Keyboard navigation (Arrow keys when slider is in view)
    window.addEventListener('keydown', (e) => {
      const sliderEl = document.getElementById('cinematic-slider');
      if (!sliderEl) return;
      const rect = sliderEl.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;

      if (inView) {
        if (e.key === 'ArrowRight') {
          resetAutoPlay();
          nextSlide();
        } else if (e.key === 'ArrowLeft') {
          resetAutoPlay();
          prevSlide();
        }
      }
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    const sliderContainer = document.querySelector('.slider-wrapper');
    if (sliderContainer) {
      sliderContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      sliderContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });
    }

    function handleSwipe() {
      if (touchEndX < touchStartX - 50) {
        resetAutoPlay();
        nextSlide();
      } else if (touchEndX > touchStartX + 50) {
        resetAutoPlay();
        prevSlide();
      }
    }

    function startAutoPlay() {
      autoSlideTimer = setInterval(() => {
        const sliderEl = document.getElementById('cinematic-slider');
        if (sliderEl) {
          const rect = sliderEl.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            nextSlide();
          }
        }
      }, 7000);
    }

    function resetAutoPlay() {
      clearInterval(autoSlideTimer);
      startAutoPlay();
    }

    startAutoPlay();
  }

  // --- 2. PINNED HORIZONTAL SHOWCASE PROGRESS SYNC ---
  function initHorizontalShowcaseSync() {
    // This connects GSAP ScrollTrigger timeline to the UI indicators
    window.updateHorizontalShowcaseProgress = function (progress) {
      const total = 4;
      const activeIdx = Math.min(total, Math.max(1, Math.floor(progress * total) + 1));

      const numEl = document.getElementById('showcase-active-num');
      const fillEl = document.getElementById('showcase-progress-fill');

      if (numEl) {
        numEl.textContent = String(activeIdx).padStart(2, '0');
      }

      if (fillEl) {
        fillEl.style.width = `${Math.max(15, progress * 100)}%`;
      }

      // Toggle active classes on items
      const items = document.querySelectorAll('.h-slide-item');
      items.forEach((item, idx) => {
        if (idx + 1 === activeIdx) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    };
  }

  // Initialize on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initFullscreenSlider();
      initHorizontalShowcaseSync();
    });
  } else {
    initFullscreenSlider();
    initHorizontalShowcaseSync();
  }

})();
