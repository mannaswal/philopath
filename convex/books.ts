import { v } from 'convex/values';
import { query } from './_generated/server';
import { bookDocValidator } from './lib/validators';

/**
 * Returns all books in the database.
 */
export const list = query({
	args: {},
	returns: v.array(bookDocValidator),
	handler: async (ctx) => {
		return await ctx.db.query('books').collect();
	},
});

/**
 * Returns a single book by its custom slug ID, or null if not found.
 */
export const getBySlug = query({
	args: { slug: v.string() },
	returns: v.union(bookDocValidator, v.null()),
	handler: async (ctx, args) => {
		return await ctx.db
			.query('books')
			.withIndex('by_slug', (q) => q.eq('id', args.slug))
			.unique();
	},
});

/**
 * Returns a single book by its Convex document ID, or null if not found.
 */
export const get = query({
	args: { id: v.id('books') },
	returns: v.union(bookDocValidator, v.null()),
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id);
	},
});
