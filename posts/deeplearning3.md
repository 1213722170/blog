---
title: "刘澈的deeplearning笔记3"
date: "2025-11-21"
description: "深度学习基础知识笔记"
tags: ["深度学习", "笔记"]
---

# 深度学习入门
![描述](22666424BE593B2505AD32AF817F34EB.png)
什么是overfitting？

training model可以看作对真实数据分布的采样点 而最终生成的函数如果过于flexible 会导致函数把一些无关的因素也当成数据的规律 导致training data的loss很小 但实际上可能只有几个训练点满足这个函数 使得testing data的loss特别大。

如何解决overfitting？

一.增加training data

1.自己搜罗更多资料出来

2.data augmentation：自己创造出新的资料 比如在做影像辨识时把图片左右翻转 放大缩小 创造出不同的图片 但要注意创造出的必须是合理的图片 如果把它上下颠倒就不合理了

二.给模型一点限制

看不懂



推荐的训练方法
1.cross validation
![描述](cross.png)
把training set分成两份 比如90％的训练数据和10％的测试数据 根据模型在测试数据上的得分高低来选择模型

2.n-fold cross validation
![miaoshu](nfold.png)
把训练数据分为n堆 让它们轮流做训练数据和测试数据 根据模型的得分总和来选择模型


感觉主要是习题课 还是得做一下课后题