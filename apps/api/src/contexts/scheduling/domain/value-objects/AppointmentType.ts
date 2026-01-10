export type AppointmentTypeValue =
  | 'visit'
  | 'follow_up'
  | 'assessment'
  | 'admin';

export class AppointmentType {
  private constructor(public readonly value: AppointmentTypeValue) {}

  static Visit = new AppointmentType('visit');
  static FollowUp = new AppointmentType('follow_up');
  static Assessment = new AppointmentType('assessment');
  static Admin = new AppointmentType('admin');

  static fromValue(value: string | undefined): AppointmentType {
    switch (value) {
      case 'follow_up':
        return AppointmentType.FollowUp;
      case 'assessment':
        return AppointmentType.Assessment;
      case 'admin':
        return AppointmentType.Admin;
      case 'visit':
      case undefined:
        return AppointmentType.Visit;
      default:
        return AppointmentType.Visit;
    }
  }
}
