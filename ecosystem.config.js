module.exports = {
  apps: [
    {
      name: "medusa-app", // You can change this to your desired process name
      script: "medusa",
      args: "start",
      instances: 1, // Number of instances you want to run, adjust as needed
      autorestart: true,
      watch: false, // Set to true if you want to enable file watching for auto-restart
      max_memory_restart: "500M", // Adjust memory limit as needed
      env: {
        NODE_ENV: "production", // Set NODE_ENV to "production"
      },
    },
  ],
};
