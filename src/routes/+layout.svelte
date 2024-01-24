<script>
	import '../app.css';
</script>

<div class="flex grid h-screen justify-center">
	<div class="flex w-[360px] flex-col gap-[20px] p-5">
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
