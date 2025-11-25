"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { CitationData } from "./CitationData"

export default function CitationSlider() {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [scrollProgress, setScrollProgress] = useState(0)

    // Fonction pour calculer la progression du scroll (0% à 100%)
    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
            const scrollableWidth = scrollWidth - clientWidth
            // On évite la division par 0
            const progress = scrollableWidth > 0 ? (scrollLeft / scrollableWidth) * 100 : 0
            setScrollProgress(progress)
        }
    }

    const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest'
        })
    }

    return (
        <div className="max-w-[1300px] mx-auto pt-8 pb-8 relative group">
            
            {/* === BARRE DE PROGRESSION (MOBILE SEULEMENT) === */}
            {/* md:hidden la cache sur ordi. sticky top-0 peut être utilisé si vous voulez qu'elle reste en haut */}
            <div className="md:hidden px-6 mb-6">
                <div className="flex justify-between items-end mb-1">
                     <span className="text-xs font-Montserrat font-medium text-gray-400 uppercase">
                        Citations
                    </span>
                    <span className="text-xs font-Montserrat font-medium text-aja-blue">
                        {Math.round(scrollProgress)}%
                    </span>
                </div>
                {/* Fond de la barre (Gris clair) */}
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    {/* Barre active (Bleue) qui bouge */}
                    <div 
                        className="h-full bg-aja-blue transition-all duration-150 ease-out rounded-full"
                        style={{ width: `${scrollProgress}%` }}
                    />
                </div>
            </div>

            {/* Conteneur de scroll */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll} // On écoute le scroll ici
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