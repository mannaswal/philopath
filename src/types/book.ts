export type Era =
	| 'Ancient'
	| 'Medieval'
	| 'Early Modern'
	| 'Modern'
	| 'Contemporary';

export type School =
	| 'Platonism'
	| 'Aristotelianism'
	| 'Stoicism'
	| 'Scholasticism'
	| 'Rationalism'
	| 'Empiricism'
	| 'Idealism'
	| 'Existentialism'
	| 'Phenomenology'
	| 'Analytic Philosophy'
	| 'Pragmatism'
	| 'Epicureanism'
	| 'Enlightenment'
	| 'Marxism'
	| 'Post-Structuralism';

export type Branch =
	| 'Ethics & Morality'
	| 'Political Philosophy'
	| 'Metaphysics'
	| 'Epistemology'
	| 'Philosophy of Mind'
	| 'Philosophy of Religion'
	| 'Logic & Language'
	| 'Aesthetics'
	| 'Philosophy of Science';

export type Theme =
	| 'Happiness & The Good Life'
	| 'Justice & Fairness'
	| 'Power & Politics'
	| 'God & Religion'
	| 'Knowledge & Truth'
	| 'Death & Mortality'
	| 'Free Will'
	| 'Consciousness & Mind'
	| 'Meaning & Purpose'
	| 'Identity & Self'
	| 'Freedom & Autonomy'
	| 'Society & The Individual'
	| 'Love & Relationships'
	| 'Nature of Reality';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type Book = {
	id: string;
	title: string;
	authorIds: string[];
	year?: number;
	era?: Era;
	school?: School;
	branches?: Branch[];
	themes?: Theme[];
	difficulty?: Difficulty;
	prerequisites?: string[];
	blurb?: string;
	historicalContext?: string;
};
