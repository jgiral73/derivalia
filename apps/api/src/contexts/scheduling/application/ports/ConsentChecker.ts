export interface ConsentChecker {
  hasActiveConsent(patientId: string, professionalId: string): Promise<boolean>;
}
