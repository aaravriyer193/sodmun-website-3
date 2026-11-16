/* ------------------------------------------------------------------
   SODMUN — site content
   Everything editable lives here: committees, secretariat, partners,
   schedule, testimonials and application links.
------------------------------------------------------------------- */

export const SITE = {
  name: 'SODMUN',
  full: 'Summit of Diplomacy Model United Nations',
  edition: 'V',
  city: 'Dubai, United Arab Emirates',
  dates: '11 December 2026',
  // Countdown target, Gulf Standard Time
  startsAt: '2026-12-11T00:00:00+04:00',
  venue: 'Ambassador International Academy, Mankhool',
  email: 'sg.sodmun@gmail.com',
  phone: '+971 55 480 1227',
  phoneHref: 'tel:+971554801227',
  whatsapp: 'https://wa.me/971554801227',
  instagram: 'https://instagram.com/sod.mun',
  instagramHandle: '@sod.mun',
  linkedin: 'https://linkedin.com/company/summit-of-diplomacy',
  platform: 'https://app.sodmun.com',
  tutorial: 'https://www.youtube-nocookie.com/embed/2R7Y2AEBWOY?rel=0&modestbranding=1&playsinline=1&autoplay=1',
  delegateResources: 'https://drive.google.com/drive/folders/12-TLOk6Jjp0gGER6dnFStediSGhbtkkG?usp=sharing',
  backgroundGuides: 'https://drive.google.com/drive/folders/1y3tpu61hC-wGPT-iuVnb8uvpqUK9UKPz',
};

export const NAV = [
  { href: 'about.html', label: 'About' },
  { href: 'secretariat.html', label: 'Secretariat' },
  { href: 'committees.html', label: 'Committees' },
  { href: 'partners.html', label: 'Partners' },
  { href: 'contact.html', label: 'Contact' },
];

export const STATS = [
  { value: 1500, suffix: '+', label: 'Delegates across SODMUN I, II and III' },
  { value: 700, suffix: '+', label: 'Delegates expected at SODMUN IV' },
  { value: 20, suffix: '', label: 'Committees, from the Security Council to Formula 1' },
  { value: 70000, suffix: '+ USD', label: 'Raised for solar panels in rural India' },
];

/* ---------------- Committees ----------------
   type: traditional | crisis | special
   Agendas are from SODMUN IV until SODMUN V guides are released. */
export const COMMITTEE_TYPES = {
  traditional: 'Traditional',
  crisis: 'Crisis',
  special: 'Specialised',
};

