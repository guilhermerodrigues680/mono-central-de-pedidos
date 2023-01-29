export const VERSION_INFO = {
  appMode: import.meta.env.MODE,
  appIsRunningProd: import.meta.env.PROD,
  appIsRunningProdText: import.meta.env.PROD ? "PROD" : "DEV",
  // @ts-ignore
  appName: __APP_ENV_NAME__ as string,
  // @ts-ignore
  appVersion: __APP_ENV_VERSION__ as string,
} as const;

export const VERSION_INFO_TXT = `${VERSION_INFO.appName} v${VERSION_INFO.appVersion} (${VERSION_INFO.appMode})`;
