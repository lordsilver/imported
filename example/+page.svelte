<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	export let data;
	let filtered = data.items.filter((it) => it.id <= data.query);

	// false means the client has no js, server will return filtered data.items
	let enhanced = false;

	onMount(() => {
		// this executes client side with js only
		enhanced = true;
		const shouldEnableEnhancement = $page.url.searchParams.get('enhanced') === 'false';
		if (shouldEnableEnhancement) {
			// progressive enhancement:
			// when clients disabled enhancement via query param
			// but have js, we force enhancement
			$page.url.searchParams.set('enhanced', 'true');
			$page.url.searchParams.delete('query');
			goto(`?${$page.url.searchParams}`);
		}
	});

	const onSubmit = (event: SubmitEvent) => {
		// stop call to load function
		// let svelte cleint side js/reactivity
		// handle the data filtering and ui update
		event.preventDefault();

		const query = Number(data.query);
		filtered = data.items.filter((it) => it.id <= query);
		console.log('Filtered', filtered);
	};
</script>

<a href="/">Go back</a>
<br><br>

<form method="get" on:submit={onSubmit}>
	<input type="hidden" name="enhanced" value={enhanced} />
	<label for="query">
		Filter
		<input type="range" name="query" min="0" max="3" bind:value={data.query} />
	</label>
	<button>Submit</button>
</form>

<p>Query: {data.query}</p>
<p>Items</p>

{#each filtered as item}
	<div>
		Item: id = {item.id}, value = {item.value}
	</div>
{/each}
