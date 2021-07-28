---
title: Jackson注解示例
date: 2020-08-10 18:27:00
tags:
    - Java
categories:
    - 后端
excerpt: 在本文中，我们将深入研究Jackson注解。我们将看到如何使用现有的注释，如何创建自定义的注释，最后—如何禁用它们。
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
---

## 1. 概述
在本文中，我们将深入研究Jackson注解。<br />我们将看到如何使用现有的注释，如何创建自定义的注释，最后—如何禁用它们。

## 2. Jackson序列化注解
首先，我们将查看序列化注释。

### 2.1. @JsonAnyGetter
@JsonAnyGetter注释允许灵活地使用映射字段作为标准属性。<br />下面是一个快速的例子——ExtendableBean实体拥有name属性和一组可扩展属性，它们以键/值对的形式存在:

```java
public class ExtendableBean {
    public String name;
    private Map<String, String> properties;

    @JsonAnyGetter
    public Map<String, String> getProperties() {
        return properties;
    }
}
```

当我们序列化这个实体的一个实例时，我们会得到Map中所有的键值作为标准的普通属性:

```json
{
    "name":"My bean",
    "attr2":"val2",
    "attr1":"val1"
}
```

这里是如何序列化这个实体看起来像在实践:

```java
@Test
public void whenSerializingUsingJsonAnyGetter_thenCorrect()
  throws JsonProcessingException {

    ExtendableBean bean = new ExtendableBean("My bean");
    bean.add("attr1", "val1");
    bean.add("attr2", "val2");

    String result = new ObjectMapper().writeValueAsString(bean);

    assertThat(result, containsString("attr1"));
    assertThat(result, containsString("val1"));
}
```

我们还可以使用可选参数enabled为false来禁用@JsonAnyGetter()。在本例中，映射将被转换为JSON，并在序列化之后出现在properties变量下。

### 2.2. @JsonGetter
@JsonGetter注释是@JsonProperty注释的替代品，它将方法标记为getter方法。<br />在下面的例子中-我们指定getTheName()方法作为MyBean实体的name属性的getter方法:

```java
public class MyBean {
    public int id;
    private String name;

    @JsonGetter("name")
    public String getTheName() {
        return name;
    }
}
```

这是如何在实践中运作的:

```java
@Test
public void whenSerializingUsingJsonGetter_thenCorrect()
  throws JsonProcessingException {

    MyBean bean = new MyBean(1, "My bean");

    String result = new ObjectMapper().writeValueAsString(bean);

    assertThat(result, containsString("My bean"));
    assertThat(result, containsString("1"));
}
```

### 2.3. @JsonPropertyOrder
我们可以使用@JsonPropertyOrder注释来指定序列化时属性的顺序。<br />让我们为MyBean实体的属性设置一个自定义顺序:

```java
@JsonPropertyOrder({ "name", "id" })
public class MyBean {
    public int id;
    public String name;
}
```

这是序列化的输出:

```java
{
    "name":"My bean",
    "id":1
}
```

还有一个简单的测试:

```java
@Test
public void whenSerializingUsingJsonPropertyOrder_thenCorrect()
  throws JsonProcessingException {

    MyBean bean = new MyBean(1, "My bean");

    String result = new ObjectMapper().writeValueAsString(bean);
    assertThat(result, containsString("My bean"));
    assertThat(result, containsString("1"));
}
```

我们还可以使用@JsonPropertyOrder(alphabetic=true)按字母顺序排列属性。在这种情况下，序列化的输出将是:

```java
{
    "id":1,
    "name":"My bean"
}
```

### 2.4. @JsonRawValue
@JsonRawValue注释可以指示Jackson按原样序列化属性。<br />在下面的例子中，我们使用@JsonRawValue嵌入一些定制的JSON作为一个实体的值:

```java
public class RawBean {
    public String name;

    @JsonRawValue
    public String json;
}
```

序列化实体的输出为:

```java
{
    "name":"My bean",
    "json":{
        "attr":false
    }
}

```

还有一个简单的测试:

