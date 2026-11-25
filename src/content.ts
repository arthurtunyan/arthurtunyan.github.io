// Everything the page says lives here. Edit copy without touching layout.

export const EMAIL = 'arthurtunyan4@gmail.com';
export const GITHUB = 'https://github.com/arthurtunyan';
export const LINKEDIN = 'https://www.linkedin.com/in/arthur-tunyan';

export const headline = [
  'ML research @ Cal State LA',
  'SWE intern @ Luciplex',
  'USACO Gold',
  '2× hackathon winner',
  "Burbank HS '27",
];

export const intro =
  "I'm a senior at Burbank High. I do machine learning research at Cal State LA and ship production code at Luciplex. Most of what I build starts with public data and ends with something a real person in Los Angeles can use.";

export type Role = {
  when: string;
  title: string;
  org: string;
  where: string;
  text: string;
};

export const roles: Role[] = [
  {
    when: '2026.05 — now',
    title: 'Research Assistant',
    org: 'AI & Data Science Lab, Cal State LA',
    where: 'Los Angeles',
    text: 'ZIP-level machine learning on asthma outcomes across LA, mentored by Prof. Pourhomayoun, the lab’s founding director. The lab is NASA-funded, including a $1.4M grant to build an AI Earth-system digital twin for wildfire prediction.',
  },
  {
    when: '2025.08 — now',
    title: 'Software Engineering Intern',
    org: 'Luciplex',
    where: 'Remote',
    text: 'Building the laboratory information system clinical staff use every day. React and TypeScript on the front end, backend services and APIs behind it, all shipped through merge-request review. Standardized validation across modules and traced bugs to the root.',
  },
  {
    when: '2024.08 — now',
    title: 'Founder & President',
    org: 'BHS Future Leaders',
    where: 'Burbank',
    text: 'Connecting students with internships, career resources and guest speakers.',
  },
];

export const research = {
  question: 'Does air pollution still matter once you account for where people live?',
  steps: [
    {
      tag: 'model',
      text: 'Random Forest and SVM models predicting ZIP-level asthma outcomes from air-quality, geographic and socioeconomic features.',
    },
    {
      tag: 'finding',
      text: 'Geography and income outweigh the pollution signal. Place-based health studies can mistake the neighborhood for the exposure.',
    },
    {
      tag: 'next',
      text: 'Moving to daily emergency-department data (NYC EpiQuery, DATASUS) to test whether day-to-day variation brings the masked pollution effect back.',
    },
  ],
};

export const building = {
  name: 'Smoke Signal',
  status: 'In development',
  line: 'Forecasting next-day asthma ER visits from wildfire smoke, then checking whether the model still holds up during a fire it has never seen.',
  inputs: [
    'NASA MODIS / VIIRS aerosol depth',
    'PurpleAir PM2.5 sensors',
    'NOAA HRRR-Smoke forecasts',
    'Daily LA asthma ED visits, 2015–2025',
  ],
  model: ['Contrastive encoder', 'Smoke embedding', 'Forecaster + conformal band'],
  output: 'Next-day ED visits, ±90% interval, per ZIP',
  plan: [
    { k: 'Join', text: 'Line up satellite, sensor and hospital data by ZIP code and day.' },
    { k: 'Pretrain', text: 'Learn smoke embeddings from ten years of unlabeled days with a contrastive objective.' },
    { k: 'Forecast', text: 'Predict next-day respiratory ED visits with calibrated intervals.' },
    { k: 'Stress test', text: 'Train on data before 2025, then test on the January 2025 Palisades and Eaton fires.' },
  ],
};

