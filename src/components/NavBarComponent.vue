<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const menuActive = ref(false);
const toggleBurger = () => {
	menuActive.value = !menuActive.value;
};
</script>

<template>
	<div class="container">
		<div class="columns is-centered">
			<div class="column is-three-fifths">
				<nav class="navbar" role="navigation" aria-label="main navigation">
					<div class="navbar-brand">
						<a role="button" class="navbar-burger" :class="{ 'is-active': menuActive }" aria-label="menu" aria-expanded="false" @click="toggleBurger">
							<span aria-hidden="true"></span>
							<span aria-hidden="true"></span>
							<span aria-hidden="true"></span>
						</a>
					</div>
					<div class="navbar-menu" :class="{ 'is-active': menuActive }">
						<div class="navbar-end">
							<RouterLink to="/add-account" class="navbar-item">New account</RouterLink>
							<RouterLink to="/manage-accounts" class="navbar-item">Accounts</RouterLink>
							<RouterLink to="/about" class="navbar-item">About</RouterLink>
						</div>
					</div>
				</nav>
			</div>
		</div>
	</div>
</template>
