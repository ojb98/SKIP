import { useMemo } from "react";

const useCategoryOptions = (category) => {

    //메모리 안에 캐시해두고 재사용할 수 있도록 도와주는 React 훅
    const options = useMemo(() => ({

        //반일권 4~6시간  , 1일권 8~10시간
        //  168 -> 1주일, 720 -> 1개월,  8760 -> 1년 
        LIFT_TICKET: { sizes: [], hours: [4,6,8,10 ] },
        
        PACKAGE: { sizes: ["S", "M", "L", "XL", "2XL", "3XL","free"], hours: [3, 4, 6, 8, 9] },

        SKI: {
            sizes: ["90cm", "100cm", "110cm", "120cm", "130cm", "140cm", "150cm", "160cm", "165cm"],
            hours: [2, 4, 6, 8, 24]
        },

        SNOWBOARD: {
            sizes: ["110cm", "115cm", "120cm", "125cm", "130cm", "135cm", "140cm", "145cm", "150cm", "155cm", "160cm", "165cm", "170cm"],
            hours: [2, 4, 6, 8, 24]
        },

        PROTECTIVE_GEAR: { sizes: ["S", "M", "L","free"],
            hours: [24] 
        },

        TOP: { sizes: ["S", "M", "L", "XL", "2XL", "3XL", "free"],
            hours: [4, 6, 8, 24] 
        },

        BOTTOM: { 
            sizes: ["S", "M", "L", "XL", "2XL", "3XL", "free"],
            hours: [4, 6, 8, 24] 
        },

        BOOTS: { 
            sizes: ["190mm", "200mm", "210mm", "220mm", "230mm", "240mm", "250mm", "260mm", "270mm", "280mm", "290mm", "300mm"],
            hours: [2, 4, 6, 8, 24] }
    }), []);

  return options[category] || { sizes: [], hours: [] };
};

export default useCategoryOptions;