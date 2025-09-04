// Theme Controller
class ThemeController {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        this.setupThemeToggle();
    }

    applyTheme() {
        document.body.className = this.theme === 'dark' ? 'dark-theme' : '';
        const themeIcon = document.querySelector('.theme-toggle-icon');
        if (themeIcon) {
            themeIcon.textContent = this.theme === 'dark' ? '☀️' : '🌙';
        }
        localStorage.setItem('theme', this.theme);
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
    }

    setupThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// Mouse Tracker
class MouseTracker {
    constructor() {
        this.createCursor();
        this.bindEvents();
    }

    createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(this.cursor);

        this.trail = [];
        for (let i = 0; i < 8; i++) {
            const trailDot = document.createElement('div');
            trailDot.style.cssText = `
                position: fixed;
                width: ${8 - i}px;
                height: ${8 - i}px;
                background: rgba(147, 51, 234, ${0.3 - i * 0.03});
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
            `;
            this.trail.push(trailDot);
            document.body.appendChild(trailDot);
        }
    }

    bindEvents() {
        let mouseX = 0, mouseY = 0;
        let trailX = mouseX, trailY = mouseY;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            this.cursor.style.transform = `translate(${mouseX - 10}px, ${mouseY - 10}px)`;
        });

        const animateTrail = () => {
            let distX = mouseX - trailX;
            let distY = mouseY - trailY;
            trailX += distX * 0.1;
            trailY += distY * 0.1;

            this.trail.forEach((dot, i) => {
                dot.style.transform = `translate(${trailX - (4 - i/2)}px, ${trailY - (4 - i/2)}px)`;
            });

            requestAnimationFrame(animateTrail);
        };
        animateTrail();

        // Cursor interactions
        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
            this.trail.forEach(dot => dot.style.opacity = '1');
        });

        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
            this.trail.forEach(dot => dot.style.opacity = '0');
        });
    }
}

// Smooth scrolling and intersection observer for animations
class AnimationController {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.addScrollEffects();
        this.addHoverEffects();
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe sections for scroll animations
        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });
    }

    addScrollEffects() {
        let ticking = false;

        const updateScrollEffects = () => {
            const scrollY = window.scrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        });
    }

    addHoverEffects() {
        // Enhanced contact item hover effects
        document.querySelectorAll('.contact-item').forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                const icon = e.currentTarget.querySelector('.contact-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.05) rotate(2deg)';
                }
            });

            item.addEventListener('mouseleave', (e) => {
                const icon = e.currentTarget.querySelector('.contact-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });

        // Education item hover effects
        document.querySelectorAll('.education-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-3px)';
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0)';
            });
        });
    }
}

// Utility functions
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Performance optimized resize handler
const handleResize = Utils.debounce(() => {
    // Handle responsive adjustments if needed
    console.log('Window resized');
}, 250);

window.addEventListener('resize', handleResize);

// Typing Effect for Name
class TypingEffect {
    constructor(element, text, speed = 100) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.index = 0;
    }

    start() {
        this.element.textContent = '';
        const typing = () => {
            if (this.index < this.text.length) {
                this.element.textContent += this.text.charAt(this.index);
                this.index++;
                setTimeout(typing, this.speed);
            }
        };
        setTimeout(typing, 500); // Delay before starting
    }
}

// 3D Card Effect
class CardEffects {
    constructor() {
        this.init();
    }

    init() {
        const cards = document.querySelectorAll('.contact-item, .education-item');
        cards.forEach(card => this.add3DEffect(card));
    }

    add3DEffect(card) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateZ(20px)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all controllers
    new ThemeController();
    new AnimationController();
    new MouseTracker();
    new CardEffects();
    
    // Add typing effect to name
    const nameElement = document.querySelector('.name');
    if (nameElement) {
        const originalText = nameElement.textContent;
        new TypingEffect(nameElement, originalText, 150).start();
    }
    
    // Add subtle animation to skills/about text
    const aboutText = document.querySelector('.about-text');
    if (aboutText) {
        aboutText.innerHTML = aboutText.innerHTML
            .replace(/🇬🇧/g, '<span class="emoji-bounce">🇬🇧</span>')
            .replace(/🔬/g, '<span class="emoji-bounce" style="animation-delay: 0.5s">🔬</span>')
            .replace(/🧑🏼‍💻/g, '<span class="emoji-bounce" style="animation-delay: 1s">🧑🏼‍💻</span>')
            .replace(/🪙/g, '<span class="emoji-bounce" style="animation-delay: 1.5s">🪙</span>');
    }
    
    // Add custom cursor effect for interactive elements
    const addCursorEffect = () => {
        document.querySelectorAll('a, button, .contact-item').forEach(element => {
            element.style.cursor = 'none'; // Hide default cursor for custom one
        });
    };
    
    addCursorEffect();
    
    // Preload hover states for better performance
    const preloadHoverStates = () => {
        const style = document.createElement('style');
        style.textContent = `
            .contact-item:hover .contact-icon {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .education-item:hover {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .emoji-bounce {
                display: inline-block;
                animation: bounce 2s infinite;
            }
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
            }
        `;
        document.head.appendChild(style);
    };
    
    preloadHoverStates();
});

// Add subtle parallax effect to header
window.addEventListener('scroll', Utils.throttle(() => {
    const scrolled = window.pageYOffset;
    const header = document.querySelector('.header');
    if (header) {
        const rate = scrolled * -0.3;
        header.style.transform = `translateY(${rate}px)`;
    }
}, 16));

// Add loading animation completion
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger any final animations
    setTimeout(() => {
        document.querySelector('.name')?.classList.add('fully-loaded');
    }, 500);
});