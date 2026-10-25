import {
  Bookmark,
  BookOpen,
  Cpu,
  LayoutDashboard,
  Stethoscope,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/explorer", label: "Chipset Explorer", icon: Cpu },
  { href: "/learn", label: "Learning Centre", icon: BookOpen },
  { href: "/repairs", label: "Repair Repository", icon: Wrench },
  { href: "/diagnose", label: "Diagnostic Game", icon: Stethoscope },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
];
