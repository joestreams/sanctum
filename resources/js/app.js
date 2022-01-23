import { useEffect, useState } from "react";
import { render } from "react-dom";
import axios from "axios";

function App({ isLoggedIn }) {
    const [is2faRequired, setIs2faRequired] = useState(false);
    const [loggedIn, setLoggedIn] = useState(isLoggedIn);

    useEffect(loadCsrf, []);

    async function loadCsrf() {
        try {
            const response = await axios.get("/sanctum/csrf-cookie");

            if (response.status !== 204) {
                console.error(response.statusText);
            }
        } catch (err) {
            console.error(err);
        }
    }

    function onLogin(is2faRequired) {
        setIs2faRequired(is2faRequired);
        setLoggedIn(true);
    }

    if (is2faRequired) {
        return <TwoFactorAuthScreen />;
    }

    if (!loggedIn) {
        return <LoginForm onSuccess={onLogin} />;
    }

    return <Home onLogout={() => setLoggedIn(false)} />;
}

function TwoFactorAuthScreen() {
    const [code, setCode] = useState("");

    return (
        <form className="max-w-xs mx-auto space-y-6">
            <div>
                <label
                    htmlFor="code"
                    className="block text-sm font-medium text-gray-700"
                >
                    TOTP Code
                </label>
                <div className="mt-1">
                    <input
                        type="text"
                        id="code"
                        name="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            <div>
                <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Login
                </button>
            </div>
        </form>
    );
}

function LoginForm({ onSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function login(e) {
        e.preventDefault();

        try {
            const response = await axios.post("/login", { email, password });

            onSuccess(response.data.two_factor);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <form onSubmit={login} className="max-w-xs mx-auto space-y-6">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Sign in to your account
            </h2>
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                >
                    Email
                </label>
                <div className="mt-1">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
            </div>
            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                >
                    Password
                </label>
                <div className="mt-1">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
            </div>
            <div>
                <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Login
                </button>
            </div>
        </form>
    );
}

function Home({ onLogout }) {
    const [qrCode, setQrCode] = useState("");

    async function logout() {
        try {
            await axios.post("/logout", {});

            onLogout();
        } catch (err) {
            console.error(err);
        }
    }

    async function enable2fa() {
        try {
            await axios.post("/user/two-factor-authentication");

            // TODO get QR code and show to user
            const response = await axios.get("/user/two-factor-qr-code");

            setQrCode(response.data.svg);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            <h1>Home!</h1>
            {qrCode && (
                <div>
                    <div dangerouslySetInnerHTML={{ __html: qrCode }} />
                    <button onClick={() => setQrCode("")}>Done</button>
                </div>
            )}
            {!qrCode && <button onClick={enable2fa}>Enable 2FA</button>}

            <div>
                <button onClick={logout}>Logout</button>
            </div>
        </div>
    );
}

const el = document.getElementById("app");
const isLoggedIn = el.dataset.loggedIn === "1";

render(<App isLoggedIn={isLoggedIn} />, el);
