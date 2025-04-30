document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    const htmlElement = document.documentElement;
    

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        if (savedTheme === 'dark') {
            htmlElement.classList.add('dark');
            themeIcon.className = 'fas fa-sun';
            themeText.textContent = 'Light Mode';
        } else {
            htmlElement.classList.remove('dark');
            themeIcon.className = 'fas fa-moon';
            themeText.textContent = 'Dark Mode';
        }
    }

    themeToggle.addEventListener('click', function() {
        if (htmlElement.classList.contains('dark')) {
            // Switch to light mode
            htmlElement.classList.remove('dark');
            themeIcon.className = 'fas fa-moon';
            themeText.textContent = 'Dark Mode';
            localStorage.setItem('theme', 'light');
        } else {
            // Switch to dark mode
            htmlElement.classList.add('dark');
            themeIcon.className = 'fas fa-sun';
            themeText.textContent = 'Light Mode';
            localStorage.setItem('theme', 'dark');
        }
    });



    

    // Hero Slider Functionality
    const heroSlider = {
        slides: null,
        dots: null,
        currentSlide: 0,
        totalSlides: 0,
        slideInterval: null,

        init: function() {
            // Select slides and navigation dots
            this.slides = document.querySelectorAll('.hero-slide');
            this.dots = document.querySelectorAll('.slider-dot');
            
            // Validate slides and dots
            if (this.slides.length === 0 || this.dots.length === 0) {
                console.error('Slider initialization failed: No slides or dots found');
                return;
            }

            this.totalSlides = this.slides.length;

            // Set up dot click events
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goToSlide(index));
            });

            // Set up hover events to pause/resume slider
            const heroSection = document.querySelector('.hero');
            heroSection.addEventListener('mouseenter', () => this.pauseSlider());
            heroSection.addEventListener('mouseleave', () => this.startSlider());

            // Start automatic sliding
            this.startSlider();
        },

        goToSlide: function(slideIndex) {
            // Remove active class from current slide and dot
            this.slides[this.currentSlide].classList.remove('active');
            this.dots[this.currentSlide].classList.remove('active');

            // Update current slide
            this.currentSlide = slideIndex;

            // Add active class to new slide and dot
            this.slides[this.currentSlide].classList.add('active');
            this.dots[this.currentSlide].classList.add('active');
        },

        nextSlide: function() {
            let nextSlide = (this.currentSlide + 1) % this.totalSlides;
            this.goToSlide(nextSlide);
        },

        startSlider: function() {
            // Clear any existing interval
            if (this.slideInterval) {
                clearInterval(this.slideInterval);
            }
            
            // Start new interval (change slide every 5 seconds)
            this.slideInterval = setInterval(() => {
                this.nextSlide();
            }, 7000);
        },

        pauseSlider: function() {
            if (this.slideInterval) {
                clearInterval(this.slideInterval);
            }
        }
    };

    // Initialize hero slider
    heroSlider.init();




    
    // Multi-Testimonial Slider Functionality
    const testimonialSlider = {
        slider: document.querySelector('.testimonial-slider'),
        slides: document.querySelectorAll('.testimonial-slide'),
        prevButton: document.querySelector('.testimonial-slider-arrow.prev'),
        nextButton: document.querySelector('.testimonial-slider-arrow.next'),
        dots: document.querySelectorAll('.testimonial-dot'),
        currentIndex: 0,
        totalSlides: 0,
        visibleSlides: 2, // Number of visible slides at once
        slideWidth: 0, // Width of a single slide
        moveAmount: 0, // Amount to move per transition
        slideInterval: null,
        autoRotateDelay: 3000, // 5 seconds between transitions
        
        init: function() {
            // Check if testimonial elements exist on the page
            if (!this.slider || this.slides.length === 0) {
                return; // Exit if testimonial slider is not on the page
            }
            
            this.totalSlides = this.slides.length;
            
            // Calculate the number of visible slides based on screen width
            this.updateVisibleSlides();
            
            // Set up event listeners for navigation
            if (this.prevButton) {
                this.prevButton.addEventListener('click', () => {
                    this.prevSlide();
                    this.stopAutoRotate();
                    this.startAutoRotate();
                });
            }
            
            if (this.nextButton) {
                this.nextButton.addEventListener('click', () => {
                    this.nextSlide();
                    this.stopAutoRotate();
                    this.startAutoRotate();
                });
            }
            
            // Set up dot navigation
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    this.goToSlide(index);
                    this.stopAutoRotate();
                    this.startAutoRotate();
                });
            });
            
            // Set up hover events to pause/resume slider
            this.slider.addEventListener('mouseenter', () => this.stopAutoRotate());
            this.slider.addEventListener('mouseleave', () => this.startAutoRotate());
            
            // Set up touch events for mobile
            this.setupTouchEvents();
            
            // Listen for window resize to adjust visible slides
            window.addEventListener('resize', () => {
                this.updateVisibleSlides();
                this.goToSlide(this.currentIndex);
            });
            
            // Initialize and start auto rotation
            this.goToSlide(0);
            this.startAutoRotate();
            
            // Handle visibility change (when user switches tabs)
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.stopAutoRotate();
                } else {
                    this.startAutoRotate();
                }
            });
        },
        
        updateVisibleSlides: function() {
            // Responsive adjustment: set number of visible slides based on screen width
            if (window.innerWidth <= 768) {
                this.visibleSlides = 1; // Show one testimonial on mobile
            } else {
                this.visibleSlides = 2; // Show two testimonials on larger screens
            }
            
            // Set the width for all slides
            this.slides.forEach(slide => {
                slide.style.minWidth = `${100 / this.visibleSlides}%`;
            });
            
            // Calculate movement amount (move one slide at a time)
            this.moveAmount = 100 / this.visibleSlides;
        },
        
        goToSlide: function(index) {
            // Ensure index is within bounds for showing 2 slides at once
            const maxIndex = this.totalSlides - this.visibleSlides;
            
            if (index < 0) {
                index = 0;
            } else if (index > maxIndex) {
                index = maxIndex;
            }
            
            // Update current index
            this.currentIndex = index;
            
            // Move the slider (multiplying by moveAmount to move one slide at a time)
            this.slider.style.transform = `translateX(-${this.currentIndex * this.moveAmount}%)`;
            
            // Update active dot
            this.dots.forEach((dot, i) => {
                if (i === Math.min(this.currentIndex, this.dots.length - 1)) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        },
        
        nextSlide: function() {
            // If showing last set of slides, loop back to beginning
            if (this.currentIndex >= this.totalSlides - this.visibleSlides) {
                this.goToSlide(0);
            } else {
                // Otherwise, move one slide forward
                this.goToSlide(this.currentIndex + 1);
            }
        },
        
        prevSlide: function() {
            // If at the beginning, loop to end
            if (this.currentIndex <= 0) {
                this.goToSlide(this.totalSlides - this.visibleSlides);
            } else {
                // Otherwise, move one slide backward
                this.goToSlide(this.currentIndex - 1);
            }
        },
        
        startAutoRotate: function() {
            this.stopAutoRotate(); // Clear any existing interval
            this.slideInterval = setInterval(() => this.nextSlide(), this.autoRotateDelay);
        },
        
        stopAutoRotate: function() {
            if (this.slideInterval) {
                clearInterval(this.slideInterval);
            }
        },
        
        setupTouchEvents: function() {
            let touchStartX = 0;
            let touchEndX = 0;
            
            this.slider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                this.stopAutoRotate();
            }, {passive: true});
            
            this.slider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe(touchStartX, touchEndX);
                this.startAutoRotate();
            }, {passive: true});
        },
        
        handleSwipe: function(startX, endX) {
            const swipeThreshold = 50; // Minimum distance required for a swipe
            
            if (endX < startX - swipeThreshold) {
                // Swipe left - go to next slide
                this.nextSlide();
            } else if (endX > startX + swipeThreshold) {
                // Swipe right - go to previous slide
                this.prevSlide();
            }
        }
    };
    
    // Initialize testimonial slider
    testimonialSlider.init();

    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-container')) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });

   
    
});