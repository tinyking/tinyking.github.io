---
title: win10下手动编译Spring
date: 2018-10-12 09:06:30
tags:
    - Spring
categories:
    - 后端
index_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
banner_img: https://i.loli.net/2020/08/17/35FZ8rubRnfAKhG.jpg
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
