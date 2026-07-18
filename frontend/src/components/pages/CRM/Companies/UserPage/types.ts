// Base interfaces
export interface Introduction {
  id: number;
  method: string;
  introduction_date: string;
  location?: string;
  status: string;
  marketing_staff_id?: number;
}

export interface Lead {
  id: number;
  priority: string;
  created_at: string;
  updated_at: string;
}

export interface StageChange {
  id: number;
  previous_stage: string;
  new_stage: string;
  changed_at: string;
  note?: string | null;
  [key: string]: unknown;
}

export interface Pipeline {
  id: number;
  stage: string;
  new_stage?: string;
  changed_at?: string;
  note?: string;
  stage_changes: StageChange[];
}

export interface Contract {
  id: number;
  contract_date: string;
  amount: number;
  delivery_date: string;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: number;
  name: string;
  type: string;
  note?: string;
  created_at: string;
  updated_at: string;
}

// Main company data interface
export interface CompanyData {
  id: number;
  first_name: string;
  last_name: string;
  company_name: string;
  company_email?: string;
  company_phone?: string;
  status: string;
  introductions: Introduction[];
  leads: Lead[];
  pipelines: Pipeline[];
  contracts: Contract[];
  activities: Activity[];
  created_at: string;
  updated_at: string;
}

// Props interfaces
export interface CompanyDetailsProps {
  // No props needed as it uses useParams internally
}

export interface IntroductionProps {
  queryData: Introduction[];
}

export interface LeadProps {
  queryData: Lead[];
}

export interface PipelineProps {
  queryData: Pipeline[];
}

export interface ContractProps {
  queryData: Contract[];
}

export interface ActivitiesProps {
  // No props needed as it uses useParams internally
}
