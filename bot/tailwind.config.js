/** @type {import('tailwindcss').Config} */
export default { 
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], 
    theme: { 
        extend: { 
            colors: { 
                border: 'var(--border)',
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                ring: 'var(--ring)',
            }, 
        }, 
    }, 
    plugins: [] 
}
