<script>
	import { onMount } from 'svelte';
	import { dbInit, fetchTables } from '$lib/database/database.js';
	import { store } from '$lib/database/store.svelte.js';

	onMount(async () => {
		await dbInit();
		store.tableList = fetchTables();
	});
</script>

<table class="db-table">
	{#if store.selectedTable?.headings}
		<thead>
			<tr>
				{#each store.selectedTable.headings as h}<th>{h}</th>{/each}
			</tr>
		</thead>
		{#if store.selectedTable?.rows}
			{#each store.selectedTable.rows as row}
				<tbody>
					<tr>
						{#each row as i}<td>{i}</td>{/each}
					</tr>
				</tbody>
			{/each}
		{/if}
	{/if}
</table>

<style>
	.db-table {
		border-collapse: collapse;
		border: 1px solid #ddd;
		border-radius: 5px;
	}

	td,
	th {
		padding: 6px 24px;
		border: 1px solid #ddd;
		font-size: 0.9rem;
	}

	th {
		border-left: 0px;
		border-right: 0px;
		background-color: #eee;
		font-weight: 400;
		color: #666;
		font-size: 0.8rem;
	}
</style>
