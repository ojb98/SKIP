import { tv } from "tailwind-variants";

export const button = tv({
    base: [
        'rounded',
        'font-[NanumSquare]',
        'cursor-pointer'
    ],
    variants: {
        color: {
            primary: 'bg-blue-400 text-white transition-colors hover:bg-blue-500',
            "primary-not-interactive": 'bg-blue-400 text-white',
            secondary: 'bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200',
            inactive: 'bg-gray-300 text-white cursor-default',
            "success-outline": 'border border-[#03c75a] text-[#03c75a] transition-colors hover:bg-green-50',
            "warning-outline": 'border border-yellow-300 text-yellow-300 transition-colors hover:bg-yellow-50',
            "danger-outline": 'border border-red-500 text-red-500 transition-colors hover:bg-red-50'
        }
    }
});

export const radio = tv({
    base: [
        'flex justify-center items-center',
        'rounded border border-gray-300',
        'bg-white',
        'p-3',
        'text-sm text-gray-400 font-medium',
        'shadow-sm',
        'transition-colors',
        'hover:bg-gray-50',
        'has-checked:border-black has-checked:text-black'
    ],
    variants: {
        color: {
        }
    }
});