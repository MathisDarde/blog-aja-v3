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

// Types propres pour les tags du JSON
type TagRecord = Record<string, string>;

interface TagItemObject {
    [key: string]: string;
}

type TagData = TagRecord | TagItemObject[];

export default function ArticleShowcase({
    article,
    displayPosition,
    size,
    showAuthor,
    showDate,
    showTags,
    showTeaser,
}: ArticleProps) {
    const getRandomTags = (tags: string[] = [], max = 3): string[] => {
        if (tags.length === 0) return [];
        const copy = [...tags];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy.slice(0, max);
    };

    const [tagData, setTagData] = useState<TagData | null>(null);

    // Chargement du JSON des tags
    useEffect(() => {
        let mounted = true;
        const load = async () => {
            if (typeof window === "undefined") return;
            try {
                const res = await fetch("/data/articletags.json");
                if (!res.ok) return;

                const json: TagData = await res.json();
                if (!mounted) return;
                setTagData(json);
            } catch {
                // silencieux
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

    const getTagDisplay = (slug: string): string => {
        if (!tagData) return humanizeTag(slug);

        // === Cas 1 : objet simple { "ligue-1": "Ligue 1" }
        if (!Array.isArray(tagData)) {
            if (slug in tagData) return tagData[slug];
            for (const [key, val] of Object.entries(tagData)) {
                if (val === slug) return key;
            }
        }

        // === Cas 2 : tableau d'objets [{ "ligue-1": "Ligue 1" }, ...]
        if (Array.isArray(tagData)) {
            for (const item of tagData) {
                if (typeof item === "object") {
                    if (item[slug]) return item[slug];
                    for (const [key, val] of Object.entries(item)) {
                        if (val === slug) return key;
                    }
                }
            }
        }

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
                                        <p className={`font-Montserrat ${smallTextSize} font-light`}>
                                            {article.author}
                                        </p>
                                        <p className={`font-Montserrat ${smallTextSize} font-light`}>
                                            {formatFrenchDate(article.createdAt)}
                                        </p>
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
                                className="object-cover w-full h-auto"
                                width={512}
                                height={512}
                                src={article.imageUrl}
                                alt={article.title}
                            />

                            <div className="py-2 space-y-1">
                                {(showAuthor || showDate) && (
                                    <div className="flex items-center gap-1">
                                        <p className={`font-Montserrat ${smallTextSize} font-light`}>
                                            {article.author}
                                        </p>
                                        <p className={`font-Montserrat ${smallTextSize} font-light`}>
                                            {formatFrenchDate(article.createdAt)}
                                        </p>
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