```java
@Test
public void whenSerializingUsingJsonRawValue_thenCorrect()
  throws JsonProcessingException {

    RawBean bean = new RawBean("My bean", "{\"attr\":false}");

    String result = new ObjectMapper().writeValueAsString(bean);
    assertThat(result, containsString("My bean"));
    assertThat(result, containsString("{\"attr\":false}"));
}
```
我们还可以使用可选的布尔参数值来定义这个注释是否是活动的。

### 2.5. @JsonValue
@JsonValue表示库将使用一个方法来序列化整个实例。<br />例如，在枚举中，我们用@JsonValue注释getName，这样任何这样的实体都可以通过其名称序列化:

```java
public enum TypeEnumWithValue {
    TYPE1(1, "Type A"), TYPE2(2, "Type 2");

    private Integer id;
    private String name;

    // standard constructors

    @JsonValue
    public String getName() {
        return name;
    }
}
```

我们的测试:

```java
@Test
public void whenSerializingUsingJsonValue_thenCorrect()
  throws JsonParseException, IOException {

    String enumAsString = new ObjectMapper()
      .writeValueAsString(TypeEnumWithValue.TYPE1);

    assertThat(enumAsString, is(""Type A""));
}
```

### 2.6. @JsonRootName
如果启用了包装，则使用@JsonRootName注释来指定要使用的根包装器的名称。<br />包装意味着不将用户序列化为以下内容:<br />它会像这样包装:

```Json
{
    "User": {
        "id": 1,
        "name": "John"
    }
}
```

那么，让我们来看一个例子——我们将使用@JsonRootName注释来表示这个潜在的包装实体的名称:

```java
@JsonRootName(value = "user")
public class UserWithRoot {
    public int id;
    public String name;
}
```

默认情况下，包装器的名称将是类的名称- UserWithRoot。通过使用注释，我们得到了看起来更干净的用户:

```Java
@Test
public void whenSerializingUsingJsonRootName_thenCorrect()
  throws JsonProcessingException {

    UserWithRoot user = new User(1, "John");

    ObjectMapper mapper = new ObjectMapper();
    mapper.enable(SerializationFeature.WRAP_ROOT_VALUE);
    String result = mapper.writeValueAsString(user);

    assertThat(result, containsString("John"));
    assertThat(result, containsString("user"));
}
```

这是序列化的输出:

```Json
{
    "user":{
        "id":1,
        "name":"John"
    }
}
```

自Jackson 2.4以来，一个新的可选参数名称空间可用于XML等数据格式。如果我们添加它，它将成为完全限定名的一部分:

```java
@JsonRootName(value = "user", namespace="users")
public class UserWithRootNamespace {
    public int id;
    public String name;

    // ...
}
```

如果我们用XmlMapper序列化它，输出将是:

```xml
<user xmlns="users">
    <id xmlns="">1</id>
    <name xmlns="">John</name>
    <items xmlns=""/>
</user>
```

### 2.7. @JsonSerialize
让我们看一个简单的例子。我们将使用@JsonSerialize用CustomDateSerializer来序列化eventDate属性:

```java
public class EventWithSerializer {
    public String name;

    @JsonSerialize(using = CustomDateSerializer.class)
    public Date eventDate;
}
```

下面是简单的自定义Jackson序列化器:

```java
public class CustomDateSerializer extends StdSerializer<Date> {

    private static SimpleDateFormat formatter
      = new SimpleDateFormat("dd-MM-yyyy hh:mm:ss");

    public CustomDateSerializer() {
        this(null);
    }

    public CustomDateSerializer(Class<Date> t) {
        super(t);
    }

    @Override
    public void serialize(
      Date value, JsonGenerator gen, SerializerProvider arg2)
      throws IOException, JsonProcessingException {
        gen.writeString(formatter.format(value));
    }
}
```

让我们在测试中使用这些:

```java
@Test
public void whenSerializingUsingJsonSerialize_thenCorrect()
  throws JsonProcessingException, ParseException {

    SimpleDateFormat df
      = new SimpleDateFormat("dd-MM-yyyy hh:mm:ss");

    String toParse = "20-12-2014 02:30:00";
    Date date = df.parse(toParse);
    EventWithSerializer event = new EventWithSerializer("party", date);

    String result = new ObjectMapper().writeValueAsString(event);
    assertThat(result, containsString(toParse));
}
```

