/**
 * YarnPal — Project List
 */
(function (exports) {
  'use strict';

  const STORAGE_KEY = 'yarnpal_projects';

  const YARN_COLORS = [
    { name: 'Crimson Red', hex: '#c0392b' },
    { name: 'Ocean Blue', hex: '#2980b9' },
    { name: 'Forest Green', hex: '#27ae60' },
    { name: 'Sunshine Yellow', hex: '#f39c12' },
    { name: 'Lavender', hex: '#9b59b6' },
    { name: 'Coral Pink', hex: '#e74c3c' },
    { name: 'Sky Blue', hex: '#3498db' },
    { name: 'Cream White', hex: '#fdf6ec' },
    { name: 'Charcoal', hex: '#2c3e50' },
    { name: 'Sage', hex: '#7dcea0' },
    { name: 'Dusty Rose', hex: '#d4a5a5' },
    { name: 'Navy', hex: '#1a237e' },
  ];

  const NEEDLE_SIZES = [
    '2mm', '2.5mm', '3mm', '3.5mm', '4mm', '4.5mm', '5mm',
    '5.5mm', '6mm', '7mm', '8mm', '9mm', '10mm', '12mm', '15mm'
  ];

  function createProject(name, yarnColor, needleSize, notes) {
    return {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: name || 'New Project',
      yarnColor: yarnColor || YARN_COLORS[0].hex,
      needleSize: needleSize || '4mm',
      notes: notes || '',
      status: 'active', // active, paused, done
      createdAt: new Date().toISOString(),
    };
  }

  function loadProjects() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  }

  function saveProjects(projects) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }

  function addProject(project) {
    const projects = loadProjects();
    projects.push(project);
    saveProjects(projects);
    return projects;
  }

  function removeProject(projectId) {
    let projects = loadProjects();
    projects = projects.filter(p => p.id !== projectId);
    saveProjects(projects);
    return projects;
  }

  function updateProjectStatus(projectId, status) {
    const projects = loadProjects();
    const p = projects.find(p => p.id === projectId);
    if (p) p.status = status;
    saveProjects(projects);
    return projects;
  }

  function getProjectCount() {
    return loadProjects().length;
  }

  function getActiveProjects() {
    return loadProjects().filter(p => p.status === 'active');
  }

  exports.YARN_COLORS = YARN_COLORS;
  exports.NEEDLE_SIZES = NEEDLE_SIZES;
  exports.createProject = createProject;
  exports.loadProjects = loadProjects;
  exports.saveProjects = saveProjects;
  exports.addProject = addProject;
  exports.removeProject = removeProject;
  exports.updateProjectStatus = updateProjectStatus;
  exports.getProjectCount = getProjectCount;
  exports.getActiveProjects = getActiveProjects;

})(typeof window !== 'undefined' ? window : module.exports);
