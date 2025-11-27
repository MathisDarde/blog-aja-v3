"use client";

import { Article } from "@/contexts/Interfaces";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ArticleProps {
    article: Article;
    displayPosition: "horizontal" | "vertical";
    size: "small" | "large";
    showTags?: boolean;
    showAuthor?: boolean;
    showDate?: boolean;
    showTeaser?: boolean;
}

export interface TagItem {
    id: number;
    tag: string;
    value: string;
    img: string;
    type: string;
}

interface ExtendedWindow extends Window {
    __TAGS_CACHE__?: TagItem[];
}

const getRandomTags = (tags: string[] = [], max = 3): string[] => {
    const copy = [...tags];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, max);
};

export default function ArticleShowcase({
    article,
    displayPosition,
    size,
    showAuthor,
    showDate,
    showTags,
    showTeaser,
}: ArticleProps) {
    const [tagData, setTagData] = useState<TagItem[] | null>(null);
    const [displayTags, setDisplayTags] = useState<string[]>([]);

    useEffect(() => {
        let mounted = true;
        const win = typeof window !== "undefined" ? (window as unknown as ExtendedWindow) : null;

        const maxTags = displayPosition === "horizontal" ? 2 : 5;
        setDisplayTags(getRandomTags(article.tags, maxTags));

        if (win && win.__TAGS_CACHE__) {
            setTagData(win.__TAGS_CACHE__);
            return;
        }

        const load = async () => {
            try {
                const res = await fetch("/data/articletags.json");
                if (!res.ok) return;
                const json: TagItem[] = await res.json();

                if (mounted) {
                    setTagData(json);
                    if (win) win.__TAGS_CACHE__ = json;
                }
            } catch { /* ignore */ }
        };
        load();

        return () => { mounted = false; };
    }, [article.tags, displayPosition]);

    const humanizeTag = (slug: string): string =>
        slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase());

    const getTagDisplay = (slug: string): string => {
        if (!tagData) return humanizeTag(slug);
        const match = tagData.find((item) => item.value === slug);
        return match ? match.tag : humanizeTag(slug);
    };

    const formatFrenchDate = (dateInput: string | Date | undefined): string => {
        if (!dateInput) return "";
        const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
        return `le ${date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        })}`;
    };

    const smallTextSize = size === "large" ? "text-xs sm:text-sm" : "text-[10px] sm:text-xs";

    return (
        <div className="w-full">
            <div className="flex flex-col gap-6">
                <Link href={`/articles/${article.slug}`} key={article.id_article} className="group w-full block">

                    {displayPosition === "horizontal" ? (
                        <div className="flex bg-white w-full h-[110px] sm:h-[130px] overflow-hidden rounded-md border border-transparent hover:border-gray-100 transition-colors">

                            {/* Image - Taille fixe */}
                            <div className="relative w-[110px] sm:w-[150px] flex-shrink-0 h-full">
                                <Image
                                    className="object-cover w-full h-full"
                                    width={512}
                                    height={512}
                                    src={article.imageUrl}
                                    alt={article.title}
                                />
                            </div>

                            {/* Contenu Texte */}
                            <div className="p-2 sm:p-3 flex flex-col h-full min-w-0">

                                {/* 1. Métadonnées (Auteur/Date) - Ne rétrécit pas */}
                                {(showAuthor || showDate) && (
                                    <div className="hidden sm:flex flex-wrap items-center gap-1 text-gray-500 mb-1 flex-shrink-0">
                                        {showAuthor && (
                                            <p className={`font-Montserrat ${smallTextSize} font-light truncate`}>
                                                {article.author}
                                            </p>
                                        )}
                                        {showDate && (
                                            <p className={`font-Montserrat ${smallTextSize} font-light`}>
                                                {formatFrenchDate(article.createdAt)}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* 2. Titre - Priorité absolue */}
                                {/* line-clamp-3 autorise jusqu'à 3 lignes. 
                flex-shrink-0 empêche le titre d'être écrasé par le reste. */}
                                <h2 className="text-sm sm:text-base text-left font-Montserrat font-semibold leading-tight group-hover:text-aja-blue transition-colors line-clamp-3 flex-shrink-0 mb-1">
                                    {article.title}
                                </h2>

                                {/* 3. Teaser - Secondaire */}
                                {/* truncate limite à 1 ligne. Si le titre prend toute la place,
                le layout flex peut masquer ou couper proprement ceci. */}
                                {showTeaser && (
                                    <p className={`font-Montserrat ${smallTextSize} text-left italic text-gray-600 truncate hidden sm:block text-gray-500 mb-1`}>
                                        {article.teaser}
                                    </p>
                                )}

                                {/* 4. Tags - Poussés vers le bas */}
                                {/* mt-auto force ce bloc à aller tout en bas de la carte */}
                                {showTags && (
                                    <div className="flex flex-wrap gap-1 mt-auto pt-0.5 overflow-hidden">
                                        {displayTags.map((tag) => (
                                            <span
                                                key={tag}
                                                className={`font-Montserrat bg-gray-100 text-gray-600 rounded px-2 py-0.5 ${size === "small" ? "text-[10px] sm:text-[11px]" : "text-[10px] sm:text-xs"
                                                    } truncate max-w-[80px]`}
                                            >
                                                {getTagDisplay(tag)}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col bg-white w-full overflow-hidden rounded-md">
                            <div className="relative w-full aspect-video overflow-hidden">
                                <Image
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                    width={800}
                                    height={450}
                                    src={article.imageUrl}
                                    alt={article.title}
                                />
                            </div>

                            <div className="py-3 sm:py-4 space-y-2">
                                {(showAuthor || showDate) && (
                                    <div className="flex items-center gap-1 text-gray-500">
                                        {showAuthor && (
                                            <p className={`font-Montserrat ${smallTextSize} font-light`}>
                                                {article.author},
                                            </p>
                                        )}
                                        {showDate && (
                                            <p className={`font-Montserrat ${smallTextSize} font-light`}>
                                                {formatFrenchDate(article.createdAt)}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <h2
                                    className={`${size === "small" ? "text-lg" : "text-lg sm:text-xl"
                                        } text-left font-Montserrat font-semibold group-hover:text-aja-blue transition-colors`}
                                >
                                    {article.title}
                                </h2>

                                {showTeaser && (
                                    <p className={`font-Montserrat text-xs sm:text-sm text-left italic text-gray-700 line-clamp-3`}>
                                        {article.teaser}
                                    </p>
                                )}

                                {showTags && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {/* Utilisation du state displayTags */}
                                        {displayTags.map((tag) => (
                                            <span
                                                key={tag}
                                                className={`font-Montserrat bg-gray-100 text-gray-700 rounded-md px-3 py-1 ${size === "small" ? "text-[10px]" : "text-[10px] sm:text-xs"
                                                    }`}
                                            >
                                                {getTagDisplay(tag)}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </Link>
            </div>
        </div>
    );
}