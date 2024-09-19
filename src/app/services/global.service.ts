import { Injectable } from '@angular/core';
import { ActivityReport } from '../interfaces/activity-report';
import { Leave } from '../interfaces/leave';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  checkForOverlappingActivities(
    startDate: Date,
    endDate: Date,
    agentId: number,
    activityReports: ActivityReport[],
    currentActivityReportId?: number
  ): boolean {
    return activityReports
      .filter(
        (activity) =>
          Number(activity.agentId) === Number(agentId) &&
          Number(activity.id) !== Number(currentActivityReportId)
      )
      .some((activity) => {
        const activityStart = new Date(activity.startDate);
        const activityEnd = new Date(activity.endDate);
        return startDate <= activityEnd && endDate >= activityStart;
      });
  }

  checkForExistingLeave(
    startDate: Date,
    endDate: Date,
    agentId: number,
    leaves: Leave[],
    currentLeaveId?: number
  ): boolean {
    return leaves
      .filter(
        (leave) =>
          Number(leave.agentId) === Number(agentId) &&
          Number(leave.id) !== Number(currentLeaveId)
      )
      .some((leave) => {
        const leaveStart = new Date(leave.startDate);
        const leaveEnd = new Date(leave.endDate);
        return startDate <= leaveEnd && endDate >= leaveStart;
      });
  }
}
