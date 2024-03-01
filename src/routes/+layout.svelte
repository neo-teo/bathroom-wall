<script>
	import { page } from '$app/stores';
	import '../app.css';
</script>

<svelte:head>
	<title>{$page.data.title}</title>
	<meta name="title" content={$page.data.title} />
	<meta name="og:title" content={$page.data.title} />

	<!-- <meta name="description" content="__META_DESCRIPTION__" />
	<meta name="og:description" content="__META_OG_DESCRIPTION__" /> -->

	<meta
		name="og:image"
		content="https://res.cloudinary.com/dlub8oz6b/image/upload/v1707868939/zefjp7gvtnbdtri5md88.png"
	/>
</svelte:head>

<div class="flex grid min-h-screen justify-center">
	<div class="flex w-screen max-w-[450px] flex-col gap-[20px] p-5">
		<slot />
	</div>
</div>

<style lang="postcss">
	.grid {
		background-size: 80px 80px;
		background-position: -1px -1px;
		background-image: linear-gradient(to right, lightgray 1px, transparent 1px),
			linear-gradient(to bottom, lightgray 1px, transparent 1px);
	}
</style>
