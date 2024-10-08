export interface graphicBarData {
  name: string;
  series: { name: string; value: number }[];
}

export interface graphicPieData {
  name: string;
  value: number;
  id: number;
}
