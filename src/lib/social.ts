/** Public Trovara social profiles (marketing site). */
export const SOCIAL_LINKS = [
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/trovarafarm',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/trovara_farm/',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    href: 'https://www.tiktok.com/@trovarafarm',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/trovarafarm/',
  },
] as const

export const SOCIAL_SAME_AS = SOCIAL_LINKS.map((link) => link.href)