export const COMMITTEES = [
  {
    id: 'ga1', abbr: 'GA1', name: 'The First General Assembly', alt: 'Disarmament & International Security',
    type: 'traditional',
    agendas: [], // SODMUN V agendas: coming soon
    about: 'The First Committee deals with disarmament, global challenges and threats to peace that affect the international community, and seeks out solutions to the challenges in the international security regime. It considers all disarmament and international security matters within the scope of the Charter, the general principles of cooperation in the maintenance of international peace and security, and the principles governing disarmament and the regulation of armaments.',
  },
  {
    id: 'ga2', abbr: 'GA2', name: 'The Second General Assembly', alt: 'Economic & Financial',
    type: 'traditional',
    agendas: [], // SODMUN V agendas: coming soon
    about: 'The General Assembly Second Committee, also known as the Economic and Financial Committee, is one of the six main committees of the UN General Assembly, comprising all 193 Member States. It is primarily responsible for global economic growth, sustainable development, poverty eradication, macroeconomic policy and international trade.',
  },
  {
    id: 'ga3', abbr: 'GA3', name: 'The Third General Assembly', alt: 'Social, Humanitarian & Cultural',
    type: 'traditional', emblem: 'assets/brand/logo.png',
    agendas: [], // SODMUN V agendas: coming soon
    about: 'The General Assembly Third Committee, known as SOCHUM, addresses social, humanitarian and cultural issues that affect people around the world. Its work spans human rights, the advancement of women, the protection of children, the treatment of refugees and the elimination of racism and discrimination.',
  },
  {
    id: 'unsc', abbr: 'UNSC', name: 'United Nations Security Council', alt: 'Peace & Security',
    type: 'traditional',
    agendas: [], // SODMUN V agendas: coming soon
    about: 'The United Nations Security Council is a principal organ of the UN charged with maintaining international peace and security. Composed of 15 member states, including five permanent members with veto power, the council manages crises, deploys peacekeeping operations, and enforces decisions through economic sanctions, arms embargoes and authorised military action.',
  },
  {
    id: 'unhrc', abbr: 'UNHRC', name: 'United Nations Human Rights Council', alt: 'Human Rights',
    type: 'traditional',
    agendas: [], // SODMUN V agendas: coming soon
    about: 'The United Nations Human Rights Council is an intergovernmental body responsible for promoting and protecting human rights globally. Composed of 47 Member States, the Geneva-based council addresses urgent human rights violations, investigates crises through fact-finding missions, and issues recommendations to ensure adherence to fundamental freedoms.',
  },
  {
    id: 'uncsw', abbr: 'UNCSW', name: 'United Nations Commission on the Status of Women', alt: 'Gender Equality',
    type: 'traditional',
    agendas: [], // SODMUN V agendas: coming soon
    about: 'The United Nations Commission on the Status of Women is the principal global intergovernmental body exclusively dedicated to the promotion of gender equality and the empowerment of women. Established in 1946 as a functional commission of ECOSOC, it shapes global standards, documents women’s realities, and monitors the implementation of the Beijing Declaration and Platform for Action.',
  },
  {
    id: 'iaea', abbr: 'IAEA', name: 'International Atomic Energy Agency', alt: 'Nuclear Energy & Safeguards',
    type: 'traditional', emblem: 'assets/brand/logo.png',
    agendas: [], // SODMUN V agendas: coming soon
    about: 'The International Atomic Energy Agency is the world’s centre for cooperation in the nuclear field. It works with its Member States to promote the safe, secure and peaceful use of nuclear technology, and uses its safeguards system to verify that nuclear material is not diverted towards weapons.',
  },
  {
    id: 'ccpcj', abbr: 'CCPCJ', name: 'Commission on Crime Prevention and Criminal Justice', alt: 'Criminal Justice',
    type: 'traditional',
    agendas: [], // SODMUN V agendas: coming soon
    about: 'The Commission on Crime Prevention and Criminal Justice is a functional commission of ECOSOC and the principal policymaking body of the United Nations on crime prevention and criminal justice. Established in 1992, it works to improve international action against national and transnational crime while enhancing the fairness and efficiency of criminal justice systems.',
  },
  {
    id: 'ipc', abbr: 'IPC', name: 'International Press Corps', alt: 'Journalism',
    type: 'traditional',
    agendas: [], // SODMUN V agendas: coming soon
    about: 'The International Press Corps simulates the role of global media during the conference. Instead of representing a country, delegates act as journalists and outlets, covering other committees, reporting on breaking developments in real time, conducting interviews and publishing news coverage.',
  },
  {
    id: 'unodc', abbr: 'UNODC Jr', name: 'United Nations Office on Drugs and Crime', alt: 'Drugs & Crime · Junior',
    type: 'traditional',
    agendas: [], // SODMUN V agendas: coming soon
    about: 'The United Nations Office on Drugs and Crime works to make the world safer from transnational organised crime, drug trafficking, corruption and terrorism. It assists Member States in drafting legislation, strengthening criminal justice systems, and promoting the rule of law to build resilient societies.',
  },
  {
    id: 'unscjr', abbr: 'UNSC Jr', name: 'Security Council Jr', alt: 'Peace & Security · Junior',
    type: 'traditional', emblem: 'assets/committees/unsc.png',
    agendas: [], // SODMUN V agendas: coming soon
    about: 'A junior edition of the Security Council for younger and newer delegates. It follows the procedure of the UN Security Council, where 15 members, including five permanent members with veto power, debate threats to international peace and security.',
  },
  {
    id: 'csc', abbr: 'CSC', name: 'Crisis Space Council', alt: 'Space Governance',
    type: 'crisis',
    agendas: [], // SODMUN V agendas: coming soon
    about: 'CSC is a crisis committee focused on space governance and international cooperation beyond Earth. Delegates navigate space security, technological competition, and the future of space exploration in a rapidly evolving environment. The committee rewards adaptability, strategic thinking and decisive action under pressure.',
  },
  {
    id: 'twh', abbr: 'TWH', name: 'The White House', alt: 'Executive Cabinet',
    type: 'crisis',
    agendas: [], // SODMUN V agendas: coming soon
    about: 'The White House places delegates inside the executive branch of the United States. As senior officials, they advise, manoeuvre and act as domestic and international crises land on the President’s desk.',
  },
  {
    id: 'doomsday', abbr: 'Doomsday', name: 'Doomsday', alt: 'Catastrophe Crisis',
    type: 'crisis', emblem: 'assets/brand/logo.png',
    agendas: [], // SODMUN V agendas: coming soon
    about: 'A crisis committee built around a catastrophe in motion. Delegates respond to developments as the scenario unfolds, and the full brief is released with the background guides.',
  },
  {
    id: 'fcc', abbr: 'FCC', name: 'Futuristic Crisis Committee', alt: 'Future Governance',
    type: 'crisis',
    agendas: [], // SODMUN V agendas: coming soon
    about: 'FCC is a fast-paced crisis committee set in a rapidly evolving future. Delegates respond to governance breakdowns, technological disruptions and international crises while adapting to constant developments. It emphasises creativity, adaptability and strategic problem-solving under pressure.',
  },
  {
    id: 'fifa', abbr: 'FIFA', name: 'Fédération Internationale de Football Association', alt: 'Football Governance',
    type: 'crisis',
    agendas: [], // SODMUN V agendas: coming soon
    about: 'The FIFA committee simulates the global governance of football and the challenges the sport faces internationally. Delegates discuss tournament organisation, financial regulation, ethical controversies and the development of football worldwide, combining sports administration with crisis-oriented debate.',
  },
  {
    id: 'icc', abbr: 'ICC', name: 'International Cricket Council', alt: 'Cricket Governance',
    type: 'special', emblem: 'assets/brand/logo.png',
    agendas: [], // SODMUN V agendas: coming soon
    about: 'The International Cricket Council is the global governing body of cricket. It oversees the rules and integrity of the sport, runs international tournaments such as the ICC Cricket World Cup, and works with its member boards to grow the game worldwide.',
  },
  {
    id: 'es', abbr: 'ES', name: 'Entrepreneurship Summit', alt: 'Business Case Competition',
    type: 'special', emblem: 'assets/brand/logo.png',
    agendas: [], // SODMUN V agendas: coming soon
    about: 'The Entrepreneurship Summit is a business case competition. Teams analyse a real-world business case, build a strategy and pitch their solution to a panel of judges.',
  },
  {
    id: 'f1', abbr: 'F1', name: 'Formula 1', alt: 'Motorsport Governance',
    type: 'special',
    agendas: [], // SODMUN V agendas: coming soon
    about: 'The Formula 1 committee focuses on the governance, politics and commercial side of motorsport. Delegates deal with technical regulations, team rivalries, championship management and crises within the sport, combining strategic negotiation with fast-paced updates.',
  },
  {
    id: 'ukfc', abbr: 'UKFC', name: 'United Kingdom Foreign Court', alt: 'Legal Advocacy',
    type: 'special',
    agendas: [], // SODMUN V agendas: coming soon
    about: 'UKFC is a specialised legal committee built around courtroom-style competition and legal reasoning. Delegates participate in teams and argue across criminal, family, tort and corporate law. The focus is analytical thinking, structured argumentation and legal interpretation rather than traditional diplomatic debate, making it ideal for delegates interested in law and advocacy.',
  },
];

