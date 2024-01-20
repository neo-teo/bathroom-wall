<script lang="ts">
	import { howLongAgo } from '$lib/utils/timeUtils';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ posts } = data.bar);
</script>

<a href="/"><h1>bathroom <br /> wall</h1></a>

<h1>{data.bar.name}</h1>

<h2>{data.date}</h2>

<hr />

<form
	action={`?/createPost`}
	method="POST"
	style="display: flex; flex-direction: column; max-width: 350px;"
>
	<input type="hidden" id="barId" name="barId" value={data.bar.id} />
	<label for="nickname"> Nickname </label>
	<input type="text" id="nickname" name="nickname" value={data.nickname ?? ''} required />
	<label for="message"> Message </label>
	<textarea id="message" name="message" rows={5} required />
	<button>Post</button>
</form>

<hr />

{#if posts.length === 0}
	<div>
		<p style="color:gray">🥱 it's quiet in here... be the first to write something</p>
	</div>
{/if}

{#each posts as post}
	<div>
		<p><b>{post.message}</b></p>
		<p>#{post.nickname} {howLongAgo(post.date)}</p>
	</div>
	<hr />
{/each}
