---
title: "刘澈的deeplearning笔记1"
date: "2025-11-17"
description: "深度学习基础知识笔记"
tags: ["深度学习", "笔记"]
---

# 深度学习入门
一.深度学习概念

![深度学习概念](/images/posts/f38ec4c7-97c9-4465-9e20-b88343eb1fa6.png)
让机器具备找函数的能力
如语音识别 f（一段语音）=文字

二.深度学习步骤

![深度学习步骤](/images/posts/e3656947-f2a8-41e0-be73-df4b22812b28.png)

1.找一个函数定义未知量 如y=wx+b

![描述](/images/posts/5c2f866e-ea59-485c-b163-a3873440762b.png)


2.定义loss

![define loss](/images/posts/dfgiugaafd-f32f-4ebe-8e2d-d69112fd0683.png)


3.找到一个w与b使得loss最小

方法：gradient descent

![gradient descent](/images/posts/b32d6d1c-343d-4040-a4eb-e27024bd9f17.png)

随机选取函数上一点 求该点斜率 斜率>0则向左移动 斜率<0则向右移动

4.根据结果优化模型
![描述](/images/posts/581187bb-f32f-4ebe-8e2d-d69112fd0683.png)

