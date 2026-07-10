/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Obermann Authentic Dark Theme
        ink:        '#FFFFFF',   // Swapped: Ink is now pure white for text
        parchment:  '#050205',   // Swapped: Parchment is now void black for backgrounds
        stone:      '#130611',   // Deep plum for cards and surfaces
        slate:      '#A1A1AA',   // Muted silver for descriptions
        accent:     '#FFFFFF',   // Pure white for major action items
        accentDeep: '#280E25',   // Deep plum accent
        gold:       '#C9A66B',   // Retained if needed for jewelry accents
        safe:       '#34D399',   
        alert:      '#F87171',   
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'], 
        body:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        kicker: '.35em',
        premium: '.15em',
      }
    },
  },
  plugins: [],
};