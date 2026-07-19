/** Public Trovara social profiles (marketing site). */
export const SOCIAL_LINKS = [
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61592210064140',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/trovara_farm/',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/trovarafarm/',
  },
] as const

export const SOCIAL_SAME_AS = SOCIAL_LINKS.map((link) => link.href)
