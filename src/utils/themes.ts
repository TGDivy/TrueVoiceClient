import { theme } from "antd";

export const themes = {
  light: {
    algorithm: theme.defaultAlgorithm,
    colorBgBase: "#ffffff",
    colorPrimary: "#AABCC6",
  },

  dark: {
    algorithm: theme.darkAlgorithm,
    colorBgBase: "#131314",
    colorPrimary: "#AABCC6",
  },
};

// Blend two colors together (hex format)
export const blendColors = (color1: string, color2: string, ratio: number) => {
  const hex = (x: number) => {
    const hex = x.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  const r = Math.ceil(
    parseInt(color1.substring(1, 3), 16) * ratio +
      parseInt(color2.substring(1, 3), 16) * (1 - ratio)
  );
  const g = Math.ceil(
    parseInt(color1.substring(3, 5), 16) * ratio +
      parseInt(color2.substring(3, 5), 16) * (1 - ratio)
  );
  const b = Math.ceil(
    parseInt(color1.substring(5, 7), 16) * ratio +
      parseInt(color2.substring(5, 7), 16) * (1 - ratio)
  );

  return `#${hex(r)}${hex(g)}${hex(b)}`;
};
