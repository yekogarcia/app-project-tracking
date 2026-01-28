import { toaster } from "@/app/components/ux/toaster";

export const showToaster = ({ type, description, duration = 3000 }: any) => {
    toaster.create({
        description,
        type,
        closable: true,
        duration,
    });
};

export const formatDateShort = (dateString: string): string => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-CA');
    return formattedDate;
}

export const formatDate = (d: any) => {
    try {
        if (!d) return "";
        const dt = new Date(d);
        if (isNaN(dt.getTime())) return "";
        return dt.toISOString().slice(0, 10);
    } catch (e) {
        return "";
    }
};

 export const formatNumber = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(value);
  };