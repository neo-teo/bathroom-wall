<script lang="ts">
	import { resizeAndConvertToJPEG } from '$lib/utils/fileUtils';
	import { createEventDispatcher } from 'svelte';
	import Sticker from './Sticker.svelte';

	export let imageData: string | null = null;

	const dispatch = createEventDispatcher();

	let fileInput: HTMLInputElement;

	const captureMedia = (event: Event) => {
		const input = event.target as HTMLInputElement;

		if (input && input.files && input.files.length > 0) {
			const file = input.files[0];
			if (file.type.includes('image')) {
				const reader = new FileReader();

				reader.onload = function (e) {
					const img = new Image();
					img.onload = () => {
						dispatch('change', { imageData: resizeAndConvertToJPEG(img) });
					};
					img.src = e.target?.result as string;
				};

				reader.readAsDataURL(file);
			}
		}
	};

	function removeImage() {
		fileInput.value = '';
		dispatch('change', { imageData: null });
	}
</script>

<!-- A big photo area: "add a photo" until one is picked, then a preview (tap it to pick another). -->
<div class="group relative flex min-h-0 flex-1 border border-dashed hover:bg-black">
	<button
		type="button"
		class="flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden focus:outline-none"
		on:click={() => fileInput.click()}
	>
		{#if imageData}
			<img src={imageData} alt="preview" class="max-h-full max-w-full object-contain" />
		{:else}
			<Sticker size="sm" tilt={-1.5}>add a photo</Sticker>
		{/if}
	</button>

	{#if imageData}
		<button type="button" class="absolute bottom-2 right-2 focus:outline-none" on:click={removeImage}>
			<Sticker size="sm" tilt={2}>remove</Sticker>
		</button>
	{/if}
</div>

<!-- TODO: eventually add ", video/*" to the accept prop below to allow capturing video -->
<input type="file" accept="image/*" bind:this={fileInput} on:change={captureMedia} hidden />

<!-- The following hidden input stores the capture's data -->
<input type="text" name="imageData" value={imageData ?? ''} hidden />
