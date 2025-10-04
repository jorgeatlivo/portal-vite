import { lazy } from 'react';

import { ProtectedRoutesEnum, VisibleTabEnum } from '@/services/account';

import { ActivityPage } from '@/pages/ActivityPage';
import { Calendar } from '@/pages/Calendar/CalendarPage';
import { ConfigurationPage } from '@/pages/ConfigurationPage';
import { DocumentationPage } from '@/pages/DocumentationPage';
import { StaffPage } from '@/pages/StaffPage';

const LazyShiftPage = lazy(() => import('@/pages/Shift/ShiftsPage'));
const LazyOfferPage = lazy(() => import('@/pages/Offers'));

export type RouteProps = {
  name: string;
  path: string;
  iconName?: string;
  component: React.FC;
  id: VisibleTabEnum | ProtectedRoutesEnum;
  notifications?: number;
  configRoute?: boolean;
};

export const RouteBreadcrumbs = {
  AlertsPage: 'activity',
  Calendar: 'calendar',
  ShiftsPage: 'shifts',
  OffersPage: 'offers',
  DocumentationPage: 'documentation',
  StaffPage: 'staff',
  ConfigurationPage: 'configuration',
  ShiftClaimDetailsPage: 'shift-claim',
} as const;

export type RouteBreadcrumb =
  (typeof RouteBreadcrumbs)[keyof typeof RouteBreadcrumbs];

export const oldRouteRedirects = [
  { old: '/actividad', new: `/${RouteBreadcrumbs.AlertsPage}` },
  { old: '/turnos-publicados', new: `/${RouteBreadcrumbs.ShiftsPage}` },
  { old: '/ofertas-publicadas', new: `/${RouteBreadcrumbs.OffersPage}` },
  { old: '/documentacion', new: `/${RouteBreadcrumbs.DocumentationPage}` },
  { old: '/internal-professionals', new: `/${RouteBreadcrumbs.ShiftsPage}` },
  {
    old: '/facility-staff',
    new: `/${RouteBreadcrumbs.ConfigurationPage}?tab=PERMISSIONS`,
  },
  {
    old: '/configuration-management',
    new: `/${RouteBreadcrumbs.ConfigurationPage}?tab=GENERAL_INFO`,
  },
  {
    old: `/${RouteBreadcrumbs.ShiftClaimDetailsPage}/:id`,
    new: (id: string) =>
      `/${RouteBreadcrumbs.DocumentationPage}?action=check-claim&${id}`,
  },
] as const;

export const protectedRoutes = [
  {
    name: 'route_activity',
    iconName: 'bell',
    path: `/${RouteBreadcrumbs.AlertsPage}`,
    component: ActivityPage,
    id: VisibleTabEnum.ACTIONABLE_SHIFTS,
  },
  {
    name: 'route_calendar',
    iconName: 'calendar',
    path: `/${RouteBreadcrumbs.Calendar}`,
    component: Calendar,
    id: VisibleTabEnum.CALENDAR,
  },
  {
    name: 'route_shifts',
    iconName: 'report-medical',
    path: `/${RouteBreadcrumbs.ShiftsPage}`,
    component: LazyShiftPage,
    id: VisibleTabEnum.NEXT_SHIFTS_LIST,
  },
  {
    name: 'route_offers',
    iconName: 'briefcase',
    path: `/${RouteBreadcrumbs.OffersPage}`,
    component: LazyOfferPage,
    id: VisibleTabEnum.OFFER_MANAGEMENT,
  },
  {
    name: 'route_documentation',
    iconName: 'file-text',
    path: `/${RouteBreadcrumbs.DocumentationPage}`,
    component: DocumentationPage,
    id: VisibleTabEnum.LEGAL_DOCUMENTATION,
  },
  {
    name: 'route_staff',
    iconName: 'users',
    path: `/${RouteBreadcrumbs.StaffPage}`,
    component: StaffPage,
    id: VisibleTabEnum.INTERNAL_STAFF_MANAGEMENT,
  },
  {
    name: 'route_configuration',
    iconName: 'adjustments-alt',
    path: `/${RouteBreadcrumbs.ConfigurationPage}`,
    component: ConfigurationPage,
    id: VisibleTabEnum.CONFIGURATION_MANAGEMENT,
    configRoute: true,
  },
] as RouteProps[];
