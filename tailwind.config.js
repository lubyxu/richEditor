	/** @type {import('tailwindcss').Config} */
    module.exports = {
        important: true,
        content: ['./src/**/*.{js,jsx,ts,tsx}', './src/**/*.{css,less}', './public/index.html'],
        corePlugins: {
          preflight: false
        },
        theme: {
          fontSize: {
            sm: '12px',
            base: '14px',
            lg: '16px',
            llg: '18px',
          },
          extend: {
            colors: {
              'primary-color': 'var(--ant-primary-color)',
              'main-color': 'rgba(0, 0, 34, 0.85)',
              'error-color': '#E54545',
              'gray-color': 'rgba(0, 0, 34, 0.50)',
              'border-color': '#d9d9d9',
              'font-black': 'rgba(0, 0, 34, 0.91)',
              'font-black': 'rgba(0, 0, 34, 0.91)',
              // 旧/txt/辅助(二级正文)
              'text-level-2': 'rgba(0, 0, 34, 0.5)'
            }
          },
        },
        plugins: [],
      }
      