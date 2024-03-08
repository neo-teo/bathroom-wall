<script lang="ts">
	import type { ActionData, PageData } from './$types';

	import Post from '$lib/components/Post.svelte';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import MediaUploader from '$lib/components/MediaUploader.svelte';
	import Icon from '@iconify/svelte';
	import { timeGroupToDisplayDate } from '$lib/utils/timeUtils';

	export let data: PageData;
	export let form: ActionData;

	let loading = false;

	$: posts = data.bar.posts;

	$: nickname = data.nickname ?? '';
	$: message = form?.message ?? '';
	$: imageData = form?.imageData ?? null;

	function imageDataChanged(event: CustomEvent<any>) {
		imageData = event.detail.imageData;
	}

	// if postId is part of query params, scroll to that post and do a scaling animation
	onMount(async () => {
		if (data.postId) {
			const postElement = document.getElementById(`post_${data.postId}`);
			if (postElement) {
				window.scrollTo({
					top: postElement.getBoundingClientRect().top - 100,
					behavior: 'smooth'
				});
				postElement.classList.add('scale-[1.065]');
				setTimeout(() => postElement.classList.remove('scale-[1.065]'), 1500);
			}
		}
	});
</script>

<div class="mx-5 flex justify-between">
	<a href="/"><h1>bathroom <br /> wall</h1></a>
	<div class="flex flex-col items-end justify-center text-right">
		<h2>{data.bar.name}</h2>
		<a
			href={`/bars/${data.bar.uniqueName}/archive?date=${data.timeGroup}`}
			class="flex items-center gap-2 rounded-xl border border-gray-400 bg-white px-2 no-underline"
		>
			<p class="text-sm">
				{data.isArchivedWall ? timeGroupToDisplayDate(data.timeGroup) : 'Today'}
			</p>
		</a>
	</div>
</div>

<!-- Only allow posting when it is "today" -->
{#if !data.isArchivedWall}
	<form
		action={`?/createPost`}
		method="POST"
		enctype="multipart/form-data"
		class="flex flex-col gap-[10px] px-5"
		use:enhance={() => {
			loading = true;

			return async ({ update }) => {
				await update();
				nickname = '';
				nickname = data.nickname ?? '';
				loading = false;
			};
		}}
	>
		<input type="hidden" id="barId" name="barId" value={data.bar.id} />
		<input type="hidden" id="barUniqueName" name="barUniqueName" value={data.bar.uniqueName} />

		<div class="flex grow flex-col gap-[5px]">
			<label for="nickname"> Nickname </label>
			<input type="text" id="nickname" name="nickname" value={nickname} required />
		</div>

		<div class="flex flex-col gap-[5px]">
			<label for="message"> Message </label>
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
{/if}

{#if posts.length === 0}
	<p class="px-5">🥱 it's quiet in here...</p>
{/if}

{#each posts as post}
	<Post {post} barUniqueName={data.bar.uniqueName} />
{/each}

<p class="px-5 text-sm text-gray-400">
	{`displaying ${data.isArchivedWall ? timeGroupToDisplayDate(data.timeGroup) : "today's"} tags. for other days, check ${data.bar.name}'s`}
	<a
		href={`/bars/${data.bar.uniqueName}/archive?date=${data.timeGroup}`}
		class="text-sm text-gray-400"
	>
		archive
	</a>
</p>
