/**
 * Environment Variable Validation Utility
 * Ensures all required environment variables are set before server starts
 */

const requiredEnvVars = [
    'PORT',
    'NODE_ENV',
    'MONGODB_URI',
    'JWT_SECRET',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD'
];

const optionalEnvVars = [
    'JWT_EXPIRE',
    'JWT_COOKIE_EXPIRE',
    'BCRYPT_ROUNDS',
    'CORS_ORIGIN',
    'RATE_LIMIT_WINDOW_MS',
    'RATE_LIMIT_MAX_REQUESTS'
];

export const validateEnv = () => {
    const missing = [];
    const warnings = [];

    // Check required variables
    requiredEnvVars.forEach(varName => {
        if (!process.env[varName]) {
            missing.push(varName);
        }
    });

    // Check optional variables (warnings only)
    optionalEnvVars.forEach(varName => {
        if (!process.env[varName]) {
            warnings.push(varName);
        }
    });

    // Report results
    if (missing.length > 0) {
        console.error('\n❌ CRITICAL: Missing required environment variables:');
        missing.forEach(varName => console.error(`   - ${varName}`));
        console.error('\n💡 Please check your .env file in the backend directory.\n');
        process.exit(1);
    }

    if (warnings.length > 0) {
        console.warn('\n⚠️  Optional environment variables not set (using defaults):');
        warnings.forEach(varName => console.warn(`   - ${varName}`));
        console.warn('');
    }

    console.log('✅ Environment variables validated successfully\n');
};

export default validateEnv;
