import { notification } from "antd";
import { useEffect } from "react";

const HandleServiceWorker = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then((reg) => {
        reg.addEventListener("updatefound", () => {
          // A new service worker is being installed.
          const newWorker = reg.installing;
          if (!newWorker) {
            return;
          }
          newWorker.onstatechange = () => {
            // Has service worker state changed?
            switch (newWorker.state) {
              case "installed":
                // There is a new service worker available, show the notification
                if (navigator.serviceWorker.controller) {
                  notification.info({
                    message: "New version available!",
                    description:
                      "A new version of the app is available. Please reopen the app to update.",
                    duration: 2,
                  });
                }
                break;
            }
          };
        });
      });
    }

    // Check initial online status
    if (!navigator.onLine) {
      notification.info({
        message: "You are offline",
        description: "Some features may not be available",
        duration: 5,
      });
    }

    // Listen for online and offline events
    window.addEventListener("online", () => {
      notification.success({
        message: "You are online",
        description: "All features are available",
        duration: 5,
      });
    });

    window.addEventListener("offline", () => {
      notification.info({
        message: "You are offline",
        description: "Some features may not be available",
        duration: 5,
      });
    });

    // Cleanup
    return () => {
      window.removeEventListener("online", () => {});
      window.removeEventListener("offline", () => {});
    };
  }, []);
  return null;
};

export default HandleServiceWorker;