## Jackson反序列化注解
接下来——让我们研究Jackson反序列化注解。

### 3.1. @JsonCreator
我们可以使用@JsonCreator注释来调优反序列化中使用的构造器/工厂。<br />当我们需要反序列化一些与我们需要获取的目标实体不完全匹配的JSON时，它非常有用。<br />我们来看一个例子;说我们需要反序列化以下JSON:

```Json
{
    "id":1,
    "theName":"My bean"
}
```

但是，在我们的目标实体中没有theName字段—只有name字段。现在，我们不想改变实体本身—我们只需要对数据编出过程进行更多的控制—通过使用@JsonCreator和@JsonProperty注释来注释构造函数:

```java
public class BeanWithCreator {
    public int id;
    public String name;

    @JsonCreator
    public BeanWithCreator(
      @JsonProperty("id") int id,
      @JsonProperty("theName") String name) {
        this.id = id;
        this.name = name;
    }
}
```

让我们来看看这是怎么回事:

```java
@Test
public void whenDeserializingUsingJsonCreator_thenCorrect()
  throws IOException {

    String json = "{\"id\":1,\"theName\":\"My bean\"}";

    BeanWithCreator bean = new ObjectMapper()
      .readerFor(BeanWithCreator.class)
      .readValue(json);
    assertEquals("My bean", bean.name);
}
```

### 3.2. @JacksonInject
@JacksonInject表示属性将从注入中获得其值，而不是从JSON数据中。<br />在下面的例子中，我们使用@JacksonInject注入属性id:

```java
public class BeanWithInject {
    @JacksonInject
    public int id;

    public String name;
}
```

它是这样工作的:

```java
@Test
public void whenDeserializingUsingJsonInject_thenCorrect()
  throws IOException {

    String json = "{\"name\":\"My bean\"}";

    InjectableValues inject = new InjectableValues.Std()
      .addValue(int.class, 1);
    BeanWithInject bean = new ObjectMapper().reader(inject)
      .forType(BeanWithInject.class)
      .readValue(json);

    assertEquals("My bean", bean.name);
    assertEquals(1, bean.id);
}
```

### 3.3. @JsonAnySetter
@JsonAnySetter允许我们灵活地使用映射作为标准属性。在反序列化时，JSON的属性将被添加到映射中。

让我们看看这是如何工作的-我们将使用@JsonAnySetter来反序列化实体ExtendableBean:

```java
public class ExtendableBean {
    public String name;
    private Map<String, String> properties;

    @JsonAnySetter
    public void add(String key, String value) {
        properties.put(key, value);
    }
}
```

这是我们需要反序列化的JSON:

```Json
{
    "name":"My bean",
    "attr2":"val2",
    "attr1":"val1"
}
```
而这一切是如何联系在一起的:

```java
@Test
public void whenDeserializingUsingJsonAnySetter_thenCorrect()
  throws IOException {
    String json
      = "{\"name\":\"My bean\",\"attr2\":\"val2\",\"attr1\":\"val1\"}";

    ExtendableBean bean = new ObjectMapper()
      .readerFor(ExtendableBean.class)
      .readValue(json);

    assertEquals("My bean", bean.name);
    assertEquals("val2", bean.getProperties().get("attr2"));
}
```

### 3.4. @JsonSetter
@JsonSetter是@JsonProperty的替代方法—它将方法标记为setter方法。

当我们需要读取一些JSON数据，但目标实体类与该数据不完全匹配时，这非常有用，因此我们需要调优流程以使其适合该数据。

在下面的例子中，我们将指定方法setTheName()作为MyBean实体中name属性的setter:


```java
public class MyBean {
    public int id;
    private String name;

    @JsonSetter("name")
    public void setTheName(String name) {
        this.name = name;
    }
}
```

现在，当我们需要unmarshall一些JSON数据-这是完美的工作:

