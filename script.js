// Typing Effect
const words = ["Software Developer", "Python Expert", "AI Enthusiast", "Full-Stack Developer"];
let i = 0;
let timer;

function typeWriter() {
    const heading = document.querySelector(".typewriter");
    const word = words[i];
    let current = heading.textContent;
    
    if (current.length < word.length) {
        heading.textContent = word.substring(0, current.length + 1);
        timer = setTimeout(typeWriter, 100);
    } else {
        setTimeout(erase, 2000);
    }
}

function erase() {
    const heading = document.querySelector(".typewriter");
    const word = words[i];
    let current = heading.textContent;
    
    if (current.length > 0) {
        heading.textContent = word.substring(0, current.length - 1);
        timer = setTimeout(erase, 50);
    } else {
        i = (i + 1) % words.length;
        typeWriter();
    }
}

document.addEventListener('DOMContentLoaded', typeWriter);

// Scroll Animation (Fade In)
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
});

const hiddenElements = document.querySelectorAll('.timeline-item');
hiddenElements.forEach((el) => observer.observe(el));

// Active Link Highlighter
const sections = document.querySelectorAll('section');
const navLi = document.querySelectorAll('nav ul li a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLi.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href').includes(current)) {
            a.classList.add('active');
        }
    });
});

// Carousel Logic
const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.next-btn');
const prevButton = document.querySelector('.prev-btn');
const dotsNav = document.querySelector('.carousel-nav');
const dots = Array.from(dotsNav.children);

const slideWidth = slides[0].getBoundingClientRect().width;

// Arrange slides next to one another
const setSlidePosition = (slide, index) => {
    slide.style.left = slideWidth * index + 'px';
};
slides.forEach(setSlidePosition);

const moveToSlide = (track, currentSlide, targetSlide) => {
    track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
    currentSlide.classList.remove('current-slide');
    targetSlide.classList.add('current-slide');
};

const updateDots = (currentDot, targetDot) => {
    currentDot.classList.remove('current-slide');
    targetDot.classList.add('current-slide');
};

// Next Button
nextButton.addEventListener('click', e => {
    const currentSlide = track.querySelector('.current-slide');
    let nextSlide = currentSlide.nextElementSibling;
    const currentDot = dotsNav.querySelector('.current-slide');
    let nextDot = currentDot.nextElementSibling;

    if (!nextSlide) {
        nextSlide = slides[0];
        nextDot = dots[0];
    }

    moveToSlide(track, currentSlide, nextSlide);
    updateDots(currentDot, nextDot);
});

// Prev Button
prevButton.addEventListener('click', e => {
    const currentSlide = track.querySelector('.current-slide');
    let prevSlide = currentSlide.previousElementSibling;
    const currentDot = dotsNav.querySelector('.current-slide');
    let prevDot = currentDot.previousElementSibling;

    if (!prevSlide) {
        prevSlide = slides[slides.length - 1];
        prevDot = dots[dots.length - 1];
    }

    moveToSlide(track, currentSlide, prevSlide);
    updateDots(currentDot, prevDot);
});

// Dots Navigation
dotsNav.addEventListener('click', e => {
    const targetDot = e.target.closest('button');
    if (!targetDot) return;

    const currentSlide = track.querySelector('.current-slide');
    const currentDot = dotsNav.querySelector('.current-slide');
    const targetIndex = dots.findIndex(dot => dot === targetDot);
    const targetSlide = slides[targetIndex];

    moveToSlide(track, currentSlide, targetSlide);
    updateDots(currentDot, targetDot);
});

// Modal Logic
const modal = document.getElementById("project-modal");
const btns = document.querySelectorAll(".details-btn");
const span = document.getElementsByClassName("close-modal")[0];
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");

// Project Data - UPDATED with all projects
const projectData = {
    1: {
        title: "MedHelp - AI Clinical Decision Support System",
        desc: "A Python-based AI tool developed for the Brazilian public health system (PEC). Uses Natural Language Processing to analyze medical notes, adapt language for different audiences, and automatically recommend preventive exams based on patient demographics and medical history. Achieved 92% accuracy in terminological normalization with 100% recall rates. Tech Stack: Python, pandas, scikit-learn, NumPy, NLP, Healthcare APIs."
    },
    2: {
        title: "NutriQuest - Gamified Nutrition Tracker",
        desc: "A cross-platform mobile application that transforms nutrition tracking into an engaging gamified experience. Built with React Native and Expo, featuring an interactive dashboard with real-time nutritional visualization, daily/weekly challenges, competitive leaderboards, comprehensive profile management, and full Portuguese localization for Brazilian users. Implements offline-first functionality with custom state management. Tech Stack: React Native, Expo, Mobile Development, i18n."
    },
    3: {
        title: "LABNOV Research Laboratory Website",
        desc: "Comprehensive bilingual (Portuguese/English) website for UFCG's LABNOV research laboratory. Features automated publication synchronization from Brazil's Plataforma Lattes using custom API integration, content management through Sanity CMS for non-technical staff updates, dedicated sections for research projects and team members, responsive design optimized for all devices, and SEO optimization for academic discoverability. Successfully overcame CAPTCHA challenges through creative technical solutions. Tech Stack: React, Sanity CMS, API Integration, Bilingual Support."
    },
    4: {
        title: "Financial System Optimization - Accenture",
        desc: "Backend optimization project for a major financial system handling high-volume transaction processing. Worked with Oracle BRM and C to improve system performance, automated financial reporting with Shell scripts, reducing processing time and improving data accuracy. Generated comprehensive financial reports using Oracle BI Publisher. Collaborated in Agile teams using JIRA for project coordination. Tech Stack: Oracle BRM, C, Shell Script, Oracle BI Publisher, Agile/Scrum."
    }
};

btns.forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-project');
        modalTitle.textContent = projectData[id].title;
        modalDesc.textContent = projectData[id].desc;
        modal.style.display = "block";
    });
});

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Hamburger Menu Toggle (for mobile)
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}
