import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  define: {
    // https://vitejs.dev/config/#environment-variables
    // https://stackoverflow.com/questions/67194082/how-can-i-display-the-current-app-version-from-package-json-to-the-user-using-vi
    __APP_ENV_NAME__: JSON.stringify(process.env.npm_package_name),
    __APP_ENV_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});
