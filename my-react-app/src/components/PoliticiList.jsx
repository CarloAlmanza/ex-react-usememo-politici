import { useEffect, useMemo, useState } from "react";
import PoliticoCard from "./PoliticoCard";

const API_URL = "http://localhost:3333/politicians";

function PoliticiList() {
    console.log("🔵 Render PoliticiList");

    const [politici, setPolitici] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //stato della ricerca
    const [query, setQuery] = useState("");

    //fetch al mount
    useEffect(() => {
        let cancelled = false;

        async function fetchPolitici() {
            try {
                setLoading(true);
                const res = await fetch(API_URL);
                if (!res.ok) throw new Error(`Errore HTTP ${res.status}`);
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

    //array derivato e memoizzato
    const politiciFiltrati = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return politici;

        return politici.filter((p) => {
            const nome = (p.name ?? "").toLowerCase();
            const bio = (p.biography ?? "").toLowerCase();
            return nome.includes(q) || bio.includes(q);
        });
    }, [politici, query]);

    if (loading) return <p className="stato">Caricamento politici…</p>;
    if (error) return <p className="stato errore">Errore: {error}</p>;

    return (
        <section>
            <div className="ricerca">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Cerca per nome o biografia…"
                    aria-label="Cerca politici"
                />
                {query && (
                    <span className="contatore">
                        {politiciFiltrati.length} risultat
                        {politiciFiltrati.length === 1 ? "o" : "i"}
                    </span>
                )}
            </div>

            {politiciFiltrati.length === 0 ? (
                <p className="stato">Nessun politico corrisponde a "{query}".</p>
            ) : (
                <div className="politici-list">
                    {politiciFiltrati.map((p) => (
                        <PoliticoCard key={p.id} politico={p} />
                    ))}
                </div>
            )}
        </section>
    );
}

export default PoliticiList;