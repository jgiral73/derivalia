import { CollaborationPurpose } from '.';
import { InvalidCollaborationPurposeError } from '../errors';

describe('CollaborationPurpose', () => {
  it('rejects empty specialty', () => {
    expect(() => CollaborationPurpose.create('')).toThrow(
      InvalidCollaborationPurposeError,
    );
  });

  it('creates with trimmed specialty', () => {
    const purpose = CollaborationPurpose.create('  addictions  ');

    expect(purpose.specialty).toBe('addictions');
  });
});
