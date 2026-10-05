export const categories = ["INTERIOR", "EXTERIOR", "GLASS_WORK", "ALUMINIUM_DOORS_WINDOWS", "HOME_FURNISHING"] as const;
export type Category = typeof categories[number];
export const categoryLabels: Record<Category, string> = {
  INTERIOR: "Interior",
  EXTERIOR: "Exterior",
  GLASS_WORK: "Glass Work",
  ALUMINIUM_DOORS_WINDOWS: "Aluminum",
  HOME_FURNISHING: "Furnishing",
};
