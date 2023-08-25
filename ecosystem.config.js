module.exports = {
  apps: [
    {
      name: "app",
      script: "./api.js",
      env_production: {
        AWS_ACCESS_KEY_ID: "AKIAYDT3IRZRLFI6DM5M",
        AWS_SECRET_ACCESS_KEY: "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",
        AWS_BUCKET_NAME: "travvolt",
      },
      env_development: {
        AWS_ACCESS_KEY_ID: "AKIAYDT3IRZRLFI6DM5M",
        AWS_SECRET_ACCESS_KEY: "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",
        AWS_BUCKET_NAME: "travvolt",
      },
    },
  ],
};
