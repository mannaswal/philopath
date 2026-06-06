'use client';

import {
	CopyJsonToolbar,
	type CopyFieldDefinition,
} from '@/components/copy-json-toolbar';
import { listAuthors } from '@/lib/authors';
import type { Author } from '@/types/author';

const AUTHOR_COPY_FIELDS: CopyFieldDefinition[] = [
	{ key: 'id', label: 'Slug ID' },
	{ key: 'name', label: 'Name' },
	{ key: 'fullName', label: 'Full name' },
	{ key: 'birthYear', label: 'Birth year' },
	{ key: 'deathYear', label: 'Death year' },
	{ key: 'regions', label: 'Regions' },
	{ key: 'bio', label: 'Bio' },
	{ key: 'imageUrl', label: 'Image URL' },
];

export default function TempAuthorList() {
	const authors = listAuthors();

	function AuthorAvatar({ author }: { author: Author }) {
		if (author.imageUrl) {
			return (
				<img
					src={author.imageUrl}
					alt={author.name}
					className="size-24 shrink-0 rounded-full object-cover bg-neutral-100"
				/>
			);
		}

		return <div className="size-24 shrink-0 rounded-full bg-neutral-100" />;
	}

	function AuthorDetails({ author }: { author: Author }) {
		return (
			<div className="w-48 shrink-0 flex flex-col gap-4">
				<AuthorAvatar author={author} />
				<div className="flex flex-col gap-2 pl-1">
					<h3 className="font-medium">{author.name}</h3>
					<p className="text-neutral-600 text-sm">
						{author.regions?.join(', ')}
					</p>
					<p className="text-neutral-600 text-sm">
						{author.birthYear < 0
							? `${Math.abs(author.birthYear)} BC`
							: `${author.birthYear}`}
						{author.deathYear &&
							` – ${author.deathYear < 0 ? `${Math.abs(author.deathYear)} BC` : `${author.deathYear}`}`}
					</p>

					<p className="text-neutral-600 text-sm">{author.bio}</p>
					{/* <ul className="italic text-neutral-600 text-sm space-y-2">
						{booksMap?.[author.id]?.map((book) => (
							<li key={book.id}>{book.title}</li>
						))}
					</ul> */}
				</div>
			</div>
		);
	}

	return (
		<div className="w-full flex flex-col gap-4">
			<div className="overflow-scroll flex gap-6 scrollbar-none">
				{authors.map((author) => (
					<AuthorDetails
						key={author.id}
						author={author}
					/>
				))}
			</div>
			<CopyJsonToolbar
				items={authors}
				fields={AUTHOR_COPY_FIELDS}
			/>
		</div>
	);
}
