'use client';

import { useQuery } from 'convex/react';
import { useMemo } from 'react';
import {
	CopyJsonToolbar,
	type CopyFieldDefinition,
} from '@/components/copy-json-toolbar';
import { api } from '../../convex/_generated/api';
import { Doc } from '../../convex/_generated/dataModel';

const BOOK_COPY_FIELDS: CopyFieldDefinition[] = [
	{ key: 'id', label: 'Slug ID' },
	{ key: 'title', label: 'Title' },
	{ key: 'authorIds', label: 'Author IDs' },
	{ key: 'year', label: 'Year' },
	{ key: 'era', label: 'Era' },
	{ key: 'school', label: 'School' },
	{ key: 'branches', label: 'Branches' },
	{ key: 'themes', label: 'Themes' },
	{ key: 'difficulty', label: 'Difficulty' },
	{ key: 'prerequisites', label: 'Prerequisites' },
	{ key: 'blurb', label: 'Blurb' },
	{ key: 'historicalContext', label: 'Historical context' },
];

type Book = Doc<'books'>;
type Author = Doc<'authors'>;

export default function TempBookList() {
	const books = useQuery(api.books.list);
	const authors = useQuery(api.authors.list);

	const authorMap = useMemo(() => {
		return authors?.reduce(
			(acc, author) => {
				acc[author._id] = author;
				return acc;
			},
			{} as Record<string, Author>
		);
	}, [authors]);

	if (books === undefined || authors === undefined) {
		return <div>Loading...</div>;
	}

	function BookDetails({ book }: { book: Book }) {
		return (
			<div className="w-48 shrink-0 flex flex-col gap-4">
				<div className="size-48 bg-neutral-100">
					<div className="flex flex-col items-center justify-center w-full h-full gap-2 text-center px-2">
						<h3 className="font-medium text-lg">{book.title}</h3>
						<p className="italic text-neutral-500 text-sm">
							{book.authorIds
								.map((authorId) => authorMap?.[authorId.toString()]?.name)
								.join(', ')}
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full flex flex-col gap-4">
			<div className="overflow-scroll flex gap-6 scrollbar-none">
				{books?.map((book) => (
					<BookDetails
						key={book._id}
						book={book}
					/>
				))}
			</div>
			<CopyJsonToolbar
				items={books}
				fields={BOOK_COPY_FIELDS}
			/>
		</div>
	);
}
