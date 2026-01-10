import { DomainEventPublisher } from 'src/shared';
import { StartTreatmentCommand } from './StartTreatmentCommand';
import { StartTreatmentHandler } from './StartTreatmentHandler';
import { TreatmentRepository } from '../../../domain/repositories';
import { Treatment } from '../../../domain/aggregates';
import { TreatmentGoal, TreatmentId } from '../../../domain/value-objects';

const buildDeps = () => {
  const treatments: TreatmentRepository = {
    save: jest.fn(),
    findById: jest.fn(),
    findActiveForPatient: jest.fn(),
  };
  const publisher: DomainEventPublisher = {
    publish: jest.fn(() => Promise.resolve()),
  };

  return { treatments, publisher };
};

describe('StartTreatmentHandler', () => {
  it('returns existing treatment when active already exists', async () => {
    const { treatments, publisher } = buildDeps();
    const existing = Treatment.start({
      id: TreatmentId.fromString('treat-1'),
      patientId: 'patient-1',
      professionalId: 'pro-1',
      goal: TreatmentGoal.create('Recovery'),
    });
    (treatments.findActiveForPatient as jest.Mock).mockResolvedValue(existing);
    const handler = new StartTreatmentHandler(treatments, publisher);

    const treatmentId = await handler.execute(
      new StartTreatmentCommand('patient-1', 'pro-1', null, 'Recovery'),
    );

    const save = treatments.save as jest.Mock;
    expect(treatmentId).toBe(existing.id.value);
    expect(save).not.toHaveBeenCalled();
  });

  it('saves and publishes when starting new', async () => {
    const { treatments, publisher } = buildDeps();
    (treatments.findActiveForPatient as jest.Mock).mockResolvedValue(null);
    const handler = new StartTreatmentHandler(treatments, publisher);

    const treatmentId = await handler.execute(
      new StartTreatmentCommand('patient-1', 'pro-1', null, 'Recovery'),
    );

    const save = treatments.save as jest.Mock;
    const publish = publisher.publish as jest.Mock;
    expect(treatmentId).toBeDefined();
    expect(save).toHaveBeenCalledTimes(1);
    expect(publish).toHaveBeenCalledTimes(1);
  });
});
