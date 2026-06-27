module.exports = {
  apps: [
    {
      name: "mohdumar-server",
      script: "server.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_restarts: 10,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
