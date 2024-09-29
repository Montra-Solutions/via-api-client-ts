// Ensure that you're using Axios version 1.x where InternalAxiosRequestConfig is exported.
// If you're using an older version of Axios (e.g., 0.27.x), the types may be different, and you may need to adjust accordingly.
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import { AuthError, APIRequestError } from './errors/index';
import { IViaClientConfig } from './types/IViaClientConfig.interface';


/**
 * @class ViaClient
 * @classdesc A client for interacting with the Via API.
 * 
 * @param {IViaClientConfig} config - Configuration object for initializing the ViaClient.
 * @param {string} config.baseURL - The base URL of the Via API.
 * @param {string} config.tokenHash - The token hash for authentication.
 * @param {string} config.email - The email associated with the Via account.
 * 
 * @throws {Error} If baseURL, tokenHash, or email are not provided.
 * 
 * @method get
 * @description Helper method for making GET requests.
 * @template T
 * @param {string} url - The endpoint URL.
 * @param {object} [params={}] - The query parameters.
 * @param {AxiosRequestConfig} [config={}] - Additional Axios request configuration.
 * @returns {Promise<T>} The response data.
 * @throws {APIRequestError} If the request fails.
 * 
 * @method post
 * @description Helper method for making POST requests.
 * @template T
 * @param {string} url - The endpoint URL.
 * @param {object} [data={}] - The request payload.
 * @param {AxiosRequestConfig} [config={}] - Additional Axios request configuration.
 * @returns {Promise<T>} The response data.
 * @throws {APIRequestError} If the request fails.
 * 
 * @method put
 * @description Helper method for making PUT requests.
 * @template T
 * @param {string} url - The endpoint URL.
 * @param {object} [data={}] - The request payload.
 * @param {AxiosRequestConfig} [config={}] - Additional Axios request configuration.
 * @returns {Promise<T>} The response data.
 * @throws {APIRequestError} If the request fails.
 * 
 * @method delete
 * @description Helper method for making DELETE requests.
 * @template T
 * @param {string} url - The endpoint URL.
 * @param {object} [data={}] - The request payload.
 * @param {AxiosRequestConfig} [config={}] - Additional Axios request configuration.
 * @returns {Promise<T>} The response data.
 * @throws {APIRequestError} If the request fails.
 *
 * @method getAccessToken
 * @description Retrieves a new access token if the current one is expired or not available.
 * @returns {Promise<string>} The access token.
 * @throws {AuthError} If there is an error obtaining the access token.
 * 
 * @method handleAPIError
 * @description Handles API request errors.
 * @param {string} method - The HTTP method (GET, POST, PUT, etc.).
 * @param {string} url - The endpoint URL.
 * @param {any} error - The error object.
 * @throws {APIRequestError} Always throws an APIRequestError with a detailed message.
 */
export class ViaClient {
  private baseURL: string;
  private tokenHash: string;
  private email: string;
  private accessToken: string | null;
  private tokenExpiry: number | null;
  private apiClient: AxiosInstance;

  constructor({ baseURL, tokenHash, email }: IViaClientConfig) {
    if (!baseURL || !tokenHash || !email) {
      throw new Error('baseURL, tokenHash, and email are required to initialize ViaClient');
    }

    this.baseURL = baseURL;
    this.tokenHash = tokenHash;
    this.email = email;
    this.accessToken = null;
    this.tokenExpiry = null;

    // Create an Axios instance
    this.apiClient = axios.create({
      baseURL: this.baseURL,
      responseType: 'json',
    });

    // Add a request interceptor to attach the token
    this.apiClient.interceptors.request.use(
      async (
        config: InternalAxiosRequestConfig
      ): Promise<InternalAxiosRequestConfig> => {
        const token = await this.getAccessToken();

        // No need to check if config.headers is undefined because it's always defined in InternalAxiosRequestConfig.
        // Since config.headers is of type AxiosHeaders, we use config.headers.set('Header-Name', 'value') to set header values.
        config.headers.set('Authorization', `Bearer ${token}`);

        return config;
      },
      (error) => Promise.reject(error)
    );
  }


  private async getAccessToken(): Promise<string> {
    const now = Date.now();

    if (this.accessToken && this.tokenExpiry && now < this.tokenExpiry) {
      // Token is still valid
      return this.accessToken;
    }

    try {
      const auth = { hash: this.tokenHash, email: this.email };
      const response: AxiosResponse = await axios.post(`${this.baseURL}/auth/token`, auth);
      const tokenData = response?.data?.token;

      if (!tokenData || !tokenData.access_token) {
        throw new AuthError('Failed to retrieve access token: Invalid response structure', new Error('Invalid token data'));
      }

      this.accessToken = tokenData.access_token;

      // Handle token expiry if provided
      if (tokenData.expires_in) {
        this.tokenExpiry = now + tokenData.expires_in * 1000; // expires_in is in seconds
      } else {
        // Default to 1 hour expiry if not provided
        this.tokenExpiry = now + 3600 * 1000;
      }

      return this.accessToken || '';
    } catch (err: any) {
      let errorMessage = 'Error obtaining access token';

      if (err.response) {
        // Server responded with a status code outside the 2xx range
        errorMessage += `: ${err.response.status} ${err.response.statusText}`;
        throw new AuthError(errorMessage, err);
      } else if (err.request) {
        // Request was made but no response was received
        errorMessage += ': No response received from server';
        throw new AuthError(errorMessage, err);
      } else {
        // Something happened while setting up the request
        errorMessage += `: ${err.message}`;
        throw new AuthError(errorMessage, err);
      }
    }
  }

  // Helper method for GET requests
  public async get<T>(url: string, params: object = {}, config: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.apiClient.get<T>(url, {
        params,
        ...config,
      });
      return response.data;
    } catch (error: any) {
      this.handleAPIError('GET', url, error);
    }
  }

  // Helper method for POST requests
  public async post<T>(url: string, data: object = {}, config: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.apiClient.post<T>(url, data, config);
      return response.data;
    } catch (error: any) {
      this.handleAPIError('POST', url, error);
    }
  }

  // Helper method for PUT requests
  public async put<T>(url: string, data: object = {}, config: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.apiClient.put<T>(url, data, config);
      return response.data;
    } catch (error: any) {
      this.handleAPIError('PUT', url, error);
    }
  }

  // Helper method for DELETE requests
  public async delete<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.apiClient.delete<T>(url, config);
      return response.data;
    } catch (error: any) {
      this.handleAPIError('DELETE', url, error);
    }
  }

  // Helper method for PATCH requests
  public async patch<T>(url: string, data: object = {}, config: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.apiClient.patch<T>(url, data, config);
      return response.data;
    } catch (error: any) {
      this.handleAPIError('PATCH', url, error);
    }
  }

  // Error handling helper
  private handleAPIError(method: string, url: string, error: any): never {
    let errorMessage = `${method} Request to ${url} failed`;

    if (error.response) {
      // Server responded with a status code outside the 2xx range
      errorMessage += `: ${error.response.status} ${error.response.statusText}`;
      throw new APIRequestError(errorMessage, error.response.status, error);
    } else if (error.request) {
      // Request was made but no response was received
      errorMessage += ': No response received from server';
      throw new APIRequestError(errorMessage, null, error);
    } else {
      // Something happened while setting up the request
      errorMessage += `: ${error.message}`;
      throw new APIRequestError(errorMessage, null, error);
    }
  }

  // You can add more methods like DELETE, PATCH, etc., if needed
}



