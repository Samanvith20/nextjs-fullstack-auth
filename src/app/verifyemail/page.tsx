"use client"
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function VerifyEmailPage() {
    const [token, setToken] = useState('');
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);

    const verifyEmail = async () => {
        try {
            await axios.post("/api/users/verifyemail", { token });
            setVerified(true);
        } catch (error) {
            setError(true);
            console.error("Verification failed:", error);
        }
    };

    useEffect(() => {
        const urlToken = new URLSearchParams(window.location.search).get("token");
        setToken(urlToken || "");
    }, []);

    useEffect(() => {
        if (token.length > 0) {
            verifyEmail();
        }
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl mb-8">Verify Email</h1>
            <h2 className="p-2 bg-orange-500 text-black mb-4">{token ? `Token: ${token}` : "No token"}</h2>

            {verified && (
                <div className="text-center mb-8">
                    <h2 className="text-2xl mb-4">Email Verified Successfully!</h2>
                    <Link href="/login">
                        <a  href=""className="text-blue-500 underline">Login Now</a>
                    </Link>
                </div>
            )}

            {error && (
                <div className="text-center">
                    <h2 className="text-2xl bg-red-500 text-black mb-4">Error Verifying Email</h2>
                    <p className="text-red-500">There was an error while verifying your email. Please try again later.</p>
                </div>
            )}
        </div>
    );
}
