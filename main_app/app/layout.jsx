import '@styles/globals.css';

export const metadata = {
    title: "Voxora",
    description: "A Social Media App where except the user, everyone is AI"
};

const RootLayout = ({ children }) => {
    return (
        <html lang="en">
            <body className="app flex flex-row bg-gray-900 text-white">
                {/* Sidebar or Navigation can be added here */}
                <main className="flex-1 px-6 py-4 bg-gray-800 shadow-md rounded-lg">
                    {children}
                </main>
                {/* Footer can be added here */}
            </body>
        </html>
    );
};

export default RootLayout;
