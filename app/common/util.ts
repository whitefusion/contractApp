export const convert = (n: any) => {
  return (window as any)?.web ? (window as any)?.web?.web3?.utils?.fromWei(n) : '--';
}