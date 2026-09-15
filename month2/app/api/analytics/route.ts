import { NextResponse } from "next/server";
import { getSession } from "../../../lib/session";
import { db } from "../../../lib/turso";
import { LeadStatus, LeadSource } from "../../../types/crm.types";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = session.role === "admin";
  const userFilterSql = isAdmin ? "" : "WHERE assigned_to = ?";
  const userFilterArgs = isAdmin ? [] : [session.userId];

  // 1. Fetch leads for aggregates
  const leadsResult = await db.execute({
    sql: `SELECT id, status, source, value, created_at, assigned_to FROM leads ${userFilterSql} ORDER BY created_at ASC`,
    args: userFilterArgs,
  });

  const leads = leadsResult.rows as unknown as Array<{
    id: string;
    status: LeadStatus;
    source: LeadSource;
    value: number | null;
    created_at: string;
    assigned_to: string | null;
  }>;

  // Total Leads & Value
  const totalLeads = leads.length;
  const totalValue = leads.reduce((acc, lead) => acc + (lead.value || 0), 0);

  // Conversion rate: won / (won + lost)
  const wonCount = leads.filter((l) => l.status === "won").length;
  const lostCount = leads.filter((l) => l.status === "lost").length;
  const closedDeals = wonCount + lostCount;
  const conversionRate = closedDeals > 0 ? Math.round((wonCount / closedDeals) * 100) : 0;

  // Status breakdown
  const statusMap: Record<LeadStatus, number> = {
    new: 0,
    in_progress: 0,
    waiting: 0,
    won: 0,
    lost: 0,
  };
  leads.forEach((l) => {
    if (statusMap[l.status] !== undefined) {
      statusMap[l.status]++;
    }
  });
  const statusBreakdown = Object.entries(statusMap).map(([status, count]) => ({
    status: status as LeadStatus,
    count,
  }));

  // Source breakdown
  const sourceMap: Record<string, number> = {};
  leads.forEach((l) => {
    const src = l.source || "other";
    sourceMap[src] = (sourceMap[src] || 0) + 1;
  });
  const sourceBreakdown = Object.entries(sourceMap).map(([source, count]) => ({
    source: source as LeadSource,
    count,
  }));

  // Leads over time (grouped by day)
  const timeMap: Record<string, number> = {};
  leads.forEach((l) => {
    const dateStr = l.created_at ? l.created_at.split("T")[0] : new Date().toISOString().split("T")[0];
    timeMap[dateStr] = (timeMap[dateStr] || 0) + 1;
  });
  const leadsOverTime = Object.entries(timeMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([date, count]) => ({
      date,
      count,
    }));

  // Team performance (only for admin)
  let teamPerformance;
  if (isAdmin) {
    const usersResult = await db.execute("SELECT id, name FROM users WHERE is_active = 1");
    const users = usersResult.rows as unknown as Array<{ id: string; name: string }>;

    teamPerformance = users.map((u) => {
      const userLeads = leads.filter((l) => l.assigned_to === u.id);
      const userWon = userLeads.filter((l) => l.status === "won").length;
      const userVal = userLeads
        .filter((l) => l.status === "won")
        .reduce((sum, l) => sum + (l.value || 0), 0);

      return {
        userId: u.id,
        userName: u.name,
        won: userWon,
        total: userLeads.length,
        totalValue: userVal,
      };
    });
  }

  return NextResponse.json({
    totalLeads,
    totalValue,
    conversionRate,
    leadsOverTime,
    statusBreakdown,
    sourceBreakdown,
    teamPerformance,
  });
}
