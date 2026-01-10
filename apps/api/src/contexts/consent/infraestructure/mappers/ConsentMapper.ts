/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Prisma,
  ConsentDecision as PrismaConsentDecision,
  ConsentPurpose as PrismaConsentPurpose,
  ConsentScopeType as PrismaConsentScopeType,
  ConformityStatus as PrismaConformityStatus,
  ConformityType as PrismaConformityType,
} from '@prisma/client';
import { Consent } from '../../domain/aggregates';
import { Conformity } from '../../domain/entities/Conformity';
import {
  ConsentDecision,
  ConsentId,
  ConsentPurpose,
  ConsentScope,
  ConformityStatus,
  ConformityType,
} from '../../domain/value-objects';

export type PrismaConsent = Prisma.ConsentGetPayload<{
  include: { conformities: true };
}>;

export class ConsentMapper {
  static toDomain(record: PrismaConsent): Consent {
    const conformities = record.conformities.map((conformity) =>
      Conformity.rehydrate({
        id: conformity.id,
        type: ConformityType.create(conformity.type),
        status: ConformityStatus.fromValue(conformity.status),
        requestedAt: conformity.requestedAt,
        respondedAt: conformity.respondedAt ?? null,
      }),
    );

    return Consent.rehydrate({
      id: ConsentId.fromString(record.id),
      patientId: record.patientId,
      granteeId: record.granteeId,
      scope: ConsentScope.create(record.scopeType, record.scopeRef),
      purpose: ConsentPurpose.create(record.purpose),
      decision: ConsentDecision.fromValue(record.decision),
      validFrom: record.validFrom,
      validUntil: record.validUntil ?? null,
      conformities,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toPersistence(consent: Consent): {
    consent: {
      id: string;
      patientId: string;
      granteeId: string;
      scopeType: PrismaConsentScopeType;
      scopeRef: string;
      purpose: PrismaConsentPurpose;
      decision: PrismaConsentDecision;
      validFrom: Date;
      validUntil: Date | null;
      createdAt: Date;
      updatedAt: Date;
    };
    conformities: {
      id: string;
      consentId: string;
      type: PrismaConformityType;
      status: PrismaConformityStatus;
      requestedAt: Date;
      respondedAt: Date | null;
      createdAt: Date;
      updatedAt: Date;
    }[];
  } {
    const conformities = consent.getConformities().map((conformity) => ({
      id: conformity.id,
      consentId: consent.id.value,
      type: conformity.type.value as PrismaConformityType,
      status: conformity.getStatus().value as PrismaConformityStatus,
      requestedAt: conformity.requestedAt,
      respondedAt: conformity.getRespondedAt(),
      createdAt: conformity.requestedAt,
      updatedAt: conformity.getRespondedAt() ?? conformity.requestedAt,
    }));

    return {
      consent: {
        id: consent.id.value,
        patientId: consent.patientId,
        granteeId: consent.granteeId,
        scopeType: consent.scope.type as PrismaConsentScopeType,
        scopeRef: consent.scope.ref,
        purpose: consent.purpose.value as PrismaConsentPurpose,
        decision: consent.getDecision().value as PrismaConsentDecision,
        validFrom: consent.validFrom,
        validUntil: consent.getValidUntil(),
        createdAt: consent.createdAt,
        updatedAt: consent.getUpdatedAt(),
      },
      conformities,
    };
  }
}
