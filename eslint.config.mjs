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
      '@typescript-eslint/no-unused-vars': [
        'warn', // Mức độ cảnh báo, có thể đổi thành 'error'
        {
          argsIgnorePattern: '^_', // Bỏ qua tham số hàm bắt đầu bằng _
          varsIgnorePattern: '^_', // Bỏ qua biến thông thường bắt đầu bằng _
          caughtErrorsIgnorePattern: '^_', // Bỏ qua lỗi trong catch block bắt đầu bằng _
        },
      ],
    },
  },
);
