import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FormState {
  goals: string[];
  hairType: string;
  hairHeight: string;
  hairProblems: string[];
  routineFrequency: string;
  scalpConditions: string[];
  notes: string;
}

interface FormStore extends FormState {
  setFormData: (data: Partial<FormState>) => void;
  resetForm: () => void;
}

const initialState: FormState = {
  goals: [],
  hairType: "",
  hairHeight: "",
  hairProblems: [],
  routineFrequency: "",
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
