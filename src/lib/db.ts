// This is a stub for local development since we don't have local D1 running via Wrangler CLI here.
// In production, process.env.DB will be injected by Cloudflare.

export const getDb = () => {
    if (process.env.NODE_ENV === 'development' && !process.env.DB) {
        // Return a mock or throw error
        console.warn("Using D1 in local dev requires 'wrangler dev' or a mock.");
        return null;
    }

    if (!process.env.DB) {
        console.error("CRITICAL: D1 Database binding 'DB' is missing in the current environment.");
    }

    return process.env.DB;
};
