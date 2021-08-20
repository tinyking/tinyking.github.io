---
title: 基于Jackson的两个Json对象进行比较
date: 2020-08-24 18:27:00
tags:
    - Java
categories:
    - 后端
index_img: https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fgss0.baidu.com%2F7Po3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2F5d6034a85edf8db12432eb2a0423dd54564e7464.jpg&refer=http%3A%2F%2Fgss0.baidu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1632028889&t=2b31b3bb2f80651194b28d3bb3251d1f
---

## 1. 概述
在本文中，我们将使用Jackson—一个用于Java的JSON处理库来比较两个JSON对象。

## 2. Maven依赖
首先，让我们添加jackson-databind Maven依赖:

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.9.8</version>
</dependency>
```

## 3.使用Jackson比较两个JSON对象
我们将使用ObjectMapper类来读取作为JsonNode的对象。

让我们创建一个ObjectMapper:

```java
ObjectMapper mapper = new ObjectMapper();
```

### 3.1. 比较两个简单的JSON对象

让我们从使用JsonNode.equals方法开始。equals()方法执行一个完整的(深度的)比较。

假设我们有一个JSON字符串定义为s1变量:

```json
{
    "employee":
    {
        "id": "1212",
        "fullName": "John Miles",
        "age": 34
    }
}
```
我们要和另一个JSON s2比较
```json
{   
    "employee":
    {
        "id": "1212",
        "age": 34,
        "fullName": "John Miles"
    }
}
```

让我们将输入的JSON读取为JsonNode并进行比较:
```java
assertEquals(mapper.readTree(s1), mapper.readTree(s2));
```

需要注意的是，即使输入JSON变量s1和s2中的属性顺序不相同，equals()方法也会忽略顺序，并将它们视为相等的。

### 3.2. 比较两个嵌套元素的JSON对象
接下来，我们将了解如何比较两个嵌套元素的JSON对象。

让我们从定义为s1变量的JSON开始:
```json
{
    "employee":
    {
        "id": "1212",
        "fullName":"John Miles",
        "age": 34,
        "contact":
        {
            "email": "john@xyz.com",
            "phone": "9999999999"
        }
    }
}
```

我们可以看到，JSON包含一个嵌套的元素contact。我们想将它与s2定义的另一个JSON进行比较:

```json
{
    "employee":
    {
        "id": "1212",
        "age": 34,
        "fullName": "John Miles",
        "contact":
        {
            "email": "john@xyz.com",
            "phone": "9999999999"
        }
    }
}
```

让我们将输入的JSON读取为JsonNode并进行比较:
```java
assertEquals(mapper.readTree(s1), mapper.readTree(s2));
```

同样，我们应该注意到equals()还可以比较具有嵌套元素的两个输入JSON对象。

### 3.3. 比较包含列表元素的两个JSON对象

类似地，我们还可以比较包含list元素的两个JSON对象。

让我们考虑这个JSON定义为s1:
```json
{
    "employee":
    {
        "id": "1212",
        "fullName": "John Miles",
        "age": 34,
        "skills": ["Java", "C++", "Python"]
    }
}
```

我们将它与另一个JSON s2进行比较:
```json
{
    "employee":
    {
        "id": "1212",
        "age": 34,
        "fullName": "John Miles",
        "skills": ["Java", "C++", "Python"]
    }
}
```
让我们将输入的JSON读取为JsonNode并进行比较:
```java
assertEquals(mapper.readTree(s1), mapper.readTree(s2));
```

重要的是要知道，只有当两个列表元素具有完全相同的顺序的相同值时，才会将它们作为相等进行比较。

## 4. 使用自定义比较器比较两个JSON对象

JsonNode.equals在大多数情况下都很好用。Jackson还提供了JsonNode.equals(comparator, JsonNode)来配置定制的Java比较器对象。让我们了解如何使用自定义比较器。

### 4.1. 自定义比较器来比较数值
让我们了解如何使用自定义比较器来比较两个具有数值的JSON元素。

我们将使用这个JSON作为输入s1:
```json
{
    "name": "John",
    "score": 5.0
}
```

让我们比较另一个定义为s2的JSON:
```json
{
    "name": "John",
    "score": 5
}
```

我们需要注意，输入s1和s2中的属性分数值是不一样的。

让我们将输入的JSON读取为JsonNode并进行比较:
```java
JsonNode actualObj1 = mapper.readTree(s1);
JsonNode actualObj2 = mapper.readTree(s2);

assertNotEquals(actualObj1, actualObj2);
```

我们可以注意到，这两个对象是不相等的。standard equals()方法认为值5.0和5是不同的。

但是，我们可以使用自定义的比较器来比较值5和5.0，并将它们同等对待。

让我们首先创建一个比较器来比较两个NumericNode对象:
```java
public class NumericNodeComparator implements Comparator<JsonNode>
{
    @Override
    public int compare(JsonNode o1, JsonNode o2)
    {
        if (o1.equals(o2)){
           return 0;
        }
        if ((o1 instanceof NumericNode) && (o2 instanceof NumericNode)){
            Double d1 = ((NumericNode) o1).asDouble();
            Double d2 = ((NumericNode) o2).asDouble();
            if (d1.compareTo(d2) == 0) {
               return 0;
            }
        }
        return 1;
    }
}
```
接下来，让我们看看如何使用这个比较器:
```java
NumericNodeComparator cmp = new NumericNodeComparator();
assertTrue(actualObj1.equals(cmp, actualObj2));
```

### 4.2. 自定义比较器来比较文本值

让我们看另一个自定义比较器的示例，用于对两个JSON值进行不区分大小写的比较。

我们将使用这个JSON作为输入s1:
```json
{
    "name": "john",
    "score": 5
}
```
让我们比较另一个定义为s2的JSON:
```json
{
    "name": "JOHN",
    "score": 5
}
```
正如我们看到的那样，属性名在输入s1中是小写的，在s2中是大写的。

让我们首先创建一个比较器来比较两个TextNode对象:
```java
public class TextNodeComparator implements Comparator<JsonNode>
{
    @Override
    public int compare(JsonNode o1, JsonNode o2) {
        if (o1.equals(o2)) {
            return 0;
        }
        if ((o1 instanceof TextNode) && (o2 instanceof TextNode)) {
            String s1 = ((TextNode) o1).asText();
            String s2 = ((TextNode) o2).asText();
            if (s1.equalsIgnoreCase(s2)) {
                return 0;
            }
        }
        return 1;
    }
}
```
让我们看看如何比较s1和s2使用TextNodeComparator:
```java
JsonNode actualObj1 = mapper.readTree(s1);
JsonNode actualObj2 = mapper.readTree(s2);

TextNodeComparator cmp = new TextNodeComparator();

assertNotEquals(actualObj1, actualObj2);
assertTrue(actualObj1.equals(cmp, actualObj2));

```

最后，我们可以看到，在比较两个JSON对象时，使用自定义的comparator对象非常有用，因为输入的JSON元素值并不完全相同，但我们仍然希望将它们同等对待。

## 5. 总结
在这个快速教程中，我们了解了如何使用Jackson来比较两个JSON对象以及如何使用自定义比较器。
