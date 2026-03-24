import { useState, useEffect } from "react";

export interface PayrollEntry {
  position: string;
  count: number;
  salary: number;       // per person per month (gross)
  estimated?: boolean;  // true when salary is a midpoint of a range
}

export interface ParastatalGroup {
  id: string;
  name: string;
  arm: string;
  color: string;
  bg: string;
  entries: PayrollEntry[];
  monthlyTotal: number;
  yearlyTotal: number;
}

export interface PayrollSummary {
  groups: ParastatalGroup[];
  grandMonthly: number;
  grandYearly: number;
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

function sal(node: any, fallback: number): number {
  const v = node?.salary_ksh_monthly_gross;
  return typeof v === "number" ? v : fallback;
}

function buildGroups(tree: any): ParastatalGroup[] {
  const n = (id: string) => findNode(tree, id);

  const groups: Omit<ParastatalGroup, "monthlyTotal" | "yearlyTotal">[] = [
    {
      id: "executive",
      name: "National Executive",
      arm: "executive",
      color: "#2E7D32",
      bg: "#E8F5E9",
      entries: [
        { position: "President", count: 1, salary: sal(n("president"), 1443750) },
        { position: "Deputy President", count: 1, salary: sal(n("deputy_president"), 1227188) },
        { position: "Head of Public Service", count: 1, salary: sal(n("head_of_public_service"), 765188) },
        { position: "Attorney General", count: 1, salary: sal(n("attorney_general"), 924000) },
        {
          position: "Cabinet Secretaries",
          count: 22,
          salary: sal(n("cabinet"), 924000),
        },
        {
          position: "Principal Secretaries",
          count: n("principal_secretaries")?.members?.length ?? 55,
          salary: sal(n("principal_secretaries"), 765188),
        },
      ],
    },
    {
      id: "legislature",
      name: "Parliament",
      arm: "legislature",
      color: "#1565C0",
      bg: "#E3F2FD",
      entries: [
        { position: "Speaker — National Assembly", count: 1, salary: sal(n("national_assembly"), 1208362) },
        { position: "Speaker — Senate", count: 1, salary: sal(n("senate"), 1208362) },
        { position: "Deputy Speaker — National Assembly", count: 1, salary: sal(n("dsp_na"), 739600) },
        { position: "Majority Leader — National Assembly", count: 1, salary: sal(n("majority_leader_na"), 739600) },
        { position: "Minority Leader — National Assembly", count: 1, salary: sal(n("minority_leader_na"), 739600) },
        { position: "Deputy Speaker — Senate", count: 1, salary: sal(n("dsp_senate"), 739600) },
        { position: "Majority Leader — Senate", count: 1, salary: sal(n("majority_leader_senate"), 739600) },
        { position: "Minority Leader — Senate", count: 1, salary: sal(n("minority_leader_senate"), 739600) },
        {
          position: "Members of Parliament",
          count: n("mps")?.members?.length ?? 349,
          salary: sal(n("mps"), 739600),
        },
        {
          position: "Senators",
          count: n("senators")?.members?.length ?? 47,
          salary: sal(n("senators"), 739600),
        },
      ],
    },
    {
      id: "judiciary",
      name: "The Judiciary",
      arm: "judiciary",
      color: "#6A1B9A",
      bg: "#F3E5F5",
      entries: [
        { position: "Chief Justice", count: 1, salary: sal(n("chief_justice"), 1403942) },
        { position: "Deputy Chief Justice", count: 1, salary: sal(n("dcj"), 1304185) },
        { position: "Supreme Court Justices", count: 5, salary: sal(n("sc_ibrahim"), 1150000) },
        { position: "Court of Appeal Justices", count: 50, salary: 900000, estimated: true },
        { position: "High Court Judges", count: 160, salary: 625000, estimated: true },
      ],
    },
    {
      id: "county",
      name: "County Governments",
      arm: "county",
      color: "#00695C",
      bg: "#E0F2F1",
      entries: [
        // Governor / Deputy Governor salaries not in JSON tree — SRC gazette values
        { position: "County Governors", count: 47, salary: 990000 },
        { position: "Deputy Governors", count: 47, salary: 684233 },
        { position: "County Assembly Speakers", count: 47, salary: sal(n("county_assembly_structure"), 549283) },
        { position: "County Executive Committee Members", count: 470, salary: sal(n("cecms"), 422526) },
        { position: "Members of County Assembly (MCAs)", count: 1950, salary: sal(n("mcas"), 164588) },
      ],
    },
  ];

  return groups.map((g) => {
    const monthlyTotal = g.entries.reduce((sum, e) => sum + e.count * e.salary, 0);
    return { ...g, monthlyTotal, yearlyTotal: monthlyTotal * 12 };
  });
}

export function usePayrollData(): PayrollSummary {
  const [data, setData] = useState<PayrollSummary>({
    groups: [],
    grandMonthly: 0,
    grandYearly: 0,
    loading: true,
  });

  useEffect(() => {
    fetch("/data/kenya_government_structure.json")
      .then((res) => res.json())
      .then((json) => {
        const groups = buildGroups(json.tree);
        const grandMonthly = groups.reduce((s, g) => s + g.monthlyTotal, 0);
        setData({ groups, grandMonthly, grandYearly: grandMonthly * 12, loading: false });
      })
      .catch(() => setData((prev) => ({ ...prev, loading: false })));
  }, []);

  return data;
}
