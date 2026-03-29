import * as THREE from 'three';
import { countries } from './data/countries.js';
import { getConquestLevel, getState } from './store.js';

const GLOBE_RADIUS = 5;
const MARKER_BASE_SIZE = 0.06;
const COLORS = {
  ocean: 0x0a0a2e,
  land: 0x1a1a3e,
  glow: 0x6c8cff,
  conquest: [
    0x1a1a3e, // 0: unconquered
    0x2a3a6e, // 1
    0x3a5a9e, // 2
    0x5a8aee, // 3
    0x8ab0ff, // 4
    0xffd700, // 5: fully conquered
  ],
  particle: 0x6c8cff,
};

let scene, camera, renderer, globe, markers, particles;
let mouseX = 0, mouseY = 0;
let targetRotationY = 0;
let targetRotationX = 0.1;
let isDragging = false;
let previousMouseX = 0, previousMouseY = 0;
let autoRotateSpeed = 0.001;
let hoveredMarker = null;
let raycaster, mouse;
let animationId;
let markerGroup;
let glowMeshes = [];
let pulseTime = 0;

export function initGlobe(container, onCountryHover, onCountryClick) {
  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 14;

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // Raycaster
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Create globe
  createGlobe();
  createAtmosphere();
  createStars();
  createMarkers();

  // Lights
  const ambientLight = new THREE.AmbientLight(0x333366, 1.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0x6688cc, 2);
  directionalLight.position.set(5, 3, 5);
  scene.add(directionalLight);

  const backLight = new THREE.DirectionalLight(0x334488, 0.8);
  backLight.position.set(-5, -3, -5);
  scene.add(backLight);

  // Events
  setupEvents(container, onCountryHover, onCountryClick);

  // Start animation
  animate();

  return { updateMarkers, destroy, getScreenPosition };
}

function createGlobe() {
  // Main sphere
  const geometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
  const material = new THREE.MeshPhongMaterial({
    color: COLORS.ocean,
    transparent: true,
    opacity: 0.9,
    shininess: 25,
  });
  globe = new THREE.Mesh(geometry, material);
  scene.add(globe);

  // Wireframe grid
  const wireGeo = new THREE.SphereGeometry(GLOBE_RADIUS + 0.01, 36, 18);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x2a2a5e,
    wireframe: true,
    transparent: true,
    opacity: 0.15,
  });
  const wireframe = new THREE.Mesh(wireGeo, wireMat);
  globe.add(wireframe);
}

