/* =========================================================
   Simon Laborde — schematic identity
   One deliberate animated moment: the left rail trace draws
   in on load, section nodes light in sequence on scroll.
   ========================================================= */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- rail progress + node lighting + nav state ---------- */

const trace       = document.querySelector('.rail__trace');
const toplineFill = document.querySelector('.topline__fill');
const railNodes = [...document.querySelectorAll('.rail__node')];
const navLinks  = [...document.querySelectorAll('.nav__list a')];
const sections  = [...document.querySelectorAll('main section[id]')];

function onScroll() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

    if (trace) trace.style.transform = `translateX(-50%) scaleY(${progress.toFixed(4)})`;
    if (toplineFill) toplineFill.style.width = (progress * 100).toFixed(2) + '%';

    const mid = window.innerHeight * 0.5;
    let activeId = sections.length ? sections[0].id : null;

    sections.forEach(sec => {
        if (sec.getBoundingClientRect().top < mid) activeId = sec.id;
    });

    railNodes.forEach(node => {
        const target = node.dataset.target;
        const sec = document.getElementById(target);
        if (!sec) return;
        node.classList.toggle('is-lit', sec.getBoundingClientRect().top < window.innerHeight * 0.66);
    });

    navLinks.forEach(a => {
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + activeId);
    });
}

let ticking = false;
window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScroll(); ticking = false; });
}, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();

/* ---------- mobile nav ---------- */

const navToggle = document.querySelector('.nav__toggle');
const navMobile = document.getElementById('nav-list-mobile');

navToggle.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!open));
    navToggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    navMobile.hidden = open;
});
navMobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navMobile.hidden = true;
}));

/* ---------- portfolio carousel: native snap-scroll ---------- */

const track   = document.querySelector('.carousel__track');
const cards    = [...track.querySelectorAll('.pcard')];
const ctrlBtns = [...document.querySelectorAll('.carousel__btn')];
const dots     = [...document.querySelectorAll('.carousel__dots li')];

function cardStep() {
    return cards.length > 1
        ? cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left
        : cards[0].getBoundingClientRect().width;
}

function nearestCardIndex() {
    const trackMid = track.getBoundingClientRect().left + track.clientWidth / 2;
    let best = 0, bestDist = Infinity;
    cards.forEach((card, i) => {
        const cardMid = card.getBoundingClientRect().left + card.getBoundingClientRect().width / 2;
        const d = Math.abs(cardMid - trackMid);
        if (d < bestDist) { bestDist = d; best = i; }
    });
    return best;
}

function syncCarousel() {
    const i = nearestCardIndex();
    dots.forEach((d, di) => d.classList.toggle('is-active', di === i));
    const atStart = track.scrollLeft <= 2;
    const atEnd   = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    ctrlBtns.forEach(b => {
        const dir = Number(b.dataset.dir);
        b.disabled = (dir < 0 && atStart) || (dir > 0 && atEnd);
    });

    // subtle parallax — active card only
    if (!reduceMotion) {
        const trackMid = track.getBoundingClientRect().left + track.clientWidth / 2;
        cards.forEach((card, ci) => {
            const inner = card.querySelector('.pcard__inner');
            if (ci === i) {
                const cardMid = card.getBoundingClientRect().left + card.getBoundingClientRect().width / 2;
                const shift = Math.max(-8, Math.min(8, (cardMid - trackMid) / 14));
                inner.style.transform = `translateY(${shift.toFixed(1)}px)`;
            } else {
                inner.style.transform = '';
            }
        });
    }
}

ctrlBtns.forEach(b => b.addEventListener('click', () => {
    track.scrollBy({ left: Number(b.dataset.dir) * cardStep(), behavior: reduceMotion ? 'auto' : 'smooth' });
}));

let cTicking = false;
track.addEventListener('scroll', () => {
    if (cTicking) return;
    cTicking = true;
    requestAnimationFrame(() => { syncCarousel(); cTicking = false; });
}, { passive: true });
window.addEventListener('resize', syncCarousel);
syncCarousel();

/* ---------- LABNOV: live PT / EN toggle on the card ---------- */

