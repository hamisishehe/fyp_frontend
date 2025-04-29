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
import { CoordinatorAssignCourseComponent } from './user/coordinator/coordinator-assign-course/coordinator-assign-course.component';
import { AdminLayoutComponent } from './user/admin/admin-layout/admin-layout.component';
import { TMasterSidebarComponent } from './user/timetable-master/t-master-sidebar/t-master-sidebar.component';
import { TMasterHeaderComponent } from './user/timetable-master/t-master-header/t-master-header.component';

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
        path: 'user/timetable-master/dashboard',
        component: TMasterDashboardComponent,
        canActivate: [authGuardGuard],
      },
      {
        path: 'user/timetable-master/examination',
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
        path: 'user/coordinator/dashboard',
        component: CoordinatorDashboardComponent,
        canActivate: [authGuardGuard],
      },
      {
        path: 'user/coordinator/students',
        component: CoordinatorStudentsComponent,
        canActivate: [authGuardGuard],
      },
      {
        path: 'user/coordinator/course',
        component: CoordinatorCourseComponent,
        canActivate: [authGuardGuard],
      },
      {
        path: 'user/coordinator/assign-course',
        component: CoordinatorAssignCourseComponent,
        canActivate: [authGuardGuard],
      },
      {
        path: 'user/coordinator/profile',
        component: CoordinatorProfileComponent,
        canActivate: [authGuardGuard],
      },
      {
        path: 'user/coordinator/instructors',
        component: CoordinatorInstructorsComponent,
        canActivate: [authGuardGuard],
      },
      {
        path: 'user/coordinator/settings',
        component: CoordinatorSettingsComponent,
        canActivate: [authGuardGuard],
      },

    ],
  },

  //end routes for Coordinator


  //router for admin
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuardGuard],
    children: [
      {
        path: 'user/admin/dashboard',
        component: TMasterDashboardComponent,
        canActivate: [authGuardGuard],
      },

    ],
  },
  //end admin router

  // Default redirect for empty path
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

  // Wildcard route for 404
  { path: '**', redirectTo: '/notfound' },
];
