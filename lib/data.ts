// Single source of truth for site content. Edit here to update the site.

const CAREER_START_YEAR = 2020;
export const yearsShipping = new Date().getFullYear() - CAREER_START_YEAR;

export const profile = {
  name: "Ghassan Ahmed",
  shortName: "Ghassan",
  role: "Software Engineer",
  tagline:
    "Software engineer from Gaza, Palestine. I design and ship products end-to-end — system architecture, APIs, and fast bilingual interfaces. Engineering BrightGaza; creator of Qareeb.",
  heroLine: `I design and ship software end-to-end — from system architecture and APIs to fast, bilingual interfaces. ${yearsShipping}+ years in production across Palestine and the Gulf. Currently engineering BrightGaza.`,
  location: "Jabalya, Gaza, Palestine",
  shortLocation: "Gaza, Palestine",
  timeZone: "Asia/Gaza",
  availability: "Open to select remote roles",
  email: "gssan1018@gmail.com",
  phone: "+970 56 771 1720",
  whatsapp: "https://wa.me/970567711720",
  linkedin: "https://linkedin.com/in/ghassan-ahmed-272390254",
  github: "",
  resumeUrl: "/Ghassan_Ahmed_CV.pdf",
} as const;

export const stats = [
  { value: `${yearsShipping}+`, label: "Years shipping to production" },
  { value: "10+", label: "National & government platforms" },
  { value: "2", label: "Countries with gov clients" },
  { value: "AR/EN", label: "Bilingual, RTL-native delivery" },
] as const;

// Names shown in the hero marquee.
export const shippedFor = [
  "BrightGaza",
  "Qareeb",
  "Palestinian Central Bureau of Statistics",
  "Ministry of Agriculture",
  "Human Rights Commission KSA",
  "Euro-Med Human Rights Monitor",
  "PalAI.network",
  "ArabTalents",
  "Palestinian Bar Association",
  "TAQAT",
] as const;

// The flagship — the first thing visitors see after the hero.
export const flagship = {
  name: "BrightGaza",
  href: "https://www.brightgaza.com",
  domain: "brightgaza.com",
  role: "Lead engineer · TAQAT",
  tagline: "Talent that shines beyond borders.",
  description:
    "BrightGaza is a freelance marketplace connecting global clients with vetted Palestinian talent. I engineer the platform behind it — hiring and service flows, proposals and contracts, secure payments, reviews, and the dashboards that run it all — in Arabic and English.",
  metrics: [
    { value: "12,500+", label: "Community members" },
    { value: "3,200+", label: "Projects delivered" },
    { value: "$480K+", label: "Secure payments" },
    { value: "96%", label: "Satisfaction rate" },
  ],
  highlights: [
    "Jobs, services & talent marketplace",
    "Proposals, contracts & milestones",
    "Secure payments with clear billing",
    "Ratings, reviews & verified profiles",
    "Arabic + English, RTL-native",
  ],
  stack: ["Next.js", "React", "REST APIs", "RBAC", "Payments", "i18n / RTL"],
  screens: {
    desktop: { src: "/work/brightgaza-en.jpg", alt: "BrightGaza home page in English" },
    mobile: { src: "/work/brightgaza-ar-mobile.jpg", alt: "BrightGaza home page in Arabic on a phone" },
  },
} as const;

// A newer product built from zero.
export const newBuild = {
  name: "Qareeb",
  nameAr: "قريب",
  meaning: "“nearby” in Arabic",
  href: "https://www.qareeb.ps",
  domain: "qareeb.ps",
  tagline: "A delivery platform built for Palestine.",
  description:
    "I designed and engineered Qareeb end-to-end — the customer ordering experience, phone-number sign-in, and the operations dashboard behind it. Arabic-first with full English support, installable on any phone, and deployed on a modern edge stack.",
  highlights: [
    {
      title: "Phone-first sign-in",
      body: "OTP verification on Palestinian numbers. No passwords, no friction.",
    },
    {
      title: "Arabic-first, truly bilingual",
      body: "RTL and LTR from one codebase — not a translated afterthought.",
    },
    {
      title: "Installable PWA",
      body: "Add it to the home screen and it behaves like a native app.",
    },
    {
      title: "Operations dashboard",
      body: "The tooling that keeps orders moving behind the scenes.",
    },
  ],
  stack: ["Next.js", "React", "PWA", "Vercel"],
  screens: {
    ar: { src: "/work/qareeb-ar.jpg", alt: "Qareeb sign-in screen in Arabic (RTL)" },
    en: { src: "/work/qareeb-en.jpg", alt: "Qareeb sign-in screen in English (LTR)" },
  },
} as const;

