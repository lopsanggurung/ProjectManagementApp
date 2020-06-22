export class ApiClientBase {
    baseApiUrl = 'http://localhost:5000';

    protected getBaseUrl(defaultUrl: string, baseUrl?: string) {
        return this.baseApiUrl;
    }
}
