// Global counter to track wasted child renders in Non‑Optimized mode
export let childRenderCount = 0;

export const incrementChildRender = () => {
  childRenderCount++;
};

export const resetChildRenderCount = () => {
  childRenderCount = 0;
};