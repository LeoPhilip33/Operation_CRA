import { ActivityReport } from '../interfaces/activity-report';
import { Agent } from '../interfaces/agent';
import { Leave } from '../interfaces/leave';
import { activityReportsSignal, agentsSignal, leavesSignal } from './signals';

export function updateAgent(updatedAgent: Agent) {
  agentsSignal.update((agents) =>
    agents.map((agent) => (agent.id === updatedAgent.id ? updatedAgent : agent))
  );
}

export function updateActivityReport(updatedReport: ActivityReport) {
  activityReportsSignal.update((reports) =>
    reports.map((report) =>
      report.id === updatedReport.id ? updatedReport : report
    )
  );
}

export function updateLeave(updatedLeave: Leave) {
  leavesSignal.update((leaves) =>
    leaves.map((leave) => (leave.id === updatedLeave.id ? updatedLeave : leave))
  );
}

export function addAgent(newAgent: Agent) {
  agentsSignal.update((agents) => [...agents, newAgent]);
}

export function addActivityReport(newReport: ActivityReport) {
  activityReportsSignal.update((reports) => [...reports, newReport]);
}

export function addLeave(newLeave: Leave) {
  leavesSignal.update((leaves) => [...leaves, newLeave]);
}

export function deleteAgent(agentId: number) {
  agentsSignal.update((agents) =>
    agents.filter((agent) => agent.id !== agentId)
  );
}

export function deleteActivityReport(reportId: number) {
  activityReportsSignal.update((reports) =>
    reports.filter((report) => report.id !== reportId)
  );
}

export function deleteLeave(leaveId: number) {
  leavesSignal.update((leaves) =>
    leaves.filter((leave) => leave.id !== leaveId)
  );
}
