<script lang="ts">
	import { routes } from '$lib/paths';

	type Keymap = { keys: string[]; modes: string; does: string };
	type Group = { title: string; note?: string; maps: Keymap[] };

	const groups: Group[] = [
		{
			title: 'movement',
			maps: [
				{ keys: ['ctrl+d'], modes: 'n', does: 'half page down, cursor centered' },
				{ keys: ['ctrl+u'], modes: 'n', does: 'half page up, cursor centered' },
				{ keys: ['n'], modes: 'n', does: 'next search result, centered' },
				{ keys: ['N'], modes: 'n', does: 'previous search result, centered' },
				{ keys: ['ctrl+h'], modes: 'n', does: 'go to the split or tmux pane on the left' },
				{ keys: ['ctrl+j'], modes: 'n', does: 'go to the split or tmux pane below' },
				{ keys: ['ctrl+k'], modes: 'n', does: 'go to the split or tmux pane above' },
				{ keys: ['ctrl+l'], modes: 'n', does: 'go to the split or tmux pane on the right' },
				{ keys: ['shift+h'], modes: 'n', does: 'previous buffer' },
				{ keys: ['shift+l'], modes: 'n', does: 'next buffer' }
			]
		},
		{
			title: 'editing',
			maps: [
				{ keys: ['U'], modes: 'n', does: 'redo' },
				{ keys: ['<'], modes: 'v', does: 'indent left and reselect' },
				{ keys: ['>'], modes: 'v', does: 'indent right and reselect' },
				{ keys: ['ctrl+j'], modes: 'v', does: 'move the selection down' },
				{ keys: ['ctrl+k'], modes: 'v', does: 'move the selection up' },
				{ keys: ['space', 'r', 's'], modes: 'n', does: 'substitute the word under the cursor across the file' },
				{ keys: ['space', 'm'], modes: 'n', does: 'split or join the block under the cursor' },
				{ keys: ['space', 'l', 'g'], modes: 'n', does: 'drop a log statement for the variable under the cursor' },
				{ keys: ['esc'], modes: 'n', does: 'clear search highlights and multicursors' }
			]
		},
		{
			title: 'clipboard',
			maps: [
				{ keys: ['space', 'y'], modes: 'n v', does: 'yank to the system clipboard' },
				{ keys: ['space', 'Y'], modes: 'n', does: 'yank the line to the system clipboard' },
				{ keys: ['space', 'p'], modes: 'v', does: 'paste over the selection without losing the register' },
				{ keys: ['space', 'c', 'p'], modes: 'v', does: 'copy a file:line-range reference, with an optional note' }
			]
		},
		{
			title: 'files & windows',
			maps: [
				{ keys: ['space', 'e'], modes: 'n', does: 'open the parent directory in oil' },
				{ keys: ['space', 'w'], modes: 'n', does: 'save' },
				{ keys: ['space', 'q'], modes: 'n', does: 'quit the window' },
				{ keys: ['ctrl+c'], modes: 'n', does: 'close the buffer' },
				{ keys: ['space', 'v'], modes: 'n', does: 'vertical split' },
				{ keys: ['space', 'r', 'r'], modes: 'n', does: 'rotate the split buffers' }
			]
		},
		{
			title: 'searching',
			note: 'all telescope',
			maps: [
				{ keys: ['space', 's', 'f'], modes: 'n', does: 'files, frecency-ranked' },
				{ keys: ['space', 's', 'F'], modes: 'n', does: 'all files' },
				{ keys: ['space', 's', 'g'], modes: 'n', does: 'live grep' },
				{ keys: ['space', 's', 'u'], modes: 'n', does: 'files with uncommitted changes' },
				{ keys: ['space', 's', 'd'], modes: 'n', does: 'diagnostics' },
				{ keys: ['space', 's', 'h'], modes: 'n', does: 'help tags' },
				{ keys: ['space', 's', 'k'], modes: 'n', does: 'keymaps' },
				{ keys: ['ctrl+q'], modes: 'i n', does: 'send the results to the quickfix list, from inside a picker' }
			]
		},
		{
			title: 'lsp',
			note: 'buffer-local, appear when a server attaches',
			maps: [
				{ keys: ['space', 'g', 'd'], modes: 'n', does: 'go to definition' },
				{ keys: ['space', 'g', 'i'], modes: 'n', does: 'go to implementation' },
				{ keys: ['space', 'g', 'r'], modes: 'n', does: 'find references' },
				{ keys: ['space', 'D'], modes: 'n', does: 'go to type definition' },
				{ keys: ['space', 'r', 'n'], modes: 'n', does: 'rename the symbol' },
				{ keys: ['space', 'c', 'a'], modes: 'n v', does: 'code action' },
				{ keys: ['space', 'space'], modes: 'n', does: 'hover documentation' },
				{ keys: ['space', 'd'], modes: 'n', does: 'open the diagnostic float' }
			]
		},
		{
			title: 'git',
			maps: [
				{ keys: ['space', 'g', 'm'], modes: 'n', does: 'diff the file against main' },
				{ keys: ['space', 'z', 'd'], modes: 'n', does: 'zdiff of uncommitted changes' },
				{ keys: ['space', 'z', 'D'], modes: 'n', does: 'zdiff against main' }
			]
		},
		{
			title: 'quickfix',
			maps: [
				{ keys: ['space', 'c', 'o'], modes: 'n', does: 'toggle the quickfix list' },
				{ keys: ['space', 'c', 'n'], modes: 'n', does: 'next entry' },
				{ keys: ['space', 'c', 'p'], modes: 'n', does: 'previous entry' }
			]
		},
		{
			title: 'testing',
			note: 'neotest, in go projects',
			maps: [
				{ keys: ['space', 't', 'r'], modes: 'n', does: 'run the nearest test' },
				{ keys: ['space', 't', 'f'], modes: 'n', does: "run the file's tests" },
				{ keys: ['space', 't', 's'], modes: 'n', does: 'test summary' },
				{ keys: ['space', 't', 'o'], modes: 'n', does: 'test output' },
				{ keys: ['space', 't', 'p'], modes: 'n', does: 'test output panel' },
				{ keys: ['space', 'g', 't'], modes: 'n', does: 'jump between a go file and its test' },
				{ keys: ['space', 'g', 'o', 'd'], modes: 'n', does: 'go documentation' }
			]
		},
		{
			title: 'formatting',
			maps: [{ keys: ['space', 'f'], modes: 'n', does: 'format the buffer' }]
		},
		{
			title: 'completion',
			note: 'blink.cmp',
			maps: [
				{ keys: ['tab'], modes: 'i', does: 'accept, or tab out of a bracket when the menu is closed' },
				{ keys: ['enter'], modes: 'i', does: 'accept' },
				{ keys: ['shift+tab'], modes: 'i', does: 'open the menu' },
				{ keys: ['ctrl+j'], modes: 'i', does: 'next item' },
				{ keys: ['ctrl+k'], modes: 'i', does: 'previous item' },
				{ keys: ['ctrl+space'], modes: 'i', does: 'open the menu, or toggle the docs' },
				{ keys: ['ctrl+y'], modes: 'i', does: 'accept' },
				{ keys: ['ctrl+e'], modes: 'i', does: 'dismiss' },
				{ keys: ['ctrl+b'], modes: 'i', does: 'scroll the docs up' },
				{ keys: ['ctrl+f'], modes: 'i', does: 'scroll the docs down' }
			]
		},
		{
			title: 'session',
			maps: [{ keys: ['space', 'r', 'e'], modes: 'n', does: 'restart nvim in place' }]
		}
	];