```java
@Test
public void whenDeserializingUsingJsonSetter_thenCorrect()
  throws IOException {

    String json = "{\"id\":1,\"name\":\"My bean\"}";

    MyBean bean = new ObjectMapper()
      .readerFor(MyBean.class)
      .readValue(json);
    assertEquals("My bean", bean.getTheName());
}
```

### 3.5. @JsonDeserialize
@JsonDeserialize表示使用自定义反序列化器。

让我们看看这是如何实现的-我们将使用@JsonDeserialize来反序列化eventDate属性与CustomDateDeserializer:

```java
public class EventWithSerializer {
    public String name;

    @JsonDeserialize(using = CustomDateDeserializer.class)
    public Date eventDate;
}
```

这是自定义反序列化器:

```java
public class CustomDateDeserializer
  extends StdDeserializer<Date> {

    private static SimpleDateFormat formatter
      = new SimpleDateFormat("dd-MM-yyyy hh:mm:ss");

    public CustomDateDeserializer() {
        this(null);
    }

    public CustomDateDeserializer(Class<?> vc) {
        super(vc);
    }

    @Override
    public Date deserialize(
      JsonParser jsonparser, DeserializationContext context)
      throws IOException {

        String date = jsonparser.getText();
        try {
            return formatter.parse(date);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }
}
```

这是背靠背的测试:

```java
@Test
public void whenDeserializingUsingJsonDeserialize_thenCorrect()
  throws IOException {

    String json
      = "{"name":"party","eventDate":"20-12-2014 02:30:00"}";

    SimpleDateFormat df
      = new SimpleDateFormat("dd-MM-yyyy hh:mm:ss");
    EventWithSerializer event = new ObjectMapper()
      .readerFor(EventWithSerializer.class)
      .readValue(json);

    assertEquals(
      "20-12-2014 02:30:00", df.format(event.eventDate));
}
```

### 3.6 @JsonAlias
@JsonAlias在反序列化期间为属性定义一个或多个替代名称。<br />让我们通过一个简单的例子来看看这个注释是如何工作的:

```java
public class AliasBean {
    @JsonAlias({ "fName", "f_name" })
    private String firstName;   
    private String lastName;
}
```

在这里，我们有一个POJO，我们想用fName、f_name和firstName等值反序列化JSON到POJO的firstName变量中。<br />这里有一个测试，确保这个注释像expecte一样工作:

```java
@Test
public void whenDeserializingUsingJsonAlias_thenCorrect() throws IOException {
    String json = "{\"fName\": \"John\", \"lastName\": \"Green\"}";
    AliasBean aliasBean = new ObjectMapper().readerFor(AliasBean.class).readValue(json);
    assertEquals("John", aliasBean.getFirstName());
}
```

## 4. Jackson属性包含注释

### 4.1. @JsonIgnoreProperties
@JsonIgnoreProperties是一个类级注释，它标记Jackson将忽略的一个属性或一列属性。<br />让我们来看一个忽略属性id的例子:

```java
@JsonIgnoreProperties({ "id" })
public class BeanWithIgnore {
    public int id;
    public String name;
}
```

下面是确保忽略发生的测试:

```java
@Test
public void whenSerializingUsingJsonIgnoreProperties_thenCorrect()
  throws JsonProcessingException {

    BeanWithIgnore bean = new BeanWithIgnore(1, "My bean");

    String result = new ObjectMapper()
      .writeValueAsString(bean);

    assertThat(result, containsString("My bean"));
    assertThat(result, not(containsString("id")));
}
```

为了毫无例外地忽略JSON输入中的任何未知属性，我们可以对@JsonIgnoreProperties注释设置ignoreUnknown=true。

### 4.2. @JsonIgnore
@JsonIgnore注释用于在字段级别标记要忽略的属性。

让我们使用@JsonIgnore来忽略序列化中的属性id:

```java
public class BeanWithIgnore {
    @JsonIgnore
    public int id;

    public String name;
}
```

确保id被成功忽略的测试:

