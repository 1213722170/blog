---
title: "刘澈的deeplearning笔记7"
date: "2026-2-1"
description: "classification"
tags: ["深度学习", "笔记"]
---
![描述](classification_v2_03.png)
在做分类问题时，如果给每个分类的组别标一个编号，很多情况下都不太合理，比如组别1往往不一定和组别2更有关系，和组别3又有很大差距
![描述](classification_v2_04.png)
所以往往会用one-hot vector来表示
![描述](classification_v2_06.png)
classification和regression类似，不同点在于输出的y不再是一个值而是多个构成了one-hot vector的值。同时，由于label中的值都是0或1，所以在算出最终y的值后要用softmax函数处理一下y，使得y落在0-1之间
![alt text](classification_v2_07.png)
图中的exp（y）是e的y次方
![alt text](classification_v2_08.png)
如图是两种计算loss的方法 cross entrophy比mean square error好用一点