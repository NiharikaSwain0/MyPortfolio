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
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateGlow() {
        const dx = mouseX - glowX;
        const dy = mouseY - glowY;
        
        glowX += dx * 0.1;
        glowY += dy * 0.1;

        mouseGlow.style.left = glowX + 'px';
        mouseGlow.style.top = glowY + 'px';
        
        requestAnimationFrame(animateGlow);
    }
    animateGlow();

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

    // 7. Certificate 3D Circular Gallery Logic
    const certStack = document.getElementById('main-cert-stack');
    const certLibraryItems = document.querySelectorAll('#cert-library .cert-item');
    const certModal = document.getElementById('cert-modal');
    const modalCircle = document.getElementById('modal-circle');
    const closeModal = document.querySelector('.close-modal');

    // Full Viewer Elements
    const fullViewer = document.getElementById('full-cert-viewer');
    const viewerImg = document.getElementById('viewer-img');
    const viewerTitle = document.getElementById('viewer-title');
    const viewerDesc = document.getElementById('viewer-desc');
    const closeViewer = document.querySelector('.close-viewer');
    const viewerPrev = document.getElementById('viewer-prev');
    const viewerNext = document.getElementById('viewer-next');

    let rotationY = 0;
    let autoRotateInterval;
    let isDragging = false;
    let startX;
    let currentViewerIndex = 0;
    let walkSum = 0;

    function createCertCircle() {
        if (!modalCircle) return;
        modalCircle.innerHTML = '';
        const count = certLibraryItems.length;
        
        let radius;
        const screenWidth = window.innerWidth;
        if (screenWidth < 480) radius = 220;
        else if (screenWidth < 768) radius = 350;
        else radius = 500;

        const angleStep = 360 / count;

        certLibraryItems.forEach((item, index) => {
            const src = item.getAttribute('data-src');
            const title = item.getAttribute('data-title');
            const desc = item.getAttribute('data-desc');

            const card = document.createElement('div');
            card.className = 'modal-cert-card';
            
            const angle = index * angleStep;
            const baseTransform = `rotateY(${angle}deg) translateZ(${radius}px)`;
            card.style.transform = baseTransform;
            card.style.setProperty('--base-transform', baseTransform);
            
            card.innerHTML = `
                <img src="${src}" alt="${title}">
                <div class="modal-cert-info">
                    <h4>${title}</h4>
                    <p>${desc}</p>
                </div>
            `;

            card.addEventListener('click', (e) => {
                if (Math.abs(walkSum) > 5) return;
                openFullViewer(index);
            });

            modalCircle.appendChild(card);
        });
    }

    function startAutoRotate() {
        stopAutoRotate();
        autoRotateInterval = setInterval(() => {
            rotationY -= 0.2;
            modalCircle.style.transform = `rotateY(${rotationY}deg)`;
        }, 20);
    }

    function stopAutoRotate() {
        clearInterval(autoRotateInterval);
    }

    // Spin logic
    if (certModal) {
        certModal.addEventListener('mousemove', (e) => {
            if (!certModal.classList.contains('active')) return;

            // Spin logic
            if (isDragging) {
                const x = e.pageX;
                const walk = (x - startX) * 0.2;
                rotationY += walk;
                walkSum += Math.abs(walk);
                modalCircle.style.transform = `rotateY(${rotationY}deg)`;
                startX = x;
            }
        });

        certModal.addEventListener('mousedown', (e) => {
            if (e.target.closest('.modal-cert-card')) return;
            isDragging = true;
            startX = e.pageX;
            walkSum = 0;
            stopAutoRotate();
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                startAutoRotate();
            }
        });

        // Touch support
        certModal.addEventListener('touchstart', (e) => {
            if (e.target.closest('.modal-cert-card')) return;
            isDragging = true;
            startX = e.touches[0].pageX;
            walkSum = 0;
            stopAutoRotate();
        });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const x = e.touches[0].pageX;
            const walk = (x - startX) * 0.2;
            rotationY += walk;
            walkSum += Math.abs(walk);
            modalCircle.style.transform = `rotateY(${rotationY}deg)`;
            startX = x;
        });

        window.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                startAutoRotate();
            }
        });
    }

    function openCertModal() {
        createCertCircle();
        certModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        header.style.display = 'none'; // Hide header
        rotationY = 0;
        modalCircle.style.transform = `rotateY(0deg)`;
        startAutoRotate();
    }

    function closeCertModal() {
        certModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        header.style.display = 'block'; // Show header
        stopAutoRotate();
    }

    function openFullViewer(index) {
        currentViewerIndex = index;
        const item = certLibraryItems[currentViewerIndex];
        const src = item.getAttribute('data-src');
        const title = item.getAttribute('data-title');
        const desc = item.getAttribute('data-desc');

        viewerImg.style.opacity = '0';
        setTimeout(() => {
            viewerImg.src = src;
            viewerTitle.textContent = title;
            viewerDesc.textContent = desc;
            viewerImg.style.opacity = '1';
        }, 200);

        fullViewer.classList.add('active');
        document.body.style.overflow = 'hidden';
        stopAutoRotate();
    }

    function closeFullViewer() {
        fullViewer.classList.remove('active');
        if (certModal.classList.contains('active')) {
            startAutoRotate();
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    function navigateViewer(direction) {
        const count = certLibraryItems.length;
        currentViewerIndex = (currentViewerIndex + direction + count) % count;
        openFullViewer(currentViewerIndex);
    }

    if (viewerPrev) viewerPrev.addEventListener('click', () => navigateViewer(-1));
    if (viewerNext) viewerNext.addEventListener('click', () => navigateViewer(1));
    if (certStack) certStack.addEventListener('click', openCertModal);
    if (closeModal) closeModal.addEventListener('click', closeCertModal);
    if (closeViewer) closeViewer.addEventListener('click', closeFullViewer);

    if (certModal) {
        certModal.addEventListener('click', (e) => {
            if (e.target === certModal) closeCertModal();
        });
    }

    if (fullViewer) {
        fullViewer.addEventListener('click', (e) => {
            if (e.target === fullViewer) closeFullViewer();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (fullViewer.classList.contains('active')) {
            if (e.key === 'Escape') closeFullViewer();
            if (e.key === 'ArrowRight') navigateViewer(1);
            if (e.key === 'ArrowLeft') navigateViewer(-1);
            return;
        }
        if (certModal.classList.contains('active')) {
            if (e.key === 'Escape') closeCertModal();
        }
    });
});
