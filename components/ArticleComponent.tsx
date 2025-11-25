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

// === Types exacts de TON JSON ===
export interface TagItem {
    id: number;
    tag: string;   // label affiché
    value: string; // slug utilisé dans article.tags
    img: string;
    type: string;
}

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

    const getRandomTags = (tags: string[] = [], max = 3): string[] => {
        const copy = [...tags];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy.slice(0, max);
    };

    // Chargement du JSON des tags
    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const res = await fetch("/data/articletags.json");
                if (!res.ok) return;

                const json: TagItem[] = await res.json();
                if (!mounted) return;

                setTagData(json);
            } catch {
                /* ignore */
            }
        };
        load();
        return () => {
            mounted = false;
        };
    }, []);

    const humanizeTag = (slug: string): string =>
        slug
            .replace(/[-_]+/g, " ")
            .replace(/\b\w/g, (ch) => ch.toUpperCase());

    // Cherche l'objet où "value" === slug
    const getTagDisplay = (slug: string): string => {
        if (!tagData) return humanizeTag(slug);

        const match = tagData.find((item) => item.value === slug);
        if (match) return match.tag;

        return humanizeTag(slug);
    };

    const formatFrenchDate = (dateInput: string | Date | undefined): string => {
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
                                        {showAuthor && (
                                            <p className={`font-Montserrat ${smallTextSize} font-light`}>
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

                                <h2 className="text-base text-left font-Montserrat font-semibold">
                                    {article.title}
                                </h2>

                                {showTeaser && (
                                    <p className={`font-Montserrat ${smallTextSize} text-left italic`}>
                                        {article.teaser}
                                    </p>
                                )}

                                {showTags && (
                                    <div className="flex flex-wrap gap-2">
                                        {getRandomTags(article.tags, 3).map((tag) => (
                                            <span
                                                key={tag}
                                                className={`font-Montserrat bg-gray-200 rounded-md px-3 py-1 ${
                                                    size === "small" ? "text-[11px]" : "text-xs"
                                                }`}
                                            >
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
                                className="object-cover w-full h-auto aspect-video"
                                width={512}
                                height={512}
                                src={article.imageUrl}
                                alt={article.title}
                            />

                            <div className="py-2 space-y-1">
                                {(showAuthor || showDate) && (
                                    <div className="flex items-center gap-1">
                                        {showAuthor && (
                                            <p className={`font-Montserrat ${smallTextSize} font-light`}>
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

                                <h2
                                    className={`${
                                        size === "small" ? "text-base" : "text-lg"
                                    } text-left font-Montserrat font-semibold`}
                                >
                                    {article.title}
                                </h2>

                                {showTeaser && (
                                    <p className={`font-Montserrat ${smallTextSize} text-left italic`}>
                                        {article.teaser}
                                    </p>
                                )}

                                {showTags && (
                                    <div className="flex flex-wrap gap-2">
                                        {getRandomTags(article.tags, 3).map((tag) => (
                                            <span
                                                key={tag}
                                                className={`font-Montserrat bg-gray-200 rounded-md px-3 py-1 ${
                                                    size === "small" ? "text-[11px]" : "text-xs"
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
