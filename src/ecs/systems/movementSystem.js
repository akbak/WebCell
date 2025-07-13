import { defineQuery } from 'bitecs';
import { Position, Velocity } from '../components/metabolism';

export const createMovementSystem = (width, height) => {
  const query = defineQuery([Position, Velocity]);

  return (world) => {
    const entities = query(world);

    for (let i = 0; i < entities.length; i++) {
      const eid = entities[i];

      Position.x[eid] += Velocity.x[eid];
      Position.y[eid] += Velocity.y[eid];

      // Bounce off walls
      if (Position.x[eid] > width / 2 || Position.x[eid] < -width / 2) {
        Velocity.x[eid] *= -1;
      }
      if (Position.y[eid] > height / 2 || Position.y[eid] < -height / 2) {
        Velocity.y[eid] *= -1;
      }
    }

    return world;
  };
};
