
"{{{Simple options
set ts=2 sts=2 sw=2 expandtab
set encoding=utf-8
set hlsearch
set incsearch
set number
set t_Co=256
set laststatus=2
set mouse=n
set hidden
set backupdir=~/.backup,.,/tmp
set directory=~/.backup,.,/tmp
set backspace=2
colorscheme slate
"}}}

"{{{Plugins
set nocompatible
filetype off 
set rtp+=~/.vim/bundle/Vundle.vim
call plug#begin('~/.vim/plugged')
Plug 'gmarik/Vundle.vim'
Plug 'tpope/vim-fugitive'
Plug 'preservim/nerdtree' |
            \ Plug 'Xuyuanp/nerdtree-git-plugin'
Plug 'voldikss/vim-floaterm'
Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
Plug 'ycm-core/YouCompleteMe'
Plug 'mg979/vim-visual-multi', {'branch': 'master'}
Plug 'dyng/ctrlsf.vim'
Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'
Plug 'mbbill/undotree'
Plug 'mhinz/vim-signify'
Plug 'dense-analysis/ale'
Plug 'morhetz/gruvbox'
"Plug 'marijnh/tern_for_vim'
"Plug 'scrooloose/syntastic'
"Plug 'SirVer/ultisnips'
"Plug 'honza/vim-snippets'
"Plug 'sentientmachine/erics_vim_syntax_and_color_highlighting'
"Plug 'digitaltoad/vim-jade'
"Plug 'wavded/vim-stylus'
"Plug 'leafgarland/typescript-vim'
"Plug 'tomasr/molokai'
"Plug 'dracula/vim', { 'name': 'dracula' }
call plug#end()

filetype plugin indent on
"}}}


"{{{Theme
"let g:gruvbox_contrast_dark="hard"
colo gruvbox
"colo molokai
"colo dracula


"let g:molokai_original = 1
"let g:rehash256 = 1
" Different cursors for different modes
let &t_SI = "\<Esc>]50;CursorShape=1\x7"
let &t_SR = "\<Esc>]50;CursorShape=2\x7"
let &t_EI = "\<Esc>]50;CursorShape=0\x7"

"}}}

"{{{ Options for plugins
let g:ctrlsf_backend='ag'
let g:ycm_global_ycm_extra_conf = '/home/raay/.ycm_extra_conf.py'
let g:ycm_use_ultisnips_completer = 1
let g:UltiSnipsExpandTrigger="<c-A>"
let g:UltiSnipsJumpForwardTrigger="<c-b>"
let g:UltiSnipsJumpBackwardTrigger="<c-z>"
let g:undotree_WindowLayout=3
highlight SignifySignAdd    cterm=bold ctermbg=237  ctermfg=119
highlight SignifySignDelete cterm=bold ctermbg=237  ctermfg=167
highlight SignifySignChange cterm=bold ctermbg=237  ctermfg=227
highlight link SignifyLineChangeDelete    SignifyLineChange
highlight link SignifyLineDeleteFirstLine SignifyLineDelete

let g:ale_fixers = {
\   'javascript': [
\       'eslint',
\   ],
\}
let g:ale_fix_on_save = 1

"}}}

"{{{Auto commands
if has("autocmd")
	au! bufreadpost .vimrc setlocal foldmethod=marker
	au! bufreadpost *.tex setlocal spell spelllang=pl
	au! bufreadpost *.jade setlocal syntax=jade
	au! bufreadpost *.ts setlocal syntax=typescript
	au! bufwritepost .vimrc source $MYVIMRC
endif
"}}}

"{{{Custom functions
let g:myrelnu = 0
fu! LineRelativeToggle()
	if(g:myrelnu != 1)
		set relativenumber
		let g:myrelnu = 1
	else
		set norelativenumber
		let g:myrelnu = 0
	endif

endfu

let g:mypaste = 0
fu! PasteToggle()
	if(g:mypaste != 1)
		set paste
		let g:mypaste = 1
	else
		set nopaste
		let g:mypaste = 0
	endif

endfu

fu! OpenTerm()
  term ++rows=6
  normal ^WJ
  res 6
endfu

fu! InitCmdTerm()
  let t:cmdTerm = get(t:, 'cmdTerm', "NONE")
  if t:cmdTerm == "NONE"
    let t:cmdTerm = term_start(shell)
  endif
  return t:cmdTerm
endfu

fu! ExecuteBlock()
  call InitCmdTerm()
  let start = search(';', 'bWn')
  let end = search(';', 'Wn')
  call term_sendkeys(t:cmdTerm, join(getline(start+1, end), "\<CR>") . "\<CR>")
endfu

fu! ExecuteLine()
  call InitCmdTerm()
  call term_sendkeys(t:cmdTerm, getline('.') . "\<CR>")
endfu
"}}}

"{{{ Shortcuts
let mapleader = ","
nmap <leader>v :tabedit $MYVIMRC<CR>
nmap <leader>n :NERDTreeToggle<CR>
nmap <leader>. :NERDTreeFind<CR>
nmap <leader>l :call LineRelativeToggle()<CR>
nmap <leader>p :call PasteToggle()<CR>
nmap <leader>u :UndotreeToggle<CR>
nmap <leader>t :call OpenTerm()<CR>
nmap <leader>T :FloatermNew<CR>
nmap <leader>x :call ExecuteLine()<CR>
nmap <leader>f :!npx eslint --fix %<CR>
nmap <leader>z :call fzf#run({'source': 'git ls-files', 'sink': 'e', 'window': { 'width': 0.9, 'height': 0.6 }})<CR>

nmap tr :tabprevious<CR>
nmap ty :tabnext<CR>

"{{{ Git
nmap <leader>gs :Gstatus<CR>
nmap <leader>gc :Gcommit<CR>
nmap <leader>gp :Gpull<CR>
nmap <leader>gP :Gpush<CR>
"}}}

"{{{ npm
nmap <leader>ni :!npm install<CR>
nmap <leader>nI :!npm init<CR>
nmap <leader>nu :!npm update<CR>
nmap <leader>np :!npm publish<CR>
"}}}

"}}}

