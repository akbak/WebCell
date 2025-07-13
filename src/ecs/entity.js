import { addEntity, addComponent } from 'bitecs';
import { Position, Energy, Genotype, Mutation } from './components/metabolism';
import { uniform } from '../utils/randomUtils';

export const createCell = (world, x = 0, y = 0, energy = 50) => {
  const eid = addEntity(world);
  addComponent(world, Position, eid);
  addComponent(world, Energy, eid);
  addComponent(world, Genotype, eid);
  addComponent(world, Mutation, eid);

  Position.x[eid] = x || uniform(-300, 300);
  Position.y[eid] = y || uniform(-300, 300);
  Energy.value[eid] = energy;
  Genotype.value[eid] = Math.random(); // Simple genotype for now
  Mutation.rate[eid] = 0.05; // Base mutation rate

  return eid;
};
