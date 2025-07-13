import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { createWorld, addEntity, addComponent, defineQuery, pipe } from 'bitecs';
import { Position, Velocity, Energy, Genotype } from '../ecs/components/metabolism';
import { createMovementSystem } from '../ecs/systems/movementSystem';
import { createMetabolismSystem } from '../ecs/systems/metabolismSystem';
import { createReproductionSystem } from '../ecs/systems/reproductionSystem';
import { createMutationSystem } from '../ecs/systems/mutationSystem';
import { createDecaySystem } from '../ecs/systems/decaySystem';

const MAX_CELLS = 100000;

const SimulationCanvas = ({ environment, setStats, setInspectedCell }) => {
  const [simulationEnded, setSimulationEnded] = useState(false);
  const [planetImageUrl, setPlanetImageUrl] = useState('');
  const canvasRef = useRef(null);
  const simState = useRef({});

  useEffect(() => {
    // Store props in a ref to prevent re-triggering the effect
    simState.current.environment = environment;
    simState.current.setStats = setStats;
    simState.current.setInspectedCell = setInspectedCell;
  }, [environment, setStats, setInspectedCell]);

  useEffect(() => {
    const state = simState.current;
    let animationFrameId;

    const init = () => {
      state.scene = new THREE.Scene();
      state.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -1000, 1000);
      state.camera.position.z = 10;

      if (!state.renderer) {
        state.renderer = new THREE.WebGLRenderer({ antialias: true });
      }
      state.renderer.setSize(window.innerWidth, window.innerHeight);
      state.renderer.setPixelRatio(window.devicePixelRatio);

      state.world = createWorld();
      state.cellQuery = defineQuery([Position, Velocity, Energy, Genotype]);


      const geometry = new THREE.CircleGeometry(1, 8);
      const material = new THREE.MeshBasicMaterial({ vertexColors: true });
      const colorBuffer = new THREE.InstancedBufferAttribute(new Float32Array(MAX_CELLS * 3), 3);
      geometry.setAttribute('color', colorBuffer); // Associate color buffer with geometry

      state.cellMesh = new THREE.InstancedMesh(geometry, material, MAX_CELLS);
      state.cellMesh.instanceColor = colorBuffer; // Use the same buffer for the mesh
      state.scene.add(state.cellMesh);

      for (let i = 0; i < 20; i++) {
        const eid = addEntity(state.world);
        addComponent(state.world, Position, eid);
        Position.x[eid] = Math.random() * window.innerWidth - window.innerWidth / 2;
        Position.y[eid] = Math.random() * window.innerHeight - window.innerHeight / 2;
        addComponent(state.world, Velocity, eid);
        Velocity.x[eid] = (Math.random() - 0.5) * 2;
        Velocity.y[eid] = (Math.random() - 0.5) * 2;
        addComponent(state.world, Energy, eid);
        Energy.value[eid] = 100;
        addComponent(state.world, Genotype, eid);
        Genotype.value[eid] = Math.random();
      }

      const environmentRef = { get current() { return state.environment; } };
      const movementSystem = createMovementSystem(window.innerWidth, window.innerHeight);
      const metabolismSystem = createMetabolismSystem(environmentRef);
      const reproductionSystem = createReproductionSystem(environmentRef);
      const mutationSystem = createMutationSystem();
      const decaySystem = createDecaySystem();

      state.pipeline = pipe(
        movementSystem, 
        metabolismSystem, 
        mutationSystem, // Mutate before reproducing to pass on new traits
        reproductionSystem, 
        decaySystem
      );

      const canvasElement = state.renderer.domElement;
      canvasRef.current.appendChild(canvasElement);

      canvasElement.addEventListener('click', handleClick);
      window.addEventListener('resize', handleResize);
      
      animate();
    };

    let frameCount = 0;
    let lastUpdateTime = 0;
    const simulationTickRate = 1000 / 30; // 30 updates per second

    const animate = (currentTime) => {
      animationFrameId = requestAnimationFrame(animate);
      if (!state.pipeline || !state.world || !state.renderer || !state.scene || !state.camera) return;

      const deltaTime = currentTime - lastUpdateTime;

      // Run simulation logic at a fixed tick rate
      if (deltaTime >= simulationTickRate) {
        state.pipeline(state.world);
        lastUpdateTime = currentTime - (deltaTime % simulationTickRate);

        const entities = state.cellQuery(state.world);
        const matrix = new THREE.Matrix4();
        const color = new THREE.Color();

        for (let i = 0; i < entities.length; i++) {
          const eid = entities[i];
          matrix.setPosition(Position.x[eid], Position.y[eid], 0);
          state.cellMesh.setMatrixAt(i, matrix);

          if (frameCount % 10 === 0) {
            color.setHSL(Genotype.value[eid], 1.0, 0.5);
            state.cellMesh.setColorAt(i, color);
          }
        }

        state.cellMesh.instanceMatrix.needsUpdate = true;
        if (frameCount % 10 === 0) {
          if (state.cellMesh.instanceColor) {
            state.cellMesh.instanceColor.needsUpdate = true;
          }
        }
        state.cellMesh.count = entities.length;
        state.setStats({ cellCount: entities.length });

        if (entities.length >= MAX_CELLS) {
        const seed = Math.floor(Math.random() * 1000);
        setPlanetImageUrl(`https://picsum.photos/seed/${seed}/1200/800`);
        setSimulationEnded(true);
          cancelAnimationFrame(animationFrameId);
          return;
        }
      }

      state.renderer.render(state.scene, state.camera);
      frameCount++;
    };

    const handleResize = () => {
      if (!state.camera || !state.renderer) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      state.camera.left = width / -2;
      state.camera.right = width / 2;
      state.camera.top = height / 2;
      state.camera.bottom = height / -2;
      state.camera.updateProjectionMatrix();
      state.renderer.setSize(width, height);
    };

    const handleClick = (event) => {
      if (!state.renderer || !state.camera || !state.cellMesh || !state.world) return;
      const mouse = new THREE.Vector2();
      const rect = state.renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, state.camera);

      const intersects = raycaster.intersectObject(state.cellMesh);

      if (intersects.length > 0) {
        const instanceId = intersects[0].instanceId;
        const entities = state.cellQuery(state.world);
        const eid = entities[instanceId];

        if (eid !== undefined) {
          state.setInspectedCell({
            id: eid,
            energy: Energy.value[eid],
            genotype: Genotype.value[eid],
          });
        }
      }
    };

    init();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (state.renderer) {
        const canvasElement = state.renderer.domElement;
        canvasElement.removeEventListener('click', handleClick);
        window.removeEventListener('resize', handleResize);
        state.renderer.dispose();
        if (canvasRef.current && canvasRef.current.contains(canvasElement)) {
          canvasRef.current.removeChild(canvasElement);
        }
      }
      simState.current = {};
    };
  }, []);

    return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {!simulationEnded ? (
        <div ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      ) : (
        <div style={{ textAlign: 'center', color: 'white' }}>
          <img src={planetImageUrl} alt="A new world" style={{ maxWidth: '80%', maxHeight: '80vh', borderRadius: '10px' }} />
          <h2 style={{ marginTop: '20px' }}>A New World is Born</h2>
          <p>The cell population has reached its limit, evolving into a complex ecosystem.</p>
        </div>
      )}
    </div>
  );

};

export default SimulationCanvas;
