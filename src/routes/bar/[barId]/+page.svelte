<script lang="ts">
	import { howLongAgo } from '$lib/utils/timeUtils';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ posts } = data.bar);
</script>

<div class="grid grid-cols-2">
	<a href="/"><h1>bathroom <br /> wall</h1></a>

	<div class="flex flex-col justify-center border-l border-black text-right">
		<h2>{data.bar.name}</h2>

		<h4>{data.date}</h4>
	</div>
</div>

<form action={`?/createPost`} method="POST" class="flex flex-col gap-[10px]">
	<input type="hidden" id="barId" name="barId" value={data.bar.id} />
	<div class="flex flex-col gap-[5px]">
		<label for="nickname"> Nickname </label>
		<input type="text" id="nickname" name="nickname" value={data.nickname ?? ''} required />
	</div>
	<div class="flex flex-col gap-[5px]">
		<label for="message"> Message </label>
		<textarea id="message" name="message" rows={3} required />
	</div>
	<button class="rounded-sm border bg-blue-500 p-0.5 text-white">Post</button>
</form>

{#if posts.length === 0}
	<div>
		<p class="text-gray-400">🥱 it's quiet in here...</p>
	</div>
{/if}

{#each posts as post}
	<div class="flex flex-col gap-[10px] rounded-sm border border-gray-400 p-3">
		<div class="flex justify-between">
			<div class="flex gap-[3px]">
				#
				<p class="font-bold">{post.nickname}</p>
			</div>
			<p class="text-sm text-gray-400">{howLongAgo(post.date)}</p>
		</div>
		<p>{post.message}</p>
	</div>
{/each}
