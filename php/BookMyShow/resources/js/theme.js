export const theme = {
    // Flowbite-compatible Tailwind class mappings
    classes: {
        // Layout
        container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
        flexCenter: 'flex items-center justify-center',
        flexBetween: 'flex items-center justify-between',
        flexCol: 'flex flex-col',

        // Text - Flowbite text colors
        textPrimary: 'text-gray-900 dark:text-white',
        textSecondary: 'text-gray-600 dark:text-gray-400',
        textLight: 'text-white',
        textMuted: 'text-gray-500 dark:text-gray-400',
        heading: 'text-gray-900 dark:text-white font-bold',

        // Backgrounds - Flowbite compatible
        bgPrimary: 'bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700',
        bgSecondary: 'bg-gray-100 dark:bg-gray-700',
        bgHeader: 'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700',
        bgFooter: 'bg-gray-800 dark:bg-gray-900',
        bgWhite: 'bg-white dark:bg-gray-800',
        bgCard: 'bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700',

        // Buttons - Flowbite button styles
        btn: {
            primary: 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800',
            secondary: 'text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700',
            success: 'text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800',
            danger: 'text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-900',
            warning: 'text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:focus:ring-yellow-900',
            info: 'text-white bg-cyan-700 hover:bg-cyan-800 focus:ring-4 focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-cyan-600 dark:hover:bg-cyan-700 focus:outline-none dark:focus:ring-cyan-800',
            dark: 'text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700',
            light: 'text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700',
            outline: 'text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800',
        },
        btnIcon: 'p-2.5 bg-transparent border-0 text-2xl flex items-center gap-1 text-blue-700 cursor-pointer hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-600',

        // Forms - Flowbite form styles
        input: 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
        inputError: 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500',
        label: 'block mb-2 text-sm font-medium text-gray-900 dark:text-white',
        labelError: 'block mb-2 text-sm font-medium text-red-700 dark:text-red-500',
        select: 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
        textarea: 'block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
        checkbox: 'w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600',

        // Cards - Flowbite card styles
        card: 'block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700',
        cardHeader: 'px-6 py-4 bg-gray-50 border-b border-gray-200 dark:bg-gray-700 dark:border-gray-600',
        cardBody: 'p-6',
        cardFooter: 'px-6 py-4 bg-gray-50 border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600',

        // Alerts - Flowbite alert styles
        alert: {
            info: 'p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400',
            danger: 'p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400',
            success: 'p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400',
            warning: 'p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300',
            dark: 'p-4 mb-4 text-sm text-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-300',
        },

        // Badges - Flowbite badge styles
        badge: {
            default: 'bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300',
            dark: 'bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300',
            red: 'bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300',
            green: 'bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300',
            yellow: 'bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300',
            indigo: 'bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-indigo-900 dark:text-indigo-300',
            purple: 'bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300',
            pink: 'bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-pink-900 dark:text-pink-300',
        },

        // Tables - Flowbite table styles
        table: {
            wrapper: 'relative overflow-x-auto shadow-md sm:rounded-lg',
            base: 'w-full text-sm text-left text-gray-500 dark:text-gray-400',
            head: 'text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400',
            headCell: 'px-6 py-3',
            body: '',
            row: 'bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600',
            cell: 'px-6 py-4',
            striped: 'bg-white border-b dark:bg-gray-900 dark:border-gray-700',
        },

        // Modal - Flowbite modal backdrop
        modal: {
            backdrop: 'fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-80',
            container: 'fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden',
            content: 'relative p-4 w-full max-w-2xl max-h-full',
            dialog: 'relative bg-white rounded-lg shadow dark:bg-gray-700',
            header: 'flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600',
            body: 'p-4 md:p-5 space-y-4',
            footer: 'flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600',
        },

        // Dropdown - Flowbite dropdown
        dropdown: {
            menu: 'z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700',
            item: 'block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white',
        },

        // Spacing
        p: {
            xs: 'p-1',
            sm: 'p-2.5',
            md: 'p-5',
            lg: 'p-10',
            xl: 'p-20',
        },
        px: {
            xs: 'px-1',
            sm: 'px-2.5',
            md: 'px-5',
            lg: 'px-10',
            xl: 'px-20',
        },
        py: {
            xs: 'py-1',
            sm: 'py-2.5',
            md: 'py-5',
            lg: 'py-10',
            xl: 'py-20',
        },
        m: {
            xs: 'm-1',
            sm: 'm-2.5',
            md: 'm-5',
            lg: 'm-10',
            xl: 'm-20',
        },
        mt: {
            xs: 'mt-1',
            sm: 'mt-2.5',
            md: 'mt-5',
            lg: 'mt-10',
            xl: 'mt-20',
        },
        mb: {
            xs: 'mb-1',
            sm: 'mb-2.5',
            md: 'mb-5',
            lg: 'mb-10',
            xl: 'mb-20',
        },
        gap: {
            xs: 'gap-1',
            sm: 'gap-2.5',
            md: 'gap-5',
            lg: 'gap-10',
            xl: 'gap-20',
        },

        // Shadows - Flowbite shadows
        shadow: {
            sm: 'shadow-sm',
            md: 'shadow-md',
            lg: 'shadow-lg',
            xl: 'shadow-xl',
            '2xl': 'shadow-2xl',
        },

        // Borders
        border: {
            default: 'border border-gray-200 dark:border-gray-700',
            top: 'border-t border-gray-200 dark:border-gray-700',
            bottom: 'border-b border-gray-200 dark:border-gray-700',
            left: 'border-l border-gray-200 dark:border-gray-700',
            right: 'border-r border-gray-200 dark:border-gray-700',
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

        // Rounded corners
        rounded: {
            none: 'rounded-none',
            sm: 'rounded-sm',
            default: 'rounded',
            md: 'rounded-md',
            lg: 'rounded-lg',
            xl: 'rounded-xl',
            '2xl': 'rounded-2xl',
            full: 'rounded-full',
        },
    },

    // Fallback values for inline styles (when Tailwind classes can't be used)
    colors: {
        primary: '#1e40af', // blue-800
        secondary: '#6b7280', // gray-500
        success: '#16a34a', // green-600
        danger: '#dc2626', // red-600
        warning: '#f59e0b', // amber-500
        info: '#0891b2', // cyan-600
        background: '#ffffff',
        text: '#111827', // gray-900
        textLight: '#6b7280', // gray-500
        white: '#ffffff',
        headerBg: '#ffffff',
        footerBg: '#1f2937', // gray-800
        footerText: '#f9fafb', // gray-50
        border: '#e5e7eb', // gray-200
        shadow: 'rgba(0, 0, 0, 0.1)',
        shadowDark: 'rgba(0, 0, 0, 0.2)',
    },
    gradients: {
        primary: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
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
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    },
    transitions: {
        fast: '150ms',
        medium: '300ms',
        slow: '500ms',
    },
};