/** Emblem image for a committee (new committees fall back to the SODMUN mark). */
export const emblemOf = (c) => c.emblem || `assets/committees/${c.id}.png`;

export const SECRETARIAT = [
  {
    group: 'Founders',
    note: 'The three co-founders who oversee every part of SODMUN.',
    people: [
      { id: 'vishesh-shah', name: 'Vishesh Shah', role: 'Co-Founder & Secretary-General' },
      { id: 'aarav-mamtani', name: 'Aarav Mamtani', role: 'Co-Founder & Director-General' },
      { id: 'rayan-hussain', name: 'Rayan Hussain', role: 'Co-Founder & Director-General' },
    ],
  },
  {
    group: 'Secretary-General & Deputies',
    people: [
      { id: 'dhairya-kamlani', name: 'Dhairya Kamlani', role: 'Secretary-General' },
      { id: 'niyamat-nanda', name: 'Niyamat Nanda', role: 'Deputy Secretary-General' },
      { id: 'tanya-bhargava', name: 'Tanya Bhargava', role: 'Deputy Secretary-General' },
    ],
  },
  {
    group: 'Operations & Logistics',
    people: [
      { id: 'haider-salik', name: 'Haider Salik', role: 'USG of Operations & Logistics' },
      { id: 'diva-solanki', name: 'Diva Solanki', role: 'Deputy Director of Operations & Logistics' },
    ],
  },
  {
    group: 'Crisis',
    people: [
      { id: 'raunak-ramesh', name: 'Raunak Ramesh', role: 'USG of Crisis' },
      { id: 'jovino-joji', name: 'Jovino Joji', role: 'Crisis Director' },
    ],
  },
  {
    group: 'Committees',
    people: [
      { id: 'jinal-ravaya', name: 'Jinal Ravaya', role: 'USG of Committees' },
      { id: 'kavya-shah', name: 'Kavya Shah', role: 'Deputy Director of Committees' },
    ],
  },
  {
    group: 'Delegate Affairs',
    people: [
      { id: 'adnan-faisal', name: 'Adnan Faisal', role: 'USG of Delegate Affairs' },
      { id: 'shreyas-vivek', name: 'Shreyas Vivek', role: 'USG of Delegate Affairs' },
    ],
  },
  {
    group: 'Technology',
    people: [
      { id: 'aarav-iyer', name: 'Aarav Iyer', role: 'Head of Technology' },
      { id: 'preksh-gala', name: 'Preksh Gala', role: 'Deputy Head of Technology' },
      { id: 'nirbav-sankar', name: 'Nirbav Sankar', role: 'Tech Member' },
    ],
  },
  {
    group: 'Executive Advisors',
    people: [
      { id: 'andre-chitongco', name: 'Andre Chitongco', role: 'Executive Advisor' },
      { id: 'pranav-nair', name: 'Pranav Nair', role: 'Executive Advisor' },
    ],
  },
  {
    group: 'Public Relations',
    people: [
      { id: 'aadhavan-kartik', name: 'Aadhavan Kartik', role: 'Director of PR' },
      { id: 'aditya-patil', name: 'Aditya Patil', role: 'Deputy Director of PR' },
      { id: 'anshul-rohit', name: 'Anshul Rohit', role: 'Deputy Director of PR' },
      { id: 'nitika-iyyappan', name: 'Nitika Iyyappan', role: 'PR Member' },
      { id: 'hishetha-bhatia', name: 'Hishetha Bhatia', role: 'PR Member' },
    ],
  },
  {
    group: 'Editorial & Design',
    people: [
      { id: 'sanika-padekar', name: 'Sanika Padekar', role: 'Director of Editorial & Design' },
      { id: 'rudraditya-bisen', name: 'Rudraditya Singh Bisen', role: 'Deputy Director of Editorial & Design' },
      { id: 'tejal-behal', name: 'Tejal Behal', role: 'Media Member' },
      { id: 'jonas-jo', name: 'Jonas Jo', role: 'Media Member' },
      { id: 'avani-balasubramanya', name: 'Avani Balasubramanya', role: 'Media Member' },
      { id: 'rittal-rafeek', name: 'Rittal Rafeek', role: 'Media Member' },
      { id: 'krishna-yalavarthy', name: 'Krishna Yalavarthy', role: 'Media Member' },
      { id: 'sonavi-kadam', name: 'Sonavi Kadam', role: 'Media Member' },
    ],
  },
  {
    group: 'Creative Visuals',
    people: [
      { id: 'aanya-kedia', name: 'Aanya Kedia', role: 'Director of Creative Visuals' },
      { id: 'fahad-ali-mohammed', name: 'Fahad Ali Mohammed', role: 'Deputy Director of Creative Visuals' },
      { id: 'ankshita-tiwari', name: 'Ankshita Tiwari', role: 'Creative Advisor' },
      { id: 'mahir-gandhi', name: 'Mahir Gandhi', role: 'Media Member' },
      { id: 'hammad-dehlavi', name: 'Hammad Dehlavi', role: 'Media Member' },
      { id: 'harini-anand', name: 'Harini Prem Anand', role: 'Media Member' },
      { id: 'haya-ali', name: 'Haya Ali', role: 'Media Member' },
      { id: 'adeela-shaikh', name: 'Adeela Shaikh', role: 'Media Member' },
      { id: 'alayna-asif', name: 'Alayna Asif', role: 'Media Member' },
      { id: 'misbah-jawed', name: 'Misbah Jawed', role: 'Media Member' },
      { id: 'zaina-aadil', name: 'Zaina Aadil', role: 'Media Member' },
    ],
  },
  {
    group: 'Admins',
    people: [
      { id: 'clayton-monteiro', name: 'Clayton Monteiro', role: 'USG of Admins' },
      { id: 'isma-shamnad', name: 'Isma Shamnad', role: 'Director of Admins' },
    ],
  },
  {
    group: 'Chiefs of Unemployment',
    people: [
      { id: 'joshua-rohith', name: 'Rohith John Saldanha & Joshua John Ligo', role: 'Chiefs of Unemployment' },
    ],
  },
];

