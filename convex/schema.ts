import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import {
	branchValidator,
	difficultyValidator,
	eraValidator,
	schoolValidator,
	themeValidator,
} from './lib/validators';

export default defineSchema({
	books: defineTable({
		id: v.string(), // Custom slug ID e.g., "beyond-good-and-evil"
		title: v.string(),
		authorIds: v.array(v.id('authors')),
		year: v.optional(v.number()), // temporarily optional — BCE dates as negative numbers
		era: v.optional(eraValidator), // temporarily optional
		school: v.optional(schoolValidator), // temporarily optional
		branches: v.optional(v.array(branchValidator)), // temporarily optional
		themes: v.optional(v.array(themeValidator)), // temporarily optional
		difficulty: v.optional(difficultyValidator), // temporarily optional
		prerequisites: v.optional(v.array(v.id('books'))), // temporarily optional
		blurb: v.optional(v.string()), // temporarily optional
		historicalContext: v.optional(v.string()), // temporarily optional
	}).index('by_slug', ['id']),

	authors: defineTable({
		id: v.string(), // Custom slug ID e.g., "friedrich-nietzsche"
		name: v.string(), // Common name e.g. "Friedrich Nietzsche"
		fullName: v.string(), // Full name e.g. "Friedrich Wilhelm Nietzsche"
		birthYear: v.number(), // BCE dates as negative numbers
		deathYear: v.optional(v.number()), // Optional for active authors
		regions: v.array(v.string()), // geographic/national context
		bio: v.string(), // 2-3 sentence overview
		imageUrl: v.optional(v.string()), // image URL
	}).index('by_slug', ['id']),
});
