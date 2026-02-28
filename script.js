  document.addEventListener('DOMContentLoaded', () => {

            // --- Mobile Menu Toggle ---
            const mobileBtn = document.getElementById('mobileMenuBtn');
            const mobileNav = document.getElementById('mobileNav');
            const mobileLinks = document.querySelectorAll('.mobile-link');

            mobileBtn.addEventListener('click', () => {
                mobileNav.classList.toggle('hidden');
                mobileNav.classList.toggle('flex');
            });

            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileNav.classList.add('hidden');
                    mobileNav.classList.remove('flex');
                });
            });

            // --- Dark/Light Mode Toggle ---
            const htmlTag = document.documentElement;
            const themeToggles = [document.getElementById('themeToggle'), document.getElementById('themeToggleMobile')];

            // Check Local Storage
            if (localStorage.theme === 'light') {
                htmlTag.classList.remove('dark');
            } else {
                htmlTag.classList.add('dark'); // Default dark
            }

            themeToggles.forEach(btn => {
                if (!btn) return;
                btn.addEventListener('click', () => {
                    htmlTag.classList.toggle('dark');
                    const navbar = document.getElementById('navbar');
                    if (htmlTag.classList.contains('dark')) {
                        localStorage.theme = 'dark';
                        navbar.classList.remove('light-mode-nav');
                    } else {
                        localStorage.theme = 'light';
                        navbar.classList.add('light-mode-nav');
                    }
                });
            });

            // --- Sticky Navbar ---
            const navbar = document.getElementById('navbar');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });

            // --- Scroll Reveal Animation ---
            const reveals = document.querySelectorAll('.reveal');
            const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            }, revealOptions);

            reveals.forEach(reveal => revealObserver.observe(reveal));

            // --- Animated Counter ---
            const counters = document.querySelectorAll('.counter');
            let hasCounted = false;

            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !hasCounted) {
                        counters.forEach(counter => {
                            const target = +counter.getAttribute('data-target');
                            const duration = 2000; // ms
                            const increment = target / (duration / 16); // 60fps
                            let current = 0;

                            const updateCounter = () => {
                                current += increment;
                                if (current < target) {
                                    counter.innerText = Math.ceil(current);
                                    requestAnimationFrame(updateCounter);
                                } else {
                                    counter.innerText = target;
                                }
                            };
                            updateCounter();
                        });
                        hasCounted = true;
                    }
                });
            }, { threshold: 0.5 });

            if (counters.length > 0) counterObserver.observe(counters[0].parentElement);

            // --- Portfolio Filtering ---
            const filterBtns = document.querySelectorAll('.filter-btn');
            const portfolioItems = document.querySelectorAll('.portfolio-item');

            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Update Active Button
                    filterBtns.forEach(b => b.classList.remove('active', 'text-darkBg'));
                    btn.classList.add('active');

                    const filterValue = btn.getAttribute('data-filter');

                    portfolioItems.forEach(item => {
                        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                            item.style.display = 'block';
                            setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
                        } else {
                            item.style.opacity = '0';
                            item.style.transform = 'scale(0.9)';
                            setTimeout(() => { item.style.display = 'none'; }, 300);
                        }
                    });
                });
            });

            // --- Testimonial Slider ---
            const slider = document.getElementById('testimonialSlider');
            const dots = document.querySelectorAll('.slider-dot');
            let currentSlide = 0;
            let slideInterval;

            const updateSlider = (index) => {
                slider.style.transform = `translateX(-${index * 100}%)`;
                dots.forEach(dot => {
                    dot.classList.remove('bg-brandOrange');
                    dot.classList.add('bg-gray-400', 'dark:bg-gray-600');
                });
                dots[index].classList.remove('bg-gray-400', 'dark:bg-gray-600');
                dots[index].classList.add('bg-brandOrange');
                currentSlide = index;
            };

            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    updateSlider(index);
                    resetInterval();
                });
            });

            const nextSlide = () => {
                let next = (currentSlide + 1) % dots.length;
                updateSlider(next);
            };

            const resetInterval = () => {
                clearInterval(slideInterval);
                slideInterval = setInterval(nextSlide, 5000);
            };

            if (slider) resetInterval();

            // --- Lead / Exit Intent Popup ---
            const popup = document.getElementById('leadPopup');
            const closePopupBtn = document.getElementById('closePopupBtn');
            const popupForm = document.getElementById('popupForm');
            let popupShown = false;

            const showPopup = () => {
                if (!popupShown) {
                    popup.classList.remove('hidden');
                    // slight delay for css transition
                    setTimeout(() => {
                        popup.classList.remove('opacity-0');
                        popup.firstElementChild.classList.remove('scale-95');
                        popup.firstElementChild.classList.add('scale-100');
                    }, 10);
                    popupShown = true;
                }
            };

            const hidePopup = () => {
                popup.classList.add('opacity-0');
                popup.firstElementChild.classList.remove('scale-100');
                popup.firstElementChild.classList.add('scale-95');
                setTimeout(() => {
                    popup.classList.add('hidden');
                }, 300);
            };

            // Exit Intent
            document.addEventListener('mouseout', (e) => {
                if (e.clientY < 10 && !popupShown) {
                    showPopup();
                }
            });

            // Time Delay (15 seconds)
            setTimeout(() => {
                if (!popupShown) showPopup();
            }, 15000);

            closePopupBtn.addEventListener('click', hidePopup);
            popup.addEventListener('click', (e) => {
                if (e.target === popup) hidePopup();
            });
            popupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                popup.innerHTML = '<div class="bg-darkCard p-10 rounded-[20px] max-w-md w-full mx-4 text-center border border-brandOrange"><i class="fas fa-check-circle text-5xl text-brandOrange mb-4"></i><h3 class="text-2xl font-bold mb-2">Audit Requested!</h3><p>Check your inbox shortly.</p><button onclick="document.getElementById(\'leadPopup\').classList.add(\'hidden\')" class="mt-6 px-6 py-2 bg-brandOrange text-white rounded-full font-bold">Close</button></div>';
            });

            // Form Submissions
            document.getElementById('contactForm').addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Thank you for reaching out! Our team will contact you within 24 hours.');
                e.target.reset();
            });

        });