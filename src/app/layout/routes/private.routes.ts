import { Routes } from '@angular/router';
import { Role } from '@enums/role';

export const privateRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('../../features/home/home').then( component => component.Home ),
    data: { roles: [Role.ADMIN, Role.REPORTER, Role.MAINTENANCE] }
  },
  {
    path: 'create-report',
    loadComponent: () => import('../../features/create-report/create-report').then( component => component.CreateReport),
    data: { roles: [Role.ADMIN, Role.REPORTER, Role.MAINTENANCE] }
  },
  {
    path: 'task-list',
    loadComponent: () => import('../../features/view-tasks/view-tasks').then( component => component.ViewTasks ),
    data: { roles: [Role.ADMIN, Role.REPORTER, Role.MAINTENANCE] }
  },
  {
    path: 'task/:taskId/update',
    loadComponent: () => import('../../features/task-update/task-update').then( component => component.TaskUpdate ),
    data: { roles: [Role.ADMIN, Role.REPORTER, Role.MAINTENANCE] }
  },
  {
    path: 'task/:taskId',
    loadComponent: () => import('../../features/task-detail/task-detail').then( component => component.TaskDetail ),
    data: { roles: [Role.ADMIN, Role.REPORTER, Role.MAINTENANCE] }
  },
  {
    path: 'admin',
    loadComponent: () => import('../../features/admin/admin-layout/admin-layout').then( component => component.AdminLayout ),
    loadChildren: () => import('../../features/admin/admin.routes').then( routes => routes.adminRoutes ),
    data: { roles: [Role.ADMIN] }
  },
];
