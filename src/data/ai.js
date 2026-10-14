// How AI fits into the work, and the tools involved. This is general-purpose wording: adjust the uses and the tool
// lists so they match what Mani actually does day to day.
export const AI = {
  intro: 'I use AI as a pair, not a pilot. It drafts, explains and double-checks; I decide, review and own what ships.',
  uses: [
    {
      icon: 'review',
      title: 'Code review',
      text: 'A second pair of eyes before the human review: it flags edge cases, unclear names, missing null checks and risky queries. I read every suggestion and keep only what holds up.',
      tools: ['GitHub Copilot', 'ChatGPT', 'Claude'],
    },
    {
      icon: 'bug',
      title: 'Debugging',
      text: 'Paste in a stack trace or a failing request and talk it through: likely causes, what to log, which test would prove it. It gets me to a hypothesis faster, and I confirm it in the code.',
      tools: ['ChatGPT', 'Claude', 'Chrome DevTools'],
    },
    {
      icon: 'tools',
      title: 'Dev tools',
      text: 'In the editor for boilerplate, tests, refactors and docs: React components, Spring controllers, SQL and regular expressions. Everything is read, run and tested before it stays.',
      tools: ['GitHub Copilot', 'Cursor', 'VS Code', 'IntelliJ IDEA'],
    },
    {
      icon: 'learn',
      title: 'Learning and research',
      text: 'Explaining unfamiliar code or a new library, comparing options, and turning documentation into a small working example.',
      tools: ['Perplexity', 'Gemini', 'Claude'],
    },
  ],
  // `logo` is a slug from src/data/logos.js, or the name of an SVG dropped in src/assets/logos/
  tools: [
    {
      group: 'AI assistants',
      items: [
        { name: 'ChatGPT', logo: 'chatgpt' },
        { name: 'Claude', logo: 'claude' },
        { name: 'Gemini', logo: 'gemini' },
        { name: 'Perplexity', logo: 'perplexity' },
      ],
    },
    {
      group: 'In the editor',
      items: [
        { name: 'GitHub Copilot', logo: 'githubcopilot' },
        { name: 'Cursor', logo: 'cursor' },
        { name: 'JetBrains AI Assistant', logo: 'jetbrains' },
      ],
    },
    {
      group: 'Everyday dev tools',
      items: [
        { name: 'VS Code', logo: 'vscode' },
        { name: 'IntelliJ IDEA', logo: 'intellijidea' },
        { name: 'Postman', logo: 'postman' },
        { name: 'Git', logo: 'git' },
        { name: 'GitHub', logo: 'github' },
        { name: 'Chrome DevTools', logo: 'chrome' },
        { name: 'React DevTools', logo: 'react' },
      ],
    },
  ],
}
