// Vertex Shader
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// Fragment Shader
void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.5, 1.0); // Pink color for now
}
