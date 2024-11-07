import { AxiosError } from "axios";

const getAxiosErrorMessage = (error: unknown, defaultMessage: string): string => {
    if (error instanceof AxiosError) {
        return error.response!.data.message || defaultMessage;
    }
    return defaultMessage;
};

export default getAxiosErrorMessage;