/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta base para o Dark Mode
        background: '#0B0F19', // Fundo escuro (quase preto/azul noite)
        surface: '#1A1F2E',    // Cor dos cards
        primary: '#6366F1',    // Indigo (pode trocar para verde neon ou roxo)
        accent: '#8B5CF6',     // Roxo para detalhes
        text: '#F3F4F6',       // Texto claro
        muted: '#9CA3AF',      // Texto secundário/cinza
      }
    },
  },
  plugins: [],
}