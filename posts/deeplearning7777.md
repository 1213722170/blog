---
title: "刘澈的deeplearning笔记5"
date: "2026-1-26"
description: "batch和momentem"
tags: ["深度学习", "笔记"]
---
shuffle：在每次把数据分成不同batch时打乱资料
如图，表面上看，大batch由于把超级多数据放在一起，会导致运行速度很慢，但由于它一次遍历了所有数据，准确度会更高

而小batch运行速度会更快，但会更不准确
![描述](small-gradient-v7_20.png)

但实际上不是这样的，在考虑平行运算（？）之后，大batch的运行速度反而会更快。并且，大batch的准确度也不尽人意
![描述](small-gradient-v7_24.png)
一个可能的解释是，如图，full batch在gradient decent的时候一旦遇到local minima和saddle point就会停下（gradient为0），这样就没法更新参数。但是在小batch中，就算gradient在一个batch的L1中为0，在另一个batch的L2中也不一定为0，因此能不断更新参数。
![描述](small-gradient-v7_25.png)

大小batch之间的比较
![描述](small-gradient-v7_28.png)
generalization：在testing data上的表现
Optimization：在training data上的表现

![描述](small-gradient-v7_32.png)
momentum：在更新参数的时候，不只考虑gradient的正负，还要考虑前一次（或者之前很多次）update，将两个数据相加得出真正的更新

