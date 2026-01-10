import { Treatment } from './Treatment';
import { TreatmentAlreadyClosedError } from '../errors';
import {
  TreatmentGoal,
  TreatmentId,
  TreatmentPeriod,
  TreatmentStatus,
} from '../value-objects';

describe('Treatment aggregate', () => {
  it('starts and emits TreatmentStarted', () => {
    const treatment = Treatment.start({
      id: TreatmentId.fromString('treat-1'),
      patientId: 'patient-1',
      professionalId: 'pro-1',
      goal: TreatmentGoal.create('Recovery'),
    });

    const events = treatment.pullDomainEvents();

    expect(events.map((event) => event.eventName)).toEqual([
      'TreatmentStarted',
    ]);
  });

  it('closes and emits TreatmentClosed', () => {
    const treatment = Treatment.start({
      id: TreatmentId.fromString('treat-2'),
      patientId: 'patient-1',
      professionalId: 'pro-1',
      goal: TreatmentGoal.create('Recovery'),
    });
    treatment.pullDomainEvents();

    treatment.close();

    const events = treatment.pullDomainEvents();

    expect(treatment.getStatus().value).toBe('closed');
    expect(events.map((event) => event.eventName)).toEqual(['TreatmentClosed']);
  });

  it('rejects closing twice', () => {
    const treatment = Treatment.rehydrate({
      id: TreatmentId.fromString('treat-3'),
      patientId: 'patient-1',
      professionalId: 'pro-1',
      organizationId: null,
      goal: TreatmentGoal.create('Recovery'),
      period: TreatmentPeriod.fromDates(new Date(), new Date()),
      status: TreatmentStatus.Closed,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(() => treatment.close()).toThrow(TreatmentAlreadyClosedError);
  });
});
