<script>
	import ActivitySquares from './ActivitySquares.svelte';
</script>

<div class="fixed inset-x-0 bottom-0 flex justify-center">
	<div
		class="flex min-w-[350px] items-center justify-center gap-2 border-l border-r border-t bg-white p-2 text-sm"
	>
		<div class="flex w-full justify-between">
			<div class="flex items-center gap-2">
				<div class="whitespace-nowrap">fewer</div>
				<ActivitySquares count={1} />
			</div>
			<div class="flex items-center gap-2">
				<ActivitySquares count={4} />
				<div class="whitespace-nowrap">more</div>
			</div>
		</div>
	</div>
</div>
