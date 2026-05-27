/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0A0A0B',
          700: '#2A2A2E',
          500: '#6B6B73',
          300: '#A8A8B0',
          100: '#E8E8EB',
        },
        surface: {
          base: '#FAFAFA',
          raised: '#FFFFFF',
          sunken: '#F4F4F5',
        },
        border: {
          DEFAULT: 'rgba(0, 0, 0, 0.08)',
          strong: 'rgba(0, 0, 0, 0.15)',
        },
        strengths:     { bg: '#EAF3DE', fg: '#3B6D11', accent: '#639922' },
        weaknesses:    { bg: '#FAEEDA', fg: '#854F0B', accent: '#BA7517' },
        opportunities: { bg: '#E6F1FB', fg: '#185FA5', accent: '#378ADD' },
        threats:       { bg: '#FCEBEB', fg: '#A32D2D', accent: '#E24B4A' },
        okrs:          { bg: '#EEEDFE', fg: '#3C3489', accent: '#7F77DD' },
        positioning:   { bg: '#E1F5EE', fg: '#0F6E56', accent: '#1D9E75' },
        persona:       { bg: '#FBEAF0', fg: '#72243E', accent: '#D4537E' },
        investment:    { bg: '#FAECE7', fg: '#712B13', accent: '#D85A30' },
        channels:      { bg: '#F1EFE8', fg: '#444441', accent: '#888780' },
        seg1: '#7F77DD',
        seg2: '#1D9E75',
        seg3: '#BA7517',
        seg4: '#D4537E',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
