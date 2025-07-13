import { defineQuery, defineSystem } from 'bitecs';
import { Energy, Position, Genotype } from '../components/metabolism';
import { createCell } from '../entity';
import { uniform } from '../../utils/randomUtils';

export const createDivisionSystem = () => {
  const query = defineQuery([Energy, Position, Genotype]);

  return defineSystem(world => {
    const entities = query(world);
    // Iterate backwards because creating new entities can change the query result
    for (let i = entities.length - 1; i >= 0; i--) {
      const eid = entities[i];

      if (Energy.value[eid] >= 100) {
        // Halve the parent's energy
        Energy.value[eid] = 50;

        // Create a new cell near the parent
        const newX = Position.x[eid] + uniform(-10, 10);
        const newY = Position.y[eid] + uniform(-10, 10);
        const childEid = createCell(world, newX, newY, 50);

        // Inherit genotype with a slight mutation
        Genotype.value[childEid] = Genotype.value[eid] + uniform(-0.05, 0.05);
      }
    }
    return world;
  });
};