function createAtmosphere() {
  const atmosphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS + 0.3, 64, 64);
  const atmosphereMat = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
        gl_FragColor = vec4(0.42, 0.55, 1.0, intensity * 0.6);
      }
    `,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
  });
  const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
  scene.add(atmosphere);
}

function createStars() {
  const starsGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(3000 * 3);
  for (let i = 0; i < 3000; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
  }
  starsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const starsMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.15,
    transparent: true,
    opacity: 0.8,
  });
  const stars = new THREE.Points(starsGeo, starsMat);
  scene.add(stars);
}

function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

function createMarkers() {
  markerGroup = new THREE.Group();
  globe.add(markerGroup);
  markers = [];
  glowMeshes = [];

  countries.forEach(country => {
    const pos = latLngToVector3(country.lat, country.lng, GLOBE_RADIUS);

    // Marker dot
    const markerGeo = new THREE.SphereGeometry(MARKER_BASE_SIZE, 12, 12);
    const markerMat = new THREE.MeshBasicMaterial({
      color: COLORS.conquest[0],
      transparent: true,
      opacity: 0.6,
    });
    const marker = new THREE.Mesh(markerGeo, markerMat);
    marker.position.copy(pos);
    marker.userData = { country };
    markerGroup.add(marker);
    markers.push(marker);

    // Glow ring (hidden by default, shown on conquest)
    const ringGeo = new THREE.RingGeometry(MARKER_BASE_SIZE * 1.5, MARKER_BASE_SIZE * 3, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: COLORS.conquest[0],
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(pos);
    ring.lookAt(new THREE.Vector3(0, 0, 0));
    ring.userData = { countryCode: country.code };
    markerGroup.add(ring);
    glowMeshes.push(ring);
  });
}

export function updateMarkers() {
  markers.forEach((marker, i) => {
    const code = marker.userData.country.code;
    const level = getConquestLevel(code);
    const color = COLORS.conquest[level];

    marker.material.color.setHex(color);
    marker.material.opacity = level > 0 ? 0.9 : 0.4;

    const scale = level > 0 ? 1 + level * 0.4 : 1;
    marker.scale.setScalar(scale);

    // Update glow ring
    const ring = glowMeshes[i];
    if (level > 0) {
      ring.material.color.setHex(color);
      ring.material.opacity = 0.15 + level * 0.08;
      const ringScale = 1 + level * 0.8;
      ring.scale.setScalar(ringScale);
    } else {
      ring.material.opacity = 0;
    }
  });
}

function setupEvents(container, onCountryHover, onCountryClick) {
  const canvas = renderer.domElement;

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMouseX = e.clientX;
    previousMouseY = e.clientY;
    autoRotateSpeed = 0;
  });

  canvas.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    if (isDragging) {
      const deltaX = e.clientX - previousMouseX;
      const deltaY = e.clientY - previousMouseY;
      targetRotationY += deltaX * 0.005;
      targetRotationX += deltaY * 0.005;
      targetRotationX = Math.max(-1.2, Math.min(1.2, targetRotationX));
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    }

    // Raycast for hover
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(markers);
    if (intersects.length > 0) {
      const marker = intersects[0].object;
      if (hoveredMarker !== marker) {
        hoveredMarker = marker;
        canvas.style.cursor = 'pointer';
        onCountryHover(marker.userData.country, e.clientX, e.clientY);
      }
    } else {
      if (hoveredMarker) {
        hoveredMarker = null;
        canvas.style.cursor = 'grab';
        onCountryHover(null);
      }
    }
  });

  canvas.addEventListener('mouseup', () => {
    isDragging = false;
    setTimeout(() => { autoRotateSpeed = 0.001; }, 2000);
  });

  canvas.addEventListener('click', (e) => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(markers);
    if (intersects.length > 0) {
      onCountryClick(intersects[0].object.userData.country);
    }
  });

  canvas.addEventListener('wheel', (e) => {
    camera.position.z = Math.max(8, Math.min(25, camera.position.z + e.deltaY * 0.01));
  });

  // Touch events
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      previousMouseX = e.touches[0].clientX;
      previousMouseY = e.touches[0].clientY;
      autoRotateSpeed = 0;
    }
  });

  canvas.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - previousMouseX;
      const deltaY = e.touches[0].clientY - previousMouseY;
      targetRotationY += deltaX * 0.005;
      targetRotationX += deltaY * 0.005;
      targetRotationX = Math.max(-1.2, Math.min(1.2, targetRotationX));
      previousMouseX = e.touches[0].clientX;
      previousMouseY = e.touches[0].clientY;
    }
  });

  canvas.addEventListener('touchend', () => {
    isDragging = false;
    setTimeout(() => { autoRotateSpeed = 0.001; }, 2000);
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function animate() {
  animationId = requestAnimationFrame(animate);
  pulseTime += 0.02;

  // Auto-rotate
  targetRotationY += autoRotateSpeed;

  // Smooth rotation
  globe.rotation.y += (targetRotationY - globe.rotation.y) * 0.05;
  globe.rotation.x += (targetRotationX - globe.rotation.x) * 0.05;

  // Pulse conquered markers
  glowMeshes.forEach(ring => {
    if (ring.material.opacity > 0) {
      const pulse = Math.sin(pulseTime * 2) * 0.03;
      ring.material.opacity = ring.material.opacity + pulse;
    }
  });

  renderer.render(scene, camera);
}

function getScreenPosition(lat, lng) {
  const pos = latLngToVector3(lat, lng, GLOBE_RADIUS);
  const vector = pos.clone();
  globe.localToWorld(vector);
  vector.project(camera);
  return {
    x: (vector.x * 0.5 + 0.5) * window.innerWidth,
    y: (-vector.y * 0.5 + 0.5) * window.innerHeight,
  };
}

function destroy() {
  cancelAnimationFrame(animationId);
  renderer.dispose();
  scene.clear();
}

// Add burst particle effect at a country location
export function addConquestBurst(countryCode) {
  const country = countries.find(c => c.code === countryCode);
  if (!country) return;

  const center = latLngToVector3(country.lat, country.lng, GLOBE_RADIUS);
  const level = getConquestLevel(countryCode);
  const color = new THREE.Color(COLORS.conquest[Math.min(level, 5)]);

  const particleCount = 20 + level * 10;
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = center.x;
    positions[i * 3 + 1] = center.y;
    positions[i * 3 + 2] = center.z;

    const dir = new THREE.Vector3(
      (Math.random() - 0.5),
      (Math.random() - 0.5),
      (Math.random() - 0.5)
    ).normalize().multiplyScalar(0.02 + Math.random() * 0.03);
    velocities.push(dir);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color,
    size: 0.08,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geo, mat);
  globe.add(points);

  let frame = 0;
  const maxFrames = 60;

  function animateBurst() {
    if (frame >= maxFrames) {
      globe.remove(points);
      geo.dispose();
      mat.dispose();
      return;
    }

    const posArr = geo.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      posArr[i * 3] += velocities[i].x;
      posArr[i * 3 + 1] += velocities[i].y;
      posArr[i * 3 + 2] += velocities[i].z;
    }
    geo.attributes.position.needsUpdate = true;
    mat.opacity = 1 - frame / maxFrames;

    frame++;
    requestAnimationFrame(animateBurst);
  }

  animateBurst();
}
