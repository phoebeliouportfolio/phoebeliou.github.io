import { fetchProjects } from "../api/projects";

async function init() {
  try {
    const projects = await fetchProjects();
    console.log("Projects from WP JSON:", projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
  }
}

init();
