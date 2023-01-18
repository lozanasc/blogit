import md5 from "md5";

type CompareFunction = (inputPassword: string, currentPassword: string) => boolean;

export const compare: CompareFunction = (inputPassword, currentPassword) => currentPassword === md5(inputPassword);