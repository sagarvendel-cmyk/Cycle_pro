import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const nextCoreWebVitals = require('eslint-config-next/core-web-vitals')
const nextTypescript = require('eslint-config-next/typescript')

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    files: ['components/ui/**/*.{ts,tsx}', 'hooks/use-mobile.ts'],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
    },
  },
]

export default eslintConfig
