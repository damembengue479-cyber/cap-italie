const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const faqItems = document.querySelectorAll('.faq-item');
const contactForm = document.getElementById('contactForm');
const profileForm = document.getElementById('profileForm');
const recommendButton = document.getElementById('recommendButton');
const universityList = document.getElementById('universityList');
const universitySearch = document.getElementById('universitySearch');
const universityRegion = document.getElementById('universityRegion');
const universityType = document.getElementById('universityType');
const universityCount = document.getElementById('universityCount');
const universityLogoCount = document.getElementById('universityLogoCount');
const universityEmpty = document.getElementById('universityEmpty');
const preRegistrationYear = document.getElementById('preRegistrationYear');
const calendarYear = document.getElementById('calendarYear');
const calendarTimeline = document.getElementById('calendarTimeline');
const yearElement = document.getElementById('year');
const isGitHubPages = window.location.hostname.endsWith('.github.io');
const contactEmail = 'contact@capitalie.sn';
const universityTypeLabels = {
  public: 'Publique',
  'nonstate-public-promoted': 'Non étatique · organisme public',
  'nonstate-private': 'Non étatique · privée',
  telematic: 'Télématique',
};
let universities = [];

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

if (isGitHubPages) {
  document.querySelectorAll('.static-form-notice').forEach((notice) => {
    notice.classList.add('is-visible');
  });

  document.querySelectorAll('.contact-form, .profile-form').forEach((form) => {
    const notice = document.createElement('p');
    notice.className = 'static-form-notice';
    notice.textContent = `GitHub Pages n'enregistre pas les formulaires. L'envoi ouvrira un brouillon d'e-mail à ${contactEmail} ; vérifiez l'adresse et le message, puis envoyez-le depuis votre messagerie.`;
    form.prepend(notice);
  });
}

const getAcademicYearOptions = () => {
  const now = new Date();
  const firstYear = now.getFullYear() + (now.getMonth() >= 8 ? 1 : 0);

  return Array.from({ length: 5 }, (_, index) => {
    const startYear = firstYear + index;
    return {
      value: `${startYear}-${startYear + 1}`,
      label: `${startYear}-${startYear + 1}`,
    };
  });
};

const populateAcademicYearSelect = (select) => {
  if (!select) {
    return;
  }

  const options = getAcademicYearOptions();
  select.replaceChildren();
  options.forEach(({ value, label }) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    select.append(option);
  });
};

const calendarSteps = [
  {
    timing: 'Dès que possible · idéalement 12 à 18 mois avant la rentrée',
    title: 'Choisir le cursus et préparer les prérequis',
    details: 'Comparer les formations et leurs calendriers officiels ; vérifier le diplôme requis, la langue, les examens d’entrée, les frais et les éventuelles procédures de reconnaissance des titres.',
  },
  {
    timing: 'À l’ouverture de l’appel de chaque cursus',
    title: 'Candidature et tests d’admission',
    details: 'Déposer le dossier selon le bando du programme. Les dates d’ouverture et de clôture diffèrent d’une université, d’un diplôme et parfois d’une session à l’autre.',
  },
  {
    timing: 'Après les instructions de l’université',
    title: 'Préinscription et demande de visa',
    details: 'Suivre la procédure Universitaly indiquée pour votre cas, puis prendre rendez-vous et déposer la demande de visa selon les instructions actuelles de l’Ambassade d’Italie à Dakar.',
  },
  {
    timing: 'Avant le départ',
    title: 'Préparer l’arrivée',
    details: 'Confirmer l’admission, le visa, le logement, la couverture santé et les documents originaux. Garder des copies numériques et papier des pièces importantes.',
  },
  {
    timing: 'Dans les 8 jours ouvrables suivant l’entrée en Italie',
    title: 'Demander le permis de séjour',
    details: 'Respecter le délai officiel pour demander le permesso di soggiorno pour études, conserver la preuve de dépôt et répondre aux convocations de la Questura.',
  },
  {
    timing: 'À la rentrée et selon l’appel régional',
    title: 'Finaliser inscription et aides',
    details: 'Terminer l’immatriculation, les formalités locales et la demande d’aide DSU ; les appels de bourse ont des dates et justificatifs propres à chaque région.',
  },
];

