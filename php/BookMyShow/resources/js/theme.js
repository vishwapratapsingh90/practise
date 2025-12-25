export const theme = {
    // Tailwind class mappings
    classes: {
        // Layout
        container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
        flexCenter: 'flex items-center justify-center',
        flexBetween: 'flex items-center justify-between',
        flexCol: 'flex flex-col',

        // Text
        textPrimary: 'text-gray-900',
        textSecondary: 'text-gray-600',
        textLight: 'text-white',

        // Backgrounds
        bgPrimary: 'bg-gradient-to-br from-[#667eea] to-[#764ba2]',
        bgHeader: 'bg-gray-50',
        bgFooter: 'bg-gray-800',
        bgWhite: 'bg-white',

        // Buttons
        btnPrimary: 'px-10 py-4 bg-white text-[#667eea] rounded-full font-bold shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer',
        btnIcon: 'p-2.5 bg-transparent border-0 text-2xl flex items-center gap-1 text-[#667eea] cursor-pointer hover:opacity-80',

        // Spacing
        p: {
            xs: 'p-1',
            sm: 'p-2.5',
            md: 'p-5',
            lg: 'p-10',
            xl: 'p-15',
        },
        px: {
            xs: 'px-1',
            sm: 'px-2.5',
            md: 'px-5',
            lg: 'px-10',
            xl: 'px-15',
        },
        py: {
            xs: 'py-1',
            sm: 'py-2.5',
            md: 'py-5',
            lg: 'py-10',
            xl: 'py-15',
        },
        m: {
            xs: 'm-1',
            sm: 'm-2.5',
            md: 'm-5',
            lg: 'm-10',
            xl: 'm-15',
        },
        mt: {
            xs: 'mt-1',
            sm: 'mt-2.5',
            md: 'mt-5',
            lg: 'mt-10',
            xl: 'mt-15',
        },
        mb: {
            xs: 'mb-1',
            sm: 'mb-2.5',
            md: 'mb-5',
            lg: 'mb-10',
            xl: 'mb-15',
        },
        gap: {
            xs: 'gap-1',
            sm: 'gap-2.5',
            md: 'gap-5',
            lg: 'gap-10',
            xl: 'gap-15',
        },

        // Shadows
        shadow: {
            sm: 'shadow-sm',
            md: 'shadow-md',
            lg: 'shadow-lg',
            xl: 'shadow-xl',
        },

        // Typography
        text: {
            xs: 'text-xs',
            sm: 'text-sm',
            base: 'text-base',
            lg: 'text-lg',
            xl: 'text-xl',
            '2xl': 'text-2xl',
            '3xl': 'text-3xl',
            '4xl': 'text-4xl',
            '5xl': 'text-5xl',
            '6xl': 'text-6xl',
        },
    },

    // Fallback values for inline styles (when Tailwind classes can't be used)
    colors: {
        primary: '#667eea',
        secondary: '#764ba2',
        background: '#ffffff',
        text: '#333333',
        textLight: '#666666',
        white: '#ffffff',
        headerBg: '#f8f9fa',
        footerBg: '#2c3e50',
        footerText: '#ecf0f1',
        border: '#e0e0e0',
        shadow: 'rgba(0, 0, 0, 0.1)',
        shadowDark: 'rgba(0, 0, 0, 0.2)',
    },
    gradients: {
        primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    spacing: {
        xs: '5px',
        sm: '10px',
        md: '20px',
        lg: '40px',
        xl: '60px',
    },
    fontSize: {
        xs: '12px',
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '24px',
        xxl: '48px',
        xxxl: '64px',
    },
    borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '50px',
    },
    shadows: {
        sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
        md: '0 4px 8px rgba(0, 0, 0, 0.1)',
        lg: '0 4px 15px rgba(0, 0, 0, 0.2)',
    },
    transitions: {
        fast: '0.2s',
        medium: '0.3s',
        slow: '0.5s',
    },
};
