"use client"

import Image from "next/image"
import Link from "next/link"

const pillars = [
    {
        id: 1,
        title: "EFFECTIF",
        subtitle: "Nos Guerriers",
        image: "/_assets/img/danois.webp",
        link: "/effectif-actuel",
        color: "bg-aja-blue"
    },
    {
        id: 2,
        title: "PALMARÈS",
        subtitle: "La Gloire",
        image: "/_assets/img/djibrilcisserecords.avif",
        link: "/palmares",
        color: "bg-white"
    },
    {
        id: 3,
        title: "CLASSEMENT",
        subtitle: "Ligue 1",
        image: "/_assets/img/ligue2.jpg",
        link: "/classement-statistiques",
        color: "bg-aja-blue"
    },
    {
        id: 4,
        title: "QUIZ",
        subtitle: "Testez-vous", // J'ai changé "La Gloire" pour varier un peu :)
        image: "/_assets/img/martins.webp",
        link: "/quiz",
        color: "bg-white"
    },
    {
        id: 5,
        title: "CALENDRIER",
        subtitle: "Les Matchs",
        image: "/_assets/img/calendrier.webp",
        link: "/calendrier",
        color: "bg-aja-blue"
    },
    {
        id: 6,
        title: "CHANTS",
        subtitle: "L'ambiance",
        image: "/_assets/img/public.webp",
        link: "/chants",
        color: "bg-white"
    },
]

export default function PagesTilt() {
    return (
        <div className="max-w-[1300px] mx-auto py-10 px-4">
            {/* Conteneur Flex hauteur fixe */}
            <div className="flex flex-col md:flex-row h-[600px] gap-2 md:gap-0 rounded-3xl overflow-hidden">
                
                {pillars.map((item) => (
                    <Link
                        key={item.id}
                        href={item.link}
                        className={`
                            relative group flex-1 hover:flex-[2.5] 
                            transition-[flex] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] 
                            overflow-hidden cursor-pointer
                            ${item.color}
                        `}
                    >
                        {/* Image de fond avec Zoom lent */}
                        <div className="absolute inset-0 w-full h-full">
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 object-top"
                            />

                            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/10 transition-colors duration-700" />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>

                        {/* Contenu Texte */}
                        <div className="absolute inset-0 p-8 flex flex-col justify-end items-start md:items-center group-hover:items-start transition-all duration-700">
                            
                            <span className="text-[8rem] md:text-[10rem] font-bold text-white/5 absolute top-0 right-0 leading-none -translate-y-10 translate-x-10 group-hover:translate-x-0 transition-transform duration-700 font-Bai_Jamjuree">
                                0{item.id}
                            </span>

                            <div className="relative z-10 w-full">
                                <p className="text-orange-third font-bold tracking-[0.6em] text-xs uppercase mb-2 opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                    {item.subtitle}
                                </p>
                                
                                <div className="flex items-center justify-between w-full border-t border-white/30 pt-4 md:border-none md:pt-0 group-hover:border-t group-hover:border-white/30 group-hover:pt-4 transition-all duration-500">
                                    <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-Bai_Jamjuree font-bold uppercase whitespace-nowrap">
                                        {item.title}
                                    </h2>
                                    
                                    {/* Flèche qui apparait */}
                                    <span className="hidden md:block opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-white text-2xl">
                                        &rarr;
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}