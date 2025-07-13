import { defineQuery, defineSystem, removeEntity } from 'bitecs';
import { Energy } from '../components/metabolism';

export const createDecaySystem = () => {
  const query = defineQuery([Energy]);

  return (world) => {
    const entities = query(world);
    for (let i = entities.length - 1; i >= 0; i--) {
      const eid = entities[i];

      if (Energy.value[eid] <= 0) {
        removeEntity(world, eid);
      }
    }
    return world;
  };
};
