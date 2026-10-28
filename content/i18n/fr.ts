/* Français. Same shape as the English bundle (enforced by the Bundle type).
   Natural French, not a literal translation; facts, numbers and names match
   the English (scripts/i18n-check.test.mjs). Unlike Portuguese, the project
   dialogs are translated too.

   Written with plain spaces: typo() below applies French typography — a
   no-break space before ":" and inside « », a narrow no-break space before
   ; ? ! % and as the thousands separator. Decimal commas are typed as such.

   No /fr services page: the offers are for Brazilian businesses, so the nav
   and footer hide them (routes.ts gives "services" no French slug) and
   `services` is the English copy, never rendered. */

import type { Bundle } from "./index";
import { site } from "../site";
import { servicesPage } from "../services";

const NBSP = " ";
const NNBSP = " ";

function typo(s: string): string {
  return s
    .replace(/ :/g, `${NBSP}:`)
    .replace(/ ([;?!%])/g, `${NNBSP}$1`)
    .replace(/« /g, `«${NBSP}`)
    .replace(/ »/g, `${NBSP}»`)
    .replace(/(\d) (\d{3})(?!\d)/g, `$1${NNBSP}$2`);
}

function typoDeep<T>(value: T): T {
  if (typeof value === "string") return typo(value) as T;
  if (Array.isArray(value)) return value.map(typoDeep) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, typoDeep(v)])) as T;
  }
  return value;
}

