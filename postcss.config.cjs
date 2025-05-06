const postcssNesting = require('postcss-nesting');
const tailwindcss = require('@tailwindcss/postcss');
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    postcssNesting,
    tailwindcss,
    autoprefixer,
  ],
};
