"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { CitationData } from "./CitationData"

export default function CitationSlider() {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [scrollProgress, setScrollProgress] = useState(0)
    
    // États pour savoir si on peut scroller à gauche ou à droite (pour cacher les flèches)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)

    // Fonction unifiée pour calculer la progression et la visibilité des flèches
    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
            const scrollableWidth = scrollWidth - clientWidth
            
            // Calcul du pourcentage (0-100)
            const progress = scrollableWidth > 0 ? (scrollLeft / scrollableWidth) * 100 : 0
            setScrollProgress(progress)

            // Mise à jour de la visibilité des flèches avec une petite marge de tolérance (5px)
            setCanScrollLeft(scrollLeft > 5)
            setCanScrollRight(scrollLeft < scrollableWidth - 5)
        }
    }

    // Effect pour vérifier l'état initial des flèches au chargement
    useEffect(() => {
        handleScroll()
    }, [])

    const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest'
        })
    }

    // Fonction pour scroller via les flèches
    const scrollContainer = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            // On scroll de la largeur d'une carte (900px) + le gap (24px) approximativement
            const scrollAmount = 924 
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    return (
        <div className="max-w-[1300px] mx-auto pt-8 pb-8 relative group">
            
            {/* === BARRE DE PROGRESSION (MOBILE SEULEMENT) === */}
            <div className="md:hidden px-6 mb-6">
                <div className="flex justify-between items-end mb-1">
                     <span className="text-xs font-Montserrat font-medium text-gray-400 uppercase">
                        Citations
                    </span>
                    <span className="text-xs font-Montserrat font-medium text-aja-blue">
                        {Math.round(scrollProgress)}%
                    </span>
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-aja-blue transition-all duration-150 ease-out rounded-full"
                        style={{ width: `${scrollProgress}%` }}
                    />
                </div>
            </div>

            {/* === FLÈCHE GAUCHE (Desktop) === */}
            {/* hidden sur mobile, flex sur md. Opacité réduite par défaut, 100 au survol du groupe */}
            <button
                onClick={() => scrollContainer('left')}
                disabled={!canScrollLeft}
                className={`hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 
                           items-center justify-center w-12 h-12 rounded-full 
                           bg-white/80 backdrop-blur-sm shadow-lg border border-gray-100 text-aja-blue
                           transition-all duration-300 hover:scale-110 hover:bg-white
                           disabled:opacity-0 disabled:pointer-events-none
                           ${canScrollLeft ? 'opacity-0 group-hover:opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                aria-label="Citation précédente"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button>

            {/* === FLÈCHE DROITE (Desktop) === */}
            <button
                onClick={() => scrollContainer('right')}
                disabled={!canScrollRight}
                className={`hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 
                           items-center justify-center w-12 h-12 rounded-full 
                           bg-white/80 backdrop-blur-sm shadow-lg border border-gray-100 text-aja-blue
                           transition-all duration-300 hover:scale-110 hover:bg-white
                           disabled:opacity-0 disabled:pointer-events-none
                           ${canScrollRight ? 'opacity-0 group-hover:opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
                aria-label="Citation suivante"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </button>

            {/* Conteneur de scroll */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 scroll-smooth no-scrollbar px-6 md:px-4 pb-8"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {CitationData.map((citation, index) => (
                    <div
                        key={index}
                        onClick={handleCardClick}
                        className="cursor-pointer snap-center shrink-0 w-[80vw] md:w-[900px] flex flex-col md:flex-row bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow last:mr-6"
                    >
                        {/* Image */}
                        <div className="md:w-7/12 relative h-48 md:h-auto">
                            <Image
                                src={citation.bannerImage}
                                width={500}
                                height={500}
                                alt="Banner"
                                className="w-full h-full object-cover pointer-events-none"
                            />
                        </div>

                        {/* Contenu */}
                        <div className="md:w-5/12 p-5 sm:p-8 flex flex-col justify-center">
                            <div className="mb-2 sm:mb-6 select-none">
                                <span className="text-4xl text-aja-blue font-serif">“</span>
                                <p className="font-Montserrat text-gray-700 italic text-base sm:text-lg -mt-4 pl-0 sm:pl-4 relative z-10">
                                    {citation.citation}
                                </p>
                                <span className="text-4xl text-aja-blue font-serif">”</span>
                            </div>

                            <div className="flex items-center gap-3 mt-2 md:mt-4 pt-4 border-t border-gray-100 select-none">
                                <Image
                                    src={citation.personPicture}
                                    width={80}
                                    height={80}
                                    alt={citation.person}
                                    className="size-10 sm:size-12 rounded-full object-cover ring-2 ring-aja-blue pointer-events-none"
                                />
                                <div className="text-left">
                                    <p className="font-bold text-gray-900 text-base sm:text-lg font-Bai_Jamjuree">{citation.person}</p>
                                    <p className="text-xs text-gray-500 font-medium font-Montserrat">{citation.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}