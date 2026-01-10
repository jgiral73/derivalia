import { SuspendProfessionalHandler } from './SuspendProfessionalHandler';
import { SuspendProfessionalCommand } from './SuspendProfessionalCommand';
import { ProfessionalNotFoundError } from '../../../domain/errors';
import { ProfessionalRepository } from '../../../domain/repositories';
import { DomainEventPublisher } from 'src/shared';
import { Professional } from '../../../domain/aggregates';
import { ProfessionalId } from '../../../domain/value-objects';

const buildProfessional = () =>
  Professional.create({
    id: ProfessionalId.fromString('prof-1'),
    userId: 'user-1',
  });

const buildDeps = () => {
  const professionals: ProfessionalRepository = {
    save: jest.fn(),
    findById: jest.fn(),
    findByUserId: jest.fn(),
    findByEmail: jest.fn(),
  };
  const publisher: DomainEventPublisher = {
    // eslint-disable-next-line @typescript-eslint/require-await
    publish: jest.fn(async () => undefined),
  };

  return { professionals, publisher };
};

describe('SuspendProfessionalHandler', () => {
  it('throws when professional is missing', async () => {
    const { professionals, publisher } = buildDeps();
    (professionals.findById as jest.Mock).mockResolvedValue(null);

    const handler = new SuspendProfessionalHandler(professionals, publisher);

    await expect(
      handler.execute(new SuspendProfessionalCommand('prof-1', 'reason')),
    ).rejects.toThrow(ProfessionalNotFoundError);
  });

  it('saves and publishes events', async () => {
    const { professionals, publisher } = buildDeps();
    (professionals.findById as jest.Mock).mockResolvedValue(
      buildProfessional(),
    );

    const handler = new SuspendProfessionalHandler(professionals, publisher);

    await handler.execute(new SuspendProfessionalCommand('prof-1', 'reason'));

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(professionals.save).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(publisher.publish).toHaveBeenCalledTimes(1);
  });
});
