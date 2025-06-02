import { tv } from "tailwind-variants";

export const button = tv({
    base: [
        'rounded',
        'font-[NanumSquareNeo]',
        'cursor-pointer'
    ],
    variants: {
        color: {
            primary: 'bg-blue-400 hover:bg-blue-500 text-white',
            secondary: 'border border-blue-400 text-blue-400 hover:bg-blue-50'
        }
    }
});