export interface SuspectItem  {
    userId: string
    suspectName: string
    findings: Array<string>
    encoding: string
    encoding_status: string
    objectKey?: string
  }