</script>

<main class="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 p-4 py-16 xl:max-w-3xl">
	<h1 class="text-lg md:text-xl">nvim keymaps</h1>

	<section class="text-base-content/70 space-y-4 text-sm md:text-base">
		<p>
			space is the leader. everything below is what's added on top of stock vim — if a key isn't listed, it does exactly
			what vanilla vim does.
		</p>
		<p class="text-base-content/50">modes: n = normal, v = visual, i = insert</p>
	</section>

	{#each groups as group (group.title)}
		<section class="text-base-content/70 space-y-4 text-sm md:text-base">
			<h2 class="text-base-content">
				{group.title}
				{#if group.note}
					<span class="text-base-content/50 text-sm">— {group.note}</span>
				{/if}
			</h2>
			<div class="overflow-x-auto">
				<table class="table-sm table">
					<thead>
						<tr>
							<th class="w-48">keys</th>
							<th class="w-16">mode</th>
							<th>action</th>
						</tr>
					</thead>
					<tbody>
						{#each group.maps as map (map.keys.join() + map.does)}
							<tr>
								<td>
									<span class="flex flex-wrap gap-1">
										{#each map.keys as key, i (i)}
											<kbd class="kbd kbd-sm">{key}</kbd>
										{/each}
									</span>
								</td>
								<td class="text-base-content/50">{map.modes}</td>
								<td>{map.does}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>
	{/each}

	<div class="divider"></div>

	<p class="text-sm md:text-base">
		<a
			href={routes.nvim}
			class="link link-hover">← back to the walkthrough</a
		>
	</p>
</main>
