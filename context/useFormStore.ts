import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * HAIR_TYPE_CHOICES = [
        ('lisse', 'Cheveux lisses'),
        ('ondule', 'Cheveux ondulés'),
        ('boucle', 'Cheveux bouclés'),
        ('frise_crepus', 'Cheveux frisés à crépus'),
        ('inconnu', 'Je ne sais pas'),
    ]

HAIR_LENGTH_CHOICES = [
        ('tres_courts', 'Très courts'),
        ('courts', 'Courts'),
        ('mi_longs', 'Mi-longs'),
        ('longs', 'Longs'),
        ('tres_longs', 'Très longs'),

    ]

 HAIR_CONCERNS_CHOICES = [
        ('cheveux_sec', 'Cheveux sec'),
        ('pellicules', 'Pellicules'),
        ('cheveux_gras', 'Cheveux gras'),
        ('demangeaisons', 'Demangeaisons'),
        ('chute_cheveux', 'Chute de cheveux'),
        ('manque_de_volume', 'Manque de volume'),
    ]

  ROUTINE_STATUS_CHOICES = [
        ('definie', 'Oui, j’ai une routine bien définie'),
        ('irreguliere', 'J’en ai une mais je ne suis pas régulière'),
        ('debutante', 'Non, je débute'),
    ]
 */
export enum HAIR_TYPE_CHOICES {
  Lisse = "lisse",
  Ondule = "ondule",
  Boucle = "boucle",
  FriseCrepus = "frise_crepus",
  Inconnu = "inconnu",
}

export enum HAIR_LENGTH_CHOICES {
  TresCourts = "tres_courts",
  Courts = "courts",
  MiLongs = "mi_longs",
  Longs = "longs",
  TresLongs = "tres_longs",
}

export enum HAIR_CONCERNS_CHOICES {
  CheveuxSec = "cheveux_sec",
  Pellicules = "pellicules",
  CheveuxGras = "cheveux_gras",
  Demangeaisons = "demangeaisons",
  ChuteCheveux = "chute_cheveux",
  ManqueDeVolume = "manque_de_volume",
}

export enum ROUTINE_STATUS_CHOICES {
  Definie = "definie",
  Irreguliere = "irreguliere",
  Debutante = "debutante",
}

export interface FormState {
  goals: string[] | null;
  hairType: HAIR_TYPE_CHOICES | "";
  hairHeight: HAIR_LENGTH_CHOICES | "";
  hairProblems: HAIR_CONCERNS_CHOICES[] | null;
  routineFrequency: ROUTINE_STATUS_CHOICES | "";
  scalpConditions: string[] | null;
  notes: string;
}

interface FormStore extends FormState {
  setFormData: (data: Partial<FormState>) => void;
  resetForm: () => void;
}

const initialState: FormState = {
  goals: [],
  hairType: "",
  hairHeight: HAIR_LENGTH_CHOICES.TresCourts,
  hairProblems: [],
  routineFrequency: ROUTINE_STATUS_CHOICES.Debutante,
  scalpConditions: [],
  notes: "",
};

export const useFormStore = create<FormStore>()(
  persist(
    (set) => ({
      ...initialState,
      setFormData: (data) => set((state) => ({ ...state, ...data })),
      resetForm: () => set(initialState),
    }),
    {
      name: "form-storage", // unique name
      storage: createJSONStorage(() => AsyncStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