```java
@Test
public void whenSerializingUsingJsonIgnore_thenCorrect()
  throws JsonProcessingException {

    BeanWithIgnore bean = new BeanWithIgnore(1, "My bean");

    String result = new ObjectMapper()
      .writeValueAsString(bean);

    assertThat(result, containsString("My bean"));
    assertThat(result, not(containsString("id")));
}
```

### **4.3. _@JsonIgnoreType_**
@JsonIgnoreType将注释类型的所有属性标记为忽略。<br />让我们使用注释来标记所有类型名称的属性被忽略:
```java
public class User {
    public int id;
    public Name name;

    @JsonIgnoreType
    public static class Name {
        public String firstName;
        public String lastName;
    }
}
```

这里有一个简单的测试，确保忽略工作正确:

```java
@Test
public void whenSerializingUsingJsonIgnoreType_thenCorrect()
  throws JsonProcessingException, ParseException {

    User.Name name = new User.Name("John", "Doe");
    User user = new User(1, name);

    String result = new ObjectMapper()
      .writeValueAsString(user);

    assertThat(result, containsString("1"));
    assertThat(result, not(containsString("name")));
    assertThat(result, not(containsString("John")));
}
```

### **4.4. _@JsonInclude_**
我们可以使用@JsonInclude来排除具有空/空/默认值的属性。<br />让我们看一个例子-排除null从序列化:
```java
@JsonInclude(Include.NON_NULL)
public class MyBean {
    public int id;
    public String name;
}
```
下面是完整的测试:
```java
public void whenSerializingUsingJsonInclude_thenCorrect()
  throws JsonProcessingException {

    MyBean bean = new MyBean(1, null);

    String result = new ObjectMapper()
      .writeValueAsString(bean);

    assertThat(result, containsString("1"));
    assertThat(result, not(containsString("name")));
}
```

### **4.5. _@JsonAutoDetect_**
@JsonAutoDetect可以覆盖哪些属性可见，哪些不可见的默认语义。<br />让我们通过一个简单的例子来看看这个注释是如何非常有用的——让我们启用序列化私有属性:
```java
@JsonAutoDetect(fieldVisibility = Visibility.ANY)
public class PrivateBean {
    private int id;
    private String name;
}
```
测试：
```java
@Test
public void whenSerializingUsingJsonAutoDetect_thenCorrect()
  throws JsonProcessingException {

    PrivateBean bean = new PrivateBean(1, "My bean");

    String result = new ObjectMapper()
      .writeValueAsString(bean);

    assertThat(result, containsString("1"));
    assertThat(result, containsString("My bean"));
}
```
<a name="JkWhc"></a>
## 5. Jackson多态类型处理注释
接下来，让我们看看Jackson多态类型处理注释:

- @JsonTypeInfo——指示要在序列化中包含什么类型信息的详细信息
- @JsonSubTypes——指示注释类型的子类型
- @JsonTypeName—定义了一个用于注释类的逻辑类型名

