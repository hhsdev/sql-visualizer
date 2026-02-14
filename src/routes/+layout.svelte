<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.ico';
	import Notification from '$lib/components/Notification.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<Notification />
{@render children()}
