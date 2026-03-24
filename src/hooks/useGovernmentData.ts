import { useState, useEffect } from "react";

export interface CountyMember {
  county_code: number;
  county: string;
  governor: string;
  deputy_governor: string;
  party: string;
  notes?: string;
}

export interface MP {
  name: string;
  party: string;
  constituency: string;
  county: string | null;
}

export interface Senator {
  county_code: number;
  county: string;
  senator: string;
  party: string;
}

export interface SalaryBreakdown {
  basic: number;
  house_allowance: number;
  market_adjustment: number;
}

export interface MPMeta {
  salary_breakdown: SalaryBreakdown;
  constitutional_basis: string;
  term: string;
  appointment_method: string;
  notes: string;
  salary_source: string;
}

export interface SalaryInfo {
  mp: number;
  mca: number;
  cecm: number;
  speaker: number;
}

export interface GovernmentData {
  counties: CountyMember[];
  mps: MP[];
  senators: Senator[];
  salaries: SalaryInfo;
  mpMeta: MPMeta;
  loading: boolean;
}

function findNode(node: any, id: string): any {
  if (node?.id === id) return node;
  for (const child of node?.children || []) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
}

/**
 * Validates that a county member has all required properties
 */
function isValidCountyMember(member: any): member is CountyMember {
  return (
    member &&
    typeof member.county_code === "number" &&
    typeof member.county === "string" &&
    typeof member.governor === "string" &&
    typeof member.deputy_governor === "string" &&
    typeof member.party === "string" &&
    member.county_code != null &&
    member.county != null &&
    member.governor != null &&
    member.deputy_governor != null &&
    member.party != null
  );
}

/**
 * Validates that an MP has all required properties.
 * county may be null for nominated MPs.
 */
function isValidMP(mp: any): mp is MP {
  return (
    mp &&
    typeof mp.name === "string" &&
    typeof mp.party === "string" &&
    typeof mp.constituency === "string" &&
    mp.name != null &&
    mp.party != null &&
    mp.constituency != null &&
    (mp.county === null || typeof mp.county === "string")
  );
}

/**
 * Validates that a senator has all required properties
 */
function isValidSenator(senator: any): senator is Senator {
  return (
    senator &&
    typeof senator.county_code === "number" &&
    typeof senator.county === "string" &&
    typeof senator.senator === "string" &&
    typeof senator.party === "string" &&
    senator.county_code != null &&
    senator.county != null &&
    senator.senator != null &&
    senator.party != null
  );
}

export function useGovernmentData(): GovernmentData {
  const defaultMPMeta: MPMeta = {
    salary_breakdown: { basic: 443760, house_allowance: 150000, market_adjustment: 145840 },
    constitutional_basis: "Art. 97–99, Constitution of Kenya 2010",
    term: "5 years",
    appointment_method: "Popular direct election (constituencies); Presidential nomination (nominated seats)",
    notes: "CWR = County Women Representative.",
    salary_source: "SRC Gazette Notice No. 10346 (9 Aug 2023)",
  };

  const [data, setData] = useState<GovernmentData>({
    counties: [],
    mps: [],
    senators: [],
    salaries: { mp: 739600, mca: 164588, cecm: 422526, speaker: 549283 },
    mpMeta: defaultMPMeta,
    loading: true,
  });

  useEffect(() => {
    fetch("/data/kenya_government_structure.json")
      .then((res) => res.json())
      .then((json) => {
        const tree = json.tree;
        const countyGov = findNode(tree, "county_governments");
        const mpsNode = findNode(tree, "mps");
        const senatorsNode = findNode(tree, "senators");
        const mcasNode = findNode(tree, "mcas");
        const cecmNode = findNode(tree, "cecms");
        const speakerNode = findNode(tree, "county_assembly_structure");

        // Filter and validate all data to ensure no null values slip through
        const validCounties = (countyGov?.members || []).filter(isValidCountyMember);
        const validMPs = (mpsNode?.members || []).filter(isValidMP);
        const validSenators = (senatorsNode?.members || []).filter(isValidSenator);

        setData({
          counties: validCounties,
          mps: validMPs,
          senators: validSenators,
          salaries: {
            mp: mpsNode?.salary_ksh_monthly_gross || 739600,
            mca: mcasNode?.salary_ksh_monthly_gross || 164588,
            cecm: cecmNode?.salary_ksh_monthly_gross || 422526,
            speaker: speakerNode?.salary_ksh_monthly_gross || 549283,
          },
          mpMeta: {
            salary_breakdown: mpsNode?.salary_breakdown || defaultMPMeta.salary_breakdown,
            constitutional_basis: mpsNode?.constitutional_basis || defaultMPMeta.constitutional_basis,
            term: mpsNode?.term || defaultMPMeta.term,
            appointment_method: mpsNode?.appointment_method || defaultMPMeta.appointment_method,
            notes: mpsNode?.notes || defaultMPMeta.notes,
            salary_source: mpsNode?.salary_source || defaultMPMeta.salary_source,
          },
          loading: false,
        });
      })
      .catch(() => setData((prev) => ({ ...prev, loading: false })));
  }, []);

  return data;
}