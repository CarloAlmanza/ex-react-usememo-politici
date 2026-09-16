import { useEffect, useState } from "react";
import PoliticoCard from "./PoliticoCard";

const API_URL = "http://localhost:3333/politicians";

function PoliticiList() {
    const [politici, setPolitici] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchPolitici() {
            try {
                setLoading(true);
                const res = await fetch(API_URL);

                if (!res.ok) {
                    throw new Error(`Errore HTTP ${res.status}`);
                }

                const data = await res.json();
                if (!cancelled) setPolitici(data);
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchPolitici();

        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) return <p className="stato">Caricamento politici…</p>;
    if (error) return <p className="stato errore">Errore: {error}</p>;
    if (politici.length === 0) return <p className="stato">Nessun politico trovato.</p>;

    return (
        <section className="politici-list">
            {politici.map((p) => (
                <PoliticoCard key={p.id} politico={p} />
            ))}
        </section>
    );
}

export default PoliticiList;