import { PatientName } from '.';
import { InvalidPatientNameError } from '../errors';

describe('PatientName', () => {
  it('creates a trimmed name', () => {
    const name = PatientName.create('  Jane Doe  ');

    expect(name.value).toBe('Jane Doe');
  });

  it('rejects empty name', () => {
    expect(() => PatientName.create('')).toThrow(InvalidPatientNameError);
  });
});
