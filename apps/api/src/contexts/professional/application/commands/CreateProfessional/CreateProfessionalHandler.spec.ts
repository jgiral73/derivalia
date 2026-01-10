import { CreateProfessionalHandler } from './CreateProfessionalHandler';
import { CreateProfessionalCommand } from './CreateProfessionalCommand';
import { ProfessionalAlreadyExistsError } from '../../../domain/errors';
import { ProfessionalRepository } from '../../../domain/repositories';
import { DomainEventPublisher } from 'src/shared';

const buildDeps = () => {
  const professionals: ProfessionalRepository = {
    save: jest.fn(),
    findById: jest.fn(),
    findByUserId: jest.fn(),
    findByEmail: jest.fn(),
  };
  const publisher: DomainEventPublisher = {
    publish: jest.fn(async () => undefined),
  };

  return { professionals, publisher };
};

describe('CreateProfessionalHandler', () => {
  it('throws when professional already exists', async () => {
    const { professionals, publisher } = buildDeps();
    (professionals.findByUserId as jest.Mock).mockResolvedValue({});

    const handler = new CreateProfessionalHandler(professionals, publisher);

    await expect(
      handler.execute(
        new CreateProfessionalCommand('user-1', 'pro@example.com'),
      ),
    ).rejects.toThrow(ProfessionalAlreadyExistsError);
  });

  it('saves and publishes events', async () => {
    const { professionals, publisher } = buildDeps();
    (professionals.findByUserId as jest.Mock).mockResolvedValue(null);

    const handler = new CreateProfessionalHandler(professionals, publisher);

    await handler.execute(
      new CreateProfessionalCommand('user-1', 'pro@example.com'),
    );

    expect(professionals.save).toHaveBeenCalledTimes(1);
    expect(publisher.publish).toHaveBeenCalledTimes(1);
  });
});