export const capabilities = [
  {
    title: "Product engineering",
    body: "From a blank repo to a live product — scoping, building, launching, iterating.",
  },
  {
    title: "Systems & APIs",
    body: "Data models, REST APIs, auth and RBAC, real-time pipelines that hold up in production.",
  },
  {
    title: "Interfaces",
    body: "Fast, responsive React / Next.js front-ends that feel native on a phone.",
  },
  {
    title: "Bilingual by default",
    body: "Arabic and English, RTL and LTR, designed in from day one.",
  },
] as const;

export const experience = [
  {
    company: "Qareeb",
    role: "Creator & Software Engineer",
    period: "Now",
    location: "Palestine",
    current: true,
    bullets: [
      "Designed and built Qareeb, a delivery platform for Palestine — ordering flows, phone-OTP authentication, and an operations dashboard.",
      "Arabic-first, fully bilingual (RTL/LTR) Next.js app shipped as an installable PWA on Vercel.",
    ],
  },
  {
    company: "TAQAT Palestine Business Incubator",
    role: "Senior Software Engineer",
    period: "Jan 2023 — Present",
    location: "Gaza, Palestine",
    current: true,
    bullets: [
      "Lead engineer on BrightGaza — the freelance marketplace connecting global clients with Palestinian talent (12,500+ members, 3,200+ projects delivered).",
      "Engineered production platforms across government and civic-tech, including PalAI.network and ArabTalents.org.",
      "Architected systems with role-based access control, RESTful APIs, and analytics dashboards serving thousands of daily users in Arabic (RTL) and English.",
      "Built CMS and admin platforms for the Palestinian Ministry of Agriculture and Saudi Arabia's Human Rights Commission — employee management, warehouse tracking, reporting.",
      "Owned secure authentication, API design, and integration workflows across multi-tenant deployments.",
    ],
  },
  {
    company: "Danat Company",
    role: "Freelance Software Engineer",
    period: "Apr 2022 — May 2024",
    location: "Contract / Part-time",
    current: false,
    bullets: [
      "Designed and shipped a real-time lead-prioritization pipeline over WebSockets, cutting sales-team response latency on hot leads.",
      "Built five product landing pages end-to-end: wireframes, mockups, and responsive implementations.",
      "Integrated RESTful APIs across internal applications and tuned performance for backend-heavy workloads.",
    ],
  },
  {
    company: "Shift Company",
    role: "Software Developer",
    period: "Nov 2020 — Feb 2022",
    location: "Gaza, Palestine",
    current: false,
    bullets: [
      "Improved site performance and user experience by ~83% in collaboration with the design team.",
      "Contributed to website planning and research workflows, saving the team an estimated 400+ working hours.",
      "Maintained QA sheets across design and project management for delivery quality control.",
    ],
  },
] as const;

