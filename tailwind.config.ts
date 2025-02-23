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
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
