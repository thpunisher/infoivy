import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import tseslint from 'typescript-eslint';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/build/**',
      '**/.turbo/**',
      '**/.vercel/**',
      '**/dist/**',
      '**/public/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      '@next/next': nextPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
];