export const projects = [
  {
    name: "PalAI.network",
    tagline: "Palestinian AI-Enabled Talent Platform",
    description:
      "Certification and talent-verification platform connecting Palestinian AI engineers with global employers. Profile validation flows, certification pipelines, and admin tooling for talent discovery.",
    tags: ["Backend lead", "Verification flows", "RBAC", "Admin tooling"],
    href: "https://palai.network",
    status: "Live",
  },
  {
    name: "ArabTalents",
    tagline: "Regional Freelance Marketplace",
    description:
      "Core modules for a bilingual freelance platform: gig lifecycle, bidding, role-based dashboards for clients, freelancers, and admins, moderation tooling, and reporting.",
    tags: ["Marketplace", "Bilingual / RTL", "REST APIs", "Dashboards"],
    href: "https://arabtalents.org",
    status: "Live",
  },
  {
    name: "Palestinian Central Bureau of Statistics",
    tagline: "National Statistics Portal",
    description:
      "Backend modules and dashboards for Palestine's national statistics portal — content management and bilingual data-publication workflows.",
    tags: ["Government", "CMS", "Data publishing", "AR / EN"],
    href: "https://pcbs.gov.ps",
    status: "Government",
  },
  {
    name: "Agricultural Risk Mitigation Fund",
    tagline: "Palestinian Ministry of Agriculture",
    description:
      "Full CMS for employee management, warehouse tracking, attendance, and reporting — with role-based access control and analytics dashboards for ministry operations.",
    tags: ["Government", "RBAC", "Analytics", "Operations"],
    href: "https://padrrif.moa.pna.ps",
    status: "Government",
  },
  {
    name: "Human Rights Commission, Saudi Arabia",
    tagline: "E-Services Portal",
    description:
      "RESTful APIs, front-end layouts, and the secure backend behind the e-services portal for Saudi Arabia's Human Rights Commission.",
    tags: ["Government", "Secure auth", "REST APIs", "Front-end"],
    href: "https://e-services.hrc.gov.sa",
    status: "Government",
  },
  {
    name: "Euro-Mediterranean Human Rights Monitor",
    tagline: "Dashboards & Reporting",
    description:
      "Dynamic dashboards and reporting systems for one of the region's most-cited human-rights organizations.",
    tags: ["Dashboards", "Reporting", "Data"],
    href: "https://euromedmonitor.org",
    status: "Live",
  },
  {
    name: "Palestinian Bar Association",
    tagline: "Legal Trainee Platform",
    description:
      "Responsive web pages and backend modules for the legal-trainee platform, built on Material UI.",
    tags: ["Platform", "Material UI", "Responsive"],
    href: "https://palestinebar.ps",
    status: "Live",
  },
  {
    name: "Al Fowzan & Mioon Fashion",
    tagline: "E-commerce Platforms",
    description:
      "Two end-to-end e-commerce platforms: product, order, and customer admin, secure checkout, and responsive storefronts.",
    tags: ["E-commerce", "Payments", "Admin"],
    href: "https://alfowzan.com",
    status: "Live",
  },
] as const;

export const steps = [
  {
    title: "Decompose",
    body: "Break the problem into pieces small enough to reason about.",
  },
  {
    title: "Design",
    body: "Data model, boundaries, and failure modes — before the first line of code.",
  },
  {
    title: "Ship a slice",
    body: "Get a thin, real version in front of users early.",
  },
  {
    title: "Iterate",
    body: "Measure, harden, repeat. Small steps compound.",
  },
] as const;

export const skills = [
  {
    group: "Languages",
    items: ["TypeScript", "JavaScript", "PHP", "SQL"],
  },
  {
    group: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "HTML & CSS", "RTL / i18n UI", "PWA"],
  },
  {
    group: "Backend",
    items: ["Node.js", "Laravel", "REST API design", "WebSockets", "Auth & RBAC", "MySQL"],
  },
  {
    group: "Platform & workflow",
    items: ["Git & GitHub", "Vercel", "Linux", "Deployment", "Postman", "Code review", "Agile"],
  },
  {
    group: "Engineering",
    items: ["System design", "Performance tuning", "Secure coding", "LLM integrations"],
  },
] as const;

export const education = {
  degree: "B.Sc. Computer Systems Engineering",
  institution: "Palestine Technical College",
  year: "2020",
  gpa: "80.4",
} as const;

export const certifications = [
  { name: "Small Project Management", issuer: "USAID (U.S. Embassy supervision)", year: "2020" },
  { name: "Innovation in Government Work", issuer: "MBRCGI" },
  { name: "Search Engine Optimization (SEO)", issuer: "Google" },
  { name: "Cybersecurity Fundamentals", issuer: "Edraak" },
  { name: "Introduction to Cybersecurity", issuer: "Edraak" },
  { name: "Introduction to Networks", issuer: "Edraak" },
  { name: "System Protection from Hacking", issuer: "Edraak" },
] as const;

export const languages = [
  { name: "Arabic", level: "Native" },
  { name: "English", level: "Professional working" },
] as const;

export const nav = [
  { label: "BrightGaza", href: "#brightgaza" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
] as const;
