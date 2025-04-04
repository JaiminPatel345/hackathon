/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {},
    },
    plugins: [],
};

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//     content: [
//         './src/**/*.{js,jsx,ts,tsx}',
//     ],
//     presets: [require('nativewind/preset')],
//     theme: {
//         extend: {
//             colors: {
//                 // Primary brand colors
//                 primary: {
//                     50: '#e6f0ff',
//                     100: '#cce0ff',
//                     200: '#99c2ff',
//                     300: '#66a3ff',
//                     400: '#3385ff',
//                     500: '#0066ff', // Main primary color
//                     600: '#0052cc',
//                     700: '#003d99',
//                     800: '#002966',
//                     900: '#001433',
//                 },
//
//                 // Secondary color palette
//                 secondary: {
//                     50: '#e6f2ff',
//                     100: '#cce6ff',
//                     200: '#99ccff',
//                     300: '#66b3ff',
//                     400: '#3399ff',
//                     500: '#0080ff', // Main secondary color
//                     600: '#0066cc',
//                     700: '#004d99',
//                     800: '#003366',
//                     900: '#001a33',
//                 },
//
//                 // Accent color for highlights and CTAs
//                 accent: {
//                     50: '#fff0e6',
//                     100: '#ffe0cc',
//                     200: '#ffc299',
//                     300: '#ffa366',
//                     400: '#ff8533',
//                     500: '#ff6600', // Main accent color
//                     600: '#cc5200',
//                     700: '#993d00',
//                     800: '#662900',
//                     900: '#331400',
//                 },
//
//                 // Neutral colors for text, backgrounds, etc.
//                 neutral: {
//                     50: '#f9fafb',
//                     100: '#f3f4f6',
//                     200: '#e5e7eb',
//                     300: '#d1d5db',
//                     400: '#9ca3af',
//                     500: '#6b7280', // Main neutral color
//                     600: '#4b5563',
//                     700: '#374151',
//                     800: '#1f2937',
//                     900: '#111827',
//                 },
//
//                 // Success, error, warning, and info colors
//                 success: {
//                     50: '#ecfdf5',
//                     100: '#d1fae5',
//                     200: '#a7f3d0',
//                     300: '#6ee7b7',
//                     400: '#34d399',
//                     500: '#10b981', // Main success color
//                     600: '#059669',
//                     700: '#047857',
//                     800: '#065f46',
//                     900: '#064e3b',
//                 },
//                 error: {
//                     50: '#fef2f2',
//                     100: '#fee2e2',
//                     200: '#fecaca',
//                     300: '#fca5a5',
//                     400: '#f87171',
//                     500: '#ef4444', // Main error color
//                     600: '#dc2626',
//                     700: '#b91c1c',
//                     800: '#991b1b',
//                     900: '#7f1d1d',
//                 },
//                 warning: {
//                     50: '#fffbeb',
//                     100: '#fef3c7',
//                     200: '#fde68a',
//                     300: '#fcd34d',
//                     400: '#fbbf24',
//                     500: '#f59e0b', // Main warning color
//                     600: '#d97706',
//                     700: '#b45309',
//                     800: '#92400e',
//                     900: '#78350f',
//                 },
//                 info: {
//                     50: '#eff6ff',
//                     100: '#dbeafe',
//                     200: '#bfdbfe',
//                     300: '#93c5fd',
//                     400: '#60a5fa',
//                     500: '#3b82f6', // Main info color
//                     600: '#2563eb',
//                     700: '#1d4ed8',
//                     800: '#1e40af',
//                     900: '#1e3a8a',
//                 },
//
//                 // Gradient colors for backgrounds
//                 gradient: {
//                     start: '#4c669f',
//                     middle: '#3b5998',
//                     end: '#192f6a',
//                 },
//             },
//             // Custom background gradients
//             backgroundImage: {
//                 'primary-gradient': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
//                 'secondary-gradient': 'linear-gradient(to right, var(--tw-gradient-stops))',
//             },
//             // Custom font family
//             fontFamily: {
//                 sans: ['Inter', 'system-ui', 'sans-serif'],
//                 serif: ['Georgia', 'serif'],
//                 mono: ['Menlo', 'monospace'],
//             },
//             // Custom border radius
//             borderRadius: {
//                 '4xl': '2rem',
//                 '5xl': '2.5rem',
//             },
//             // Custom spacing
//             spacing: {
//                 '18': '4.5rem',
//                 '68': '17rem',
//                 '84': '21rem',
//                 '96': '24rem',
//             },
//         },
//     },
//     plugins: [],
// };