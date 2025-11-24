"use client"

import { Article } from "@/contexts/Interfaces";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ArticleProps {
    article: Article;
    displayPosition: "horizontal" | "vertical";
    size: "small" | "large"
    showTags?: boolean;
    showAuthor?: boolean;
    showDate?: boolean;
    showTeaser?: boolean;
}

export default function ArticleShowcase({ article, displayPosition, size, showAuthor, showDate, showTags, showTeaser }: ArticleProps) {
    const getRandomTags = (tags: string[] = [], max = 3) => {
        if (!tags || tags.length === 0) return [] as string[];
        const copy = [...tags];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy.slice(0, max);
    };

    const [tagData, setTagData] = useState<Record<string, any> | any[] | null>(null);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            if (typeof window === "undefined") return;
            try {
                const res = await fetch("/data/articletags.json");
                if (!res.ok) return;
                const json = await res.json();
                if (!mounted) return;
                setTagData(json);
            } catch (e) {
                // ignore - we'll fallback to the raw tag
            }
        };
        load();
        return () => {
            mounted = false;
        };
    }, []);

    const humanizeTag = (slug: string) =>
        slug
            .replace(/[-_]+/g, " ")
            .replace(/\b\w/g, (ch) => ch.toUpperCase());

    const getTagDisplay = (slug: string) => {
        if (!tagData) return humanizeTag(slug);

        // If tagData is an object map: { "ligue-1": "Ligue 1" }
        if (!Array.isArray(tagData) && typeof tagData === "object") {
            if (Object.prototype.hasOwnProperty.call(tagData, slug)) return tagData[slug];
            // otherwise try to find a key whose value equals slug
            for (const [k, v] of Object.entries(tagData)) {
                if (v === slug) return k;
            }
        }

        // If tagData is an array, try to find an object where any value equals the slug
        if (Array.isArray(tagData)) {
            const found = tagData.find((item: any) => {
                if (!item || typeof item !== "object") return false;
                return Object.values(item).some((val) => val === slug);
            });
            if (found) {
                return (
                    found.tag || found.name || found.label || found.display || found.title || found.nom || found.fr || humanizeTag(slug)
                );
            }
            // also support array of simple pairs like [{ "ligue-1": "Ligue 1" }, ...]
            const pair = tagData.find((item: any) => {
                if (!item || typeof item !== "object") return false;
                return Object.keys(item).some((k) => item[k] === slug || k === slug);
            });
            if (pair) {
                const key = Object.keys(pair).find((k) => pair[k] === slug || k === slug) as string | undefined;
                if (key) return pair[key] ?? key;
            }
        }

        return humanizeTag(slug);
    };

    const formatFrenchDate = (dateInput: string | Date | undefined) => {
        if (!dateInput) return "";
        const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
        const formatted = date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
        return `le ${formatted}`;
    };

    const smallTextSize = size === "large" ? "text-sm" : "text-xs";

    return (
        <div>
            <div className="flex flex-col gap-6">
                <Link href={`/articles/${article.slug}`} key={article.id_article}>
                    {displayPosition === "horizontal" ? (
                        <div className="flex bg-white w-full max-h-[120px] overflow-hidden">
                            <Image
                                className="object-cover w-[150px] h-auto"
                                width={512}
                                height={512}
                                src={article.imageUrl}
                                alt={article.title}
                            />
                            <div className="p-2 space-y-2">
                                {(showAuthor || showDate) && (
                                    <div className="flex items-center gap-1">
                                        <p className={`font-Montserrat ${smallTextSize} font-light`}>{article.author}</p>
                                        <p className={`font-Montserrat ${smallTextSize} font-light`}>{formatFrenchDate(article.createdAt as string | Date)}</p>
                                    </div>
                                )}
                                <h2 className="text-base text-left font-Montserrat font-semibold">
                                    {article.title}
                                </h2>
                                {showTeaser && (
                                    <p className={`font-Montserrat ${smallTextSize} text-left italic`}>{article.teaser}</p>
                                )}
                                {showTags && (
                                    <div className="flex flex-wrap gap-2">
                                        {getRandomTags(article.tags, 3).map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className={`font-Montserrat bg-gray-200 rounded-md px-3 py-1  ${size === "small" ? "text-[11px]" : "text-xs"}`}                                            >
                                                {getTagDisplay(tag)}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col bg-white w-full overflow-hidden">
                            <Image
                                className="object-cover w-full h-auto"
                                width={512}
                                height={512}
                                src={article.imageUrl}
                                alt={article.title}
                            />
                            <div className="py-2 space-y-1">
                                {(showAuthor || showDate) && (
                                    <div className="flex items-center gap-1">
                                        <p className={`font-Montserrat ${smallTextSize} font-light`}>{article.author}</p>
                                        <p className={`font-Montserrat ${smallTextSize} font-light`}>{formatFrenchDate(article.createdAt as string | Date)}</p>
                                    </div>
                                )}
                                <h2 className={`${size === "small" ? "text-base" : "text-lg"} text-left font-Montserrat font-semibold`}>
                                    {article.title}
                                </h2>
                                {showTeaser && (
                                    <p className={`font-Montserrat ${smallTextSize} text-left italic`}>{article.teaser}</p>
                                )}
                                {showTags && (
                                    <div className="flex flex-wrap gap-2">
                                        {getRandomTags(article.tags, 3).map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className={`font-Montserrat bg-gray-200 rounded-md px-3 py-1  ${size === "small" ? "text-[11px]" : "text-xs"}`} 
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
    )
}