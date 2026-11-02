// Résumé content, written for applicant-tracking systems (ATS):
// standard section names, keyword-rich skills, action-verb bullets with
// numbers, plain punctuation. Rendered at /cv and printed to
// public/Ghassan_Ahmed_CV.pdf (see README → "Regenerate the CV PDF").

import { profile, yearsShipping } from "./data";

export const cv = {
  name: profile.name,
  headline: "Senior Full-Stack Software Engineer",
  contact: [
    { label: "Gaza, Palestine (Remote)" },
    { label: profile.email, href: `mailto:${profile.email}` },
    { label: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
    { label: "linkedin.com/in/ghassan-ahmed-272390254", href: profile.linkedin },
    { label: "ghassan-ahmed.vercel.app", href: "https://ghassan-ahmed.vercel.app" },
  ],

  summary: `Senior full-stack software engineer with ${yearsShipping}+ years of experience designing, building, and shipping production web platforms end to end. Lead engineer on BrightGaza, a bilingual freelance marketplace with 12,500+ members, 3,200+ delivered projects, and $480K+ in secure payments. Built Qareeb, a delivery platform for Palestine, from zero as a Next.js progressive web app. Delivered national-scale systems for the Palestinian Central Bureau of Statistics, the Palestinian Ministry of Agriculture, and Saudi Arabia's Human Rights Commission. Strong in system design, REST API design, authentication and RBAC, real-time features, performance optimization, and Arabic/English (RTL) delivery.`,

  skills: [
    { group: "Languages", items: "TypeScript, JavaScript (ES6+), PHP, SQL, HTML5, CSS3" },
    {
      group: "Frontend",
      items:
        "React, Next.js, Tailwind CSS, Progressive Web Apps (PWA), Responsive Design, Internationalization (i18n) and RTL, Material UI, Bootstrap",
    },
    {
      group: "Backend",
      items:
        "Node.js, Laravel, RESTful API Design, WebSockets, Authentication and Authorization, Role-Based Access Control (RBAC), MVC, CMS Development",
    },
    { group: "Databases", items: "MySQL, Relational Data Modeling, Schema Design" },
    { group: "Cloud and Tools", items: "Git, GitHub, Vercel, Linux, Deployment Pipelines, Postman" },
    {
      group: "Practices",
      items:
        "System Architecture, Multi-Tenant Systems, Performance Optimization, Secure Coding, Code Review, Agile, LLM Integration",
    },
  ],

  experience: [
    {
      role: "Senior Software Engineer",
      company: "TAQAT Palestine Business Incubator",
      location: "Gaza, Palestine",
      period: "Jan 2023 – Present",
      bullets: [
        "Lead engineer on BrightGaza (brightgaza.com), a bilingual freelance marketplace connecting global clients with vetted Palestinian talent; the platform serves 12,500+ members with 3,200+ projects delivered and $480K+ in secure payments.",
        "Engineered core marketplace workflows: job and service listings, proposals, contracts, secure payments and billing, ratings and reviews, and role-based dashboards for clients, freelancers, and administrators.",
        "Architected backend systems with MySQL, RESTful APIs, and role-based access control, plus analytics dashboards serving thousands of daily users in Arabic (RTL) and English across PalAI.network and ArabTalents.org.",
        "Built CMS and admin platforms for the Palestinian Ministry of Agriculture and Saudi Arabia's Human Rights Commission, covering employee management, warehouse tracking, attendance, and reporting.",
        "Owned authentication, API design, and third-party integrations across multi-tenant deployments; partnered with design and product teams from scoping through release.",
      ],
    },
    {
      role: "Software Engineer (Freelance)",
      company: "Danat Company",
      location: "Remote, Contract",
      period: "Apr 2022 – May 2024",
      bullets: [
        "Designed and shipped a real-time lead-prioritization pipeline using WebSockets, cutting sales-team response time on high-intent leads.",
        "Delivered five product landing pages end to end, from wireframes and mockups to responsive JavaScript implementations.",
        "Integrated RESTful APIs across internal applications and improved performance of backend-heavy workloads.",
      ],
    },
    {
      role: "Software Developer",
      company: "Shift Company",
      location: "Gaza, Palestine",
      period: "Nov 2020 – Feb 2022",
      bullets: [
        "Improved site performance and user experience by approximately 83% in collaboration with the design team.",
        "Streamlined website planning and research workflows, saving the team an estimated 400+ working hours.",
        "Maintained QA checklists across design and project management to keep delivery quality consistent.",
      ],
    },
  ],

  projects: [
    {
      name: "Qareeb",
      kind: "Delivery Platform",
      url: "qareeb.ps",
      text: "Designed and built from zero: customer ordering flow, phone-number OTP sign-in, and an operations dashboard. Arabic-first, fully bilingual, installable progressive web app.",
      stack: "Next.js, React, PWA, Vercel",
    },
    {
      name: "PalAI.network",
      kind: "AI Talent Verification Platform",
      url: "palai.network",
      text: "Backend lead for the certification and talent-verification platform connecting Palestinian AI engineers with global employers: profile validation, certification pipelines, and admin tooling.",
      stack: "PHP, MySQL, REST APIs, RBAC",
    },
    {
      name: "ArabTalents",
      kind: "Bilingual Freelance Marketplace",
      url: "arabtalents.org",
      text: "Core modules for gig lifecycle, bidding, role-based dashboards for clients, freelancers, and admins, moderation tooling, and reporting.",
      stack: "PHP, MySQL, REST APIs, i18n/RTL",
    },
    {
      name: "Palestinian Central Bureau of Statistics",
      kind: "National Statistics Portal",
      url: "pcbs.gov.ps",
      text: "Backend modules and dashboards for content management and bilingual data-publication workflows.",
      stack: "PHP, MySQL, CMS, i18n/RTL",
    },
    {
      name: "Agricultural Risk Mitigation Fund",
      kind: "Palestinian Ministry of Agriculture",
      url: "padrrif.moa.pna.ps",
      text: "Full CMS for employee management, warehouse tracking, attendance, and reporting, with RBAC and analytics dashboards.",
      stack: "PHP, MySQL, RBAC, Analytics",
    },
    {
      name: "Human Rights Commission, Saudi Arabia",
      kind: "E-Services Portal",
      url: "e-services.hrc.gov.sa",
      text: "RESTful APIs, front-end layouts, and the secure backend for the commission's e-services portal.",
      stack: "PHP, REST APIs, Secure Authentication, JavaScript",
    },
  ],

  additionalProjects:
    "Euro-Mediterranean Human Rights Monitor (dashboards and reporting), Palestinian Bar Association (legal-trainee platform), Al Fowzan and Mioon Fashion (two e-commerce platforms with secure checkout).",

  education: {
    degree: "B.Sc. in Computer Systems Engineering",
    institution: "Palestine Technical College",
    year: "2020",
    note: "GPA: 80.4",
  },

  certifications: [
    "Small Project Management, USAID (U.S. Embassy supervision), 2020",
    "Innovation in Government Work, Mohammed Bin Rashid Centre for Government Innovation (MBRCGI)",
    "Search Engine Optimization (SEO), Google",
    "Cybersecurity Fundamentals; Introduction to Cybersecurity; Introduction to Networks; System Protection from Hacking, Edraak",
  ],

  languages: "Arabic (Native), English (Professional Working Proficiency)",
} as const;
