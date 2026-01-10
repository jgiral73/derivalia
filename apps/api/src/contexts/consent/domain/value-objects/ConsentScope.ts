import { InvalidConsentScopeError } from '../errors';

export type ConsentScopeTypeValue = 'patient' | 'treatment' | 'data_type';

export class ConsentScope {
  private constructor(
    public readonly type: ConsentScopeTypeValue,
    public readonly ref: string,
  ) {}

  static create(type: string, ref: string): ConsentScope {
    const normalizedRef = ref.trim();
    if (!normalizedRef) {
      throw new InvalidConsentScopeError(ref);
    }

    switch (type) {
      case 'patient':
      case 'treatment':
      case 'data_type':
        return new ConsentScope(type, normalizedRef);
      default:
        throw new InvalidConsentScopeError(type);
    }
  }

  matches(other: ConsentScope): boolean {
    return this.type === other.type && this.ref === other.ref;
  }
}
