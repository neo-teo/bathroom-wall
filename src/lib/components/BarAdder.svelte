<script lang="ts">
	import GooglePlaceAutoComplete from '$lib/components/GooglePlaceAutoComplete.svelte';
	import Modal from '$lib/components/Modal.svelte';

	export let addEndpoint: string;

	let showModal = false;

	let googleInputBar: { name: string; address: string };

	async function barSelected(data: CustomEvent<any>) {
		if (data && data.detail && data.detail.place) {
			googleInputBar = {
				name: data.detail.place.name,
				address: data.detail.place.formatted_address
			};

			showModal = true;
		}
	}
</script>

<form
	action={addEndpoint}
	method="POST"
	class="flex flex-col gap-[10px] border-t border-black px-3"
>
	<GooglePlaceAutoComplete on:place_changed={(data) => barSelected(data)} />

	{#if showModal}
		<Modal bind:showModal>
			<div class="flex flex-col gap-[20px]">
				<h1>does this look right?</h1>

				<div class="flex flex-col gap-[5px]">
					<h2>{googleInputBar.name}</h2>
					<p class="text-sm">{googleInputBar.address}</p>
				</div>

				<div class="flex gap-[20px]">
					<button class="flex text-xl text-blue-400 focus:outline-none"> yes </button>

					<button
						class="flex text-xl text-blue-400 focus:outline-none"
						on:click|preventDefault={() => (showModal = false)}
					>
						no
					</button>
				</div>
			</div>
		</Modal>
	{/if}
</form>
