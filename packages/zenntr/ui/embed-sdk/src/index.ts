/**
 * Zenntr Embed SDK
 * Enterprise-grade embedding solution for Zenntr/Activepieces flows.
 * @version 1.0.0
 */

/**
 * Event types emitted by the Host application to the Iframe.
 */
export enum HostEventType {
  INIT = 'HOST_INIT',
  NAVIGATE = 'HOST_NAVIGATE',
  CONFIG_UPDATE = 'HOST_CONFIG_UPDATE',
  THEME_CHANGE = 'HOST_THEME_CHANGE',
  LOCALE_CHANGE = 'HOST_LOCALE_CHANGE',
}

/**
 * Event types emitted by the Iframe to the Host application.
 */
export enum IframeEventType {
  READY = 'IFRAME_READY',
  NAVIGATION_CHANGED = 'IFRAME_NAVIGATION_CHANGED',
  ACTION_COMPLETED = 'IFRAME_ACTION_COMPLETED',
  ACTION_FAILED = 'IFRAME_ACTION_FAILED',
  MODAL_CLOSED = 'IFRAME_MODAL_CLOSED',
  ERROR = 'IFRAME_ERROR',
  RESIZE = 'IFRAME_RESIZE',
  SESSION_EXPIRED = 'IFRAME_SESSION_EXPIRED',
}

// --- Event Interfaces ---

export interface HostInitEvent {
  type: HostEventType.INIT;
  payload: {
    token: string;
    config: EmbedConfiguration;
    initialPath?: string;
  };
}

export interface HostNavigateEvent {
  type: HostEventType.NAVIGATE;
  payload: {
    path: string;
  };
}

export interface HostConfigUpdateEvent {
  type: HostEventType.CONFIG_UPDATE;
  payload: {
    config: Partial<EmbedConfiguration>;
  };
}

export interface IframeReadyEvent {
  type: IframeEventType.READY;
  payload: Record<string, never>;
}

export interface IframeNavigationChangedEvent {
  type: IframeEventType.NAVIGATION_CHANGED;
  payload: {
    path: string;
    title?: string;
    canGoBack?: boolean;
    canGoForward?: boolean;
  };
}

export interface IframeActionCompletedEvent {
  type: IframeEventType.ACTION_COMPLETED;
  payload: {
    actionId: string;
    data?: unknown;
  };
}

export interface IframeErrorEvent {
  type: IframeEventType.ERROR;
  payload: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface IframeResizeEvent {
  type: IframeEventType.RESIZE;
  payload: {
    width: number;
    height: number;
  };
}

export interface IframeModalClosedEvent {
  type: IframeEventType.MODAL_CLOSED;
  payload: {
    data?: unknown;
  };
}

// --- Configuration Types ---

export interface EmbedConfiguration {
  theme?: 'light' | 'dark' | 'auto';
  locale?: string;
  appearance?: {
    customCSS?: string;
    fontUrl?: string;
    fontFamily?: string;
    primaryColor?: string;
    borderRadius?: string;
  };
  ui?: {
    hideHeader?: boolean;
    hideSidebar?: boolean;
    hideNavigation?: boolean;
    disableAnimation?: boolean;
  };
  features?: {
    readOnly?: boolean;
    autoSave?: boolean;
    enableDebug?: boolean;
  };
}

export interface InitParams {
  baseUrl: string;
  authToken: string;
  containerId?: string;
  config?: EmbedConfiguration;
  onNavigate?: (path: string) => void;
  onReady?: () => void;
  onError?: (error: Error) => void;
  onSessionExpired?: () => void;
}

export interface ModalParams {
  path: string;
  mode?: 'iframe' | 'popup';
  popupOptions?: {
    width?: number;
    height?: number;
    top?: number;
    left?: number;
  };
  title?: string;
}

type MessageHandler = (event: MessageEvent) => void;

/**
 * ZenntrEmbedSDK
 * Main class for controlling the embedded flow builder/viewer.
 */
export class ZenntrEmbedSDK {
  private static readonly SDK_VERSION = '1.0.0';
  private static readonly READY_TIMEOUT = 15000;
  private static readonly POLL_INTERVAL = 100;
  private static readonly MAX_POLLS = 100;

