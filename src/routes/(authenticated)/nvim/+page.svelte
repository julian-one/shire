<script lang="ts">
	import { routes } from '$lib/paths';

	type Plugin = { name: string; does: string };
	type PluginGroup = { title: string; plugins: Plugin[] };

	const pluginGroups: PluginGroup[] = [
		{
			title: 'ui',
			plugins: [
				{ name: 'rose-pine', does: 'colorscheme, transparent background, bold and italics switched off' },
				{ name: 'lualine.nvim', does: 'one global statusline, with macro-recording and workspace diagnostic counts' },
				{ name: 'tiny-cmdline.nvim', does: 'the command line floats mid-screen; cmdheight is zero' },
				{ name: 'fidget.nvim', does: 'lsp progress in the corner' },
				{ name: 'modicator.nvim', does: 'the line number changes color with the mode' },
				{ name: 'smartcolumn.nvim', does: 'a color column that only appears when a line is actually too long' },
				{ name: 'mini.icons', does: 'icons everywhere, standing in for nvim-web-devicons' }
			]
		},
		{
			title: 'editing',
			plugins: [
				{
					name: 'mini.ai + pairs + surround + jump',
					does: 'better text objects, auto pairs, surround, repeatable f and t'
				},
				{ name: 'treesj', does: 'split and join blocks' },
				{ name: 'tabout.nvim', does: 'tab out of closing brackets and quotes' },
				{ name: 'nvim-ts-autotag', does: 'closes and renames html tags' },
				{ name: 'guess-indent.nvim', does: 'matches the indentation of whatever file is open' },
				{ name: 'nvim-chainsaw', does: 'drops a log statement for the variable under the cursor' },
				{ name: 'nvim-hlslens', does: 'match counts rendered next to search results' }
			]
		},
		{
			title: 'navigation',
			plugins: [
				{
					name: 'oil.nvim + oil-git-status',
					does: 'the file explorer is just a buffer, with git status in the sign column'
				},
				{
					name: 'telescope.nvim',
					does: 'fuzzy finding, with fzf-native and ui-select — file search is frecency-ranked'
				},
				{ name: 'quicker.nvim', does: 'a nicer quickfix list' },
				{ name: 'vim-tmux-navigator', does: 'one set of keys for vim splits and tmux panes' }
			]
		},
		{
			title: 'git',
			plugins: [
				{ name: 'gitsigns.nvim', does: 'hunks in the sign column and current-line blame' },
				{ name: 'zdiff.nvim', does: 'a full diff view of uncommitted work, or of everything since main' }
			]
		},
		{
			title: 'completion',
			plugins: [
				{
					name: 'blink.cmp',
					does: 'completion, with luasnip + friendly-snippets for snippets and a ripgrep source for project-wide words'
				}
			]
		},
		{
			title: 'lsp & tooling',
			plugins: [
				{ name: 'mason + lspconfig + tool-installer', does: 'installs everything the language table asks for' },
				{ name: 'nvim-lspconfig', does: 'base configs for the language servers' },
				{ name: 'SchemaStore.nvim', does: 'json and yaml schema catalogs' },
				{ name: 'workspace-diagnostics.nvim', does: 'diagnostics for the whole project, not just open buffers' },
				{ name: 'tiny-inline-diagnostic.nvim', does: 'diagnostics rendered inline after the offending line' },
				{ name: 'tiny-code-action.nvim', does: 'code actions in a telescope picker' },
				{ name: 'conform.nvim', does: 'format on save' }
			]
		},
		{
			title: 'go',
			plugins: [
				{ name: 'godoc.nvim', does: 'go documentation in a buffer' },
				{ name: 'gopher.nvim', does: 'struct tags, iferr, impl, and test generation' },
				{ name: 'neotest + neotest-golang', does: 'run tests from the buffer' }
			]
		}
	];

	const servers = [
		'bashls',
		'biome',
		'clangd',
		'dockerls',
		'eslint',
		'gopls',
		'jsonls',
		'lua_ls',
		'sqls',
		'svelte',
		'tailwindcss',
		'templ',
		'ts_ls',
		'yamlls'
	];
</script>

