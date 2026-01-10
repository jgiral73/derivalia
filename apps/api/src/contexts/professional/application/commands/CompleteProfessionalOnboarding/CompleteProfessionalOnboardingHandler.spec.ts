import { CompleteProfessionalOnboardingHandler } from './CompleteProfessionalOnboardingHandler';
import { CompleteProfessionalOnboardingCommand } from './CompleteProfessionalOnboardingCommand';
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
    publish: jest.fn(async () => undefined),
  };

  return { professionals, publisher };
};

describe('CompleteProfessionalOnboardingHandler', () => {
  it('throws when professional is missing', async () => {
    const { professionals, publisher } = buildDeps();
    (professionals.findById as jest.Mock).mockResolvedValue(null);

    const handler = new CompleteProfessionalOnboardingHandler(
      professionals,
      publisher,
    );

    await expect(
      handler.execute(
        new CompleteProfessionalOnboardingCommand(
          'prof-1',
          'Maria Soler',
          'ABC-123',
          ['psychology'],
        ),
      ),
    ).rejects.toThrow(ProfessionalNotFoundError);
  });

  it('saves and publishes events', async () => {
    const { professionals, publisher } = buildDeps();
    (professionals.findById as jest.Mock).mockResolvedValue(
      buildProfessional(),
    );

    const handler = new CompleteProfessionalOnboardingHandler(
      professionals,
      publisher,
    );

    await handler.execute(
      new CompleteProfessionalOnboardingCommand(
        'prof-1',
        'Maria Soler',
        'ABC-123',
        ['psychology'],
      ),
    );

    expect(professionals.save).toHaveBeenCalledTimes(1);
    expect(publisher.publish).toHaveBeenCalledTimes(1);
  });
});
