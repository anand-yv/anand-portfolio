import { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "flight-booking",
    title: "Flight Booking System",
    description: "Full-stack flight booking platform with real-time seat selection and payment processing.",
    longDescription:
      "A comprehensive flight booking system built with Spring Boot backend and React frontend. Features include real-time seat availability, secure payment processing, booking management, and email notifications. The system handles concurrent bookings with optimistic locking and implements JWT-based authentication.",
    technologies: ["Spring Boot", "React", "PostgreSQL", "JWT", "REST API", "Docker"],
    category: "fullstack",
    highlights: [
      "RESTful API design with proper error handling",
      "PostgreSQL database with optimized queries",
      "JWT authentication and authorization",
      "Real-time seat availability updates",
      "Payment gateway integration",
    ],
    githubUrl: "https://github.com/anand-yv/Flight-Booking-System",
    // liveUrl: "https://flight-booking.example.com",
  },
  {
    id: "video-streaming",
    title: "Video Streaming Platform",
    description: "Scalable video streaming service with adaptive bitrate streaming and user management.",
    longDescription:
      "A video streaming platform supporting adaptive bitrate streaming, user authentication, video upload, and playback. The backend handles video processing, transcoding, and CDN integration. Features include user profiles, watch history, recommendations, and admin dashboard.",
    technologies: ["Spring Boot", "React", "MongoDB", "FFmpeg", "AWS S3", "REST API"],
    category: "fullstack",
    highlights: [
      "Adaptive bitrate streaming implementation",
      "Video transcoding pipeline with FFmpeg",
      "Cloud storage integration (AWS S3)",
      "User authentication and authorization",
      "Scalable architecture for high traffic",
    ],
    githubUrl: "https://github.com/anandyadav/video-streaming",
  },
  {
    id: "trendsift",
    title: "TrendSift Scraper",
    description: "Web scraping tool for trend analysis and data collection from multiple sources.",
    longDescription:
      "A sophisticated web scraping platform that collects and analyzes trends from various online sources. Features include scheduled scraping, data normalization, trend analysis, and export capabilities. Built with robust error handling, rate limiting, and respect for robots.txt.",
    technologies: ["Spring Boot", "Web Scraping", "PostgreSQL", "Scheduled Tasks", "REST API"],
    category: "backend",
    highlights: [
      "Multi-source web scraping with rate limiting",
      "Data normalization and storage",
      "Scheduled task execution",
      "Trend analysis algorithms",
      "RESTful API for data access",
    ],
    githubUrl: "https://github.com/anandyadav/trendsift",
  },
  {
    id: "health-assist-ai",
    title: "Health Assist AI",
    description: "AI-powered health assistance platform with symptom analysis and recommendations.",
    longDescription:
      "An AI-powered health assistance application that provides symptom analysis, health recommendations, and medication reminders. The backend integrates with AI models for natural language processing, manages user health data securely, and provides personalized insights. Features include secure data storage, HIPAA-compliant architecture considerations, and RESTful API.",
    technologies: ["Spring Boot", "React", "PostgreSQL", "AI/ML Integration", "REST API", "JWT"],
    category: "fullstack",
    highlights: [
      "AI model integration for health analysis",
      "Secure health data management",
      "Personalized recommendation engine",
      "JWT-based secure authentication",
      "RESTful API with comprehensive error handling",
    ],
    githubUrl: "https://github.com/anandyadav/health-assist-ai",
  },
];

