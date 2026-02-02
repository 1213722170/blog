---
title: "刘澈的deeplearning笔记6"
date: "2026-1-30"
description: "adaptive learning rate"
tags: ["深度学习", "笔记"]
---
![描述](optimizer-v4_04.png)
在如上图所示的error surface上做gradient descent会发现，当我们把learning rate设太大时，参数会不断震荡，但loss也没有变小多少。而learning rate设太小时，虽然参数不再震荡，但是由于loss的图像已经很光滑，也无法到达loss最小的点。 

所以需要改进一下gradient descent，给不同的参数设置不同的learning rate
![描述](optimizer-v4_05.png)
总的来说，希望learning rate在坡度很大时小一点，在坡度小的时候调大一点

在下面那个式子中，leaning rate 从η变成了η/σ
![描述](optimizer-v4_06.png)
![描述](optimizer-v4_10.png)
图中θ代表参数数值，g代表gradient，η和α是hyper parameter

RMSProp相较于root mean square更加灵敏。如图，如果把alpha设的比较小，就可以让新的gradient对learning rate的影响变得更大
![描述](optimizer-v4_12.png)
如图，在采用了rmsprop + momentem的方法后gradient可以很快下降到值很小的区域，但由于图像几乎是平行的，导致参数w的gradient特别小，就累计了很小的sigma，容易出现上下震荡。
![描述](optimizer-v4_13.png)
为了解决图像震荡的问题，可以把η不设定为常量，而让它随着时间越来越小。另一种设置η的方法是先变大后变小
