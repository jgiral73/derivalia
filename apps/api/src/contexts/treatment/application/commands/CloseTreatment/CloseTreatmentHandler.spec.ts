import { DomainEventPublisher } from 'src/shared';
import { CloseTreatmentCommand } from './CloseTreatmentCommand';
import { CloseTreatmentHandler } from './CloseTreatmentHandler';
import { TreatmentNotFoundError } from '../../../domain/errors';
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

describe('CloseTreatmentHandler', () => {
  it('throws when treatment is missing', async () => {
    const { treatments, publisher } = buildDeps();
    (treatments.findById as jest.Mock).mockResolvedValue(null);
    const handler = new CloseTreatmentHandler(treatments, publisher);

    await expect(
      handler.execute(new CloseTreatmentCommand('treat-1')),
    ).rejects.toThrow(TreatmentNotFoundError);
  });

  it('closes and publishes events', async () => {
    const { treatments, publisher } = buildDeps();
    const treatment = Treatment.start({
      id: TreatmentId.fromString('treat-1'),
      patientId: 'patient-1',
      professionalId: 'pro-1',
      goal: TreatmentGoal.create('Recovery'),
    });
    (treatments.findById as jest.Mock).mockResolvedValue(treatment);
    const handler = new CloseTreatmentHandler(treatments, publisher);

    await handler.execute(new CloseTreatmentCommand('treat-1'));

    const save = treatments.save as jest.Mock;
    const publish = publisher.publish as jest.Mock;
    expect(treatment.getStatus().value).toBe('closed');
    expect(save).toHaveBeenCalledTimes(1);
    expect(publish).toHaveBeenCalledTimes(1);
  });
});
