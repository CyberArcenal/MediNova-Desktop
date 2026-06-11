// src/layouts/components/SidebarMenuData.ts
import {
  LayoutDashboard,
  Users,
  Calendar,
  Syringe,
  Package,
  Stethoscope,
  CreditCard,
  FileText,
  BarChart3,
  Settings,
  Bell,
  Activity,
  UserCog,
  ClipboardList,
  DollarSign,
  Camera,
  FileSpreadsheet,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface MenuItem {
  path: string;
  name: string;
  icon: LucideIcon;
  category?: string;
  children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  // Dashboard
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: LayoutDashboard,
    category: "main",
  },
  // Clients
  {
    path: "/clients",
    name: "Clients",
    icon: Users,
    category: "main",
    children: [
      { path: "/clients/list", name: "All Clients", icon: Users },
      { path: "/clients/add", name: "Add New Client", icon: UserCog },
      { path: "/clients/analytics", name: "Client Analytics", icon: BarChart3 },
    ],
  },
  // Appointments
  {
    path: "/appointments",
    name: "Appointments",
    icon: Calendar,
    category: "scheduling",
    children: [
      { path: "/appointments/calendar", name: "Calendar View", icon: Calendar },
      { path: "/appointments/list", name: "Appointment List", icon: ClipboardList },
      { path: "/appointments/create", name: "Book Appointment", icon: Activity },
    ],
  },
  // Treatments
  {
    path: "/treatments",
    name: "Treatments",
    icon: Syringe,
    category: "services",
    children: [
      { path: "/treatments/list", name: "All Treatments", icon: Syringe },
      { path: "/treatments/categories", name: "Categories", icon: Stethoscope },
      { path: "/treatments/packages", name: "Packages", icon: Package },
    ],
  },
  // Packages
  {
    path: "/packages",
    name: "Packages",
    icon: Package,
    category: "services",
  },
  // Staff
  {
    path: "/staff",
    name: "Staff",
    icon: UserCog,
    category: "management",
    children: [
      { path: "/staff/list", name: "Staff Directory", icon: Users },
      { path: "/staff/schedule", name: "Staff Schedule", icon: Calendar },
      { path: "/staff/performance", name: "Performance", icon: BarChart3 },
    ],
  },
  // Billing
  {
    path: "/billing",
    name: "Billing",
    icon: DollarSign,
    category: "financial",
    children: [
      { path: "/invoices", name: "Invoices", icon: FileText },
      { path: "/payments", name: "Payments", icon: CreditCard },
      // { path: "/payments/records", name: "Payment History", icon: FileSpreadsheet },
    ],
  },
  // Reports
  {
    path: "/reports",
    name: "Reports",
    icon: BarChart3,
    category: "analytics",
    children: [
      { path: "/reports/revenue", name: "Revenue Report", icon: DollarSign },
      { path: "/reports/appointments", name: "Appointments Report", icon: Calendar },
      { path: "/reports/clients", name: "Client Retention", icon: Users },
    ],
  },
  // Analytics
  {
    path: "/analytics",
    name: "Analytics",
    icon: Activity,
    category: "analytics",
  },
  // Photos (Before/After)
  {
    path: "/photos",
    name: "Client Photos",
    icon: Camera,
    category: "clients",
  },
  // Notifications
  {
    path: "/notifications",
    name: "Notifications",
    icon: Bell,
    category: "system",
  },
  // Settings
  {
    path: "/settings",
    name: "Settings",
    icon: Settings,
    category: "system",
    children: [
      { path: "/settings/general", name: "General", icon: Settings },
      { path: "/settings/users", name: "User Management", icon: UserCog },
      { path: "/settings/backup", name: "Backup", icon: FileSpreadsheet },
    ],
  },
  // Logout (special, handled separately)
  {
    path: "/logout",
    name: "Logout",
    icon: LogOut,
    category: "system",
  },
];

export const categories = [
  { id: "main", name: "Main Navigation" },
  { id: "scheduling", name: "Scheduling" },
  { id: "services", name: "Services & Packages" },
  { id: "management", name: "Staff Management" },
  { id: "financial", name: "Financial" },
  { id: "analytics", name: "Analytics & Reports" },
  { id: "clients", name: "Client Management" },
  { id: "system", name: "System" },
];