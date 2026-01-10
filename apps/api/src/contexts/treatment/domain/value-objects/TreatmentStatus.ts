export type TreatmentStatusValue = 'active' | 'closed';

export class TreatmentStatus {
  static Active = new TreatmentStatus('active');
  static Closed = new TreatmentStatus('closed');

  private constructor(public readonly value: TreatmentStatusValue) {}

  static fromValue(value: string): TreatmentStatus {
    switch (value) {
      case 'active':
        return TreatmentStatus.Active;
      case 'closed':
        return TreatmentStatus.Closed;
      default:
        return TreatmentStatus.Active;
    }
  }

  isActive(): boolean {
    return this.value === TreatmentStatus.Active.value;
  }
}
