// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      "prettier/prettier": ["error", { endOfLine: "auto" }],
      /** ERROR: 'BirthDate' is an 'error' type that acts as 'any' and overrides all other types in this union type. */
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      /** ERROR: Unsafe assignment of an error typed value. */
      '@typescript-eslint/no-unsafe-assignment': 'off',
      /** ERROR: Unsafe member access .CreatedByProfessional on an `error` typed value. */
      '@typescript-eslint/no-unsafe-member-access': 'off',
      /** ERROR: Unsafe return of a value of type error. */
      '@typescript-eslint/no-unsafe-return': 'off',
      /** ERROR: Unsafe call of a(n) `error` type typed value. */
      '@typescript-eslint/no-unsafe-call': 'off',
      /** ERROR: Async arrow function has no 'await' expression */
      '@typescript-eslint/require-await': 'off',
      /** ERROR: A method that is not declared with `this: void` may cause unintentional scoping of `this` when separated from its object. */
      '@typescript-eslint/unbound-method': 'off',
    },
  },
);
