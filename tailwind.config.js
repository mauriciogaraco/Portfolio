/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: { extend: {} },
  plugins: [],
  // Opcional: si generas clases dinámicas, añade safelist
  // safelist: [{ pattern: /(bg|text|border)-(yellow|red|green|blue|zinc)-(100|200|300|400|500|600|700)/ }],
};
