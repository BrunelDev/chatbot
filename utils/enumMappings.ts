import {
  HAIR_CONCERNS_CHOICES,
  HAIR_GOALS,
  HAIR_LENGTH_CHOICES,
  HAIR_TYPE_CHOICES,
  ROUTINE_STATUS_CHOICES,
} from "../context/useFormStore";

export const hairTypeLabels: Record<HAIR_TYPE_CHOICES, string> = {
  [HAIR_TYPE_CHOICES.Lisse]: "Cheveux lisses",
  [HAIR_TYPE_CHOICES.Ondule]: "Cheveux ondulés",
  [HAIR_TYPE_CHOICES.Boucle]: "Cheveux bouclés",
  [HAIR_TYPE_CHOICES.Frise]: "Cheveux frisés",
  [HAIR_TYPE_CHOICES.Crepu]: "Cheveux crépus",
  [HAIR_TYPE_CHOICES.Inconnu]: "Je ne sais pas",
};

export const hairLengthLabels: Record<HAIR_LENGTH_CHOICES, string> = {
  [HAIR_LENGTH_CHOICES.TresCourts]: "Très courts",
  [HAIR_LENGTH_CHOICES.Courts]: "Courts",
  [HAIR_LENGTH_CHOICES.MiLongs]: "Mi-longs",
  [HAIR_LENGTH_CHOICES.Longs]: "Longs",
  [HAIR_LENGTH_CHOICES.TresLongs]: "Très longs",
};

export const hairConcernsLabels: Record<HAIR_CONCERNS_CHOICES, string> = {
  [HAIR_CONCERNS_CHOICES.CheveuxSec]: "Cheveux sec",
  [HAIR_CONCERNS_CHOICES.Pellicules]: "Pellicules",
  [HAIR_CONCERNS_CHOICES.CheveuxGras]: "Cheveux gras",
  [HAIR_CONCERNS_CHOICES.Demangeaisons]: "Demangeaisons",
  [HAIR_CONCERNS_CHOICES.ChuteCheveux]: "Chute de cheveux",
  [HAIR_CONCERNS_CHOICES.ManqueDeVolume]: "Manque de volume",
};

export const routineStatusLabels: Record<ROUTINE_STATUS_CHOICES, string> = {
  [ROUTINE_STATUS_CHOICES.Definie]: "Oui, j'ai une routine bien définie",
  [ROUTINE_STATUS_CHOICES.Irreguliere]:
    "J'en ai une mais je ne suis pas régulière",
  [ROUTINE_STATUS_CHOICES.Debutante]: "Non, je débute",
};

export const goalsLabels: Record<HAIR_GOALS, string> = {
  [HAIR_GOALS.Pousse]: "Favoriser la pousse",
  [HAIR_GOALS.Force]: "Renforcer les cheveux",
  [HAIR_GOALS.Brillance]: "Améliorer la brillance",
  [HAIR_GOALS.Volume]: "Donner du volume",
  [HAIR_GOALS.Hydratation]: "Hydrater les cheveux",
  [HAIR_GOALS.Stimulation]: "Stimuler le cuir chevelu",
};

// Utility function to get label from any enum value
export const getEnumLabel = (
  value: string,
  mapping: Record<string, string>
): string => {
  return mapping[value] || value;
};
