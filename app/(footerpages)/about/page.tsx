export default function APropos() {
    return (
        <div className="text-center bg-gray-100 min-h-screen w-screen box-border p-10">
            <h1 className="text-center font-Bai_Jamjuree text-3xl md:text-4xl font-bold uppercase mb-6 md:mb-10">A propos</h1>

            <main className="space-y-6 max-w-[1300px] mx-auto">
                <section className="space-y-2">
                    <h2 className="font-Montserrat font-bold uppercase text-left text-lg sm:text-xl">Notre mission</h2>
                    <p className="text-justify font-Montserrat text-sm sm:text-base">
                        Notre site a pour objectif de proposer un espace simple, ludique et accessible à tous.
                        Nous souhaitons offrir du contenu de qualité et une expérience agréable à chaque utilisateur,
                        tout en favorisant la découverte, l’apprentissage et le partage. Nous sommes un groupe de fans
                        passionnés qui propose une solution, pour le public auxerrois, de se rappeler les bons souvenirs
                        d&apos;antan et de faire perdurer la mémoire du club icaunais.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="font-Montserrat font-bold uppercase text-left text-lg sm:text-xl">Qui sommes-nous&nbsp;?</h2>
                    <p className="text-justify font-Montserrat text-sm sm:text-base">
                        Nous sommes une petite équipe de passionnés du web et du numérique,
                        réunis autour d’une même ambition&nbsp;: créer des outils utiles et des expériences
                        en ligne qui ont du sens.
                    </p>
                    <p className="text-justify font-Montserrat text-sm sm:text-base">
                        Notre équipe regroupe des profils variés — développeurs, designers, rédacteurs —
                        qui travaillent ensemble pour faire évoluer le site et proposer régulièrement de nouvelles fonctionnalités
                        et de nouvelles histoires.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="font-Montserrat font-bold uppercase text-left text-lg sm:text-xl">Nos valeurs</h2>
                    <ul>
                        <li className="text-justify font-Montserrat text-sm sm:text-base"><strong>Accessibilité&nbsp;:</strong> rendre le contenu compréhensible et utilisable par tous.</li>
                        <li className="text-justify font-Montserrat text-sm sm:text-base"><strong>Transparence&nbsp;:</strong> être clair sur notre fonctionnement et nos engagements.</li>
                        <li className="text-justify font-Montserrat text-sm sm:text-base"><strong>Innovation&nbsp;:</strong> explorer de nouvelles idées pour améliorer constamment l’expérience utilisateur.</li>
                        <li className="text-justify font-Montserrat text-sm sm:text-base"><strong>Respect&nbsp;:</strong> garantir un espace sûr et bienveillant pour chaque utilisateur.</li>
                        <li className="text-justify font-Montserrat text-sm sm:text-base"><strong>Transmettre&nbsp;:</strong> partager du contenu qui peut toucher tous les publics.</li>
                    </ul>
                </section>

                <section className="space-y-2">
                    <h2 className="font-Montserrat font-bold uppercase text-left text-lg sm:text-xl">Nous contacter</h2>
                    <p className="text-justify font-Montserrat text-sm sm:text-base">
                        Une question, une suggestion ou une idée à partager&nbsp;?
                        Vous pouvez nous écrire à <a href="mailto:memoiredauxerrois@gmail.com" className="text-aja-blue underline">memoiredauxerrois@gmail.com</a>.<br />
                        Nous lisons tous les messages et faisons de notre mieux pour répondre rapidement.
                    </p>
                </section>
            </main>
        </div>
    )
}