<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Sticker from './Sticker.svelte';

	// A full-screen sheet with a "back" button. The parent owns `showModal` and sets it back to false on `close`,
	// which fires for the close button, Esc (native <dialog>), and any other way the dialog gets closed.
	export let showModal: boolean;

	const dispatch = createEventDispatcher<{ close: void }>();

	let dialog: HTMLDialogElement;

	$: if (dialog) {
		if (showModal && !dialog.open) dialog.showModal();
		if (!showModal && dialog.open) dialog.close();
	}

	// Tell the parent right away; the native `close` event can arrive late (e.g. in background tabs).
	function close() {
		dialog.close();
		dispatch('close');
	}
</script>

<dialog
	class="m-0 h-full max-h-none w-full max-w-none bg-white p-0 backdrop:bg-white focus:outline-none"
	bind:this={dialog}
	on:close={() => dispatch('close')}
>
	<div class="flex h-full flex-col">
		<!-- Just the "back" sticker in the top left, but the whole top row is the button so it's easy to hit -->
		<button
			type="button"
			class="group flex h-14 w-full shrink-0 items-center px-3 hover:bg-black focus:outline-none"
			on:click={close}
		>
			<Sticker size="sm" tilt={-2}>back</Sticker>
		</button>

		<slot />
	</div>
</dialog>
