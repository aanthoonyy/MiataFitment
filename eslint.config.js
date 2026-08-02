import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import pluginReactJsxRuntime from "eslint-plugin-react/configs/jsx-runtime.js";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";

export default [
  // Never lint build output or vendored code.
  { ignores: ["dist/**", "node_modules/**"] },

  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  // Application source.
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    settings: {
      react: { version: "detect" },
    },
    plugins: {
      react: pluginReact,
      // eslint-plugin-react-hooks@4 has no flat-config export, so the plugin
      // is registered by hand and its recommended rules pulled in below.
      // Without this, rules-of-hooks and exhaustive-deps silently never run.
      "react-hooks": pluginReactHooks,
      "react-refresh": pluginReactRefresh,
    },
    rules: {
      ...pluginReactConfig.rules,
      // The automatic JSX transform means React need not be in scope.
      ...pluginReactJsxRuntime.rules,
      ...pluginReactHooks.configs.recommended.rules,

      // TypeScript already checks props; prop-types is redundant noise here.
      "react/prop-types": "off",

      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ["src/components/ui/**"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },

  // Config files run in Node, not the browser.
  {
    files: ["*.config.{js,ts}", "vite.config.ts", "eslint.config.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
];
