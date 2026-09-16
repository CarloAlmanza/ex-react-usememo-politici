function PoliticoCard({ politico }) {
    const { name, image, position, biography } = politico;

    return (
        <article className="politico-card">
            <img src={image} alt={name} className="politico-image" />
            <div className="politico-body">
                <h2 className="politico-name">{name}</h2>
                <h3 className="politico-position">{position}</h3>
                <p className="politico-bio">{biography}</p>
            </div>
        </article>
    );
}

export default PoliticoCard;