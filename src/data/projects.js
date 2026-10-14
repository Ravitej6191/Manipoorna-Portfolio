// Projects 01 and 02 are real, written from Mani_Poorna_Resume.pdf. Project 03 is SAMPLE content (`sample: true`):
// replace it with a real project, or delete it. Samples are labelled as such on the page. `layers` entries are
// [name, one-line summary, tags]. Add `links: { live, repo }` to a project and the buttons appear.
export const PROJECTS = [
  {
    id: 'pos',
    accent: ['#b86e00', '#ffcf6b'],
    dwg: 'PROJECT 01',
    name: 'POS',
    role: 'Enterprise POS platform',
    blurb:
      'A multi-tenant point-of-sale SaaS. Businesses onboard themselves, staff ring up orders, and every cart stays in sync in real time.',
    stack: ['React.js', 'Spring Boot', 'REST APIs'],
    layers: [
      ['Client', 'A React.js interface for Admin and Staff, with the cart synchronised in real time.', ['React.js', 'Real-time sync']],
      ['API & access', 'RESTful APIs with secure authentication and role-based access control.', ['Spring Boot', 'REST APIs', 'RBAC']],
      ['Commerce engines', 'Dynamic pricing, tax and discount engines behind every total.', ['Pricing', 'Tax', 'Discounts']],
      ['Tenant data & ops', 'Billing, payments, inventory and reporting, isolated per tenant and audit-logged.', ['Multi-tenancy', 'Caching', 'Audit logging']],
    ],
    meta: [
      ['Type', 'Multi-tenant SaaS'],
      ['Role', 'Full-stack development'],
      ['Stack', 'React.js, Spring Boot'],
      ['Focus', 'Real-time cart sync'],
    ],
    challenge:
      'A point-of-sale platform serves many businesses at once. Each has to stay completely separate from the others, while staff ring up orders quickly and every price, tax and discount comes out right.',
    approach: [
      'Build multi-tenancy in from the start: tenant onboarding, secure authentication and Admin and Staff roles, with data isolated across tenants.',
      'Keep the cart in sync in real time, with dynamic pricing, tax and discount engines computing every total.',
      'Back it with billing, payments, inventory and reporting services over RESTful APIs, with caching for performance and audit logging for traceability.',
    ],
    outcomes: [
      ['RBAC', 'Admin and Staff roles'],
      ['Live', 'real-time cart synchronisation'],
      ['Audit', 'logging across billing and inventory'],
    ],
  },
  {
    id: 'audit',
    accent: ['#0e8a7a', '#6fe3d0'],
    dwg: 'PROJECT 02',
    name: 'AUDIT',
    role: 'Asset tracking & audit management system',
    blurb:
      'Super admins onboard tenants, teams load their assets in bulk, and every asset is verified by QR code from first scan to completed audit.',
    stack: ['React.js', 'Spring Boot', 'Spring Security', 'PostgreSQL'],
    layers: [
      ['Admin console', 'Super admins onboard tenants and manage their teams.', ['React.js']],
      ['Security', 'Spring Security protecting every tenant and role.', ['Spring Security']],
      ['Bulk ingestion', 'Asset uploads from CSV or Excel, with validation workflows before anything is saved.', ['CSV', 'Excel', 'Validation']],
      ['Audit & data', 'QR code generation and scanning, real-time verification and status tracking, persisted in PostgreSQL.', ['QR codes', 'PostgreSQL', 'Spring Boot']],
    ],
    meta: [
      ['Type', 'Multi-tenant SaaS'],
      ['Role', 'Full-stack development'],
      ['Stack', 'React.js, Spring Boot, PostgreSQL'],
      ['Focus', 'Audit workflow'],
    ],
    challenge:
      'Asset registers drift away from reality. Each tenant needed to load its assets in bulk, and then prove, asset by asset, that they are where the records say they are.',
    approach: [
      'Onboard tenants and teams through a super-admin console, so every organisation starts isolated and self-contained.',
      'Ingest assets in bulk from CSV or Excel, validating the data before it is persisted.',
      'Audit with QR codes: generate one per asset, scan it to verify in real time, and track status through to audit completion.',
    ],
    outcomes: [
      ['QR', 'asset-level verification'],
      ['Bulk', 'CSV and Excel ingestion'],
      ['Live', 'status tracking through audit completion'],
    ],
  },
  {
    id: 'insight',
    accent: ['#6d4ad6', '#c3b0ff'],
    sample: true,
    dwg: 'PROJECT 03',
    name: 'INSIGHT',
    role: 'Operations analytics dashboard',
    blurb:
      'A sample project: a live dashboard that turns a tenant’s billing, inventory and audit data into charts a manager can read at a glance.',
    stack: ['React.js', 'Redux', 'Spring Boot', 'PostgreSQL'],
    layers: [
      ['Dashboard', 'A React.js and Redux interface with filters, charts and saved views.', ['React.js', 'Redux']],
      ['Reporting API', 'Spring Boot endpoints that aggregate and page large result sets.', ['Spring Boot', 'REST APIs']],
      ['Access control', 'Role-based views, so each role sees only its own tenant’s numbers.', ['Spring Security', 'RBAC']],
      ['Data', 'PostgreSQL views and indexes tuned for reporting queries.', ['PostgreSQL', 'SQL']],
    ],
    meta: [
      ['Type', 'Sample project'],
      ['Role', 'Full-stack development'],
      ['Stack', 'React.js, Redux, Spring Boot, PostgreSQL'],
      ['Focus', 'Reporting performance'],
    ],
    challenge: 'Managers wanted answers, not spreadsheets. The dashboard had to stay fast on large tenants while keeping each tenant’s data strictly separate.',
    approach: [
      'Aggregate in the database, not the browser, and page every large result.',
      'Split the interface with lazy loading and code splitting, so the first screen loads quickly.',
      'Scope every query by tenant and role, and test those rules first.',
    ],
    outcomes: [
      ['Fast', 'first load with code splitting'],
      ['Scoped', 'every query by tenant and role'],
      ['Clear', 'charts a manager can read at a glance'],
    ],
  },
]

// Each project has its own accent colour [for paper, for blueprint].
export const accentStyle = (p) => ({ '--ac-l': p.accent[0], '--ac-d': p.accent[1] })

export const findProject = (id) => PROJECTS.find((p) => p.id === id)
