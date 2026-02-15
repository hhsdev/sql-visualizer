<script>
	import { getTableSchema, dbCommand } from '$lib/database/database';
	import { onMount } from 'svelte';
	import IconDelete from '~icons/mdi/delete';
	import IconInfo from '~icons/mdi/info';

	let { table } = $props();
	let isMounted = $state(false);

	onMount(() => {
		isMounted = true;
	});

	const displayTable = (tableName) => {
		dbCommand(`SELECT * FROM ${tableName};`);
	};

	const deleteTable = (tableName) => {
		dbCommand(`DROP TABLE ${tableName};`);
	};

	const showTableInfo = (tableName) => {
		store.selectedTable = getTableSchema(tableName);
	};
</script>

<li class="flex items-center gap-2 my-2">
	<button
		class="grow text-left hover:text-blue-500 decoration-1 underline decoration-dotted hover:decoration-solid"
		onclick={() => displayTable(table.name)}>{table.name}</button
	>
	{#key table.rows + 'x' + table.columns}
		<span class="{isMounted ? 'flash-text' : ''} text-xs text-gray-500"
			>({table.rows}&times;{table.columns})</span
		>
	{/key}
	<button class="text-gray-500 hover:text-red-500" onclick={() => deleteTable(table.name)}
		><IconDelete /></button
	>
	<button class="text-gray-500 hover:text-green-500" onclick={() => showTableInfo(table)}
		><IconInfo /></button
	>
</li>

<style>
	@keyframes green-flash {
		0% {
			color: #22c55e;
		} /* Green color */
		100% {
			color: var(--color-gray-500);
		} /* Fade back to original color */
	}

	.flash-text {
		display: inline-block;
		animation: green-flash 0.8s ease-out;
	}
</style>
