<script>
	import DbTable from '$lib/components/DbTable.svelte';
	import Editor from '$lib/components/Editor.svelte';
	import FileUpload from '$lib/components/FileUpload.svelte';
	import { dbCommand, getTableSchema } from '$lib/database/database';
	import { notification } from '$lib/notification.svelte';
	import { store } from '$lib/database/store.svelte';
	import IconLeftArrow from '~icons/mdi/menu-left';
	import IconRightArrow from '~icons/mdi/menu-right';
	import IconDelete from '~icons/mdi/delete';
	import IconInfo from '~icons/mdi/info';

	let command = $state('');
	let prevDisabled = $derived(store.commandHistoryIndex <= 0);
	let nextDisabled = $derived(store.commandHistoryIndex >= store.commandHistory.length - 1);

	const runSqlCommand = () => {
		const sqlCommand = document.getElementById('sql-command').value;
		try {
			dbCommand(sqlCommand);
		} catch (err) {
			notification.show(err.message);
		}
		store.commandHistory = [...store.commandHistory, sqlCommand];
		store.commandHistoryIndex = store.commandHistory.length - 1;
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

	const prevCommand = () => {
		if (store.commandHistoryIndex <= 0) return;
		store.commandHistoryIndex = store.commandHistoryIndex - 1;
		command = store.commandHistory[store.commandHistoryIndex];
	}

	const nextCommand = () => {
		if (store.commandHistoryIndex >= (store.commandHistory.length - 1))
			return;
		store.commandHistoryIndex = store.commandHistoryIndex + 1;
		command = store.commandHistory[store.commandHistoryIndex];
	}
</script>

<main class="main-panel">
	<div class="import-control"><FileUpload /></div>
	<div class="panel command flex flex-col">
		<h2>SQL Command</h2>
		<Editor bind:code={command} />
		<div class="flex gap-2">
			<button
				class="mt-2 rounded-full bg-blue-500 px-2 py-2 text-white hover:bg-blue-700 text-2xl {prevDisabled ? 'btn-disabled' : ''}"
				onclick={prevCommand}
			>
				<IconLeftArrow />
			</button>
			<button
				class="mt-2 rounded-full bg-blue-500 px-2 py-2 text-white hover:bg-blue-700 text-2xl {nextDisabled ? 'btn-disabled' : ''}"
				onclick={nextCommand}
			>
				<IconRightArrow />
			</button>
			<button
				class="mt-2 w-auto rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 grow"
				onclick={runSqlCommand}
			>
				Run SQL Command
			</button>
		</div>
	</div>
	<div class="panel visual-table">
		<h2>Database</h2>
		<DbTable />
	</div>
	<div class="panel table-list">
		<h2>Tables</h2>
		<ul>
			{#each store.tableList as table}
				<li class="flex align-center gap-2">
					<button class="table-list__item hover:text-blue-500 grow text-left" onclick={() => displayTable(table)}>{table}</button>
					<button class="table-list__item text-gray-500 hover:text-red-500" onclick={() => deleteTable(table)}><IconDelete /></button>
					<button class="table-list__item text-gray-500 hover:text-green-500" onclick={() => showTableInfo(table)}><IconInfo /></button>
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

	.panel > h2 {
		margin-bottom: 8px;
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

	.btn-disabled {
		background-color: gray;
		cursor: not-allowed;
	}
</style>
