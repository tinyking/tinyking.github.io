---
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
title: how to monitor java garbage collection
date: 2018-06-27 10:49:46
tags:
    - Java
    - GC
categories:
    - 后端
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

First, the GC monitoring methods can be separated into **CUI** and **GUI** depending on the access interface. The typical CUI GC monitoring method involves using a separate CUI application called "**jstat**", or selecting a JVM option called "**verbosegc**" when running JVM.

GUI GC monitoring is done by using a separate GUI application, and three most commonly used applications would be "jconsole", "jvisualvm" and "Visual GC".

Let's learn more about each method.

# jstat

**jstat** is a monitoring tool in HotSpot JVM. Other monitoring tools for HotSpot JVM are **jps** and **jstatd**. Sometimes, you need all three tools to monitor a Java application.

**jstat** does not provide only the GC operation information display. It also provides class loader operation information or Just-in-Time compiler operation information. Among all the information jstat can provide, in this article we will only cover its functionality to monitor GC operating information.

**jstat** is located in `$JDK_HOME/bin`, so if java or javac can run without setting a separate directory from the command line, so can jstat.

You can try running the following in the command line.


```
$> jstat –gc  $<vmid$> 1000

S0C       S1C       S0U    S1U      EC         EU          OC         OU         PC         PU         YGC     YGCT    FGC      FGCT     GCT
3008.0   3072.0    0.0     1511.1   343360.0   46383.0     699072.0   283690.2   75392.0    41064.3    2540    18.454    4      1.133    19.588
3008.0   3072.0    0.0     1511.1   343360.0   47530.9     699072.0   283690.2   75392.0    41064.3    2540    18.454    4      1.133    19.588
3008.0   3072.0    0.0     1511.1   343360.0   47793.0     699072.0   283690.2   75392.0    41064.3    2540    18.454    4      1.133    19.588

$>
```

Just like in the example, the real type data will be output along with the following columns:

**`S0C    S1C     S0U     S1U    EC     EU     OC     OU     PC`**.

**vmid** (Virtual Machine ID), as its name implies, is the ID for the VM. Java applications running either on a local machine or on a remote machine can be specified using vmid. The vmid for Java application running on a local machine is called **lvmid** (Local vmid), and usually is PID. To find out the lvmid, you can write the PID value using a **ps** command or Windows task manager, but we suggest **jps** because PID and lvmid does not always match. **jps** stands for Java PS. **jps** shows vmids and main method information. Just like ps shows PIDs and process names.

Find out the vmid of the Java application that you want to monitor by using jps, then use it as a parameter in jstat. If you use jps alone, only bootstrap information will show when several WAS instances are running in one equipment. We suggest that you use `ps -ef | grep java` command along with jps.

GC performance data needs constant observation, therefore when running jstat, try to output the GC monitoring information on a regular basis.

For example, running "`jstat –gc <vmid> 1000`" (or 1s) will display the GC monitoring data on the console every 1 second. "`jstat –gc <vmid> 1000 10`" will display the GC monitoring information once every 1 second for 10 times in total.

There are many options other than `-gc`, among which GC related ones are listed below.


| Option Name    | Description                                                                                                                                                                                               |
|:---------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| gc             | It shows the current size for each heap area and its current usage (Ede, survivor, old, etc.), total number of GC performed, and the accumulated time for GC operations.                                  |
| gccapactiy     | It shows the minimum size (ms) and maximum size (mx) of each heap area, current size, and the number of GC performed for each area. (Does not show current usage and accumulated time for GC operations.) |
| gccause        | It shows the "information provided by -gcutil" + reason for the last GC and the reason for the current GC.                                                                                                |
| gcnew          | Shows the GC performance data for the new area.                                                                                                                                                           |
| gcnewcapacity  | Shows statistics for the size of new area.                                                                                                                                                                |
| gcold          | Shows the GC performance data for the old area.                                                                                                                                                           |
| gcoldcapacity  | Shows statistics for the size of old area.                                                                                                                                                                |
| gcpermcapacity | Shows statistics for the permanent area.                                                                                                                                                                  |
| gcutil         | Shows the usage for each heap area in percentage. Also shows the total number of GC performed and the accumulated time for GC operations.                                                                 |
