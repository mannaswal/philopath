'use client';

import { useMutation, useQuery } from 'convex/react';
import { useState } from 'react';
import { api } from '../../../convex/_generated/api';
import authorImagesData from '../../data/author-images.json';
import authorsDataDetails from '../../data/authors-data.json';
import authorsData from '../../data/authors.json';
import booksData from '../../data/books.json';
import type { Author } from '../../types/author';
import type { Book } from '../../types/book';

const authorsForSeed = (authorsData as Author[]).map((author) => ({
	id: author.id,
	fullName: author.fullName,
	commonName: author.name,
}));

const booksForSeed = (booksData as Book[]).map((book) => ({
	book: book.title,
	authors: book.authorIds,
}));

type SeedResult = {
	inserted: number;
	skipped: number;
};

type EnrichResult = {
	updated: number;
	notFound: string[];
};

type SeedPhase =
	| 'authors'
	| 'authorDetails'
	| 'authorImages'
	| 'books'
	| 'all'
	| 'allWithDetails';

export default function SeedPage() {
	const status = useQuery(api.seed.getSeedStatus);
	const seedAuthors = useMutation(api.seed.seedAuthors);
	const seedAuthorDetails = useMutation(api.seed.seedAuthorDetails);
	const seedAuthorImages = useMutation(api.seed.seedAuthorImages);
	const seedBooks = useMutation(api.seed.seedBooks);

	const [isSeeding, setIsSeeding] = useState(false);
	const [lastResult, setLastResult] = useState<{
		phase: SeedPhase;
		authors?: SeedResult;
		authorDetails?: EnrichResult;
		authorImages?: EnrichResult;
		books?: SeedResult;
		error?: string;
	} | null>(null);

	async function handleSeedAuthors() {
		setIsSeeding(true);
		setLastResult(null);

		try {
			const authors = await seedAuthors({ authors: authorsForSeed });
			setLastResult({ phase: 'authors', authors });
		} catch (error) {
			setLastResult({
				phase: 'authors',
				error: error instanceof Error ? error.message : 'Unknown error',
			});
		} finally {
			setIsSeeding(false);
		}
	}

	async function handleSeedAuthorDetails() {
		setIsSeeding(true);
		setLastResult(null);

		try {
			const authorDetails = await seedAuthorDetails({
				authors: authorsDataDetails,
			});
			setLastResult({ phase: 'authorDetails', authorDetails });
		} catch (error) {
			setLastResult({
				phase: 'authorDetails',
				error: error instanceof Error ? error.message : 'Unknown error',
			});
		} finally {
			setIsSeeding(false);
		}
	}

	async function handleSeedAuthorImages() {
		setIsSeeding(true);
		setLastResult(null);

		try {
			const authorImages = await seedAuthorImages({
				authors: authorImagesData.map((entry) => ({
					id: entry.id,
					imageUrl: entry.image_url,
				})),
			});
			setLastResult({ phase: 'authorImages', authorImages });
		} catch (error) {
			setLastResult({
				phase: 'authorImages',
				error: error instanceof Error ? error.message : 'Unknown error',
			});
		} finally {
			setIsSeeding(false);
		}
	}

	async function handleSeedBooks() {
		setIsSeeding(true);
		setLastResult(null);

		try {
			const books = await seedBooks({ books: booksForSeed });
			setLastResult({ phase: 'books', books });
		} catch (error) {
			setLastResult({
				phase: 'books',
				error: error instanceof Error ? error.message : 'Unknown error',
			});
		} finally {
			setIsSeeding(false);
		}
	}

	async function handleSeedAll() {
		setIsSeeding(true);
		setLastResult(null);

		try {
			const authors = await seedAuthors({ authors: authorsForSeed });
			const books = await seedBooks({ books: booksForSeed });
			setLastResult({ phase: 'all', authors, books });
		} catch (error) {
			setLastResult({
				phase: 'all',
				error: error instanceof Error ? error.message : 'Unknown error',
			});
		} finally {
			setIsSeeding(false);
		}
	}

	async function handleSeedAllWithDetails() {
		setIsSeeding(true);
		setLastResult(null);

		try {
			const authors = await seedAuthors({ authors: authorsForSeed });
			const authorDetails = await seedAuthorDetails({
				authors: authorsDataDetails,
			});
			const books = await seedBooks({ books: booksForSeed });
			setLastResult({
				phase: 'allWithDetails',
				authors,
				authorDetails,
				books,
			});
		} catch (error) {
			setLastResult({
				phase: 'allWithDetails',
				error: error instanceof Error ? error.message : 'Unknown error',
			});
		} finally {
			setIsSeeding(false);
		}
	}

	return (
		<div className="flex flex-col flex-1 items-center justify-center">
			<main className="flex flex-1 w-full max-w-2xl flex-col items-start justify-start p-16 gap-8">
				<div className="flex flex-col gap-2">
					<h1 className="text-4xl font-medium">Seed Database</h1>
					<p className="text-lg text-neutral-600">
						Load authors and books from local JSON files into Convex.
					</p>
				</div>

				<section className="flex w-full flex-col gap-4 rounded-lg border border-neutral-200 p-6">
					<h2 className="text-xl font-medium">Current counts</h2>
					{status === undefined ? (
						<p className="text-neutral-500">Loading…</p>
					) : (
						<ul className="flex flex-col gap-1 text-neutral-700">
							<li>Authors: {status.authorCount}</li>
							<li>Books: {status.bookCount}</li>
						</ul>
					)}
				</section>

				<section className="flex w-full flex-col gap-4 rounded-lg border border-neutral-200 p-6">
					<h2 className="text-xl font-medium">Basic seed</h2>
					<p className="text-neutral-600">
						{authorsForSeed.length} authors and {booksForSeed.length} books in JSON
						files. Existing records are skipped by slug.
					</p>

					<div className="flex flex-wrap gap-3">
						<button
							type="button"
							onClick={handleSeedAuthors}
							disabled={isSeeding}
							className="rounded-md border border-neutral-300 px-4 py-2 hover:bg-neutral-50 disabled:opacity-50">
							Seed authors
						</button>
						<button
							type="button"
							onClick={handleSeedBooks}
							disabled={isSeeding}
							className="rounded-md border border-neutral-300 px-4 py-2 hover:bg-neutral-50 disabled:opacity-50">
							Seed books
						</button>
						<button
							type="button"
							onClick={handleSeedAll}
							disabled={isSeeding}
							className="rounded-md bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-800 disabled:opacity-50">
							Seed all
						</button>
					</div>
				</section>

				<section className="flex w-full flex-col gap-4 rounded-lg border border-neutral-200 p-6">
					<h2 className="text-xl font-medium">Author details</h2>
					<p className="text-neutral-600">
						{authorsDataDetails.length} authors with birth/death years, regions,
						and bios. Patches existing records by slug — run basic author seed
						first.
					</p>

					<div className="flex flex-wrap gap-3">
						<button
							type="button"
							onClick={handleSeedAuthorDetails}
							disabled={isSeeding}
							className="rounded-md border border-neutral-300 px-4 py-2 hover:bg-neutral-50 disabled:opacity-50">
							Seed author details
						</button>
						<button
							type="button"
							onClick={handleSeedAuthorImages}
							disabled={isSeeding}
							className="rounded-md border border-neutral-300 px-4 py-2 hover:bg-neutral-50 disabled:opacity-50">
							Seed author images
						</button>
						<button
							type="button"
							onClick={handleSeedAllWithDetails}
							disabled={isSeeding}
							className="rounded-md bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-800 disabled:opacity-50">
							Seed all with details
						</button>
					</div>
				</section>

				{lastResult && (
					<section className="flex w-full flex-col gap-3 rounded-lg border border-neutral-200 p-6">
						<h2 className="text-xl font-medium">Last result</h2>
						{lastResult.error ? (
							<p className="text-red-700">{lastResult.error}</p>
						) : (
							<div className="flex flex-col gap-2 text-neutral-700">
								{lastResult.authors && (
									<p>
										Authors — inserted {lastResult.authors.inserted}, skipped{' '}
										{lastResult.authors.skipped}
									</p>
								)}
								{lastResult.authorDetails && (
									<div className="flex flex-col gap-1">
										<p>
											Author details — updated{' '}
											{lastResult.authorDetails.updated}
										</p>
										{lastResult.authorDetails.notFound.length > 0 && (
											<p className="text-amber-800">
												Not found:{' '}
												{lastResult.authorDetails.notFound.join(', ')}
											</p>
										)}
									</div>
								)}
								{lastResult.authorImages && (
									<div className="flex flex-col gap-1">
										<p>
											Author images — updated{' '}
											{lastResult.authorImages.updated}
										</p>
										{lastResult.authorImages.notFound.length > 0 && (
											<p className="text-amber-800">
												Not found:{' '}
												{lastResult.authorImages.notFound.join(', ')}
											</p>
										)}
									</div>
								)}
								{lastResult.books && (
									<p>
										Books — inserted {lastResult.books.inserted}, skipped{' '}
										{lastResult.books.skipped}
									</p>
								)}
							</div>
						)}
					</section>
				)}
			</main>
		</div>
	);
}
