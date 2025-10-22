import { defineStore } from "pinia";

interface RegistrationState {
  fullName: string;
  schoolName: string;
  grade: Grade | undefined;
  section: string;
  roll: string;
  email: string;
  mobile: string;
  fatherName: string;
  motherName: string;
  deviceFingerprint: string;
}

export const useRegistrationStore = defineStore("registration", {
  state: (): RegistrationState => ({
    fullName: "",
    schoolName: "",
    grade: undefined,
    section: "",
    roll: "",
    email: "",
    mobile: "",
    fatherName: "",
    motherName: "",
    deviceFingerprint: "",
  }),

  actions: {
    updateField<K extends keyof RegistrationState>(
      field: K,
      value: RegistrationState[K],
    ) {
      (this as RegistrationState)[field] = value;
    },

    setDeviceFingerprint(fingerprint: string) {
      this.deviceFingerprint = fingerprint;
    },

    reset() {
      this.$reset();
    },
  },

  persist: true,
});
