import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default defineConfig(
  js.configs.recommended,
  tseslint.configs.recommended,
  stylistic.configs.recommended,
  importPlugin.flatConfigs.recommended,
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'script',
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
        },
      ],
      'import/no-unresolved': 'off',
      'import/order': ['error', {
        'groups': [
          'builtin',
          'external',
          'parent',
          'sibling',
          'index',
          'object',
        ],
        'newlines-between': 'always',
      }],
      'import/no-relative-packages': 'error',

      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
    },
  },
  {
    ignores: ['dist/', 'src/homeassistant'],
  },
  {
    files: ['**/*.ts'],
  },

)
