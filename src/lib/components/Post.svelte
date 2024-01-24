<script lang="ts">
	import { howLongAgo } from '$lib/utils/timeUtils';
	import type { Post } from '@prisma/client';

	export let post: Post;
</script>

<div class="flex flex-col gap-[10px] rounded-sm border border-gray-500 bg-white p-3">
	<div class="flex justify-between">
		<div class="flex gap-[3px]">
			#
			<p class="font-bold">{post.nickname}</p>
		</div>
		<p class="text-sm text-gray-400">{howLongAgo(post.date)}</p>
	</div>
	<p>{post.message}</p>
</div>