  private baseUrl = '';
  private authToken = '';
  private config: EmbedConfiguration = {};
  private mainIframe?: HTMLIFrameElement;
  private modalTarget?: HTMLIFrameElement | Window;
  private messageHandlers: Set<MessageHandler> = new Set();

  // Callbacks
  private onNavigateCallback?: (path: string) => void;
  private onReadyCallback?: () => void;
  private onErrorCallback?: (error: Error) => void;
  private onSessionExpiredCallback?: () => void;

  // Modal State
  private modalResolve?: (data: unknown) => void;
  private modalReject?: (error: Error) => void;

  private isInitialized = false;

  constructor() {
    this.handleMessage = this.handleMessage.bind(this);
  }

  /**
   * Initializes the SDK and embeds the iframe into the specified container.
   * @param params Initialization parameters
   */
  public async initialize(params: InitParams): Promise<void> {
    if (this.isInitialized) {
      console.warn(
        '[ZenntrEmbedSDK] SDK already initialized. Destroying previous instance.'
      );
      this.destroy();
    }

    this.baseUrl = this.normalizeUrl(params.baseUrl);
    this.authToken = params.authToken;
    this.config = params.config || {};
    this.onNavigateCallback = params.onNavigate;
    this.onReadyCallback = params.onReady;
    this.onErrorCallback = params.onError;
    this.onSessionExpiredCallback = params.onSessionExpired;

    // Start global listener
    window.addEventListener('message', this.handleMessage);

    if (params.containerId) {
      await this.embedInContainer(params.containerId);
    }

    this.isInitialized = true;
    console.log(`[ZenntrEmbedSDK] Initialized v${ZenntrEmbedSDK.SDK_VERSION}`);
  }

