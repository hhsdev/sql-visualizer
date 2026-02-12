<script>
	import hljs from 'highlight.js/lib/core';
	import sql from 'highlight.js/lib/languages/sql';
	import { onMount } from 'svelte';
	hljs.registerLanguage('sql', sql);

	let codeBlock = null;
	let textArea = null;

	let { code = $bindable('') } = $props();

	$effect(() => {
		if (codeBlock) {
			codeBlock.innerHTML = hljs.highlight(code, { language: 'sql' }).value;
		}
	});

	onMount(() => {
		textArea.addEventListener('scroll', () => {
			codeBlock.scrollTop = textArea.scrollTop;
			codeBlock.scrollLeft = textArea.scrollLeft;
		});
	});
</script>

<div class="editor w-full grow">
	<textarea
		name="sql-command"
		spellcheck="false"
		id="sql-command"
		class="w-full"
		bind:value={code}
		bind:this={textArea}
	></textarea>
	<pre><code class="hljs language-sql" id="highlighted-code" bind:this={codeBlock}>{code}</code></pre>
</div>

<style>
	.editor {
		width: 100%;
		position: relative;
		border-radius: 8px;
	}

	#sql-command {
		height: 100%;
		background: #f8f8f8;
		font-family: monospace;
		border-radius: 8px;
		border: 1px solid var(--color-gray);
		resize: none;
		color: rgba(0, 0, 0, 0);
		background-color: rgba(0, 0, 0, 0);
		caret-color: lightskyblue;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 2;
		overflow-x: auto;
		overflow-y: scroll;
		white-space: nowrap;
		padding-left: 8px;
		padding-top: 8px;
	}

	pre {
		margin: 0;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 0;
		overflow: auto;
		pointer-events: none;
	}

	pre > code {
		border-radius: 8px;
		display: block;
		width: 100%;
		height: 100%;
		padding: 9px;
	}
</style>
