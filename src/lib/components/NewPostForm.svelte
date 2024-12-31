<script lang="ts">
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
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

<form
	action={'?/createPost'}
	method="POST"
	enctype="multipart/form-data"
	class="flex min-w-[300px] flex-col gap-[10px] p-2"
	use:enhance={() => {
		loading = true;

		return async ({ result, update }) => {
			dispatch('submit');
			await update();
			nickname = '';
			nickname = data.nickname ?? '';
			loading = false;
			invalidateAll();
		};
	}}
>
	<input type="hidden" id="barId" name="barId" value={data.bar.id} />
	<input type="hidden" id="barUniqueName" name="barUniqueName" value={data.bar.uniqueName} />

	<input type="hidden" id="tileRow" name="tileRow" value={0} />
	<input type="hidden" id="tileCol" name="tileCol" value={0} />

	<div class="flex flex-col gap-[5px]">
		<label for="message" hidden> Message </label>
		<div class="flex flex-col border bg-white">
			<textarea
				id="message"
				name="message"
				rows={2}
				value={message}
				required={!imageData}
				class="resize-none border-none"
			/>
			<MediaUploader {imageData} on:change={imageDataChanged} />
		</div>
	</div>

	<div class="flex flex-col gap-[5px]">
		<label for="nickname" hidden> Nickname </label>
		<input
			type="text"
			class="focus:outline-none"
			id="nickname"
			name="nickname"
			placeholder="nickname (i.e. wall artist)"
			value={nickname}
			required
		/>
	</div>

	<button
		type="submit"
		class={`relative h-[30px] border p-0.5 ${loading ? 'bg-gray-800 text-white' : ''}`}
		disabled={loading}
	>
		<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">+</div>
		{#if loading}
			<div class="absolute left-1/2 top-1/2 -translate-x-10 -translate-y-1/2">
				<Icon icon="line-md:loading-loop" color={'white'} />
			</div>
		{/if}
	</button>

	{#if form?.error}
		<p class="text-sm text-rose-500">{form.error}</p>
	{/if}
</form>
