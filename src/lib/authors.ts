import authorsData from '@/data/authors.json';
import type { Author } from '@/types/author';

const authors = authorsData as Author[];

/**
 * Returns all authors from static JSON data.
 */
export function listAuthors(): Author[] {
	return authors;
}

/**
 * Returns a single author by slug ID, or null if not found.
 */
export function getAuthorBySlug(slug: string): Author | null {
	return authors.find((author) => author.id === slug) ?? null;
}

/**
 * Returns a single author by slug ID, or null if not found.
 */
export function getAuthor(slug: string): Author | null {
	return getAuthorBySlug(slug);
}
