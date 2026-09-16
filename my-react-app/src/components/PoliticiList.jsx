import { useEffect, useMemo, useState } from "react";
import PoliticoCard from "./PoliticoCard";

const API_URL = "http://localhost:3333/politicians";

function PoliticiList() {
    console.log("🔵 Render PoliticiList");

    const [politici, setPolitici] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //stato ricerca
    const [query, setQuery] = useState("");
    //stato posizione selezionata ("" = tutte)
    const [posizioneSelezionata, setPosizioneSelezionata] = useState("");

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

    //array derivato: posizioni uniche (ordinate alfabeticamente)
    const posizioniDisponibili = useMemo(() => {
        const set = new Set();
        for (const p of politici) {
            if (p.position) set.add(p.position);
        }
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [politici]);

    //array derivato: politici filtrati (query + posizione)
    const politiciFiltrati = useMemo(() => {
        const q = query.trim().toLowerCase();

        return politici.filter((p) => {
            // filtro posizione
            if (posizioneSelezionata && p.position !== posizioneSelezionata) {
                return false;
            }

            // filtro testo (se vuoto, passa)
            if (!q) return true;

            const nome = (p.name ?? "").toLowerCase();
            const bio = (p.biography ?? "").toLowerCase();
            return nome.includes(q) || bio.includes(q);
        });
    }, [politici, query, posizioneSelezionata]);

    if (loading) return <p className="stato">Caricamento politici…</p>;
    if (error) return <p className="stato errore">Errore: {error}</p>;

    const filtriAttivi = query || posizioneSelezionata;

    return (
        <section>
            <div className="filtri">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Cerca per nome o biografia…"
                    aria-label="Cerca politici"
                />

                <select
                    value={posizioneSelezionata}
                    onChange={(e) => setPosizioneSelezionata(e.target.value)}
                    aria-label="Filtra per posizione"
                >
                    <option value="">Tutte le posizioni</option>
                    {posizioniDisponibili.map((pos) => (
                        <option key={pos} value={pos}>
                            {pos}
                        </option>
                    ))}
                </select>

                {filtriAttivi && (
                    <button
                        type="button"
                        className="reset"
                        onClick={() => {
                            setQuery("");
                            setPosizioneSelezionata("");
                        }}
                    >
                        Reset
                    </button>
                )}

                <span className="contatore">
                    {politiciFiltrati.length} risultat
                    {politiciFiltrati.length === 1 ? "o" : "i"}
                </span>
            </div>

            {politiciFiltrati.length === 0 ? (
                <p className="stato">Nessun politico corrisponde ai filtri.</p>
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