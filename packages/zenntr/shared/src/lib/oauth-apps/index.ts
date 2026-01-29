export type OAuthApp = {
    id: string;
    created: string;
    updated: string;
    displayName: string;
    clientId: string;
    clientSecret?: string;
    redirectUris: string[];
}
