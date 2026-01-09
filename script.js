// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle (Implemented properly now)
const mobileMenu = document.getElementById('mobile-menu');
const navLinksContainer = document.querySelector('.nav-links');

if (mobileMenu) {
    mobileMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinksContainer.classList.toggle('active');
        const icon = mobileMenu.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            const icon = mobileMenu.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });

    // Close menu when clicking anywhere else on the screen
    document.addEventListener('click', (e) => {
        if (!navLinksContainer.contains(e.target) && !mobileMenu.contains(e.target)) {
            if (navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
                const icon = mobileMenu.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        }
    });
}

// Reveal on Scroll Animation
const revealElements = document.querySelectorAll('.reveal, .stat-item, .service-card, .fade-up');
const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');

            // If it's a stat item, trigger the counter
            if (entry.target.classList.contains('stat-item')) {
                const num = entry.target.querySelector('.stat-number');
                if (num && !num.classList.contains('counted')) {
                    num.classList.add('counted');
                    startCount(num);
                }
            }

            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// Stats Counter Animation
function startCount(el) {
    const target = parseInt(el.getAttribute('data-target'));
    if (isNaN(target)) return;

    const duration = 1500;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const currentCount = Math.round(target * progress);

        if (frame <= totalFrames) {
            el.innerText = '+' + currentCount.toLocaleString();
        } else {
            el.innerText = '+' + target.toLocaleString();
            clearInterval(counter);
        }
    }, frameDuration);
}

// Data Collection Form Logic
const form = document.getElementById('soutrDataForm');
const formStatus = document.getElementById('formStatus');

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Format message for WhatsApp
        let typeText = '';
        switch (data.type) {
            case 'volunteer': typeText = 'تطوع بجهد'; break;
            case 'donor': typeText = 'تبرع مادي/عيني'; break;
            case 'help': typeText = 'طلب مساعدة (حالة إنسانية)'; break;
            default: typeText = 'استفسار عام';
        }

        const whatsappMessage = `*رسالة جديدة من الموقع الإلكتروني*%0A%0A` +
            `*الاسم:* ${data.name}%0A` +
            `*رقم الهاتف:* ${data.phone}%0A` +
            `*نوع المشاركة:* ${typeText}%0A` +
            `*تفاصيل الرسالة:* ${data.message || 'لا يوجد'}%0A%0A` +
            `_تم الإرسال عبر مؤسسة ستر الخيرية_`;

        setTimeout(() => {
            formStatus.innerHTML = '<i class="fas fa-check-circle"></i> تم إرسال بياناتك بنجاح! سيتم توجيهك الآن للمتابعة عبر واتساب.';
            formStatus.className = 'form-status success';
            formStatus.style.display = 'block';

            setTimeout(() => {
                window.open(`https://wa.me/201000700490?text=${whatsappMessage}`, '_blank');
                form.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                setTimeout(() => { formStatus.style.display = 'none'; }, 5000);
            }, 2000);
        }, 1500);
    });
}

// Smooth Scrolling for all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (navLinksContainer.classList.contains('active')) {
                mobileMenu.click();
            }
        }
    });
});

// Parallax effect on mouse move for Hero content
const hero = document.querySelector('.hero');
if (hero) {
    hero.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        const content = hero.querySelector('.hero-content');
        if (content) {
            content.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    });
}

// Initialize counters that are already in view
window.addEventListener('load', () => {
    document.querySelectorAll('.stat-item').forEach(item => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
            item.classList.add('active');
            const num = item.querySelector('.stat-number');
            if (num && !num.classList.contains('counted')) {
                num.classList.add('counted');
                setTimeout(() => startCount(num), 500);
            }
        }
    });
});
