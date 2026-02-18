export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  github?: string;
  linkedin?: string;
  bio: string;
  resumeUrl?: string;
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

