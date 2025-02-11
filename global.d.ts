declare global {
    interface Window {
      tableModalOpen?: () => void;
      myGlobalFunction?: () => void;
      onboardingGlobalFunction?: () => void;
    }
  }
  
  export {};