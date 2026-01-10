import { ContactInfo } from '.';
import { InvalidContactInfoError } from '../errors';

describe('ContactInfo', () => {
  it('accepts email', () => {
    const contact = ContactInfo.create({ email: 'patient@example.com' });

    expect(contact.email).toBe('patient@example.com');
  });

  it('accepts phone', () => {
    const contact = ContactInfo.create({ phone: '1234567' });

    expect(contact.phone).toBe('1234567');
  });

  it('rejects empty contact info', () => {
    expect(() => ContactInfo.create({})).toThrow(InvalidContactInfoError);
  });

  it('rejects invalid email', () => {
    expect(() => ContactInfo.create({ email: 'nope' })).toThrow(
      InvalidContactInfoError,
    );
  });
});
