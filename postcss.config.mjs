const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    ...(process.env.NEXT_PUBLIC_ENVIRONMENT === "production"
      ? { cssnano: {} }
      : {}),
  },
};

export default config;
