/**
 * Site-wide constants and static content
 * Consolidated in src/constants for industry standards
 */

// ===========================================
// CASE STUDIES
// ===========================================
export const caseStudies = [
    {
        id: 1,
        projectName: 'RenewRx',
        launchYear: '2024',
        subtitle: 'Healthcare • Design System',
        title: 'Dev-Ready Design System with Figma MCP',
        description: 'Remote Maternal Management for diabetic patients',
        images: ['/renewrx/renewrx-reel.json'],
        // Extended fields for modal
        platform: 'iOS & Android',
        industry: 'Healthcare',
        role: 'Product Lifecycle Management, UX Design, UI Design, Design System, Figma MCP',
    },
    {
        id: 2,
        projectName: 'Quizy',
        launchYear: '2023',
        subtitle: 'Gaming • User Retention',
        title: 'Increased user retention rate using hook modal',
        description: 'Real money based informative gaming app',
        images: ['/quizy/Showreel-Quizy.json'],
        platform: 'Web & Mobile',
        industry: 'Gaming',
        role: 'Product Strategy, UX Design, UI Design,Micro Interactions',
    },
    {
        id: 3,
        projectName: 'Algobulls',
        launchYear: '2022',
        subtitle: 'Fintech • Revamp',
        title: 'The Revamp that raised 2 Million USD',
        description: 'Algorithmic trading platform for retail investors',
        images: ['/algobulls/algobulls-showreel.json'],
        platform: 'Web Application',
        industry: 'FinTech',
        role: 'Product Design, UX Design, Responsive UI',
    },
];

// ===========================================
// SITE CONFIG
// ===========================================
export const siteConfig = {
    name: 'Surjith',
    title: 'Surjith - Product Designer',
    description: 'Portfolio of Surjith, a Product Designer specializing in UX/UI design.',
    url: 'https://surjith.design',
    email: 'mwsurjith51@gmail.com',
    social: {
        linkedin: 'https://www.linkedin.com/in/surjith',
        twitter: 'https://twitter.com/surjith',
        dribbble: 'https://dribbble.com/surjith',
    },
};

// ===========================================
// NAVIGATION
// ===========================================
export const navigation = {
    main: [
        { name: 'Home', href: '/' },
        { name: 'Portfolio', href: '/portfolio' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ],
};

// ===========================================
// MICRO APPS
// ===========================================
export const microApps = [
    {
        id: 1,
        name: 'Tic-Tac-Toe',
        logo: '/microapps/tic-tac-toe.png',
        href: '/microapps/tic-tac-toe',
        bgColor: 'bg-zinc-800',
    },
    {
        id: 2,
        name: 'Micro Task',
        logo: '/microapps/microtask.png',
        href: '/microapps/micro-task',
        bgColor: 'bg-zinc-800',
    },
    {
        id: 3,
        name: 'Timezone',
        logo: '/microapps/timezone.png',
        href: '/microapps/timezone',
        bgColor: 'bg-zinc-800',
    },
    {
        id: 4,
        name: 'Heuristic Checklist',
        logo: '/microapps/heuristics.png',
        href: '/microapps/heuristic-checklist',
        bgColor: 'bg-zinc-800',
    },
    {
        id: 5,
        name: 'Market Status',
        logo: '/microapps/market.png',
        href: '/microapps/market-status',
        bgColor: 'bg-zinc-800',
    },
    {
        id: 6,
        name: 'Mockup Generator',
        logo: '/microapps/mockup.png',
        href: '/microapps/mockup',
        bgColor: 'bg-zinc-800',
    }
];