让我们看一个更复杂的例子，使用所有这三个——@JsonTypeInfo， @JsonSubTypes，和@JsonTypeName——来序列化/反序列化实体Zoo:
```java
public class Zoo {
    public Animal animal;

    @JsonTypeInfo(
      use = JsonTypeInfo.Id.NAME,
      include = As.PROPERTY,
      property = "type")
    @JsonSubTypes({
        @JsonSubTypes.Type(value = Dog.class, name = "dog"),
        @JsonSubTypes.Type(value = Cat.class, name = "cat")
    })
    public static class Animal {
        public String name;
    }

    @JsonTypeName("dog")
    public static class Dog extends Animal {
        public double barkVolume;
    }

    @JsonTypeName("cat")
    public static class Cat extends Animal {
        boolean likesCream;
        public int lives;
    }
}
```
当我们进行序列化时:
```java
@Test
public void whenSerializingPolymorphic_thenCorrect()
  throws JsonProcessingException {
    Zoo.Dog dog = new Zoo.Dog("lacy");
    Zoo zoo = new Zoo(dog);

    String result = new ObjectMapper()
      .writeValueAsString(zoo);

    assertThat(result, containsString("type"));
    assertThat(result, containsString("dog"));
}
```
下面是将动物园实例与狗序列化将得到的结果:
```java
{
    "animal": {
        "type": "dog",
        "name": "lacy",
        "barkVolume": 0
    }
}
```
现在反序列化-让我们从以下JSON输入开始:
```java
{
    "animal":{
        "name":"lacy",
        "type":"cat"
    }
}
```
让我们看看它是如何被分解到一个动物园实例的:
```java
@Test
public void whenDeserializingPolymorphic_thenCorrect()
throws IOException {
    String json = "{\"animal\":{\"name\":\"lacy\",\"type\":\"cat\"}}";

    Zoo zoo = new ObjectMapper()
      .readerFor(Zoo.class)
      .readValue(json);

    assertEquals("lacy", zoo.animal.name);
    assertEquals(Zoo.Cat.class, zoo.animal.getClass());
}
```
<a name="EPNDX"></a>
## **6. Jackson通用注解**
接下来——让我们讨论Jackson的一些更通用的注释。
<a name="yZcQ1"></a>
### **6.1. _@JsonProperty_**
我们可以添加@JsonProperty注释来表示JSON中的属性名。<br />当我们处理非标准的getter和setter时，让我们使用@JsonProperty来序列化/反序列化属性名:
```java
public class MyBean {
    public int id;
    private String name;

    @JsonProperty("name")
    public void setTheName(String name) {
        this.name = name;
    }

    @JsonProperty("name")
    public String getTheName() {
        return name;
    }
}
```
我们的测试:
```java
@Test
public void whenUsingJsonProperty_thenCorrect()
  throws IOException {
    MyBean bean = new MyBean(1, "My bean");

    String result = new ObjectMapper().writeValueAsString(bean);

    assertThat(result, containsString("My bean"));
    assertThat(result, containsString("1"));

    MyBean resultBean = new ObjectMapper()
      .readerFor(MyBean.class)
      .readValue(result);
    assertEquals("My bean", resultBean.getTheName());
}
```
<a name="RbKDb"></a>
### **6.2. _@JsonFormat_**
@JsonFormat注释在序列化日期/时间值时指定一种格式。<br />在下面的例子中，我们使用@JsonFormat来控制属性eventDate的格式:
```java
public class EventWithFormat {
    public String name;

    @JsonFormat(
      shape = JsonFormat.Shape.STRING,
      pattern = "dd-MM-yyyy hh:mm:ss")
    public Date eventDate;
}
```
下面是测试:
```java
@Test
public void whenSerializingUsingJsonFormat_thenCorrect()
  throws JsonProcessingException, ParseException {
    SimpleDateFormat df = new SimpleDateFormat("dd-MM-yyyy hh:mm:ss");
    df.setTimeZone(TimeZone.getTimeZone("UTC"));

    String toParse = "20-12-2014 02:30:00";
    Date date = df.parse(toParse);
    EventWithFormat event = new EventWithFormat("party", date);

    String result = new ObjectMapper().writeValueAsString(event);

    assertThat(result, containsString(toParse));
}
```
<a name="gTZ8U"></a>
### **6.3. _@JsonUnwrapped_**
@JsonUnwrapped定义了在序列化/反序列化时应该被解包装/扁平化的值。<br />我们来看看它是如何工作的;我们将使用注释来展开属性名:
```java
public class UnwrappedUser {
    public int id;

    @JsonUnwrapped
    public Name name;

    public static class Name {
        public String firstName;
        public String lastName;
    }
}
```
现在让我们序列化这个类的一个实例:
```java
@Test
public void whenSerializingUsingJsonUnwrapped_thenCorrect()
  throws JsonProcessingException, ParseException {
    UnwrappedUser.Name name = new UnwrappedUser.Name("John", "Doe");
    UnwrappedUser user = new UnwrappedUser(1, name);

    String result = new ObjectMapper().writeValueAsString(user);

    assertThat(result, containsString("John"));
    assertThat(result, not(containsString("name")));
}
```
下面是输出的样子-静态嵌套类的字段与其他字段一起展开:
```java
{
    "id":1,
    "firstName":"John",
    "lastName":"Doe"
}
```
<a name="NqUJn"></a>
### **6.4. _@JsonView_**
@JsonView表示将包含该属性进行序列化/反序列化的视图。<br />我们将使用@JsonView来序列化项目实体的实例。<br />让我们从视图开始:
```java
public class Views {
    public static class Public {}
    public static class Internal extends Public {}
}
```
现在这是Item实体，使用视图:
```java
public class Item {
    @JsonView(Views.Public.class)
    public int id;

    @JsonView(Views.Public.class)
    public String itemName;

    @JsonView(Views.Internal.class)
    public String ownerName;
}
```
最后-完整测试:
```java
@Test
public void whenSerializingUsingJsonView_thenCorrect()
  throws JsonProcessingException {
    Item item = new Item(2, "book", "John");

    String result = new ObjectMapper()
      .writerWithView(Views.Public.class)
      .writeValueAsString(item);

    assertThat(result, containsString("book"));
    assertThat(result, containsString("2"));
    assertThat(result, not(containsString("John")));
}
```
<a name="SWLxT"></a>
### **6.5. _@JsonManagedReference, @JsonBackReference_**
@JsonManagedReference和@JsonBackReference注释可以处理父/子关系并在循环中工作。<br />在下面的例子中-我们使用@JsonManagedReference和@JsonBackReference来序列化我们的ItemWithRef实体:
```java
public class ItemWithRef {
    public int id;
    public String itemName;

    @JsonManagedReference
    public UserWithRef owner;
}

```
我们的UserWithRef实体:
```java
public class UserWithRef {
    public int id;
    public String name;

    @JsonBackReference
    public List<ItemWithRef> userItems;
}
```
测试:
```java
@Test
public void whenSerializingUsingJacksonReferenceAnnotation_thenCorrect()
  throws JsonProcessingException {
    UserWithRef user = new UserWithRef(1, "John");
    ItemWithRef item = new ItemWithRef(2, "book", user);
    user.addItem(item);

    String result = new ObjectMapper().writeValueAsString(item);

    assertThat(result, containsString("book"));
    assertThat(result, containsString("John"));
    assertThat(result, not(containsString("userItems")));
}
```
<a name="N9f5i"></a>
### **6.6. _@JsonIdentityInfo_**
@JsonIdentityInfo表示在序列化/反序列化值时应该使用对象标识—例如，用于处理无限递归类型的问题。<br />在下面的例子中-我们有一个ItemWithIdentity实体，它与UserWithIdentity实体具有双向关系:
```java
@JsonIdentityInfo(
  generator = ObjectIdGenerators.PropertyGenerator.class,
  property = "id")
public class ItemWithIdentity {
    public int id;
    public String itemName;
    public UserWithIdentity owner;
}
```
和UserWithIdentity实体:
```java
@JsonIdentityInfo(
  generator = ObjectIdGenerators.PropertyGenerator.class,
  property = "id")
public class UserWithIdentity {
    public int id;
    public String name;
    public List<ItemWithIdentity> userItems;
}
```
现在，让我们看看无限递归问题是如何处理的:
```java
@Test
public void whenSerializingUsingJsonIdentityInfo_thenCorrect()
  throws JsonProcessingException {
    UserWithIdentity user = new UserWithIdentity(1, "John");
    ItemWithIdentity item = new ItemWithIdentity(2, "book", user);
    user.addItem(item);

    String result = new ObjectMapper().writeValueAsString(item);

    assertThat(result, containsString("book"));
    assertThat(result, containsString("John"));
    assertThat(result, containsString("userItems"));
}
```
下面是序列化的项目和用户的完整输出:
```java
{
    "id": 2,
    "itemName": "book",
    "owner": {
        "id": 1,
        "name": "John",
        "userItems": [
            2
        ]
    }
}
```
<a name="ASuNM"></a>
### **6.7. _@JsonFilter_**
@JsonFilter注释指定要在序列化期间使用的过滤器。<br />让我们看一个例子;首先，我们定义实体，并指向过滤器:
```java
@JsonFilter("myFilter")
public class BeanWithFilter {
    public int id;
    public String name;
}
```
现在，在完整的测试中，我们定义了过滤器——它排除了序列化中除了name之外的所有其他属性:
```java
@Test
public void whenSerializingUsingJsonFilter_thenCorrect()
  throws JsonProcessingException {
    BeanWithFilter bean = new BeanWithFilter(1, "My bean");

    FilterProvider filters
      = new SimpleFilterProvider().addFilter(
        "myFilter",
        SimpleBeanPropertyFilter.filterOutAllExcept("name"));

    String result = new ObjectMapper()
      .writer(filters)
      .writeValueAsString(bean);

    assertThat(result, containsString("My bean"));
    assertThat(result, not(containsString("id")));
}
```
<a name="ike8t"></a>
## 7. Jackson自定义注释
接下来，让我们看看如何创建自定义Jackson注释。我们可以使用@JacksonAnnotationsInside注释:
```java
@Retention(RetentionPolicy.RUNTIME)
    @JacksonAnnotationsInside
    @JsonInclude(Include.NON_NULL)
    @JsonPropertyOrder({ "name", "id", "dateCreated" })
    public @interface CustomAnnotation {}
```
现在，如果我们对一个实体使用新的注释:
```java
@CustomAnnotation
public class BeanWithCustomAnnotation {
    public int id;
    public String name;
    public Date dateCreated;
}
```
我们可以看到它是如何将现有的注解组合成一个更简单的、自定义的注解，我们可以使用它作为速记:
```java
@Test
public void whenSerializingUsingCustomAnnotation_thenCorrect()
  throws JsonProcessingException {
    BeanWithCustomAnnotation bean
      = new BeanWithCustomAnnotation(1, "My bean", null);

    String result = new ObjectMapper().writeValueAsString(bean);

    assertThat(result, containsString("My bean"));
    assertThat(result, containsString("1"));
    assertThat(result, not(containsString("dateCreated")));
}
```
序列化过程的输出:
```java
{
    "name":"My bean",
    "id":1
}
```
<a name="Uto7K"></a>
## **8. Jackson MixIn 注解**
接下来——让我们看看如何使用Jackson MixIn注释。<br />让我们使用MixIn注释——例如——忽略类型User的属性:
```java
public class Item {
    public int id;
    public String itemName;
    public User owner;
}

@JsonIgnoreType
public class MyMixInForIgnoreType {}
```
让我们来看看这是怎么回事:
```java
@Test
public void whenSerializingUsingMixInAnnotation_thenCorrect()
  throws JsonProcessingException {
    Item item = new Item(1, "book", null);

    String result = new ObjectMapper().writeValueAsString(item);
    assertThat(result, containsString("owner"));

    ObjectMapper mapper = new ObjectMapper();
    mapper.addMixIn(User.class, MyMixInForIgnoreType.class);

    result = mapper.writeValueAsString(item);
    assertThat(result, not(containsString("owner")));
}
```
<a name="mqKJV"></a>
## 9. 禁用Jackson注解
最后，让我们看看如何禁用所有Jackson注释。我们可以通过禁用MapperFeature来做到这一点。如下例所示:
```java
@JsonInclude(Include.NON_NULL)
@JsonPropertyOrder({ "name", "id" })
public class MyBean {
    public int id;
    public String name;
}
```
现在，禁用注释后，这些应该没有效果，库的默认值应该适用:
```java
@Test
public void whenDisablingAllAnnotations_thenAllDisabled()
  throws IOException {
    MyBean bean = new MyBean(1, null);

    ObjectMapper mapper = new ObjectMapper();
    mapper.disable(MapperFeature.USE_ANNOTATIONS);
    String result = mapper.writeValueAsString(bean);

    assertThat(result, containsString("1"));
    assertThat(result, containsString("name"));
```
禁用注释之前序列化的结果:
```java
{"id":1}
```
禁用注释后序列化的结果:
```java
{
    "id":1,
    "name":null
}
```
<a name="PmJqL"></a>
## 10. 结论
本教程对Jackson注释进行了深入的研究，只触及了正确使用它们所能获得的灵活性的表面。
