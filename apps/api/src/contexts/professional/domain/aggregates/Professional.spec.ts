import { Professional } from '.';
import {
  FullName,
  LicenseNumber,
  ProfessionalId,
  ProfessionalStatus,
  Specialty,
} from '../value-objects';
import { ProfessionalStateTransitionNotAllowedError } from '../errors';

describe('Professional aggregate', () => {
  it('invites and emits ProfessionalInvited', () => {
    const professional = Professional.invite({
      id: ProfessionalId.fromString('prof-1'),
      email: 'pro@example.com',
    });

    const events = professional.pullDomainEvents();

    expect(events.map((event) => event.eventName)).toEqual([
      'ProfessionalInvited',
    ]);
  });

  it('creates and emits ProfessionalCreated', () => {
    const professional = Professional.create({
      id: ProfessionalId.fromString('prof-2'),
      userId: 'user-1',
      email: 'pro@example.com',
    });

    const events = professional.pullDomainEvents();

    expect(events.map((event) => event.eventName)).toEqual([
      'ProfessionalCreated',
    ]);
  });

  it('completes onboarding and activates', () => {
    const professional = Professional.create({
      id: ProfessionalId.fromString('prof-3'),
      userId: 'user-2',
    });

    professional.completeOnboarding({
      fullName: FullName.create('Maria Soler'),
      licenseNumber: LicenseNumber.create('ABC-123'),
      specialties: [Specialty.create('psychology')],
    });

    expect(professional.getStatus().value).toBe(ProfessionalStatus.Active.value);
  });

  it('rejects onboarding when not partial', () => {
    const professional = Professional.invite({
      id: ProfessionalId.fromString('prof-4'),
      email: 'pro@example.com',
    });

    expect(() =>
      professional.completeOnboarding({
        fullName: FullName.create('Maria Soler'),
        licenseNumber: LicenseNumber.create('ABC-123'),
        specialties: [Specialty.create('psychology')],
      }),
    ).toThrow(ProfessionalStateTransitionNotAllowedError);
  });
});
