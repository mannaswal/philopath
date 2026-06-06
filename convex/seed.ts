import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { slugifyTitle } from './lib/slugify';

const authorSeedValidator = v.object({
	id: v.string(),
	fullName: v.string(),
	commonName: v.string(),
});

const bookSeedValidator = v.object({
	book: v.string(),
	authors: v.array(v.string()),
});

const seedResultValidator = v.object({
	inserted: v.number(),
	skipped: v.number(),
});

const authorDetailsSeedValidator = v.object({
	id: v.string(),
	birthYear: v.number(),
	deathYear: v.optional(v.number()),
	regions: v.array(v.string()),
	bio: v.string(),
});

const enrichResultValidator = v.object({
	updated: v.number(),
	notFound: v.array(v.string()),
});

const authorImageSeedValidator = v.object({
	id: v.string(),
	imageUrl: v.string(),
});

/**
 * Returns current author and book counts in the database.
 */
export const getSeedStatus = query({
	args: {},
	returns: v.object({
		authorCount: v.number(),
		bookCount: v.number(),
	}),
	handler: async (ctx) => {
		const authors = await ctx.db.query('authors').collect();
		const books = await ctx.db.query('books').collect();
		return {
			authorCount: authors.length,
			bookCount: books.length,
		};
	},
});

/**
 * Inserts authors from seed data, skipping any that already exist by slug.
 */
export const seedAuthors = mutation({
	args: {
		authors: v.array(authorSeedValidator),
	},
	returns: seedResultValidator,
	handler: async (ctx, args) => {
		let inserted = 0;
		let skipped = 0;

		for (const author of args.authors) {
			const existing = await ctx.db
				.query('authors')
				.withIndex('by_slug', (q) => q.eq('id', author.id))
				.unique();

			if (existing) {
				skipped++;
				continue;
			}

			await ctx.db.insert('authors', {
				id: author.id,
				name: author.commonName,
				fullName: author.fullName,
				birthYear: 0,
				deathYear: undefined,
				regions: [],
				bio: '',
			});
			inserted++;
		}

		return { inserted, skipped };
	},
});

/**
 * Inserts books from seed data, resolving author slugs to Convex IDs.
 * Skips books that already exist by slug. Authors must be seeded first.
 */
export const seedBooks = mutation({
	args: {
		books: v.array(bookSeedValidator),
	},
	returns: seedResultValidator,
	handler: async (ctx, args) => {
		let inserted = 0;
		let skipped = 0;

		for (const book of args.books) {
			const bookId = slugifyTitle(book.book);

			const existing = await ctx.db
				.query('books')
				.withIndex('by_slug', (q) => q.eq('id', bookId))
				.unique();

			if (existing) {
				skipped++;
				continue;
			}

			const authorIds = [];
			for (const authorSlug of book.authors) {
				const author = await ctx.db
					.query('authors')
					.withIndex('by_slug', (q) => q.eq('id', authorSlug))
					.unique();

				if (!author) {
					throw new Error(
						`Author "${authorSlug}" not found. Seed authors before books.`
					);
				}

				authorIds.push(author._id);
			}

			await ctx.db.insert('books', {
				id: bookId,
				title: book.book,
				authorIds,
			});
			inserted++;
		}

		return { inserted, skipped };
	},
});

/**
 * Patches existing authors with birth/death years, regions, and bio.
 * Looks up each entry by its slug ID. Reports slugs that were not found.
 */
export const seedAuthorDetails = mutation({
	args: {
		authors: v.array(authorDetailsSeedValidator),
	},
	returns: enrichResultValidator,
	handler: async (ctx, args) => {
		let updated = 0;
		const notFound: string[] = [];

		for (const author of args.authors) {
			const existing = await ctx.db
				.query('authors')
				.withIndex('by_slug', (q) => q.eq('id', author.id))
				.unique();

			if (!existing) {
				notFound.push(author.id);
				continue;
			}

			await ctx.db.patch(existing._id, {
				birthYear: author.birthYear,
				deathYear: author.deathYear,
				regions: author.regions,
				bio: author.bio,
			});
			updated++;
		}

		return { updated, notFound };
	},
});

/**
 * Patches existing authors with image URLs.
 * Looks up each entry by its slug ID. Reports slugs that were not found.
 */
export const seedAuthorImages = mutation({
	args: {
		authors: v.array(authorImageSeedValidator),
	},
	returns: enrichResultValidator,
	handler: async (ctx, args) => {
		let updated = 0;
		const notFound: string[] = [];

		for (const author of args.authors) {
			const existing = await ctx.db
				.query('authors')
				.withIndex('by_slug', (q) => q.eq('id', author.id))
				.unique();

			if (!existing) {
				notFound.push(author.id);
				continue;
			}

			await ctx.db.patch(existing._id, {
				imageUrl: author.imageUrl,
			});
			updated++;
		}

		return { updated, notFound };
	},
});
