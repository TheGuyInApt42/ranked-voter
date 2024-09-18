<script>
	import { onMount } from 'svelte';
	let choices = [];
	let newChoice = '';

	// Load existing choices from the API
	async function fetchChoices() {
		const response = await fetch('/api/votes');
		choices = await response.json();
	}

	onMount(fetchChoices);

	async function addChoice() {
		if (newChoice.trim()) {
			await fetch('/api/votes', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name: newChoice.trim() })
			});
			newChoice = '';
			await fetchChoices(); // Refresh choices
		}
	}
</script>

<h1>Vote for Your Choice</h1>

<form on:submit|preventDefault={addChoice}>
	<input type="text" bind:value={newChoice} placeholder="Enter a new choice" />
	<button type="submit">Add Choice</button>
</form>

<h2>Choices</h2>
<ul>
	{#each choices.sort((a, b) => b.votes - a.votes) as choice}
		<li>
			{choice.name} - Votes: {choice.votes}
			<button
				on:click={async () => {
					await fetch('/api/votes', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ name: choice.name })
					});
					await fetchChoices(); // Refresh choices
				}}>Vote</button
			>
		</li>
	{/each}
</ul>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