const copy: Omit<Bundle, "services"> = {
  locale: "fr",

  ui: {
    meta: { htmlLang: "fr", ogLocale: "fr_FR", languageName: "Français" },

    skipLink: "Aller au contenu",
    navLabel: "Index des sections",
    nav: { journey: "Parcours", arsenal: "Arsenal", work: "Projets", languages: "Langues", contact: "Contact" },
    navServices: "",
    rail: { origin: "Origine", journey: "Parcours", arsenal: "Arsenal", work: "Projets", pipeline: "Détail", languages: "Langues", contact: "Contact" },
    menu: { open: "Ouvrir le menu", close: "Fermer le menu" },
    theme: { toLight: "Passer au whiteprint (clair)", toDark: "Passer au blueprint (sombre)", lightTitle: "Whiteprint", darkTitle: "Blueprint" },
    langSwitch: { label: "Langue" },

    origin: {
      eyebrow: "DESSIN",
      statusKey: "STATUT",
      cta: "Prendre contact",
      cv: "Télécharger le CV",
      cvNote: "(PDF)",
      cvOthers: ["en"],
      titleBlockLabel: "Cartouche du dessin",
      languagesLabel: "Langues parlées",
      dimLabel: "FEUILLE 1 / 1 — ÉCHELLE 1:1",
      bearingLabel: "CAP {deg} → PARIS",
    },
    journey: {
      title: "Parcours",
      intro: "Un fil conducteur : comprendre comment les systèmes se comportent, puis les mettre au service de besoins réels — des moteurs physiques à l’infrastructure de recherche.",
    },
    arsenal: {
      title: "Arsenal technique",
      intro: "À lire comme une légende, pas comme un nuage de mots-clés — classé selon la couche du système que chaque élément touche.",
      credentials: "Certifications et formations",
      certifications: "Certifications",
      training: "Formations",
    },
    work: {
      title: "Projets choisis",
      intro: "Six projets, six problèmes. Chaque dessin reprend la forme de ce qu’est réellement le projet.",
      hint: "faire défiler →",
    },
    carousel: {
      label: "Carrousel de projets, à faire défiler",
      prev: "Projet précédent",
      next: "Projet suivant",
      more: "Voir le dessin complet",
      cardLanguage: "Langue de la carte",
      close: "Fermer",
      detailNote: "",
      role: "Rôle",
      outcome: "Résultat",
      videoMark: "Vidéo",
      playVideo: "Lire la vidéo",
      videoFrame: "vidéo (YouTube)",
    },
    pipeline: { manualStep: "étape manuelle" },
    languages: {
      title: "Langues",
      intro: "Multilingue et tourné vers l’Europe — mesuré sur l’échelle du CECRL, présenté comme un indicateur de niveau de signal.",
      names: { PT: "Portugais", EN: "Anglais", FR: "Français", ES: "Espagnol" },
      native: "langue maternelle",
    },
    contact: { title: "Contact" },
    footer: {
      builtWith: "fait main avec Next.js, TypeScript et du CSS pur, sur l’identité schématique de la version HTML d’origine.",
      security: "Comment ce site est sécurisé",
    },
    securityUi: {
      controls: "Mesures",
      limitations: "Limites connues",
      report: "Signaler une vulnérabilité",
      threatModel: "Modèle de menaces complet : SECURITY.md sur GitHub (en anglais)",
    },
    subpage: { back: "← Retour au dessin", footerBack: "retour à simonlaborde.com" },
    notFound: { title: "Hors du dessin", body: "Cette page n’existe pas.", home: "Retour au dessin" },

    chat: {
      tag: "CONSOLE DE REQUÊTE EN DIRECT",
      title: "Posez une question sur mon travail",
      intro: "Fondé sur le contenu de ce site — une petite démonstration du travail IA/LLM décrit ici.",
      dialogLabel: "Poser une question à un assistant sur le travail de Simon",
      close: "Fermer",
      you: "Vous",
      thinking: "Réflexion",
      placeholder: "ex. : Quel est son projet le plus abouti ?",
      inputLabel: "Votre question",
      send: "Envoyer",
      fallback: "Impossible de joindre l’assistant pour le moment — vérifiez votre connexion et réessayez, ou écrivez directement à {email}.",
    },
    chatServer: {
      ip: "Beaucoup de questions en peu de temps — réessayez dans quelques minutes, ou écrivez directement à {email}.",
      global: "L’assistant a atteint la limite du jour — elle se réinitialise à minuit (UTC). En attendant, écrivez à {email}.",
      unavailable: "L’assistant est momentanément indisponible — réessayez dans un instant, ou écrivez à {email}.",
      notConfigured: "Cet assistant n’est pas encore configuré. En attendant, écrivez à {email}.",
      rateLimited: "L’assistant est très sollicité en ce moment — réessayez dans un instant, ou écrivez à {email}.",
      streamError: "Un problème est survenu pendant la réponse. Réessayez, ou écrivez à {email}.",
      unverified: "Je n’ai pas pu vous donner une réponse fiable sur ce point. Posez directement la question à Simon : {email}.",
    },
  },

  site: {
    role: "Ingénierie systèmes et full-stack",
    title: "Simon Laborde — Ingénieur backend et IA/LLM",
    description:
      "Simon Laborde — ingénieur backend et full-stack orienté IA/LLM, avec une base en systèmes backend d’entreprise. Portfolio, expérience et contact.",
    roleLine:
      "Ingénieur backend et full-stack orienté <strong>IA&nbsp;/&nbsp;LLM</strong>, avec une base en systèmes backend d’entreprise chez Accenture.",
    thesis:
      "Je fais le lien entre des systèmes complexes et les personnes qui en dépendent — avec un accent sur les outils basés sur des LLM.",
    status: {
      label: "Ouvert aux postes en IA et en ingénierie logicielle",
      detail: "À distance ou sur site dans l’UE — CDI, CDD ou freelance",
    },
    workRights:
      "Nationalité française : droit de travailler dans l’UE, sans besoin de visa. Également de nationalité brésilienne. Basé au Brésil ; ouvert au télétravail et prêt à m’installer en Europe.",
    contactIntro:
      "Ouvert aux postes en IA et en ingénierie logicielle — à distance ou sur site dans l’UE — ainsi qu’aux missions en freelance ou en CDD.",
    chatLauncher: { full: "QUESTIONS SUR MON TRAVAIL", short: "QUESTIONS" },
    chatSuggestions: [
      "Quelle est son expérience avec les LLM et les agents ?",
      "Parlez-moi du pipeline Lattes.",
      "Qu’a-t-il construit avec des LLM ?",
      "Peut-il travailler dans l’UE ?",
    ],
    chatNotice: {
      securityLink: "Comment cet assistant est sécurisé",
      accuracy:
        "Les réponses sont générées par une IA à partir du contenu de ce site — vérifiez tout point important directement auprès de Simon.",
      privacy:
        "Confidentialité : vos questions sont envoyées à l’API Claude d’Anthropic pour générer les réponses. Ce site n’enregistre pas les conversations ; votre adresse IP est conservée jusqu’à 10 minutes pour limiter l’usage.",
    },
    titleBlock: [
      { dt: "Dessiné par", dd: "S. Laborde", mono: false, sign: true },
      { dt: "Origine", dd: "07°13′S 35°53′W", mono: true },
      { dt: "Cap", dd: "Brésil → Europe", mono: false },
      { dt: "Révision", dd: "2026.5", mono: true, stamp: true },
      { dt: "Feuille", dd: "1 / 1", mono: true },
      { dt: "Échelle", dd: "1:1", mono: true },
    ],
  },

  journey: [
    {
      when: "2024 — aujourd’hui",
      title: "Développement logiciel freelance",
      org: "Indépendant — à distance",
      body: "J’ai réalisé le site bilingue du LABNOV, laboratoire de recherche en matériaux de l’UFCG — un modèle de contenu Sanity CMS pour son équipe non technique et un pipeline automatique de publications depuis la Plataforma Lattes (Brésil) —, ainsi que le site du peintre pop art Rogério Freire. D’autres missions clients sont couvertes par un NDA.",
    },
    {
      when: "2020 — 2025",
      title: "Bachelor en systèmes d’information (UNIFACISA, Brésil)",
      org: "UNIFACISA — Campina Grande",
      body: "Mémoire de fin d’études — <em>« MedHelp: Sistema de Apoio à Decisão Clínica para Recomendações de Exames Preventivos com Processamento de Linguagem Natural »</em> [traduction : « MedHelp : système d’aide à la décision clinique pour la recommandation d’examens de prévention par traitement automatique du langage naturel »] — traitement automatique du langage naturel (NLP) pour l’aide à la décision clinique, noté 10/10, la note maximale, et point de départ du projet MedHelp.",
    },
    {
      when: "2022 — 2023",
      title: "Custom Software Engineer",
      org: "Accenture",
      body: "Optimisation de processus de facturation et backend sur Oracle BRM, en C et en shell ; automatisation du reporting financier avec Oracle BI Publisher, au sein d’une équipe Agile.",
    },
    {
      when: "2018 — 2020",
      title: "Formation en développement de jeux vidéo",
      org: "UNIFACISA",
      body: "Conception de systèmes interactifs, logique de gameplay en C# et travail sur des moteurs physiques — c’est là qu’est né le réflexe de comprendre comment les systèmes bougent et cassent.",
    },
  ],

  arsenal: [
    { icon: "code", title: "Langages et environnements", items: "Python · Java · C · C# · TypeScript · JavaScript · PL/SQL" },
    {
      icon: "ai",
      title: "IA / LLM",
      items:
        "Intégration de LLM et systèmes de prompts · Model Context Protocol (MCP) · conception d’agents et de sous-agents · API Claude / Anthropic · NLP · scikit-learn · LightGBM · MLflow · pandas · NumPy",
    },
    { icon: "data", title: "Backend et données", items: "API RESTful · PostgreSQL · MySQL · Oracle BRM · Oracle BI Publisher" },
    { icon: "frontend", title: "Frontend et mobile", items: "Next.js · React · React Native · Expo · Tailwind · HTML/CSS sémantique" },
    { icon: "infra", title: "Infrastructure et outils", items: "Docker · AWS EC2 · Vercel · Git · JIRA · Sanity CMS · Figma" },
    { icon: "test", title: "Tests", items: "pytest" },
  ],

  // course names stay English (site.training); only the dates are French
  training: [
    "Anthropic Academy — AI Fluency: Framework & Foundations (mars 2026)",
    "Anthropic Academy — Claude Code in Action (mars 2026)",
    "Anthropic Academy — Building with the Claude API (juillet 2026)",
    "Anthropic Academy — Introduction to Model Context Protocol (août 2026)",
    "Anthropic Academy — Model Context Protocol: Advanced Topics (août 2026)",
    "Accenture Academy — Oracle BRM",
  ],

  pipeline: {
    title: "Le pipeline de synchronisation Lattes",
    eyebrow: "Détail 04.1 — LABNOV",
    lead: "Gros plan sur une partie du projet LABNOV : tenir à jour, automatiquement, la liste des publications d’un laboratoire de recherche, malgré un obstacle qui empêche une automatisation complète.",
    nodes: [
      { idx: "01", title: "Plataforma Lattes", body: "Le registre brésilien des CV académiques. Pas d’API publique ; l’export est protégé par un CAPTCHA.", kind: "source" },
      { idx: "02", title: "Point de contrôle reCAPTCHA", body: "Impossible à automatiser. Le pipeline attend un clic humain, puis tourne seul.", kind: "gate" },
      { idx: "03", title: "Parseur", body: "Extrait les publications de l’export ; normalise auteurs, revues et années.", kind: "process" },
      { idx: "04", title: "Diff", body: "Compare avec le CMS — les nouveaux articles entrent, rien n’est dupliqué ni perdu.", kind: "process" },
      { idx: "05", title: "Sanity CMS", body: "Seules les modifications sont écrites, dans le schéma que l’équipe édite déjà à la main.", kind: "store" },
      { idx: "06", title: "Site du LABNOV", body: "Les nouvelles publications apparaissent en un cycle de synchronisation. Personne n’entretient la liste.", kind: "output" },
    ],
    meta: [
      { dt: "Problème", dd: "Une liste publique de publications qui se périme dès que quelqu’un oublie de la mettre à jour." },
      { dt: "Approche", dd: "Tout automatiser sauf la seule étape qui ne peut pas l’être — et faire de cette étape un clic, pas une corvée." },
      { dt: "Résultat", dd: "Une liste quasiment sans maintenance, toujours fidèle à la source officielle." },
    ],
  },

  projects: {
    scout: {
      tag: "01 · Prévision ML + agent Claude",
      dialogTitle: "Scout — prévision de la valeur marchande des joueurs",
      status: "Démo en ligne, jusqu’au 1er janvier 2027",
      links: [
        {
          label: "Essayer la démo en ligne",
          href: "https://scout-246528398633.europe-west1.run.app",
          note: "La première question après une période d’inactivité prend environ 20 s, le temps que la démo se réveille. En ligne jusqu’au 1er janvier 2027.",
        },
        { label: "Code source sur GitHub", href: "https://github.com/simonrl13/footballscout" },
      ],
      lead: "Prévoit l’évolution sur 12 mois de la valeur marchande Transfermarkt de 8 190 joueurs de 7 championnats européens (2013–2024), avec un agent Claude et un serveur MCP par-dessus — point-in-time, testé contre les fuites de données, avec un jeu de test scellé et journalisé.",
      layers: ["Agent Claude · serveur MCP", "Intervalles à 80 %", "LightGBM · suivi MLflow", "Variables point-in-time", "Postgres · tests de fuite"],
      skin: {
        readings: [
          { dt: "Joueurs", value: "8 190" },
          { dt: "Couverture des intervalles", value: "82,2", unit: "%" },
          { dt: "Agent, évals réservées", value: "19/20" },
        ],
      },
      detail: {
        body: "Scout prévoit l’évolution sur 12 mois de la valeur marchande Transfermarkt des footballeurs, avec un agent Claude qui répond aux questions sur les prévisions. Chaque chiffre d’une réponse de l’agent doit correspondre aux données renvoyées par ses outils ; une réponse qui ne correspond pas est relancée, puis bloquée. Les affirmations tirées de Wikipédia citent la révision exacte de la page. Entraîné sur 8 190 joueurs de sept championnats européens (2013–2024). LightGBM bat la référence « sans changement » d’environ 13 % en MAE (0,357 contre 0,410) et fait jeu égal avec un modèle linéaire ; couverture de 82,2 % pour les intervalles à 80 % ; 19/20 sur une évaluation réservée (held-out) de l’agent. Deux expériences préenregistrées sont présentées comme des résultats négatifs. L’agent tourne sur Claude Haiku 5.5, environ 8 fois moins cher par question que Haiku 4.5, pour le même résultat sur le jeu de développement. Le jalon M3 (variables issues de textes publics) est encore ouvert.",
        role: "Projet indépendant — démo en ligne",
        outcome:
          "Sur les saisons de test 2023–24 : MAE de 0,357 contre 0,410 pour une référence « sans changement » (aucun gain sur une référence linéaire) et couverture de 82,2 % pour les intervalles de prévision à 80 % ; agent à 19/20 sur les évaluations réservées, avec 2/2 tentatives d’injection repoussées ; CI avec tests, audits de dépendances, détection de secrets et CodeQL, et un modèle de menaces documenté",
        stack: "Python · LightGBM · FastAPI · Postgres · API Claude · RAG · Cloud Run",
      },
    },
    medhelp: {
      tag: "02 · Aide à la décision clinique par IA",
      lead: "Un outil de NLP conçu pour le système de santé public brésilien (SUS), développé et évalué sur des données synthétiques, et non sur de vrais dossiers de patients : il normalise des notes cliniques et signale des examens de prévention à partir du profil et des antécédents du patient.",
      layers: ["Recommandation d’examens", "Normalisation par NLP", "Notes cliniques synthétiques"],
      skin: {
        vitals: [
          { dt: "Normalisation de la terminologie (23/25 termes, données synthétiques)", value: "92", unit: "%" },
          { dt: "Périmètre du modèle", value: "NLP" },
        ],
      },
      detail: {
        body: "Un outil Python de NLP conçu pour le système de santé public brésilien (SUS), développé et évalué sur des données synthétiques, et non sur de vrais dossiers de patients. Il lit des notes cliniques en texte libre, normalise une terminologie incohérente et recommande des examens de prévention à partir des données démographiques et des antécédents médicaux du patient. Il est né directement de mon mémoire de fin d’études sur le traitement automatique du langage naturel (NLP) pour l’aide à la décision clinique.",
        role: "Projet de mémoire de fin d’études (bachelor)",
        outcome:
          "92 % (23 termes sur 25) en normalisation de la terminologie clinique, évalué sur des données synthétiques dans le mémoire (chapitre 4.3)",
        stack: "Python · FastAPI · Pydantic · Uvicorn · moteur de règles fondé sur les recommandations (MS/INCA, sociétés médicales) · données patients synthétiques",
      },
    },
    rogerio: {
      tag: "03 · Site d’artiste et boutique",
      dialogTitle: "Rogério Freire — site d’artiste",
      lead: "Site du peintre pop art Rogério Freire : une galerie de ses peintures originales, un catalogue de produits tirés de son œuvre et l’achat par WhatsApp ou par e-mail.",
      layers: ["Galerie des originaux", "Catalogue de produits", "Achat WhatsApp / e-mail", "Next.js+Tailwind / Vercel"],
      skin: {
        placeholder: "EMPLACEMENT — œuvre à venir",
        caption: "PLANCHE 01 — peinture originale · détails à venir",
      },
      detail: {
        body: "Un site pour Rogério Freire, peintre pop art. Il présente ses peintures originales dans une galerie, à côté d’un catalogue de produits tirés de son œuvre — mugs, coussins, carnets et t-shirts —, les demandes et les achats se faisant directement par WhatsApp et par e-mail.",
        role: "Projet client pour un artiste indépendant",
        outcome:
          "Un seul endroit pour montrer les originaux et vendre les produits dérivés, l’achat restant une conversation directe par WhatsApp ou par e-mail",
        stack: "Next.js · Tailwind CSS · Vercel · achat par WhatsApp / e-mail",
      },
    },
    nutriquest: {
      tag: "04 · Suivi nutritionnel ludique",
      status: "En développement (refonte en cours)",
      lead: "Une application mobile qui transforme le suivi des repas en jeu — séries, niveaux d’XP et défis hebdomadaires, en portugais du Brésil.",
      layers: ["UI mobile · séries, XP, défis", "Recherche d’aliments · TACO", "Stockage sur l’appareil"],
      skin: {
        xpMeta: "Niveau 7 · Nutritionniste en herbe",
        xpAmount: "1 840 / 2 400 XP",
        board: [
          { pos: "1", name: "ana.map", pts: "3 120" },
          { pos: "2", name: "vous", pts: "1 840", you: true },
          { pos: "3", name: "tiago.rn", pts: "1 610" },
        ],
        caption: "Aperçu de l’interface · données d’exemple",
      },
      detail: {
        body: "Une application mobile qui transforme le suivi des repas en jeu, en portugais du Brésil, actuellement en refonte. Dans le code actuel, on enregistre un repas en cherchant dans une table de composition des aliments (la table brésilienne TACO, plus deux entrées de lait issues de l’USDA FoodData Central), avec calories et macronutriments par portion ; un objectif quotidien, des séries, des niveaux d’XP, des défis hebdomadaires et des succès sont calculés à partir de ce qui est enregistré. Les données sont stockées sur l’appareil ; il n’y a pas encore de backend ni de compte.",
        role: "Projet personnel — architecture et UI",
        outcome: "En développement (refonte en cours)",
        stack: "React Native · Expo · Expo Router · TypeScript · Reanimated · stockage sur l’appareil (AsyncStorage)",
      },
    },
    labnov: {
      tag: "05 · Plateforme de recherche bilingue",
      dialogTitle: "Laboratoire de recherche LABNOV",
      lead: "Site bilingue pour le laboratoire de recherche LABNOV de l’UFCG, avec synchronisation automatique des publications depuis la Plataforma Lattes (Brésil) et édition du contenu via Sanity CMS pour une équipe non technique.",
      layers: ["Site Next.js bilingue", "Modèle de contenu Sanity", "Synchro Lattes automatique"],
      detail: {
        body: "Un site entièrement bilingue (PT / EN) pour le laboratoire de recherche LABNOV de l’UFCG. Les publications se synchronisent automatiquement depuis la Plataforma Lattes grâce à une intégration sur mesure — avec une solution semi-manuelle face à la protection reCAPTCHA —, tandis que l’équipe non technique modifie tout le reste via Sanity CMS. Des sections pour les projets, les membres et les publications, optimisées pour le référencement académique.",
        role: "Développeur full-stack — intégration, modélisation CMS, i18n",
        outcome:
          "Une liste de publications quasiment sans maintenance ; l’équipe met le contenu à jour sans passer par un développeur",
        stack: "Next.js · Sanity CMS · intégration Lattes · routage bilingue",
      },
    },
    financial: {
      tag: "06 · Backend d’entreprise, Accenture",
      title: "Optimisation de la facturation d’entreprise",
      dialogTitle: "Optimisation de la facturation d’entreprise — Accenture",
      lead: "Performance backend et automatisation du reporting sur une plateforme de facturation d’entreprise — analyse et optimisation de traitements batch, et remplacement d’étapes de reporting manuelles par des pipelines scriptés.",
      layers: ["Reporting BI Publisher", "Facturation batch (C)", "Plateforme Oracle BRM"],
      detail: {
        body: "Performance backend et automatisation du reporting sur une plateforme de facturation d’entreprise. Analyse et optimisation des traitements batch de rating et de facturation sur Oracle BRM en C, et remplacement d’étapes de reporting manuelles par des pipelines en shell alimentant Oracle BI Publisher, au sein d’une équipe Agile. Le client, les volumes de transactions et les chiffres de performance sont couverts par un accord de confidentialité (NDA).",
        role: "Custom Software Engineer — optimisation backend et automatisation du reporting",
        outcome: "Travail sur l’optimisation des traitements batch",
        stack: "Oracle BRM · C · Shell · Oracle BI Publisher · Agile / JIRA",
      },
    },
  },

  security: {
    title: "Comment ce site est sécurisé",
    eyebrow: "Détail — sécurité",
    description:
      "Comment simonlaborde.com et son assistant IA sont protégés : limites de dépenses, contrôle des entrées, tests d’injection de prompt, en-têtes de sécurité, contrôles de CI et limites connues.",
    intro:
      "Ce portfolio fait tourner un assistant IA en direct, dont chaque réponse coûte de l’argent réel : il est donc construit comme un petit service de production. Voici ce qui le protège, en termes simples — et ce qui ne le protège pas encore.",
    items: [
      {
        title: "Limites de dépenses de l’assistant IA",
        body: "Chaque visiteur peut poser jusqu’à 8 questions toutes les 10 minutes, et l’ensemble du site est plafonné à 200 réponses par jour. Les deux compteurs sont stockés dans Upstash Redis, ils valent donc pour toutes les instances du serveur. Si le limiteur ne répond pas, l’assistant refuse de répondre au lieu de laisser passer les requêtes. Derrière, un plafond de dépenses mensuel s’applique à un espace de travail Anthropic dédié.",
      },
      {
        title: "Entrées plafonnées et vérifiées d’abord",
        body: "Les requêtes de plus de 16 Ko sont rejetées, chaque message est coupé à 800 caractères, seuls les 8 derniers échanges sont conservés et chaque appel au modèle est plafonné à 1 500 jetons. Les requêtes mal formées sont refusées avant d’atteindre une limite ou le modèle.",
      },
      {
        title: "Seul ce site peut appeler l’assistant",
        body: "Le point d’accès de l’assistant n’accepte que les requêtes de navigateur venant de simonlaborde.com. Tout autre site reçoit une erreur 403 et aucune autorisation de lire la réponse.",
      },
      {
        title: "Tests d’injection de prompt",
        body: "Les tests tentent de contourner les instructions, d’extraire le prompt système, de changer la persona de l’assistant, de glisser des instructions dans un texte collé, de lui faire révéler des informations privées et de le pousser à donner un prix ou un délai ; une deuxième série vérifie que chaque réponse sur mon expérience correspond à mon profil, jugée par un autre modèle d’IA, et une troisième tente de convaincre le vérificateur de réponses d’approuver de fausses affirmations. La dernière exécution complète sur le site en ligne a réussi tous les tests, le {date}. L’assistant n’a pas d’outils, n’exécute aucune action et ne voit que le contenu public de ce site ; ses réponses s’affichent en texte brut, jamais en HTML.",
      },
      {
        title: "Chaque réponse est vérifiée avant de vous parvenir",
        body: "Avant l’envoi d’une réponse, un second appel d’IA vérifie chacune de ses affirmations par rapport à mon profil. Si quelque chose n’est pas étayé, la réponse est réécrite une fois ; si elle ne passe toujours pas — ou si la vérification elle-même échoue —, vous recevez une courte note avec mon e-mail au lieu d’une réponse non vérifiée.",
      },
      {
        title: "Vos questions et votre vie privée",
        body: "Les questions sont envoyées à l’API Claude d’Anthropic pour générer la réponse et la vérifier. Ce site n’enregistre pas les conversations, et votre adresse IP est conservée jusqu’à 10 minutes pour limiter l’usage. Pas de cookies, pas d’outils d’analyse.",
      },
      {
        title: "Le formulaire de contact",
        body: "Une fois activé, le formulaire de contact de la page destinée aux entreprises (en anglais et en portugais) transmettra les demandes à ma boîte mail via Resend, un service d’envoi d’e-mails basé aux États-Unis ; d’ici là, l’envoi affiche mon adresse e-mail. Ce site n’enregistre et ne journalise rien de ce qui est envoyé. Chaque champ est vérifié sur le serveur, le formulaire n’accepte que les requêtes venant de ce site, un champ piège caché arrête les robots simples, et des limites de 3 messages par heure par connexion et de 20 par jour empêchent les envois en masse — si le limiteur ne répond pas, le formulaire refuse d’envoyer.",
      },
      {
        title: "En-têtes de sécurité",
        body: "Une Content Security Policy qui n’autorise que les scripts, styles, polices et connexions du site lui-même ; HTTPS imposé avec HSTS ; pas de MIME sniffing ; une politique de referrer stricte ; caméra, micro, géolocalisation et paiements désactivés ; et aucun autre site ne peut intégrer ces pages dans un cadre.",
        link: {
          label: "Voir le rapport en direct sur securityheaders.com",
          href: "https://securityheaders.com/?q=www.simonlaborde.com&followRedirects=on",
        },
      },
      {
        title: "Aucune requête vers un tiers avant que vous lanciez une vidéo",
        body: "Visiter le site ne contacte aucun tiers : les polices et les affiches des vidéos sont servies par le site lui-même, et la Content Security Policy le garantit. Les deux vidéos de projets se chargent depuis YouTube, en mode de confidentialité renforcée (youtube-nocookie.com), seulement quand vous appuyez sur lecture.",
      },
      {
        title: "Chaque modification passe les mêmes contrôles",
        body: "Chaque modification est une pull request qui doit passer un lint, un build de production, un smoke test dans le navigateur, un audit des dépendances, une recherche de secrets sur tout l’historique git (gitleaks) et une analyse statique CodeQL. La branche principale est protégée sans exception pour les administrateurs — même le propriétaire ne peut pas y pousser directement. Dependabot propose les mises à jour, et les actions de CI sont fixées sur des hashes de commit exacts. L’audit qui a mis tout cela en place a aussi détecté une vulnérabilité critique de Next.js dans la version déployée (GHSA-vcvr-r3jv-pc5j), corrigée le jour même.",
      },
      {
        title: "Données personnelles",
        body: "Le CV public est généré sans numéro de téléphone — le générateur refuse de le produire sinon — et l’historique git a été réécrit pour retirer le numéro de tous les anciens commits.",
      },
    ],
    limitations: [
      "La Content Security Policy autorise encore les scripts inline (‘unsafe-inline’). Les pages Next.js rendues statiquement en ont besoin ; les retirer obligerait à rendre chaque page à la demande.",
      "Les limites sont par adresse IP : quelqu’un disposant de nombreuses adresses pourrait répartir ses requêtes. Le plafond quotidien et la limite de dépenses bornent le coût.",
      "Les réponses de l’IA peuvent encore exagérer. L’assistant s’appuie uniquement sur le contenu de ce site et a pour consigne de ne pas enjoliver — vérifiez tout point important directement auprès de moi.",
      "Le CDN de Vercel marque les fichiers statiques publics comme lisibles par n’importe quel site (Access-Control-Allow-Origin: *). C’est sans conséquence pour du contenu public ; le point d’accès de l’assistant utilise sa propre liste d’origines autorisées.",
      "Le formulaire de contact n’a pas de CAPTCHA, qui demanderait un script tiers. Son champ piège n’arrête que les robots simples ; les limites horaires et quotidiennes bornent le reste.",
    ],
    reportLine: `Vous avez trouvé un problème ? Écrivez à ${site.links.email} — l’adresse figure aussi dans /.well-known/security.txt. Merci de ne pas ouvrir d’issue publique pour un problème de sécurité.`,
    securityMd: "https://github.com/simonrl13/simonrl13.github.io/blob/main/SECURITY.md",
  },
};

export const fr: Bundle = { ...typoDeep(copy), services: servicesPage };
