import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { flushSync } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useEffectOnce } from 'react-use';

import { useEmbedding } from '../../../components/embed-provider';
import { useTheme } from '../../../components/theme-provider';
import { LoadingScreen } from '../../../components/ui/loading-screen';
import { useAuthorization } from '../../../hooks/authorization-hooks';
import { authenticationSession } from '../../../lib/authentication-session';
import { managedAuthApi } from '../../../lib/managed-auth-api';
import {
  combinePaths,
  determineDefaultRoute,
  parentWindow,
  routesThatRequireProjectId,
} from '../../../lib/utils';
import { memoryRouter } from '../../guards';

// --- Zenntr Protocol Definitions ---

enum HostEventType {
  INIT = 'HOST_INIT',
  NAVIGATE = 'HOST_NAVIGATE',
  CONFIG_UPDATE = 'HOST_CONFIG_UPDATE',
  THEME_CHANGE = 'HOST_THEME_CHANGE',
  LOCALE_CHANGE = 'HOST_LOCALE_CHANGE',
}

enum IframeEventType {
  READY = 'IFRAME_READY',
  NAVIGATION_CHANGED = 'IFRAME_NAVIGATION_CHANGED',
  ACTION_COMPLETED = 'IFRAME_ACTION_COMPLETED',
  ACTION_FAILED = 'IFRAME_ACTION_FAILED',
  MODAL_CLOSED = 'IFRAME_MODAL_CLOSED',
  ERROR = 'IFRAME_ERROR',
  RESIZE = 'IFRAME_RESIZE',
  SESSION_EXPIRED = 'IFRAME_SESSION_EXPIRED',
}

interface HostInitPayload {
  token: string;
  config: Record<string, any>;
  initialPath?: string;
}

interface HostNavigatePayload {
  path: string;
}

// --- Implementation ---

const notifyVendorPostAuthentication = () => {
  // In Zenntr protocol, we don't need explicit 'AUTH SUCCESS',
  // but we can imply readiness or just proceed.
  // Use generic ready signal if needed or just let navigation happen.
};

const handleVendorNavigation = ({ projectId }: { projectId: string }) => {
  const handleVendorRouteChange = (event: MessageEvent) => {
    if (
      event.source === parentWindow &&
      event.data.type === HostEventType.NAVIGATE
    ) {
      const payload = event.data.payload as HostNavigatePayload;
      const targetRoute = payload.path;

      const targetRouteRequiresProjectId = Object.values(
        routesThatRequireProjectId,
      ).some((route) => targetRoute.includes(route));

      if (!targetRouteRequiresProjectId) {
        memoryRouter.navigate(targetRoute);
      } else {
        memoryRouter.navigate(
          combinePaths({
            secondPath: targetRoute,
            firstPath: `/projects/${projectId}`,
          }),
        );
      }
    }
  };
  window.addEventListener('message', handleVendorRouteChange);
};

const handleClientNavigation = () => {
  memoryRouter.subscribe((state) => {
    const pathNameWithoutProjectOrProjectId = state.location.pathname.replace(
      /\/projects\/[^/]+/,
      '',
    );
    parentWindow.postMessage(
      {
        type: IframeEventType.NAVIGATION_CHANGED,
        payload: {
          path: pathNameWithoutProjectOrProjectId + state.location.search,
          title: document.title,
        },
      },
      '*',
    );
  });
};

const EmbedPage = React.memo(() => {
  const { setEmbedState, embedState } = useEmbedding();
  const { mutateAsync } = useMutation({
    mutationFn: async ({
      externalAccessToken,
      locale,
    }: {
      externalAccessToken: string;
      locale: string;
    }) => {
      const data = await managedAuthApi.generateApToken({
        externalAccessToken,
      });
      await i18n.changeLanguage(locale);
      return data;
    },
  });
  const { setTheme } = useTheme();
  const { i18n } = useTranslation();
  const { checkAccess } = useAuthorization();

  const handleInit = (event: MessageEvent) => {
    if (
      event.source === parentWindow &&
      event.data.type === HostEventType.INIT
    ) {
      const payload = event.data.payload as HostInitPayload;

      if (payload.token) {
        // Handle Theme
        const theme = payload.config?.theme;
        if (theme === 'dark' || theme === 'light') {
          setTheme(theme);
        }

        const locale = payload.config?.locale || 'en';

        mutateAsync(
          {
            externalAccessToken: payload.token,
            locale: locale,
          },
          {
            onSuccess: (data) => {
              authenticationSession.saveResponse(data, true);
              const configuredRoute = payload.initialPath ?? '/';

              const defaultRoute = determineDefaultRoute(checkAccess);
              const initialRoute =
                configuredRoute === '/' ? defaultRoute : configuredRoute;

              flushSync(() => {
                const config = payload.config || {};
                const ui = config.ui || {};
                const appearance = config.appearance || {};

                setEmbedState({
                  isEmbedded: true,
                  hideSideNav: ui.hideSidebar ?? false,
                  hideFlowsPageNavbar: ui.hideNavigation ?? false,
                  disableNavigationInBuilder: ui.hideNavigation ?? false,
                  hideFolders: false, // Defaulting if not in config
                  hideFlowNameInBuilder: false,
                  hideExportAndImportFlow: true,
                  sdkVersion: '1.0.0',
                  fontUrl: appearance.fontUrl,
                  fontFamily: appearance.fontFamily,
                  useDarkBackground:
                    initialRoute.startsWith('/embed/connections'),
                  hideHomeButtonInBuilder: false,
                  emitHomeButtonClickedEvent: false,
                  homeButtonIcon: 'logo',
                  hideDuplicateFlow: false,
                  hidePageHeader: ui.hideHeader ?? false,
                });
              });

              memoryRouter.navigate(initialRoute);
              handleVendorNavigation({ projectId: data.projectId });
              handleClientNavigation();
              notifyVendorPostAuthentication();
            },
            onError: (error) => {
              parentWindow.postMessage(
                {
                  type: IframeEventType.ERROR,
                  payload: {
                    code: 'AUTH_FAILED',
                    message:
                      error instanceof Error ? error.message : String(error),
                    details: {
                      name:
                        error instanceof Error ? error.name : 'UnknownError',
                    },
                  },
                },
                '*',
              );
            },
          },
        );
      } else {
        console.error('Token sent via the sdk is empty');
      }
    }
  };

  useEffectOnce(() => {
    // Notify host that iframe is ready to receive INIT
    parentWindow.postMessage({ type: IframeEventType.READY, payload: {} }, '*');

    window.addEventListener('message', handleInit);
    return () => {
      window.removeEventListener('message', handleInit);
    };
  });

  return <LoadingScreen brightSpinner={embedState.useDarkBackground} />;
});

EmbedPage.displayName = 'EmbedPage';
export { EmbedPage };
