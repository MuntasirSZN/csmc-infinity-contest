async function generateClientFingerprint(): Promise<string> {
  const ua = navigator.userAgent;
  const lang = navigator.language;
  const screen = `${window.screen.width}x${window.screen.height}`;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const raw = `${ua}||${lang}||${screen}||${tz}`;

  const encoder = new TextEncoder();
  const data = encoder.encode(raw);

  const hash = await crypto.subtle.digest("SHA-256", data);
  const arr = Array.from(new Uint8Array(hash));
  const hex = arr.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex.slice(0, 32);
}

export function useReturningVisitor() {
  const registrationData = useState<RegistrationResponse | null>(
    "registration-data",
    () => null,
  );
  const isChecking = useState("is-checking-registration", () => false);

  const checkRegistration = async (): Promise<RegistrationResponse | null> => {
    if (isChecking.value) return registrationData.value;

    isChecking.value = true;

    try {
      if (import.meta.client) {
        const localData = localStorage.getItem("csmc-registration");
        if (localData) {
          try {
            const parsed = JSON.parse(localData) as RegistrationResponse;
            registrationData.value = parsed;
            return parsed;
          } catch {
            localStorage.removeItem("csmc-registration");
          }
        }
      }

      const fingerprint = await generateClientFingerprint();

      const response = await $fetch<
        | { isReturning: false }
        | { isReturning: true; registration: RegistrationResponse }
      >("/api/registration/check", {
        method: "POST",
        body: { deviceFingerprint: fingerprint },
      });

      if (response.isReturning) {
        registrationData.value = response.registration;

        if (import.meta.client) {
          localStorage.setItem(
            "csmc-registration",
            JSON.stringify(response.registration),
          );
        }

        return response.registration;
      }

      return null;
    } finally {
      isChecking.value = false;
    }
  };

  const saveRegistration = (data: RegistrationResponse) => {
    registrationData.value = data;

    if (import.meta.client) {
      localStorage.setItem("csmc-registration", JSON.stringify(data));
    }
  };

  return {
    registrationData: readonly(registrationData),
    isChecking: readonly(isChecking),
    checkRegistration,
    saveRegistration,
  };
}
