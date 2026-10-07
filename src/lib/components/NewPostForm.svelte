<script lang="ts">
	import { enhance } from '$app/forms';
	import Sticker from './Sticker.svelte';
	import MediaUploader from './MediaUploader.svelte';
	import { createEventDispatcher } from 'svelte';
	import { invalidateAll } from '$app/navigation';

	export let data: any;
	export let form: any;

	const dispatch = createEventDispatcher();

	let loading = false;

	$: nickname = data.nickname ?? '';
	$: message = form?.message ?? '';
	$: imageData = form?.imageData ?? null;

	function imageDataChanged(event: CustomEvent<any>) {
		imageData = event.detail.imageData;
	}
</script>

<!-- Full-screen new post: a photo area on top, the caption under it, then nickname and the submit button. -->
<form
	action={'?/createPost'}
	method="POST"
	enctype="multipart/form-data"
	class="flex min-h-0 flex-1 flex-col gap-3 p-3"
	use:enhance={() => {
		loading = true;

		return async ({ result, update }) => {
			await update();
			nickname = '';
			nickname = data.nickname ?? '';
			loading = false;
			invalidateAll();
			if (result.type === 'success') dispatch('closeModal');
		};
	}}
>
	<input type="hidden" id="barId" name="barId" value={data.bar.id} />
	<input type="hidden" id="barUniqueName" name="barUniqueName" value={data.bar.uniqueName} />

	<input type="hidden" id="tileRow" name="tileRow" value={0} />
	<input type="hidden" id="tileCol" name="tileCol" value={0} />

	<MediaUploader {imageData} on:change={imageDataChanged} />

	<label for="message" hidden> Caption </label>
	<textarea
		id="message"
		name="message"
		rows={4}
		placeholder="Caption"
		value={message}
		required={!imageData}
		class="min-h-24 resize-none"
	/>

	<label for="nickname" hidden> Nickname </label>
	<input type="text" id="nickname" name="nickname" placeholder="Nickname" value={nickname} required />

	{#if form?.error}
		<p class="text-sm text-rose-500">{form.error}</p>
	{/if}

	<button
		type="submit"
		class="group flex h-14 shrink-0 items-center justify-center border hover:bg-black focus:outline-none disabled:bg-black"
		disabled={loading}
	>
		<Sticker size="sm" tilt={-2}>{loading ? 'posting...' : 'post'}</Sticker>
	</button>
</form>
