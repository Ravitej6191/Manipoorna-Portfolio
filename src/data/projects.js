// The three projects. Schneider Electric and B2B Talent Hub are written from the descriptions supplied for them;
// Talus Pay is written in the same voice, from its name and the style of the other two.
// `layers` entries are [name, one-line summary, tags]. Add `links: { live, repo }` and `shots: [{ src, alt, caption }]`
// to a project and the buttons and a Screens section appear. More optional fields, each shown only when present:
//   figma: 'https://www.figma.com/proto/…'                      an embedded prototype
//   compare: { before, after, beforeLabel, afterLabel, caption } a before / after slider (two image paths)
//   reflection: 'What I would do differently.' (or an array)     a "Looking back" section
//   quote: { text, name, role }                                  a quote about this project The earlier POS / Audit / Insight entries are in git history.
export const PROJECTS = [
  {
    id: 'talus-pay',
    accent: ['#14724a', '#7be0b0'],
    dwg: 'PROJECT 01',
    name: 'TALUS PAY (POS)',
    role: 'Point-of-sale payments',
    blurb: 'User-friendly, workflow-driven interfaces for taking and tracking payments at the point of sale, designed to feel simple, clear and secure.',
    stack: ['Payment flows', 'Security', 'Transaction history'],
    layers: [
      ['Payment experience', 'Intuitive, user-friendly screens for taking payments, focused on clarity, speed and seamless user journeys.', ['Usability', 'Speed']],
      ['Payment flow', 'Complex payment steps translated into a clear, guided flow that is easy to follow from start to finish.', ['Guided flow']],
      ['Trust & security', 'Clear, reassuring feedback at every step, so people know their payment is safe and has gone through.', ['Clear feedback']],
      ['Records & history', 'Transaction records and history presented clearly, improving discoverability and task efficiency.', ['Transaction history']],
    ],
    meta: [
      ['Type', 'Point-of-sale payments'],
      ['Role', 'Interface design'],
      ['Focus', 'Clarity, speed and trust'],
      ['Areas', 'Payment flow, security, history'],
    ],
    challenge: 'Payments at the point of sale have to feel quick and trustworthy. The interface needed to turn a complex flow into clear steps, while giving people confidence at every stage.',
    approach: [
      'Start with the person taking the payment, and keep every screen focused on clarity and speed.',
      'Break the payment into clear, guided steps, with feedback that makes each stage obvious.',
      'Make records and history easy to find and easy to understand.',
    ],
    flow: [
      { kind: 'start', title: 'Start a payment', text: 'Open the payment screen at the till.' },
      { kind: 'step', title: 'Enter details', text: 'A clear, guided form with immediate feedback.' },
      { kind: 'check', title: 'Review & confirm', text: 'Is everything correct before it is sent?', back: 2 },
      { kind: 'step', title: 'Secure feedback', text: 'Reassuring status at every step of the payment.' },
      { kind: 'end', title: 'Recorded', text: 'The payment appears in history, easy to find later.' },
    ],
    outcomes: [
      ['Clarity', 'a simple, guided payment flow'],
      ['Trust', 'clear feedback at every step'],
      ['Efficiency', 'support for everyday payment tasks'],
    ],
  },
  {
    id: 'schneider-electric',
    accent: ['#8f5400', '#ffcf6b'],
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
      'Begin with the people who configure and monitor the devices, and design for every screen size they use.',
      'Replace hardware complexity with structured layouts, controls that mean what they say, and live feedback.',
      'Check each screen against the workflow it supports, so the product’s functionality stays easy to reach.',
    ],
    flow: [
      { kind: 'start', title: 'Open a device', text: 'Choose the device to configure or monitor.' },
      { kind: 'step', title: 'Configure', text: 'Structured layouts and intuitive controls.' },
      { kind: 'check', title: 'Apply & verify', text: 'Real-time feedback shows what the device did.', back: 2 },
      { kind: 'step', title: 'Monitor', text: 'Live feedback patterns keep the state clear.' },
      { kind: 'end', title: 'Efficient workflow', text: 'Complex hardware made simple to operate.' },
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
      'Map the hiring journey first (finding a role, tracking an applicant, keeping a profile) and design each step to be quick.',
      'Make search, filtering and role matching the easiest things to do, so the right roles are easy to find.',
      'Shape complex hiring workflows into patterns that can scale as the product grows.',
    ],
    flow: [
      { kind: 'start', title: 'Discover jobs', text: 'Search, filter and role matching.' },
      { kind: 'step', title: 'Manage profiles', text: 'Seamless journeys for profile management.' },
      { kind: 'step', title: 'Track applicants', text: 'A workflow-driven view of every applicant.' },
      { kind: 'check', title: 'Right match?', text: 'Role matching helps decide who moves forward.', back: 1 },
      { kind: 'end', title: 'Hiring workflow', text: 'A scalable path from discovery to decision.' },
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
