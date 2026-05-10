// Training system per GDD §9.1

export type TrainingType = 'sprint' | 'rock_push' | 'shield_practice' | 'endurance_run' | 'focus_training';

export const TRAINING_MAP: Record<TrainingType, { stat: string; label: string }> = {
  sprint: { stat: 'speed', label: 'Sprint Training' },
  rock_push: { stat: 'attack', label: 'Rock Push' },
  shield_practice: { stat: 'defense', label: 'Shield Practice' },
  endurance_run: { stat: 'hp', label: 'Endurance Run' },
  focus_training: { stat: 'sp', label: 'Focus Training' },
};

export function getTrainingGain(bond: number): number {
  const base = Math.floor(Math.random() * 3) + 1;
  return bond >= 50 ? base + 1 : base;
}
