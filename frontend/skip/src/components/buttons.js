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
            secondary: 'bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200'
        }
    }
});

export const radio = tv({
    base: [
        'flex justify-center items-center',
        'rounded border border-gray-300',
        'bg-white',
        'p-3',
        'text-sm font-medium',
        'shadow-sm',
        'transition-colors',
        'hover:bg-gray-50',
        'has-checked:border-black has-checked:ring-blue-400'
    ],
    variants: {
        color: {
            active: '',
            inactive: ''
        }
    }
});

{/* <fieldset className="space-y-3">
  <legend className="sr-only">Delivery</legend>

  <div>
    <label
      htmlFor="DeliveryStandard"
      className="flex items-center justify-between gap-4 rounded border border-gray-300 bg-white p-3 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 has-checked:border-blue-600 has-checked:ring-1 has-checked:ring-blue-600"
    >
      <p className="text-gray-700">Standard</p>

      <p className="text-gray-900">Free</p>

      <input
        type="radio"
        name="DeliveryOption"
        value="DeliveryStandard"
        id="DeliveryStandard"
        className="sr-only"
        checked
      />
    </label>
  </div>

  <div>
    <label
      htmlFor="DeliveryPriority"
      className="flex items-center justify-between gap-4 rounded border border-gray-300 bg-white p-3 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 has-checked:border-blue-600 has-checked:ring-1 has-checked:ring-blue-600"
    >
      <p className="text-gray-700">Next Day</p>

      <p className="text-gray-900">£9.99</p>

      <input
        type="radio"
        name="DeliveryOption"
        value="DeliveryPriority"
        id="DeliveryPriority"
        className="sr-only"
      />
    </label>
  </div>
</fieldset> */}