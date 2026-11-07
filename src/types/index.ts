export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  github?: string;
  linkedin?: string;
  bio: string;
  resumeUrl?: string;
  /** Shown in the hero pill and used by the chat assistant. */
  availability?: { open: boolean; text: string };
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: "backend" | "fullstack" | "frontend" | "other";
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  /** Built-in placeholder artwork (follows the palette) used when there is no imageUrl. */
  art?: "flight" | "video" | "trend" | "health";
  /** Card tilt in degrees (e.g. -1.5). Optional. */
  rotation?: number;
  /** Colored-pencil accent 1-4 (yellow, coral, mint, sky) for the card shadow and tape. */
  accent?: 1 | 2 | 3 | 4;
  highlights: string[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string | "Present";
  description: string[];
  technologies: string[];
}

export interface Skill {
  name: string;
  category: "backend" | "frontend" | "database" | "tools" | "other";
  proficiency?: "expert" | "advanced" | "intermediate";
}

export type SkillLayerIcon = "code" | "server" | "database" | "wrench";

export interface SkillLayerConfig {
  id: string;
  title: string;
  subtitle: string;
  category: Skill["category"];
  icon: SkillLayerIcon;
  emphasized?: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  description?: string[];
}

