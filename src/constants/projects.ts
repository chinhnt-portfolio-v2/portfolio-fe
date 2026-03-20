// Re-export from new config location for backward compatibility
export {
  projects,
  getAllProjects,
  getAvailableProjects,
  getProjectBySlug,
  type Project as ProjectConfig,
  type ProjectAvailability,
  type ProjectMetrics,
  type TimelineMilestone,
} from '@/config/projects'
