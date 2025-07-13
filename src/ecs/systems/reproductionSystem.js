import { defineQuery, addEntity, addComponent } from 'bitecs';
import { Position, Velocity, Energy, Genotype } from '../components/metabolism';

export const createReproductionSystem = (environment) => {
  const query = defineQuery([Position, Energy, Genotype]);

  return (world) => {
    const entities = query(world);

    for (let i = 0; i < entities.length; i++) {
      const eid = entities[i];

      // Cells reproduce if they have enough energy
      if (Energy.value[eid] > 380) {
        Energy.value[eid] /= 2; // Divide energy

        const child = addEntity(world);
        
        addComponent(world, Position, child);
        Position.x[child] = Position.x[eid] + (Math.random() - 0.5) * 10;
        Position.y[child] = Position.y[eid] + (Math.random() - 0.5) * 10;

        addComponent(world, Velocity, child);
        Velocity.x[child] = (Math.random() - 0.5) * 2;
        Velocity.y[child] = (Math.random() - 0.5) * 2;

        addComponent(world, Energy, child);
        Energy.value[child] = Energy.value[eid];

        addComponent(world, Genotype, child);
        Genotype.value[child] = Genotype.value[eid]; // Inherit genotype
      }
    }

    return world;
  };
};
