<script lang="ts">
  import { page } from '$app/stores';
  import type { Brand, Socket, Model } from './+page.server';

  // Data structures
  let cpuBrands: Brand[] = [];
  let cpuSockets: Record<Brand['value'], Socket[]> = {};
  let cpuModels: Record<Brand['value'], Record<Socket['value'], Model[]>> = {};

  // Selected values
  let selectedBrand: string = '';
  let selectedSocket: string = '';
  let selectedModel: string = '';

  // Available options
  let availableSockets: Socket[] = [];
  let availableModels: Model[] = [];

  // Load data from page store
  $: {
    const data = $page.data;
    cpuBrands = data.cpuBrands || [];
    cpuSockets = data.cpuSockets || {};
    cpuModels = data.cpuModels || {};
  }

  // Update available sockets when brand changes
  $: availableSockets = selectedBrand ? cpuSockets[selectedBrand] || [] : [];

  // Update available models when socket changes
  $: availableModels = selectedBrand && selectedSocket ? cpuModels[selectedBrand]?.[selectedSocket] || [] : [];

  // Reset selections on brand change
  $: if (selectedBrand) {
    selectedSocket = '';
    selectedModel = '';
  }

  // Reset model selection on socket change
  $: if (selectedSocket) {
    selectedModel = '';
  }
</script>

<div class="flex justify-center items-center min-h-screen py-8">
  <div class="cpu-selector-card max-w-md">
    <header>
      <h2 class="text-2xl font-bold mb-6 text-center">CPU Selector</h2>
    </header>
    <section class="space-y-4 select-container">
      <label class="label">
        <span>CPU Brand</span>
        <select class="select" bind:value={selectedBrand}>
          <option value="" disabled={selectedBrand !== undefined}>Select a brand</option>
          {#each cpuBrands as brand}
            <option value={brand.value}>{brand.name}</option>
          {/each}
        </select>
      </label>

      <label class="label">
        <span>CPU Socket</span>
        <select class="select" bind:value={selectedSocket} disabled={!selectedBrand}>
          <option value="" disabled={selectedSocket !== undefined}>Select a socket</option>
          {#each availableSockets as socket}
            <option value={socket.value}>{socket.name}</option>
          {/each}
        </select>
      </label>

      <label class="label">
        <span>CPU Model</span>
        <select class="select" bind:value={selectedModel} disabled={!selectedSocket}>
          <option value="" disabled={selectedModel !== undefined}>Select a model</option>
          {#each availableModels as model}
            <option value={model.value}>{model.name}</option>
          {/each}
        </select>
      </label>
    </section>
  </div>
</div>

<style>
  .cpu-selector-card {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .select-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .select {
    width: 200px;
  }
</style>