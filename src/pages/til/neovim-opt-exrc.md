---
date: 2025-11-07
---

Load local `.nvim.lua`

[`:help exrc`](https://neovim.io/doc/user/options.html#'exrc')

```lua
# init.lua
vim.opt.exrc = true
vim.opt.secure = true
```

```lua
# .nvim.lua
vim.print("hello from local rc")
```
