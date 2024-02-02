<script lang="ts">
	import type { PageData } from './$types';

	import Post from '$lib/components/Post.svelte';
	import { readImageFileAndFillInCaptureInfo } from '$lib/utils/fileUtils';

	export let data: PageData;

	$: ({ posts } = data.bar);

	function captureMedia() {
		const input = document.getElementById('capture') as HTMLInputElement;

		const captureData = document.getElementById('captureData') as HTMLInputElement;
		const captureAR = document.getElementById('captureAR') as HTMLInputElement;

		if (input && input.files && input.files.length > 0) {
			const file = input.files[0];
			if (file.type.includes('image')) {
				// readImageFileAndFillInCaptureInfo(file, captureData, captureAR);
			}
		}
	}
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
>
	<input type="hidden" id="barId" name="barId" value={data.bar.id} />
	<div class="flex flex-col gap-[5px]">
		<label for="nickname"> Nickname </label>
		<input type="text" id="nickname" name="nickname" value={data.nickname ?? ''} required />
	</div>

	<div class="flex flex-col gap-[5px]">
		<label for="message"> Message </label>
		<textarea id="message" name="message" rows={3} required />
	</div>

	<!-- TODO: eventually add ", video/*" to the accept prop below to allow capturing video -->
	<input type="file" id="capture" accept="image/*" capture on:change={captureMedia} />

	<!-- The following two hidden inputs store the capture's data and aspect ratio -->
	<input type="text" id="captureData" name="captureData" class="hidden" />
	<input type="text" id="captureAR" name="captureAR" class="hidden" />

	<button class="rounded-sm border bg-blue-500 p-0.5 text-white">Post</button>
</form>

{#if posts.length === 0}
	<p class="text-gray-400">🥱 it's quiet in here...</p>
{/if}

{#each posts as post}
	<Post {post} />
{/each}
