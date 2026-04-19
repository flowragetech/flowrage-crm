import { buildNavItems, moduleToggles } from '@/config/module-registry';
import { NavItem } from '@/types';

export { moduleToggles };

export const navItems: NavItem[] = buildNavItems();
