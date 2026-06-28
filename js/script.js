document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. STICKY HEADER & ACTIVE NAV LINK
     ========================================================================== */
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  });

  // Automatically mark current active page nav link
  const currentPath = window.location.pathname.split('/').pop();
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  /* ==========================================================================
     2. MOBILE NAVIGATION HAMBURGER DRAWER
     ========================================================================== */
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('nav-links');

  if (hamburger && navLinksContainer) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinksContainer.classList.toggle('active');
    });

    // Close menu when clicking any link
    navLinksContainer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinksContainer.classList.remove('active');
      });
    });

    // Close menu when clicking anywhere outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinksContainer.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinksContainer.classList.remove('active');
      }
    });
  }

  /* ==========================================================================
     3. FAQ ACCORDION Collapsing Effect
     ========================================================================== */
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all other accordion items
      document.querySelectorAll('.faq-item').forEach(faqItem => {
        faqItem.classList.remove('active');
      });
      
      // If clicked item wasn't active, open it
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     4. GALLERY GRID FILTER
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterButtons.length > 0 && galleryItems.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active button class
        filterButtons.forEach(button => button.classList.remove('active'));
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          if (filterValue === 'all' || itemCategory === filterValue) {
            item.style.display = 'block';
            // Simple micro-fade animation
            item.style.opacity = '0';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transition = 'opacity 0.4s ease';
            }, 50);
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ==========================================================================
     5. PHOTO GALLERY LIGHTBOX SYSTEM
     ========================================================================== */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  
  let currentImagesList = [];
  let currentImageIndex = 0;

  if (lightbox && galleryItems.length > 0) {
    // Open Lightbox when clicking a gallery item
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        // Capture only currently visible images (based on filters)
        currentImagesList = Array.from(galleryItems).filter(el => el.style.display !== 'none');
        currentImageIndex = currentImagesList.indexOf(item);
        
        showLightboxImage(item);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Disable page scrolling
      });
    });

    function showLightboxImage(itemElement) {
      const src = itemElement.getAttribute('data-src');
      const caption = itemElement.getAttribute('data-caption');
      
      lightboxImg.setAttribute('src', src);
      lightboxCaption.textContent = caption;
    }

    // Next Button
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      currentImageIndex = (currentImageIndex + 1) % currentImagesList.length;
      showLightboxImage(currentImagesList[currentImageIndex]);
    });

    // Previous Button
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      currentImageIndex = (currentImageIndex - 1 + currentImagesList.length) % currentImagesList.length;
      showLightboxImage(currentImagesList[currentImageIndex]);
    });

    // Close Lightbox click
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto'; // Enable page scrolling
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', closeLightbox);
    
    // Prevent closing when clicking inside the lightbox image content area
    lightboxImg.parentElement.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Keyboard Shortcuts (Arrow keys & Escape)
    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') {
          currentImageIndex = (currentImageIndex + 1) % currentImagesList.length;
          showLightboxImage(currentImagesList[currentImageIndex]);
        }
        if (e.key === 'ArrowLeft') {
          currentImageIndex = (currentImageIndex - 1 + currentImagesList.length) % currentImagesList.length;
          showLightboxImage(currentImagesList[currentImageIndex]);
        }
      }
    });
  }

  /* ==========================================================================
     6. BOOKING FORM & TRAVEL COST ESTIMATION
     ========================================================================== */
  const bookingForm = document.getElementById('booking-form');
  const packageSelect = document.getElementById('package-select');
  const tripDuration = document.getElementById('trip-duration');
  const guestCount = document.getElementById('guest-count');
  const departureDate = document.getElementById('departure-date');

  // Calculator DOM Nodes
  const calcBase = document.getElementById('calc-base');
  const calcDuration = document.getElementById('calc-duration');
  const calcPassengers = document.getElementById('calc-passengers');
  const calcTotal = document.getElementById('calc-total');

  // Standards for package logic
  const packageStandards = {
    tajmahal: { base: 1850, standardNights: 5 },
    kerala: { base: 2200, standardNights: 7 },
    goa: { base: 2500, standardNights: 6 },
    custom: { base: 3000, standardNights: 6 }
  };

  // Helper formatting function
  const formatCost = (val) => '$' + val.toLocaleString('en-US');

  // Live Cost calculation logic
  function updateCostEstimates() {
    if (!packageSelect || !tripDuration || !guestCount) return;
    
    const selectedPkg = packageSelect.value;
    const nightsVal = parseInt(tripDuration.value) || 3;
    const guestsVal = parseInt(guestCount.value) || 1;
    
    const rules = packageStandards[selectedPkg] || packageStandards['custom'];
    
    // 1. Base cost
    const baseVal = rules.base;
    calcBase.textContent = formatCost(baseVal);
    
    // 2. Length difference
    const diffNights = nightsVal - rules.standardNights;
    let adjVal = 0;
    if (diffNights > 0) {
      adjVal = diffNights * 150; // extra charge per night
      calcDuration.textContent = `+${diffNights} night(s) (${formatCost(adjVal)})`;
      calcDuration.style.color = '#d9534f';
    } else if (diffNights < 0) {
      adjVal = diffNights * 100; // discount per night fewer
      calcDuration.textContent = `${diffNights} night(s) (${formatCost(adjVal)})`;
      calcDuration.style.color = '#1b3b2b';
    } else {
      calcDuration.textContent = 'Standard Duration';
      calcDuration.style.color = 'var(--text-muted)';
    }
    
    // 3. Passenger count
    calcPassengers.textContent = `x ${guestsVal}`;
    
    // 4. Combined total estimate
    const finalEstimate = (baseVal + adjVal) * guestsVal;
    calcTotal.textContent = formatCost(finalEstimate);
  }

  // Pre-fill fields if arriving from packages card details link
  function handleUrlRouting() {
    if (!packageSelect) return;
    
    const params = new URLSearchParams(window.location.search);
    const selectedPkgQuery = params.get('package');
    
    if (selectedPkgQuery && packageStandards[selectedPkgQuery]) {
      packageSelect.value = selectedPkgQuery;
      
      // Sync default duration according to standards
      tripDuration.value = packageStandards[selectedPkgQuery].standardNights;
      
      // Auto scroll to form
      const bookingSec = document.getElementById('booking-section');
      if (bookingSec) {
        setTimeout(() => {
          bookingSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
    updateCostEstimates();
  }

  // Set default minimum date to tomorrow
  if (departureDate) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    departureDate.setAttribute('min', tomorrowStr);
  }

  // Listeners for live pricing updates
  if (packageSelect) {
    packageSelect.addEventListener('change', () => {
      // update nights input according to standard packages
      const pkg = packageSelect.value;
      if (packageStandards[pkg]) {
        tripDuration.value = packageStandards[pkg].standardNights;
      }
      updateCostEstimates();
    });
    tripDuration.addEventListener('input', updateCostEstimates);
    guestCount.addEventListener('input', updateCostEstimates);
    
    handleUrlRouting();
  }

  /* ==========================================================================
     7. FORM VALIDATION & MODAL SUCCESS
     ========================================================================== */
  const bookingModal = document.getElementById('booking-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  if (bookingForm && bookingModal) {
    
    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      
      // 1. Validate name
      const nameInput = document.getElementById('full-name');
      const nameError = document.getElementById('name-error');
      if (nameInput.value.trim() === '') {
        nameInput.classList.add('error');
        nameError.style.display = 'block';
        isValid = false;
      } else {
        nameInput.classList.remove('error');
        nameError.style.display = 'none';
      }
      
      // 2. Validate email
      const emailInput = document.getElementById('email-address');
      const emailError = document.getElementById('email-error');
      if (!validateEmail(emailInput.value.trim())) {
        emailInput.classList.add('error');
        emailError.style.display = 'block';
        isValid = false;
      } else {
        emailInput.classList.remove('error');
        emailError.style.display = 'none';
      }
      
      // 3. Validate departure date
      const dateError = document.getElementById('date-error');
      const today = new Date().toISOString().split('T')[0];
      if (departureDate.value === '' || departureDate.value <= today) {
        departureDate.classList.add('error');
        dateError.style.display = 'block';
        isValid = false;
      } else {
        departureDate.classList.remove('error');
        dateError.style.display = 'none';
      }
      
      // 4. Validate duration
      const durationError = document.getElementById('duration-error');
      const dur = parseInt(tripDuration.value);
      if (isNaN(dur) || dur < 3 || dur > 30) {
        tripDuration.classList.add('error');
        durationError.style.display = 'block';
        isValid = false;
      } else {
        tripDuration.classList.remove('error');
        durationError.style.display = 'none';
      }
      
      // 5. Validate guests
      const guestsError = document.getElementById('guests-error');
      const guests = parseInt(guestCount.value);
      if (isNaN(guests) || guests < 1 || guests > 12) {
        guestCount.classList.add('error');
        guestsError.style.display = 'block';
        isValid = false;
      } else {
        guestCount.classList.remove('error');
        guestsError.style.display = 'none';
      }
      
      // If all inputs are valid, show success Modal with customized receipt
      if (isValid) {
        const selectedPkg = packageSelect.value;
        const pkgText = packageSelect.options[packageSelect.selectedIndex].text.split(' (')[0];
        const rawTotal = calcTotal.textContent;
        const travelersCount = guestCount.value;
        const nightsCount = tripDuration.value;
        
        // Update modal message
        document.getElementById('modal-msg').innerHTML = `Thank you, <strong>${nameInput.value.trim()}</strong>! Your inquiry has been submitted. Our Travel Designer will contact you at <strong>${emailInput.value.trim()}</strong> within 24 hours.`;
        
        // Update modal billing details
        document.getElementById('modal-summary-pkg').textContent = pkgText;
        document.getElementById('modal-summary-date').textContent = departureDate.value;
        document.getElementById('modal-summary-details').textContent = `${nightsCount} nights, ${travelersCount} traveler(s)`;
        document.getElementById('modal-summary-total').textContent = rawTotal;
        
        // Activate Modal
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });

    // Close Modal button
    const closeModalFunc = () => {
      bookingModal.classList.remove('active');
      document.body.style.overflow = 'auto';
      bookingForm.reset();
      updateCostEstimates();
    };

    modalCloseBtn.addEventListener('click', closeModalFunc);
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) closeModalFunc();
    });
  }

});
