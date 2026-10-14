// Experience, education and skills. Source: Mani_Poorna_Resume.pdf.

// whole years since the current role began (April 2024), so the figure never goes stale
const YEARS = Math.floor((Date.now() - new Date('2024-04-01').getTime()) / (365.25 * 864e5))
export const ABOUT = {
  summary:
    'A full-stack developer specialising in Java: Spring Boot for the backend and React.js for the interface. Known for adaptability, attention to detail and inventive problem-solving, and for building scalable, high-performance web applications that line up with the business behind them.',
  facts: [
    ['Location', 'Bengaluru, India'],
    ['Experience', `${YEARS} years, full-stack`],
    ['Company', 'Elfonze Technologies'],
    ['Education', 'B.E., Ideal Institute of Technology'],
  ],
}

export const EXPERIENCE = [
  {
    role: 'Project Engineer',
    company: 'Elfonze Technologies',
    place: 'Bengaluru',
    period: 'Apr 2024 – present',
    points: [
      'Worked with cross-functional UI/UX teams and clients to deliver user-centric interfaces in React.js, improving the customer experience and lining solutions up with business objectives.',
      'Took an active part in Agile ceremonies and retrospectives, mentoring peers and strengthening team performance on Spring Boot applications in a continuous-integration environment.',
      'Optimised system architecture, including multi-port handling and scalable backend design with Spring Boot and PostgreSQL, aligned to long-term business goals.',
      'Built high-performance React.js and Redux frontends that integrate with Spring Boot REST APIs, using lazy loading and code splitting to reach Lighthouse scores of 95+.',
      'Implemented secure authentication and authorisation with Spring Security (JWT, RBAC) and presented the technical solutions to stakeholders.',
    ],
  },
]

export const EDUCATION = [
  {
    degree: 'Bachelor of Engineering',
    school: 'Ideal Institute of Technology',
    place: 'Kakinada, Andhra Pradesh, India',
    period: '2019 – 2023',
  },
]

export const SKILLS = [
  ['Languages', ['Java 8 / 11', 'JavaScript (ES6+)', 'SQL', 'HTML5', 'CSS3']],
  ['Backend', ['Spring Boot', 'Spring MVC', 'JPA / Hibernate', 'RESTful APIs', 'Spring Security (JWT, RBAC)']],
  ['Frontend', ['React.js', 'Redux', 'Tailwind', 'Bootstrap']],
  ['Data', ['PostgreSQL', 'MySQL']],
]
