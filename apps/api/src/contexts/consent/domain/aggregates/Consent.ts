import { AggregateRoot } from 'src/shared';
import { Conformity } from '../entities/Conformity';
import {
  ConsentAlreadyGrantedError,
  ConsentAlreadyRevokedError,
  ConformityNotFoundError,
} from '../errors';
import {
  ConsentGranted,
  ConsentRequested,
  ConsentRevoked,
  ConformityAccepted,
  ConformityRejected,
  ConformityRequested,
} from '../events';
import {
  ConsentDecision,
  ConsentId,
  ConsentPurpose,
  ConsentScope,
  ConformityType,
} from '../value-objects';

export class Consent extends AggregateRoot {
  private decision: ConsentDecision;
  private validUntil: Date | null;
  private conformities: Conformity[];
  private updatedAt: Date;

  private constructor(
    public readonly id: ConsentId,
    public readonly patientId: string,
    public readonly granteeId: string,
    public readonly scope: ConsentScope,
    public readonly purpose: ConsentPurpose,
    decision: ConsentDecision,
    public readonly validFrom: Date,
    validUntil: Date | null,
    conformities: Conformity[],
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();
    this.decision = decision;
    this.validUntil = validUntil;
    this.conformities = conformities;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public readonly createdAt: Date;

  static request(params: {
    id: ConsentId;
    patientId: string;
    granteeId: string;
    scope: ConsentScope;
    purpose: ConsentPurpose;
    validFrom: Date;
    validUntil?: Date | null;
  }): Consent {
    const now = new Date();
    const consent = new Consent(
      params.id,
      params.patientId,
      params.granteeId,
      params.scope,
      params.purpose,
      ConsentDecision.Deny,
      params.validFrom,
      params.validUntil ?? null,
      [],
      now,
      now,
    );

    consent.addDomainEvent(
      new ConsentRequested(
        consent.id.value,
        consent.patientId,
        consent.granteeId,
      ),
    );

    return consent;
  }

  static grant(params: {
    id: ConsentId;
    patientId: string;
    granteeId: string;
    scope: ConsentScope;
    purpose: ConsentPurpose;
    validFrom: Date;
    validUntil?: Date | null;
  }): Consent {
    const now = new Date();
    const consent = new Consent(
      params.id,
      params.patientId,
      params.granteeId,
      params.scope,
      params.purpose,
      ConsentDecision.Allow,
      params.validFrom,
      params.validUntil ?? null,
      [],
      now,
      now,
    );

    consent.addDomainEvent(
      new ConsentGranted(
        consent.id.value,
        consent.patientId,
        consent.granteeId,
      ),
    );

    return consent;
  }

  static rehydrate(params: {
    id: ConsentId;
    patientId: string;
    granteeId: string;
    scope: ConsentScope;
    purpose: ConsentPurpose;
    decision: ConsentDecision;
    validFrom: Date;
    validUntil: Date | null;
    conformities: Conformity[];
    createdAt: Date;
    updatedAt: Date;
  }): Consent {
    return new Consent(
      params.id,
      params.patientId,
      params.granteeId,
      params.scope,
      params.purpose,
      params.decision,
      params.validFrom,
      params.validUntil,
      params.conformities,
      params.createdAt,
      params.updatedAt,
    );
  }

  grant(params?: { validUntil?: Date | null }): void {
    if (this.decision.value === ConsentDecision.Allow.value) {
      throw new ConsentAlreadyGrantedError();
    }

    this.decision = ConsentDecision.Allow;
    if (params?.validUntil !== undefined) {
      this.validUntil = params.validUntil ?? null;
    }
    this.updatedAt = new Date();

    this.addDomainEvent(
      new ConsentGranted(this.id.value, this.patientId, this.granteeId),
    );
  }

  revoke(): void {
    if (this.decision.value === ConsentDecision.Deny.value) {
      throw new ConsentAlreadyRevokedError();
    }

    this.decision = ConsentDecision.Deny;
    this.validUntil = new Date();
    this.updatedAt = new Date();

    this.addDomainEvent(
      new ConsentRevoked(this.id.value, this.patientId, this.granteeId),
    );
  }

  requestConformity(params: { id: string; type: ConformityType }): Conformity {
    const conformity = Conformity.request(params);
    this.conformities.push(conformity);
    this.updatedAt = new Date();

    this.addDomainEvent(
      new ConformityRequested(
        this.id.value,
        conformity.id,
        conformity.type.value,
      ),
    );

    return conformity;
  }

  acceptConformity(conformityId: string): void {
    const conformity = this.conformities.find(
      (item) => item.id === conformityId,
    );

    if (!conformity) {
      throw new ConformityNotFoundError();
    }

    conformity.accept();
    this.updatedAt = new Date();

    this.addDomainEvent(new ConformityAccepted(this.id.value, conformity.id));
  }

  rejectConformity(conformityId: string): void {
    const conformity = this.conformities.find(
      (item) => item.id === conformityId,
    );

    if (!conformity) {
      throw new ConformityNotFoundError();
    }

    conformity.reject();
    this.updatedAt = new Date();

    this.addDomainEvent(new ConformityRejected(this.id.value, conformity.id));
  }

  isWithinValidity(at: Date = new Date()): boolean {
    if (at < this.validFrom) {
      return false;
    }
    if (this.validUntil && at > this.validUntil) {
      return false;
    }
    return true;
  }

  isActive(at: Date = new Date()): boolean {
    return (
      this.decision.value === ConsentDecision.Allow.value &&
      this.isWithinValidity(at)
    );
  }

  getDecision(): ConsentDecision {
    return this.decision;
  }

  getValidUntil(): Date | null {
    return this.validUntil;
  }

  getConformities(): Conformity[] {
    return [...this.conformities];
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