<main class="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 p-4 py-16 xl:max-w-3xl">
	<h1 class="text-lg md:text-xl">my neovim config</h1>

	<section class="text-base-content/70 space-y-4 text-sm md:text-base">
		<p>
			a walkthrough of my day-to-day editor. no distribution, no plugin-manager framework — under a thousand lines of
			lua on neovim nightly, with plugins handled by the built-in package manager, vim.pack.
		</p>
	</section>

	<section class="text-base-content/70 space-y-4 text-sm md:text-base">
		<h2 class="text-base-content">layout</h2>
		<p>init.lua is two requires: config, then plugins.</p>
		<pre class="bg-base-200 rounded-box overflow-x-auto p-4 text-xs leading-relaxed md:text-sm"
			>{`nvim/
├── init.lua                the two requires
├── lua/
│   ├── config/
│   │   ├── options.lua     vim.o settings
│   │   ├── keymaps.lua     leader key + core maps
│   │   ├── autocmds.lua    event hooks + :PackClean
│   │   └── languages.lua   the language table
│   └── plugins/            one file per plugin, each declaring its own vim.pack specs
├── after/
│   └── lsp/                per-server overrides
└── docs/
    └── adr/                why things are the way they are`}</pre
		>
	</section>

	<section class="text-base-content/70 space-y-4 text-sm md:text-base">
		<h2 class="text-base-content">the language table</h2>
		<p>
			the centerpiece of the config. every language is one row declaring its treesitter parsers, language servers, mason
			packages, and formatters:
		</p>
		<pre class="bg-base-200 rounded-box overflow-x-auto p-4 text-xs leading-relaxed md:text-sm"
			>{`{
  name = 'go',
  parsers = { 'go', 'gomod', 'gosum', 'gowork' },
  servers = { 'gopls' },
  mason = { 'goimports', 'gomodifytags', 'gotests', 'iferr', 'impl' },
  formatters = { go = { 'goimports' } },
}`}</pre
		>
		<p>
			nothing else keeps its own list — treesitter derives its parser installs from the table, mason installs the
			servers and tools it names, and conform reads its formatters from it. adding a language is adding a row. a
			formatter entry can also be a function: the javascript row picks biome when the project has a biome config and
			falls back to eslint + prettierd otherwise.
		</p>
		<p>
			the one thing the table deliberately doesn't hold is per-server settings — those live in after/lsp/ overrides,
			where neovim's runtime path merges them over the lspconfig defaults for free. the table is the index; the
			overrides are the settings.
		</p>
	</section>

	<section class="text-base-content/70 space-y-4 text-sm md:text-base">
		<h2 class="text-base-content">options</h2>
		<ul class="list-disc space-y-1 pl-5">
			<li>relative line numbers, with the absolute number on the cursor line</li>
			<li>mouse disabled — keyboard only</li>
			<li>folds come from treesitter, and every file starts fully unfolded</li>
			<li>case-insensitive search until the query contains a capital, with :substitute previewed live in a split</li>
			<li>no swap files; undo history persists across sessions instead</li>
			<li>one global statusline, and no command line at all until something needs it</li>
			<li>rounded borders on floating windows, and eight lines of scrolloff</li>
			<li>the experimental ui2 message interface, switched on ahead of its default</li>
		</ul>
	</section>

	<section class="text-base-content/70 space-y-4 text-sm md:text-base">
		<h2 class="text-base-content">keymaps</h2>
		<p>
			space is the leader key. the philosophy is stock vim with small ergonomic nudges — nothing that rewires muscle
			memory.
		</p>
		<p>
			<a
				href={routes.nvimKeymaps}
				class="link link-hover">the full list lives on its own page →</a
			>
		</p>
	</section>

	<section class="text-base-content/70 space-y-4 text-sm md:text-base">
		<h2 class="text-base-content">autocmds</h2>
		<ul class="list-disc space-y-1 pl-5">
			<li>yanked text flashes for a moment</li>
			<li>reopening a file restores the cursor to where you left off, centered</li>
			<li>:help opens in a vertical split on the right</li>
			<li>splits re-equalize whenever the terminal is resized</li>
			<li>comments never continue themselves onto new lines</li>
			<li>.env files get ini highlighting</li>
		</ul>
	</section>

	<section class="text-base-content/70 space-y-4 text-sm md:text-base">
		<h2 class="text-base-content">plugins</h2>
		<p>
			each plugin file declares its own specs with vim.pack.add, pinned by nvim-pack-lock.json. PackChanged autocmds
			cover the build steps — telescope-fzf-native gets compiled, treesitter parsers get updated, and the go plugins
			install their binaries. a :PackClean command deletes anything no longer in a spec list.
		</p>
		{#each pluginGroups as group (group.title)}
			<h3 class="text-base-content/90 pt-2">{group.title}</h3>
			<ul class="space-y-2">
				{#each group.plugins as plugin (plugin.name)}
					<li>
						<span class="text-base-content">{plugin.name}</span>
						<span class="text-base-content/50"> — {plugin.does}</span>
					</li>
				{/each}
			</ul>
		{/each}
	</section>

	<section class="text-base-content/70 space-y-4 text-sm md:text-base">
		<h2 class="text-base-content">lsp</h2>
		<p> fourteen servers come out of the language table — mason installs them, mason-lspconfig switches them on: </p>
		<div class="flex flex-wrap gap-1">
			{#each servers as server (server)}
				<span class="badge badge-sm">{server}</span>
			{/each}
		</div>
		<p>nvim-lspconfig supplies the defaults, and files in after/lsp/ layer overrides on top:</p>
		<ul class="list-disc space-y-1 pl-5">
			<li>gopls — gofumpt formatting, staticcheck, and the full set of codelenses</li>
			<li>lua_ls — pointed at the neovim runtime, so editing this config gets real completions</li>
			<li>jsonls + yamlls — validation against the schemastore catalogs</li>
		</ul>
		<p>
			when a server attaches, workspace-diagnostics pulls diagnostics for the whole project rather than waiting for
			buffers to open, and the buffer gets its lsp keymaps.
		</p>
	</section>

	<section class="text-base-content/70 space-y-4 text-sm md:text-base">
		<h2 class="text-base-content">formatting</h2>
		<p>
			conform formats on save, with the language server as the fallback. formatters come from the language table: stylua
			for lua, goimports for go, sql-formatter in postgres mode for sql, prettierd for svelte, json, and graphql. the
			javascript family is project-aware — a biome config at the root means biome does everything; otherwise eslint
			fixes run straight from the project's node_modules, then prettierd formats.
		</p>
	</section>

	<section class="text-base-content/70 space-y-4 text-sm md:text-base">
		<h2 class="text-base-content">treesitter</h2>
		<p>
			the config tracks the main rewrite branch. parsers are derived from the language table and any missing ones
			install at startup; every buffer then gets treesitter highlighting, indentation, and folds.
		</p>
	</section>

	<div class="divider"></div>

	<p class="text-sm md:text-base">
		<a
			href={routes.nvimKeymaps}
			class="link link-hover">keymaps →</a
		>
	</p>
</main>
