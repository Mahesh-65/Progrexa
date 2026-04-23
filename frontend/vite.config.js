import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api/auth": {
        target: process.env.VITE_AUTH_SERVICE_URL || "http://auth-service:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/auth/, ""),
      },
      "/api/user": {
        target: process.env.VITE_USER_SERVICE_URL || "http://user-service:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/user/, ""),
      },
      "/api/task": {
        target: process.env.VITE_TASK_SERVICE_URL || "http://task-service:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/task/, ""),
      },
      "/api/schedule": {
        target: process.env.VITE_SCHEDULE_SERVICE_URL || "http://schedule-service:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/schedule/, ""),
      },
      "/api/timer": {
        target: process.env.VITE_TIME_TRACKER_SERVICE_URL || "http://time-tracker-service:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/timer/, ""),
      },
      "/api/analytics": {
        target: process.env.VITE_ANALYTICS_SERVICE_URL || "http://analytics-service:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/analytics/, ""),
      },
      "/api/notifications": {
        target: process.env.VITE_NOTIFICATION_SERVICE_URL || "http://notification-service:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/notifications/, ""),
      },
    },
  },
});
