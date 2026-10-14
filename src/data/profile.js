// Who this portfolio is about. Source: Mani_Poorna_Resume.pdf.
// Empty strings mean "not on the resume"; the UI hides anything that is empty.
export const PROFILE = {
  name: 'Mani Poorna Rao Amalapuram',
  display: ['Mani', 'Poorna'],
  initials: 'MP',
  role: 'Full Stack Developer',
  city: 'Bengaluru, India',
  email: 'ndmprao2001@gmail.com',
  linkedin: 'https://www.linkedin.com/in/mani-poorna-801365236/',
  github: 'https://github.com/ManiPoorna',
  resume: `${import.meta.env.BASE_URL}Mani_Poorna_Resume.pdf`, // note: the PDF itself lists a phone number
  photo: `${import.meta.env.BASE_URL}profile.jpg`, // drop a portrait at /public/profile.jpg
}

export const CONTACT_LINKS = [
  [PROFILE.email, `mailto:${PROFILE.email}`],
  ['LinkedIn', PROFILE.linkedin],
  ['Résumé', PROFILE.resume],
  ['GitHub', PROFILE.github],
].filter(([, href]) => href)
