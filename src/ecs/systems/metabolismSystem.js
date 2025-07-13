import { defineQuery } from 'bitecs';
import { Energy, Genotype } from '../components/metabolism.js';

export const createMetabolismSystem = (environment) => {
  const query = defineQuery([Energy, Genotype]);

  return (world) => {
    const entities = query(world);
    const { light, temperature, ph } = environment.current;

    for (let i = 0; i < entities.length; i++) {
        const eid = entities[i];
        const genotypeValue = Genotype.value[eid];
        const idealTemp = 30 + genotypeValue * 40; // Ideal temp between 30 and 70
        const idealPh = 6 + genotypeValue * 2.5; // Ideal pH between 6 and 8.5

        // Sharper curve for temperature factor
        const tempFactor = Math.exp(-Math.pow(temperature - idealTemp, 2) / (2 * Math.pow(15, 2)));
        // Light is a direct multiplier, more light = more energy, capped
        const lightFactor = Math.min(light / 100, 1.5);
        // Sharper curve for pH factor
        const phFactor = Math.exp(-Math.pow(ph - idealPh, 2) / (2 * Math.pow(1.5, 2)));

        const metabolismRate = tempFactor * lightFactor * phFactor;
        
        // Significantly increase energy gain based on optimal conditions
        Energy.value[eid] += metabolismRate * 2.0; // Boosted energy gain
        Energy.value[eid] -= 0.2; // Slightly increased cost of living
        
        // Clamp energy
        if (Energy.value[eid] < 0) Energy.value[eid] = 0;
        if (Energy.value[eid] > 400) Energy.value[eid] = 400;
    }

    return world;
  };
};
