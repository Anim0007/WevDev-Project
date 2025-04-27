document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    const htmlElement = document.documentElement;
    
    // Check if theme preference is saved in localStorage
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
            }, 3000);
        },

        pauseSlider: function() {
            if (this.slideInterval) {
                clearInterval(this.slideInterval);
            }
        }
    };

    // Initialize hero slider
    heroSlider.init();

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

    // Coverage area accordion functionality
    const areaHeaders = document.querySelectorAll('.area-header');
    
    if (areaHeaders) {
        areaHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const content = this.nextElementSibling;
                content.classList.toggle('active');
                
                // Update icon
                const icon = this.querySelector('i');
                if (content.classList.contains('active')) {
                    icon.className = 'fas fa-chevron-up';
                } else {
                    icon.className = 'fas fa-chevron-down';
                }
            });
        });
    }

    // Speed Calculator for Packages Page
    const speedCalculator = document.getElementById('speedCalculator');
    
    if (speedCalculator) {
        const usageSlider = document.getElementById('usageSlider');
        const deviceSlider = document.getElementById('deviceSlider');
        const usageValue = document.getElementById('usageValue');
        const deviceValue = document.getElementById('deviceValue');
        const recommendedSpeed = document.getElementById('recommendedSpeed');
        const recommendedPackage = document.getElementById('recommendedPackage');
        
        function updateRecommendation() {
            const usage = parseInt(usageSlider.value);
            const devices = parseInt(deviceSlider.value);
            
            // Update displayed values
            usageValue.textContent = usage;
            deviceValue.textContent = devices;
            
            // Calculate recommended speed (simplified algorithm)
            let speed = 0;
            
            // Base speed per usage level
            switch(usage) {
                case 1: // Light usage
                    speed = 5;
                    break;
                case 2: // Medium usage
                    speed = 15;
                    break;
                case 3: // Heavy usage
                    speed = 25;
                    break;
                case 4: // Super heavy usage
                    speed = 40;
                    break;
                case 5: // Extreme usage
                    speed = 60;
                    break;
            }
            
            // Multiply by device factor
            speed = speed * (1 + (devices - 1) * 0.5);
            
            // Round to nearest 5
            speed = Math.ceil(speed / 5) * 5;
            
            // Update recommendation
            recommendedSpeed.textContent = speed + ' Mbps';
            
            // Recommend package
            if (speed <= 25) {
                recommendedPackage.textContent = 'Basic Package';
            } else if (speed <= 50) {
                recommendedPackage.textContent = 'Standard Package';
            } else if (speed <= 100) {
                recommendedPackage.textContent = 'Premium Package';
            } else {
                recommendedPackage.textContent = 'Business Package';
            }
        }
        
        usageSlider.addEventListener('input', updateRecommendation);
        deviceSlider.addEventListener('input', updateRecommendation);
        
        // Initialize
        updateRecommendation();
    }

    // Bill payment form validation
    const paymentForm = document.getElementById('paymentForm');
    
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const userId = document.getElementById('userId').value;
            const amount = document.getElementById('amount').value;
            
            // Simple validation
            let isValid = true;
            let errorMessage = '';
            
            if (!userId || userId.length < 5) {
                isValid = false;
                errorMessage += 'Please enter a valid User ID (minimum 5 characters).\n';
            }
            
            if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
                isValid = false;
                errorMessage += 'Please enter a valid payment amount.\n';
            }
            
            if (isValid) {
                // In a real app, this would submit to server
                alert('Payment processing initiated! Thank you.');
                paymentForm.reset();
            } else {
                alert(errorMessage);
            }
        });
    }

})