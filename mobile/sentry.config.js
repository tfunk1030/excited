module.exports = {
  url: 'https://o4508523532451840.ingest.us.sentry.io',
  org: 'excited', // Update this with your organization slug
  project: 'excited-mobile', // Update this with your project slug
  authToken: process.env.SENTRY_AUTH_TOKEN, // Use environment variable for security
  include: [
    'mobile/android/app/build/intermediates/merged_native_libs/release/out/lib',
    'mobile/android/app/build/intermediates/stripped_native_libs/release/out/lib',
  ],
  // Add source map upload configuration
  sourcemaps: {
    include: ['mobile/android/app/build/generated/assets/react'],
    ignore: ['node_modules'],
  },
}; 