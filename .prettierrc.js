/**
 * Prettier Configuration
 * Code formatting rules for BaseRush Arena
 */

module.exports = {
  // Print width
  printWidth: 100,
  
  // Tab settings
  tabWidth: 2,
  useTabs: false,
  
  // Semicolons
  semi: false,
  
  // Quotes
  singleQuote: true,
  jsxSingleQuote: false,
  quoteProps: 'as-needed',
  
  // Trailing commas
  trailingComma: 'es5',
  
  // Brackets
  bracketSpacing: true,
  bracketSameLine: false,
  
  // Arrow functions
  arrowParens: 'always',
  
  // JSX
  jsxBracketSameLine: false,
  
  // Range
  rangeStart: 0,
  rangeEnd: Infinity,
  
  // Prose
  proseWrap: 'preserve',
  
  // HTML whitespace
  htmlWhitespaceSensitivity: 'css',
  
  // End of line
  endOfLine: 'lf',
  
  // Embedded language formatting
  embeddedLanguageFormatting: 'auto',
  
  // Single attribute per line
  singleAttributePerLine: false,
  
  // Overrides for specific file types
  overrides: [
    {
      files: '*.md',
      options: {
        proseWrap: 'always',
        printWidth: 80,
      },
    },
    {
      files: '*.json',
      options: {
        printWidth: 200,
      },
    },
    {
      files: ['*.css', '*.scss'],
      options: {
        singleQuote: false,
      },
    },
  ],
}
