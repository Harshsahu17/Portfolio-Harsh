"use client";

import React, { createContext, useContext, useMemo } from "react";
import { Locale } from "@/lib/types";

type Content = Record<string, any>;

interface LanguageContextType {
    language: Locale;
    content: any;
    setLanguage: (lang: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function deepMerge(target: any, source: any): any {
    const result = { ...target };
    for (const key of Object.keys(source)) {
        if (
            source[key] &&
            typeof source[key] === "object" &&
            !Array.isArray(source[key]) &&
            target[key] &&
            typeof target[key] === "object" &&
            !Array.isArray(target[key])
        ) {
            result[key] = deepMerge(target[key], source[key]);
        } else {
            result[key] = source[key];
        }
    }
    return result;
}

const parseContentWithHtml = (data: any): any => {
    if (typeof data === "string") {
        const hasHtml = /<[a-z][\s\S]*>/i.test(data);

        if (hasHtml) {
            return (
                <span
                    key={data}
                    dangerouslySetInnerHTML={{ __html: data }}
                />
            );
        }
        return data;
    }

    if (Array.isArray(data)) {
        return data.map(parseContentWithHtml);
    }

    if (typeof data === "object" && data !== null) {
        const result: any = {};
        for (const key in data) {
            result[key] = parseContentWithHtml(data[key]);
        }
        return result;
    }

    return data;
};

interface LanguageProviderProps {
    children: React.ReactNode;
    lang: Locale;
    dictionary: Content;
    contents: Content;
}

export function LanguageProvider({ children, lang, dictionary, contents }: LanguageProviderProps) {
    const processedContent = useMemo(() => {
        const merged = deepMerge(dictionary, contents);
        return parseContentWithHtml(merged);
    }, [dictionary, contents]);

    const setLanguage = (newLang: Locale) => {
        const currentPath = window.location.pathname;
        const newPath = currentPath.replace(`/${lang}`, `/${newLang}`);
        window.location.href = newPath;
    };

    const value = {
        language: lang,
        content: processedContent,
        setLanguage,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}