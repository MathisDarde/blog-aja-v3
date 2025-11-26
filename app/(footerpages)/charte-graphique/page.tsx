"use client"

import { toast } from "sonner";

export default function CharteGraphique() {
    const handleCopy = async (color: string) => {
        try {
            await navigator.clipboard.writeText(color);
            toast.success("Couleur copiée dans le presse-papiers !")
        } catch (e) {
            toast.error(`${e}`)
            console.error(e)
        }
    }

    return (
        <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-10">
            <h1 className="text-center font-Bai_Jamjuree text-3xl md:text-4xl font-bold uppercase mb-6 md:mb-10">Charte Graphique</h1>
            
            <main className="space-y-6 max-w-[1300px] mx-auto">
            <section className="space-y-2">
                    <h2 className="font-Montserrat font-bold uppercase text-left text-lg sm:text-xl">Introduction</h2>
                    <p className="text-justify font-Montserrat text-sm sm:text-base">
                        Cette charte graphique définit les éléments visuels et stylistiques du site.
                        Elle garantit la cohérence de l’identité visuelle à travers l’ensemble des pages et supports.
                        Elle reprend majoritairement les couleurs de l&apos;AJ Auxerre ainsi que les polices d&apos;écritures
                        du site officiel du club, <a href="https://aja.fr" className="text-orange-third underline">aja.fr</a>.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="font-Montserrat font-bold uppercase text-left text-lg sm:text-xl">1. Logo & identité visuelle</h2>
                    <p className="text-justify font-Montserrat text-sm sm:text-base">
                        Le logo du site représente l’identité principale et doit toujours apparaître dans sa version originale,
                        sans déformation ni modification des couleurs.
                        Des variantes monochromes peuvent être utilisées selon le fond.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="font-Montserrat font-bold uppercase text-left text-lg sm:text-xl">2. Couleurs</h2>
                    <p className="text-justify font-Montserrat text-sm sm:text-base">
                        La palette de couleurs principales définit l’ambiance du site.
                        Elle repose sur les teintes nuancées et contrastées pour assurer une bonne lisibilité et une cohérence avec la direction
                        artistique principale.
                    </p>
                    <ul className="space-y-2">
                        <li className="text-justify font-Montserrat ml-4 text-sm sm:text-base flex items-center gap-2"><strong>Couleur principale&nbsp;:</strong><div className="bg-aja-blue h-4 w-4 border border-black cursor-pointer" onClick={() => handleCopy("#3c77b4")}></div></li>
                        <li className="text-justify font-Montserrat ml-4 text-sm sm:text-base flex items-center gap-2"><strong>Couleurs complémentaires&nbsp;:</strong><div className="bg-white h-4 w-4 border border-black cursor-pointer" onClick={() => handleCopy("#ffffff")}></div><div className="bg-black h-4 w-4 border border-black cursor-pointer" onClick={() => handleCopy("#000000")}></div><div className="bg-gray-100 h-4 w-4 border border-black cursor-pointer" onClick={() => handleCopy("#0000ff")}></div></li>
                        <li className="text-justify font-Montserrat ml-4 text-sm sm:text-base flex items-center gap-2"><strong>Couleur d&apos;accent&nbsp;:</strong><div className="bg-orange-third h-4 w-4 border border-black cursor-pointer" onClick={() => handleCopy("#f76200")}></div></li>
                    </ul>
                </section>

                <section className="space-y-2">
                    <h2 className="font-Montserrat font-bold uppercase text-left text-lg sm:text-xl">3. Typographie</h2>
                    <p className="text-justify font-Montserrat text-sm sm:text-base">
                        La typographie contribue à la lisibilité et à l’identité du site.
                        Elle doit être utilisée de manière cohérente sur toutes les pages.
                    </p>
                    <ul className="space-y-2">
                        <li className="text-justify font-Montserrat ml-4 text-sm sm:text-base"><strong>Police principale&nbsp;:</strong> Montserrat</li>
                        <li className="text-justify font-Bai_Jamjuree ml-4 text-base sm:text-lg"><strong>Police de titre&nbsp;:</strong> Bai Jamjuree</li>
                    </ul>
                </section>

                <section className="space-y-2">
                    <h2 className="font-Montserrat font-bold uppercase text-left text-lg sm:text-xl">4. Icônes & éléments graphiques</h2>
                    <p className="text-justify font-Montserrat text-sm sm:text-base">
                        Les icônes doivent être simples, vectorielles et cohérentes dans leur style.
                        Les éléments visuels (boutons, cartes, encadrés) respectent une même structure et des coins arrondis uniformes.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="font-Montserrat font-bold uppercase text-left text-lg sm:text-xl">5. Mise en page</h2>
                    <p className="text-justify font-Montserrat text-sm sm:text-base">
                        La mise en page repose sur une structure fluide et aérée.
                        Le contenu est centré dans un conteneur de largeur fixe afin d’améliorer la lecture sur les grands écrans.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="font-Montserrat font-bold uppercase text-left text-lg sm:text-xl">6. Bonnes pratiques</h2>
                    <ul className="space-y-2">
                        <li className="text-justify font-Montserrat ml-4 text-sm sm:text-base">Respecter la hiérarchie visuelle entre titres, sous-titres et texte.</li>
                        <li className="text-justify font-Montserrat ml-4 text-sm sm:text-base">Maintenir des marges et espacements constants.</li>
                        <li className="text-justify font-Montserrat ml-4 text-sm sm:text-base">Éviter les combinaisons de couleurs réduisant le contraste.</li>
                        <li className="text-justify font-Montserrat ml-4 text-sm sm:text-base">Préserver la cohérence entre les différentes pages.</li>
                    </ul>
                </section>

                <section className="space-y-2">
                    <h2 className="font-Montserrat font-bold uppercase text-left text-lg sm:text-xl">7. Évolutions</h2>
                    <p className="text-justify font-Montserrat text-sm sm:text-base">
                        La charte graphique peut être mise à jour en fonction des besoins du site ou de son évolution visuelle.
                        Toute modification majeure doit être appliquée de manière cohérente sur l’ensemble des supports.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="font-Montserrat font-bold uppercase text-left text-lg sm:text-xl">8. Suggestions et améliorations</h2>
                    <p className="text-justify font-Montserrat text-sm sm:text-base">
                        Nous sommes toujours à l&apos;écoute et le site, votre site, est en constante évolution. Si vous remarquez des problèmes
                        ou si vous avez des idées pertinentes d&apos;améliorations visuelles et graphiques, nous sommes disponibles et vous pouvez dès maintenant nous 
                        contacter à l&apos;adresse suivante <a href="mailto:memoiredauxerrois@gmail.com" className="text-orange-third underline">memoiredauxerrois@gmail.com</a>.
                        Nous essaierons de vous répondre dans les plus brefs délais et c&apos;est toujours un plaisir d&apos;échanger avec notre chère communauté. Merci !
                    </p>
                </section>
            </main>
        </div>
    )
}