<script lang="ts">
	import { enhance } from '$app/forms';
	import Modal from '$lib/components/Modal.svelte';
	import Icon from '@iconify/svelte';
	import MediaUploader from './MediaUploader.svelte';

	export let data: any;
	export let form: any;

	export let row: number;
	export let col: number;

	let showModal = true;

	let loading = false;

	$: nickname = data.nickname ?? '';
	$: message = form?.message ?? '';
	$: imageData = form?.imageData ?? null;

	function imageDataChanged(event: CustomEvent<any>) {
		imageData = event.detail.imageData;
	}
</script>

<Modal bind:showModal>
	<form
		action={'?/createPost'}
		method="POST"
		enctype="multipart/form-data"
		class="flex min-w-[300px] flex-col gap-[10px]"
		use:enhance={() => {
			loading = true;

			return async ({ update }) => {
				await update();
				nickname = '';
				nickname = data.nickname ?? '';
				loading = false;
				showModal = false;
			};
		}}
	>
		<input type="hidden" id="barId" name="barId" value={data.bar.id} />
		<input type="hidden" id="barUniqueName" name="barUniqueName" value={data.bar.uniqueName} />

		<input type="hidden" id="tileRow" name="tileRow" value={row} />
		<input type="hidden" id="tileCol" name="tileCol" value={col} />

		<div class="flex flex-col gap-[5px]">
			<label for="message" hidden> Message </label>
			<div class="flex flex-col rounded-md border border-gray-300 bg-white">
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
			class={`relative h-[30px] rounded-md border bg-blue-500 p-0.5 text-white ${loading ? 'bg-blue-600' : ''}`}
			disabled={loading}
		>
			<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">Post</div>
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
</Modal>
