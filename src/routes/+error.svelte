<script>
	import { page } from '$app/stores';
	import TileSeparator from '$lib/components/TileSeparator.svelte';
</script>

<TileSeparator />

<div class="flex flex-col gap-5 px-5 py-5">
	<h1>Uh oh! Something went wrong.</h1>

	<h2>
		{$page.status} - {$page.error?.message}
	</h2>

	<h3>
		<a href="/">Back to home</a>
	</h3>
</div>

<TileSeparator />
