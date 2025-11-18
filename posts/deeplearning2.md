---
title: "刘澈的deeplearning笔记2"
date: "2025-11-17"
description: "深度学习基础知识笔记"
tags: ["深度学习", "笔记"]
---

# 深度学习入门

事实上 并不是所有函数都是线性的
![线性函数有局限](/images/posts/15fa0282-6a4d-422d-ac9a-cfc5fb5bbe1f.png)
在这张图中 我们无论怎么改变w跟b都无法与红色函数重合
因此我们需要一个更加强大的函数来刻画piecewise linear curves（由许多线段构成的几何曲线）

事实上 所有的piecewise linear curve都可以表示成常数+一堆蓝色折线function之和
![描述](/images/posts/b94bbe14-056f-4236-8095-e618577c6fcd.png)


一系列折线如何模拟？使用sigmoid function逼近折线）
![蓝色折线function](/images/posts/c625fcc9a5bd21ec07d3ccf0f1c8cf03ed41b17c.png)
调整c,b,w就可以改变此函数
![t](/images/posts/701807f4199a9e39c7218cab3d9a774b37864de6.png)

把多段折线+常数整合到一个式子里
![整合式子](/images/posts/701807f4199a9e39c7218cab3d9a774b37864de6.png)

从上往下：线性模型的式子

piecewise linear curve
 
能同时考虑多个特征对输出的影响的式子

令人费解的第四个式子😭😭
![令人费解的第四个式子](/images/posts/EBEEE4AA91B2121031A3FBB20A8BFA1C.png)

对第四个式子的更详细解释：黑色圈圈1.2.3代表三个sigmoid function。每一个sigmoid function都受x1 x2 x3三个要素影响，所以在计算它们时需要乘上各自的权w并求和，再加上常数b构成sigmoid function。
![详细解释](/images/posts/c6dd0c2f43df5bcb448dbce6edf4441a1a33af10.png)

线性代数的表示方法
![详细解释](images\posts\9756FF6E5965D72854FF9C25EA48A8A4.png)
