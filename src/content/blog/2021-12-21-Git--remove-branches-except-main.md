---
title: "Git: remove branches except main"
pubDate: 2023/02/11 9:20
author: "Valerio Como"
tags:
  - git
imgUrl: '../../assets/blog/2021-12-21-git-remove-branches-except-main/cover.png'
description: Keep your git repo clean
---

### Git: remove branches except main

#### Keep your git repo clean

![](../../assets/blog/2021-12-21-git-remove-branches-except-main/cover.png)

### TL;DR

### Problem

When you are working on a project for a while, you could have a lot of unused branches. Terminal is your best friend in order to keep your local repo clean.

#### Solution

Bash is good friend for developers. So, you could use its superpowers and run simple powerful commands.

#### Explanation

*Pipes* let you use the output of program as an input for another program. So, the script is a combination of three programs:

* *git branch*: list all branches
* *grep -v "master\|main"*: remove *master* and *main* from the list of local branches
* *xargs git branch -D*: delete all branches taken from the standard input

#### BONUS: Git Flow clean up

If you adopt *Git Flow* as your workflow, you can use this script:

Hope you found this post useful.