import TempBookList from '../components/temp-book-list';
import TempAuthorList from '../components/temp-author-list';

export default function Home() {
	return (
		<div className="flex flex-col flex-1 items-center justify-center">
			<main className="flex flex-1 w-full flex-col items-start justify-start py-16 pl-16 gap-8">
				<h1 className="text-5xl tracking-tight">Philopath</h1>
				<p>A journey through the history of philosophy</p>
				<TempBookList />
				<TempAuthorList />
			</main>
		</div>
	);
}
