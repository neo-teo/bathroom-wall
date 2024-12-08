<script lang="ts">
	export let value: number;
	export let maxValue: number;

	function getColorIntensity(value: number, maxValue: number) {
		const white = { r: 255, g: 255, b: 255 };
		const blue = { r: 59, g: 130, b: 246 };

		// interpolate between white and blue based on the ratio
		const ratio = value / maxValue;
		const r = Math.round(white.r + (blue.r - white.r) * ratio);
		const g = Math.round(white.g + (blue.g - white.g) * ratio);
		const b = Math.round(white.b + (blue.b - white.b) * ratio);

		return `rgb(${r}, ${g}, ${b})`;
	}
</script>

<div
	class="h-4 w-4 border border-gray-400"
	style="background-color: {getColorIntensity(value, maxValue)}"
/>
