import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUserStore } from "../../store/userStore";

function RegisterPage() {
    const register = useUserStore((state) => state.register);
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="max-w-sm mx-auto mt-10">
            <h1 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-100 text-center mb-6">
                Kayıt Ol
            </h1>

            <div className="flex flex-col gap-3">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="İsim"
                    className="border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-posta"
                    className="border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifre"
                    className="border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />

                <button
                    onClick={() => {
                        if (!name.trim() || !email.trim() || !password.trim()) {
                            return;
                        }
                        register(name, email, password);
                        navigate("/");
                    }}
                    className="px-5 py-2 bg-[var(--accent)] text-white rounded-full text-sm font-medium hover:opacity-90 transition"
                >
                    Kayıt Ol
                </button>

                <p className="text-center text-sm text-stone-400">
                    Zaten hesabın var mı?{" "}
                    <Link to="/giris" className="text-[var(--accent)]">
                        Giriş Yap
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
