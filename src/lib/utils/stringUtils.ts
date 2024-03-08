import { transliterate } from "transliteration";

// Receives a string with any UTF-8 characters and converst to ASCII kebab case
// e.g. in: Γεια, World! -> out: geia-world
export function normalizeToKebabCase(str: string) {
    const transliterated = transliterate(str);
    return transliterated
        .toLowerCase()
        .replace(/[\/!@#$%^&*()_+={}\[\];:<>?,.]/g, '-') // Replace common special characters with hyphens.
        .trim()
        .replace(/[^a-z0-9- ]/g, '') // Remove non-alphanumeric characters except spaces and hyphens.
        .replace(/\s+/g, '-') // Replace sequences of spaces with a single hyphen.
        .replace(/-+/g, '-') // Consolidate multiple hyphens into one.
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens.
}