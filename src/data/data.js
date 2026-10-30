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
  venue: 'Venue to be announced',
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
  { value: 25, suffix: '', label: 'Committees, from the Security Council to Formula 1' },
  { value: 50000, suffix: ' USD', label: 'Raised for solar power in rural Indian schools' },
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
    agendas: [
      'Establishing international frameworks for the regulation of Lethal Autonomous Weapons Systems',
      'Developing international norms for cyber warfare and protecting state sovereignty in cyberspace',
    ],
    about: 'The First Committee deals with disarmament, global challenges and threats to peace that affect the international community, and seeks out solutions to the challenges in the international security regime. It considers all disarmament and international security matters within the scope of the Charter, the general principles of cooperation in the maintenance of international peace and security, and the principles governing disarmament and the regulation of armaments.',
  },
  {
    id: 'unsc', abbr: 'UNSC', name: 'United Nations Security Council', alt: 'Peace & Security',
    type: 'traditional',
    agendas: [
      'Neutralizing transnational criminal coalitions and mandatory enforcement of anti-trafficking protocols',
      'Re-evaluation of the veto power structure in the UNSC',
    ],
    about: 'The United Nations Security Council is a principal organ of the UN charged with maintaining international peace and security. Composed of 15 member states, including five permanent members with veto power, the council manages crises, deploys peacekeeping operations, and enforces decisions through economic sanctions, arms embargoes and authorised military action.',
  },
  {
    id: 'ga2', abbr: 'GA2', name: 'The Second General Assembly', alt: 'Economic & Financial',
    type: 'traditional',
    agendas: [
      'Deliberating the mobilisation of climate finance for loss and damage in vulnerable developing countries',
      'Combating the macroeconomic consequences of protectionist trade measures caused by increasing global economic imbalance',
    ],
    about: 'The General Assembly Second Committee, also known as the Economic and Financial Committee, is one of the six main committees of the UN General Assembly, comprising all 193 Member States. It is primarily responsible for global economic growth, sustainable development, poverty eradication, macroeconomic policy and international trade.',
  },
  {
    id: 'ga4', abbr: 'GA4', name: 'The Fourth General Assembly', alt: 'Special Political & Decolonization',
    type: 'traditional',
    agendas: [
      'Discussing the post-colonial complexities caused by colonial powers in Asia',
      'Implementing solutions to mitigate authoritarian regimes globally',
    ],
    about: 'The General Assembly Fourth Committee, often called SPECPOL, is tasked with resolving complex, geopolitically sensitive issues. Its mandate spans decolonization, peacekeeping, outer space cooperation, human rights, and humanitarian aid for Palestinian refugees, approached through a political and strategic lens rather than a socio-economic one.',
  },
  {
    id: 'uncsw', abbr: 'UNCSW', name: 'Commission on the Status of Women', alt: 'Gender Equality',
    type: 'traditional',
    agendas: [
      'Addressing the economic inequality in non-traditional reproductive technologies through comprehensive regulation',
      'Enhancing women’s economic empowerment through financial inclusion and entrepreneurship',
    ],
    about: 'The United Nations Commission on the Status of Women is the principal global intergovernmental body exclusively dedicated to the promotion of gender equality and the empowerment of women. Established in 1946 as a functional commission of ECOSOC, it shapes global standards, documents women’s realities, and monitors the implementation of the Beijing Declaration and Platform for Action.',
  },
  {
    id: 'unhrc', abbr: 'UNHRC', name: 'United Nations Human Rights Council', alt: 'Human Rights',
    type: 'traditional',
    agendas: [
      'Holding member states responsible for the denial of human rights, such as food, water and housing, during conflict',
      'Combating state-sponsored media manipulation and the expansion of political prison camps',
    ],
    about: 'The United Nations Human Rights Council is an intergovernmental body responsible for promoting and protecting human rights globally. Composed of 47 Member States, the Geneva-based council addresses urgent human rights violations, investigates crises through fact-finding missions, and issues recommendations to ensure adherence to fundamental freedoms.',
  },
  {
    id: 'who', abbr: 'WHO', name: 'World Health Organization', alt: 'Global Health',
    type: 'traditional',
    agendas: [
      'Ensuring emergency medical infrastructure for civilian populations in active conflict zones (short-term)',
      'Rebuilding sustainable health systems in post-conflict humanitarian settings (long-term)',
    ],
    about: 'A WHO Expert Committee is a designated group of technical specialists convened by the Director-General to evaluate complex global health issues. Its primary function is to review emerging scientific data and provide independent, evidence-based guidance, strategic recommendations and policy advice on global health challenges.',
  },
  {
    id: 'unicef', abbr: 'UNICEF', name: 'United Nations International Children’s Emergency Fund', alt: 'Children’s Rights',
    type: 'traditional',
    agendas: [
      'Mitigating the effects of media consumption and “brain rot” on the attention span of adolescents',
      'Addressing and ensuring the safeguarding of children residing in conflict-ridden zones',
    ],
    about: 'UNICEF is dedicated to defending, promoting and protecting the fundamental rights of children worldwide. Delegates collaborate to address critical issues such as child healthcare, nutrition, access to quality education, clean water, and emergency relief in crisis-affected areas.',
  },
  {
    id: 'unep', abbr: 'UNEP', name: 'United Nations Environment Programme', alt: 'Environment',
    type: 'traditional',
    agendas: [
      'Addressing and countering methane emissions from agricultural activities and waste management systems',
      'Promoting sustainable energy use and efficiency in developing countries',
    ],
    about: 'The United Nations Environment Programme is the leading global environmental authority. It sets the global environmental agenda, promotes the coherent implementation of the environmental dimension of sustainable development within the UN system, and serves as an authoritative advocate for the global environment.',
  },
  {
    id: 'unodc', abbr: 'UNODC', name: 'United Nations Office on Drugs and Crime', alt: 'Drugs & Crime',
    type: 'traditional',
    agendas: [
      'Safeguarding endangered species and strengthening international conservation laws',
      'Addressing the socio-economic impacts of narcotic networks and enhancing governance strategies for global security',
    ],
    about: 'The United Nations Office on Drugs and Crime works to make the world safer from transnational organised crime, drug trafficking, corruption and terrorism. It assists Member States in drafting legislation, strengthening criminal justice systems, and promoting the rule of law to build resilient societies.',
  },
  {
    id: 'ccpcj', abbr: 'CCPCJ', name: 'Commission on Crime Prevention and Criminal Justice', alt: 'Criminal Justice',
    type: 'traditional',
    agendas: [
      'Addressing criminal networks involved in illegal waste trafficking, hazardous dumping and exploitative recycling economies',
      'Addressing predatory lending and illegal microfinance schemes perpetuating cycles of poverty in vulnerable communities',
    ],
    about: 'The Commission on Crime Prevention and Criminal Justice is a functional commission of ECOSOC and the principal policymaking body of the United Nations on crime prevention and criminal justice. Established in 1992, it works to improve international action against national and transnational crime while enhancing the fairness and efficiency of criminal justice systems.',
  },

  {
    id: 'csc', abbr: 'CSC', name: 'Crisis Space Council', alt: 'Space Governance',
    type: 'crisis', agendas: ['Crisis', 'Crisis'],
    about: 'CSC is a crisis committee focused on space governance and international cooperation beyond Earth. Delegates navigate space security, technological competition, and the future of space exploration in a rapidly evolving environment. The committee rewards adaptability, strategic thinking and decisive action under pressure.',
  },
  {
    id: 'fcc', abbr: 'FCC', name: 'Futuristic Crisis Committee', alt: 'Future Governance',
    type: 'crisis', agendas: ['Crisis', 'Crisis'],
    about: 'FCC is a fast-paced crisis committee set in a rapidly evolving future. Delegates respond to governance breakdowns, technological disruptions and international crises while adapting to constant developments. It emphasises creativity, adaptability and strategic problem-solving under pressure.',
  },
  {
    id: 'f1', abbr: 'F1', name: 'Formula 1', alt: 'Motorsport Governance',
    type: 'crisis', agendas: ['Crisis', 'Crisis'],
    about: 'The Formula 1 committee focuses on the governance, politics and commercial side of motorsport. Delegates deal with technical regulations, team rivalries, championship management and crises within the sport, combining strategic negotiation with fast-paced updates.',
  },
  {
    id: 'oma', abbr: 'OMA', name: 'Organisation of Musical Arts', alt: 'The Music Industry',
    type: 'crisis', agendas: ['Crisis', 'Crisis'],
    about: 'The Organisation of Musical Arts brings crisis simulation to the world of music. Delegates navigate the rivalries, deals and controversies that shape the global music industry, responding to developments as they unfold.',
  },
  {
    id: 'interpol', abbr: 'INTERPOL', name: 'International Criminal Police Organization', alt: 'Global Policing',
    type: 'crisis', agendas: ['Crisis', 'Crisis'],
    about: 'INTERPOL connects police forces across its member countries so they can work together to make the world safer. In committee, delegates coordinate cross-border investigations and respond to unfolding criminal threats in real time.',
  },
  {
    id: 'fifa', abbr: 'FIFA', name: 'Fédération Internationale de Football Association', alt: 'Football Governance',
    type: 'crisis', agendas: ['Crisis', 'Crisis'],
    about: 'The FIFA committee simulates the global governance of football and the challenges the sport faces internationally. Delegates discuss tournament organisation, financial regulation, ethical controversies and the development of football worldwide, combining sports administration with crisis-oriented debate.',
  },
  {
    id: 'tbc', abbr: 'TBC', name: 'The Black Chamber', alt: 'Covert Operations',
    type: 'crisis', agendas: ['Crisis', 'Crisis'],
    about: 'The Black Chamber is a specialised committee focused on covert operations, influence and global power structures. Delegates navigate secrecy, political manipulation and strategic decision-making while shaping international events from behind the scenes. Built for delegates who enjoy unconventional formats and strategic gameplay.',
  },
  {
    id: 'twh', abbr: 'TWH', name: 'The White House', alt: 'Executive Cabinet',
    type: 'crisis', agendas: ['Crisis', 'Crisis'],
    about: 'The White House places delegates inside the executive branch of the United States. As senior officials, they advise, manoeuvre and act as domestic and international crises land on the President’s desk.',
  },

  {
    id: 'ukfc', abbr: 'UKFC', name: 'United Kingdom Foreign Court', alt: 'Legal Advocacy',
    type: 'special',
    agendas: ['Discussion on the appeal of Indra Sawhney and Ors. v. Union of India'],
    about: 'UKFC is a specialised legal committee built around courtroom-style competition and legal reasoning. Delegates participate in teams and argue across criminal, family, tort and corporate law. The focus is analytical thinking, structured argumentation and legal interpretation rather than traditional diplomatic debate, making it ideal for delegates interested in law and advocacy.',
  },
  {
    id: 'icao', abbr: 'ICAO', name: 'International Civil Aviation Organization', alt: 'Aviation',
    type: 'special',
    agendas: [
      'Ensuring labour rights and ethical working conditions within the global airline industry',
      'Deliberating upon the regulation of carbon emissions and the transition towards net-zero aviation',
    ],
    about: 'ICAO committees support the agency’s goal of safe, secure and sustainable international civil aviation. From the legal committee to technical environmental panels, they draft policies, conduct studies and shape the regulations that govern global air transport.',
  },
  {
    id: 'icj', abbr: 'ICJ', name: 'International Court of Justice', alt: 'International Law',
    type: 'special',
    agendas: ['Armenia v. Azerbaijan', 'China v. India'],
    about: 'The International Court of Justice is the principal judicial organ of the United Nations, settling legal disputes between states and giving advisory opinions on international law. At SODMUN it runs as a mock courtroom, with participants acting as advocates and judges rather than country delegates.',
  },
  {
    id: 'marvel', abbr: 'MARVEL', name: 'Marvel', alt: 'Fictional Crisis',
    type: 'special', agendas: ['Crisis', 'Crisis'],
    about: 'The Marvel committee is a fictional crisis set within the Marvel universe. Delegates represent major characters and organisations while responding to large-scale crises, shifting alliances and unpredictable developments, combining creative problem-solving with fast-paced collaborative strategy.',
  },
  {
    id: 'itpa', abbr: 'ITPA', name: 'International Tribunal on Policy Affairs', alt: 'Tribunal',
    type: 'special', agendas: ['To be announced'],
    about: 'The International Tribunal on Policy Affairs is a tribunal-style committee in which delegates examine contested policy decisions, build their case, and argue it before the bench.',
  },
  {
    id: 'ipc', abbr: 'IPC', name: 'International Press Corps', alt: 'Journalism',
    type: 'special',
    agendas: ['Ethics of publishing war photography and graphic reporting'],
    about: 'The International Press Corps simulates the role of global media during the conference. Instead of representing a country, delegates act as journalists and outlets, covering other committees, reporting on breaking developments in real time, conducting interviews and publishing news coverage.',
  },
];

/* ---------------- Secretariat (SODMUN IV) ---------------- */
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
  { n: 'V', title: 'SODMUN V', text: 'The next chapter, from 11 December 2026 in Dubai. Venue to be announced.', img: null },
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
  { id: 'delegate', title: 'Delegate', kicker: 'Individuals', url: null,
    text: 'Represent a nation, a character or a newsroom in one of 25 committees. Open to students of every experience level, from first-timers to seasoned Best Delegates.' },
  { id: 'delegation', title: 'School Delegation', kicker: 'Schools & clubs', url: null,
    text: 'Bring your school’s MUN club as a delegation. Faculty advisors get a single point of contact and coordinated committee allocations.' },
  { id: 'admin', title: 'Admin', kicker: 'On the ground', url: null,
    text: 'Keep committees running on the day: runners, room support, registration and hospitality. Award-winning admins are recognised too.' },
];