const renderCalendar = () => {
  if (!calendarYear || !calendarTimeline) {
    return;
  }

  const targetYear = calendarYear.value;
  calendarTimeline.replaceChildren();
  calendarSteps.forEach((step) => {
    const item = document.createElement('li');
    const timing = document.createElement('span');
    const title = document.createElement('strong');
    const details = document.createElement('p');
    timing.className = 'calendar-timing';
    timing.textContent = step.timing;
    title.textContent = step.title;
    details.textContent = step.details;
    item.append(timing, title, details);
    calendarTimeline.append(item);
  });

  const heading = document.querySelector('.calendar-heading h3');
  if (heading) {
    heading.textContent = `Préparer la rentrée ${targetYear}`;
  }
};

populateAcademicYearSelect(preRegistrationYear);
populateAcademicYearSelect(calendarYear);
if (preRegistrationYear && calendarYear) {
  calendarYear.value = preRegistrationYear.value;
  preRegistrationYear.addEventListener('change', () => {
    calendarYear.value = preRegistrationYear.value;
    renderCalendar();
  });
}
renderCalendar();
calendarYear?.addEventListener('change', renderCalendar);

const normalizeSearch = (value) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('fr');

const renderUniversities = () => {
  if (!universityList || !universitySearch || !universityRegion || !universityType) {
    return;
  }

  const searchTerm = normalizeSearch(universitySearch.value.trim());
  const region = universityRegion.value;
  const type = universityType.value;
  const matchingUniversities = universities
    .filter((university) => {
      const searchMatch = !searchTerm || normalizeSearch(`${university.name} ${university.region}`).includes(searchTerm);
      return searchMatch && (!region || university.region === region) && (!type || university.type === type);
    })
    .sort((first, second) => first.name.localeCompare(second.name, 'it'));

  universityList.replaceChildren();
  matchingUniversities.forEach((university) => {
    const item = document.createElement('li');
    const logoBox = document.createElement('div');
    const logoFallback = document.createElement('span');
    const name = document.createElement('strong');
    const metadata = document.createElement('span');
    const details = document.createElement('div');
    const source = document.createElement('a');

    logoBox.className = 'university-logo';
    logoBox.setAttribute('aria-hidden', 'true');
    logoFallback.className = 'university-logo-fallback';
    logoFallback.textContent = university.name
      .split(/\s+/)
      .filter((word) => !['università', 'universita', 'degli', 'delle', 'della', 'di', 'del', 'de', 'des', 'the', 'university'].includes(normalizeSearch(word)))
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toLocaleUpperCase('it') || 'IT';
    logoBox.append(logoFallback);

    if (university.logo) {
      const logo = document.createElement('img');
      logo.src = university.logo;
      logo.alt = '';
      logo.loading = 'lazy';
      logo.decoding = 'async';
      logo.addEventListener('error', () => logo.remove(), { once: true });
      logoBox.append(logo);
    }

    details.className = 'university-directory-details';
    name.textContent = university.name;
    metadata.textContent = `${university.region} · ${universityTypeLabels[university.type]}`;
    details.append(name, metadata);

    if (university.logoSource) {
      source.href = university.logoSource;
      source.target = '_blank';
      source.rel = 'noreferrer';
      source.textContent = 'Source du logo';
      source.setAttribute('aria-label', `Source du logo de ${university.name} (nouvel onglet)`);
      details.append(source);
    } else {
      const unavailable = document.createElement('span');
      unavailable.className = 'university-logo-unavailable';
      unavailable.textContent = 'Logo non répertorié';
      details.append(unavailable);
    }

    item.append(logoBox, details);
    universityList.append(item);
  });

  universityCount.textContent = `${matchingUniversities.length} université${matchingUniversities.length === 1 ? '' : 's'} affichée${matchingUniversities.length === 1 ? '' : 's'} sur ${universities.length}.`;
  universityEmpty.hidden = matchingUniversities.length > 0;
};

