// The three projects. Schneider Electric and B2B Talent Hub are written from the descriptions supplied for them;
// Talus Pay has none yet, so its text is a placeholder until its details are added.
// `layers` entries are [name, one-line summary, tags]. Add `links: { live, repo }` and `shots: [{ src, alt, caption }]`
// to a project and the buttons and a Screens section appear. The earlier POS / Audit / Insight entries are in git history.
export const PROJECTS = [
  {
    id: 'talus-pay',
    accent: ['#1a8f5a', '#7be0b0'],
    dwg: 'PROJECT 01',
    name: 'TALUS PAY',
    role: 'Payments product',
    blurb: 'Details for this project are still to be added.',
    stack: ['To be added'],
    layers: [
      ['Experience', 'The screens people use. Details to be added.', ['To be added']],
      ['Payments', 'How a payment moves. Details to be added.', ['To be added']],
      ['Security', 'How it is protected. Details to be added.', ['To be added']],
      ['Records', 'What is kept and shown. Details to be added.', ['To be added']],
    ],
    meta: [
      ['Type', 'Payments product'],
      ['Role', 'To be added'],
      ['Stack', 'To be added'],
      ['Focus', 'To be added'],
    ],
    challenge: 'The problem this project solved will be described here.',
    approach: ['How it was approached: to be added.', 'The decisions that shaped it: to be added.', 'What was built and shipped: to be added.'],
    outcomes: [
      ['—', 'result to be added'],
      ['—', 'result to be added'],
      ['—', 'result to be added'],
    ],
  },
  {
    id: 'schneider-electric',
    accent: ['#b86e00', '#ffcf6b'],
    dwg: 'PROJECT 02',
    name: 'SCHNEIDER ELECTRIC',
    role: 'Device configuration and monitoring',
    blurb: 'Responsive, user-friendly interfaces for configuring and monitoring devices, built to make complex hardware simple to operate.',
    stack: ['Responsive UI', 'Device configuration', 'Monitoring'],
    layers: [
      ['Configuration & monitoring', 'Responsive, user-friendly interfaces for device configuration and monitoring, improving usability and operational efficiency.', ['Responsive UI', 'Usability']],
      ['Hardware interaction', 'Complex hardware interactions simplified through structured layouts, intuitive controls and real-time feedback patterns.', ['Structured layouts', 'Intuitive controls', 'Real-time feedback']],
      ['Product workflows', 'Complex product functionality translated into intuitive interface solutions that support efficiency, usability and workflow optimisation.', ['Workflow optimisation']],
    ],
    meta: [
      ['Client', 'Schneider Electric'],
      ['Type', 'Device configuration and monitoring'],
      ['Focus', 'Usability and operational efficiency'],
      ['Patterns', 'Structured layouts, real-time feedback'],
    ],
    challenge: 'Configuring and monitoring devices means dealing with complex hardware interactions. The interface had to make them simple to operate while still showing what the device is doing.',
    approach: [
      'Design responsive, user-friendly interfaces for device configuration and monitoring, so the work is as easy on one screen size as another.',
      'Simplify the hardware interaction with structured layouts, intuitive controls and real-time feedback patterns.',
      'Translate the product’s complex functionality into interface solutions that support efficiency, usability and workflow optimisation.',
    ],
    outcomes: [
      ['Usability', 'improved for configuration and monitoring'],
      ['Efficiency', 'operational efficiency supported'],
      ['Real-time', 'feedback patterns for hardware interaction'],
    ],
  },
  {
    id: 'b2b-talent-hub',
    accent: ['#6d4ad6', '#c3b0ff'],
    dwg: 'PROJECT 03',
    name: 'B2B TALENT HUB',
    role: 'Hiring and talent platform',
    blurb: 'Workflow-driven interfaces for job discovery, applicant tracking and profile management, built for speed and seamless user journeys.',
    stack: ['Job discovery', 'Applicant tracking', 'Profile management'],
    layers: [
      ['Job discovery & search', 'User-friendly experiences for search, filtering and role matching, improving discoverability and task efficiency.', ['Search', 'Filtering', 'Role matching']],
      ['Applicant tracking', 'Intuitive, workflow-driven interfaces for tracking applicants, focused on usability and speed.', ['Workflow-driven', 'Usability', 'Speed']],
      ['Profile management', 'Seamless user journeys for managing profiles.', ['User journeys']],
      ['Hiring workflows', 'Complex hiring workflows translated into scalable digital experiences.', ['Scalable']],
    ],
    meta: [
      ['Type', 'Hiring and talent platform'],
      ['Audience', 'B2B'],
      ['Focus', 'Usability, speed, seamless journeys'],
      ['Areas', 'Discovery, tracking, profiles'],
    ],
    challenge: 'Hiring involves many steps and many people. The platform had to turn complex hiring workflows into experiences that stay clear and fast as they scale.',
    approach: [
      'Design intuitive, workflow-driven interfaces for job discovery, applicant tracking and profile management, focused on usability, speed and seamless user journeys.',
      'Create user-friendly experiences for search, filtering and role matching, improving discoverability and task efficiency.',
      'Translate complex hiring workflows into scalable digital experiences.',
    ],
    outcomes: [
      ['Discoverability', 'improved through search, filtering and role matching'],
      ['Efficiency', 'in everyday hiring tasks'],
      ['Scalable', 'digital experiences for complex workflows'],
    ],
  },
]

// Each project has its own accent colour [for paper, for blueprint].
export const accentStyle = (p) => ({ '--ac-l': p.accent[0], '--ac-d': p.accent[1] })

export const findProject = (id) => PROJECTS.find((p) => p.id === id)
