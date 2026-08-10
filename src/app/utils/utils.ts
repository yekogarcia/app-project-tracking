import { toaster } from "@/app/components/ux/toaster";
import { parseISO, format, isValid } from 'date-fns';

export const showToaster = ({ type, description, duration = 3000 }: any) => {
    toaster.create({
        description,
        type,
        closable: true,
        duration,
    });
};

export const formatDateShort = (dateString: string): string => {
    const date = parseISO(dateString);
    if (!isValid(date)) return "";
    return format(date, 'yyyy-MM-dd');
};

export const formatDate = (d: any): string => {
    try {
        if (!d) return "";
        const date = typeof d === 'string' ? parseISO(d) : d;
        if (!isValid(date)) return "";
        return format(date, 'yyyy-MM-dd');
    } catch (e) {
        return "";
    }
};

export const formatNumber = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

export const formatPorcentage = (value: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};