const langSwitch = document.querySelector('.lang-switch');
if (langSwitch) {
    const card = langSwitch.closest('.pcard');
    const buttons = [...langSwitch.querySelectorAll('button')];
    langSwitch.addEventListener('click', e => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const lang = btn.dataset.lang;
        buttons.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
        card.querySelectorAll('[data-i18n]').forEach(el => {
            el.innerHTML = el.dataset[lang];
        });
    });
}

/* ---------- project dialog ---------- */

const projects = {
    medhelp: {
        tag: '01 · AI clinical decision support',
        title: 'MedHelp',
        body: 'A Python NLP tool built for Brazil’s public health record system (PEC). It reads free-text clinical notes, normalizes inconsistent terminology, rewrites explanations for the intended audience (clinician vs. patient), and recommends preventive exams from patient demographics and medical history. Grew directly out of my undergraduate thesis on generative AI in clinical decision support.',
        role: 'Sole developer — research, modelling, implementation',
        outcome: '92% accuracy on terminology normalization, 100% recall on the target exam-recommendation set',
        stack: 'Python · pandas · scikit-learn · NumPy · NLP · healthcare data (PEC)'
    },
    nutriquest: {
        tag: '02 · gamified nutrition tracker',
        title: 'NutriQuest',
        body: 'A cross-platform mobile app that reframes nutrition tracking as a game. Real-time nutritional dashboards, daily and weekly quests, streaks, a competitive leaderboard, and full profile management — all localized in Brazilian Portuguese. Built offline-first with custom state management so it stays usable without a connection.',
        role: 'Mobile developer — architecture, UI, localization',
        outcome: 'Shipped cross-platform from a single codebase with offline-first sync',
        stack: 'React Native · Expo · i18n · custom state management'
    },
    labnov: {
        tag: '03 · bilingual research platform',
        title: 'LABNOV Research Lab',
        body: 'A fully bilingual (PT / EN) website for UFCG’s LABNOV research laboratory. Publications sync automatically from Brazil’s Plataforma Lattes through a custom integration — including working around CAPTCHA protection — while non-technical staff edit everything else through Sanity CMS. Sections for projects, people, and publications, tuned for academic SEO.',
        role: 'Full-stack developer — integration, CMS modelling, i18n',
        outcome: 'Zero-maintenance publication list; staff update content without developer involvement',
        stack: 'React · Sanity CMS · Lattes API integration · bilingual routing'
    },
    financial: {
        tag: '04 · enterprise backend, Accenture',
        title: 'Enterprise Billing Optimization — Accenture',
        body: 'Backend performance and reporting-automation work on an enterprise billing platform. Profiled and tuned batch rating and billing processes on Oracle BRM with C, and replaced manual reporting steps with shell-scripted pipelines feeding Oracle BI Publisher, delivered inside an Agile team. The client, transaction volumes, and performance figures are covered by an NDA.',
        role: 'Software developer — backend optimization & reporting automation',
        outcome: 'Measurable reduction in batch processing time with improved data accuracy (specifics under NDA)',
        stack: 'Oracle BRM · C · Shell · Oracle BI Publisher · Agile / JIRA'
    }
};

const sheet = document.getElementById('sheet');
const sheetEls = {
    tag: document.getElementById('sheet-tag'),
    title: document.getElementById('sheet-title'),
    body: document.getElementById('sheet-body'),
    role: document.getElementById('sheet-role'),
    outcome: document.getElementById('sheet-outcome'),
    stack: document.getElementById('sheet-stack')
};
let lastFocused = null;

document.querySelectorAll('.pcard__more').forEach(btn => {
    btn.addEventListener('click', () => {
        const p = projects[btn.dataset.project];
        if (!p) return;
        lastFocused = btn;
        sheetEls.tag.textContent = p.tag;
        sheetEls.title.textContent = p.title;
        sheetEls.body.textContent = p.body;
        sheetEls.role.textContent = p.role;
        sheetEls.outcome.textContent = p.outcome;
        sheetEls.stack.textContent = p.stack;
        if (typeof sheet.showModal === 'function') sheet.showModal();
        else sheet.setAttribute('open', '');
    });
});

sheet.addEventListener('close', () => { if (lastFocused) lastFocused.focus(); });
sheet.addEventListener('click', e => {
    // click on the backdrop (outside the dialog box) closes it
    const r = sheet.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
        sheet.close();
    }
});
