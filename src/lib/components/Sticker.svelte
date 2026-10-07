<script lang="ts">
	// A label slapped on at a slight angle. It flips colors when its nearest `group` parent is hovered,
	// so it stays readable on rows and tiles that invert on hover.
	export let tilt = 0; // degrees; ignored when wrapping (tilt the container instead, inline text can't rotate)
	// Multi-line text, each line on its own strip. Line spacing is set here relative to the text size, so put it
	// inside a `leading-none` box: otherwise that box's own line height can force bigger gaps at small sizes.
	export let wrap = false;
	export let tone: 'dark' | 'light' = 'dark'; // black sticker with white text, or the reverse
	// sm for post text, author/date and small labels; lg for the bigger standalone stickers
	export let size: 'sm' | 'lg' = 'lg';

	const textSizes = {
		sm: 'text-sm sm:text-base',
		lg: 'text-xl'
	};
	$: textSize = textSizes[size];

	// Both tones flip on hover, since whatever is behind them flips too.
	$: colors =
		tone === 'dark'
			? 'bg-black text-white group-hover:bg-white group-hover:text-black'
			: 'bg-white text-black group-hover:bg-black group-hover:text-white';
</script>

{#if wrap}
	<span
		class="whitespace-pre-wrap px-1.5 [overflow-wrap:anywhere] [box-decoration-break:clone] {textSize} !leading-[1.4] {colors} {$$props.class ??
			''}"
	>
		<slot />
	</span>
{:else}
	<span
		class="inline-block max-w-full truncate whitespace-nowrap px-1.5 {textSize} {colors} {$$props.class ??
			''}"
		style="transform: rotate({tilt}deg);"
	>
		<slot />
	</span>
{/if}
