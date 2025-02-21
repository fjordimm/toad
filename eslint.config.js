import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ...pluginReact.configs.flat.recommended,
        settings: {
            react: {
                version: "detect"
            }
        },
        
        files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
        rules: {
            "@typescript-eslint/no-explicit-any": "off"
        }
    }
];