/* ---------------- Partners (SODMUN IV, 2026) ---------------- */
export const PARTNERS = [
  {
    tier: 'Chief Sponsor', name: 'Crimson Education', url: 'https://www.crimsoneducation.org',
    blurb: 'A global leader in university admissions consulting. Founder Jamie Beaton, a graduate of Harvard, Stanford, Yale, Princeton and UPenn, gave a Day 3 keynote on admissions, leadership and academic excellence.',
  },
  {
    tier: 'Chief Sponsor', name: 'Proplr', url: 'https://proplr.ae',
    blurb: 'Official Community & Career Partner. 60% scholarships for award winners, 25% scholarships to its foundation programme for session attendees, and a Day 3 career development session with AI-powered guidance.',
  },
  {
    tier: 'Eco-Tech Sponsor', name: 'Reborn World', url: 'https://reborn-world.com',
    blurb: 'Championing sustainability through the circular economy, with eco-tech goodie bags for award-winning delegates and admins.',
  },
  {
    tier: 'Industry & Innovation Partner', name: 'I-FIELD', url: 'https://www.ifield.ae/',
    blurb: 'Two decades of interior manufacturing, fit-out and project execution, bringing industry perspective on turning ideas into real-world outcomes.',
  },
  {
    tier: 'Technology Sponsor', name: 'Logitech', url: 'https://logitech.com',
    blurb: 'A global leader in peripherals and productivity technology, supporting young leaders and meaningful dialogue in international affairs.',
  },
  {
    tier: 'AI Sponsor', name: 'Fulminare', url: 'https://fulmina.re',
    blurb: 'An AI agent that gets work done: it runs each task on its own cloud machine, working in a real shell, browser and files inside an isolated sandbox.',
  },
  {
    tier: 'Food & Wellness Partner', name: 'Nutrible', url: 'https://nutrible.co',
    blurb: 'An internship programme in entrepreneurship for delegate award winners, and discount vouchers for every participant.',
  },
];

