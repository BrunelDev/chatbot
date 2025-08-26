import { create } from "zustand";

interface FormOneStoreProps {
  goals: string[];
  setGoals: (goals: string[]) => void;
}
interface FormTwoStoreProps {
  hairType: string;
  setHairType: (hairType: string) => void;
}
interface FormThreeStoreProps {
  hairHeight: string;
  setHairHeight: (hairHeight: string) => void;
}
interface FormFourStoreProps {
  hairProblems: string[];
  setHairProblems: (hairProblems: string[]) => void;
}
interface FormFiveStoreProps {
  routineFrequency: string;
  setRoutineFrequency: (routineFrequency: string) => void;
}


export const useFormOneStore = create<FormOneStoreProps>((set) => ({
  goals: [],
  setGoals: (goals: string[]) => set({ goals }),
}));

export const useFormTwoStore = create<FormTwoStoreProps>((set) => ({
  hairType: "",
  setHairType: (hairType: string) => set({ hairType }),
}));

export const useFormThreeStore = create<FormThreeStoreProps>((set) => ({
  hairHeight: "",
  setHairHeight: (hairHeight: string) => set({ hairHeight }),
}));

export const useFormFourStore = create<FormFourStoreProps>((set) => ({
  hairProblems: [],
  setHairProblems: (hairProblems: string[]) => set({ hairProblems }),
}));

export const useFormFiveStore = create<FormFiveStoreProps>((set) => ({
  routineFrequency: "",
  setRoutineFrequency: (routineFrequency: string) => set({ routineFrequency }),
}));
