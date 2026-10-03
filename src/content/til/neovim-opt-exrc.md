---
title: "Load a per-project Neovim config with exrc"
date: 2025-11-07
---

[`:help exrc`](https://neovim.io/doc/user/options.html#'exrc')

```lua title="init.lua"
vim.opt.exrc = true
vim.opt.secure = true
```

Files: `.nvim.lua` > `.nvimrc` > `.exrc`

```lua
-- .nvim.lua (.nvimrc and .exrc are Vimscript)
vim.print("hello from local rc")
```
