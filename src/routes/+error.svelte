<script>
	import { page } from '$app/stores';
</script>

<h1 class="px-5">{$page.status}</h1>

<h2 class="px-5">
	{$page.error?.message}
</h2>

<h4>
	<a href="/" class="px-5">Back to home</a>
</h4>
