import { AggregateRoot } from 'src/shared';
import { TreatmentAlreadyClosedError } from '../errors';
import { TreatmentClosed, TreatmentStarted } from '../events';
import {
  TreatmentGoal,
  TreatmentId,
  TreatmentPeriod,
  TreatmentStatus,
} from '../value-objects';

export class Treatment extends AggregateRoot {
  private status: TreatmentStatus;
  private period: TreatmentPeriod;
  private updatedAt: Date;

  private constructor(
    public readonly id: TreatmentId,
    public readonly patientId: string,
    public readonly professionalId: string,
    public readonly organizationId: string | null,
    public readonly goal: TreatmentGoal,
    period: TreatmentPeriod,
    status: TreatmentStatus,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();
    this.period = period;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public readonly createdAt: Date;

  static start(params: {
    id: TreatmentId;
    patientId: string;
    professionalId: string;
    organizationId?: string | null;
    goal: TreatmentGoal;
  }): Treatment {
    const now = new Date();
    const treatment = new Treatment(
      params.id,
      params.patientId,
      params.professionalId,
      params.organizationId ?? null,
      params.goal,
      TreatmentPeriod.startNow(),
      TreatmentStatus.Active,
      now,
      now,
    );

    treatment.addDomainEvent(
      new TreatmentStarted(
        treatment.id.value,
        treatment.patientId,
        treatment.professionalId,
      ),
    );

    return treatment;
  }

  static rehydrate(params: {
    id: TreatmentId;
    patientId: string;
    professionalId: string;
    organizationId: string | null;
    goal: TreatmentGoal;
    period: TreatmentPeriod;
    status: TreatmentStatus;
    createdAt: Date;
    updatedAt: Date;
  }): Treatment {
    return new Treatment(
      params.id,
      params.patientId,
      params.professionalId,
      params.organizationId,
      params.goal,
      params.period,
      params.status,
      params.createdAt,
      params.updatedAt,
    );
  }

  close(): void {
    if (this.status.value === TreatmentStatus.Closed.value) {
      throw new TreatmentAlreadyClosedError();
    }

    this.period = this.period.closeNow();
    this.status = TreatmentStatus.Closed;
    this.updatedAt = new Date();

    this.addDomainEvent(
      new TreatmentClosed(
        this.id.value,
        this.patientId,
        this.professionalId,
      ),
    );
  }

  isActive(): boolean {
    return this.status.isActive();
  }

  getStatus(): TreatmentStatus {
    return this.status;
  }

  getPeriod(): TreatmentPeriod {
    return this.period;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
