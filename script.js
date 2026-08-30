document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // THEME MANAGER (DARK / LIGHT MODE)
    // ==========================================================================
    const themeBtn = document.getElementById('theme-btn');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme') || 'dark-theme';
    body.className = savedTheme;

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            if (body.classList.contains('dark-theme')) {
                body.classList.replace('dark-theme', 'light-theme');
                localStorage.setItem('theme', 'light-theme');
            } else {
                body.classList.replace('light-theme', 'dark-theme');
                localStorage.setItem('theme', 'dark-theme');
            }
        });
    }

    // ==========================================================================
    // NAVIGATION HEADER & MOBILE DRAWER
    // ==========================================================================
    const navbar = document.getElementById('navbar');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('open');
            navMenu.classList.toggle('open');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburgerBtn) hamburgerBtn.classList.remove('open');
            if (navMenu) navMenu.classList.remove('open');
        });
    });

    // ==========================================================================
    // MOUSE GLOW BACKGROUND EFFECT
    // ==========================================================================
    const cursorGlow = document.getElementById('cursor-glow');
    
    if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.opacity = '1';
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        });
        
        document.addEventListener('mouseleave', () => {
            cursorGlow.style.opacity = '0';
        });
    }

    // ==========================================================================
    // TYPEWRITER TEXT EFFECT (HERO SECTION)
    // ==========================================================================
    const typedTextSpan = document.getElementById('typed-text');
    const rolesArray = ["Web Developer", "ECE Student", "Python Programmer", "Full-Stack Explorer"];
    const typingSpeed = 100;
    const erasingSpeed = 50;
    const delayBetweenRoles = 2000;
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentRole = rolesArray[roleIndex];
        
        if (isDeleting) {
            typedTextSpan.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextSpan.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeDelay = isDeleting ? erasingSpeed : typingSpeed;

        if (!isDeleting && charIndex === currentRole.length) {
            typeDelay = delayBetweenRoles;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % rolesArray.length;
            typeDelay = 500;
        }

        setTimeout(type, typeDelay);
    }
    
    if (typedTextSpan) {
        setTimeout(type, 1000);
    }

    // ==========================================================================
    // SCROLL REVEAL & NAV LINK AUTO-HIGHLIGHT
    // ==========================================================================
    const sections = document.querySelectorAll('section');
    
    const revealOptions = {
        root: null,
        threshold: 0.02,
        rootMargin: "0px 0px 0px 0px"
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, revealOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetSec = document.querySelector(targetId);
                if (targetSec) {
                    targetSec.classList.add('reveal-visible');
                }
            }
        });
    });

    // ==========================================================================
    // COUNTER STATS ANIMATION
    // ==========================================================================
    const statsGrid = document.querySelector('.about-stats-grid');
    const statCards = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    function startCounters() {
        statCards.forEach(card => {
            const targetStr = card.textContent;
            const targetVal = parseFloat(targetStr);
            const suffix = targetStr.replace(/[0-9.]/g, '');
            
            let currentVal = 0;
            const duration = 2000;
            const steps = 50;
            const increment = targetVal / steps;
            const stepTime = duration / steps;
            
            const timer = setInterval(() => {
                currentVal += increment;
                if (currentVal >= targetVal) {
                    clearInterval(timer);
                    card.textContent = targetVal + suffix;
                } else {
                    if (targetStr.includes('.')) {
                        card.textContent = currentVal.toFixed(1) + suffix;
                    } else {
                        card.textContent = Math.floor(currentVal) + suffix;
                    }
                }
            }, stepTime);
        });
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                startCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (statsGrid) {
        statsObserver.observe(statsGrid);
    }

    // ==========================================================================
    // PORTFOLIO FILTER SYSTEM
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const selectedCategory = button.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                    card.style.display = 'flex';
                    card.classList.remove('fade-out');
                    card.classList.add('fade-in');
                } else {
                    card.classList.remove('fade-in');
                    card.classList.add('fade-out');
                    
                    setTimeout(() => {
                        if (card.classList.contains('fade-out')) {
                            card.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });

    // ==========================================================================
    // CONTACT FORM VALIDATION & SUBMISSION
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formSuccessState = document.getElementById('form-success');
    const submitBtn = document.getElementById('submit-btn');
    const resetFormBtn = document.getElementById('reset-form-btn');
    
    const fields = {
        name: {
            input: document.getElementById('form-name'),
            validate: val => val.trim().length > 0
        },
        email: {
            input: document.getElementById('form-email'),
            validate: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
        },
        subject: {
            input: document.getElementById('form-subject'),
            validate: val => val.trim().length > 0
        },
        message: {
            input: document.getElementById('form-message'),
            validate: val => val.trim().length > 0
        }
    };

    function checkField(fieldName) {
        const field = fields[fieldName];
        if (!field || !field.input) return true;
        const isValid = field.validate(field.input.value);
        const group = field.input.closest('.form-group');
        if (group) {
            group.classList.toggle('error', !isValid);
        }
        return isValid;
    }

    Object.keys(fields).forEach(key => {
        const field = fields[key];
        if (field && field.input) {
            field.input.addEventListener('blur', () => checkField(key));
            field.input.addEventListener('input', () => {
                const group = field.input.closest('.form-group');
                if (group && group.classList.contains('error')) {
                    checkField(key);
                }
            });
        }
    });

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isFormValid = true;
            Object.keys(fields).forEach(key => {
                if (!checkField(key)) isFormValid = false;
            });

            if (isFormValid && submitBtn) {
                submitBtn.classList.add('loading');
                const submitBtnText = submitBtn.querySelector('.btn-text');
                const submitBtnIcon = submitBtn.querySelector('.send-icon');
                
                const originalText = submitBtnText ? submitBtnText.textContent : 'Send Message';
                if (submitBtnText) submitBtnText.textContent = "Sending...";
                if (submitBtnIcon) submitBtnIcon.className = "fa-solid fa-spinner send-icon";
                
                fetch("https://formsubmit.co/ajax/gatlanaveenreddy1@gmail.com", {
                    method: "POST",
                    headers: { "Accept": "application/json" },
                    body: new FormData(contactForm)
                })
                .then(response => {
                    if (response.ok) return response.json();
                    throw new Error("Network response was not ok.");
                })
                .then(() => {
                    submitBtn.classList.remove('loading');
                    if (submitBtnText) submitBtnText.textContent = originalText;
                    if (submitBtnIcon) submitBtnIcon.className = "fa-solid fa-paper-plane send-icon";
                    
                    if (formSuccessState) formSuccessState.classList.add('visible');
                    contactForm.style.opacity = '0';
                    contactForm.style.transform = 'translateY(-20px)';
                    contactForm.style.pointerEvents = 'none';
                })
                .catch(error => {
                    console.error("Error submitting form:", error);
                    submitBtn.classList.remove('loading');
                    if (submitBtnText) submitBtnText.textContent = "Error! Try Again";
                    if (submitBtnIcon) submitBtnIcon.className = "fa-solid fa-triangle-exclamation send-icon";
                    
                    setTimeout(() => {
                        if (submitBtnText) submitBtnText.textContent = originalText;
                        if (submitBtnIcon) submitBtnIcon.className = "fa-solid fa-paper-plane send-icon";
                    }, 3000);
                });
            }
        });
    }

    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', () => {
            if (contactForm) contactForm.reset();
            Object.keys(fields).forEach(key => {
                if (fields[key].input) {
                    const group = fields[key].input.closest('.form-group');
                    if (group) group.classList.remove('error');
                }
            });
            if (formSuccessState) formSuccessState.classList.remove('visible');
            if (contactForm) {
                contactForm.style.opacity = '1';
                contactForm.style.transform = 'translateY(0)';
                contactForm.style.pointerEvents = 'auto';
            }
        });
    }
});
