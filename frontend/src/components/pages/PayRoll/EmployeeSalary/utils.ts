export const formatPrice = (value: number | string | null | undefined) => {
  if (value === null || value === undefined || value === "") {
    return "0";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return "0";
  }

  return Math.round(number).toLocaleString("en-US");
};