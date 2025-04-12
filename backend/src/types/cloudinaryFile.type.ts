import { Url } from "url";

export type FileDetailsType = {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    path: string;
    size: number;
    filename: string;
};

export type DocumentFilesType = {
    aadhar: FileDetailsType[];
    pan: FileDetailsType[];
    signature: FileDetailsType[];
};
