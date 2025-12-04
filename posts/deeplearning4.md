---
title: "刘澈的deeplearning笔记1"
date: "2025-12-4"
description: "深度学习基础知识笔记"
tags: ["深度学习", "笔记"]
---

# 深度学习入门
有的时候虽然一直在update 但是loss却没有下降 这时可能是遇到了localminima 但更可能是遇到了saddle point（鞍点）
![描述](51e79bd5ce9e920e27908b0584d4a17982c0ca65.png)
不同的是 在saddle point上仍然有使loss更低的路径 如何分辨？

下面是一大段微积分和线性代数 看不懂

![描述](145d7bbd363a33c2dd421a931f14bb7105.png)

1.使用泰勒展开 在梯度为0的点附近一阶导为0，可以用二阶导是否等于零判断是localminima还是saddle point

2.看不懂
![描述](333.png)

如果H的所有特征向量都是正的/负的，可以判断是局部最小/最大值

大概全都看不懂

在传统的低维问题中 localminima确实是很大的问题 但是在实际深度学习中可能存在一万个参数 就相当于一个一万维度的空间 如果要存在一个localminima 就要求所有的参数维度都是向上弯曲的 这样子的概率几乎为零。