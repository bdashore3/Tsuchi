export type Ifttt = {
    event_name: string;
    key: string;
};

export type Spontit = {
    userId: string;
    secretKey: string;
};

export type GenericService = {
    service_name: string;
    api_name?: string;
    api_secret?: string;
    username?: string;
};
