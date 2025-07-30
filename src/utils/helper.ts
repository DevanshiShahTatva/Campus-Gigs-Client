import { ReactNode } from "react";
import moment from "moment";


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
          window.open(url, "_self"); // Open in the same tab
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

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export function getAverageRating(ratings: number[]): number {
  if (!ratings.length) return 0; // No ratings? Return 0

  const total = ratings.reduce((sum, rating) => sum + rating, 0);
  const average = total / ratings.length;

  return parseFloat(average.toFixed(1)); // Round to 1 decimal
}
export function getProviderBadge(isMostRated: boolean, isTopRated: boolean, planAmount: number, restritionAmount: number = 10) {
  if (planAmount < restritionAmount) {
    return false
  }
  return isTopRated ? "Top Rated" : isMostRated ? "Most Rated" : false
}


export function groupNotificationsByTime(notifications: any[]) {
  const groups: Record<string, any[]> = {};

  notifications.forEach((notif) => {
    const date = moment(notif.created_at);
    let label = "";

    if (date.isSame(moment(), "day")) {
      label = "Today";
    } else if (date.isSame(moment().subtract(1, "day"), "day")) {
      label = "Yesterday";
    } else if (date.isAfter(moment().startOf("week"))) {
      label = "This Week";
    } else {
      label = date.format("MMM D, YYYY");
    }

    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(notif);
  });

  return groups;
}

export const getAllNotificationStatus = ({
  show_chat,
  show_bid,
  show_payment,
  show_rating,
}: {
  show_chat: boolean;
  show_bid: boolean;
  show_payment: boolean;
  show_rating: boolean;
}) => {
   return !show_chat && !show_bid && !show_payment && !show_rating;
};