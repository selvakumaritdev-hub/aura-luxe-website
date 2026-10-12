/**
 * AURA LUXE RESIDENCES - MAIN APPLICATION LOGIC
 * Navigation, Modals, Category Filtering, Form Validation, Audio Synthesis & Toast Notifications
 */

(function () {
  'use strict';

  // --- PROPERTY DATASET FOR QUICK VIEW MODAL ---
  const PROPERTIES_DATA = {
    'villa-01': {
      title: 'Modern Architectural Villa',
      category: 'Modern Duplex Villa',
      location: 'Beverly Hills, Los Angeles, CA',
      price: '$4,500 / Month',
      deposit: '$4,500 (Refundable Security Deposit)',
      image: 'assets/images/villa_front.webp',
      specs: {
        bedrooms: '3 Master Bedrooms with En-suite Baths',
        bathrooms: '2 Contemporary Bathrooms',
        area: '2,900 sq.ft Living Area',
        furnishing: 'Semi-Furnished (Wardrobes, Modular Kitchen, LED Lights)',
        facing: 'East Facing, Morning Light',
        parking: 'Dedicated Covered Porch for SUV + 2-Wheeler',
        water: 'Filtered Water + Private Pool',
        power: 'Solar + Battery Backup'
      },
      description: 'An exquisitely designed 3-bedroom independent villa nestled in the peaceful residential enclaves of Beverly Hills. Features expansive ceiling heights, large acoustic glass windows, landscaped front lawn, and serene privacy.'
    },
    'duplex-02': {
      title: 'The Glass Sanctuary',
      category: 'Ultra Luxury Duplex',
      location: 'Malibu, Los Angeles, CA',
      price: '$9,500 / Month',
      deposit: '$9,500 (Refundable Security Deposit)',
      image: 'assets/images/living_room.webp',
      specs: {
        bedrooms: '4 Grand Bedrooms with Walk-in Closets',
        bathrooms: '3 Designer Spa-style Bathrooms',
        area: '4,200 sq.ft Double-Height Duplex',
        furnishing: 'Fully Furnished with Teakwood Furniture & Italian Marble',
        facing: 'North-East Facing',
        parking: '2 Covered Car Spaces',
        water: '24/7 RO Treated Water + Dual Sumps',
        power: 'Whole-Home Battery Backup'
      },
      description: 'A masterpiece of modern architectural design. Boasts an impressive double-height living room overlooking a private Japanese courtyard garden, premium Italian marble flooring, and smart home lighting.'
    },
    'penthouse-03': {
      title: 'Royal Horizon Sky Suite',
      category: 'Skyline Penthouse',
      location: 'Hollywood Hills, Los Angeles, CA',
      price: '$7,200 / Month',
      deposit: '$7,200 (Refundable Security Deposit)',
      image: 'assets/images/balcony.webp',
      specs: {
        bedrooms: '3 Panoramic Bedrooms',
        bathrooms: '3 Attached Modern Bathrooms',
        area: '3,500 sq.ft Sky Residence',
        furnishing: 'Fully Furnished & Custom Decor',
        facing: 'West Facing with Panoramic Sunset Horizon',
        parking: 'Covered Basement Parking Slot',
        water: 'Filtered Water Throughout',
        power: '24/7 Continuous Power Grid'
      },
      description: 'Perched high with breathtaking views over Los Angeles skyline. Enjoy spectacular golden hours from the 40-foot expansive wraparound balcony, wooden sundeck loungers, and custom ambient lighting.'
    },
    'villa-04': {
      title: 'Palm Crest Gourmet Villa',
      category: 'Modern Gourmet Villa',
      location: 'Santa Monica, Los Angeles, CA',
      price: '$6,200 / Month',
      deposit: '$6,200 (Refundable Security Deposit)',
      image: 'assets/images/kitchen_dining.webp',
      specs: {
        bedrooms: '3 Spacious Bedroom Suites',
        bathrooms: '2 Attached Modern Bathrooms',
        area: '3,300 sq.ft Ground + 1 Floor',
        furnishing: 'Designer Modular Kitchen with Island & Wine Rack',
        facing: 'East Facing',
        parking: 'Covered Car Porch',
        water: 'Private Well & Filtration',
        power: 'Solar Hybrid Power Backup'
      },
      description: 'Tailored for those who appreciate fine culinary spaces and tranquil living. Features an imported dark marble waterfall island counter, built-in German appliances, and effortless open-concept entertaining flow.'
    }
  };

  // --- 1. NAVBAR SCROLL EFFECT & ACTIVE LINK SPY ---
  function initNavigation() {
    const header = document.getElementById('main-header');
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
    const sections = document.querySelectorAll('section[id], footer[id]');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-btn');

    // Scroll header background toggle
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Scroll Spy for Nav Links
      let currentSectionId = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
          currentSectionId = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        if (!(link.getAttribute('href') || '').startsWith('#')) return;
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }, { passive: true });

    // Mobile Hamburger Drawer Toggle
    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.toggle('is-open');
        mobileToggle.classList.toggle('is-active');
        mobileDrawer.setAttribute('aria-hidden', !isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileDrawer.classList.remove('is-open');
          mobileToggle.classList.remove('is-active');
          mobileDrawer.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        });
      });
    }

    // Scroll down indicator button
    const scrollDownBtn = document.getElementById('scroll-down-btn');
    if (scrollDownBtn) {
      scrollDownBtn.addEventListener('click', () => {
        const targetSection = document.getElementById('about') || document.getElementById('properties');
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  // --- 2. PROPERTY CATEGORY FILTER TABS ---
  function initPropertyFilters() {
    const filterBtns = document.querySelectorAll('.filter-tab-btn');
    const cards = document.querySelectorAll('.property-card-3d-wrapper');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        cards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'block';
            if (typeof gsap !== 'undefined') {
              gsap.fromTo(card, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4 });
            }
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- 3. MODALS (BOOK A VISIT & QUICK VIEW) ---
  function initModals() {
    // Book a Visit Modal
    const bookingModal = document.getElementById('booking-modal');
    const openBookingBtn = document.getElementById('open-booking-modal-btn');
    const closeBookingBtn = document.getElementById('close-booking-modal-btn');
    const bookingForm = document.getElementById('schedule-visit-form');
    const visitDateInput = document.getElementById('visit-date');

    // Set minimum date to tomorrow
    if (visitDateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      visitDateInput.min = tomorrow.toISOString().split('T')[0];
    }

    if (openBookingBtn && bookingModal) {
      openBookingBtn.addEventListener('click', () => {
        bookingModal.classList.add('is-open');
        bookingModal.setAttribute('aria-hidden', 'false');
      });
    }

    if (closeBookingBtn && bookingModal) {
      closeBookingBtn.addEventListener('click', () => {
        bookingModal.classList.remove('is-open');
        bookingModal.setAttribute('aria-hidden', 'true');
      });
    }

    // Quick View Details Modal
    const detailsModal = document.getElementById('prop-details-modal');
    const closePropBtn = document.getElementById('close-prop-modal-btn');
    const modalContent = document.getElementById('prop-modal-dynamic-content');
    const viewDetailsBtns = document.querySelectorAll('.open-details-modal');

    viewDetailsBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const propId = btn.getAttribute('data-prop');
        const data = PROPERTIES_DATA[propId];
        if (!data || !modalContent) return;

        modalContent.innerHTML = `
          <div class="prop-modal-img-col">
            <img src="${data.image}" alt="${data.title}" class="prop-modal-img">
          </div>
          <div class="prop-modal-info">
            <div class="prop-modal-badge">${data.category.toUpperCase()} • 100% VERIFIED</div>
            <h3 class="prop-modal-title">${data.title}</h3>
            <div class="prop-modal-price">${data.price}</div>
            <p class="prop-modal-desc">${data.description}</p>
            
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; margin:1rem 0; font-size:0.8rem; color:#d1d5db;">
              <div>🛏 <strong>${data.specs.bedrooms}</strong></div>
              <div>🚿 <strong>${data.specs.bathrooms}</strong></div>
              <div>📐 <strong>${data.specs.area}</strong></div>
              <div>🚗 <strong>${data.specs.parking}</strong></div>
              <div>🏠 <strong>${data.specs.furnishing}</strong></div>
              <div>⚡ <strong>${data.specs.power}</strong></div>
            </div>

            <div style="margin-bottom:1rem; font-size:0.8rem; color:#9ca3af;">
              🔒 <strong>Deposit:</strong> ${data.deposit}
            </div>

            <div style="display:flex; gap:0.8rem; margin-top:0.5rem;">
              <button class="btn btn-gold btn-sm modal-schedule-direct-btn" data-prop-title="${data.title}">
                Book Private Viewing
              </button>
              <a href="https://wa.me/919363638730" target="_blank" class="btn btn-whatsapp btn-sm">
                WhatsApp Tour
              </a>
            </div>
          </div>
        `;

        // Connect inner button to open booking form
        const innerScheduleBtn = modalContent.querySelector('.modal-schedule-direct-btn');
        if (innerScheduleBtn) {
          innerScheduleBtn.addEventListener('click', () => {
            detailsModal.classList.remove('is-open');
            const propSelect = document.getElementById('modal-prop-select');
            if (propSelect) {
              for (let i = 0; i < propSelect.options.length; i++) {
                if (propSelect.options[i].text.includes(data.title.split(' ')[0])) {
                  propSelect.selectedIndex = i;
                  break;
                }
              }
            }
            bookingModal.classList.add('is-open');
          });
        }

        detailsModal.classList.add('is-open');
        detailsModal.setAttribute('aria-hidden', 'false');
      });
    });

    if (closePropBtn && detailsModal) {
      closePropBtn.addEventListener('click', () => {
        detailsModal.classList.remove('is-open');
        detailsModal.setAttribute('aria-hidden', 'true');
      });
    }

    // Close on backdrop click
    [bookingModal, detailsModal].forEach(modal => {
      if (!modal) return;
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('is-open');
          modal.setAttribute('aria-hidden', 'true');
        }
      });
    });

    // Handle Form Submissions with Toast
    if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('modal-name').value;
        const date = document.getElementById('visit-date').value;
        const time = document.getElementById('visit-time').value;
        const bPhone = (document.getElementById('modal-phone') || {}).value || '';
        const bSel = document.getElementById('modal-prop-select');
        const bHome = bSel && bSel.options[bSel.selectedIndex] ? bSel.options[bSel.selectedIndex].text : 'Any home';
        if (window.auraSave) window.auraSave('bookings', { name, phone: bPhone, home: bHome, date, time, status: 'Pending' }).then(function (r) { setTimeout(function () { showToast(r.ok ? 'Booking saved to our system ✓' : 'Not saved to admin: ' + r.err); }, 2500); });

        bookingModal.classList.remove('is-open');
        bookingForm.reset();

        sendToWhatsApp(`Hello Aura Luxe, I would like to schedule a property visit.\nName: ${name}\nDate: ${date}\nTime: ${time}`);
        showToast(`Thank you ${name}! Opening WhatsApp to confirm your visit on ${date} (${time}).`);
      });
    }

    const inquiryForm = document.getElementById('inquiry-form');
    if (inquiryForm) {
      inquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('user-name').value;
        const pref = document.getElementById('property-pref').value;
        const phone = (document.getElementById('user-phone') || {}).value || '';
        const email = (document.getElementById('user-email') || {}).value || '';
        const msg = (document.getElementById('user-msg') || {}).value || '';

        if (window.auraSave) window.auraSave('inquiries', { name, phone, email, home: pref, message: msg, status: 'New' }).then(function (r) { setTimeout(function () { showToast(r.ok ? 'Inquiry saved to our system ✓' : 'Not saved to admin: ' + r.err); }, 2500); });
        inquiryForm.reset();
        sendToWhatsApp(`Hello Aura Luxe, I am interested in: ${pref}\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${msg}`);
        showToast(`Thank you ${name}! Opening WhatsApp to send your inquiry for ${pref}.`);
      });
    }
  }

  // --- WhatsApp hand-off for forms ---
  function sendToWhatsApp(text) {
    const url = 'https://wa.me/919363638730?text=' + encodeURIComponent(text);
    window.open(url, '_blank', 'noopener');
  }

  // --- 4. TOAST NOTIFICATION SYSTEM ---
  function showToast(message) {
    const toast = document.getElementById('toast-notification');
    const toastMsg = document.getElementById('toast-message');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.add('is-visible');

    setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 4800);
  }

  // --- 5. WEB AUDIO SYNTHESIZER (LUXURY AMBIENT SOUND) ---
  function initAmbientAudio() {
    const audioBtn = document.getElementById('ambient-audio-toggle');
    if (!audioBtn) return;

    const iconOn = audioBtn.querySelector('.icon-sound-on');
    const iconOff = audioBtn.querySelector('.icon-sound-off');

    let audioCtx = null;
    let isPlaying = false;
    let masterGain = null;
    let ambientInterval = null;

    // Harmonic pentatonic chords for tranquil luxury vibe (A minor / C major pentatonic)
    const notes = [220.0, 261.63, 329.63, 392.0, 440.0, 523.25, 659.25];

    function startLuxuryAmbient() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        masterGain.connect(audioCtx.destination);
      }

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      function playChime() {
        if (!isPlaying || !audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        // Random harmonic frequency
        const freq = notes[Math.floor(Math.random() * notes.length)];
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        const now = audioCtx.currentTime;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.08, now + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 4.6);
      }

      isPlaying = true;
      audioBtn.classList.add('is-playing');
      if (iconOn) iconOn.style.display = 'block';
      if (iconOff) iconOff.style.display = 'none';

      playChime();
      ambientInterval = setInterval(playChime, 3200);
      showToast('Tranquil ambient audio enabled.');
    }

    function stopLuxuryAmbient() {
      isPlaying = false;
      clearInterval(ambientInterval);
      audioBtn.classList.remove('is-playing');
      if (iconOn) iconOn.style.display = 'none';
      if (iconOff) iconOff.style.display = 'block';
    }

    audioBtn.addEventListener('click', () => {
      if (isPlaying) {
        stopLuxuryAmbient();
      } else {
        startLuxuryAmbient();
      }
    });
  }

  // --- INITIALIZE MAIN APP ---
  function init() {
    initNavigation();
    initPropertyFilters();
    initModals();
    initAmbientAudio();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

;(function(){try{var u=localStorage.getItem('auraUser');if(!u)return;var a=false;document.querySelectorAll('.btn-signin').forEach(function(b){b.href='account.html';b.textContent='● '+u.toUpperCase().slice(0,12)});document.querySelectorAll('.drawer-signin').forEach(function(b){b.href='account.html';b.textContent='MY ACCOUNT'})}catch(e){}})();