export type Project = {
  name: string;
  year: string;
  kind: string;
  line: string;
  stack: string[];
  points: string[];
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    name: 'Open Door',
    year: '2026',
    kind: 'Congressional App Challenge · CA-30',
    line: 'Shows LA County families which public benefits each person in the household may qualify for, under the rules in effect today.',
    stack: ['TypeScript', 'React', 'Vite'],
    points: [
      'Dated rules engine: run the same family under December 2025 rules, today’s rules, or rules already scheduled for 2027.',
      'Every screening runs on the device. No server, no accounts, no analytics: zero bytes of household data leave the page.',
      'English, Español and Հայերեն, with a printable two-language plan. 795 tests passing. Built by a team of two.',
    ],
    links: [
      { label: 'Live demo', href: 'https://arthurtunyan.github.io/benefits-matcher/' },
      { label: 'Source', href: 'https://github.com/arthurtunyan/benefits-matcher' },
    ],
  },
  {
    name: 'Groundwork LA',
    year: '2026',
    kind: 'Disaster preparedness',
    line: 'Finds the neighborhoods where earthquake and wildfire readiness gaps are largest, and explains why.',
    stack: ['Python', 'scikit-learn', 'FastAPI', 'Leaflet'],
    points: [
      'Built the data pipeline, feature engineering, risk model and API behind an interactive map.',
      'Scores each tract on demographic, housing and hazard-exposure features from public data only.',
      'Click a neighborhood to see what drives its score and the shelters and resources nearby.',
    ],
  },
  {
    name: 'Ledger',
    year: 'Hackathon',
    kind: 'Rule engine lead',
    line: 'Photograph a wholesale invoice and get a pass/fail stocking-compliance scorecard for your store.',
    stack: ['Rule engine', 'Invoice parsing'],
    points: [
      'Designed the rule engine that turns parsed invoice line items into a compliance scorecard store owners can act on.',
    ],
  },
  {
    name: 'SAT 1v1',
    year: '2026',
    kind: 'Realtime practice',
    line: 'Head-to-head SAT practice where you never see the same question twice.',
    stack: ['React', 'Socket.IO', 'Next.js', 'Spring Boot', 'PostgreSQL'],
    points: [
      'Live matches over Socket.IO, with stats and a leaderboard in a Next.js API.',
      'No-repeat questions enforced in the database: a unique (user, question) constraint, checked server-side so the client can’t game it.',
    ],
  },
  {
    name: 'Contrastive Pretraining',
    year: '2026',
    kind: 'Independent ML',
    line: 'A self-supervised pipeline that learns useful representations from unlabeled data.',
    stack: ['Python', 'Self-supervised learning'],
    points: [
      'Builds positive pairs through augmentation and trains an encoder with a contrastive loss, with no labels needed.',
      'This is the groundwork for the Smoke Signal encoder.',
    ],
  },
];

export const honors = [
  { what: 'USACO Gold Division', who: 'USA Computing Olympiad' },
  { what: 'Downtown Hacker Fund Winner', who: 'Downtown Hacker Fund' },
  { what: '1st Place, Designer Genes', who: 'Rickards Science Olympiad Invitational' },
];

export const education = [
  {
    school: 'Burbank High School',
    when: '2023 — 2027',
    detail: 'Speech and Debate · Varsity Wrestling · Future Leaders President · Science Olympiad',
  },
  {
    school: 'Glendale Community College',
    when: '2023 — 2027',
    detail: 'College coursework taken alongside high school',
  },
];

export const teaching = [
  { where: 'St. Francis Xavier', when: '2025 — 26', what: 'Python workshops for grades 3–8, plus chess strategy' },
  { where: 'Burbank Adult School', when: '2026', what: 'Chess fundamentals, matches and post-game analysis' },
  { where: 'Columbus Elementary', when: '2025', what: 'Intro programming with Code.org and Trinket' },
];

export const also = [
  { k: 'Athletics', v: 'Varsity wrestling, boxing, soccer and swimming' },
  { k: 'Member', v: 'National Honor Society, Science Olympiad, Speech and Debate' },
  { k: 'Interests', v: 'Distribution shift, environmental health, hyperdimensional computing, low-resource language tech' },
];

export const stack = [
  'Python', 'TypeScript', 'JavaScript', 'Java', 'React', 'Vite', 'Next.js', 'FastAPI',
  'Spring Boot', 'scikit-learn', 'Random Forest', 'SVM', 'Contrastive learning', 'PostgreSQL',
  'Socket.IO', 'Leaflet', 'Mapbox', 'Azure AI Speech', 'Tailwind', 'Git',
];
