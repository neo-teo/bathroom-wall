<script lang="ts">
	import Icon from '@iconify/svelte';

	export let clientCity: string;
</script>

<div class="flex justify-between">
	<div class="flex items-center gap-[5px]">
		<select name="clientCity" class="dropdown relative w-fit bg-transparent text-sm font-bold">
			<option value={clientCity}>{clientCity}</option>
		</select>
		<Icon icon="octicon:triangle-down" />
	</div>
	<div class="flex items-center gap-[5px]">
		<select name="sortCriteria" class="dropdown relative w-fit bg-transparent text-sm font-bold">
			<option value={'Hottest'}>Hottest</option>
			<option value={'Closest'}>Closest</option>
		</select>
		<Icon icon="octicon:triangle-down" />
	</div>
</div>

<!-- css to expand clickable area of dropdown buttons without affecting their size visually -->
<style lang="postcss">
	.dropdown {
		-webkit-appearance: none;
	}
	.dropdown::after {
		content: '';
		position: absolute;
		top: -20px;
		left: -20px;
		right: -60px;
		bottom: -20px;
	}
</style>
