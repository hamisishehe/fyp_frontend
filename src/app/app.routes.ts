import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { TimetableMasterLayoutComponent } from './user/timetable-master/timetable-master-layout/timetable-master-layout.component';
import { TMasterDashboardComponent } from './user/timetable-master/t-master-dashboard/t-master-dashboard.component';
import { NotfoundComponent } from './user/notfound/notfound.component';
import { authGuardGuard } from './auth/guard.guard';
import { TMasterUeTimetableComponent } from './user/timetable-master/t-master-ue-timetable/t-master-ue-timetable.component';
import { TMasterTeachingTimetableComponent } from './user/timetable-master/t-master-teaching-timetable/t-master-teaching-timetable.component';
import { TMasterProfileComponent } from './user/timetable-master/t-master-profile/t-master-profile.component';
import { TMasterSettingsComponent } from './user/timetable-master/t-master-settings/t-master-settings.component';
import { TMasterFilesComponent } from './user/timetable-master/t-master-files/t-master-files.component';
import { CoordinatorLayoutComponent } from './user/coordinator/coordinator-layout/coordinator-layout.component';
import { CoordinatorDashboardComponent } from './user/coordinator/coordinator-dashboard/coordinator-dashboard.component';
import { CoordinatorStudentsComponent } from './user/coordinator/coordinator-students/coordinator-students.component';
import { CoordinatorCourseComponent } from './user/coordinator/coordinator-course/coordinator-course.component';
import { CoordinatorProfileComponent } from './user/coordinator/coordinator-profile/coordinator-profile.component';
import { CoordinatorSettingsComponent } from './user/coordinator/coordinator-settings/coordinator-settings.component';
import { CoordinatorInstructorsComponent } from './user/coordinator/coordinator-instructors/coordinator-instructors.component';

export const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'notfound', component: NotfoundComponent },

  //routes for timetable master
  {
    path: '',
    component: TimetableMasterLayoutComponent,
    canActivate: [authGuardGuard],
    children: [
      {
        path: 'user/timetable-master/t-master-dashboard',
        component: TMasterDashboardComponent,
        canActivate: [authGuardGuard],
      },
      {
        path: 'user/timetable-master/ue',
        component: TMasterUeTimetableComponent,
        canActivate: [authGuardGuard],
      },
      {
        path: 'user/timetable-master/teaching',
        component: TMasterTeachingTimetableComponent,
        canActivate: [authGuardGuard],
      },
      {
        path: 'user/timetable-master/profile',
        component: TMasterProfileComponent,
        canActivate: [authGuardGuard],
      },
      {
        path: 'user/timetable-master/settings',
        component: TMasterSettingsComponent,
        canActivate: [authGuardGuard],
      },
      {
        path: 'user/timetable-master/files',
        component: TMasterFilesComponent,
        canActivate: [authGuardGuard],
      },
    ],
  },
  //end routes for timetable master

  //routes for Coordinator

  {
    path: '',
    component: CoordinatorLayoutComponent,
    canActivate: [authGuardGuard],
    children: [
      {
        path: 'user/coordinator/coordinator-dashboard',
        component: CoordinatorDashboardComponent,
        canActivate: [authGuardGuard],
      },
      {
        path: 'user/coordinator/coordinator-students',
        component: CoordinatorStudentsComponent,
        canActivate: [authGuardGuard],
      },
      {
        path: 'user/coordinator/coordinator-course',
        component: CoordinatorCourseComponent,
        canActivate: [authGuardGuard],
      },
      {
        path: 'user/coordinator/coordinator-profile',
        component: CoordinatorProfileComponent,
        canActivate: [authGuardGuard],
      },
      {
        path: 'user/coordinator/coordinator-instructors',
        component: CoordinatorInstructorsComponent,
        canActivate: [authGuardGuard],
      },
      {
        path: 'user/coordinator/coordinator-settings',
        component: CoordinatorSettingsComponent,
        canActivate: [authGuardGuard],
      },

    ],
  },


  //end routes for Coordinator

  // Default redirect for empty path
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

  // Wildcard route for 404
  { path: '**', redirectTo: '/notfound' },
];
