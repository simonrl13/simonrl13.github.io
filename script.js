// Typing Effect
const words = ["Software Developer", "Python Expert", "Full Stack Dev", "AI Enthusiast"];
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

// Scroll Animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
});

const hiddenElements = document.querySelectorAll('.timeline-item');
hiddenElements.forEach((el) => observer.observe(el));

// Carousel Logic
const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.next-btn');
const prevButton = document.querySelector('.prev-btn');

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

nextButton.addEventListener('click', e => {
    const currentSlide = track.querySelector('.current-slide');
    const nextSlide = currentSlide.nextElementSibling || slides[0]; // Loop back to start
    moveToSlide(track, currentSlide, nextSlide);
});

prevButton.addEventListener('click', e => {
    const currentSlide = track.querySelector('.current-slide');
    const prevSlide = currentSlide.previousElementSibling || slides[slides.length - 1]; // Loop to end
    moveToSlide(track, currentSlide, prevSlide);
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
        desc: "A Python-based AI tool developed for the Brazilian public health system (PEC). It uses NLP to analyze medical notes and automatically recommends preventive exams, reducing administrative time by 40%."
    },
    2: {
        title: "Financial System Optimization",
        desc: "Worked at Accenture to optimize high-volume transaction processing using C and Oracle BRM. Automated financial reporting with Shell scripts, improving data accuracy."
    },
    3: {
        title: "Hybrid Mobile App",
        desc: "A cross-platform mobile application built with Ionic and Vue.js. Features include real-time data sync, offline mode, and a custom UI system designed in Figma."
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