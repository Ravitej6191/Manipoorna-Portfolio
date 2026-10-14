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
  tools: [
    { group: 'AI assistants', items: ['ChatGPT', 'Claude', 'Gemini', 'Perplexity'] },
    { group: 'In the editor', items: ['GitHub Copilot', 'Cursor', 'JetBrains AI Assistant'] },
    { group: 'Everyday dev tools', items: ['VS Code', 'IntelliJ IDEA', 'Postman', 'Git and GitHub', 'Chrome DevTools', 'React DevTools'] },
  ],
}
