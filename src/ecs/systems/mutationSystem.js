import { defineQuery, defineSystem } from 'bitecs';
import { Genotype } from '../components/metabolism';

export const createMutationSystem = () => {
  const query = defineQuery([Genotype]);

  return defineSystem((world) => {
    const entities = query(world);

    for (let i = 0; i < entities.length; i++) {
      const eid = entities[i];

      // Small chance to mutate genotype
      if (Math.random() < 0.005) {
        Genotype.value[eid] += (Math.random() - 0.5) * 0.1;
        // Wrap genotype value around 0 and 1
        if (Genotype.value[eid] < 0) Genotype.value[eid] += 1;
        if (Genotype.value[eid] > 1) Genotype.value[eid] -= 1;
      }
    }

    return world;
  });
};
