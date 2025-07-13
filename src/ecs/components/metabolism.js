import { defineComponent, Types } from 'bitecs';

// Position of the cell
export const Position = defineComponent({
  x: Types.f32,
  y: Types.f32,
});

// Velocity of the cell
export const Velocity = defineComponent({
  x: Types.f32,
  y: Types.f32,
});

// Energy level of the cell
export const Energy = defineComponent({
  value: Types.f32,
});

// Genotype of the cell
export const Genotype = defineComponent({
  // For simplicity, let's represent genotype as a single number for now
  value: Types.f32,
});

// Mutation rate
export const Mutation = defineComponent({
    rate: Types.f32
});
