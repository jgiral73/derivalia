import { CollaborationId } from '.';
import { InvalidCollaborationIdError } from '../errors';

describe('CollaborationId', () => {
  it('rejects empty ids', () => {
    expect(() => CollaborationId.fromString('')).toThrow(
      InvalidCollaborationIdError,
    );
  });

  it('creates from non-empty string', () => {
    const id = CollaborationId.fromString('collab-1');

    expect(id.value).toBe('collab-1');
  });
});
