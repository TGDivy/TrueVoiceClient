if (!import.meta.env.VITE_APP_API) {
  throw new Error(
    "VITE_APP_API environment variable is not set. Please set it in .env file"
  );
}

declare global {
  interface Window {
    API_DOMAIN: string;
  }
}

export const API_DOMAIN = import.meta.env.VITE_APP_API;

export const buttonPressSound = () => new Audio("sounds/button-press.wav");
export const notificationSound = () => new Audio("sounds/notification.mp3");
export const checkSound = () => new Audio("sounds/check5.mp3");
