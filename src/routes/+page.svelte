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

	function hasVoted() {
		return localStorage.getItem('hasVoted') === 'true';
	}

	async function vote(choice) {
		if (!hasVoted()) {
			await fetch('/api/votes', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name: choice.name })
			});
			localStorage.setItem('hasVoted', 'true'); // Mark as voted
			await fetchChoices(); // Refresh choices
		} else {
			alert('You have already voted!');
		}
	}
</script>

<h1>Vote for Outing</h1>

<section>
	<form on:submit|preventDefault={addChoice}>
		<input type="text" bind:value={newChoice} placeholder="Enter a new choice" />
		<button type="submit">Add Choice</button>
	</form>
</section>

<section>
	<h2>Choices</h2>
	<ul>
		{#each choices.sort((a, b) => b.votes - a.votes) as choice}
			<li>
				{choice.name} - Votes: {choice.votes}
				<button on:click={() => vote(choice)}>Vote</button>
			</li>
		{/each}
	</ul>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.2;
	}

	li {
		color: var(--color-text1);
		list-style-type: none;
		display: flex;
		gap: 1.5rem;
		justify-content: space-between;
	}
</style>
