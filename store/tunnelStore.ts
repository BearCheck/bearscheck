"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TunnelFormData, InsuranceResult } from "@/types/tunnel";

interface TunnelStore {
  currentStep: number;
  totalSteps: number;
  formData: TunnelFormData;
  results: InsuranceResult[];
  isCalculating: boolean;
  direction: "forward" | "backward";

  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<TunnelFormData>) => void;
  setResults: (results: InsuranceResult[]) => void;
  setCalculating: (loading: boolean) => void;
  resetTunnel: () => void;
}

const TOTAL_STEPS = 9;

export const useTunnelStore = create<TunnelStore>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      totalSteps: TOTAL_STEPS,
      formData: {},
      results: [],
      isCalculating: false,
      direction: "forward",

      setStep: (step) =>
        set((state) => ({
          direction: step > state.currentStep ? "forward" : "backward",
          currentStep: Math.max(0, Math.min(TOTAL_STEPS - 1, step)),
        })),

      nextStep: () =>
        set((state) => ({
          direction: "forward",
          currentStep: Math.min(state.totalSteps, state.currentStep + 1),
        })),

      prevStep: () =>
        set((state) => ({
          direction: "backward",
          currentStep: Math.max(0, state.currentStep - 1),
        })),

      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      setResults: (results) => set({ results }),
      setCalculating: (isCalculating) => set({ isCalculating }),

      resetTunnel: () =>
        set({
          currentStep: 0,
          formData: {},
          results: [],
          isCalculating: false,
          direction: "forward",
        }),
    }),
    {
      name: "bearscheck-tunnel",
      partialize: (state) => ({
        formData: state.formData,
        currentStep: state.currentStep,
      }),
    }
  )
);
