// Typing Effect
const words = ["Software Developer", "Python Expert", "Backend Engineer", "AI Enthusiast"];
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

// Modal Logic
const modal = document.getElementById("project-modal");
const btns = document.querySelectorAll(".details-btn");
const span = document.getElementsByClassName("close-modal")[0];
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");

// Project Data
const projectData = {
    1: {
        title: "AI Medical Records Automator",
        desc: "A Python-based AI tool developed for the Brazilian public health system (PEC). It uses NLP to analyze medical notes and automatically recommends preventive exams, reducing administrative time by 40%. Tech Stack: Python, Pandas, Scikit-learn."
    },
    2: {
        title: "Financial System Optimization",
        desc: "Worked at Accenture to optimize high-volume transaction processing using C and Oracle BRM. Automated financial reporting with Shell scripts, improving data accuracy and reducing processing time by 15%."
    },
    3: {
        title: "Hybrid Mobile App",
        desc: "A cross-platform mobile application built with Ionic and Vue.js. Features include real-time data sync, offline mode, and a custom UI system designed in Figma. Deployed to both iOS and Android environments."
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