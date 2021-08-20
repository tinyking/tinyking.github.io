---
title: win10下手动编译Spring
date: 2018-10-12 09:06:30
tags:
    - Spring
categories:
    - 后端
index_img: https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi0.hdslb.com%2Fbfs%2Farticle%2F1f2abd1d67247ad82eda8069cd73c61a189b7ad1.jpg&refer=http%3A%2F%2Fi0.hdslb.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1632028951&t=4969344ee49ff8b1b313b3ceffe1c1d5
---


在windows下执行`gradlew.bat build`发生异常，如下：
![image](http://img.hb.aicdn.com/6257b1a43c17c6eba97c52034c6f398c459788305765-exykoC_fw658)

原因是执行gradle编译时，没有生成`xxx-schema.zip`文件。

通过修改task schemaZip,将文件路径分符由Unix系统的`/`修改为windows系统的`\\`.

```
task schemaZip(type: Zip) {
	group = "Distribution"
	baseName = "spring-framework"
	classifier = "schema"
	description = "Builds -${classifier} archive containing all " +
			"XSDs for deployment at http://springframework.org/schema."
	duplicatesStrategy 'exclude'
	moduleProjects.each { subproject ->
		def Properties schemas = new Properties();

		subproject.sourceSets.main.resources.find {
			it.path.endsWith("META-INF\\spring.schemas")
		}?.withInputStream { schemas.load(it) }

		for (def key : schemas.keySet()) {
			def shortName = key.replaceAll(/http.*schema.(.*).spring-.*/, '$1')
			assert shortName != key
			File xsdFile = subproject.sourceSets.main.resources.find {
				it.path.endsWith(schemas.get(key).replaceAll('\\/', '\\\\'))
			}
			assert xsdFile != null
			into (shortName) {
				from xsdFile.path
			}
		}
	}
}
```

> [参考stackoverflow](https://stackoverflow.com/questions/34916981/build-spring-framework-source-code-encounter-an-error)
