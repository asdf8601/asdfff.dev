---
title: "grep -b shows the byte offset of matches"
date: 2025-10-20
---

```sh
$ printf 'foo bar\nsay hello\n' > notes.txt
$ grep -b hello notes.txt
8:say hello
$ grep -ob hello notes.txt
12:hello
$ tail -c +13 notes.txt
hello
```

Offsets are 0-based. Alone, `-b` gives the offset of the matching line; with `-o` it gives the offset of the match itself. `tail -c +N` is 1-based, so jump to offset + 1.

[ugrep](https://github.com/Genivia/ugrep) prints the match offset even without `-o`.
