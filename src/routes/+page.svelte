<script>
	import DbTable from '$lib/components/DbTable.svelte';
	import Editor from '$lib/components/Editor.svelte';
	import FileUpload from '$lib/components/FileUpload.svelte';
	import { dbCommand, getTableSchema } from '$lib/assets/database/database';
	import { store } from '$lib/assets/database/store.svelte';

	const runSqlCommand = () => {
		const sqlCommand = document.getElementById('sql-command').value;
		dbCommand(sqlCommand);
	};

	const displayTable = (tableName) => {
		const sqlCommand = `SELECT * FROM ${tableName};`;
		dbCommand(sqlCommand);
	};

	const deleteTable = (tableName) => {
		const sqlCommand = `DROP TABLE ${tableName};`;
		dbCommand(sqlCommand);
	};

	const showTableInfo = (tableName) => {
		store.selectedTable = getTableSchema(tableName);
	};
</script>

<main class="main-panel">
	<div class="import-control"><FileUpload /></div>
	<div class="panel command flex flex-col">
		<h2>SQL Command</h2>
		<Editor />
		<button
			class="mt-2 w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
			on:click={runSqlCommand}
		>
			Run SQL Command
		</button>
	</div>
	<div class="panel visual-table">
		<h2>Database</h2>
		<DbTable />
	</div>
	<div class="panel table-list">
		<h2>Tables</h2>
		<ul>
			{#each store.tableList as table}
				<li>
					<button class="table-list__item" on:click={() => displayTable(table)}>{table}</button>
					<button class="table-list__item" on:click={() => deleteTable(table)}>[x]</button>
					<button class="table-list__item" on:click={() => showTableInfo(table)}>[info]</button>
				</li>
			{/each}
		</ul>
	</div>
</main>

<style>
	.main-panel {
		padding: 0 16px;
		margin-top: 16px;
		display: grid;
		min-height: 90vh;
		grid-template-areas:
			'import import import'
			'command table table-list';
		grid-template-rows: auto 1fr;
		grid-template-columns: 40% 1fr auto;
		gap: 16px;
	}

	.import-control {
		grid-area: import;
	}

	.command {
		grid-area: command;
		max-height: 80vh;
	}

	.command > h2,
	.visual-table > h2 {
		margin: 8px 0 4px 2px;
		font-weight: bold;
	}

	.visual-table {
		padding-left: 32px;
		grid-area: table;
	}

	.table-list {
		min-width: 150px;
		height: 100%;
	}

	.table-list__item {
		padding: 4px 0;
		text-decoration: dotted underline;
	}

	.table-list__item:hover {
		cursor: pointer;
		color: blue;
	}

	.table-list > h2 {
		margin: 8px 0 4px 2px;
		font-weight: bold;
	}

	.panel {
		background-color: #f8f8f8;
		border-radius: 8px;
		padding: 16px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		overflow: scroll;
	}
</style>
