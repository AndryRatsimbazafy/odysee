import { routing } from "@/i18n/routing";
import { getProfile } from "@/lib/data/profile";
import { getProjectRows } from "@/lib/data/projects";

/** The home changes with the profile or any published project. */
export async function homeLastModified(): Promise<string | undefined> {
  const [profile, projects] = await Promise.all([
    getProfile(routing.defaultLocale),
    getProjectRows(),
  ]);
  return [profile?.updatedAt, ...projects.map((p) => p.updated_at)]
    .filter((d) => d !== undefined)
    .sort()
    .at(-1);
}
