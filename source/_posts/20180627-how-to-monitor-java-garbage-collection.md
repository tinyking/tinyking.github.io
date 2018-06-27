---
title: how to monitor java garbage collection
date: 2018-06-27 10:49:46
tags:
    - java
    - gc
---

> [原文](https://www.cubrid.org/blog/how-to-monitor-java-garbage-collection)


# What is GC Monitoring?
**Garbage Collection Monitoring** refers to the _process of figuring out how JVM is running GC_. For example, we can find out:

1. When an object in young has moved to old and by how much,
2. or wehn `stop-the-world` has occurred and for how long.

GC Monitoring is carried out to see _if JVM is running GC efficiently_, and _to check if additional GC tuning is necessary_. Based on this information, the application can be edited or GC method can be changed (**GC tuning**).

# How to Monitor GC?

There are different ways to monitor GC, but the only difference is how the GC operation information is shown. GC is done by JVM, and since the GC monitoring tools disclose the GC information provided by JVM, you will get the same results on matter how you monitor GC. Therefore, you do not need to learn all methods to monitor GC, but since it only requires a little amount of time to learn each GC monitoring method, knowing a few of them can help you use the right one for different situations and environments.

The tools or JVM options listed below cannot be used universally regardless of the HVM vendor. This is because there is no need for a "standard" for disclosing GC information. In this example we will use **HotSpot JVM** (Oracle JVM). Since NHN is using Oracle(Sun) JVM, there should be no difficulties in applying the tools or JVM options that we are explaining here.

