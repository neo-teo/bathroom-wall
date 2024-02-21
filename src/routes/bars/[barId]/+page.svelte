<script lang="ts">
	import type { ActionData, PageData } from './$types';

	import Post from '$lib/components/Post.svelte';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import MediaUploader from '$lib/components/MediaUploader.svelte';
	import Icon from '@iconify/svelte';

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

	// onMount if postId is part of query params scroll to that post and do some scaling animation
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

<div class="grid grid-cols-2">
	<a href="/"><h1>bathroom <br /> wall</h1></a>

	<div class="flex flex-col justify-center text-right">
		<h2>{data.bar.name}</h2>
		<p class="text-sm">{data.date}</p>
	</div>
</div>

<form
	action={`?/createPost`}
	method="POST"
	enctype="multipart/form-data"
	class="flex flex-col gap-[10px]"
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

	<div class="flex flex-col gap-[5px]">
		<label for="nickname"> Nickname </label>
		<input type="text" id="nickname" name="nickname" value={nickname} required />
	</div>

	<div class="flex flex-col gap-[5px]">
		<label for="message"> Message </label>
		<textarea id="message" name="message" rows={3} value={message} required />
	</div>

	<MediaUploader {imageData} on:change={imageDataChanged} />

	<button
		type="submit"
		class={`relative h-[30px] rounded-sm border bg-blue-500 p-0.5 text-white ${loading ? 'bg-blue-600' : ''}`}
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

{#if posts.length === 0}
	<p>🥱 it's quiet in here...</p>
{/if}

{#each posts as post}
	<Post {post} />
{/each}

<p class="text-sm text-gray-400">
	{'showing tags from the past 24 hours only'}
</p>
