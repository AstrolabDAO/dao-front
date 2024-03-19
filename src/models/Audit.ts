import { Brand } from "./Brand";
import { Resource, ActivityStatus, Severity } from "./enums";
import { ISlugged } from "./types";
import { UpdatableSlugged } from "./Updatable";

export interface IAuditFinding extends ISlugged {
  severity: Severity;
  description: string;
  fixed: boolean;
}

export interface ICalendarEvent extends ISlugged {
  date: number;
  description: string; // eg. audit revision details
}

export class Audit extends UpdatableSlugged {

  static resource: Resource = "audit";
  description="";
  auditor={} as Brand;
  dateStart=0;
  dateStop=0;
  status=ActivityStatus.ACTIVE;
  events: ICalendarEvent[] = [];
  findings: IAuditFinding[] = [];
  findingsBySeverity: { [severity: string]: IAuditFinding[] } = {};

  constructor() {
    super();
  }

  public async init(o: Partial<Audit>): Promise<Audit> {
    await super.init(o as UpdatableSlugged);
    this.auditor = await Brand.get(o.auditor) ?? {} as Brand;
    this.dateStart = o.dateStart ?? Date.now();
    this.status = o.status ?? ActivityStatus.ACTIVE;
    this.events = o.events ?? [];
    this.description = o.description ?? "";
    this.findings = o.findings ?? [];
    this.findingsBySeverity = o.findingsBySeverity ?? {};
    this.populateSearchIndex?.();
    return this;
  }

  protected override populateSearchIndex?() {
    this.updateSearchIndex([
      this.name,
      this.slug,
      this.auditor?.name,
      this.auditor?.slug,
    ]);
  }
}
