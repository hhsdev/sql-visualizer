<script>
	import { notification } from '$lib/notification.svelte.js';
	import { fly } from 'svelte/transition';
	import InfoIcon from '~icons/mdi/error';
	import IconClose from '~icons/mdi/window-close';
</script>

{#if notification.isVisible}
	<div transition:fly={{ y: 50, duration: 300 }} class="notification {notification.type}">
		<InfoIcon />
		<span class="message">{notification.message}</span>
		<button onclick={() => notification.close()}><IconClose /></button>
	</div>
{/if}

<style>
	.notification {
		position: fixed;
		bottom: 20px;
		right: 20px;
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px;
		border-radius: 8px;
		color: white;
		z-index: 9999;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

    .message {
        font-size: 0.9rem;
    }

	.error {
		background-color: #ef4444;
	}

    .info {
        background-color: #3b82f6;
    }

	button {
		background: none;
		border: none;
		color: white;
		cursor: pointer;
		font-size: 20px;
	}
</style>
