import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useScrollStore } from "../store/scrollStore";

export function useScrollRestore() {
    const location = useLocation();

    useEffect(() => {
        const savedY = useScrollStore.getState().positions[location.pathname] ?? 0;
        window.scrollTo(0, savedY);

        return () => {
            useScrollStore.getState().savePosition(location.pathname, window.scrollY);
        };
    }, [location.pathname]);
}
