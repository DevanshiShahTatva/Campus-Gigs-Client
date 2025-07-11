import { ReactNode } from "react";

export const getAuthToken = () => {
  if (typeof window === "undefined") return "";
  const token = localStorage?.getItem("token") ?? sessionStorage.getItem("token") ?? "";
  return token;
}

export const logout = () => {
  if (typeof window === "undefined") return;
  sessionStorage?.clear();
}

export const getAvatarName = (name: string, isCapital: boolean = false) => {
  if (!name) return '';
  const parts = name.split(' ');
  let initials = '';
  if (parts.length > 1) {
    initials = `${parts[0].charAt(0)}${parts[1].charAt(0)}`;
  } else {
    initials = name.charAt(0);
  }
  return isCapital ? initials.toUpperCase() : initials;
};

export const renderBaseOnCondition = (
  condition: boolean,
  trueValue: ReactNode,
  falseValue: ReactNode
) => {
  return condition ? trueValue : falseValue;
};

export function getRoleLabel(role: "user" | "provider") {
  return role === "user" ? "User" : "Provider";
}


/**
 * Shows a browser notification and optionally redirects to a link when clicked.
 * @param {string} title - The notification title.
 * @param {NotificationOptions & { link?: string }} options - Notification options. If 'link' is provided, clicking the notification opens it in a new tab.
 */
export function showPushNotification(
  title: string = "Notification",
  options?: NotificationOptions & { link?: string }
) {
  if (typeof window !== "undefined" && "Notification" in window) {
    const showBrowserNotification = () => {
      const n = new Notification(title, options);
      if (options && options.link) {
        n.onclick = () => {
          const url = options.link!.startsWith("http")
            ? options.link
            : window.location.origin + options.link;
          window.open(url, "_blank");
        };
      }
    };
    if (Notification.permission === "granted") {
      showBrowserNotification();
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          showBrowserNotification();
        } else {
          alert("Notification permission denied.");
        }
      });
    } else {
      alert("Notification permission denied.");
    }
  } else {
    alert("This browser does not support notifications.");
  }
}
