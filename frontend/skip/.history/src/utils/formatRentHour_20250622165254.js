export const formatRentHour = (hour, category) => {
  if (category === "PROTECTIVE_GEAR") {
    return "1일권";
  }
  if ([4, 5, 6].includes(hour)) return `반일권 (${hour}시간)`;
  if ([8, 9, 10].includes(hour)) return `1일권 (${hour}시간)`;
  switch (hour) {
    case 168: return "1주일";
    case 720: return "1개월";
    case 8760: return "1년";
    default: return `${hour}시간`;
  }
};

export const userformatRentHour = (hour, category) => {
    if (category === "PROTECTIVE_GEAR") {
    return `1일권(${hour}시간)`;
  }
  if ([4, 5, 6].includes(hour)) return `반일권 (${hour}시간)`;
  if ([8, 9, 10].includes(hour)) return "1일권";
  switch (hour) {
    c
    case 168: return "1주일";
    case 720: return "1개월";
    case 8760: return "1년";
    default: return `${hour}시간`;
  }
};