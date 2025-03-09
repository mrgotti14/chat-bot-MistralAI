import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        'grid-white': 'linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-8': '8rem 8rem',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#ededed',
            maxWidth: 'none',
            a: {
              color: '#3b82f6',
              '&:hover': {
                color: '#60a5fa',
              },
            },
            strong: {
              color: '#ededed',
            },
            code: {
              color: '#ededed',
              backgroundColor: '#1e1e1e',
              borderRadius: '0.375rem',
              padding: '0.25rem 0.375rem',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: '#1e1e1e',
              color: '#ededed',
              borderRadius: '0.5rem',
              padding: '1rem',
            },
            h1: {
              color: '#ededed',
            },
            h2: {
              color: '#ededed',
            },
            h3: {
              color: '#ededed',
            },
            h4: {
              color: '#ededed',
            },
            p: {
              color: '#ededed',
            },
            li: {
              color: '#ededed',
            },
            blockquote: {
              color: '#d1d5db',
              borderLeftColor: '#374151',
            },
            hr: {
              borderColor: '#374151',
            },
            table: {
              thead: {
                borderBottomColor: '#374151',
              },
              tbody: {
                tr: {
                  borderBottomColor: '#374151',
                },
              },
            },
          },
        },
      },
      animation: {
        'blob': 'blob 7s infinite',
        'scroll': 'scroll 2s infinite',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        scroll: {
          '0%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(100%)',
          },
          '100%': {
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
