export function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-US").format(amount);
}
