// Single source of truth for site content. Edit here to update the site.

export const profile = {
  name: "Ghassan Ahmed",
  shortName: "Ghassan",
  role: "Senior Full-Stack Laravel Engineer",
  tagline:
    "5+ years architecting backend systems for government, human-rights, and tech-enabled-talent platforms across Palestine and the Gulf.",
  heroLine:
    "Senior backend engineer shipping national-scale platforms — Laravel, MySQL, RBAC, real-time pipelines. Currently leading backend at TAQAT.",
  location: "Jabalya, Gaza, Palestine",
  availability: "Available for remote engagements",
  email: "gssan1018@gmail.com",
  phone: "+970 56 771 1720",
  linkedin: "https://linkedin.com/in/ghassan-ahmed-272390254",
  github: "",
  resumeUrl: "/Ghassan_Ahmed_CV.pdf",
} as const;

export const stats = [
  { value: "5+", label: "Years shipping production" },
  { value: "10+", label: "National & gov platforms" },
  { value: "2", label: "Languages delivered (AR/EN)" },
] as const;

export const currentWork = [
  {
    name: "PalAI.network",
    href: "https://palai.network",
    role: "Backend Lead",
    note: "Talent-verification platform connecting Palestinian AI engineers with global employers.",
  },
  {
    name: "ArabTalents",
    href: "https://arabtalents.org",
    role: "Core Backend",
    note: "Bilingual freelance marketplace — gig lifecycle, bidding, role-based dashboards.",
  },
  {
    name: "TAQAT Platforms",
    href: "#",
    role: "Senior Engineer",
    note: "Government, civic-tech, and BrightGaza flagship products for thousands of daily users.",
  },
] as const;

export const experience = [
  {
    company: "TAQAT Palestine Business Incubator",
    role: "Senior Full-Stack Laravel Engineer",
    period: "Jan 2023 — Present",
    location: "Gaza, Palestine",
    bullets: [
      "Lead backend engineer on production platforms across government, civic-tech, and BrightGaza flagship products — including PalAI.network and ArabTalents.org.",
      "Architected Laravel + MySQL systems with role-based access control, RESTful APIs, and analytics dashboards serving thousands of daily users in Arabic (RTL) and English.",
      "Built CMS and admin platforms for the Palestinian Ministry of Agriculture and Saudi Arabia's Human Rights Commission — employee management, warehouse tracking, reporting.",
      "Owned secure authentication, API design, and integration workflows across multi-tenant deployments.",
    ],
  },
  {
    company: "Danat Company",
    role: "Freelance Software Developer",
    period: "Apr 2022 — May 2024",
    location: "Contract / Part-time",
    bullets: [
      "Designed and shipped a real-time lead-prioritization pipeline using WebSocket, reducing sales-team response latency on hot leads.",
      "Built five product landing pages end-to-end: wireframes, mockups, and responsive Laravel + JavaScript implementations.",
      "Integrated RESTful APIs across internal applications and tuned system performance for backend-heavy workloads.",
    ],
  },
  {
    company: "Shift Company",
    role: "Software Developer",
    period: "Nov 2020 — Feb 2022",
    location: "Gaza, Palestine",
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
      "Backend engineering on the certification and talent-verification platform connecting Palestinian AI engineers with global employers. Profile validation flows, certification pipelines, and admin tooling for talent discovery.",
    tech: ["Laravel", "MySQL", "REST APIs", "RBAC"],
    href: "https://palai.network",
    status: "Live",
  },
  {
    name: "ArabTalents",
    tagline: "Regional Freelance Marketplace",
    description:
      "Core backend modules for a bilingual (Arabic/English) freelance platform: gig lifecycle, bidding, role-based dashboards for clients, freelancers, and admins, moderation tooling, and reporting.",
    tech: ["Laravel", "MySQL", "Blade", "REST APIs", "RTL/i18n"],
    href: "https://arabtalents.org",
    status: "Live",
  },
  {
    name: "Palestinian Central Bureau of Statistics",
    tagline: "National Statistics Portal",
    description:
      "Contributed backend modules and dashboards for Palestine's national statistics portal — content management, bilingual data publication workflows, and Arabic (RTL) and English ready interfaces.",
    tech: ["Laravel", "MySQL", "CMS", "Bilingual / RTL"],
    href: "https://pcbs.gov.ps",
    status: "Government",
  },
  {
    name: "Agricultural Risk Mitigation Fund",
    tagline: "Palestinian Ministry of Agriculture",
    description:
      "Full CMS for employee management, warehouse tracking, attendance, and reporting. Role-based access control and advanced analytics dashboards for ministry operations.",
    tech: ["Laravel", "MySQL", "RBAC", "Analytics"],
    href: "https://padrrif.moa.pna.ps",
    status: "Government",
  },
  {
    name: "Human Rights Commission, Saudi Arabia",
    tagline: "E-Services Portal",
    description:
      "Built RESTful APIs, frontend layouts (HTML/CSS/JavaScript), and maintained the secure Laravel backend for the e-services portal serving Saudi Arabia's Human Rights Commission.",
    tech: ["Laravel", "REST APIs", "Secure Auth", "Frontend"],
    href: "https://e-services.hrc.gov.sa",
    status: "Government",
  },
  {
    name: "Euro-Mediterranean Human Rights Monitor",
    tagline: "Dashboards & Reporting",
    description:
      "Dynamic dashboards and reporting systems with Laravel backend integration for one of the region's most-cited human-rights organizations.",
    tech: ["Laravel", "Dashboards", "Reporting"],
    href: "https://euromedmonitor.org",
    status: "Live",
  },
  {
    name: "Palestinian Bar Association",
    tagline: "Legal Trainee Platform",
    description:
      "Responsive web pages and backend modules for legal trainees using Laravel and Material UI.",
    tech: ["Laravel", "Material UI", "Responsive"],
    href: "https://palestinebar.ps",
    status: "Live",
  },
  {
    name: "Al Fowzan & Mioon Fashion",
    tagline: "E-commerce Platforms",
    description:
      "Two end-to-end e-commerce platforms: product/order/customer admin, secure checkout, and Blade-driven responsive storefronts.",
    tech: ["Laravel", "MySQL", "Blade", "Payments"],
    href: "https://alfowzan.com",
    status: "Live",
  },
] as const;

export const skills = {
  Backend: [
    "Laravel",
    "PHP",
    "MySQL",
    "RESTful APIs",
    "MVC",
    "WebSocket",
    "Authentication",
    "RBAC",
    "CMS Development",
  ],
  Frontend: [
    "JavaScript",
    "jQuery",
    "Blade",
    "HTML5",
    "CSS3",
    "Bootstrap",
    "Material UI",
    "Responsive Design",
  ],
  "Tools & Workflow": [
    "Git",
    "GitHub",
    "Postman",
    "Linux",
    "Deployment",
    "Code Review",
    "Agile",
  ],
  Practices: [
    "System Architecture",
    "API Design",
    "Performance Tuning",
    "Secure Coding",
    "Bilingual / RTL Delivery",
  ],
} as const;

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
  { name: "English", level: "Professional Working" },
] as const;

export const nav = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#work" },
  { label: "Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
] as const;
