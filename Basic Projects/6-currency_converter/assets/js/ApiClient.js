// Constants
const DEFAULT_METHOD = 'GET';
const DEFAULT_CACHE_DURATION = 0;
const DEFAULT_RETRIES = 0;
const DEFAULT_RETRY_DELAY = 2000;
const DEFAULT_TIMEOUT = 10000;
const NO_CACHE = 'no-cache';
const CACHE_KEY = 'cacheData';

const noop = () => {};

class CacheManager {
  constructor() {
    this.storage = window.localStorage;
    this.cacheKey = CACHE_KEY;
    if (!this.storage.getItem(this.cacheKey)) {
      this.storage.setItem(this.cacheKey, JSON.stringify({}));
    }
  }

  get(key, duration = DEFAULT_CACHE_DURATION) {
    const cache = JSON.parse(this.storage.getItem(this.cacheKey));
    const item = cache[key];
    if (item && (Date.now() - item.timestamp < duration)) {
      return item.data;
    } else if (item) {
      delete cache[key];
      this.storage.setItem(this.cacheKey, JSON.stringify(cache));
    }
    return null;
  }

  set(key, data) {
    const cache = JSON.parse(this.storage.getItem(this.cacheKey));
    cache[key] = {
      data: data,
      timestamp: Date.now()
    };
    this.storage.setItem(this.cacheKey, JSON.stringify(cache));
  }

  clear() {
    this.storage.setItem(this.cacheKey, JSON.stringify({}));
  }
}

class FetchManager {
  constructor() {
    this.controller = new AbortController();
  }

  async fetch(url, options) {
    const { 
      method = DEFAULT_METHOD, 
      data, 
      params, 
      retries = DEFAULT_RETRIES, 
      retryDelay = DEFAULT_RETRY_DELAY 
    } = options;
    const fetchOptions = this.createFetchOptions(method, data);

    for (let i = 0; i <= retries; i++) {
      try {
        const fullUrl = this.createFullUrl(url, method, params);
        const response = await fetch(fullUrl, fetchOptions);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        if (i === retries) throw error;
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }

  createFetchOptions(method, data) {
    return {
      method,
      signal: this.controller.signal,
      cache: NO_CACHE,
      body: method !== DEFAULT_METHOD ? JSON.stringify(data) : undefined,
    };
  }

  createFullUrl(url, method, params) {
    if (method === DEFAULT_METHOD && Object.keys(params).length > 0) {
      return `${url}?${new URLSearchParams(params)}`;
    }
    return url;
  }

  cancelRequest(message = 'Request canceled by the user') {
    this.controller.abort(message);
    this.controller = new AbortController();
  }
}

class ResponseHandler {
  handleSuccess(data, onSuccess = noop) {
    onSuccess(data);
    return { success: true, data };
  }

  handleFailure(error, onFailure = noop) {
    if (error.name === 'AbortError') {
      console.log('Request canceled', error.message);
    } else {
      onFailure(error);
    }
    return { success: false, error };
  }
}

class ApiClient {
  constructor() {
    this.cacheManager = new CacheManager();
    this.fetchManager = new FetchManager();
    this.responseHandler = new ResponseHandler();
  }

  async request(url, options = {}) {
    const {
      method = DEFAULT_METHOD,
      data = {},
      params = {},
      useCache = true,
      cacheDuration = DEFAULT_CACHE_DURATION,
      onWait = noop,
      onSuccess = noop,
      onFailure = noop,
      onComplete = noop
    } = options;

    const cacheKey = this.getCacheKey(url, method, data, params);

    onWait();

    if (useCache) {
      const cachedData = this.cacheManager.get(cacheKey, cacheDuration);
      if (cachedData) {
        onSuccess(cachedData);
        onComplete();
        return { success: true, data: cachedData };
      }
    }

    try {
      const result = await this.fetchManager.fetch(url, { method, data, params, ...options });
      
      if (useCache) {
        this.cacheManager.set(cacheKey, result);
      }

      onComplete();
      return this.responseHandler.handleSuccess(result, onSuccess);
    } catch (error) {
      onComplete();
      return this.responseHandler.handleFailure(error, onFailure);
    }
  }

  getCacheKey(url, method, data, params) {
    return `${method}_${url}_${JSON.stringify(data)}_${JSON.stringify(params)}`;
  }

  cancelRequest(message) {
    this.fetchManager.cancelRequest(message);
  }

  clearCache() {
    this.cacheManager.clear();
  }
}

const apiClient = new ApiClient();
export default apiClient;