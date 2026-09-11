import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useKullaniciStore } from "./kullaniciStore";

function GirisYap() {
    const girisYap = useKullaniciStore((state) => state.girisYap);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [sifre, setSifre] = useState("");
    const [hata, setHata] = useState("");

    return (
        <div className="max-w-sm mx-auto mt-10">
            <h1 className="font-display text-2xl font-semibold text-stone-900 dark:text-stone-100 text-center mb-6">
                Giriş Yap
            </h1>

            <div className="flex flex-col gap-3">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-posta"
                    className="border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
                <input
                    type="password"
                    value={sifre}
                    onChange={(e) => setSifre(e.target.value)}
                    placeholder="Şifre"
                    className="border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />

                {hata && (
                    <p className="text-sm text-rose-500">{hata}</p>
                )}

                <button
                    onClick={() => {
                        if (!email.trim() || !sifre.trim()) {
                            return;
                        }
                        const basarili = girisYap(email, sifre);
                        if (!basarili) {
                            setHata("E-posta veya şifre hatalı.");
                            return;
                        }
                        navigate("/");
                    }}
                    className="px-5 py-2 bg-[var(--accent)] text-white rounded-full text-sm font-medium hover:opacity-90 transition"
                >
                    Giriş Yap
                </button>

                <p className="text-center text-sm text-stone-400">
                    Hesabın yok mu?{" "}
                    <Link to="/kayit-ol" className="text-[var(--accent)]">
                        Kayıt Ol
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default GirisYap;