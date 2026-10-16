// Cache tags shared by the cached reads (cacheTag) and the admin Server Actions
// (updateTag). One tag per editable area of the admin.
export const TAGS = {
  profile: "profile",
  projects: "projects",
  technologies: "technologies",
  skills: "skills",
  experiences: "experiences",
  faq: "faq",
  testimonials: "testimonials",
  resumes: "resumes",
} as const;

export type CacheTag = (typeof TAGS)[keyof typeof TAGS];