/* ---------------- Testimonials ---------------- */
export const TESTIMONIALS = [
  {
    quote: 'SODMUN was a great experience. It improved my public speaking, debate, and diplomacy skills. The conference was well organized and the chairs were very supportive, which made discussions productive and engaging. I learned a lot and would definitely participate again.',
    name: 'Yohan Gangrade', role: 'Diplomatic Delegate',
  },
  {
    quote: 'The SODMUN III Conference was absolutely lit. Everything was perfect: the food, the venue, the chairs and the EB were on time and helpful. The new committees were unique and they had rooms chosen depending on the committee.',
    name: 'Armaan Ahamed', role: 'The White House, SODMUN III',
  },
];

/* ---------------- Editions ---------------- */
export const EDITIONS = [
  { n: 'I', title: 'SODMUN I', text: 'Where it started: a conference built by students who wanted the MUN they had always wished to attend.', img: 'assets/photos/legacy-cover.jpg' },
  { n: 'II', title: 'SODMUN II', text: 'Over 450 delegates across 12+ committees. The foundation of what is now the largest teen-owned MUN in the world.', img: 'assets/photos/legacy-2.jpg' },
  { n: 'III', title: 'SODMUN III', text: 'Over 600 delegates and 15+ committees. The most lively SODMUN yet, with its own Clash Royale clan and Minecraft server.', img: 'assets/photos/legacy-3.jpg' },
  { n: 'IV', title: 'SODMUN IV', text: '700+ delegates expected across 25 committees, and the first SODMUN with its own digital platform.', img: 'assets/photos/legacy-end.jpg' },
  { n: 'V', title: 'SODMUN V', text: 'The next chapter, 11 to 13 December 2026 at Ambassador International Academy, Mankhool, Dubai.', img: null },
];

