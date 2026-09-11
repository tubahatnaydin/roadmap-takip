import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useScrollStore } from "./scrollStore";

export function useScrollRestorasyon() {
    const location = useLocation();

    useEffect(() => {
        const kayitliY = useScrollStore.getState().pozisyonlar[location.pathname] ?? 0;
        window.scrollTo(0, kayitliY);

        return () => {
            useScrollStore.getState().pozisyonKaydet(location.pathname, window.scrollY);
        };
    }, [location.pathname]);
}