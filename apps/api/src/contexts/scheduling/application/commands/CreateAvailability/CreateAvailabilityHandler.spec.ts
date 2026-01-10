import { CreateAvailabilityCommand } from './CreateAvailabilityCommand';
import { CreateAvailabilityHandler } from './CreateAvailabilityHandler';
import { SlotRepository } from '../../../domain/repositories';
import { AvailabilityPolicy } from '../../../domain/services';

const buildDeps = () => {
  const slots: SlotRepository = {
    save: jest.fn(),
    findOverlapping: jest.fn(),
  };
  const availability: AvailabilityPolicy = {
    assertAvailable: jest.fn(async () => undefined),
  } as unknown as AvailabilityPolicy;

  return { slots, availability };
};

describe('CreateAvailabilityHandler', () => {
  it('creates slot and saves', async () => {
    const { slots, availability } = buildDeps();
    const handler = new CreateAvailabilityHandler(slots, availability);

    const slotId = await handler.execute(
      new CreateAvailabilityCommand(
        'pro-1',
        new Date('2026-01-01T10:00:00.000Z'),
        new Date('2026-01-01T11:00:00.000Z'),
        'availability',
      ),
    );

    expect(slotId).toBeDefined();
    const assertAvailable = availability.assertAvailable as jest.Mock;
    const save = slots.save as jest.Mock;
    expect(assertAvailable).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledTimes(1);
  });
});
