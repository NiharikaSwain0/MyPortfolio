document.addEventListener('DOMContentLoaded', () => {
    // 1. Particle Background
    const canvas = document.getElementById('canvas-bg');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function initCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function createParticles() {
        particles = [];
        const particleCount = Math.floor(window.innerWidth / 10);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    initCanvas();
    createParticles();
    animateParticles();

    window.addEventListener('resize', () => {
        initCanvas();
        createParticles();
    });

    // 2. Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('i');

    // Load saved theme
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const isLight = body.classList.contains('light-mode');
        
        if (isLight) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('portfolio-theme', 'light');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('portfolio-theme', 'dark');
        }
    });

    // 3. Mouse Glow Effect
    const mouseGlow = document.getElementById('mouse-glow');
    document.addEventListener('mousemove', (e) => {
        mouseGlow.style.left = e.clientX + 'px';
        mouseGlow.style.top = e.clientY + 'px';
    });

    // 3. Typing Animation
    const typingText = document.getElementById('typing-text');
    const roles = ['Data Scientist', 'ML Engineer', 'Full Stack Developer', 'Problem Solver'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 150;

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }
    type();

    // 4. Scroll Reveal & Navbar Highlight
    const revealElements = document.querySelectorAll('.reveal');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const header = document.getElementById('header');

    function handleScroll() {
        // Header blur on scroll
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll reveal for all .reveal elements
        revealElements.forEach(el => {
            const top = window.scrollY;
            const offset = el.offsetTop - window.innerHeight + 100;
            
            // Check if element is in view OR if we've reached the bottom of the page
            const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50;
            
            if (top >= offset || isAtBottom) {
                el.classList.add('active');
            }
        });

        // Navbar highlight based on sections
        sections.forEach(sec => {
            const top = window.scrollY;
            const offset = sec.offsetTop - 150;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');

            if (top >= offset && top < offset + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('load', handleScroll);
    handleScroll(); // Run once on load

    // 5. Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 6. Contact Form to Google Sheets
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // UI Feedback
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            formStatus.style.display = 'block';
            formStatus.style.color = 'var(--secondary-accent)';
            formStatus.textContent = 'Transmitting data...';

            const formData = new FormData(contactForm);
            
            // REPLACE THIS URL with your Google Apps Script Web App URL
            const scriptURL = 'https://script.google.com/macros/s/AKfycbzkVfma1zU2ImCtxMzVFJnfogypNyDFiWSNQk7pcIzLYtIc4U7oXChbxSksTNpuqDIz/exec';

            try {
                const response = await fetch(scriptURL, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    formStatus.style.color = '#4ade80'; // Success green
                    formStatus.textContent = 'Transmission received successfully!';
                    contactForm.reset();
                } else {
                    throw new Error('Failed to send');
                }
            } catch (error) {
                console.error('Error!', error.message);
                formStatus.style.color = '#ef4444'; // Error red
                formStatus.textContent = 'Transmission failed. Please try again later.';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Transmission';
                
                // Hide status after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
            }
        });
    }
});
