import { ConformityAlreadyDecidedError } from '../errors';
import { ConformityStatus, ConformityType } from '../value-objects';

export class Conformity {
  private status: ConformityStatus;
  private respondedAt: Date | null;

  private constructor(
    public readonly id: string,
    public readonly type: ConformityType,
    status: ConformityStatus,
    public readonly requestedAt: Date,
    respondedAt: Date | null,
  ) {
    this.status = status;
    this.respondedAt = respondedAt;
  }

  static request(params: { id: string; type: ConformityType }): Conformity {
    return new Conformity(
      params.id,
      params.type,
      ConformityStatus.Requested,
      new Date(),
      null,
    );
  }

  static rehydrate(params: {
    id: string;
    type: ConformityType;
    status: ConformityStatus;
    requestedAt: Date;
    respondedAt: Date | null;
  }): Conformity {
    return new Conformity(
      params.id,
      params.type,
      params.status,
      params.requestedAt,
      params.respondedAt,
    );
  }

  accept(): void {
    if (this.status.value !== ConformityStatus.Requested.value) {
      throw new ConformityAlreadyDecidedError();
    }

    this.status = ConformityStatus.Accepted;
    this.respondedAt = new Date();
  }

  reject(): void {
    if (this.status.value !== ConformityStatus.Requested.value) {
      throw new ConformityAlreadyDecidedError();
    }

    this.status = ConformityStatus.Rejected;
    this.respondedAt = new Date();
  }

  getStatus(): ConformityStatus {
    return this.status;
  }

  getRespondedAt(): Date | null {
    return this.respondedAt;
  }
}
