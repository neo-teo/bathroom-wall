<script lang="ts">
	import type { PageData } from './$types';
	import BarSearch from '$lib/components/BarSearch.svelte';

	export let data: PageData;
</script>

<a href="/"><h1>bathroom <br /> wall</h1></a>
<p>
	a shared wall of text, video, photo, and voice memo for people at a particular bar on a particular
	night
</p>

<BarSearch currentBars={data.bars} />
