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