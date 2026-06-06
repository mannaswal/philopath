'use client';

import { useState } from 'react';
import { Check, Copy, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type CopyFieldDefinition = {
	key: string;
	label: string;
};

type CopyJsonToolbarProps<T extends { id: string }> = {
	items: T[];
	fields: CopyFieldDefinition[];
};

/**
 * Builds a JSON-serializable array of objects with Convex _id and selected fields.
 */
function buildCopyPayload<T extends { id: string }>(
	items: T[],
	fieldKeys: readonly string[]
): Record<string, unknown>[] {
	return items.map((item) => {
		const result: Record<string, unknown> = { id: item.id };
		for (const key of fieldKeys) {
			if (key in item) {
				result[key] = item[key as keyof T];
			}
		}
		return result;
	});
}

/**
 * Copy controls for exporting list data as JSON with configurable fields.
 */
export function CopyJsonToolbar<T extends { id: string }>({
	items,
	fields,
}: CopyJsonToolbarProps<T>) {
	const allFieldKeys = fields.map((field) => field.key);
	const [selectedFields, setSelectedFields] = useState<Set<string>>(
		() => new Set(allFieldKeys)
	);
	const [copiedAll, setCopiedAll] = useState(false);
	const [copiedSelected, setCopiedSelected] = useState(false);

	async function copyItems(
		fieldKeys: readonly string[],
		kind: 'all' | 'selected'
	) {
		const payload = buildCopyPayload(items, fieldKeys);
		await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));

		if (kind === 'all') {
			setCopiedAll(true);
			setTimeout(() => setCopiedAll(false), 2000);
			return;
		}

		setCopiedSelected(true);
		setTimeout(() => setCopiedSelected(false), 2000);
	}

	function toggleField(key: string, checked: boolean) {
		setSelectedFields((previous) => {
			const next = new Set(previous);
			if (checked) {
				next.add(key);
			} else {
				next.delete(key);
			}
			return next;
		});
	}

	const copySelectedDisabled = selectedFields.size === 0;

	return null;

	return (
		<div className="flex items-center gap-2">
			<Button
				variant="outline"
				size="sm"
				onClick={() => copyItems(allFieldKeys, 'all')}>
				{copiedAll ? <Check /> : <Copy />}
				{copiedAll ? 'Copied' : 'Copy all'}
			</Button>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="outline"
						size="icon-sm">
						<Settings2 />
						<span className="sr-only">Select fields to copy</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="end"
					className="w-56">
					<DropdownMenuLabel>Copy fields</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuCheckboxItem
						checked
						disabled
						onSelect={(event) => event.preventDefault()}>
						Convex ID (_id)
					</DropdownMenuCheckboxItem>
					{fields.map((field) => (
						<DropdownMenuCheckboxItem
							key={field.key}
							checked={selectedFields.has(field.key)}
							onCheckedChange={(checked) =>
								toggleField(field.key, checked === true)
							}
							onSelect={(event) => event.preventDefault()}>
							{field.label}
						</DropdownMenuCheckboxItem>
					))}
					<DropdownMenuSeparator />
					<DropdownMenuItem
						disabled={copySelectedDisabled}
						onClick={() => copyItems([...selectedFields], 'selected')}>
						{copiedSelected ? <Check /> : <Copy />}
						{copiedSelected ? 'Copied' : 'Copy selected'}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
