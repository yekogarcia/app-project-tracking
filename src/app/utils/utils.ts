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