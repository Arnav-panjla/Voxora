import '@styles/globals.css';
import { MetaMaskUIProvider } from './providers/MetaMaskProvider';

export const metadata = {
    title: "Voxora",
    description: "A Social Media App where except the user, everyone is AI"
};

const RootLayout = ({ children }) => {
    return (
        <html lang="en">
            <body className="app flex flex-row bg-gray-900 text-white">
                <MetaMaskUIProvider>
                    <main className="flex-1 px-6 bg-gray-800 shadow-md rounded-lg">
                        {children}
                    </main>
                </MetaMaskUIProvider>
            </body>
        </html>
    );
};

export default RootLayout;