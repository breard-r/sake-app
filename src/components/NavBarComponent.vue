<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import LayoutComponent from '../components/LayoutComponent.vue';
import { Popover } from 'bootstrap';
</script>

<template>
	<nav class="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
		<div class="container-fluid">
			<span class="navbar-brand"></span>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavBar" aria-controls="mainNavBar" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="mainNavBar">
				<LayoutComponent>
					<ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
						<li class="nav-item">
							<RouterLink to="/add-account" class="nav-link">{{ $t("navbar.addAccount") }}</RouterLink>
						</li>
						<li class="nav-item">
							<RouterLink to="/manage-accounts" class="nav-link">{{ $t("navbar.manageAccounts") }}</RouterLink>
						</li>
						<li class="nav-item">
							<RouterLink to="/config" class="nav-link">{{ $t("navbar.config") }}</RouterLink>
						</li>
						<li class="nav-item">
							<RouterLink to="/about" class="nav-link">{{ $t("navbar.about") }}</RouterLink>
						</li>
					</ul>
				</LayoutComponent>
			</div>
		</div>
	</nav>
</template>
