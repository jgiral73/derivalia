import { InvalidContactInfoError } from '../errors';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class ContactInfo {
  private constructor(
    public readonly email?: string,
    public readonly phone?: string,
  ) {}

  static create(params: { email?: string; phone?: string }): ContactInfo {
    const email = params.email?.trim().toLowerCase();
    const phone = params.phone?.trim();

    if (!email && !phone) {
      throw new InvalidContactInfoError();
    }

    if (email && !EMAIL_REGEX.test(email)) {
      throw new InvalidContactInfoError();
    }

    if (phone && phone.length < 4) {
      throw new InvalidContactInfoError();
    }

    return new ContactInfo(email, phone);
  }
}
