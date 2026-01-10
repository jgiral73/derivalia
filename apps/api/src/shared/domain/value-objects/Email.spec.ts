import { Email, InvalidEmailError } from './Email';

describe('Email', () => {
  it('creates a normalized email', () => {
    const email = Email.create(' Test@Example.com ');

    expect(email.value).toBe('test@example.com');
  });

  it('rejects invalid email', () => {
    expect(() => Email.create('not-an-email')).toThrow(InvalidEmailError);
  });
});
