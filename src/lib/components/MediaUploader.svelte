<script lang="ts">
	import { resizeAndConvertToJPEG } from '$lib/utils/fileUtils';
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';

	export let imageData: string | null = null;

	const dispatch = createEventDispatcher();

	const openFileInput = () => {
		const fileInput = document.getElementById('capture') as HTMLInputElement;
		fileInput.click();
	};

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
</script>

<div
	class="flex min-h-[40px] items-center gap-[10px] rounded-sm border-t border-dashed border-gray-200 px-2"
>
	<button
		class="flex items-center gap-2 rounded-xl bg-gray-100 px-2 text-blue-400"
		on:click|preventDefault={openFileInput}
	>
		<Icon icon="material-symbols:add-photo-alternate" />
		Choose image
	</button>

	{#if imageData}
		<img src={imageData} alt="preview" class="h-[40px]" />
	{:else}
		<p class="text-gray-400">no image selected</p>
	{/if}
</div>

<!-- TODO: eventually add ", video/*" to the accept prop below to allow capturing video -->
<input type="file" id="capture" accept="image/*" on:change={captureMedia} hidden />

<!-- The following hidden input stores the capture's data -->
<input type="text" name="imageData" value={imageData} hidden />
