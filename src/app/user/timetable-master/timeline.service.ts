import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {
  activities: { path: string, time: Date }[] = [];

  addActivity(path: string) {
    this.activities.push({ path, time: new Date() });
  }

  getActivities() {
    return this.activities;
  }
}
