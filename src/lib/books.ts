import booksData from '@/data/books.json';
import type { Book } from '@/types/book';

const books = booksData as Book[];

/**
 * Returns all books from static JSON data.
 */
export function listBooks(): Book[] {
	return books;
}

/**
 * Returns a single book by slug ID, or null if not found.
 */
export function getBookBySlug(slug: string): Book | null {
	return books.find((book) => book.id === slug) ?? null;
}

/**
 * Returns a single book by slug ID, or null if not found.
 */
export function getBook(slug: string): Book | null {
	return getBookBySlug(slug);
}
