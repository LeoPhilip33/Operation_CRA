import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formatDateToISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function formatDateWithCapitalizedMonth(date: Date): string {
  const formattedDate = format(date, 'MMMM yyyy', { locale: fr });
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}

export function formatDay(date: Date): string {
  return format(date, 'd');
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
}
