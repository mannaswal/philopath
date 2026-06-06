import { v } from 'convex/values';

export const eraValidator = v.union(
	v.literal('Ancient'),
	v.literal('Medieval'),
	v.literal('Early Modern'),
	v.literal('Modern'),
	v.literal('Contemporary'),
);

export const schoolValidator = v.union(
	v.literal('Platonism'),
	v.literal('Aristotelianism'),
	v.literal('Stoicism'),
	v.literal('Scholasticism'),
	v.literal('Rationalism'),
	v.literal('Empiricism'),
	v.literal('Idealism'),
	v.literal('Existentialism'),
	v.literal('Phenomenology'),
	v.literal('Analytic Philosophy'),
	v.literal('Pragmatism'),
	v.literal('Epicureanism'),
	v.literal('Enlightenment'),
	v.literal('Marxism'),
	v.literal('Post-Structuralism'),
);

export const branchValidator = v.union(
	v.literal('Ethics & Morality'),
	v.literal('Political Philosophy'),
	v.literal('Metaphysics'),
	v.literal('Epistemology'),
	v.literal('Philosophy of Mind'),
	v.literal('Philosophy of Religion'),
	v.literal('Logic & Language'),
	v.literal('Aesthetics'),
	v.literal('Philosophy of Science'),
);

export const themeValidator = v.union(
	v.literal('Happiness & The Good Life'),
	v.literal('Justice & Fairness'),
	v.literal('Power & Politics'),
	v.literal('God & Religion'),
	v.literal('Knowledge & Truth'),
	v.literal('Death & Mortality'),
	v.literal('Free Will'),
	v.literal('Consciousness & Mind'),
	v.literal('Meaning & Purpose'),
	v.literal('Identity & Self'),
	v.literal('Freedom & Autonomy'),
	v.literal('Society & The Individual'),
	v.literal('Love & Relationships'),
	v.literal('Nature of Reality'),
);

export const difficultyValidator = v.union(
	v.literal('Beginner'),
	v.literal('Intermediate'),
	v.literal('Advanced'),
);

export const authorDocValidator = v.object({
	_id: v.id('authors'),
	_creationTime: v.number(),
	id: v.string(),
	name: v.string(),
	fullName: v.string(),
	birthYear: v.number(),
	deathYear: v.optional(v.number()),
	regions: v.array(v.string()),
	bio: v.string(),
	imageUrl: v.optional(v.string()),
});

export const bookDocValidator = v.object({
	_id: v.id('books'),
	_creationTime: v.number(),
	id: v.string(),
	title: v.string(),
	authorIds: v.array(v.id('authors')),
	year: v.optional(v.number()),
	era: v.optional(eraValidator),
	school: v.optional(schoolValidator),
	branches: v.optional(v.array(branchValidator)),
	themes: v.optional(v.array(themeValidator)),
	difficulty: v.optional(difficultyValidator),
	prerequisites: v.optional(v.array(v.id('books'))),
	blurb: v.optional(v.string()),
	historicalContext: v.optional(v.string()),
});