  /**
   * Embeds the iframe into the DOM container.
   */
  private async embedInContainer(containerId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.waitForElement(
        `#${containerId}`,
        (container) => {
          try {
            // Clear container
            container.innerHTML = '';

            this.mainIframe = this.createIframe(this.baseUrl);
            container.appendChild(this.mainIframe);

            this.waitForIframeReady(this.mainIframe.contentWindow!, '/', () =>
              resolve()
            );
          } catch (error) {
            reject(error instanceof Error ? error : new Error(String(error)));
          }
        },
        () => {
          reject(new Error(`Container #${containerId} not found`));
        }
      );
    });
  }

  /**
   * Creates the standard iframe element with basic styling.
   */
  private createIframe(url: string, path = '/'): HTMLIFrameElement {
    const iframe = document.createElement('iframe');
    const fullUrl = `${url}${path}?embed=true&t=${Date.now()}`;
    iframe.src = fullUrl;
    iframe.setAttribute('allow', 'clipboard-read; clipboard-write; fullscreen');
    iframe.setAttribute('title', 'Zenntr Flow Builder');
    iframe.style.cssText = 'width:100%;height:100%;border:none;display:block;';
    return iframe;
  }

  /**
   * Waits for the iframe to send the READY signal.
   */
  private waitForIframeReady(
    targetWindow: Window,
    initialPath: string,
    onReady?: () => void
  ): void {
    let readyReceived = false;

    const readyHandler = (event: MessageEvent) => {
      if (
        event.source === targetWindow &&
        this.isValidOrigin(event.origin) &&
        event.data.type === IframeEventType.READY
      ) {
        readyReceived = true;
        // Send initial configuration
        const initEvent: HostInitEvent = {
          type: HostEventType.INIT,
          payload: {
            token: this.authToken,
            config: this.config,
            initialPath,
          },
        };

        targetWindow.postMessage(initEvent, event.origin);
        window.removeEventListener('message', readyHandler);

        if (onReady) onReady();
        if (this.onReadyCallback) this.onReadyCallback();
      }
    };

    window.addEventListener('message', readyHandler);

    // Safety timeout
    setTimeout(() => {
      if (!readyReceived) {
        window.removeEventListener('message', readyHandler);
        const error = new Error('Timeout waiting for iframe READY signal.');
        console.error('[ZenntrEmbedSDK]', error);
        if (this.onErrorCallback) this.onErrorCallback(error);
      }
    }, ZenntrEmbedSDK.READY_TIMEOUT);
  }

  /**
   * Central message handler for all iframe communication.
   */
  private handleMessage(event: MessageEvent): void {
    if (!this.isValidOrigin(event.origin)) return;

    // Delegate to specific handlers
    this.messageHandlers.forEach((handler) => handler(event));

    // Handle core events
    const { type, payload } = event.data || {};

    switch (type) {
      case IframeEventType.NAVIGATION_CHANGED:
        if (this.onNavigateCallback) {
          this.onNavigateCallback(payload.path);
        }
        break;

      case IframeEventType.ERROR: {
        const error = new Error(payload?.message || 'Unknown iframe error');
        if (this.onErrorCallback) {
          this.onErrorCallback(error);
        }
        break;
      }

      case IframeEventType.SESSION_EXPIRED:
        if (this.onSessionExpiredCallback) {
          this.onSessionExpiredCallback();
        }
        break;
    }
  }

  /**
   * Navigation control
   */
  public navigate(path: string): void {
    if (!this.mainIframe?.contentWindow) {
      this.handleError('Main iframe is not available for navigation');
      return;
    }

    const event: HostNavigateEvent = {
      type: HostEventType.NAVIGATE,
      payload: {
        path: this.normalizePath(path),
      },
    };

    this.mainIframe.contentWindow.postMessage(event, this.baseUrl);
  }

  /**
   * Update configuration dynamically
   */
  public updateConfig(newConfig: Partial<EmbedConfiguration>): void {
    this.config = { ...this.config, ...newConfig };

    if (!this.mainIframe?.contentWindow) return;

    const event: HostConfigUpdateEvent = {
      type: HostEventType.CONFIG_UPDATE,
      payload: { config: newConfig },
    };

    this.mainIframe.contentWindow.postMessage(event, this.baseUrl);
  }

  /**
   * Opens a modal (iframe or popup)
   */
  public async openModal(params: ModalParams): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.modalResolve = resolve;
      this.modalReject = reject;

      this.waitForElement(
        'body',
        (body) => {
          if (params.mode === 'popup') {
            this.modalTarget = this.createPopup(
              params.path,
              params.popupOptions
            );
            this.monitorPopupClose(this.modalTarget);
          } else {
            this.modalTarget = this.createModalIframe(params.path);
            body.appendChild(this.modalTarget);
          }

          this.setupModalListeners(this.modalTarget);
        },
        () => {
          reject(new Error('Document body not found'));
        }
      );
    });
  }

  private createPopup(
    path: string,
    options?: ModalParams['popupOptions']
  ): Window {
    const features = this.buildPopupFeatures(options);
    const url = `${this.baseUrl}${path}?embed=true&popup=true`;
    const popup = window.open(url, '_blank', features);

    if (!popup) {
      throw new Error('Popup blocked by browser');
    }

    // Since we can't easily adhere to the READY protocol with synchronous window.open in some browsers,
    // we assume the page loads and starts communicating.
    return popup;
  }

  private createModalIframe(path: string): HTMLIFrameElement {
    const iframe = this.createIframe(this.baseUrl, path);

    // Modal Overlay Styles
    iframe.style.cssText = [
      'display:block',
      'position:fixed',
      'top:0',
      'left:0',
      'width:100vw',
      'height:100vh',
      'border:none',
      'z-index:999999',
      'background:rgba(0,0,0,0.5)', // Backdrop
    ].join(';');

    return iframe;
  }

  private setupModalListeners(target: HTMLIFrameElement | Window): void {
    const modalListener = (event: MessageEvent) => {
      const targetWindow =
        target instanceof HTMLIFrameElement ? target.contentWindow : target;

      if (event.source !== targetWindow || !this.isValidOrigin(event.origin))
        return;

      const { type, payload } = event.data;

      if (
        type === IframeEventType.MODAL_CLOSED ||
        type === IframeEventType.ACTION_COMPLETED
      ) {
        this.closeModal(payload?.data);
        this.messageHandlers.delete(modalListener);
      } else if (type === IframeEventType.ERROR) {
        this.closeModal(undefined, new Error(payload?.message));
        this.messageHandlers.delete(modalListener);
      }
    };

    this.messageHandlers.add(modalListener);
  }

  private monitorPopupClose(popup: Window): void {
    const interval = setInterval(() => {
      if (popup.closed) {
        clearInterval(interval);
        this.closeModal(undefined); // Treat as cancelled/closed without data
      }
    }, 500);
  }

  private closeModal(data?: unknown, error?: Error): void {
    if (this.modalTarget) {
      if (this.modalTarget instanceof HTMLIFrameElement) {
        this.modalTarget.remove();
      } else {
        // Popups control themselves usually, but we can try to close
        this.modalTarget.close();
      }
      this.modalTarget = undefined;
    }

    if (error && this.modalReject) {
      this.modalReject(error);
    } else if (this.modalResolve) {
      this.modalResolve(data);
    }

    this.modalResolve = undefined;
    this.modalReject = undefined;
  }

  /**
   * Performs an authenticated HTTP request using the SDK's credentials.
   * Useful for the host to fetch data from Zenntr API directly.
   */
  public async request<T = unknown>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/api${this.normalizePath(path)}`;

    const headers: HeadersInit = {
      Authorization: `Bearer ${this.authToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        if (response.status === 401 && this.onSessionExpiredCallback) {
          this.onSessionExpiredCallback();
        }
        const errorText = await response.text();
        throw new Error(
          `Request failed: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      return response.json();
    } catch (err) {
      this.handleError(err instanceof Error ? err.message : String(err));
      throw err;
    }
  }

  /**
   * Destroys the SDK instance, cleaning up all listeners and DOM elements.
   */
  public destroy(): void {
    window.removeEventListener('message', this.handleMessage);
    this.messageHandlers.clear();

    if (this.mainIframe) {
      this.mainIframe.remove();
      this.mainIframe = undefined;
    }

    if (this.modalTarget) {
      this.closeModal();
    }

    this.isInitialized = false;
  }

  // --- Helpers ---

  private normalizeUrl(url: string): string {
    return url.replace(/\/+$/, '');
  }

  private normalizePath(path: string): string {
    return path.startsWith('/') ? path : `/${path}`;
  }

  private isValidOrigin(origin: string): boolean {
    if (!this.baseUrl) return false;
    try {
      const targetOrigin = new URL(this.baseUrl).origin;
      return origin === targetOrigin;
    } catch {
      return false;
    }
  }

  private buildPopupFeatures(options?: ModalParams['popupOptions']): string {
    const defaults = {
      width: 800,
      height: 600,
      top: 100,
      left: 100,
      menubar: 'no',
      toolbar: 'no',
      location: 'no',
      status: 'no',
    };

    const features = { ...defaults, ...options };
    return Object.entries(features)
      .map(([key, value]) => `${key}=${value}`)
      .join(',');
  }

  private waitForElement(
    selector: string,
    onFound: (element: Element) => void,
    onTimeout: () => void
  ): void {
    const element = document.querySelector(selector);
    if (element) {
      onFound(element);
      return;
    }

    let polls = 0;
    const interval = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(interval);
        onFound(el);
      } else if (polls >= ZenntrEmbedSDK.MAX_POLLS) {
        clearInterval(interval);
        onTimeout();
      }
      polls++;
    }, ZenntrEmbedSDK.POLL_INTERVAL);
  }

  private handleError(message: string): void {
    const error = new Error(message);
    console.error(`[ZenntrEmbedSDK] ${message}`);
    if (this.onErrorCallback) {
      this.onErrorCallback(error);
    }
  }
}

/**
 * Factory function for easier instantiation.
 */
export function createZenntrEmbed(): ZenntrEmbedSDK {
  return new ZenntrEmbedSDK();
}

// Global export for UMD/Browser usage
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).ZenntrEmbedSDK = ZenntrEmbedSDK;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).createZenntrEmbed = createZenntrEmbed;
}
