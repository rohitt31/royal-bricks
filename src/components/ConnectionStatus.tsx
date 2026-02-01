import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import { checkBackendConnection } from '@/lib/api';

export const ConnectionStatus = () => {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    const checkConnection = async () => {
        setIsChecking(true);
        const connected = await checkBackendConnection();
        setIsConnected(connected);
        setIsChecking(false);
    };

    useEffect(() => {
        // Initial check
        checkConnection();

        // Check every 10 seconds
        const interval = setInterval(checkConnection, 10000);

        return () => clearInterval(interval);
    }, []);

    // Don't show anything if connected
    if (isConnected === true) {
        return null;
    }

    // Show warning if disconnected
    if (isConnected === false) {
        return (
            <div className="fixed bottom-4 right-4 z-50 max-w-md">
                <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 shadow-lg">
                    <div className="flex items-start gap-3">
                        <WifiOff className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="font-bold text-red-900 mb-1">Backend Disconnected</h3>
                            <p className="text-sm text-red-800 mb-2">
                                The backend server is not running. Please start it to use the application.
                            </p>
                            <div className="bg-red-100 rounded p-2 text-xs text-red-900 font-mono">
                                <strong>Quick Fix:</strong><br />
                                Run: <code className="bg-red-200 px-1 rounded">npm run dev:all</code><br />
                                Or: <code className="bg-red-200 px-1 rounded">cd backend && npm run dev</code>
                            </div>
                            <button
                                onClick={checkConnection}
                                disabled={isChecking}
                                className="mt-3 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                            >
                                {isChecking ? 'Checking...' : 'Retry Connection'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show loading state
    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-3 shadow-lg flex items-center gap-2">
                <Wifi className="w-4 h-4 text-yellow-600 animate-pulse" />
                <span className="text-sm text-yellow-900">Checking connection...</span>
            </div>
        </div>
    );
};

export default ConnectionStatus;
