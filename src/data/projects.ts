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
    // DUMMY values below: set imageUrl to a real screenshot (it replaces `art`) and liveUrl to a real link.
    art: "flight",
    liveUrl: "https://example.com",
    rotation: -1,
    accent: 1,
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
    githubUrl: "https://github.com/anand-yv/EngageVid",
    // DUMMY values below: set imageUrl to a real screenshot (it replaces `art`) and liveUrl to a real link.
    art: "video",
    liveUrl: "https://example.com",
    rotation: 1.2,
    accent: 2,
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
    githubUrl: "https://github.com/anand-yv/twitter-trend-scrapper",
    // DUMMY values below: set imageUrl to a real screenshot (it replaces `art`) and liveUrl to a real link.
    art: "trend",
    liveUrl: "https://example.com",
    rotation: -1.4,
    accent: 3,
  },
  {
    id: "health-assist-ai",
    title: "Health Assist AI",
    description: "Browser-based ML screening for diabetes, heart disease and Parkinson's. Models run on-device; nothing is sent anywhere.",
    longDescription:
      "An educational health-screening tool that runs three trained machine-learning models entirely in the browser, with no backend, database or data collection. Pick a condition, enter the measurements, and get a prediction with its probability, plus a chart showing where you land among the real patients in the dataset and the factors that drove the result. Models are retrained in Python and exported as weights for the React front end.",
    technologies: ["React", "TypeScript", "Vite", "Python", "Machine Learning", "GitHub Pages"],
    category: "frontend",
    highlights: [
      "Three models: Diabetes (Linear SVM, 77.3%), Heart disease (Logistic Regression, 82.0%), Parkinson's (Linear SVM, 87.2%)",
      "100% in-browser inference: no backend, nothing leaves your device",
      "Explains each result with a patient-distribution chart and top feature drivers",
      "Python retraining script exports weights; deployed to GitHub Pages via GitHub Actions",
    ],
    githubUrl: "https://github.com/anand-yv/Health-Assist-AI",
    imageUrl: "/projects/health-assist-ai.png",
    art: "health",
    liveUrl: "https://anand-yv.github.io/Health-Assist-AI/",
    rotation: 1,
    accent: 4,
  },
];

