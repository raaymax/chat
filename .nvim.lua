local capabilities = require('cmp_nvim_lsp').default_capabilities()
local nvim_lsp = require('lspconfig')


--require("lspconfig").denols.setup {
--	root_dir = nvim_lsp.util.root_pattern("deno.json", "deno.jsonc"),
--  capabilities = capabilities
--}


function StartDeno()
  require("lspconfig").denols.setup {
    root_dir = nvim_lsp.util.root_pattern("deno.json", "deno.jsonc"),
    capabilities = capabilities
  }
end

function StartTS()
  require("lspconfig").ts_ls.setup {
    on_init = function(client)
      print(client)
      return false
    end,
    capabilities = capabilities
  }
end

vim.g.StartTS = StartTS
vim.g.StartDeno = StartDeno

--require("lspconfig").volar.setup {
--  capabilities = capabilities,
--	filetypes = { 'typescript', 'javascript', 'javascriptreact', 'typescriptreact', 'vue', 'json' }
--
