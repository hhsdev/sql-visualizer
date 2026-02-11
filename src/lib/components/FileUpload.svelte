<script>
	import IconUpload from '~icons/mdi/file-upload';
	import { base } from '$app/paths';
	import initSqlJs from 'sql.js';
	import { store } from '$lib/database/store.svelte';
	import { fetchTables } from '$lib/database/database';

	let files = $state(null);

	let isDragging = $state(false);
	let inputRef; // Reference to the hidden input element

	const handleDrop = (e) => {
		e.preventDefault();
		isDragging = false;

		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			files = e.dataTransfer.files;
			loadDatabase(e.dataTransfer.files);
		}
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		isDragging = true;
	};

	// 3. Handle Drag Leave (Revert styles)
	const handleDragLeave = (e) => {
		isDragging = false;
	};

	const handleClick = () => {
		inputRef.click();
	};

	const loadDatabase = (files) => {
		const reader = new FileReader();
		reader.onload = async (event) => {
			const Uints = new Uint8Array(event.target.result);
			const SQL = await initSqlJs({
				locateFile: (file) => `${base}/${file}`
			});
			store.db = new SQL.Database(Uints);
			const tables = fetchTables();
			store.tableList = tables;
		};
		reader.readAsArrayBuffer(files[0]);
	};

	const handleChange = (e) => {
		if (e.target.files && e.target.files.length > 0) {
			files = e.target.files;
			loadDatabase(e.target.files);
		}
	};
</script>

<div
	role="button"
	tabindex="0"
	class="dropzone {isDragging ? 'active' : ''}"
	ondrop={handleDrop}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	onclick={handleClick}
	onkeydown={(e) => e.key === 'Enter' && handleClick()}
>
	<input
		type="file"
		multiple={false}
		accept=".sqlite,.db,.sqlite3"
		class="hidden-input"
		bind:this={inputRef}
		onchange={handleChange}
	/>

	<div class="content">
		{#if files}
			<p class="success">📄 {files[0].name} is loaded!</p>
		{:else}
			<div class="align-center flex flex-col justify-center">
				<div class="icon">
					<IconUpload style="font-size: 2rem;" />
				</div>
				<p>Drop SQLite file here or <span class="highlight">click to browse</span></p>
			</div>
		{/if}
	</div>
</div>

<style>
	.dropzone {
		width: 100%;
		height: 150px;
		border: 2px dashed #475569;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
		background: #f8f8f8;
		position: relative;
		overflow: hidden;
	}

	/* Visual Feedback State */
	.dropzone.active {
		border-color: #3b82f6; /* Accent Blue */
		background: rgba(59, 130, 246, 0.1);
		transform: scale(1.01);
	}

	.content {
		text-align: center;
		color: var(--color-text);
		pointer-events: none; /* Prevents text selection while dragging */
	}

	.hidden-input {
		display: none;
	}

	.icon {
		align-self: center;
		margin-bottom: 12px;
		color: var(--color-text);
	}

	.highlight {
		color: #3b82f6;
		font-weight: 500;
		text-decoration: underline;
	}

	.success {
		color: #4ade80; /* Green */
		font-weight: bold;
	}
</style>
