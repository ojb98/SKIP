import { tv } from "tailwind-variants";

export const inputText = tv({
    base: [
        'border-[1px]',
        'border-gray-200',
        'rounded',
        'text-sm',
        'indent-2',
        'focus-visible:outline-none',
        'focus:border-black'
    ],
    variants: {
        color: {
            disabled: 'bg-gray-100'
        }
    }
});

export const select = tv({
    base: [
        'appearance-none',
        'border rounded border-gray-300',
        'shadow-sm text-sm',
        'focus-visible:outline-none focus:ring focus:ring-blue-400'
    ]
});