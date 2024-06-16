local capabilities = require('cmp_nvim_lsp').default_capabilities()
local nvim_lsp = require('lspconfig')


--require("lspconfig").denols.setup {
--	root_dir = nvim_lsp.util.root_pattern("deno.json", "deno.jsonc"),
--  capabilities = capabilities
--}

nvim_lsp.tsserver.setup {
  capabilities = capabilities
}


--require("lspconfig").volar.setup {
--  capabilities = capabilities,
--	filetypes = { 'typescript', 'javascript', 'javascriptreact', 'typescriptreact', 'vue', 'json' }
--}
