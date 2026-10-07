<script>
	import { page } from '$app/stores';
	import '../app.css';
	import XeroxFilter from '$lib/components/XeroxFilter.svelte';
</script>

<svelte:head>
	<title>{$page.data.title}</title>
	<meta name="title" content={$page.data.title} />
	<meta name="og:title" content={$page.data.title} />

	<meta
		name="og:image"
		content="https://res.cloudinary.com/dlub8oz6b/image/upload/v1707868939/zefjp7gvtnbdtri5md88.png"
	/>
</svelte:head>

<XeroxFilter />

<div class="flex grid min-h-screen justify-center">
	<div class="flex w-screen flex-col">
		<slot />
	</div>
</div>
