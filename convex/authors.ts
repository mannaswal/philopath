import { v } from 'convex/values';
import { query } from './_generated/server';
import { authorDocValidator } from './lib/validators';

/**
 * Returns all authors in the database.
 */
export const list = query({
	args: {},
	returns: v.array(authorDocValidator),
	handler: async (ctx) => {
		return await ctx.db.query('authors').collect();
	},
});

/**
 * Returns a single author by its custom slug ID, or null if not found.
 */
export const getBySlug = query({
	args: { slug: v.string() },
	returns: v.union(authorDocValidator, v.null()),
	handler: async (ctx, args) => {
		return await ctx.db
			.query('authors')
			.withIndex('by_slug', (q) => q.eq('id', args.slug))
			.unique();
	},
});

/**
 * Returns a single author by its Convex document ID, or null if not found.
 */
export const get = query({
	args: { id: v.id('authors') },
	returns: v.union(authorDocValidator, v.null()),
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id);
	},
});
