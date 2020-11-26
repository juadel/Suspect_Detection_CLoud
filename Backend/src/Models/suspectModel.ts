export interface SuspectItem  {
    userId: string
    name: string
    findings: Array<string>
    encoding: string
    encoding_status: string
    objectKey?: string
  }