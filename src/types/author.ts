export type Author = {
	id: string;
	name: string;
	fullName: string;
	birthYear: number;
	deathYear?: number;
	regions: string[];
	bio: string;
	imageUrl?: string;
};