/* ---------------- Schedule (provisional, modelled on SODMUN IV) ---------------- */
export const SCHEDULE = [
  {
    day: 'Day 1', weekday: 'Friday', title: 'Opening',
    items: [
      ['2:00 – 3:00 PM', 'Registration', 'Reception'],
      ['3:00 – 4:30 PM', 'Opening Ceremony', 'Auditorium'],
      ['4:30 – 4:45 PM', 'Moving to committees', ''],
      ['4:45 – 7:00 PM', 'Committee Session 1', 'Committee rooms'],
      ['7:00 PM', 'Dispersal', 'Reception'],
    ],
  },
  {
    day: 'Day 2', weekday: 'Saturday', title: 'Debate',
    items: [
      ['8:30 – 9:00 AM', 'Registration', 'Reception'],
      ['9:00 AM – 12:00 PM', 'Committee Session 2', 'Committee rooms'],
      ['12:00 – 12:30 PM', 'Break · food provided', 'Canteen'],
      ['12:30 – 3:00 PM', 'Committee Session 3', 'Committee rooms'],
      ['3:00 – 4:00 PM', 'Lunch · food provided', 'Canteen'],
      ['4:00 – 5:30 PM', 'Committee Session 4', 'Committee rooms'],
      ['5:30 – 7:30 PM', 'Internal Socials', 'Foyer'],
      ['6:30 – 9:00 PM', 'External Social Night', 'Off-site · buses provided'],
    ],
  },
  {
    day: 'Day 3', weekday: 'Sunday', title: 'Resolution',
    items: [
      ['9:30 – 10:00 AM', 'Registration', 'Reception'],
      ['10:00 AM – 12:30 PM', 'Committee Session 5', 'Committee rooms'],
      ['12:30 – 1:00 PM', 'Break', 'Canteen'],
      ['1:00 – 3:00 PM', 'Committee Session 6', 'Committee rooms'],
      ['3:00 – 4:00 PM', 'Lunch & partner sessions', 'Canteen · Auditorium'],
      ['4:00 – 5:00 PM', 'Committee Session 7', 'Committee rooms'],
      ['5:15 – 7:30 PM', 'Closing Ceremony & Awards', 'Auditorium'],
      ['7:30 PM', 'Dispersal', 'Reception'],
    ],
  },
];

/* ---------------- Applications ----------------
   Paste a form link into `url` to open a role; leave null to show “Opening soon”. */
export const APPLICATIONS = [
  { id: 'delegate', title: 'Delegate', kicker: 'Individuals', url: 'https://docs.google.com/forms/d/e/1FAIpQLScFsmD8l_F87Whkzq2DhXQZPK1uw1q8DiDt05NXvRKN22TKlg/viewform',
    text: 'Represent a nation, a character or a newsroom in one of 20 committees. Open to students of every experience level, from first-timers to seasoned Best Delegates.' },
  { id: 'delegation', title: 'School Delegation', kicker: 'Schools & clubs', url: null,
    text: 'Bring your school’s MUN club as a delegation. Faculty advisors get a single point of contact and coordinated committee allocations.' },
  { id: 'admin', title: 'Admin', kicker: 'On the ground', url: null,
    text: 'Keep committees running on the day: runners, room support, registration and hospitality. Award-winning admins are recognised too.' },
];
