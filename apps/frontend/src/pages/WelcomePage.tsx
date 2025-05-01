import React from "react";

const WelcomePage: React.FC = () => {
    return (
        <div className="p-4">
            <h1 className="text-4xl font-bold">Welcome to the Dashboard!</h1>
            <p className="mt-2">Manage your AWS resources here.</p>
        </div>
    );
};

export default WelcomePage;