const loadUniversities = async () => {
  if (!universityList || !universityCount) {
    return;
  }

  try {
    const response = await fetch('data/universities.json');
    if (!response.ok) {
      throw new Error(`Chargement du répertoire impossible (HTTP ${response.status}).`);
    }

    const directory = await response.json();
    if (!Array.isArray(directory.universities) || directory.universities.some((university) =>
      !university ||
      typeof university.name !== 'string' ||
      typeof university.region !== 'string' ||
      !universityTypeLabels[university.type] ||
      (university.logo && (typeof university.logo !== 'string' || !university.logo.startsWith('https://upload.wikimedia.org/'))) ||
      (university.logoSource && (typeof university.logoSource !== 'string' || !university.logoSource.startsWith('https://it.wikipedia.org/')))
    )) {
      throw new Error('Le fichier du répertoire universitaire est invalide.');
    }

    universities = directory.universities;
    universityLogoCount.textContent = `${universities.filter((university) => university.logo).length} logos ou emblèmes sourcés sur ${universities.length} établissements.`;
    const regions = [...new Set(universities.map((university) => university.region))]
      .sort((first, second) => first.localeCompare(second, 'fr'));

    regions.forEach((region) => {
      const option = document.createElement('option');
      option.value = region;
      option.textContent = region;
      universityRegion.append(option);
    });

    universitySearch.addEventListener('input', renderUniversities);
    universityRegion.addEventListener('change', renderUniversities);
    universityType.addEventListener('change', renderUniversities);
    renderUniversities();
  } catch (error) {
    universityCount.textContent = error.message || 'Impossible de charger le répertoire.';
    universityList.replaceChildren();
  }
};

loadUniversities();

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

faqItems.forEach((item) => {
  const button = item.querySelector('.faq-question');

  button.addEventListener('click', () => {
    const isOpen = item.classList.contains('active');

    faqItems.forEach((faq) => {
      faq.classList.remove('active');
    });

    if (!isOpen) {
      item.classList.add('active');
    }
  });
});

const submitForm = async (form, successMessage) => {
  const successText = form.querySelector('.form-success');
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());
  const isLocalServer = ['localhost', '127.0.0.1'].includes(window.location.hostname);

  if (isGitHubPages) {
    const formType = payload['form-name'] === 'student-profile' ? 'Profil étudiant' : 'Demande de contact';
    const fields = [...formData.entries()]
      .filter(([key, value]) => !['form-name', 'bot-field', 'profile-bot-field', 'consent'].includes(key) && value)
      .map(([key, value]) => `${key} : ${value}`);
    const subject = encodeURIComponent(`Cap Italie — ${formType}`);
    const body = encodeURIComponent(fields.join('\n'));

    if (successText) {
      successText.textContent = `Votre messagerie va s'ouvrir avec le message préparé pour ${contactEmail}. Rien n'est enregistré sur le site : vérifiez le brouillon et envoyez-le depuis votre messagerie.`;
    }

    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    return;
  }

  if (successText) {
    successText.textContent = 'Envoi en cours...';
  }

  try {
    const response = isLocalServer
      ? await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
      : await fetch('/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(formData).toString(),
        });

    const result = isLocalServer ? await response.json() : null;

    if (!response.ok) {
      throw new Error(result?.error || 'Erreur lors de l’envoi.');
    }

    if (successText) {
      successText.textContent = successMessage(payload);
    }

    form.reset();
  } catch (error) {
    if (successText) {
      successText.textContent = error.message || 'Une erreur est survenue.';
    }
  }
};

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    submitForm(contactForm, (payload) => `Merci ${payload.name} ! Votre demande a bien été enregistrée.`);
  });
}

const universitySuggestions = {
  engineering: [
    'Politecnico di Milano — ingénierie, architecture et design.',
    'Politecnico di Torino — ingénierie et domaines technologiques.',
    'Università di Bologna — formations scientifiques et technologiques.',
  ],
  business: [
    'Università Bocconi (Milan) — économie, gestion et commerce.',
    'Università di Bologna — économie et sciences de gestion.',
    'Sapienza Università di Roma — économie et disciplines connexes.',
  ],
  science: [
    'Università di Bologna — sciences et domaines de la santé.',
    'Università degli Studi di Milano — sciences et santé.',
    'Sapienza Università di Roma — sciences et domaines médicaux.',
  ],
  humanities: [
    'Università di Bologna — lettres, langues et sciences humaines.',
    'Sapienza Università di Roma — sciences humaines et sociales.',
    'Università degli Studi di Firenze — lettres, arts et sciences humaines.',
  ],
  law: [
    'Università di Bologna — droit et sciences politiques.',
    'Sapienza Università di Roma — droit et sciences politiques.',
    'Università degli Studi di Milano — droit et sciences sociales.',
  ],
  arts: [
    'Politecnico di Milano — architecture, design et arts appliqués.',
    'Università degli Studi di Firenze — arts, architecture et patrimoine.',
    'Università di Bologna — arts et disciplines créatives.',
  ],
  other: [
    'Università di Bologna — large choix de domaines académiques.',
    'Sapienza Università di Roma — offre de formations pluridisciplinaires.',
    'Università degli Studi di Milano — parcours dans plusieurs secteurs.',
  ],
};

