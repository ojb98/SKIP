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
            "primary-outline": 'border border-blue-400 text-blue-400 transition-colors hover:bg-blue-50',
            "secondary-outline": 'border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50',
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
            primary: 'text-black border-gray-200 has-checked:bg-blue-400 has-checked:text-white has-checked:border-blue-400 has-checked:font-semibold',
            "secondary-text": 'border-none shadow-none hover:bg-white hover:text-gray-500 has-checked:font-semibold'
        }
    }
});

export const page = tv({
    base: [
        'block size-8 rounded border text-center text-sm/8 font-medium '
    ],
    variants: {
        color: {
            active: 'border-black bg-black text-white',
            inactive: 'border-gray-200 hover:bg-gray-100',
            "arrow-active": 'grid size-8 place-content-center rounded border border-gray-200 transition-colors hover:bg-gray-100',
            "arrow-inactive": 'grid size-8 place-content-center rounded border border-gray-200 bg-gray-50 text-gray-500 cursor-default'
        }
    }
});

export const link = tv({
    base: [
        'text-blue-500 hover:underline hover:underline-offset-4'
    ]
});