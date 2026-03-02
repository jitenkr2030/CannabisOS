export const BUILD_TIMESTAMP = new Date().toISOString();
export const BUILD_VERSION = '1.0.0';
export const BUILD_COMMIT = process.env.VERCEL_GIT_COMMIT_SHA || 'local';