const addRecommendation = (list, text) => {
  const item = document.createElement('li');
  item.textContent = text;
  list.append(item);
};

const showRecommendations = () => {
  if (!profileForm) {
    return;
  }

  const academicFields = ['currentLevel', 'targetDegree', 'field', 'averageGrade', 'studyLanguage', 'preRegistrationYear', 'annualBudget', 'scholarshipNeed'];
  const firstInvalidField = academicFields
    .map((name) => profileForm.elements.namedItem(name))
    .find((field) => !field.checkValidity());

  if (firstInvalidField) {
    firstInvalidField.reportValidity();
    return;
  }

  const values = Object.fromEntries(new FormData(profileForm).entries());
  const average = Number(values.averageGrade);
  const recommendations = document.getElementById('recommendations');
  const universityList = document.getElementById('universityRecommendations');
  const scholarshipList = document.getElementById('scholarshipRecommendations');
  const summary = document.getElementById('recommendationSummary');

  universityList.replaceChildren();
  scholarshipList.replaceChildren();

  universitySuggestions[values.field].forEach((suggestion) => addRecommendation(universityList, suggestion));

  if (values.scholarshipNeed !== 'no') {
    addRecommendation(
      scholarshipList,
      'Aides régionales au droit aux études (DSU) : comparez les appels de la région et les justificatifs de ressources demandés aux étudiants internationaux.',
    );

    if (average >= 15) {
      addRecommendation(
        scholarshipList,
        'Bourses au mérite et exonérations universitaires : vérifiez si votre dossier répond aux critères académiques des appels en cours.',
      );
    } else {
      addRecommendation(
        scholarshipList,
        'Aides sur critères sociaux et réductions de frais : vérifiez les conditions de ressources, les justificatifs et les dates auprès de chaque région.',
      );
    }

    if (values.annualBudget === 'under-5000' || values.annualBudget === 'unknown') {
      addRecommendation(
        scholarshipList,
        'Avec le budget indiqué, donnez la priorité aux aides régionales et aux exonérations ; préparez tôt les justificatifs de ressources demandés.',
      );
    }
  } else {
    addRecommendation(
      scholarshipList,
      'Vous n’avez pas indiqué de besoin de bourse. Comparez tout de même les frais de scolarité et les exonérations proposées par chaque établissement.',
    );
  }

  const degreeLabels = {
    bachelor: 'une licence / un bachelor',
    master: 'un master',
    doctorate: 'un doctorat',
    exchange: 'un échange ou une mobilité',
  };
  const levelLabels = {
    terminale: 'terminale',
    bac: 'baccalauréat obtenu',
    licence1: 'première année de licence',
    licence2: 'deuxième année de licence',
    licence3: 'troisième année de licence',
    master: 'master',
    other: 'un autre niveau',
  };
  const languageLabels = {
    english: 'en anglais',
    italian: 'en italien',
    either: 'en anglais ou en italien',
    learning: 'avec une préparation linguistique',
  };

  summary.textContent = `Vous êtes actuellement en ${levelLabels[values.currentLevel]}. Avec une moyenne de ${average.toLocaleString('fr-FR')}/20, vous recherchez ${degreeLabels[values.targetDegree]} ${languageLabels[values.studyLanguage]} pour la rentrée ${values.preRegistrationYear}. Vérifiez les diplômes préalables et conditions d’admission propres à chaque programme.`;
  recommendations.hidden = false;
  recommendations.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

if (recommendButton) {
  recommendButton.addEventListener('click', showRecommendations);
}

if (profileForm) {
  profileForm.addEventListener('submit', (event) => {
    event.preventDefault();
    submitForm(profileForm, (payload) => `Merci ${payload.name} ! Votre profil a bien été enregistré.`);
  });
}

const animateCounters = () => {
  const counters = document.querySelectorAll('[data-target]');

  counters.forEach((counter) => {
    const target = Number(counter.dataset.target || 0);
    const duration = 1200;
    const suffix = target >= 90 && target <= 100 ? '%' : '+';
    const startTime = performance.now();

    const step = () => {
      const progress = Math.min((Date.now() - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      counter.textContent = `${value}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  });
};

window.addEventListener('load', animateCounters);
